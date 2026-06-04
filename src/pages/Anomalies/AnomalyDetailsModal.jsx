import React, { useState } from "react";

export default function AnomalyDetailsModal({ anomaly, onClose, onResolve }) {
  const [action, setAction] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(anomaly.status);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "critical": return "#dc2626";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case "technique": return "🔧 Technique";
      case "logistique": return "📦 Logistique";
      case "comportementale": return "👤 Comportementale";
      case "administrative": return "📋 Administrative";
      default: return category;
    }
  };

  const handleResolve = () => {
    if (action) {
      onResolve(anomaly.id, { action, comment });
      onClose();
    } else {
      alert("Veuillez sélectionner une action corrective");
    }
  };

  const severityColor = getSeverityColor(anomaly.severity);

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header" style={{ borderBottom: `3px solid ${severityColor}` }}>
          <h2>🔍 Détails de l'anomalie - {anomaly.id}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="anomaly-details-header">
            <div className="anomaly-type-large">
              <span className="anomaly-icon-large">{anomaly.icon}</span>
              <div>
                <h3>{anomaly.label}</h3>
                <p className="anomaly-description">{anomaly.description}</p>
              </div>
            </div>
            <div className="anomaly-meta">
              <span className="meta-item">🕒 {new Date(anomaly.timestamp).toLocaleString('fr')}</span>
              <span className="meta-item">📍 {anomaly.salle}</span>
              <span className="meta-item">👤 {anomaly.surveillant}</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-title">📊 Niveaux de criticité</div>
              <div className="severity-indicator" style={{ background: severityColor }}>
                {anomaly.severity === "critical" ? "Critique - Intervention immédiate requise" :
                 anomaly.severity === "high" ? "Élevée - Intervention rapide nécessaire" :
                 anomaly.severity === "medium" ? "Moyenne - À traiter dans les plus brefs délais" :
                 "Basse - À planifier"}
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-title">📂 Catégorie</div>
              <div className="category-info">
                <span className="category-badge-large">{getCategoryLabel(anomaly.category)}</span>
              </div>
            </div>

            {anomaly.etudiant && (
              <div className="detail-card">
                <div className="detail-title">🎓 Étudiant concerné</div>
                <div className="student-info">
                  <div className="student-name">{anomaly.etudiant.prenom} {anomaly.etudiant.nom}</div>
                  <div className="student-id">ID: {anomaly.etudiant.id}</div>
                </div>
              </div>
            )}

            <div className="detail-card">
              <div className="detail-title">📈 Impact</div>
              <div className="impact-info">
                <div>👥 Étudiants affectés: {anomaly.impact?.etudiants_affectes || "N/A"}</div>
                <div>⏱️ Durée estimée: {anomaly.impact?.duree || "N/A"} minutes</div>
              </div>
            </div>

            {anomaly.resolution && (
              <div className="detail-card">
                <div className="detail-title">✅ Résolution</div>
                <div className="resolution-info">
                  <div>🔧 Action: {anomaly.resolution.action}</div>
                  <div>👤 Résolu par: {anomaly.resolution.resolvedBy}</div>
                  <div>📅 Date: {new Date(anomaly.resolution.resolvedAt).toLocaleString('fr')}</div>
                  <div>💬 Commentaire: {anomaly.resolution.comment}</div>
                </div>
              </div>
            )}

            {anomaly.status !== "resolue" && (
              <div className="detail-card">
                <div className="detail-title">🔧 Traitement</div>
                <div className="form-group">
                  <label>Action corrective</label>
                  <select value={action} onChange={(e) => setAction(e.target.value)} className="form-select">
                    <option value="">Sélectionner une action</option>
                    <option value="maintenance_technique">Maintenance technique</option>
                    <option value="recalibrage_capteurs">Recalibrage des capteurs</option>
                    <option value="intervention_humaine">Intervention humaine</option>
                    <option value="signalement_direction">Signalement à la direction</option>
                    <option value="reprogrammation">Reprogrammation système</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Commentaire</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-textarea" rows="3" placeholder="Détails sur l'intervention..." />
                </div>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-title">ℹ️ Recommandations</div>
            <div className="info-text">
              • Vérifier les logs système pour plus de détails<br />
              • {anomaly.severity === "critical" ? "Intervention immédiate requise" : 
                 anomaly.severity === "high" ? "Intervention dans les 24 heures" :
                 "Planifier la résolution dans la semaine"}<br />
              • Documenter la procédure de résolution
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Fermer</button>
          {anomaly.status !== "resolue" && (
            <button className="btn-resolve" onClick={handleResolve}>
              ✅ Marquer comme résolue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}