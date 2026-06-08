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
          <h2>
            <i className="fas fa-bell" style={{ color: severityColor }}></i>
            Détails de l'alerte - {alert.id}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {/* Chaîne de détection */}
          <div className="detection-chain">
            <div className="chain-step">
              <i className="fas fa-video"></i>
              <span>Vidéo</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow-small"></i>
            <div className="chain-step">
              <i className="fas fa-microchip"></i>
              <span>IA</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow-small"></i>
            <div className="chain-step active">
              <i className="fas fa-draw-polygon"></i>
              <span>Zone {alert.seatId}</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow-small"></i>
            <div className="chain-step">
              <i className="fas fa-chair"></i>
              <span>Siège {alert.seatId}</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow-small"></i>
            <div className="chain-step">
              <i className="fas fa-user-graduate"></i>
              <span>{alert.etudiant.prenom} {alert.etudiant.nom}</span>
            </div>
          </div>

          {/* En-tête alerte */}
          <div className="alert-details-header" style={{ borderLeft: `4px solid ${severityColor}`, paddingLeft: "1rem", marginTop: "1rem" }}>
            <div className="alert-type-large">
              <span className="alert-icon-large">
                <i className={`fas ${alert.icon}`} style={{ color: severityColor }}></i>
              </span>
              <div>
                <h3>{alert.label}</h3>
                <p className="alert-description">
                  Comportement suspect détecté dans la zone du siège {alert.seatId}
                </p>
              </div>
            </div>
            <div className="alert-meta">
              <span className="meta-item">
                <i className="fas fa-clock"></i> {new Date(alert.timestamp).toLocaleString('fr')}
              </span>
              <span className="meta-item">
                <i className="fas fa-chart-line"></i> Confiance IA: {alert.aiConfidence}%
              </span>
              <span className="meta-item">
                <i className="fas fa-door-open"></i> {alert.salle}
              </span>
            </div>
          </div>

          <div className="details-grid">
            {/* Étudiant */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-user-graduate"></i> Étudiant concerné
              </div>
              <div className="student-detail">
                <div className="student-avatar">
                  {alert.etudiant.prenom.charAt(0)}{alert.etudiant.nom.charAt(0)}
                </div>
                <div>
                  <div className="student-name">{alert.etudiant.prenom} {alert.etudiant.nom}</div>
                  <div className="student-id">
                    <i className="fas fa-id-card"></i> ID: {alert.etudiant.id}
                  </div>
                  <div className="student-seat">
                    <i className="fas fa-chair"></i> Siège: {alert.seatId}
                  </div>
                </div>
              </div>
            </div>

            {/* Zone vidéo */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-draw-polygon"></i> Zone vidéo associée
              </div>
              <div className="zone-detail">
                <div className="zone-coordinates">
                  <code>
                    <i className="fas fa-map-marker-alt"></i> Zone: {alert.seatId}
                  </code>
                </div>
                <div className="zone-visualization">
                  <div className="video-zone-placeholder">
                    <div 
                      className="zone-highlight"
                      style={{
                        border: `2px solid ${severityColor}`,
                        backgroundColor: `${severityColor}20`
                      }}
                    >
                      <i className="fas fa-video" style={{ fontSize: "32px", color: severityColor }}></i>
                      <p>Zone de surveillance du siège {alert.seatId}</p>
                      <small>
                        <i className="fas fa-crosshairs"></i> Coordonnées: x={alert.seatCoordinates?.x || 'N/A'}, y={alert.seatCoordinates?.y || 'N/A'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examen */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-book-open"></i> Examen concerné
              </div>
              <div className="exam-detail">
                <div>
                  <i className="fas fa-flask"></i> <strong>Matière:</strong> {alert.examInfo?.matiere}
                </div>
                <div>
                  <i className="fas fa-calendar-alt"></i> <strong>Date:</strong> {alert.examInfo?.date}
                </div>
                <div>
                  <i className="fas fa-clock"></i> <strong>Horaire:</strong> {alert.examInfo?.heure}
                </div>
                <div>
                  <i className="fas fa-door-open"></i> <strong>Salle:</strong> {alert.salle}
                </div>
              </div>
            </div>

            {/* Captures */}
            {alert.screenshot && (
              <div className="detail-card">
                <div className="detail-title">
                  <i className="fas fa-camera"></i> Capture d'écran
                </div>
                <div className="screenshot-placeholder">
                  <div className="screenshot-mock">
                    <i className="fas fa-image"></i>
                    <p>Capture de la zone {alert.seatId}</p>
                    <small>
                      <i className="fas fa-clock"></i> {new Date(alert.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Traitement */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-tools"></i> Traitement
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i> Changer le statut
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                  <option value="nouvelle">
                    <i className="fas fa-circle" style={{ color: "#ef4444" }}></i> Nouvelle
                  </option>
                  <option value="en_cours">
                    <i className="fas fa-spinner" style={{ color: "#f59e0b" }}></i> En cours
                  </option>
                  <option value="traitee">
                    <i className="fas fa-check-circle" style={{ color: "#3b82f6" }}></i> Traitée
                  </option>
                  <option value="resolue">
                    <i className="fas fa-check-double" style={{ color: "#10b981" }}></i> Résolue
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-gavel"></i> Action corrective
                </label>
                <select value={action} onChange={(e) => setAction(e.target.value)} className="form-select">
                  <option value="">Sélectionner une action</option>
                  <option value="avertissement_verbal">
                    <i className="fas fa-comment-dots"></i> Avertissement verbal
                  </option>
                  <option value="confiscation_telephone">
                    <i className="fas fa-mobile-alt"></i> Confiscation du téléphone
                  </option>
                  <option value="changement_place">
                    <i className="fas fa-exchange-alt"></i> Changement de place
                  </option>
                  <option value="exclusion">
                    <i className="fas fa-ban"></i> Exclusion de l'examen
                  </option>
                  <option value="rapport_disciplinaire">
                    <i className="fas fa-file-alt"></i> Rapport disciplinaire
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-comment"></i> Commentaire
                </label>
                <textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  className="form-textarea" 
                  rows="3" 
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>

            {/* Recommandations IA */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-robot"></i> Recommandations IA
              </div>
              <div className="ai-recommendations">
                <p>
                  <i className="fas fa-chart-line"></i> Analyse vidéo en temps réel: Comportement suspect détecté avec {alert.aiConfidence}% de confiance
                </p>
                <p>
                  <i className="fas fa-draw-polygon"></i> Zone concernée: Siège {alert.seatId}
                </p>
                <p>
                  <i className="fas fa-lightbulb"></i> Recommandation: {
                    alert.severity === "critical" ? "Intervention immédiate requise" : 
                    alert.severity === "high" ? "Surveillance renforcée" :
                    "À surveiller"
                  }
                </p>
                <p className="note">
                  <i className="fas fa-info-circle"></i>
                  Note: La détection est basée sur l'analyse de la zone, sans reconnaissance faciale.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            <i className="fas fa-times"></i> Annuler
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <i className="fas fa-save"></i> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}