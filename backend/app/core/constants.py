"""Static model metadata, evaluation metrics, benchmarks, and feature importances."""

DEFAULT_MODEL_METRICS = {
    "test_r2": 0.8774,
    "train_r2": 0.9808,
    "test_mae": 0.3477,
    "test_rmse": 0.4640,
    "test_mse": 0.2153,
}

DEFAULT_BENCHMARK_MODELS = [
    {
        "model_name": "Random Forest (Deployed)",
        "r2_score": 0.8774,
        "training_r2": 0.9808,
        "mae": 0.3477,
        "rmse": 0.4640,
        "is_active": True,
    },
    {
        "model_name": "Random Forest (Tuned)",
        "r2_score": 0.8737,
        "training_r2": 0.9715,
        "mae": 0.3535,
        "rmse": 0.4710,
        "is_active": False,
    },
    {
        "model_name": "Linear Regression (Baseline)",
        "r2_score": 0.7398,
        "training_r2": 0.7237,
        "mae": 0.5362,
        "rmse": 0.6760,
        "is_active": False,
    },
]

DEFAULT_FEATURE_IMPORTANCES = [
    {
        "feature": "Avg_Daily_Usage_Hours",
        "label": "Daily Screen Time",
        "importance": 0.6913,
        "percentage": 69.1,
        "category": "Digital Habits",
    },
    {
        "feature": "Sleep_Hours_Per_Night",
        "label": "Sleep Per Night",
        "importance": 0.1018,
        "percentage": 10.2,
        "category": "Lifestyle & Health",
    },
    {
        "feature": "Daily_Unlocks",
        "label": "Daily Phone Unlocks",
        "importance": 0.0441,
        "percentage": 4.4,
        "category": "Digital Habits",
    },
    {
        "feature": "Study_Hours",
        "label": "Daily Study Hours",
        "importance": 0.0272,
        "percentage": 2.7,
        "category": "Academic",
    },
    {
        "feature": "Physical_Activity_Hours",
        "label": "Physical Activity",
        "importance": 0.0260,
        "percentage": 2.6,
        "category": "Lifestyle & Health",
    },
    {
        "feature": "Age",
        "label": "Student Age",
        "importance": 0.0153,
        "percentage": 1.5,
        "category": "Demographics",
    },
    {
        "feature": "Purpose_Of_Use_Entertainment",
        "label": "Entertainment Purpose",
        "importance": 0.0090,
        "percentage": 0.9,
        "category": "Digital Habits",
    },
    {
        "feature": "Grouped_Country_Turkey",
        "label": "Country: Turkey",
        "importance": 0.0065,
        "percentage": 0.7,
        "category": "Demographics",
    },
    {
        "feature": "Most_Used_Platform_Instagram",
        "label": "Platform: Instagram",
        "importance": 0.0060,
        "percentage": 0.6,
        "category": "Digital Habits",
    },
    {
        "feature": "Stress_Level",
        "label": "Self-Perceived Stress",
        "importance": 0.0054,
        "percentage": 0.5,
        "category": "Lifestyle & Health",
    },
]

DEFAULT_PIPELINE_SPECS = {
    "target_variable": "Mental_Health_Score",
    "target_scale": "1.0 - 10.0 scale",
    "train_test_split": "70% Train / 30% Test (seed: 42)",
    "total_features": 12,
    "random_state": 42,
    "algorithm": "RandomForestRegressor(n_estimators=100, random_state=42)",
}
