import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    HealthResponse,
    ModelDetailsResponse,
    ModelMetrics,
    BenchmarkModel,
    FeatureImportance,
    PipelineSpecs,
    PredictionInput,
    PredictionOutput,
)

# Resolve path to the trained model
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR.parent / "ml" / "models" / "Mental_Health_model.pkl"

model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    if MODEL_PATH.exists():
        try:
            model = joblib.load(MODEL_PATH)
            print(f"✅ Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
    else:
        print(f"⚠️ Model file not found at {MODEL_PATH}")
    yield


app = FastAPI(
    title="Student Mental Health Predictor API",
    description="FastAPI service for predicting student mental health score using trained machine learning model.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production if required
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def categorize_score(score: float):
    if score >= 7.5:
        return "Optimal Well-being", "#10b981", "Your mental health indicators look robust. Keep up your healthy lifestyle balance!"
    elif score >= 6.0:
        return "Stable / Moderate", "#3b82f6", "You have a fairly balanced lifestyle, but small improvements in sleep and screen management could boost your well-being."
    elif score >= 4.5:
        return "At Risk / Strained", "#f59e0b", "Noticeable stress and digital fatigue. Consider reducing screen time and prioritizing sleep and outdoor activity."
    else:
        return "High Risk / Vulnerable", "#ef4444", "Significant mental distress indicators detected. We strongly suggest reducing digital overload and reaching out to a counselor or support network."


@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check route to verify service status and model availability."""
    return HealthResponse(
        status="ok",
        model_loaded=model is not None,
        model_name="Mental_Health_model.pkl",
    )


@app.get("/model-details", response_model=ModelDetailsResponse)
def get_model_details():
    """Return model architecture, evaluation scores, benchmark comparison, and feature importances."""
    return ModelDetailsResponse(
        model_name="Random Forest Regressor Pipeline",
        artifact_file="Mental_Health_model.pkl",
        is_loaded=model is not None,
        metrics=ModelMetrics(
            test_r2=0.8774,
            train_r2=0.9808,
            test_mae=0.3477,
            test_rmse=0.4640,
            test_mse=0.2153,
        ),
        benchmark_comparison=[
            BenchmarkModel(
                model_name="Random Forest (Deployed)",
                r2_score=0.8774,
                training_r2=0.9808,
                mae=0.3477,
                rmse=0.4640,
                is_active=True,
            ),
            BenchmarkModel(
                model_name="Random Forest (Tuned)",
                r2_score=0.8737,
                training_r2=0.9715,
                mae=0.3535,
                rmse=0.4710,
                is_active=False,
            ),
            BenchmarkModel(
                model_name="Linear Regression (Baseline)",
                r2_score=0.7398,
                training_r2=0.7237,
                mae=0.5362,
                rmse=0.6760,
                is_active=False,
            ),
        ],
        feature_importances=[
            FeatureImportance(
                feature="Avg_Daily_Usage_Hours",
                label="Daily Screen Time",
                importance=0.6913,
                percentage=69.1,
                category="Digital Habits",
            ),
            FeatureImportance(
                feature="Sleep_Hours_Per_Night",
                label="Sleep Per Night",
                importance=0.1018,
                percentage=10.2,
                category="Lifestyle & Health",
            ),
            FeatureImportance(
                feature="Daily_Unlocks",
                label="Daily Phone Unlocks",
                importance=0.0441,
                percentage=4.4,
                category="Digital Habits",
            ),
            FeatureImportance(
                feature="Study_Hours",
                label="Daily Study Hours",
                importance=0.0272,
                percentage=2.7,
                category="Academic",
            ),
            FeatureImportance(
                feature="Physical_Activity_Hours",
                label="Physical Activity",
                importance=0.0260,
                percentage=2.6,
                category="Lifestyle & Health",
            ),
            FeatureImportance(
                feature="Age",
                label="Student Age",
                importance=0.0153,
                percentage=1.5,
                category="Demographics",
            ),
            FeatureImportance(
                feature="Purpose_Of_Use_Entertainment",
                label="Entertainment Purpose",
                importance=0.0090,
                percentage=0.9,
                category="Digital Habits",
            ),
            FeatureImportance(
                feature="Grouped_Country_Turkey",
                label="Country: Turkey",
                importance=0.0065,
                percentage=0.7,
                category="Demographics",
            ),
            FeatureImportance(
                feature="Most_Used_Platform_Instagram",
                label="Platform: Instagram",
                importance=0.0060,
                percentage=0.6,
                category="Digital Habits",
            ),
            FeatureImportance(
                feature="Stress_Level",
                label="Self-Perceived Stress",
                importance=0.0054,
                percentage=0.5,
                category="Lifestyle & Health",
            ),
        ],
        pipeline_specs=PipelineSpecs(
            target_variable="Mental_Health_Score",
            target_scale="1.0 - 10.0 scale",
            train_test_split="70% Train / 30% Test (seed: 42)",
            total_features=12,
            random_state=42,
            algorithm="RandomForestRegressor(n_estimators=100, random_state=42)",
        ),
    )



@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    """Predict student mental health score based on demographic, digital, and lifestyle features."""
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please verify the model file exists.",
        )

    try:
        # Construct DataFrame matching the trained pipeline schema
        input_data = pd.DataFrame([
            {
                "Study_Hours": payload.study_hours,
                "Age": payload.age,
                "Avg_Daily_Usage_Hours": payload.avg_daily_usage_hours,
                "Daily_Unlocks": payload.daily_unlocks,
                "Physical_Activity_Hours": payload.physical_activity_hours,
                "Sleep_Hours_Per_Night": payload.sleep_hours_per_night,
                "Stress_Level": payload.stress_level,
                "Gender": payload.gender,
                "Academic_Level": payload.academic_level,
                "Most_Used_Platform": payload.most_used_platform,
                "Purpose_Of_Use": payload.purpose_of_use,
                "Grouped_Country": payload.country,
            }
        ])

        prediction = model.predict(input_data)[0]
        # Round score to 2 decimal places and constrain to typical 1-10 range if desired
        score = round(float(prediction), 2)

        category, status_color, base_recommendation = categorize_score(score)

        # Contextual insights
        custom_tips = []
        if payload.sleep_hours_per_night < 6:
            custom_tips.append("Aim for at least 7-8 hours of sleep per night to restore cognitive focus.")
        if payload.avg_daily_usage_hours > 5:
            custom_tips.append("High screen time detected; consider setting digital boundaries before bedtime.")
        if payload.physical_activity_hours < 0.5:
            custom_tips.append("Add at least 30 minutes of physical movement daily to boost endorphins.")
        if payload.stress_level in ["High", "Very High"]:
            custom_tips.append("Your self-reported stress is high; practice mindful breaks and seek support if needed.")

        full_recommendation = base_recommendation
        if custom_tips:
            full_recommendation += " " + " ".join(custom_tips)

        return PredictionOutput(
            mental_health_score=score,
            category=category,
            status_color=status_color,
            recommendation=full_recommendation,
            inputs=payload.model_dump(),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}",
        )
