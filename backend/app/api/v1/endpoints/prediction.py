import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictionInput, PredictionOutput
from app.services.advice_service import advice_service
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictionOutput,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"],
)
def predict(payload: PredictionInput):
    """Predict student mental health score based on demographic, digital, and lifestyle features."""
    if not ml_service.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded. Please verify the model file exists.",
        )

    try:
        score = ml_service.predict(payload)
        category, status_color, base_recommendation = advice_service.categorize_score(score)
        full_recommendation = advice_service.generate_recommendation(payload, base_recommendation)

        return PredictionOutput(
            mental_health_score=score,
            category=category,
            status_color=status_color,
            recommendation=full_recommendation,
            inputs=payload.model_dump(),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Prediction failed: %s", e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}",
        )
