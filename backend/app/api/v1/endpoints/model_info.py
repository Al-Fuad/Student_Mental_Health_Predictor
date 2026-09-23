from fastapi import APIRouter
from app.core.config import settings
from app.core.constants import (
    DEFAULT_BENCHMARK_MODELS,
    DEFAULT_FEATURE_IMPORTANCES,
    DEFAULT_MODEL_METRICS,
    DEFAULT_PIPELINE_SPECS,
)
from app.schemas.model_info import (
    BenchmarkModel,
    FeatureImportance,
    ModelDetailsResponse,
    ModelMetrics,
    PipelineSpecs,
)
from app.services.ml_service import ml_service

router = APIRouter()


@router.get("/model-details", response_model=ModelDetailsResponse, tags=["Model Info"])
def get_model_details():
    """Return model architecture, evaluation scores, benchmark comparison, and feature importances."""
    return ModelDetailsResponse(
        model_name="Random Forest Regressor Pipeline",
        artifact_file=settings.MODEL_NAME,
        is_loaded=ml_service.is_loaded(),
        metrics=ModelMetrics(**DEFAULT_MODEL_METRICS),
        benchmark_comparison=[BenchmarkModel(**b) for b in DEFAULT_BENCHMARK_MODELS],
        feature_importances=[FeatureImportance(**f) for f in DEFAULT_FEATURE_IMPORTANCES],
        pipeline_specs=PipelineSpecs(**DEFAULT_PIPELINE_SPECS),
    )
