import React from "react";

export default function TeacherDetailsModal({ teacher, onClose, onEdit, onDelete }) {
  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Permanent": return <span className="statut-badge permanent">✅ Permanent</span>;
      case "Contractuel": return <span className="statut-badge contractuel">📝 Contractuel</span>;
      case "Vacataire": return <span className="statut-badge vacataire">⏳ Vacataire</span>;
      case "Chercheur": return <span className="statut-badge chercheur">🔬 Chercheur</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getGradeBadge = (grade) => {
    switch(grade) {
      case "Professeur": return <span className="grade-badge professeur">👨‍🏫 Professeur</span>;
      case "Maître de conférences": return <span className="grade-badge maitre">📖 Maître de conférences</span>;
      case "Maître assistant": return <span className="grade-badge assistant">📚 Maître assistant</span>;
      default: return <span className="grade-badge">{grade}</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>👨‍🏫 Détails de l'enseignant</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="teacher-details-header">
            <div className="teacher-details-photo">{teacher.photo}</div>
            <div className="teacher-details-name">
              <h3>{teacher.prenom} {teacher.nom}</h3>
              <p className="teacher-id-detail">ID: {teacher.id}</p>
              <div className="teacher-badges">
                {getGradeBadge(teacher.grade)}
                {getStatutBadge(teacher.statut)}
              </div>
            </div>
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-title">📚 Informations académiques</div>
              <div className="detail-row"><span>Filière:</span><strong>{teacher.filiere}</strong></div>
              <div className="detail-row"><span>Spécialités:</span><strong>{teacher.specialites?.join(", ")}</strong></div>
              <div className="detail-row"><span>Diplôme:</span><strong>{teacher.diplome || "Doctorat"}</strong></div>
              <div className="detail-row"><span>Université d'origine:</span><strong>{teacher.universiteOrigine || "Université de Tunis"}</strong></div>
              <div className="detail-row"><span>Date d'embauche:</span><strong>{teacher.dateEmbauche}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">📞 Coordonnées</div>
              <div className="detail-row"><span>Email:</span><strong>{teacher.email}</strong></div>
              <div className="detail-row"><span>Téléphone:</span><strong>{teacher.phone}</strong></div>
              <div className="detail-row"><span>Bureau:</span><strong>{teacher.bureau}</strong></div>
              <div className="detail-row"><span>Contact urgence:</span><strong>{teacher.contactUrgence}</strong></div>
              <div className="detail-row"><span>Adresse:</span><strong>{teacher.adresse}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">📊 Statistiques</div>
              <div className="detail-row"><span>Examens supervisés:</span><strong>{teacher.examensSupervises}</strong></div>
              <div className="detail-row"><span>Étudiants encadrés:</span><strong>{teacher.etudiantsEncadres}</strong></div>
              <div className="detail-row"><span>Publications:</span><strong>{teacher.publications}</strong></div>
              <div className="detail-row"><span>Projets de recherche:</span><strong>{teacher.projets}</strong></div>
            </div>
            <div className="detail-card">
              <div className="detail-title">⏰ Disponibilités</div>
              {teacher.disponibilites?.map((disp, i) => (
                <div key={i} className="detail-row"><span>Créneau {i+1}:</span><strong>{disp}</strong></div>
              ))}
              <div className="detail-row"><span>Cours enseignés:</span><strong>{teacher.cours?.join(", ")}</strong></div>
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