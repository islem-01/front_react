import React from "react";

export default function ExamDetailsModal({ exam, onClose, onEdit, onDelete }) {
  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Planifié": return <span className="statut-badge planifie"><i className="fas fa-calendar-alt"></i> Planifié</span>;
      case "En cours": return <span className="statut-badge encours"><i className="fas fa-play-circle"></i> En cours</span>;
      case "Terminé": return <span className="statut-badge termine"><i className="fas fa-check-circle"></i> Terminé</span>;
      case "Annulé": return <span className="statut-badge annule"><i className="fas fa-ban"></i> Annulé</span>;
      case "Reporté": return <span className="statut-badge reporte"><i className="fas fa-clock"></i> Reporté</span>;
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
          <h2>
            <i className="fas fa-file-alt"></i> Détails de l'examen
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          {/* En-tête */}
          <div className="exam-details-header">
            <div>
              <h3>{exam.matiere}</h3>
              <p className="exam-code-detail"><i className="fas fa-barcode"></i> {exam.code}</p>
            </div>
            {getStatutBadge(exam.statut)}
          </div>

          {/* Grille des informations */}
          <div className="details-grid">
            {/* Informations académiques */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-graduation-cap"></i> Informations académiques
              </div>
              <div className="detail-row">
                <span><i className="fas fa-layer-group"></i> Niveau:</span>
                <strong>{exam.niveau}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-book"></i> Filière:</span>
                <strong>{exam.filiere}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-users"></i> Groupe:</span>
                <strong>{exam.groupe}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-user-graduate"></i> Nombre d'étudiants:</span>
                <strong>{exam.nbrEtudiants}</strong>
              </div>
            </div>

            {/* Surveillance */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-chalkboard-user"></i> Surveillance
              </div>
              <div className="detail-row">
                <span><i className="fas fa-user-tie"></i> Professeur principal:</span>
                <strong>{exam.professeur}</strong>
              </div>
              {exam.coProfesseur && (
                <div className="detail-row">
                  <span><i className="fas fa-user-friends"></i> Co-professeur:</span>
                  <strong>{exam.coProfesseur}</strong>
                </div>
              )}
            </div>

            {/* Lieu et horaire */}
            <div className="detail-card">
              <div className="detail-title">
                <i className="fas fa-clock"></i> Lieu et horaire
              </div>
              <div className="detail-row">
                <span><i className="fas fa-door-open"></i> Salle:</span>
                <strong>{exam.salle}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-calendar-day"></i> Date:</span>
                <strong>{exam.date}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-clock"></i> Horaire:</span>
                <strong>{exam.heureDebut} - {exam.heureFin}</strong>
              </div>
              <div className="detail-row">
                <span><i className="fas fa-hourglass-half"></i> Durée:</span>
                <strong>{exam.duree} heures</strong>
              </div>
            </div>

            {/* Statistiques (si terminé) */}
            {exam.statut === "Terminé" && (
              <div className="detail-card">
                <div className="detail-title">
                  <i className="fas fa-chart-line"></i> Statistiques
                </div>
                <div className="detail-row">
                  <span><i className="fas fa-user-check"></i> Présents:</span>
                  <strong className="stat-value-green">{exam.nbrPresent}</strong>
                </div>
                <div className="detail-row">
                  <span><i className="fas fa-user-times"></i> Absents:</span>
                  <strong className="stat-value-red">{exam.nbrAbsent}</strong>
                </div>
                <div className="detail-row">
                  <span><i className="fas fa-percent"></i> Taux de présence:</span>
                  <strong className="stat-value-blue">{getPresenceRate()}%</strong>
                </div>
                <div className="presence-bar-detail">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${getPresenceRate()}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Observations */}
            {exam.observations && (
              <div className="detail-card full-width">
                <div className="detail-title">
                  <i className="fas fa-sticky-note"></i> Observations
                </div>
                <div className="detail-row">
                  <span><i className="fas fa-comment"></i> {exam.observations}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="modal-footer">
          <button className="btn-edit" onClick={onEdit}>
            <i className="fas fa-edit"></i> Modifier
          </button>
          <button className="btn-delete" onClick={onDelete}>
            <i className="fas fa-trash-alt"></i> Supprimer
          </button>
          <button className="btn-cancel" onClick={onClose}>
            <i className="fas fa-times"></i> Fermer
          </button>
        </div>
      </div>

      <style>{`
        .exam-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .exam-details-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .exam-code-detail {
          font-size: 12px;
          color: #64748b;
          font-family: monospace;
        }
        
        .exam-code-detail i {
          margin-right: 4px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .detail-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
        }
        
        .detail-card.full-width {
          grid-column: 1 / -1;
        }
        
        .detail-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .detail-title i {
          color: #3b82f6;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row span {
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .detail-row span i {
          font-size: 12px;
          width: 16px;
          color: #3b82f6;
        }
        
        .detail-row strong {
          color: #1e293b;
          font-weight: 600;
        }
        
        .stat-value-green {
          color: #10b981 !important;
        }
        
        .stat-value-red {
          color: #ef4444 !important;
        }
        
        .stat-value-blue {
          color: #3b82f6 !important;
        }
        
        .presence-bar-detail {
          margin-top: 12px;
        }
        
        .progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 10px;
          transition: width 0.3s;
        }
        
        .statut-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .statut-badge.planifie {
          background: #eff6ff;
          color: #3b82f6;
        }
        
        .statut-badge.encours {
          background: #fef3c7;
          color: #d97706;
        }
        
        .statut-badge.termine {
          background: #dcfce7;
          color: #10b981;
        }
        
        .statut-badge.annule {
          background: #fee2e2;
          color: #ef4444;
        }
        
        .statut-badge.reporte {
          background: #fef3c7;
          color: #d97706;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        
        .btn-edit, .btn-delete, .btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .btn-edit {
          background: #fef3c7;
          color: #d97706;
        }
        
        .btn-edit:hover {
          background: #d97706;
          color: white;
        }
        
        .btn-delete {
          background: #fee2e2;
          color: #ef4444;
        }
        
        .btn-delete:hover {
          background: #ef4444;
          color: white;
        }
        
        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }
        
        .btn-cancel:hover {
          background: #e2e8f0;
        }
        
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .modal-footer {
            flex-wrap: wrap;
          }
          
          .btn-edit, .btn-delete, .btn-cancel {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}