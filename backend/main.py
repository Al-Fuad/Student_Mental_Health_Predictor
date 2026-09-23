"""Main entrypoint for the Student Mental Health Predictor API.

This file provides root-level access and re-exports the FastAPI app from `app.main`,
ensuring 100% backward compatibility for runners using `uvicorn main:app --reload`
or executing `python main.py`.
"""

import uvicorn
from app.main import app, create_application
from app.services.ml_service import ml_service
from app.services.advice_service import advice_service

# Backward compatibility alias for the model
model = ml_service.model
categorize_score = advice_service.categorize_score

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
