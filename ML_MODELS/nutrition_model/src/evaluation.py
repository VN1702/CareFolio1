# -----------------------------
# meal_planner_evaluate.py
# -----------------------------
import pandas as pd
import joblib
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score, f1_score

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("meal_planner_cleaned.csv")
print("Dataset shape:", df.shape)

# -----------------------------
# Load Models
# -----------------------------
regressor = joblib.load("meal_planner_regression_model.pkl")
classifier = joblib.load("meal_planner_classification_model.pkl")

# -----------------------------
# Define Features & Targets
# -----------------------------
regression_targets = ["target_calories", "carbs_g", "protein_g", "fats_g"]
y_reg = df[regression_targets]

# Features: drop regression targets
X = df.drop(columns=regression_targets)

# Classification targets: one-hot encoded
classification_targets = [col for col in X.columns if col.startswith("meal_plan_type_") or col.startswith("health_tag_")]
y_clf = X[classification_targets]

# Remove classification targets from features
X = X.drop(columns=classification_targets)

# -----------------------------
# Predict & Evaluate Regression
# -----------------------------
y_reg_pred = regressor.predict(X)
print("\n--- Regression Evaluation ---")
for i, col in enumerate(y_reg.columns):
    r2 = r2_score(y_reg.iloc[:, i], y_reg_pred[:, i])
    mae = mean_absolute_error(y_reg.iloc[:, i], y_reg_pred[:, i])
    print(f"{col}: R²={r2:.3f}, MAE={mae:.2f}")

# -----------------------------
# Predict & Evaluate Classification
# -----------------------------
y_clf_pred = classifier.predict(X)
print("\n--- Classification Evaluation ---")
for i, col in enumerate(y_clf.columns):
    acc = accuracy_score(y_clf.iloc[:, i], y_clf_pred[:, i])
    f1 = f1_score(y_clf.iloc[:, i], y_clf_pred[:, i], average='weighted')
    print(f"{col}: Accuracy={acc:.3f}, F1={f1:.3f}")
