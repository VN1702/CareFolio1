# -----------------------------
# meal_planner_predict.py
# -----------------------------
import pandas as pd
import joblib

# -----------------------------
# Load Models
# -----------------------------
regressor = joblib.load("meal_planner_regression_model.pkl")
classifier = joblib.load("meal_planner_classification_model.pkl")

# -----------------------------
# Custom Input Example
# -----------------------------
# Define user input as a dictionary
user_input = {
    "age": 28,
    "height_cm": 175,
    "weight_kg": 72,
    "meals_per_day": 3,
    "has_diabetes": 1,          # 1=True, 0=False
    "has_hypertension": 0,
    "sugar_level": 100,
    "sleep_hours": 6.5,
    "stress_level": 4,
    "bmr": 1700,
    "tdee": 2300,
    "systolic_bp": 120,        # ✅ add this
    "diastolic_bp": 80,        # ✅ add this
    "gender_male": 1,           # 1=male, 0=female
    "fitness_goal_weight_gain": 0,
    "fitness_goal_weight_loss": 1,
    "activity_level_moderate": 0,
    "activity_level_sedentary": 1,
    "diet_type_non-veg": 1,
    "diet_type_vegan": 0,
    "diet_type_vegetarian": 0,
    "preferred_cuisine_Continental": 0,
    "preferred_cuisine_Indian": 1,
    "preferred_cuisine_Mediterranean": 0
}

# Convert to DataFrame
X_custom = pd.DataFrame([user_input])

# -----------------------------
# Regression Prediction
# -----------------------------
y_reg_pred = regressor.predict(X_custom)
calories, carbs, protein, fats = y_reg_pred[0]
print("\n--- Predicted Nutrition ---")
print(f"Calories: {calories:.0f} kcal")
print(f"Carbs: {carbs:.0f} g")
print(f"Protein: {protein:.0f} g")
print(f"Fats: {fats:.0f} g")

# -----------------------------
# Classification Prediction
# -----------------------------
y_clf_pred = classifier.predict(X_custom)[0]

# Get classification column names
clf_columns = [col for col in X_custom.columns if col.startswith("meal_plan_type_") or col.startswith("health_tag_")]
# Note: In training, classifier uses y_clf, so the column order must match
clf_columns = classifier.classes_[0].tolist() + classifier.classes_[1].tolist()

# For your dataset, just define:
meal_plan_cols = [
    'meal_plan_type_Calorie-Deficit High-Protein',
    'meal_plan_type_High-Calorie Protein-Rich',
    'meal_plan_type_Low-GI High-Fiber Plan',
    'meal_plan_type_Low-GI Low-Sodium Plan',
    'meal_plan_type_Low-Sodium High-Potassium Plan'
]
health_tag_cols = [
    'health_tag_Diabetic & BP-Safe Plan',
    'health_tag_Diabetic-Safe Plan',
    'health_tag_General Plan'
]

print("\n--- Predicted Meal Plan Type & Health Tag ---")
for i, col in enumerate(meal_plan_cols):
    if y_clf_pred[i] == 1:
        print(f"Meal Plan Type: {col}")

for i, col in enumerate(health_tag_cols):
    if y_clf_pred[len(meal_plan_cols)+i] == 1:
        print(f"Health Tag: {col}")
