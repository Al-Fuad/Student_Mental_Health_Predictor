from typing import Any, Dict, Literal
from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    # Demographics & Education
    age: int = Field(..., ge=10, le=100, description="Age in years", examples=[21])
    gender: Literal["Female", "Male"] = Field(..., description="Gender", examples=["Female"])
    academic_level: Literal["High School", "Undergraduate", "Graduate"] = Field(
        ..., description="Current academic level", examples=["Undergraduate"]
    )
    country: Literal[
        "Australia", "Canada", "France", "Germany", "India",
        "Mexico", "Turkey", "UK", "USA", "Other"
    ] = Field(..., description="Country of residence", examples=["USA"])

    # Digital Habits
    most_used_platform: Literal[
        "Facebook", "Instagram", "KakaoTalk", "LINE", "LinkedIn",
        "Snapchat", "TikTok", "Twitter", "VKontakte", "WeChat", "WhatsApp", "YouTube"
    ] = Field(..., description="Most frequently used social media platform", examples=["Instagram"])
    purpose_of_use: Literal["Education", "Entertainment", "Networking", "News"] = Field(
        ..., description="Primary reason for using social media", examples=["Entertainment"]
    )
    avg_daily_usage_hours: float = Field(
        ..., ge=0.0, le=24.0, description="Average daily screen time in hours", examples=[3.5]
    )
    daily_unlocks: int = Field(
        ..., ge=0, le=1000, description="Average number of smartphone unlocks per day", examples=[60]
    )

    # Lifestyle & Wellness
    study_hours: float = Field(
        ..., ge=0.0, le=24.0, description="Hours spent studying per day", examples=[4.0]
    )
    physical_activity_hours: float = Field(
        ..., ge=0.0, le=24.0, description="Hours spent in physical activity per day", examples=[1.0]
    )
    sleep_hours_per_night: float = Field(
        ..., ge=0.0, le=24.0, description="Average hours of sleep per night", examples=[7.0]
    )
    stress_level: Literal["Low", "Medium", "High", "Very High"] = Field(
        ..., description="Perceived stress level", examples=["Medium"]
    )


class PredictionOutput(BaseModel):
    mental_health_score: float = Field(..., description="Predicted mental health score on 1-10 scale")
    category: str = Field(..., description="Categorical classification of well-being")
    status_color: str = Field(..., description="Hex color representing the health state")
    recommendation: str = Field(..., description="Contextual lifestyle and mental health guidance")
    inputs: Dict[str, Any] = Field(..., description="Echoed input values used for the prediction")
