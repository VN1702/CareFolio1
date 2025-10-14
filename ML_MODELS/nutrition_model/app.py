# -----------------------------
# app.py - Meal Planner API
# -----------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# -----------------------------
# Load Models
# -----------------------------
try:
    regressor = joblib.load("artifacts/meal_planner_regression_model.pkl")
    classifier = joblib.load("artifacts/meal_planner_classification_model.pkl")  # already just the model
except FileNotFoundError as e:
    print(f"Error: Required model file not found. {e}")
    exit()

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
    expected_features = regressor.estimators_[0].get_booster().feature_names
    missing_features = set(expected_features) - set(df_input.columns)
    for f in missing_features:
        df_input[f] = 0
    df_input = df_input[expected_features]
    return df_input

# -----------------------------
# Detailed explanations
# -----------------------------
meal_plan_explanations = {
    'meal_plan_type_Calorie-Deficit High-Protein': (
        "Focuses on reducing calories while maintaining high protein to preserve muscle mass. "
        "Includes lean meats, eggs, legumes, and low-fat dairy. "
        "Ideal for individuals aiming to lose fat while retaining muscle."
    ),
    'meal_plan_type_High-Calorie Protein-Rich': (
        "High-calorie meals rich in protein for weight gain or muscle building. "
        "Includes nuts, dairy, lean meats, eggs, and complex carbs. "
        "Perfect for those who want to increase muscle mass or overall body weight."
    ),
    'meal_plan_type_Low-GI High-Fiber Plan': (
        "Low Glycemic Index and high fiber to control blood sugar levels. "
        "Includes whole grains, vegetables, and legumes. "
        "Suitable for people with diabetes or those seeking slow-releasing energy."
    ),
    'meal_plan_type_Low-GI Low-Sodium Plan': (
        "Diabetic-friendly with controlled sugar and low sodium to support blood pressure management. "
        "Includes fresh vegetables, whole grains, lean protein, minimal processed foods. "
        "Helps maintain stable blood sugar and supports heart health."
    ),
    'meal_plan_type_Low-Sodium High-Potassium Plan': (
        "Reduces sodium and increases potassium for blood pressure regulation. "
        "Includes fruits, vegetables, legumes, and low-sodium protein. "
        "Best for individuals concerned about hypertension."
    )
}

health_tag_explanations = {
    'health_tag_Diabetic & BP-Safe Plan': (
        "Safe for diabetics and individuals with hypertension. "
        "Focus on low sugar, high fiber, low sodium, and heart-healthy nutrients. "
        "Designed to maintain stable blood sugar and optimal blood pressure."
    ),
    'health_tag_Diabetic-Safe Plan': (
        "Safe for diabetics. Emphasizes controlled sugar intake and low-GI foods. "
        "Helps maintain consistent energy levels and avoid sugar spikes."
    ),
    'health_tag_General Plan': (
        "Balanced plan for healthy individuals without specific medical conditions. "
        "Includes a mix of carbohydrates, protein, fats, vitamins, and minerals to support overall wellness. "
        "Suitable for maintaining energy, supporting immunity, and promoting a healthy lifestyle."
    )
}

# -----------------------------
# API Route: /predict
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input provided"}), 400

        X_custom = preprocess_input(data)

        # Regression prediction
        y_reg_pred = regressor.predict(X_custom)[0]
        calories, carbs, protein, fats = y_reg_pred

        # Classification prediction
        y_clf_pred = classifier.predict(X_custom)[0]

        # Map predictions
        meal_plan_cols = list(meal_plan_explanations.keys())
        health_tag_cols = list(health_tag_explanations.keys())

        meal_plan_type = None
        health_tag = None

        # Check meal plan predictions
        for i, col in enumerate(meal_plan_cols):
            if i < len(y_clf_pred) and y_clf_pred[i] == 1:
                meal_plan_type = col
                break

        # Check health tag predictions
        for i, col in enumerate(health_tag_cols):
            idx = len(meal_plan_cols) + i
            if idx < len(y_clf_pred) and y_clf_pred[idx] == 1:
                health_tag = col
                break

        # Fallbacks if no prediction
        if meal_plan_type is None:
            meal_plan_type = "No specific meal plan matched"
            meal_plan_explanation = (
                "We could not match a specialized meal plan. "
                "We recommend a balanced diet with appropriate portions of carbohydrates, proteins, and fats based on your nutrition needs."
            )
        else:
            meal_plan_explanation = meal_plan_explanations.get(meal_plan_type, "")

        if health_tag is None:
            health_tag = "General Recommendation"
            health_tag_explanation = (
                "A general health plan is recommended. "
                "Focus on balanced nutrition, regular physical activity, adequate sleep, and stress management."
            )
        else:
            health_tag_explanation = health_tag_explanations.get(health_tag, "")

        # Return JSON response
        return jsonify({
            "status": "success",
            "predicted_nutrition": {
                "calories": round(calories),
                "carbs_g": round(carbs),
                "protein_g": round(protein),
                "fats_g": round(fats)
            },
            "meal_plan_type": meal_plan_type,
            "meal_plan_explanation": meal_plan_explanation,
            "health_tag": health_tag,
            "health_tag_explanation": health_tag_explanation
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
