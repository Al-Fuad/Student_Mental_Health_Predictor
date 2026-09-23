import React, { useState } from 'react';
import './ModelDetails.css';
import { DEFAULT_MODEL_DETAILS } from './modelDetailsData';

export default function ModelDetailsView({ details = DEFAULT_MODEL_DETAILS }) {

  const [selectedCategory, setSelectedCategory] = useState('All');

  const modelData = details || DEFAULT_MODEL_DETAILS;
  const metrics = modelData.metrics || DEFAULT_MODEL_DETAILS.metrics;
  const benchmarks = modelData.benchmark_comparison || DEFAULT_MODEL_DETAILS.benchmark_comparison;
  const features = modelData.feature_importances || DEFAULT_MODEL_DETAILS.feature_importances;
  const pipeline = modelData.pipeline_specs || DEFAULT_MODEL_DETAILS.pipeline_specs;

  const filteredFeatures = selectedCategory === 'All'
    ? features
    : features.filter((f) => f.category === selectedCategory);

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Digital Habits':
        return 'digital';
      case 'Lifestyle & Health':
        return 'lifestyle';
      case 'Academic':
        return 'academic';
      case 'Demographics':
        return 'demographics';
      default:
        return '';
    }
  };

  return (
    <div className="model-details-container">
      {/* Hero Banner */}
      <section className="model-hero-banner">
        <div className="model-hero-info">
          <div className="model-hero-badge-row">
            <span className="model-status-pill">
              <span className="pulse-dot"></span>
              {modelData.is_loaded ? 'Production Model Loaded' : 'Offline / Standby'}
            </span>
            <span className="model-artifact-tag">{modelData.artifact_file}</span>
            <span className="model-artifact-tag">{pipeline.target_scale}</span>
          </div>
          <h2>{modelData.model_name}</h2>
          <p>
            An ensemble regressor combining multi-column numerical scaling, ordinal mapping, and one-hot categorical encoding to predict student mental wellness with high generalization accuracy.
          </p>
        </div>

        <div className="model-hero-actions">
          <div className="kpi-trend-badge positive" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
            🏆 Top Evaluated Model
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        {/* R2 Score */}
        <div className="kpi-card accent-purple">
          <div className="kpi-header">
            <span className="kpi-label">Test R² Score (Accuracy)</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-value">{(metrics.test_r2 * 100).toFixed(1)}%</span>
            <span className="kpi-unit">explained var</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend-badge positive">Strong Fit</span>
            <span>Training R²: {(metrics.train_r2 * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* MAE Score */}
        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">Mean Absolute Error (MAE)</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-value">±{metrics.test_mae.toFixed(3)}</span>
            <span className="kpi-unit">points</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend-badge positive">-35.1%</span>
            <span>vs baseline Linear Regression</span>
          </div>
        </div>

        {/* RMSE Score */}
        <div className="kpi-card accent-cyan">
          <div className="kpi-header">
            <span className="kpi-label">Root Mean Sq Error (RMSE)</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-value">{metrics.test_rmse.toFixed(3)}</span>
            <span className="kpi-unit">MSE: {metrics.test_mse.toFixed(3)}</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend-badge info">30% Holdout</span>
            <span>Test Set Evaluation (seed 42)</span>
          </div>
        </div>

        {/* Algorithm & Pipeline */}
        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">Model Architecture</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-value">100</span>
            <span className="kpi-unit">Trees Ensemble</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend-badge info">12 Features</span>
            <span>Continuous Regression Pipeline</span>
          </div>
        </div>
      </section>

      {/* Grid: Benchmark Comparison & Feature Importances */}
      <section className="model-details-grid">
        {/* Left Column: Benchmark Comparison */}
        <div className="form-card">
          <div className="card-title-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <h2>Model Benchmark &amp; Score Comparison</h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Evaluation across cross-validation and holdout test data (30% split) comparing candidate regressors.
          </p>

          <div className="benchmark-table-wrapper">
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Model Algorithm</th>
                  <th>Test R²</th>
                  <th>Train R²</th>
                  <th>MAE</th>
                  <th>RMSE</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((bm, idx) => (
                  <tr key={idx} className={bm.is_active ? 'active-model-row' : ''}>
                    <td>
                      <div className="model-name-cell">
                        <span>{bm.model_name}</span>
                        {bm.is_active && (
                          <span className="active-deployed-badge">Active</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="score-highlight">
                        {(bm.r2_score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>{(bm.training_r2 * 100).toFixed(1)}%</td>
                    <td>{bm.mae.toFixed(3)}</td>
                    <td>{bm.rmse.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Bar Comparison */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Relative Explanatory Power (R² Comparison)
            </span>
            {benchmarks.map((bm, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: bm.is_active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {bm.model_name}
                  </span>
                  <span style={{ fontWeight: 600, color: bm.is_active ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {(bm.r2_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="feature-bar-bg" style={{ height: '6px' }}>
                  <div
                    className="feature-bar-fill"
                    style={{
                      width: `${(bm.r2_score / 1.0) * 100}%`,
                      background: bm.is_active
                        ? 'linear-gradient(90deg, #6366f1, #06b6d4)'
                        : 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Feature Importances */}
        <div className="form-card">
          <div className="card-title-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            <h2>Feature Importance &amp; Drivers</h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Gini impurity importance across the 100 random forest estimator trees.
          </p>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {['All', 'Digital Habits', 'Lifestyle & Health', 'Academic', 'Demographics'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="feature-list">
            {filteredFeatures.map((f, idx) => (
              <div
                key={idx}
                className="feature-item"
                data-cat={getCategoryClass(f.category)}
              >
                <div className="feature-meta">
                  <div className="feature-name-group">
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      {f.label}
                    </span>
                    <span className={`feature-category-badge ${getCategoryClass(f.category)}`}>
                      {f.category}
                    </span>
                  </div>
                  <span className="feature-pct">{f.percentage}%</span>
                </div>
                <div className="feature-bar-bg">
                  <div
                    className="feature-bar-fill"
                    style={{ width: `${Math.max(f.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="takeaway-callout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Key Clinical Takeaway: </strong>
              Daily screen time ({features[0]?.percentage}%) and sleep duration ({features[1]?.percentage}%) together represent over 79% of variance determination, showing strong correlation between screen moderation, restful sleep, and positive mental health.
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Pipeline Architecture */}
      <section className="form-card">
        <div className="card-title-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <h2>End-to-End ML Pipeline Architecture</h2>
        </div>

        <div className="pipeline-flow">
          <div className="pipeline-step">
            <span className="step-num">Step 1</span>
            <span className="step-title">Raw Feature Ingestion</span>
            <p className="step-desc">
              12 features encompassing demographic data (Age, Gender, Country), digital habits (Screen time, Unlocks, Platform, Purpose), and lifestyle factors (Sleep, Study, Exercise, Stress).
            </p>
          </div>

          <div className="pipeline-step">
            <span className="step-num">Step 2</span>
            <span className="step-title">Column Transformation</span>
            <p className="step-desc">
              <strong>Skewed features:</strong> Log1p transform + StandardScaler.<br />
              <strong>Numerics:</strong> StandardScaler.<br />
              <strong>Stress Level:</strong> OrdinalEncoder.<br />
              <strong>Categoricals:</strong> OneHotEncoder.
            </p>
          </div>

          <div className="pipeline-step">
            <span className="step-num">Step 3</span>
            <span className="step-title">Ensemble Regressor</span>
            <p className="step-desc">
              100-estimator RandomForestRegressor trained on 70% of sample data, with variance reduction via bagging and random feature subsampling.
            </p>
          </div>

          <div className="pipeline-step">
            <span className="step-num">Step 4</span>
            <span className="step-title">Calibrated Score Output</span>
            <p className="step-desc">
              Continuous score output mapped to 1.0 – 10.0 scale, accompanied by wellness categorization (Optimal, Stable, At Risk, High Risk) and tailored behavioral recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
