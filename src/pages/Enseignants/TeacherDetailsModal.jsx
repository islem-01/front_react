import React from "react";

export default function TeacherDetailsModal({ teacher, onClose, onEdit, onDelete, onToggleAccount, onResetPassword }) {
  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Permanent": return <span className="statut-badge permanent"><i className="fas fa-check-circle"></i> Permanent</span>;
      case "Contractuel": return <span className="statut-badge contractuel"><i className="fas fa-file-signature"></i> Contractuel</span>;
      case "Vacataire": return <span className="statut-badge vacataire"><i className="fas fa-clock"></i> Vacataire</span>;
      case "Chercheur": return <span className="statut-badge chercheur"><i className="fas fa-flask"></i> Chercheur</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getGradeBadge = (grade) => {
    switch(grade) {
      case "Professeur": return <span className="grade-badge professeur"><i className="fas fa-chalkboard-user"></i> Professeur</span>;
      case "Maître de conférences": return <span className="grade-badge maitre"><i className="fas fa-person-chalkboard"></i> M. Conférences</span>;
      case "Maître assistant": return <span className="grade-badge assistant"><i className="fas fa-graduation-cap"></i> M. Assistant</span>;
      default: return <span className="grade-badge">{grade}</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2><i className="fas fa-chalkboard-user"></i> Détails de l'enseignant</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">
          {/* En-tête avec photo */}
          <div className="teacher-details-header">
            <div className="teacher-details-photo">
              {teacher.photo ? (
                <img src={teacher.photo} alt={`${teacher.prenom} ${teacher.nom}`} />
              ) : (
                <div className="photo-placeholder">
                  <i className="fas fa-chalkboard-user"></i>
                </div>
              )}
            </div>
            <div className="teacher-details-name">
              <h3>{teacher.prenom} {teacher.nom}</h3>
              <p className="teacher-id-detail"><i className="fas fa-id-card"></i> ID: {teacher.id}</p>
              <div className="teacher-badges">
                {getGradeBadge(teacher.grade)}
                {getStatutBadge(teacher.statut)}
              </div>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="details-grid">
            {/* Informations académiques */}
            <div className="detail-card">
              <div className="detail-title"><i className="fas fa-graduation-cap"></i> Informations académiques</div>
              <div className="detail-row"><span><i className="fas fa-book"></i> Filière:</span><strong>{teacher.filiere}</strong></div>
              <div className="detail-row"><span><i className="fas fa-tags"></i> Spécialités:</span><strong>{teacher.specialites?.join(", ") || "Non spécifié"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-certificate"></i> Diplôme:</span><strong>{teacher.diplome || "Non spécifié"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-university"></i> Université d'origine:</span><strong>{teacher.universiteOrigine || "Non spécifiée"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-calendar-alt"></i> Date d'embauche:</span><strong>{teacher.dateEmbauche || "Non spécifiée"}</strong></div>
            </div>

            {/* Coordonnées */}
            <div className="detail-card">
              <div className="detail-title"><i className="fas fa-address-card"></i> Coordonnées</div>
              <div className="detail-row"><span><i className="fas fa-envelope"></i> Email:</span><strong>{teacher.email}</strong></div>
              <div className="detail-row"><span><i className="fas fa-phone"></i> Téléphone:</span><strong>{teacher.phone || "Non spécifié"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-building"></i> Bureau:</span><strong>{teacher.bureau || "Non spécifié"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-ambulance"></i> Contact urgence:</span><strong>{teacher.contactUrgence || "Non spécifié"}</strong></div>
              <div className="detail-row"><span><i className="fas fa-home"></i> Adresse:</span><strong>{teacher.adresse || "Non spécifiée"}</strong></div>
            </div>

            {/* Statistiques */}
            <div className="detail-card">
              <div className="detail-title"><i className="fas fa-chart-line"></i> Statistiques</div>
              <div className="detail-row"><span><i className="fas fa-clipboard-list"></i> Examens supervisés:</span><strong className="stat-value-blue">{teacher.examensSupervises || 0}</strong></div>
              <div className="detail-row"><span><i className="fas fa-users"></i> Étudiants encadrés:</span><strong className="stat-value-green">{teacher.etudiantsEncadres || 0}</strong></div>
              <div className="detail-row"><span><i className="fas fa-file-alt"></i> Publications:</span><strong className="stat-value-purple">{teacher.publications || 0}</strong></div>
              <div className="detail-row"><span><i className="fas fa-flask"></i> Projets de recherche:</span><strong className="stat-value-orange">{teacher.projets || 0}</strong></div>
              <div className="detail-row"><span><i className="fas fa-user-check"></i> Statut compte:</span><strong>{teacher.compteActif ? <span className="badge active">Actif</span> : <span className="badge inactive">Inactif</span>}</strong></div>
            </div>

            {/* Disponibilités & Cours */}
            <div className="detail-card">
              <div className="detail-title"><i className="fas fa-clock"></i> Disponibilités & Cours</div>
              {teacher.disponibilites && teacher.disponibilites.length > 0 && teacher.disponibilites.some(d => d) ? (
                teacher.disponibilites.map((disp, i) => disp && (
                  <div key={i} className="detail-row"><span><i className="fas fa-calendar-week"></i> Créneau {i+1}:</span><strong>{disp}</strong></div>
                ))
              ) : (
                <div className="detail-row"><span><i className="fas fa-info-circle"></i> Disponibilités:</span><strong>Non spécifiées</strong></div>
              )}
              <div className="detail-row"><span><i className="fas fa-chalkboard"></i> Cours enseignés:</span><strong>{teacher.cours?.join(", ") || "Non spécifiés"}</strong></div>
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="modal-footer">
          <button className="btn-edit" onClick={onEdit}><i className="fas fa-edit"></i> Modifier</button>
          <button className="btn-account" onClick={onToggleAccount}>
            <i className={`fas ${teacher.compteActif ? 'fa-ban' : 'fa-check-circle'}`}></i>
            {teacher.compteActif ? 'Désactiver' : 'Activer'}
          </button>
          <button className="btn-password" onClick={onResetPassword}><i className="fas fa-key"></i> Réinit. MDP</button>
          <button className="btn-delete" onClick={onDelete}><i className="fas fa-trash-alt"></i> Supprimer</button>
          <button className="btn-cancel" onClick={onClose}><i className="fas fa-times"></i> Fermer</button>
        </div>
      </div>

      <style>{`
        .badge.active {
          display: inline-block;
          padding: 4px 10px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }
        .badge.inactive {
          display: inline-block;
          padding: 4px 10px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }
        .btn-account {
          background: #fef3c7;
          color: #d97706;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .btn-account:hover {
          background: #d97706;
          color: white;
        }
        .btn-password {
          background: #e0e7ff;
          color: #1a3a8f;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .btn-password:hover {
          background: #1a3a8f;
          color: white;
        }
      `}</style>
    </div>
  );
}