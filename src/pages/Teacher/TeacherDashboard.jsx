import React from 'react';

export default function TeacherDashboard({ user }) {
  const stats = [
    { label: 'Examens programmés', value: '6', icon: 'fas fa-file-alt', color: 'blue', link: 'Voir tous' },
    { label: 'Sessions en cours', value: '2', icon: 'fas fa-video', color: 'green', link: 'Voir en direct' },
    { label: 'Alertes IA', value: '5', icon: 'fas fa-bell', color: 'orange', link: 'Voir alertes' },
    { label: 'Taux de présence', value: '92%', icon: 'fas fa-chart-line', color: 'purple', link: 'Détails' },
    { label: 'Rapports générés', value: '3', icon: 'fas fa-chart-bar', color: 'red', link: 'Voir rapports' }
  ];

  const upcomingExams = [
    { matiere: 'Base de données', date: '15/06/2026', heure: '08:30 - 10:30', salle: 'A12', statut: 'accepte' },
    { matiere: 'Réseaux informatiques', date: '20/06/2026', heure: '11:00 - 13:00', salle: 'B05', statut: 'en_attente' },
    { matiere: 'Java Avancé', date: '28/06/2026', heure: '09:00 - 11:00', salle: 'C03', statut: 'en_attente' }
  ];

  const recentAlerts = [
    { type: 'Mouvement suspect', etudiant: 'Aymon Ben Ali', place: 'B4', salle: 'A12', time: '10:45' },
    { type: 'Consultation non autorisée', etudiant: 'Sara Haddad', place: 'C2', salle: 'A12', time: '10:32' },
    { type: 'Utilisation de téléphone', etudiant: 'Mehdi Kacem', place: 'D3', salle: 'A12', time: '10:28' }
  ];

  const recentReports = [
    { title: 'Rapport - Base de données', date: '15/06/2026', salle: 'A12' },
    { title: 'Rapport - Réseaux Informatiques', date: '05/06/2026', salle: 'B05' },
    { title: 'Rapport - Java Avancé', date: '30/05/2026', salle: 'C03' }
  ];

  return (
    <div className="teacher-dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-link">{stat.link} <i className="fas fa-arrow-right"></i></div>
            </div>
          </div>
        ))}
      </div>

      <div className="live-card">
        <div>
          <div className="live-badge">
            <span className="live-dot"></span> EN DIRECT
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Salle A12 - Caméra 1</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>10:04:51</div>
        </div>
        <div className="live-stats">
          <div className="live-stat">
            <div className="live-stat-value">28 / 30</div>
            <div className="live-stat-label">Étudiants présents</div>
          </div>
          <div className="live-stat">
            <div className="live-stat-value">2</div>
            <div className="live-stat-label">Alertes en cours</div>
          </div>
          <div className="live-stat">
            <div className="live-stat-value">01:14:37</div>
            <div className="live-stat-label">Temps restant</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-clock"></i> Mes examens à venir</h3>
          <span className="section-link">Voir tous mes examens <i className="fas fa-arrow-right"></i></span>
        </div>
        <table className="exams-table">
          <thead>
            <tr><th>Examen</th><th>Date</th><th>Heure</th><th>Salle</th><th>Statut</th><th>Action</th></tr>
          </thead>
          <tbody>
            {upcomingExams.map((exam, idx) => (
              <tr key={idx}>
                <td><strong>{exam.matiere}</strong></td>
                <td>{exam.date}</td>
                <td>{exam.heure}</td>
                <td>{exam.salle}</td>
                <td><span className={`status-badge ${exam.statut === 'accepte' ? 'accepted' : 'pending'}`}>{exam.statut === 'accepte' ? 'Accepté' : 'En attente'}</span></td>
                <td><i className="fas fa-file-alt" style={{ cursor: 'pointer', color: '#3b82f6' }}></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-bell"></i> Alertes IA récentes</h3>
            <span className="section-link">Voir la liste complète <i className="fas fa-arrow-right"></i></span>
          </div>
          {recentAlerts.map((alert, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '32px', height: '32px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', fontSize: '0.8rem' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{alert.type}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{alert.etudiant} - Place {alert.place} - Salle {alert.salle}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{alert.time}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-file-alt"></i> Rapports récents</h3>
            <span className="section-link">Voir tous mes rapports <i className="fas fa-arrow-right"></i></span>
          </div>
          {recentReports.map((report, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '32px', height: '32px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-file-pdf" style={{ color: '#3b82f6', fontSize: '0.8rem' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{report.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{report.date} - {report.salle}</div>
              </div>
              <div><i className="fas fa-download" style={{ color: '#64748b', cursor: 'pointer' }}></i></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}