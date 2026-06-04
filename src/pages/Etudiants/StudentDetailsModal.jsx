import React from "react";
import "./EtudiantsPage.css";

export default function StudentDetailsModal({ student, onClose, onEdit, onDelete }) {
  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Actif": return <span className="statut-badge actif">🟢 Actif</span>;
      case "Suspendu": return <span className="statut-badge suspendu">🟡 Suspendu</span>;
      case "Diplômé": return <span className="statut-badge diplome">🎓 Diplômé</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>👨‍🎓 Détails de l'étudiant</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="student-details-header">
            <div className="student-details-photo">{student.photo}</div>
            <div className="student-details-name">
              <h3>{student.prenom} {student.nom}</h3>
              <p className="student-id-detail">ID: {student.id}</p>
              {getStatutBadge(student.statut)}
            </div>
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-title">📚 Informations académiques</div>
              <div className="detail-row"><span>Niveau:</span><strong>{student.niveau}</strong></div>
              <div className="detail-row"><span>Filière:</span><strong>{student.filiere}</strong></div>
              <div className="detail-row"><span>Groupe:</span><strong>Groupe {student.groupe}</strong></div>
              <div className="detail-row"><span>Année d'inscription:</span><strong>{student.inscription}</strong></div>
              <div className="detail-row"><span>Moyenne générale:</span><strong>{student.moyenne}/20</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">📞 Informations personnelles</div>
              <div className="detail-row"><span>CIN:</span><strong>{student.cin}</strong></div>
              <div className="detail-row"><span>Date naissance:</span><strong>{student.dateNaissance}</strong></div>
              <div className="detail-row"><span>Lieu naissance:</span><strong>{student.lieuNaissance}</strong></div>
              <div className="detail-row"><span>Email:</span><strong>{student.email}</strong></div>
              <div className="detail-row"><span>Téléphone:</span><strong>{student.phone}</strong></div>
            </div>
            <div className="detail-card full-width">
              <div className="detail-title">📍 Adresse</div>
              <div className="detail-row"><span>{student.adresse}</span></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">📊 Statistiques</div>
              <div className="detail-row"><span>Examens passés:</span><strong>{student.examens?.length || 0}</strong></div>
              <div className="detail-row"><span>Taux de présence:</span><strong>{Math.round((student.presence / 30) * 100)}%</strong></div>
            </div>
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