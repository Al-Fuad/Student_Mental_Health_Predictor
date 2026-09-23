from typing import List, Tuple
from app.schemas.prediction import PredictionInput


class AdviceService:
    """Service to evaluate wellness thresholds and generate personalized guidance."""

    @staticmethod
    def categorize_score(score: float) -> Tuple[str, str, str]:
        """Categorize the mental health score into qualitative levels.

        Returns (category, status_color, base_recommendation).
        """
        if score >= 7.5:
            return (
                "Optimal Well-being",
                "#10b981",
                "Your mental health indicators look robust. Keep up your healthy lifestyle balance!",
            )
        elif score >= 6.0:
            return (
                "Stable / Moderate",
                "#3b82f6",
                "You have a fairly balanced lifestyle, but small improvements in sleep and screen management could boost your well-being.",
            )
        elif score >= 4.5:
            return (
                "At Risk / Strained",
                "#f59e0b",
                "Noticeable stress and digital fatigue. Consider reducing screen time and prioritizing sleep and outdoor activity.",
            )
        else:
            return (
                "High Risk / Vulnerable",
                "#ef4444",
                "Significant mental distress indicators detected. We strongly suggest reducing digital overload and reaching out to a counselor or support network.",
            )

    @staticmethod
    def generate_recommendation(payload: PredictionInput, base_recommendation: str) -> str:
        """Add contextual lifestyle tips based on the input factors."""
        custom_tips: List[str] = []

        if payload.sleep_hours_per_night < 6:
            custom_tips.append("Aim for at least 7-8 hours of sleep per night to restore cognitive focus.")

        if payload.avg_daily_usage_hours > 5:
            custom_tips.append("High screen time detected; consider setting digital boundaries before bedtime.")

        if payload.physical_activity_hours < 0.5:
            custom_tips.append("Add at least 30 minutes of physical movement daily to boost endorphins.")

        if payload.stress_level in ["High", "Very High"]:
            custom_tips.append("Your self-reported stress is high; practice mindful breaks and seek support if needed.")

        if custom_tips:
            return base_recommendation + " " + " ".join(custom_tips)

        return base_recommendation


advice_service = AdviceService()
