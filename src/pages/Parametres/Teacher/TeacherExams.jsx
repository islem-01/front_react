import React, { useState } from 'react';

export default function TeacherExams({ user }) {
  const [exams, setExams] = useState([
    { id: 1, matiere: "Algorithmique", code: "INF301", salle: "A12", date: "2026-06-15", heureDebut: "09:00", heureFin: "12:00", duree: "3h", nbrEtudiants: 28, statut: "programmé" },
    { id: 2, matiere: "Base de données", code: "INF202", salle: "B05", date: "2026-06-14", heureDebut: "14:00", heureFin: "16:00", duree: "2h", nbrEtudiants: 32, statut: "terminé" },
    { id: 3, matiere: "Réseaux", code: "INF203", salle: "C08", date: "2026-06-16", heureDebut: "09:00", heureFin: "11:00", duree: "2h", nbrEtudiants: 25, statut: "programmé" },
    { id: 4, matiere: "IA", code: "INF405", salle: "A12", date: "2026-06-18", heureDebut: "10:00", heureFin: "13:00", duree: "3h", nbrEtudiants: 30, statut: "programmé" }
  ]);

  const [filter, setFilter] = useState("tous");
  const [selectedExam, setSelectedExam] = useState(null);

  const filteredExams = exams.filter(e => filter === "tous" || e.statut === filter);

  const getStatusBadge = (statut) => {
    if (statut === "programmé") return <span className="badge scheduled">📅 Programmé</span>;
    if (statut === "en_cours") return <span className="badge live">🔴 En cours</span>;
    return <span className="badge done">✅ Terminé</span>;
  };

  return (
    <div className="teacher-exams">
      <div className="filters-bar">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === "tous" ? "active" : ""}`} onClick={() => setFilter("tous")}>Tous</button>
          <button className={`filter-tab ${filter === "programmé" ? "active" : ""}`} onClick={() => setFilter("programmé")}>Programmés</button>
          <button className={`filter-tab ${filter === "terminé" ? "active" : ""}`} onClick={() => setFilter("terminé")}>Terminés</button>
        </div>
      </div>

      <div className="exams-grid">
        {filteredExams.map(exam => (
          <div key={exam.id} className="exam-card">
            <div className="exam-header">
              <div>
                <h4>{exam.matiere}</h4>
                <p className="exam-code">{exam.code}</p>
              </div>
              {getStatusBadge(exam.statut)}
            </div>
            <div className="exam-body">
              <div className="exam-info-row">
                <i className="fas fa-door-open"></i>
                <span>{exam.salle}</span>
              </div>
              <div className="exam-info-row">
                <i className="fas fa-calendar"></i>
                <span>{exam.date}</span>
              </div>
              <div className="exam-info-row">
                <i className="fas fa-clock"></i>
                <span>{exam.heureDebut} - {exam.heureFin} ({exam.duree})</span>
              </div>
              <div className="exam-info-row">
                <i className="fas fa-users"></i>
                <span>{exam.nbrEtudiants} étudiants</span>
              </div>
            </div>
            <div className="exam-actions">
              {exam.statut === "programmé" && (
                <button className="btn-primary" onClick={() => setSelectedExam(exam)}>
                  <i className="fas fa-eye"></i> Détails
                </button>
              )}
              {exam.statut === "terminé" && (
                <button className="btn-secondary">
                  <i className="fas fa-chart-bar"></i> Voir rapport
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Détails Examen */}
      {selectedExam && (
        <div className="modal-overlay" onClick={() => setSelectedExam(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'examen</h3>
              <button className="close" onClick={() => setSelectedExam(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><strong>Matière:</strong> {selectedExam.matiere}</div>
              <div className="detail-row"><strong>Code:</strong> {selectedExam.code}</div>
              <div className="detail-row"><strong>Salle:</strong> {selectedExam.salle}</div>
              <div className="detail-row"><strong>Date:</strong> {selectedExam.date}</div>
              <div className="detail-row"><strong>Horaire:</strong> {selectedExam.heureDebut} - {selectedExam.heureFin}</div>
              <div className="detail-row"><strong>Durée:</strong> {selectedExam.duree}</div>
              <div className="detail-row"><strong>Étudiants:</strong> {selectedExam.nbrEtudiants}</div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary">Voir le plan de placement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}