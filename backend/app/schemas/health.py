from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status", examples=["ok"])
    model_loaded: bool = Field(..., description="Whether the ML model is currently loaded in memory")
    model_name: str = Field(default="Mental_Health_model.pkl", description="Model file name")
