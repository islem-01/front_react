import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({
    classe: 'toutes',
    salle: 'toutes',
    statut: 'tous'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données mockées
  const videosSurveillance = [
    { id: 1, nom: 'A101', status: 'Normal' },
    { id: 2, nom: 'B204', status: 'Normal' },
    { id: 3, nom: 'C305', status: 'Abnormal' },
    { id: 4, nom: 'D402', status: 'Normal' },
    { id: 5, nom: 'E503', status: 'Abnormal' },
  ];

  const allSessions = [
    { matiere: 'Algorithmique', salle: 'A101', debut: '08:00', fin: '10:30', presents: 28, total: 30 },
    { matiere: 'Réseaux', salle: 'B204', debut: '08:00', fin: '10:30', presents: 26, total: 28 },
    { matiere: 'Bases de Données', salle: 'C305', debut: '08:00', fin: '10:30', presents: 30, total: 30 },
    { matiere: 'IA', salle: 'D402', debut: '10:00', fin: '12:30', presents: 25, total: 32 },
    { matiere: 'Sécurité', salle: 'E503', debut: '10:00', fin: '12:30', presents: 22, total: 28 },
  ];

  const allAlertes = [
    { heure: '09:14', etudiant: 'Ahmed Ben Ali', salle: 'C305',  statut: 'Abnormal' },
    { heure: '09:16', etudiant: 'Ali Trabelsi', salle: 'E503',  statut: 'Abnormal' },
    { heure: '09:22', etudiant: 'Mohamed Khelil', salle: 'A101', statut: 'Abnormal' },
    { heure: '09:25', etudiant: 'Nadia Mansouri', salle: 'C305', statut: 'Abnormal' },
    { heure: '09:32', etudiant: 'Leila Ben Hassine', salle: 'C305', statut: 'Abnormal' },
    { heure: '09:35', etudiant: 'Omar Chaabane', salle: 'E503', statut: 'Abnormal' },
  ];

  const getFilteredVideos = () => {
    let filtered = [...videosSurveillance];
    if (filters.statut !== 'tous') {
      filtered = filtered.filter(v => v.status === filters.statut);
    }
    if (filters.salle !== 'toutes') {
      filtered = filtered.filter(v => v.nom === filters.salle);
    }
    return filtered;
  };

  const getFilteredSessions = () => {
    let filtered = [...allSessions];
    if (filters.salle !== 'toutes') {
      filtered = filtered.filter(s => s.salle === filters.salle);
    }
    return filtered;
  };

  const getFilteredAlertes = () => {
    let filtered = [...allAlertes];
    filtered = filtered.filter(a => a.statut === 'Abnormal');
    if (filters.salle !== 'toutes') {
      filtered = filtered.filter(a => a.salle === filters.salle);
    }
    if (filters.statut !== 'tous') {
      filtered = filtered.filter(a => a.statut === filters.statut);
    }
    return filtered;
  };

  const filteredVideos = getFilteredVideos();
  const filteredSessions = getFilteredSessions();
  const filteredAlertes = getFilteredAlertes();

  const classes = ['Toutes', 'L1', 'L2', 'L3', 'M1', 'M2'];
  const salles = ['Toutes les salles', 'A101', 'B204', 'C305', 'D402', 'E503'];
  const statuts = ['Tous', 'Normal', 'Abnormal'];

  const handleFullscreen = (video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const formattedDate = currentTime.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = currentTime.toLocaleTimeString('fr-FR');

  return (
    <div className="dashboard-page">
      {/* Font Awesome 6 (CDN gratuit) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">4 256</span>
            <span className="kpi-label">Étudiants</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <i className="fas fa-chalkboard-user"></i>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">182</span>
            <span className="kpi-label">Enseignants</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">12</span>
            <span className="kpi-label">Examens actifs</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <i className="fas fa-door-open"></i>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">8</span>
            <span className="kpi-label">Salles ouvertes</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">23</span>
            <span className="kpi-label">Alertes IA</span>
          </div>
        </div>
      </div>

      {/* Surveillance des salles + Sessions en cours */}
      <div className="dashboard-two-columns">
        {/* Colonne de gauche */}
        <div className="surveillance-section">
          <div className="section-header">
            <i className="fas fa-video section-icon"></i>
            <h2>Surveillance des salles</h2>
          </div>
          <div className="videos-grid">
            {filteredVideos.map(video => (
              <div key={video.id} className={`video-card ${video.status.toLowerCase()}`}>
                <div className="video-container">
                  <div className="video-placeholder">
                    <i className="fas fa-camera video-icon"></i>
                  </div>
                  <button 
                    className="fullscreen-btn"
                    onClick={() => handleFullscreen(video)}
                    title="Agrandir"
                  >
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
                <div className="video-info">
                  <span className="video-name">{video.nom}</span>
                  <span className={`status-badge ${video.status.toLowerCase()}`}>
                    <i className={`fas ${video.status === 'Normal' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                    {video.status === 'Normal' ? ' Normal' : ' Abnormal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="sessions-section">
          <div className="section-header">
            <i className="fas fa-clock section-icon"></i>
            <h2>Sessions en cours</h2>
            <div className="header-filters">
              <select className="filter-select" value={filters.classe} onChange={(e) => setFilters({...filters, classe: e.target.value})}>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="filter-select" value={filters.salle} onChange={(e) => setFilters({...filters, salle: e.target.value})}>
                {salles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="filter-select" value={filters.statut} onChange={(e) => setFilters({...filters, statut: e.target.value})}>
                {statuts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="sessions-table-container">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th><i className="fas fa-book"></i> Session</th>
                  <th><i className="fas fa-door-open"></i> Salle</th>
                  <th><i className="fas fa-hourglass-start"></i> Début de l'examen</th>
                  <th><i className="fas fa-hourglass-end"></i> Fin de l'examen</th>
                  <th><i className="fas fa-user-check"></i> Présence</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session, index) => (
                    <tr key={index}>
                      <td className="session-name">{session.matiere}</td>
                      <td>{session.salle}</td>
                      <td>{session.debut}</td>
                      <td>{session.fin}</td>
                      <td>
                        <div className="presence-cell">
                          <span>{session.presents} / {session.total}</span>
                          <div className="presence-bar">
                            <div 
                              className="presence-fill" 
                              style={{ width: `${(session.presents / session.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">Aucune session trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="alerts-section">
        <div className="section-header">
          <i className="fas fa-exclamation-triangle section-icon"></i>
          <h2>Alertes récentes</h2>
          <span className="alert-count">
            <i className="fas fa-bell"></i>
            {filteredAlertes.length} alertes anormales
          </span>
        </div>
        <div className="alerts-table-container">
          {filteredAlertes.length > 0 ? (
            <table className="alerts-table">
              <thead>
                <tr>
                  <th><i className="fas fa-clock"></i> Heure</th>
                  <th><i className="fas fa-user"></i> Étudiant</th>
                  <th><i className="fas fa-door-open"></i> Salle</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlertes.map((alerte, index) => (
                  <tr key={index} className="alert-row">
                    <td className="alert-time">{alerte.heure}</td>
                    <td className="alert-student">{alerte.etudiant}</td>
                    <td>{alerte.salle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-alerts">
              <i className="fas fa-check-circle no-alerts-icon"></i>
              <p>Aucune anomalie détectée</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <i className="fas fa-video"></i>
              <h3>Surveillance - Salle {selectedVideo.nom}</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="video-modal-body">
              <div className="video-placeholder large">
                <i className="fas fa-camera-retro video-icon-large"></i>
                <span>Simulation vidéo - Salle {selectedVideo.nom}</span>
                <span className={`status-badge ${selectedVideo.status.toLowerCase()}`}>
                  <i className={`fas ${selectedVideo.status === 'Normal' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                  {selectedVideo.status === 'Normal' ? ' Normal' : ' Abnormal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}