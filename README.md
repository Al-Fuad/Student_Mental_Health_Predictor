# 🧠 Student Mental Health Predictor

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An end-to-end Machine Learning web application designed to assess, predict, and monitor student mental health scores based on demographic background, digital habits (screen time, unlocks, platforms), academic pressure, and lifestyle metrics (sleep, physical activity, stress levels).

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Machine Learning Model & Metrics](#-machine-learning-model--metrics)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Machine Learning & Training](#3-machine-learning--training)
- [API Documentation](#-api-documentation)
- [Interactive Student Presets](#-interactive-student-presets)
- [Testing](#-testing)
- [License](#-license)

---

## 🌟 Overview

Academic demands and digital hyper-connectivity have significant impacts on student well-being. The **Student Mental Health Predictor** bridges predictive ML and modern user-centric design to:
- Quantify a student's mental well-being on a scale from **1.0 to 10.0**.
- Identify critical risk factors like digital overload, chronic sleep deprivation, and high stress.
- Provide actionable, contextual wellness recommendations and lifestyle guidance.
- Offer full transparency via interactive model performance dashboards and feature importance breakdowns.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 + Vite UI                   │
│  (Interactive Sliders, Presets, Gauges, Model Metrics) │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│   ├── Pydantic V2 Validation & Data Schema Contracts   │
│   ├── Business & Advice Recommendation Engine          │
│   └── ML Inference Service                             │
└───────────────────────────┬────────────────────────────┘
                            │ Model Pipeline
                            ▼
┌────────────────────────────────────────────────────────┐
│             Scikit-Learn Random Forest Pipeline        │
│          (Trained with One-Hot & MinMax Scaler)        │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Real-time Prediction**: Immediate score calculation upon input submission.
- **Explainable Insights**: View top contributing features (screen time, sleep hours, unlock frequency, study hours).
- **Curated Presets**: Quick-load archetypes (e.g., *Balanced Student*, *Digital Overload*, *Exam Cramming*, *Mindful Routine*).
- **Contextual Guidance**: Tailored recommendations depending on predicted score and risk tier (Thriving, Good, Moderate, At Risk, Critical).
- **Model Transparency Modal**: Built-in benchmark metrics comparing Random Forest vs. Tuned RF vs. Linear Regression.
- **Modular & Testable**: Complete separation of concerns with unit tests for API endpoints.

---

## 📊 Machine Learning Model & Metrics

The production model uses an ensemble **Random Forest Regressor** trained on multivariate student lifestyle data:

- **Target Variable**: `Mental_Health_Score` ($1.0 - 10.0$ scale)
- **Train/Test Split**: 70% Train / 30% Test (Seed: 42)
- **Deployed Model**: `RandomForestRegressor(n_estimators=100, random_state=42)`

### Model Performance Benchmarks

| Model | $R^2$ Score (Test) | Train $R^2$ | MAE | RMSE | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Deployed)** | **0.8774** | **0.9808** | **0.3477** | **0.4640** | 🚀 Active |
| Random Forest (Tuned) | 0.8737 | 0.9715 | 0.3535 | 0.4710 | Archived |
| Linear Regression (Baseline) | 0.7398 | 0.7237 | 0.5362 | 0.6760 | Baseline |

### Top Predictive Features

1. **Avg Daily Usage Hours (Screen Time)**: ~69.1% importance
2. **Sleep Hours Per Night**: ~10.2% importance
3. **Daily Phone Unlocks**: ~4.4% importance
4. **Study Hours**: ~2.7% importance
5. **Physical Activity**: ~2.6% importance

---

## 📂 Project Structure

```text
mental-health-score/
├── backend/                         # FastAPI Python Backend
│   ├── app/
│   │   ├── api/v1/                  # Endpoints (/health, /predict, /model-details)
│   │   ├── core/                    # App settings & benchmark constants
│   │   ├── schemas/                 # Pydantic data contracts
│   │   ├── services/                # ML inference & wellness advice services
│   │   └── main.py                  # FastAPI application factory
│   ├── tests/                       # Automated Pytest suite
│   ├── requirements.txt             # Backend dependencies
│   └── README.md                    # Backend specific documentation
├── frontend/                        # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/              # Model details modal and dashboards
│   │   ├── App.jsx                  # Main application & interactive form
│   │   └── App.css                  # UI styling & glassmorphism components
│   ├── package.json                 # Frontend scripts & dependencies
│   └── vite.config.js               # Vite build configuration
├── ml/                              # Model Research & Training
│   ├── models/                      # Serialized model (.pkl)
│   ├── notebooks/                   # Jupyter notebooks (EDA, training, evaluation)
│   ├── sample_data/                 # Sample datasets
│   └── requirements.txt             # ML environment dependencies
└── README.md                        # Master project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher (`npm` installed)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will start at `http://localhost:8000`.  
Explore interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173` to access the application.

---

### 3. Machine Learning & Training

To explore or retrain the machine learning pipeline:

```bash
cd ml
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
jupyter notebook notebooks/mental-health-score-notebook.ipynb
```

---

## 📡 API Documentation

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status & ML model readiness |
| `GET` | `/api/v1/model-details` | Full evaluation metrics, feature weights, and benchmarks |
| `POST` | `/api/v1/predict` | Predict mental health score from student metrics |

### Sample Prediction Request (`POST /api/v1/predict`)

```json
{
  "age": 21,
  "gender": "Female",
  "academic_level": "Undergraduate",
  "country": "USA",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 3.5,
  "daily_unlocks": 60,
  "study_hours": 4.0,
  "physical_activity_hours": 1.0,
  "sleep_hours_per_night": 7.0,
  "stress_level": "Medium"
}
```

### Sample Prediction Response

```json
{
  "mental_health_score": 7.42,
  "category": "Good",
  "status_color": "#10b981",
  "recommendation": "Great balance overall! Maintain consistent sleep cycles and schedule screen breaks during study sessions.",
  "inputs": { ... }
}
```

---

## 🎭 Interactive Student Presets

The frontend includes realistic one-click scenario profiles:

| Preset Profile | Screen Time | Sleep | Stress | Expected Outcome |
| :--- | :---: | :---: | :---: | :---: |
| **🌱 Balanced Student** | 2.5 hrs | 8.0 hrs | Low | Optimal health score (~8.5+) |
| **📱 Digital Overload** | 8.0 hrs | 4.5 hrs | High | Elevated risk score (~4.0 - 5.5) |
| **📚 Exam Cramming** | 1.8 hrs | 5.5 hrs | Very High | Moderate fatigue impact (~6.0) |
| **🧘 Mindful Routine** | 2.0 hrs | 8.5 hrs | Low | Strong wellness indicators (~9.0+) |

---

## 🧪 Testing

Execute automated backend tests using `pytest`:

```bash
cd backend
pytest tests/ -v
```

Linting frontend code:

```bash
cd frontend
npm run lint
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
