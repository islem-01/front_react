import React, { useState } from 'react';

export default function TeacherAlerts({ user }) {
  const [alerts, setAlerts] = useState([
    { id: 1, etudiant: "Ahmed Ben Ali", salle: "A12", seat: "B3", type: "abnormal", confidence: 82, timestamp: "2026-06-15 09:23", status: "nouvelle", description: "Mouvements suspects répétés", videoUrl: "#" },
    { id: 2, etudiant: "Sofia Touati", salle: "A12", seat: "C2", type: "suspect", confidence: 67, timestamp: "2026-06-15 09:15", status: "en_cours", description: "Regards fréquents vers le voisin", videoUrl: "#" },
    { id: 3, etudiant: "Karim Dridi", salle: "B05", seat: "A4", type: "abnormal", confidence: 91, timestamp: "2026-06-15 09:05", status: "traitee", description: "Téléphone visible", videoUrl: "#" },
    { id: 4, etudiant: "Leila Hamdi", salle: "A12", seat: "D1", type: "suspect", confidence: 58, timestamp: "2026-06-15 08:52", status: "traitee", description: "Regards suspects", videoUrl: "#" }
  ]);

  const [filter, setFilter] = useState("tous");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [comment, setComment] = useState("");

  const filteredAlerts = alerts.filter(a => filter === "tous" || a.status === filter);

  const getTypeBadge = (type) => {
    if (type === "abnormal") return <span className="type-badge abnormal">⚠️ Anormal</span>;
    return <span className="type-badge suspect">◉ Suspect</span>;
  };

  const getStatusBadge = (status) => {
    if (status === "nouvelle") return <span className="status-badge new">🟡 Nouvelle</span>;
    if (status === "en_cours") return <span className="status-badge pending">🔵 En cours</span>;
    return <span className="status-badge done">🟢 Traitée</span>;
  };

  const handleMarkAsReviewed = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "traitee" } : a));
    setSelectedAlert(null);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      alert(`Commentaire ajouté: ${comment}`);
      setComment("");
    }
  };

  return (
    <div className="teacher-alerts">
      <div className="filters-bar">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === "tous" ? "active" : ""}`} onClick={() => setFilter("tous")}>Toutes</button>
          <button className={`filter-tab ${filter === "nouvelle" ? "active" : ""}`} onClick={() => setFilter("nouvelle")}>Nouvelles</button>
          <button className={`filter-tab ${filter === "en_cours" ? "active" : ""}`} onClick={() => setFilter("en_cours")}>En cours</button>
          <button className={`filter-tab ${filter === "traitee" ? "active" : ""}`} onClick={() => setFilter("traitee")}>Traitées</button>
        </div>
      </div>

      <div className="alerts-table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Étudiant</th>
              <th>Salle/Place</th>
              <th>Type</th>
              <th>Confiance</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map(alert => (
              <tr key={alert.id} className={`alert-row ${alert.type}`}>
                <td>{new Date(alert.timestamp).toLocaleTimeString()}</td>
                <td><strong>{alert.etudiant}</strong></td>
                <td>{alert.salle} · {alert.seat}</td>
                <td>{getTypeBadge(alert.type)}</td>
                <td>
                  <div className="confidence-cell">
                    <span className="confidence-value">{alert.confidence}%</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${alert.confidence}%` }}></div>
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(alert.status)}</td>
                <td>
                  <button className="btn-view" onClick={() => setSelectedAlert(alert)}>
                    <i className="fas fa-eye"></i>
                  </button>
                  {alert.status !== "traitee" && (
                    <button className="btn-check" onClick={() => handleMarkAsReviewed(alert.id)}>
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Détails Alerte */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'alerte</h3>
              <button className="close" onClick={() => setSelectedAlert(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert-detail-grid">
                <div className="detail-card">
                  <h4><i className="fas fa-user"></i> Étudiant</h4>
                  <p><strong>Nom:</strong> {selectedAlert.etudiant}</p>
                  <p><strong>Salle:</strong> {selectedAlert.salle}</p>
                  <p><strong>Place:</strong> {selectedAlert.seat}</p>
                </div>
                <div className="detail-card">
                  <h4><i className="fas fa-robot"></i> Analyse IA</h4>
                  <p><strong>Type:</strong> {getTypeBadge(selectedAlert.type)}</p>
                  <p><strong>Confiance:</strong> {selectedAlert.confidence}%</p>
                  <p><strong>Description:</strong> {selectedAlert.description}</p>
                </div>
              </div>
              
              <div className="video-preview">
                <h4><i className="fas fa-video"></i> Extrait vidéo</h4>
                <video controls width="100%">
                  <source src={selectedAlert.videoUrl} type="video/mp4" />
                </video>
                <div className="video-timeline">
                  <span>Comportement suspect détecté à 09:23:14</span>
                  <div className="timeline-bar">
                    <div className="timeline-marker" style={{ left: "65%" }}></div>
                  </div>
                </div>
              </div>

              <div className="comment-section">
                <h4><i className="fas fa-comment"></i> Observations</h4>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire sur cet incident..."
                  rows="3"
                ></textarea>
                <button className="btn-add-comment" onClick={handleAddComment}>
                  <i className="fas fa-paper-plane"></i> Ajouter
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => handleMarkAsReviewed(selectedAlert.id)}>
                <i className="fas fa-check-circle"></i> Marquer comme traitée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}