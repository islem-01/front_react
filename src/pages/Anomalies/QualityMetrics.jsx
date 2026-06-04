import React from "react";

export default function QualityMetrics({ metrics, anomalies, onClose }) {
  const totalAnomalies = metrics.anomaliesParCategorie.reduce((sum, c) => sum + c.count, 0);
  const totalResolved = metrics.anomaliesParCategorie.reduce((sum, c) => sum + c.resolved, 0);
  const tauxGlobalResolution = (totalResolved / totalAnomalies) * 100;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>📊 Métriques de qualité - Contrôle qualité</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Score global */}
          <div className="quality-score">
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke="#1a3a8f" strokeWidth="8"
                  strokeDasharray={`${metrics.scoreGlobal * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="bold">{metrics.scoreGlobal}</text>
                <text x="50" y="70" textAnchor="middle" fill="#6b7280" fontSize="8">/100</text>
              </svg>
              <div className="score-label">Score qualité</div>
            </div>
            <div className="score-stats">
              <div className="score-item">
                <span className="score-value">{metrics.tauxResolution}%</span>
                <span className="score-label">Taux de résolution</span>
              </div>
              <div className="score-item">
                <span className="score-value">{metrics.dureeMoyenneResolution} min</span>
                <span className="score-label">Temps moyen résolution</span>
              </div>
            </div>
          </div>

          {/* Anomalies par catégorie */}
          <div className="chart-card">
            <h3>📊 Répartition par catégorie</h3>
            <div className="category-stats">
              {metrics.anomaliesParCategorie.map(cat => (
                <div key={cat.categorie} className="category-item">
                  <div className="category-header">
                    <span>{cat.categorie}</span>
                    <span>{cat.count} anomalies</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill resolved" style={{ width: `${(cat.resolved / cat.count) * 100}%`, background: "#16a34a" }}></div>
                    <div className="progress-fill unresolved" style={{ width: `${((cat.count - cat.resolved) / cat.count) * 100}%`, background: "#eab308" }}></div>
                  </div>
                  <div className="category-footer">
                    <span className="resolved">✅ {cat.resolved} résolues</span>
                    <span className="unresolved">⏳ {cat.count - cat.resolved} en attente</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tendance mensuelle */}
          <div className="chart-card">
            <h3>📈 Évolution mensuelle des anomalies</h3>
            <div className="trend-chart">
              {metrics.tendanceMensuelle.map((item, i) => (
                <div key={i} className="trend-column">
                  <div className="trend-bars">
                    <div className="bar anomalies" style={{ height: `${(item.anomalies / 25) * 100}%` }}></div>
                    <div className="bar resolues" style={{ height: `${(item.resolues / 25) * 100}%` }}></div>
                  </div>
                  <div className="trend-label">{item.mois}</div>
                </div>
              ))}
            </div>
            <div className="trend-legend">
              <span><span className="legend-color anomalies"></span> Nouvelles anomalies</span>
              <span><span className="legend-color resolues"></span> Anomalies résolues</span>
            </div>
          </div>

          {/* Indicateurs de performance */}
          <div className="kpi-grid small">
            <div className="kpi-card">
              <div className="kpi-icon">⏱️</div>
              <div className="kpi-info">
                <div className="kpi-value">{metrics.dureeMoyenneResolution} min</div>
                <div className="kpi-label">Temps moyen résolution</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">📈</div>
              <div className="kpi-info">
                <div className="kpi-value">{tauxGlobalResolution.toFixed(1)}%</div>
                <div className="kpi-label">Taux global résolution</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">⚠️</div>
              <div className="kpi-info">
                <div className="kpi-value">{anomalies.filter(a => a.severity === "critical").length}</div>
                <div className="kpi-label">Anomalies critiques</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-info">
                <div className="kpi-value">{anomalies.filter(a => a.status === "resolue").length}</div>
                <div className="kpi-label">Résolues cette période</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-title">📋 Recommandations qualité</div>
            <div className="info-text">
              • {metrics.tauxResolution < 80 ? "Améliorer le processus de résolution des anomalies" : "Maintenir l'efficacité de résolution"}<br />
              • {metrics.dureeMoyenneResolution > 60 ? "Optimiser les délais d'intervention" : "Délais de résolution conformes aux objectifs"}<br />
              • Mettre en place des actions préventives pour réduire les anomalies récurrentes
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}