import React, { useState, useEffect } from 'react';

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({
    examensAujourdhui: 2,
    examensSemaine: 5,
    alertesNonTraitees: 3,
    rapportsRecents: 1,
    examensValides: 4,
    demandesEnAttente: 2
  });

  const [recentExams, setRecentExams] = useState([
    { id: 1, matiere: "Algorithmique", salle: "A12", date: "2026-06-15", heure: "09:00-12:00", statut: "programmé" },
    { id: 2, matiere: "Base de données", salle: "B05", date: "2026-06-14", heure: "14:00-16:00", statut: "terminé" },
    { id: 3, matiere: "Réseaux", salle: "C08", date: "2026-06-16", heure: "09:00-11:00", statut: "programmé" }
  ]);

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, etudiant: "Ahmed Ben Ali", salle: "A12", seat: "B3", type: "abnormal", time: "Il y a 5 min" },
    { id: 2, etudiant: "Sofia Touati", salle: "A12", seat: "C2", type: "suspect", time: "Il y a 15 min" }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, matiere: "IA", dateProposee: "18/06/2026", statut: "en_attente" },
    { id: 2, matiere: "Cryptographie", dateProposee: "20/06/2026", statut: "en_attente" }
  ]);

  return (
    <div className="teacher-dashboard">
      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><i className="fas fa-calendar-day"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.examensAujourdhui}</div>
            <div className="stat-label">Examens aujourd'hui</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="fas fa-calendar-week"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.examensSemaine}</div>
            <div className="stat-label">Cette semaine</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><i className="fas fa-bell"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.alertesNonTraitees}</div>
            <div className="stat-label">Alertes non traitées</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><i className="fas fa-file-alt"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.rapportsRecents}</div>
            <div className="stat-label">Rapports récents</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.examensValides}</div>
            <div className="stat-label">Examens validés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.demandesEnAttente}</div>
            <div className="stat-label">Demandes en attente</div>
          </div>
        </div>
      </div>

      {/* Prochains examens */}
      <div className="dashboard-section">
        <h3><i className="fas fa-clock"></i> Prochains examens</h3>
        <div className="exams-list">
          {recentExams.map(exam => (
            <div key={exam.id} className="exam-item">
              <div className="exam-info">
                <div className="exam-matiere">{exam.matiere}</div>
                <div className="exam-details">
                  <span><i className="fas fa-door-open"></i> {exam.salle}</span>
                  <span><i className="fas fa-calendar"></i> {exam.date}</span>
                  <span><i className="fas fa-clock"></i> {exam.heure}</span>
                </div>
              </div>
              <div className={`exam-status ${exam.statut}`}>
                {exam.statut === "programmé" ? "📅 Programmé" : "✅ Terminé"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <div className="dashboard-section">
          <h3><i className="fas fa-hourglass-half"></i> Demandes en attente de validation</h3>
          <div className="requests-list">
            {pendingRequests.map(req => (
              <div key={req.id} className="request-item">
                <div className="request-info">
                  <span className="request-matiere">{req.matiere}</span>
                  <span className="request-date">Date proposée: {req.dateProposee}</span>
                </div>
                <span className="request-status pending">En attente</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertes récentes */}
      <div className="dashboard-section">
        <h3><i className="fas fa-exclamation-triangle"></i> Alertes récentes</h3>
        <div className="alerts-list">
          {recentAlerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <div className="alert-icon">
                <i className={`fas ${alert.type === "abnormal" ? "fa-exclamation-triangle" : "fa-question-circle"}`}></i>
              </div>
              <div className="alert-info">
                <div className="alert-student">{alert.etudiant}</div>
                <div className="alert-location">{alert.salle} · Place {alert.seat}</div>
              </div>
              <div className="alert-time">{alert.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Message de bienvenue */}
      <div className="welcome-card">
        <i className="fas fa-hand-wave"></i>
        <div>
          <h3>Bienvenue, {user?.name} !</h3>
          <p>Vous avez {stats.alertesNonTraitees} alerte(s) non traitée(s) et {stats.examensAujourdhui} examen(s) aujourd'hui.</p>
          <p>N'oubliez pas de consulter vos demandes en attente de validation.</p>
        </div>
      </div>
    </div>
  );
}