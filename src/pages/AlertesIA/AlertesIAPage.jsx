import React, { useState, useEffect } from "react";
import AlertDetailsModal from "./AlertDetailsModal";
import RealtimeMonitor from "./RealtimeMonitor";
import "./AlertesIAPage.css";

// Données mockées avec liaison zone -> siège -> étudiant
const generateMockAlerts = (roomsData = []) => {
  const behaviorTypes = [
    { type: "regard_frequent", label: "Regards fréquents vers voisin", severity: "medium", icon: "fa-eye", baseConfidence: 65 },
    { type: "telephone", label: "Utilisation de téléphone", severity: "high", icon: "fa-mobile-alt", baseConfidence: 85 },
    { type: "mouvement_suspect", label: "Mouvement suspect", severity: "medium", icon: "fa-person-walking", baseConfidence: 70 },
    { type: "echange_papiers", label: "Échange de papiers", severity: "critical", icon: "fa-exchange-alt", baseConfidence: 90 },
    { type: "tete_tournee", label: "Tête tournée vers copie", severity: "medium", icon: "fa-user-check", baseConfidence: 75 },
    { type: "objet_cache", label: "Objet caché détecté", severity: "high", icon: "fa-box", baseConfidence: 80 },
  ];
  
  const sallesAvecLayout = roomsData.filter(r => r.hasLayout && r.layout?.seats?.length > 0);
  
  if (sallesAvecLayout.length === 0) {
    return generateFallbackAlerts();
  }
  
  const alerts = [];
  const now = new Date();
  
  sallesAvecLayout.forEach((salle, salleIndex) => {
    const seats = salle.layout.seats;
    const alertSeats = seats.filter(() => Math.random() < 0.25);
    
    alertSeats.forEach((seat, seatIndex) => {
      const behavior = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];
      const studentId = `IIT${String(10000 + Math.floor(Math.random() * 90000))}`;
      const studentNames = [
        { nom: "Ben Ali", prenom: "Ahmed" },
        { nom: "Touati", prenom: "Sofia" },
        { nom: "Khelil", prenom: "Yassine" },
        { nom: "Mansouri", prenom: "Nadia" },
        { nom: "Saidi", prenom: "Karim" },
        { nom: "Hamdi", prenom: "Leila" },
      ];
      const student = studentNames[Math.floor(Math.random() * studentNames.length)];
      
      const date = new Date(now);
      date.setMinutes(now.getMinutes() - (salleIndex * 15 + seatIndex * 3));
      
      alerts.push({
        id: `ALT${String(alerts.length + 1).padStart(4, '0')}`,
        type: behavior.type,
        label: behavior.label,
        severity: behavior.severity,
        icon: behavior.icon,
        salle: salle.name,
        salleId: salle.id,
        seatId: seat.seatId,
        seatCoordinates: { x: seat.x, y: seat.y },
        zoneId: `zone_${salle.id}_${seat.seatId}`,
        etudiant: {
          id: studentId,
          nom: student.nom,
          prenom: student.prenom,
        },
        timestamp: date.toISOString(),
        status: alerts.length < 10 ? "nouvelle" : (alerts.length < 25 ? "en_cours" : (alerts.length < 40 ? "traitee" : "resolue")),
        aiConfidence: Math.min(99, behavior.baseConfidence + Math.floor(Math.random() * 20 - 10)),
        examInfo: {
          matiere: ["Architecture des ordinateurs", "Algorithmique Avancée", "Réseaux Informatiques", "Intelligence Artificielle"][salleIndex % 4],
          date: "2026-06-10",
          heure: "09:00-12:00"
        },
        videoZone: {
          x1: seat.x - 50,
          y1: seat.y - 50,
          x2: seat.x + 50,
          y2: seat.y + 50
        },
        screenshot: true,
        video: true
      });
    });
  });
  
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateFallbackAlerts = () => {
  const behaviorTypes = [
    { type: "normal", label: "Comportement normal", severity: "low", icon: "fa-check-circle", baseConfidence: 85 },
    { type: "suspect", label: "Comportement suspect", severity: "medium", icon: "fa-question-circle", baseConfidence: 65 },
    { type: "anormal", label: "Comportement anormal", severity: "high", icon: "fa-exclamation-triangle", baseConfidence: 75 }
  ];
  
  const salles = ["Salle 1.1", "Salle 2.1", "Salle 3.2"];
  const seats = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];
  const etudiants = [
    { id: "IIT00001", nom: "Ben Ali", prenom: "Ahmed" },
    { id: "IIT00002", nom: "Touati", prenom: "Sofia" },
    { id: "IIT00003", nom: "Khelil", prenom: "Yassine" },
    { id: "IIT00004", nom: "Mansouri", prenom: "Nadia" },
  ];
  
  const alerts = [];
  const now = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const behavior = behaviorTypes[i % 3];
    const salle = salles[i % salles.length];
    const etudiant = etudiants[i % etudiants.length];
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 8);
    
    alerts.push({
      id: `ALT${String(i).padStart(4, '0')}`,
      type: behavior.type,
      label: behavior.label,
      severity: behavior.severity,
      icon: behavior.icon,
      salle: salle,
      seatId: seats[i % seats.length],
      seatCoordinates: { x: 100 + (i % 5) * 80, y: 100 + Math.floor(i / 5) * 80 },
      etudiant: etudiant,
      timestamp: date.toISOString(),
      status: i < 8 ? "nouvelle" : (i < 18 ? "en_cours" : (i < 25 ? "traitee" : "resolue")),
      aiConfidence: Math.min(99, behavior.baseConfidence + Math.floor(Math.random() * 20 - 10)),
      examInfo: { 
        matiere: ["Architecture", "Algorithmique", "Réseaux", "IA"][i % 4], 
        date: "2026-06-10", 
        heure: "09:00-12:00" 
      },
      screenshot: i % 3 === 0,
      video: i % 2 === 0
    });
  }
  
  return alerts;
};

export default function AlertesIAPage({ rooms = [] }) {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRealtime, setShowRealtime] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedSalle, setSelectedSalle] = useState("toutes");
  const [selectedSeverity, setSelectedSeverity] = useState("toutes");
  
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    nouvelles: 0,
    enCours: 0,
    traitees: 0,
    resolues: 0
  });

  useEffect(() => {
    setTimeout(() => {
      const mockAlerts = generateMockAlerts(rooms);
      setAlerts(mockAlerts);
      updateStats(mockAlerts);
      setLoading(false);
    }, 500);
  }, [rooms]);

  useEffect(() => {
    filterAlerts();
    setCurrentPage(1);
  }, [alerts, searchTerm, selectedStatus, selectedSalle, selectedSeverity]);

  const updateStats = (alertsList) => {
    setStats({
      total: alertsList.length,
      critical: alertsList.filter(a => a.severity === "critical").length,
      high: alertsList.filter(a => a.severity === "high").length,
      medium: alertsList.filter(a => a.severity === "medium").length,
      low: alertsList.filter(a => a.severity === "low").length,
      nouvelles: alertsList.filter(a => a.status === "nouvelle").length,
      enCours: alertsList.filter(a => a.status === "en_cours").length,
      traitees: alertsList.filter(a => a.status === "traitee").length,
      resolues: alertsList.filter(a => a.status === "resolue").length
    });
  };

  const filterAlerts = () => {
    let filtered = [...alerts];
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.salle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.seatId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== "tous") filtered = filtered.filter(a => a.status === selectedStatus);
    if (selectedSalle !== "toutes") filtered = filtered.filter(a => a.salle === selectedSalle);
    if (selectedSeverity !== "toutes") filtered = filtered.filter(a => a.severity === selectedSeverity);
    
    setFilteredAlerts(filtered);
  };

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    updateStats(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const getSeverityBadge = (severity) => {
    const config = {
      critical: { class: "critical", label: "Critique", icon: "fa-skull-crosswalk" },
      high: { class: "high", label: "Élevée", icon: "fa-exclamation-triangle" },
      medium: { class: "medium", label: "Moyenne", icon: "fa-chart-line" },
      low: { class: "low", label: "Faible", icon: "fa-info-circle" }
    };
    const c = config[severity] || config.low;
    return (
      <span className={`severity-badge ${c.class}`}>
        <i className={`fas ${c.icon}`}></i> {c.label}
      </span>
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
    return date.toLocaleDateString('fr');
  };

  const sallesUniques = [...new Set(alerts.map(a => a.salle))];

  // Simulation en temps réel des nouvelles alertes
  useEffect(() => {
    if (!showRealtime) return;
    
    const realtimeInterval = setInterval(() => {
      if (sallesUniques.length === 0) return;
      
      const behaviorTypes = [
        { type: "telephone", label: "Utilisation de téléphone", severity: "high", icon: "fa-mobile-alt" },
        { type: "regard_frequent", label: "Regards fréquents", severity: "medium", icon: "fa-eye" },
        { type: "mouvement_suspect", label: "Mouvement suspect", severity: "medium", icon: "fa-person-walking" }
      ];
      const behavior = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];
      const seats = ["A1", "A2", "B1", "B2", "C1", "C2"];
      
      const newAlert = {
        id: `ALT${String(alerts.length + 1).padStart(4, '0')}`,
        type: behavior.type,
        label: behavior.label,
        severity: behavior.severity,
        icon: behavior.icon,
        salle: sallesUniques[Math.floor(Math.random() * sallesUniques.length)],
        seatId: seats[Math.floor(Math.random() * seats.length)],
        seatCoordinates: { x: Math.random() * 500, y: Math.random() * 400 },
        etudiant: {
          id: `IIT${10000 + Math.floor(Math.random() * 90000)}`,
          nom: "Détecté",
          prenom: "Système"
        },
        timestamp: new Date().toISOString(),
        status: "nouvelle",
        aiConfidence: Math.floor(Math.random() * 30 + 70),
        examInfo: { matiere: "Examen en cours", date: new Date().toLocaleDateString(), heure: "09:00-12:00" },
        screenshot: true,
        video: true
      };
      
      setAlerts(prev => [newAlert, ...prev]);
    }, 30000);
    
    return () => clearInterval(realtimeInterval);
  }, [showRealtime, alerts.length, sallesUniques]);

  if (loading) {
    return (
      <div className="alertes-page loading">
        <div className="spinner"></div>
        <p>Chargement des alertes IA...</p>
      </div>
    );
  }

  return (
    <div className="alertes-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="logo-badge">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h1>Surveillance IA</h1>
            <p>Analyse vidéo par zone - Détection des comportements suspects</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`btn-realtime ${showRealtime ? 'active' : ''}`}
            onClick={() => setShowRealtime(!showRealtime)}
          >
            {showRealtime && <span className="pulse-dot"></span>}
            <i className="fas fa-video"></i>
            {showRealtime ? "Mode réel actif" : "Activer mode réel"}
          </button>
          <button className="btn-export">
            <i className="fas fa-download"></i>
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon"><i className="fas fa-bell"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total alertes</div>
          </div>
        </div>
        <div className="stat-card critical">
          <div className="stat-icon"><i className="fas fa-skull-crosswalk"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.critical}</div>
            <div className="stat-label">Critiques</div>
          </div>
        </div>
        <div className="stat-card high">
          <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.high}</div>
            <div className="stat-label">Élevées</div>
          </div>
        </div>
        <div className="stat-card medium">
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.medium}</div>
            <div className="stat-label">Moyennes</div>
          </div>
        </div>
        <div className="stat-card low">
          <div className="stat-icon"><i className="fas fa-info-circle"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.low}</div>
            <div className="stat-label">Faibles</div>
          </div>
        </div>
      </div>

      {/* Process Flow Indicator */}
      <div className="process-flow">
        <div className="flow-step">
          <i className="fas fa-video"></i>
          <span>Vidéo</span>
        </div>
        <i className="fas fa-arrow-right flow-arrow"></i>
        <div className="flow-step">
          <i className="fas fa-microchip"></i>
          <span>Analyse IA</span>
        </div>
        <i className="fas fa-arrow-right flow-arrow"></i>
        <div className="flow-step">
          <i className="fas fa-draw-polygon"></i>
          <span>Zone détectée</span>
        </div>
        <i className="fas fa-arrow-right flow-arrow"></i>
        <div className="flow-step">
          <i className="fas fa-chair"></i>
          <span>Siège associé</span>
        </div>
        <i className="fas fa-arrow-right flow-arrow"></i>
        <div className="flow-step">
          <i className="fas fa-user-graduate"></i>
          <span>Étudiant</span>
        </div>
        <i className="fas fa-arrow-right flow-arrow"></i>
        <div className="flow-step">
          <i className="fas fa-bell"></i>
          <span>Alerte</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Rechercher par étudiant, salle, siège..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select className="filter-select" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
          <option value="toutes">Toutes sévérités</option>
          <option value="critical">Critique</option>
          <option value="high">Élevée</option>
          <option value="medium">Moyenne</option>
          <option value="low">Faible</option>
        </select>
        <select className="filter-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="tous">Tous statuts</option>
          <option value="nouvelle">Nouvelles</option>
          <option value="en_cours">En cours</option>
          <option value="traitee">Traitée</option>
          <option value="resolue">Résolue</option>
        </select>
        <select className="filter-select" value={selectedSalle} onChange={(e) => setSelectedSalle(e.target.value)}>
          <option value="toutes">Toutes salles</option>
          {sallesUniques.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Alerts Table */}
      <div className="alerts-table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th><i className="fas fa-clock"></i> Date/Heure</th>
              <th><i className="fas fa-chart-line"></i> Sévérité</th>
              <th><i className="fas fa-user"></i> Étudiant</th>
              <th><i className="fas fa-chair"></i> Siège</th>
              <th><i className="fas fa-door-open"></i> Salle</th>
              <th><i className="fas fa-percent"></i> Confiance IA</th>
              <th><i className="fas fa-info-circle"></i> Comportement</th>
              <th><i className="fas fa-circle"></i> Statut</th>
              <th><i className="fas fa-cogs"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAlerts.map(alert => (
              <tr key={alert.id} className={`severity-${alert.severity}`}>
                <td className="alert-time">
                  <div className="time-main">{formatTime(alert.timestamp)}</div>
                  <div className="time-sub">{new Date(alert.timestamp).toLocaleTimeString('fr')}</div>
                </td>
                <td>{getSeverityBadge(alert.severity)}</td>
                <td>
                  <div className="student-info">
                    <strong>{alert.etudiant.prenom} {alert.etudiant.nom}</strong>
                    <div className="student-id">{alert.etudiant.id}</div>
                  </div>
                </td>
                <td>
                  <span className="seat-badge">
                    <i className="fas fa-chair"></i> {alert.seatId}
                  </span>
                </td>
                <td>
                  <div className="room-info">
                    <div>{alert.salle}</div>
                    <div className="exam-name">{alert.examInfo?.matiere}</div>
                  </div>
                </td>
                <td>
                  <div className="confidence-cell">
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ 
                          width: `${alert.aiConfidence}%`,
                          background: alert.severity === "critical" ? "#ef4444" : 
                                     alert.severity === "high" ? "#f59e0b" :
                                     alert.severity === "medium" ? "#eab308" : "#10b981"
                        }}
                      ></div>
                    </div>
                    <span className="confidence-value">{alert.aiConfidence}%</span>
                  </div>
                </td>
                <td>
                  <div className="behavior-cell">
                    <i className={`fas ${alert.icon}`}></i>
                    <span>{alert.label}</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={alert.status} 
                    onChange={(e) => handleUpdateStatus(alert.id, e.target.value)}
                    className={`status-select ${alert.status}`}
                  >
                    <option value="nouvelle">
                      <i className="fas fa-circle" style={{ color: "#ef4444" }}></i> Nouvelle
                    </option>
                    <option value="en_cours">
                      <i className="fas fa-spinner" style={{ color: "#f59e0b" }}></i> En cours
                    </option>
                    <option value="traitee">
                      <i className="fas fa-check-circle" style={{ color: "#3b82f6" }}></i> Traitée
                    </option>
                    <option value="resolue">
                      <i className="fas fa-check-double" style={{ color: "#10b981" }}></i> Résolue
                    </option>
                  </select>
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view" 
                    onClick={() => { setSelectedAlert(alert); setShowDetails(true); }} 
                    title="Voir détails"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn zone" title="Voir la zone vidéo">
                    <i className="fas fa-draw-polygon"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="page-indicator">Page {currentPage} / {totalPages}</span>
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <button className="pagination-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="no-alerts">
          <i className="fas fa-shield-alt"></i>
          <h3>Aucune alerte active</h3>
          <p>Toutes les zones sont sous surveillance normale</p>
        </div>
      )}

      {/* Modals */}
      {showDetails && selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {showRealtime && (
        <RealtimeMonitor 
          onClose={() => setShowRealtime(false)}
          rooms={rooms}
          onNewAlert={(alert) => {
            setAlerts(prev => [alert, ...prev]);
          }}
        />
      )}
    </div>
  );
}