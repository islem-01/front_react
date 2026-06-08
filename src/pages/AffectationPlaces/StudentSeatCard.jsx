import React from "react";

export default function StudentSeatCard({ seat, onClose }) {
  if (!seat) {
    return (
      <div className="sscard empty">
        <div className="sscard-empty">
          <i className="fas fa-user-circle"></i>
          <p>Cliquez sur un siège occupé pour voir les détails de l'étudiant</p>
        </div>
      </div>
    );
  }

  const { student: s, seatId, salle } = seat;

  return (
    <div className="sscard">
      <div className="sscard-header">
        <span><i className="fas fa-user-graduate"></i> Détails étudiant</span>
        <button className="sscard-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="sscard-avatar">
        <div className="sscard-av-circle">
          {s.prenom.charAt(0)}{s.nom.charAt(0)}
        </div>
      </div>

      <div className="sscard-name">
        <h4>{s.prenom} {s.nom}</h4>
        <div className="sscard-id">
          <i className="fas fa-id-card"></i> {s.id}
        </div>
      </div>

      <div className="sscard-info">
        {[
          { icon: "graduation-cap", label: "Niveau", val: s.niveau },
          { icon: "code-branch", label: "Filière", val: s.filiere },
          { icon: "users", label: "Groupe", val: s.groupe },
          { icon: "envelope", label: "Email", val: s.email },
        ].map(row => (
          <div key={row.label} className="sscard-row">
            <span className="sscard-lbl"><i className={`fas fa-${row.icon}`}></i> {row.label}</span>
            <span className="sscard-val">{row.val}</span>
          </div>
        ))}
      </div>

      <div className="sscard-place">
        <div className="sscard-place-title"><i className="fas fa-chair"></i> Place attribuée</div>
        <div className="sscard-place-grid">
          <div className="sscard-place-item">
            <span>Salle</span>
            <strong>{salle}</strong>
          </div>
          <div className="sscard-place-item">
            <span>Siège</span>
            <strong>{seatId}</strong>
          </div>
        </div>
      </div>

      <div className="sscard-drag-tip">
        <i className="fas fa-hand-paper"></i>
        Faites glisser ce siège pour déplacer l'étudiant
      </div>
    </div>
  );
}
