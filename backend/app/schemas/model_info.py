from typing import List
from pydantic import BaseModel, Field


class ModelMetrics(BaseModel):
    test_r2: float = Field(..., description="R² coefficient of determination on test set")
    train_r2: float = Field(..., description="R² score on training set")
    test_mae: float = Field(..., description="Mean Absolute Error on test set")
    test_rmse: float = Field(..., description="Root Mean Squared Error on test set")
    test_mse: float = Field(..., description="Mean Squared Error on test set")


class BenchmarkModel(BaseModel):
    model_name: str
    r2_score: float
    training_r2: float
    mae: float
    rmse: float
    is_active: bool = False


class FeatureImportance(BaseModel):
    feature: str
    label: str
    importance: float
    percentage: float
    category: str


class PipelineSpecs(BaseModel):
    target_variable: str
    target_scale: str
    train_test_split: str
    total_features: int
    random_state: int
    algorithm: str


class ModelDetailsResponse(BaseModel):
    model_name: str
    artifact_file: str
    is_loaded: bool
    metrics: ModelMetrics
    benchmark_comparison: List[BenchmarkModel]
    feature_importances: List[FeatureImportance]
    pipeline_specs: PipelineSpecs
