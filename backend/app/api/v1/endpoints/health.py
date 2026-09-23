from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse
from app.services.ml_service import ml_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Health check route to verify service status and model availability."""
    return HealthResponse(
        status="ok",
        model_loaded=ml_service.is_loaded(),
        model_name=settings.MODEL_NAME,
    )
