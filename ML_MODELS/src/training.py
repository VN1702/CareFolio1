# -----------------------------
# meal_planner_train.py
# -----------------------------
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor, MultiOutputClassifier
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score, f1_score
import xgboost as xgb
import joblib

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("meal_planner_cleaned.csv")
print("Dataset shape:", df.shape)

# -----------------------------
# Define Features & Targets
# -----------------------------
# Regression targets (numeric)
regression_targets = ["target_calories", "carbs_g", "protein_g", "fats_g"]
y_reg = df[regression_targets]

# Features: all columns except regression targets
X = df.drop(columns=regression_targets)

# Classification targets (one-hot encoded)
classification_targets = [col for col in X.columns if col.startswith("meal_plan_type_") or col.startswith("health_tag_")]
y_clf = X[classification_targets]

# Remove classification targets from features
X = X.drop(columns=classification_targets)

# -----------------------------
# Train/Test Split
# -----------------------------
X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
    X, y_reg, y_clf, test_size=0.2, random_state=42
)

# -----------------------------
# Regression Model: MultiOutput XGBoost
# -----------------------------
regressor = MultiOutputRegressor(
    xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        objective='reg:squarederror',
        random_state=42
    )
)

regressor.fit(X_train, y_reg_train)

# Predict & Evaluate Regression
y_reg_pred = regressor.predict(X_test)
for i, col in enumerate(y_reg.columns):
    r2 = r2_score(y_reg_test.iloc[:, i], y_reg_pred[:, i])
    mae = mean_absolute_error(y_reg_test.iloc[:, i], y_reg_pred[:, i])
    print(f"Regression - {col}: R²={r2:.3f}, MAE={mae:.2f}")

# Save Regression Model
joblib.dump(regressor, "meal_planner_regression_model.pkl")
print("✅ Saved regression model as meal_planner_regression_model.pkl")

# -----------------------------
# Classification Model: MultiOutput XGBoost
# -----------------------------
classifier = MultiOutputClassifier(
    xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=42
    )
)

classifier.fit(X_train, y_clf_train)

# Predict & Evaluate Classification
y_clf_pred = classifier.predict(X_test)
for i, col in enumerate(y_clf.columns):
    acc = accuracy_score(y_clf_test.iloc[:, i], y_clf_pred[:, i])
    f1 = f1_score(y_clf_test.iloc[:, i], y_clf_pred[:, i], average='weighted')
    print(f"Classification - {col}: Accuracy={acc:.3f}, F1={f1:.3f}")

# Save Classification Model
joblib.dump(classifier, "meal_planner_classification_model.pkl")
print("✅ Saved classification model as meal_planner_classification_model.pkl")
