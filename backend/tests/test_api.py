import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.advice_service import advice_service


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_check_v1(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_name"] == "Mental_Health_model.pkl"
    assert "model_loaded" in data


def test_model_details(client):
    response = client.get("/api/v1/model-details")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "Random Forest Regressor Pipeline"
    assert "metrics" in data
    assert data["metrics"]["test_r2"] > 0.8
    assert len(data["benchmark_comparison"]) >= 3
    assert len(data["feature_importances"]) >= 5
    assert data["pipeline_specs"]["target_variable"] == "Mental_Health_Score"


def test_prediction_endpoint(client):
    payload = {
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
        "stress_level": "Medium",
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 1.0 <= data["mental_health_score"] <= 10.0
    assert data["category"] in [
        "Optimal Well-being",
        "Stable / Moderate",
        "At Risk / Strained",
        "High Risk / Vulnerable",
    ]
    assert data["status_color"].startswith("#")
    assert isinstance(data["recommendation"], str)
    assert len(data["recommendation"]) > 10


def test_prediction_invalid_payload(client):
    # Invalid age outside schema bounds
    invalid_payload = {
        "age": 5,
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
        "stress_level": "Medium",
    }
    response = client.post("/api/v1/predict", json=invalid_payload)
    assert response.status_code == 422


def test_advice_categorization():
    cat, col, _ = advice_service.categorize_score(8.0)
    assert cat == "Optimal Well-being"
    assert col == "#10b981"

    cat, col, _ = advice_service.categorize_score(6.5)
    assert cat == "Stable / Moderate"
    assert col == "#3b82f6"

    cat, col, _ = advice_service.categorize_score(5.0)
    assert cat == "At Risk / Strained"
    assert col == "#f59e0b"

    cat, col, _ = advice_service.categorize_score(3.0)
    assert cat == "High Risk / Vulnerable"
    assert col == "#ef4444"
