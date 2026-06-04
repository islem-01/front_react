import React, { useState } from "react";

export default function AlertDetailsModal({ alert, onClose, onUpdateStatus }) {
  const [action, setAction] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(alert.status);

  const handleSubmit = () => {
    if (action) {
      alert(`Action "${action}" enregistrée avec succès !`);
    }
    if (status !== alert.status) {
      onUpdateStatus(alert.id, status);
    }
    onClose();
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "critical": return "#dc2626";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const severityColor = getSeverityColor(alert.severity);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>📋 Détails de l'alerte - {alert.id}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="alert-details-header" style={{ borderLeft: `4px solid ${severityColor}`, paddingLeft: "1rem" }}>
            <div className="alert-type-large">
              <span className="alert-icon-large">{alert.icon}</span>
              <div>
                <h3>{alert.label}</h3>
                <p className="alert-description">{alert.description}</p>
              </div>
            </div>
            <div className="alert-meta">
              <span className="meta-item">🕒 {new Date(alert.timestamp).toLocaleString('fr')}</span>
              <span className="meta-item">📊 Confiance IA: {alert.aiConfidence}%</span>
              <span className="meta-item">🏛️ {alert.salle}</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-title">🎓 Étudiant concerné</div>
              <div className="student-detail">
                <div className="student-avatar">{alert.etudiant.prenom.charAt(0)}{alert.etudiant.nom.charAt(0)}</div>
                <div>
                  <div className="student-name">{alert.etudiant.prenom} {alert.etudiant.nom}</div>
                  <div className="student-id">ID: {alert.etudiant.id}</div>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-title">📝 Examen concerné</div>
              <div className="exam-detail">
                <div><strong>Matière:</strong> {alert.examInfo?.matiere}</div>
                <div><strong>Date:</strong> {alert.examInfo?.date}</div>
                <div><strong>Horaire:</strong> {alert.examInfo?.heure}</div>
              </div>
            </div>

            {alert.screenshot && (
              <div className="detail-card">
                <div className="detail-title">📸 Capture d'écran</div>
                <div className="screenshot-placeholder">
                  [Image de surveillance - Capture d'écran]
                </div>
              </div>
            )}

            {alert.video && (
              <div className="detail-card">
                <div className="detail-title">🎥 Enregistrement vidéo</div>
                <div className="video-placeholder">
                  [Vidéo de surveillance - 30 secondes]
                </div>
              </div>
            )}

            <div className="detail-card">
              <div className="detail-title">🔧 Traitement</div>
              <div className="form-group">
                <label>Changer le statut</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                  <option value="nouvelle">🟡 Nouvelle</option>
                  <option value="en_cours">🔵 En cours</option>
                  <option value="traitee">🟢 Traitée</option>
                  <option value="resolue">✅ Résolue</option>
                </select>
              </div>
              <div className="form-group">
                <label>Action corrective</label>
                <select value={action} onChange={(e) => setAction(e.target.value)} className="form-select">
                  <option value="">Sélectionner une action</option>
                  <option value="avertissement_verbal">Avertissement verbal</option>
                  <option value="confiscation_telephone">Confiscation du téléphone</option>
                  <option value="changement_place">Changement de place</option>
                  <option value="exclusion">Exclusion de l'examen</option>
                  <option value="rapport_disciplinaire">Rapport disciplinaire</option>
                </select>
              </div>
              <div className="form-group">
                <label>Commentaire</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-textarea" rows="3" placeholder="Ajouter un commentaire..." />
              </div>
            </div>

            {alert.traitement && (
              <div className="detail-card">
                <div className="detail-title">📋 Historique du traitement</div>
                <div className="history-item">
                  <div><strong>Traité par:</strong> {alert.traitement.par}</div>
                  <div><strong>Action:</strong> {alert.traitement.action}</div>
                  <div><strong>Date:</strong> {new Date(alert.traitement.date).toLocaleString('fr')}</div>
                </div>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-title">ℹ️ Recommandations IA</div>
            <div className="info-text">
              • Analyse vidéo en temps réel: Comportement suspect détecté avec {alert.aiConfidence}% de confiance<br />
              • Recommandation: {alert.severity === "critical" ? "Intervention immédiate requise" : "Surveillance renforcée recommandée"}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-save" onClick={handleSubmit}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}