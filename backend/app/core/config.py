import os
from pathlib import Path
from typing import List


class Settings:
    PROJECT_NAME: str = "Student Mental Health Predictor API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI service for predicting student mental health score using trained machine learning model."
    API_V1_STR: str = "/api/v1"

    # Base directory is backend/
    BACKEND_DIR: Path = Path(__file__).resolve().parent.parent.parent

    # Path to trained model artifact
    MODEL_PATH: Path = Path(
        os.getenv(
            "MODEL_PATH",
            str(BACKEND_DIR.parent / "ml" / "models" / "Mental_Health_model.pkl"),
        )
    )
    MODEL_NAME: str = os.getenv("MODEL_NAME", "Mental_Health_model.pkl")

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ]


settings = Settings()
