import React, { useState, useEffect, useRef } from 'react';
import './DashboardPage.css';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({
    classe: 'toutes',
    salle: 'toutes',
    statut: 'tous'
  });
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const videoRefs = useRef({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données mockées des vidéos uploadées
  const mockUploadedVideos = [
    { id: 101, nom: 'S3.11 - Algorithmique', salle: 'A101', date: '2026-06-15', time: '09:00-12:00', status: 'analysed', riskScore: 82, duration: '3h12min', size: '2.4 GB', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
    { id: 102, nom: 'B204 - Réseaux', salle: 'B204', date: '2026-06-14', time: '08:00-10:30', status: 'analysed', riskScore: 76, duration: '2h30min', size: '1.8 GB', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  ];

  // Vidéos en direct avec flux réels (utilisation de vidéos exemple)
  const liveVideos = [
    { id: 1, nom: 'Salle A101', status: 'Normal', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', camera: 'Caméra 1' },
    { id: 2, nom: 'Salle B204', status: 'Normal', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', camera: 'Caméra 2' },
    { id: 3, nom: 'Salle C305', status: 'Abnormal', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', camera: 'Caméra 3' },
    { id: 4, nom: 'Salle D402', status: 'Normal', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', camera: 'Caméra 4' },
    { id: 5, nom: 'Salle E503', status: 'Abnormal', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', camera: 'Caméra 5' },
  ];

  const allSessions = [
    { matiere: 'Algorithmique', salle: 'A101', debut: '08:00', fin: '10:30', presents: 28, total: 30 },
    { matiere: 'Réseaux', salle: 'B204', debut: '08:00', fin: '10:30', presents: 26, total: 28 },
    { matiere: 'Bases de Données', salle: 'C305', debut: '08:00', fin: '10:30', presents: 30, total: 30 },
    { matiere: 'IA', salle: 'D402', debut: '10:00', fin: '12:30', presents: 25, total: 32 },
    { matiere: 'Sécurité', salle: 'E503', debut: '10:00', fin: '12:30', presents: 22, total: 28 },
  ];

  const allAlertes = [
    { heure: '09:14', etudiant: 'Ahmed Ben Ali', salle: 'C305', statut: 'Abnormal' },
    { heure: '09:16', etudiant: 'Ali Trabelsi', salle: 'E503', statut: 'Abnormal' },
    { heure: '09:22', etudiant: 'Mohamed Khelil', salle: 'A101', statut: 'Abnormal' },
    { heure: '09:25', etudiant: 'Nadia Mansouri', salle: 'C305', statut: 'Abnormal' },
    { heure: '09:32', etudiant: 'Leila Ben Hassine', salle: 'C305', statut: 'Abnormal' },
    { heure: '09:35', etudiant: 'Omar Chaabane', salle: 'E503', statut: 'Abnormal' },
  ];

  useEffect(() => {
    setUploadedVideos(mockUploadedVideos);
  }, []);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      
      setTimeout(() => {
        const videoUrl = URL.createObjectURL(file);
        const newVideo = {
          id: Date.now(),
          nom: file.name,
          salle: 'Nouvelle salle',
          date: new Date().toISOString().split('T')[0],
          time: '--:--',
          status: 'pending',
          riskScore: null,
          duration: '--',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          videoUrl: videoUrl
        };
        setUploadedVideos([newVideo, ...uploadedVideos]);
        setUploading(false);
        
        setTimeout(() => {
          setUploadedVideos(prev => prev.map(v => 
            v.id === newVideo.id ? { ...v, status: 'analysed', riskScore: Math.floor(Math.random() * 40 + 60) } : v
          ));
        }, 3000);
      }, 2000);
    }
  };

  const getFilteredVideos = () => {
    let filtered = [...liveVideos];
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />



      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><i className="fas fa-users"></i></div>
          <div className="kpi-content">
            <span className="kpi-value">4 256</span>
            <span className="kpi-label">Étudiants</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><i className="fas fa-chalkboard-user"></i></div>
          <div className="kpi-content">
            <span className="kpi-value">182</span>
            <span className="kpi-label">Enseignants</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><i className="fas fa-file-alt"></i></div>
          <div className="kpi-content">
            <span className="kpi-value">12</span>
            <span className="kpi-label">Examens actifs</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon purple"><i className="fas fa-door-open"></i></div>
          <div className="kpi-content">
            <span className="kpi-value">8</span>
            <span className="kpi-label">Salles ouvertes</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red"><i className="fas fa-bell"></i></div>
          <div className="kpi-content">
            <span className="kpi-value">23</span>
            <span className="kpi-label">Alertes IA</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="upload-section">
        <div className="upload-zone">
          <i className="fas fa-cloud-upload-alt"></i>
          <h3>Upload vidéo post-examen</h3>
          <p>Déposez la vidéo enregistrée pour analyse IA</p>
          <input type="file" accept="video/*" id="video-upload" hidden onChange={handleVideoUpload} />
          <label htmlFor="video-upload" className="btn-upload">
            <i className="fas fa-upload"></i>
            {uploading ? "Upload en cours..." : "Choisir une vidéo"}
          </label>
        </div>
      </div>

      {/* Salles en direct - AVEC VIDÉOS RÉELLES */}
      <div className="surveillance-section">
        <div className="section-header">
          <i className="fas fa-video section-icon"></i>
          <h2>Salles en direct</h2>
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
        <div className="videos-grid">
          {filteredVideos.map(video => (
            <div key={video.id} className={`video-card ${video.status.toLowerCase()}`}>
              <div className="video-container">
                <video 
                  ref={el => videoRefs.current[video.id] = el}
                  className="video-player"
                  src={video.videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
                <div className="video-overlay">
                  <span className="live-badge">LIVE</span>
                  <span className="camera-name">{video.camera}</span>
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

      {/* Sessions en cours */}
      <div className="sessions-section">
        <div className="section-header">
          <i className="fas fa-clock section-icon"></i>
          <h2>Examens en cours</h2>
        </div>
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th><i className="fas fa-book"></i> Session</th>
                <th><i className="fas fa-door-open"></i> Salle</th>
                <th><i className="fas fa-hourglass-start"></i> Début</th>
                <th><i className="fas fa-hourglass-end"></i> Fin</th>
                <th><i className="fas fa-user-check"></i> Présence</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => (
                <tr key={index}>
                  <td className="session-name">{session.matiere}</td>
                  <td>{session.salle}</td>
                  <td>{session.debut}</td>
                  <td>{session.fin}</td>
                  <td>
                    <div className="presence-cell">
                      <span>{session.presents} / {session.total}</span>
                      <div className="presence-bar">
                        <div className="presence-fill" style={{ width: `${(session.presents / session.total) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="alerts-section">
        <div className="section-header">
          <i className="fas fa-exclamation-triangle section-icon"></i>
          <h2>Alertes récentes</h2>
          <span className="alert-count">{filteredAlertes.length} alertes</span>
        </div>
        <div className="alerts-table-container">
          {filteredAlertes.length > 0 ? (
            <table className="alerts-table">
              <thead>
                <tr><th><i className="fas fa-clock"></i> Heure</th><th><i className="fas fa-user"></i> Étudiant</th><th><i className="fas fa-door-open"></i> Salle</th></tr>
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
              <i className="fas fa-check-circle"></i>
              <p>Aucune anomalie détectée</p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Videos Section */}
      {uploadedVideos.length > 0 && (
        <div className="recent-uploads">
          <div className="section-header">
            <i className="fas fa-history"></i>
            <h2>Analyses récentes</h2>
            <span className="count-badge">{uploadedVideos.length} vidéos</span>
          </div>
          <div className="videos-uploads-grid">
            {uploadedVideos.map(video => (
              <div key={video.id} className={`video-upload-card ${video.status}`}>
                <div className="video-upload-header">
                  <i className="fas fa-file-video"></i>
                  <span className={`risk-tag ${video.riskScore >= 75 ? "high" : video.riskScore >= 50 ? "medium" : "low"}`}>
                    {video.status === 'analysed' ? `${video.riskScore}%` : '...'}
                  </span>
                </div>
                <div className="video-upload-info">
                  <h4>{video.nom}</h4>
                  <div className="video-meta">
                    <span><i className="fas fa-calendar"></i> {video.date}</span>
                    <span><i className="fas fa-clock"></i> {video.duration}</span>
                    <span><i className="fas fa-database"></i> {video.size}</span>
                  </div>
                  <div className="video-status">
                    {video.status === 'analysed' ? (
                      <span className="status-badge analysed"><i className="fas fa-check-circle"></i> Analyse terminée</span>
                    ) : (
                      <span className="status-badge pending"><i className="fas fa-spinner fa-pulse"></i> Analyse en cours</span>
                    )}
                  </div>
                </div>
                <div className="video-upload-actions">
                  <button className="icon-btn" onClick={() => handleFullscreen(video)}>
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Vidéo */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <i className="fas fa-video"></i>
              <h3>{selectedVideo.nom || `Salle ${selectedVideo.nom}`}</h3>
              <button className="modal-close" onClick={closeModal}><i className="fas fa-times"></i></button>
            </div>
            <div className="video-modal-body">
              <video controls className="video-player-full" autoPlay>
                <source src={selectedVideo.videoUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'} type="video/mp4" />
              </video>
              {selectedVideo.status && (
                <div className="video-analysis-info">
                  <span className={`status-badge ${selectedVideo.status.toLowerCase()}`}>
                    <i className={`fas ${selectedVideo.status === 'Normal' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                    {selectedVideo.status === 'Normal' ? ' Normal' : ' Abnormal'}
                  </span>
                  {selectedVideo.riskScore && (
                    <span className={`risk-badge ${selectedVideo.riskScore >= 75 ? 'high' : 'medium'}`}>
                      Risk Score: {selectedVideo.riskScore}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}