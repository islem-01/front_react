import React from "react";

export default function ExamDetailsModal({ exam, onClose, onEdit, onDelete }) {
  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Planifié": return <span className="statut-badge planifie">📅 Planifié</span>;
      case "En cours": return <span className="statut-badge encours">▶ En cours</span>;
      case "Terminé": return <span className="statut-badge termine">✅ Terminé</span>;
      case "Annulé": return <span className="statut-badge annule">❌ Annulé</span>;
      case "Reporté": return <span className="statut-badge reporte">⏰ Reporté</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getPresenceRate = () => {
    if (exam.nbrEtudiants === 0) return 0;
    return Math.round((exam.nbrPresent / exam.nbrEtudiants) * 100);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>📋 Détails de l'examen</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="exam-details-header">
            <div>
              <h3>{exam.matiere}</h3>
              <p className="exam-code-detail">{exam.code}</p>
            </div>
            {getStatutBadge(exam.statut)}
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-title">📚 Informations académiques</div>
              <div className="detail-row"><span>Niveau:</span><strong>{exam.niveau}</strong></div>
              <div className="detail-row"><span>Filière:</span><strong>{exam.filiere}</strong></div>
              <div className="detail-row"><span>Groupe:</span><strong>{exam.groupe}</strong></div>
              <div className="detail-row"><span>Nombre d'étudiants:</span><strong>{exam.nbrEtudiants}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">👨‍🏫 Surveillance</div>
              <div className="detail-row"><span>Professeur principal:</span><strong>{exam.professeur}</strong></div>
              {exam.coProfesseur && <div className="detail-row"><span>Co-professeur:</span><strong>{exam.coProfesseur}</strong></div>}
            </div>
            <div className="detail-card">
              <div className="detail-title">🏛️ Lieu et horaire</div>
              <div className="detail-row"><span>Salle:</span><strong>{exam.salle}</strong></div>
              <div className="detail-row"><span>Date:</span><strong>{exam.date}</strong></div>
              <div className="detail-row"><span>Horaire:</span><strong>{exam.heureDebut} - {exam.heureFin}</strong></div>
              <div className="detail-row"><span>Durée:</span><strong>{exam.duree} heures</strong></div>
            </div>
            {exam.statut === "Terminé" && (
              <div className="detail-card">
                <div className="detail-title">📊 Statistiques</div>
                <div className="detail-row"><span>Présents:</span><strong>{exam.nbrPresent}</strong></div>
                <div className="detail-row"><span>Absents:</span><strong>{exam.nbrAbsent}</strong></div>
                <div className="detail-row"><span>Taux de présence:</span><strong>{getPresenceRate()}%</strong></div>
                <div className="presence-bar-detail">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${getPresenceRate()}%` }}></div>
                  </div>
                </div>
              </div>
            )}
            {exam.observations && (
              <div className="detail-card full-width">
                <div className="detail-title">📝 Observations</div>
                <div className="detail-row"><span>{exam.observations}</span></div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-edit" onClick={onEdit}>✏️ Modifier</button>
          <button className="btn-delete" onClick={onDelete}>🗑️ Supprimer</button>
          <button className="btn-cancel" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}