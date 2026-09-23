# Student Mental Health Predictor - Backend Service

A modular, production-ready FastAPI backend designed to serve machine learning inference for predicting student mental health scores based on demographic, academic, digital habits, and lifestyle metrics.

---

## 🏛️ Architecture Overview

The backend is organized with clear separation of concerns (SoC):

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # Application factory, lifespan, CORS, and router registration
│   ├── core/
│   │   ├── config.py            # App settings (Pydantic BaseSettings, paths, CORS)
│   │   └── constants.py         # Static benchmarks, model specs, feature importances
│   ├── schemas/                 # Strongly typed Pydantic data contracts
│   │   ├── health.py            # Health check response schema
│   │   ├── prediction.py        # Prediction input & output schemas
│   │   └── model_info.py        # Model evaluation & benchmark schemas
│   ├── services/                # Business and ML inference logic
│   │   ├── ml_service.py        # Model lifecycle, data pre-processing, and prediction
│   │   └── advice_service.py    # Health categorization & contextual wellness tips
│   └── api/
│       └── v1/
│           ├── router.py        # Unified API router
│           └── endpoints/
│               ├── health.py    # GET /health
│               ├── model_info.py# GET /model-details
│               └── prediction.py# POST /predict
├── tests/                       # Automated API and unit tests
│   └── test_api.py
├── main.py                      # Root entrypoint maintaining 100% backward compatibility
├── schemas.py                   # Re-exports app schemas for backward compatibility
├── requirements.txt             # Project dependencies
├── .env.example                 # Environment configuration template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Virtual environment

### 2. Setup Environment
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the Development Server
You can run the server using either the standard command or via the entrypoint:

```bash
# Option A: Recommended standard runner
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Option B: Root entrypoint (backward compatible)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Option C: Direct Python execution
python main.py
```

The API will be accessible at:
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 📡 API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` or `/api/v1/health` | Check service health and ML model status |
| `GET` | `/model-details` or `/api/v1/model-details` | Model metrics, benchmarks, and feature importances |
| `POST` | `/predict` or `/api/v1/predict` | Predict student mental health score (1.0 - 10.0 scale) |

---

## 🧪 Running Tests

Execute the automated test suite with `pytest`:

```bash
pytest tests/
```
