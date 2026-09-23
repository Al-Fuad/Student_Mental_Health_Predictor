import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ModelDetailsModal from './components/ModelDetailsModal';
import ModelDetailsView from './components/ModelDetailsView';
import { DEFAULT_MODEL_DETAILS } from './components/modelDetailsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const INITIAL_FORM = {
  age: 21,
  gender: 'Female',
  academic_level: 'Undergraduate',
  country: 'USA',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Entertainment',
  avg_daily_usage_hours: 3.5,
  daily_unlocks: 60,
  study_hours: 4.0,
  physical_activity_hours: 1.0,
  sleep_hours_per_night: 7.0,
  stress_level: 'Medium',
};

const PRESETS = [
  {
    name: '🌱 Balanced Student',
    data: {
      age: 21,
      gender: 'Female',
      academic_level: 'Undergraduate',
      country: 'USA',
      most_used_platform: 'YouTube',
      purpose_of_use: 'Education',
      avg_daily_usage_hours: 2.5,
      daily_unlocks: 35,
      study_hours: 4.5,
      physical_activity_hours: 1.5,
      sleep_hours_per_night: 8.0,
      stress_level: 'Low',
    },
  },
  {
    name: '📱 Digital Overload',
    data: {
      age: 19,
      gender: 'Male',
      academic_level: 'Undergraduate',
      country: 'Canada',
      most_used_platform: 'TikTok',
      purpose_of_use: 'Entertainment',
      avg_daily_usage_hours: 8.0,
      daily_unlocks: 135,
      study_hours: 1.5,
      physical_activity_hours: 0.2,
      sleep_hours_per_night: 4.5,
      stress_level: 'High',
    },
  },
  {
    name: '📚 Exam Cramming',
    data: {
      age: 23,
      gender: 'Male',
      academic_level: 'Graduate',
      country: 'India',
      most_used_platform: 'LinkedIn',
      purpose_of_use: 'Education',
      avg_daily_usage_hours: 1.8,
      daily_unlocks: 40,
      study_hours: 9.0,
      physical_activity_hours: 0.5,
      sleep_hours_per_night: 5.5,
      stress_level: 'Very High',
    },
  },
  {
    name: '🧘 Mindful Routine',
    data: {
      age: 22,
      gender: 'Female',
      academic_level: 'Undergraduate',
      country: 'Germany',
      most_used_platform: 'WhatsApp',
      purpose_of_use: 'Networking',
      avg_daily_usage_hours: 2.0,
      daily_unlocks: 30,
      study_hours: 5.0,
      physical_activity_hours: 2.0,
      sleep_hours_per_night: 8.5,
      stress_level: 'Low',
    },
  },
];

const PLATFORMS = [
  'Facebook', 'Instagram', 'KakaoTalk', 'LINE', 'LinkedIn',
  'Snapchat', 'TikTok', 'Twitter', 'VKontakte', 'WeChat', 'WhatsApp', 'YouTube'
];

const COUNTRIES = [
  'Australia', 'Canada', 'France', 'Germany', 'India',
  'Mexico', 'Turkey', 'UK', 'USA', 'Other'
];

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const [modelDetails, setModelDetails] = useState(DEFAULT_MODEL_DETAILS);
  const [activeView, setActiveView] = useState('predictor'); // 'predictor' | 'model-details'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health`);
      if (res.ok) {
        const data = await res.json();
        if (!data.model_loaded) {
          console.warn('API is reachable, but model is not loaded:', data);
        }
        setApiStatus(data.model_loaded ? 'online' : 'offline');
      } else {
        console.error(`Health check failed with status ${res.status}:`, res.statusText);
        setApiStatus('offline');
      }
    } catch (err) {
      console.error(`Failed to connect to API at ${API_BASE_URL}/api/v1/health:`, err);
      setApiStatus('offline');
    }
  }, []);

  const fetchModelDetails = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/model-details`);
      if (res.ok) {
        const data = await res.json();
        setModelDetails(data);
      }
    } catch (err) {
      console.warn('Could not fetch model details from backend:', err);
    }
  }, []);

  // Check backend health and fetch model details on mount
  useEffect(() => {
    checkHealth();
    fetchModelDetails();
    const interval = setInterval(() => {
      checkHealth();
      fetchModelDetails();
    }, 15000);
    return () => clearInterval(interval);
  }, [checkHealth, fetchModelDetails]);



  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field, value, isFloat = false) => {
    const num = isFloat ? parseFloat(value) : parseInt(value, 10);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const loadPreset = (presetData) => {
    setForm(presetData);
    setResult(null);
    setErrorMsg('');
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setErrorMsg(
        err.message || 'Failed to connect to backend server. Make sure FastAPI is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>MindPlus AI</h1>
            <p>Student Mental Health Predictor &amp; Behavioral Insights</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="model-header-badge"
            onClick={() => setIsModalOpen(true)}
            title="Inspect Model Performance, Evaluation Scores & Architecture"
            id="header-model-details-badge"
          >
            <span>🌲 Active Model</span>
            <span className="badge-highlight">R² {(modelDetails.metrics.test_r2 * 100).toFixed(1)}%</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>MAE ±{modelDetails.metrics.test_mae.toFixed(2)}</span>
          </button>

          <div className={`api-status-badge ${apiStatus}`}>
            <span className="status-dot"></span>
            <span>{apiStatus === 'online' ? 'Backend Ready (Port 8000)' : apiStatus === 'checking' ? 'Connecting to API...' : 'Backend Offline'}</span>
          </div>
        </div>
      </header>

      {/* View Switcher Navigation */}
      <div className="view-nav-wrapper">
        <div className="view-nav-tabs">
          <button
            type="button"
            className={`view-tab-btn ${activeView === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveView('predictor')}
            id="tab-predictor-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>Interactive Assessment</span>
          </button>

          <button
            type="button"
            className={`view-tab-btn ${activeView === 'model-details' ? 'active' : ''}`}
            onClick={() => setActiveView('model-details')}
            id="tab-model-details-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Model Details &amp; Scores</span>
            <span className="tab-badge">R² {(modelDetails.metrics.test_r2 * 100).toFixed(1)}%</span>
          </button>
        </div>

        {activeView === 'predictor' && (
          <button
            type="button"
            className="view-details-link-btn"
            onClick={() => setIsModalOpen(true)}
            id="open-model-modal-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Quick Specs Modal</span>
          </button>
        )}
      </div>

      {activeView === 'model-details' ? (
        <ModelDetailsView details={modelDetails} />
      ) : (
        <>
          {/* Preset Profiles Bar */}
          <section className="presets-section">
        <span className="presets-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Quick Presets:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="preset-chip"
            onClick={() => loadPreset(preset.data)}
            id={`preset-btn-${idx}`}
          >
            {preset.name}
          </button>
        ))}
      </section>

      {/* Error Banner */}
      {errorMsg && (
        <div className="error-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form + Result Layout */}
      <main className="main-layout">
        <form onSubmit={handleSubmit} className="form-container">
          {/* Card 1: Academic & Demographic Profile */}
          <div className="form-card">
            <div className="card-title-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h2>Student Profile &amp; Demographics</h2>
            </div>

            <div className="card-grid two-cols">
              {/* Age */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-age">
                  <span>Age</span>
                  <span className="label-value">{form.age} yrs</span>
                </label>
                <input
                  id="input-age"
                  type="range"
                  min="14"
                  max="45"
                  value={form.age}
                  onChange={(e) => handleNumberChange('age', e.target.value)}
                  className="range-slider"
                />
              </div>

              {/* Gender */}
              <div className="input-group">
                <label className="input-label">Gender</label>
                <div className="segmented-group">
                  {['Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      id={`gender-btn-${g.toLowerCase()}`}
                      className={`segment-btn ${form.gender === g ? 'active' : ''}`}
                      onClick={() => handleInputChange('gender', g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Level */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-academic">Academic Level</label>
                <select
                  id="input-academic"
                  value={form.academic_level}
                  onChange={(e) => handleInputChange('academic_level', e.target.value)}
                  className="form-select"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              {/* Country */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-country">Country / Region</label>
                <select
                  id="input-country"
                  value={form.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="form-select"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Digital Habits */}
          <div className="form-card">
            <div className="card-title-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <h2>Digital Habits &amp; Screen Activity</h2>
            </div>

            <div className="card-grid two-cols">
              {/* Primary Platform */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-platform">Most Used Platform</label>
                <select
                  id="input-platform"
                  value={form.most_used_platform}
                  onChange={(e) => handleInputChange('most_used_platform', e.target.value)}
                  className="form-select"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-purpose">Purpose Of Use</label>
                <select
                  id="input-purpose"
                  value={form.purpose_of_use}
                  onChange={(e) => handleInputChange('purpose_of_use', e.target.value)}
                  className="form-select"
                >
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Networking">Networking</option>
                  <option value="News">News</option>
                </select>
              </div>

              {/* Avg Daily Usage Hours */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-screen-time">
                  <span>Daily Social Screen Time</span>
                  <span className="label-value">{form.avg_daily_usage_hours} hrs/day</span>
                </label>
                <input
                  id="input-screen-time"
                  type="range"
                  min="0"
                  max="16"
                  step="0.5"
                  value={form.avg_daily_usage_hours}
                  onChange={(e) => handleNumberChange('avg_daily_usage_hours', e.target.value, true)}
                  className="range-slider"
                />
              </div>

              {/* Daily Phone Unlocks */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-unlocks">
                  <span>Phone Unlocks</span>
                  <span className="label-value">{form.daily_unlocks} times/day</span>
                </label>
                <input
                  id="input-unlocks"
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={form.daily_unlocks}
                  onChange={(e) => handleNumberChange('daily_unlocks', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Lifestyle & Wellness */}
          <div className="form-card">
            <div className="card-title-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
              <h2>Lifestyle, Sleep &amp; Stress Metrics</h2>
            </div>

            <div className="card-grid two-cols">
              {/* Study Hours */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-study">
                  <span>Study Hours</span>
                  <span className="label-value">{form.study_hours} hrs/day</span>
                </label>
                <input
                  id="input-study"
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={form.study_hours}
                  onChange={(e) => handleNumberChange('study_hours', e.target.value, true)}
                  className="range-slider"
                />
              </div>

              {/* Physical Activity */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-activity">
                  <span>Physical Activity</span>
                  <span className="label-value">{form.physical_activity_hours} hrs/day</span>
                </label>
                <input
                  id="input-activity"
                  type="range"
                  min="0"
                  max="5"
                  step="0.25"
                  value={form.physical_activity_hours}
                  onChange={(e) => handleNumberChange('physical_activity_hours', e.target.value, true)}
                  className="range-slider"
                />
              </div>

              {/* Sleep Hours */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-sleep">
                  <span>Sleep Per Night</span>
                  <span className="label-value">{form.sleep_hours_per_night} hrs</span>
                </label>
                <input
                  id="input-sleep"
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={form.sleep_hours_per_night}
                  onChange={(e) => handleNumberChange('sleep_hours_per_night', e.target.value, true)}
                  className="range-slider"
                />
              </div>

              {/* Stress Level */}
              <div className="input-group">
                <label className="input-label">Perceived Stress Level</label>
                <div className="segmented-group">
                  {['Low', 'Medium', 'High', 'Very High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      id={`stress-btn-${lvl.toLowerCase().replace(' ', '-')}`}
                      className={`segment-btn stress-${lvl.toLowerCase().replace(' ', '-')} ${
                        form.stress_level === lvl ? 'active' : ''
                      }`}
                      onClick={() => handleInputChange('stress_level', lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              id="predict-submit-btn"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Calculating Score...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  <span>Predict Mental Health Score</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="form-reset-btn"
              className="reset-btn"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Prediction Results & Analytics Column */}
        <aside className="result-column">
          {result ? (
            <div
              className="result-card"
              style={{
                '--card-accent': result.status_color,
                '--glow-color': result.status_color,
              }}
            >
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Predicted Mental Health Score
              </h3>

              <div className="score-circle-container">
                <div className="score-dial">
                  <span className="score-number">{result.mental_health_score}</span>
                  <span className="score-max">out of 10</span>
                </div>
              </div>

              <div
                className="category-badge"
                style={{
                  backgroundColor: `${result.status_color}20`,
                  borderColor: result.status_color,
                  color: result.status_color,
                }}
              >
                ● {result.category}
              </div>

              <div className="recommendation-box">
                <div className="recommendation-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Personalized Insights
                </div>
                <p>{result.recommendation}</p>
              </div>

              {/* Lifestyle Summary Indicators */}
              <div className="stats-summary-grid">
                <div className="stat-box">
                  <div className="stat-box-label">Sleep Adequacy</div>
                  <div className="stat-box-value">
                    {result.inputs.sleep_hours_per_night >= 7 ? '✅ Healthy' : '⚠️ Short'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-box-label">Screen Load</div>
                  <div className="stat-box-value">
                    {result.inputs.avg_daily_usage_hours > 5 ? '⚠️ Elevated' : '✅ Moderate'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-box-label">Study Balance</div>
                  <div className="stat-box-value">
                    {result.inputs.study_hours} hrs/day
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-box-label">Self Stress</div>
                  <div className="stat-box-value">
                    {result.inputs.stress_level}
                  </div>
                </div>
              </div>

              {/* Model Confidence & Scoring Precision */}
              <div className="model-confidence-widget">
                <div className="model-confidence-header">
                  <span>Model Confidence &amp; Scoring Precision</span>
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.7rem' }}>● Deployed RF Pipeline</span>
                </div>
                <div className="confidence-row">
                  <div className="confidence-metrics">
                    <div className="confidence-item">
                      <span>Test R² (Accuracy)</span>
                      <span>{(modelDetails.metrics.test_r2 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="confidence-item">
                      <span>Mean Point Error</span>
                      <span>±{modelDetails.metrics.test_mae.toFixed(2)} pts</span>
                    </div>
                    <div className="confidence-item">
                      <span>RMSE Error</span>
                      <span>{modelDetails.metrics.test_rmse.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="view-details-link-btn"
                    onClick={() => setIsModalOpen(true)}
                    id="card-model-details-link"
                  >
                    View Scores &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="result-card">
              <div className="result-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <h3>Ready to Predict</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Adjust the student metrics or pick a quick preset above, then click <strong>Predict Mental Health Score</strong> to see the model output.
                </p>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', width: '100%' }}>
                  <button
                    type="button"
                    className="view-details-link-btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ margin: '0 auto', fontSize: '0.85rem' }}
                    id="empty-model-details-link"
                  >
                    📊 View Trained Model Details &amp; Accuracy Scores →
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
        </>
      )}

      {/* Quick Model Details Modal */}
      <ModelDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={modelDetails}
      />
    </div>
  );
}
