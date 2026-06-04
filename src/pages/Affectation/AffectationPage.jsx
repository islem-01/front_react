import React, { useState } from "react";
import AffectationWizard from "./AffectationWizard";
import SeatMapModal from "./SeatMapModal";
import { INITIAL_AFFECTATIONS, ROOMS, PROFESSORS, STUDENTS_DB } from "./data";
import "./AffectationPage.css";

export default function AffectationPage() {
  const [affectations, setAffectations] = useState(INITIAL_AFFECTATIONS);
  const [showWizard, setShowWizard] = useState(false);
  const [planAffectation, setPlanAffectation] = useState(null);
  const [filterStatus, setFilterStatus] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewAffectation = (data) => {
    setAffectations(prev => [{ ...data, id: Date.now(), status: "confirme", dateAffectation: new Date().toISOString().split("T")[0], seatMap: {} }, ...prev]);
    setShowWizard(false);
  };

  const handleDeleteAffectation = (id) => {
    if (!window.confirm("Supprimer cette affectation ?")) return;
    setAffectations(prev => prev.filter(a => a.id !== id));
  };

  const getStatusBadge = (status) => {
    if (status === "confirme")   return <span className="status-badge confirmed">✓ Confirmé</span>;
    if (status === "en_attente") return <span className="status-badge pending">⏳ En attente</span>;
    return <span className="status-badge cancelled">✗ Annulé</span>;
  };

  const filtered = affectations.filter(a => {
    const matchStatus = filterStatus === "tous" || a.status === filterStatus;
    const q = searchTerm.toLowerCase();
    const profName = PROFESSORS.find(p => p.id === a.professorId)?.name || "";
    const roomName = ROOMS.find(r => r.id === a.roomId)?.name || "";
    const matchSearch = !q || [a.examName, a.niveau, a.filiere, a.groupe, profName, roomName].some(v => v.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="affectation-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Affectation des places</h1>
          <p className="page-subtitle">Planifiez et attribuez les étudiants aux salles d'examen</p>
        </div>
        <button className="btn-new-affectation" onClick={() => setShowWizard(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle affectation
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher examen, prof, salle, groupe…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[["tous","Tous"],["confirme","Confirmés"],["en_attente","En attente"]].map(([v,l]) => (
            <button key={v} className={`filter-tab ${filterStatus===v?"active":""}`} onClick={() => setFilterStatus(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="affectations-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <h3>Aucune affectation trouvée</h3>
            <p>Créez une nouvelle affectation pour commencer.</p>
          </div>
        )}

        {filtered.map((aff, i) => {
          const prof = PROFESSORS.find(p => p.id === aff.professorId);
          const coProf = PROFESSORS.find(p => p.id === aff.coSupervisorId);
          const room = ROOMS.find(r => r.id === aff.roomId);
          const students = STUDENTS_DB.filter(s => s.niveau === aff.niveau && s.filiere === aff.filiere && s.groupe === aff.groupe);
          const placedCount = Object.values(aff.seatMap || {}).filter(Boolean).length;
          return (
            <div key={aff.id} className={`affectation-card ${aff.status}`} style={{ animationDelay: `${i*0.05}s` }}>
              <div className="card-header">
                <div className="exam-info">
                  <h3>{aff.examName}</h3>
                  <div className="exam-datetime">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{aff.examDate} • {aff.examStart} – {aff.examEnd}</span>
                  </div>
                </div>
                {getStatusBadge(aff.status)}
              </div>

              <div className="card-details">
                <div className="detail-group">
                  <div className="detail-item">
                    <span className="detail-icon">🎓</span>
                    <div>
                      <div className="detail-label">Niveau & Groupe</div>
                      <div className="detail-value">{aff.niveau}</div>
                      <div className="detail-sub">{aff.filiere} — Groupe {aff.groupe} • {students.length} étudiants</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👨‍🏫</span>
                    <div>
                      <div className="detail-label">Professeur principal</div>
                      <div className="detail-value">{prof?.name || "—"}</div>
                      <div className="detail-sub">📧 {prof?.email} • 📞 {prof?.phone}</div>
                    </div>
                  </div>
                  {coProf && (
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <div>
                        <div className="detail-label">Co-surveillant</div>
                        <div className="detail-value">{coProf.name}</div>
                        <div className="detail-sub">{coProf.grade}</div>
                      </div>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-icon">🏛️</span>
                    <div>
                      <div className="detail-label">Salle</div>
                      <div className="detail-value">{room?.name || "—"}</div>
                      <div className="detail-sub">{room?.floor} • Capacité: {room?.capacity} places • {placedCount} placés</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="footer-info">📅 Affectée le {aff.dateAffectation}</div>
                <div className="footer-actions">
                  <button className="btn-plan" onClick={() => setPlanAffectation(aff)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    Plan de salle
                  </button>
                  <button className="btn-view" onClick={() => handleDeleteAffectation(aff.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showWizard && (
        <AffectationWizard onComplete={handleNewAffectation} onClose={() => setShowWizard(false)} />
      )}

      {planAffectation && (
        <SeatMapModal
          affectation={planAffectation}
          onClose={() => setPlanAffectation(null)}
          onSave={(updated) => {
            setAffectations(prev => prev.map(a => a.id === updated.id ? updated : a));
            setPlanAffectation(null);
          }}
        />
      )}
    </div>
  );
}
