# -----------------------------
# app.py - Meal Planner API with Detailed Explanations
# -----------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# -----------------------------
# Load Models
# -----------------------------
try:
    regressor = joblib.load("meal_planner_regression_model.pkl")
    classifier = joblib.load("meal_planner_classification_model.pkl")  # classifier only
except FileNotFoundError as e:
    print(f"Error: Required model file not found. {e}")
    exit()

# -----------------------------
# Detailed Explanations
# -----------------------------
meal_plan_explanations = {
    'meal_plan_type_Calorie-Deficit High-Protein': (
        "This meal plan is designed for individuals aiming to lose weight while preserving muscle mass. "
        "It emphasizes reducing overall calorie intake but keeping protein levels high to support muscle repair and growth. "
        "Typical foods include lean meats like chicken and fish, eggs, legumes, tofu, low-fat dairy, and protein-rich snacks. "
        "It avoids high-calorie processed foods, sugary drinks, and refined carbs. "
        "Benefits include steady fat loss, improved satiety, and maintenance of lean body mass during weight loss."
    ),
    'meal_plan_type_High-Calorie Protein-Rich': (
        "Ideal for individuals looking to gain weight or build muscle. "
        "This plan provides higher calories combined with abundant protein to fuel muscle growth and recovery. "
        "Foods include nuts, seeds, dairy products, lean meats, eggs, whole grains, legumes, and healthy oils. "
        "It focuses on nutrient-dense calorie sources rather than empty calories from junk food. "
        "Benefits include gradual and healthy weight gain, enhanced muscle mass, and improved strength."
    ),
    'meal_plan_type_Low-GI High-Fiber Plan': (
        "Designed for blood sugar control, especially beneficial for pre-diabetic or diabetic individuals. "
        "Emphasizes low Glycemic Index (GI) foods that release glucose slowly into the bloodstream, reducing sugar spikes. "
        "High fiber content from vegetables, fruits, whole grains, legumes, and seeds improves digestion and prolongs satiety. "
        "It avoids refined sugars, white bread, pastries, and sweetened beverages. "
        "Benefits include stable blood sugar levels, reduced insulin spikes, better digestion, and long-term weight management."
    ),
    'meal_plan_type_Low-GI Low-Sodium Plan': (
        "This plan is ideal for individuals managing both diabetes and hypertension. "
        "It combines low Glycemic Index foods with reduced sodium intake to support heart and kidney health. "
        "Recommended foods include fresh vegetables, whole grains, legumes, lean proteins, herbs, and spices for flavor. "
        "Avoid processed foods, high-sodium condiments, packaged snacks, and sugary beverages. "
        "Benefits include controlled blood sugar, reduced blood pressure, lower risk of cardiovascular disease, and better overall metabolic health."
    ),
    'meal_plan_type_Low-Sodium High-Potassium Plan': (
        "Aimed at improving blood pressure and heart health by reducing sodium and increasing potassium intake. "
        "High potassium foods such as bananas, oranges, tomatoes, spinach, beans, and sweet potatoes help balance electrolytes and lower hypertension risk. "
        "The plan also includes lean proteins and whole grains while avoiding processed foods, salted snacks, and high-sodium sauces. "
        "Benefits include improved cardiovascular health, better fluid balance, reduced risk of hypertension complications, and overall wellness."
    )
}

health_tag_explanations = {
    'health_tag_Diabetic & BP-Safe Plan': (
        "Specifically tailored for individuals managing both diabetes and hypertension. "
        "Focuses on controlling blood sugar and blood pressure simultaneously. "
        "Emphasizes low Glycemic Index carbohydrates, high fiber vegetables, lean proteins, heart-healthy fats, and reduced sodium intake. "
        "Avoids sugary foods, processed snacks, fried foods, and excessive salt. "
        "Benefits include stable glucose levels, lower blood pressure, improved heart and kidney function, and overall metabolic health."
    ),
    'health_tag_Diabetic-Safe Plan': (
        "Optimized for individuals with diabetes. "
        "Prioritizes foods that release glucose slowly, helping prevent blood sugar spikes. "
        "Includes whole grains, legumes, vegetables, fruits with low Glycemic Index, lean proteins, and healthy fats. "
        "Avoids refined sugars, sweetened beverages, pastries, and white bread. "
        "Benefits include better glycemic control, sustained energy, weight management, and reduced risk of diabetes-related complications."
    ),
    'health_tag_General Plan': (
        "A balanced plan for healthy individuals without any specific medical conditions. "
        "Includes a mix of carbohydrates, proteins, healthy fats, vitamins, and minerals from a variety of food sources. "
        "Encourages whole grains, fruits, vegetables, lean proteins, and moderate healthy fats while limiting processed foods, sugar, and excessive salt. "
        "Benefits include overall nutritional balance, improved energy, better weight management, and long-term maintenance of health."
    )
}


# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Meal Planner API is running!"

# -----------------------------
# Helper Function to preprocess input
# -----------------------------
def preprocess_input(user_input):
    df_input = pd.DataFrame([user_input])

    # Ensure regression model features are present
    expected_features = regressor.estimators_[0].get_booster().feature_names
    for f in expected_features:
        if f not in df_input.columns:
            df_input[f] = 0  # fill missing features
    df_input = df_input[expected_features]  # reorder
    return df_input

# -----------------------------
# API Route: /predict
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input provided"}), 400

        # Preprocess input
        X_custom = preprocess_input(data)

        # --- Regression Prediction ---
        y_reg_pred = regressor.predict(X_custom)[0]
        calories, carbs, protein, fats = y_reg_pred

        # --- Classification Prediction ---
        y_clf_pred = classifier.predict(X_custom)[0]

        # Map predicted labels to readable Meal Plan & Health Tag
        meal_plan_cols = list(meal_plan_explanations.keys())
        health_tag_cols = list(health_tag_explanations.keys())

        meal_plan_type = None
        health_tag = None
        meal_plan_detail = ""
        health_tag_detail = ""

        for i, col in enumerate(meal_plan_cols):
            if y_clf_pred[i] == 1:
                meal_plan_type = col
                meal_plan_detail = meal_plan_explanations[col]

        for i, col in enumerate(health_tag_cols):
            if y_clf_pred[len(meal_plan_cols)+i] == 1:
                health_tag = col
                health_tag_detail = health_tag_explanations[col]

        # --- Return JSON Response ---
        return jsonify({
            "status": "success",
            "predicted_nutrition": {
                "calories": round(calories),
                "carbs_g": round(carbs),
                "protein_g": round(protein),
                "fats_g": round(fats)
            },
            "meal_plan_type": meal_plan_type,
            "meal_plan_details": meal_plan_detail,
            "health_tag": health_tag,
            "health_tag_details": health_tag_detail
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
