import logging
from typing import Any, Optional
import joblib
import pandas as pd
from app.core.config import settings
from app.schemas.prediction import PredictionInput

logger = logging.getLogger(__name__)


class MLService:
    """Service to handle model loading, data transformation, and inference."""

    def __init__(self) -> None:
        self.model: Optional[Any] = None

    def load_model(self) -> bool:
        """Load trained pipeline from disk."""
        if settings.MODEL_PATH.exists():
            try:
                self.model = joblib.load(settings.MODEL_PATH)
                logger.info("✅ Model loaded successfully from %s", settings.MODEL_PATH)
                return True
            except Exception as e:
                logger.error("❌ Failed to load model: %s", e)
                return False
        else:
            logger.warning("⚠️ Model file not found at %s", settings.MODEL_PATH)
            return False

    def is_loaded(self) -> bool:
        return self.model is not None

    def prepare_dataframe(self, payload: PredictionInput) -> pd.DataFrame:
        """Map Pydantic input to match exact feature names expected by the trained pipeline."""
        return pd.DataFrame([
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

    def predict(self, payload: PredictionInput) -> float:
        """Run model inference and return formatted score."""
        if not self.is_loaded():
            raise RuntimeError("Model is not loaded. Please verify the model file exists.")

        input_df = self.prepare_dataframe(payload)
        prediction = self.model.predict(input_df)[0]
        return round(float(prediction), 2)


ml_service = MLService()
