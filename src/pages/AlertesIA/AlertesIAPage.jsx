import React, { useState, useEffect } from "react";
import AlertDetailsModal from "./AlertDetailsModal";
import RealtimeMonitor from "./RealtimeMonitor";
import "./AlertesIAPage.css";

// Données mockées des alertes IA
const generateMockAlerts = () => {
  const alertTypes = [
    { type: "regard_suspect", label: "👀 Regard suspect", severity: "high", icon: "👀" },
    { type: "telephone", label: "📱 Utilisation téléphone", severity: "high", icon: "📱" },
    { type: "mouvement_brusque", label: "🏃 Mouvement brusque", severity: "medium", icon: "🏃" },
    { type: "echange_papier", label: "📄 Échange de papier", severity: "critical", icon: "📄" },
    { type: "casque", label: "🎧 Port de casque", severity: "medium", icon: "🎧" },
    { type: "parleur", label: "💬 Conversation", severity: "low", icon: "💬" },
    { type: "caméra_offline", label: "📹 Caméra hors ligne", severity: "critical", icon: "📹" },
    { type: "absence_prolongee", label: "⏰ Absence prolongée", severity: "medium", icon: "⏰" }
  ];
  
  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C"];
  const etudiants = [
    { id: "IIT00001", nom: "Ben Ali", prenom: "Ahmed" },
    { id: "IIT00002", nom: "Touati", prenom: "Sofia" },
    { id: "IIT00003", nom: "Khelil", prenom: "Yassine" },
    { id: "IIT00004", nom: "Mansouri", prenom: "Nadia" }
  ];
  
  const alerts = [];
  const now = new Date();
  
  for (let i = 1; i <= 24; i++) {
    const alertType = alertTypes[i % alertTypes.length];
    const salle = salles[i % salles.length];
    const etudiant = etudiants[i % etudiants.length];
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 3);
    
    alerts.push({
      id: `ALT${String(i).padStart(4, '0')}`,
      type: alertType.type,
      label: alertType.label,
      severity: alertType.severity,
      icon: alertType.icon,
      salle: salle,
      salleId: i % 5 + 1,
      etudiant: etudiant,
      timestamp: date.toISOString(),
      description: `Détection d'un comportement suspect: ${alertType.label.toLowerCase()}`,
      screenshot: i % 3 === 0 ? "screenshot_placeholder.jpg" : null,
      video: i % 5 === 0 ? "video_placeholder.mp4" : null,
      status: i < 5 ? "nouvelle" : (i < 10 ? "en_cours" : (i < 15 ? "traitee" : "resolue")),
      traitement: i % 4 === 0 ? { par: "Admin", action: "Avertissement verbal", date: new Date(now).toISOString() } : null,
      aiConfidence: Math.floor(Math.random() * 30 + 70),
      examInfo: {
        matiere: ["Architecture", "Algorithmique", "Réseaux", "IA"][i % 4],
        date: "2026-03-25",
        heure: "09:00-12:00"
      }
    });
  }
  
  return alerts;
};

export default function AlertesIAPage() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRealtime, setShowRealtime] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("tous");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedSalle, setSelectedSalle] = useState("toutes");
  const [selectedType, setSelectedType] = useState("tous");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Statistiques temps réel
  const [stats, setStats] = useState({
    total: 0,
    critiques: 0,
    hautes: 0,
    moyennes: 0,
    basses: 0,
    nouvelles: 0,
    enCours: 0,
    traitees: 0,
    resolues: 0
  });

  useEffect(() => {
    // Simuler chargement des alertes
    setTimeout(() => {
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
      updateStats(mockAlerts);
      setLoading(false);
    }, 500);
    
    // Simuler des alertes en temps réel toutes les 10 secondes
    const interval = setInterval(() => {
      if (showRealtime) {
        const newAlert = generateSingleAlert();
        setAlerts(prev => [newAlert, ...prev]);
        updateStats([newAlert, ...alerts]);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [alerts, showRealtime]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, selectedSeverity, selectedStatus, selectedSalle, selectedType, dateRange]);

  const generateSingleAlert = () => {
    const alertTypes = [
      { type: "regard_suspect", label: "👀 Regard suspect", severity: "high", icon: "👀" },
      { type: "telephone", label: "📱 Utilisation téléphone", severity: "high", icon: "📱" },
      { type: "mouvement_brusque", label: "🏃 Mouvement brusque", severity: "medium", icon: "🏃" }
    ];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const salles = ["Salle A101", "Salle A102", "Salle B201"];
    const etudiants = [
      { id: "IIT00001", nom: "Ben Ali", prenom: "Ahmed" },
      { id: "IIT00002", nom: "Touati", prenom: "Sofia" }
    ];
    
    return {
      id: `ALT${String(Date.now()).slice(-6)}`,
      type: alertType.type,
      label: alertType.label,
      severity: alertType.severity,
      icon: alertType.icon,
      salle: salles[Math.floor(Math.random() * salles.length)],
      etudiant: etudiants[Math.floor(Math.random() * etudiants.length)],
      timestamp: new Date().toISOString(),
      description: `Nouvelle alerte: ${alertType.label.toLowerCase()}`,
      status: "nouvelle",
      aiConfidence: Math.floor(Math.random() * 30 + 70),
      examInfo: { matiere: "Examen en cours", date: new Date().toISOString().split('T')[0], heure: "09:00-12:00" }
    };
  };

  const updateStats = (alertsList) => {
    setStats({
      total: alertsList.length,
      critiques: alertsList.filter(a => a.severity === "critical").length,
      hautes: alertsList.filter(a => a.severity === "high").length,
      moyennes: alertsList.filter(a => a.severity === "medium").length,
      basses: alertsList.filter(a => a.severity === "low").length,
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
        a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.salle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSeverity !== "tous") {
      filtered = filtered.filter(a => a.severity === selectedSeverity);
    }
    
    if (selectedStatus !== "tous") {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    if (selectedSalle !== "toutes") {
      filtered = filtered.filter(a => a.salle === selectedSalle);
    }
    
    if (selectedType !== "tous") {
      filtered = filtered.filter(a => a.type === selectedType);
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(a => a.timestamp.split('T')[0] >= dateRange.start);
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(a => a.timestamp.split('T')[0] <= dateRange.end);
    }
    
    setFilteredAlerts(filtered);
  };

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: newStatus } : a
    ));
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "critical": return "critical";
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "low";
    }
  };

  const getSeverityLabel = (severity) => {
    switch(severity) {
      case "critical": return "Critique";
      case "high": return "Élevée";
      case "medium": return "Moyenne";
      case "low": return "Basse";
      default: return "Inconnue";
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "nouvelle": return "🟡 Nouvelle";
      case "en_cours": return "🔵 En cours";
      case "traitee": return "🟢 Traitée";
      case "resolue": return "✅ Résolue";
      default: return status;
    }
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
  const typesUniques = [...new Set(alerts.map(a => a.type))];

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
      <div className="page-header">
        <div>
          <h1 className="page-title">🤖 Alertes IA - Surveillance temps réel</h1>
          <p className="page-subtitle">Détection automatique des comportements suspects pendant les examens</p>
        </div>
        <div className="header-actions">
          <button className={`btn-realtime ${showRealtime ? "active" : ""}`} onClick={() => setShowRealtime(!showRealtime)}>
            <span className="pulse-dot"></span>
            {showRealtime ? "📡 Mode réel actif" : "🎥 Activer mode temps réel"}
          </button>
          <button className="btn-export" onClick={() => alert("Export des alertes")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="stats-cards">
        <div className="stat-card critical">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.critiques}</div>
            <div className="stat-label">Critiques</div>
          </div>
        </div>
        <div className="stat-card high">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.hautes}</div>
            <div className="stat-label">Élevées</div>
          </div>
        </div>
        <div className="stat-card medium">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.moyennes}</div>
            <div className="stat-label">Moyennes</div>
          </div>
        </div>
        <div className="stat-card low">
          <div className="stat-icon">ℹ️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.basses}</div>
            <div className="stat-label">Basses</div>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total alertes</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher par étudiant, salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
          <option value="tous">Toutes sévérités</option>
          <option value="critical">Critique</option>
          <option value="high">Élevée</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
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
        <select className="filter-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="tous">Tous types</option>
          {typesUniques.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" className="filter-date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} placeholder="Date début" />
        <input type="date" className="filter-date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} placeholder="Date fin" />
      </div>

      {/* Mode temps réel */}
      {showRealtime && <RealtimeMonitor onClose={() => setShowRealtime(false)} />}

      {/* Liste des alertes */}
      <div className="alerts-list">
        <div className="alerts-header">
          <span>🕒 Date/Heure</span>
          <span>📊 Sévérité</span>
          <span>📋 Type d'alerte</span>
          <span>🎓 Étudiant</span>
          <span>🏛️ Salle</span>
          <span>📈 Confiance IA</span>
          <span>🔧 Statut</span>
          <span>⚡ Actions</span>
        </div>
        
        {filteredAlerts.map(alert => (
          <div key={alert.id} className={`alert-item severity-${alert.severity} status-${alert.status}`}>
            <div className="alert-time">
              <span className="time">{formatTime(alert.timestamp)}</span>
              <span className="date">{new Date(alert.timestamp).toLocaleDateString('fr')}</span>
            </div>
            <div className="alert-severity">
              <span className={`severity-badge ${getSeverityColor(alert.severity)}`}>
                {getSeverityLabel(alert.severity)}
              </span>
            </div>
            <div className="alert-type">
              <span className="type-icon">{alert.icon}</span>
              <span className="type-label">{alert.label}</span>
            </div>
            <div className="alert-student">
              <span className="student-name">{alert.etudiant.prenom} {alert.etudiant.nom}</span>
              <span className="student-id">{alert.etudiant.id}</span>
            </div>
            <div className="alert-room">
              <span className="room-name">{alert.salle}</span>
              <span className="room-exam">{alert.examInfo?.matiere}</span>
            </div>
            <div className="alert-confidence">
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: `${alert.aiConfidence}%` }}></div>
              </div>
              <span className="confidence-value">{alert.aiConfidence}%</span>
            </div>
            <div className="alert-status">
              <select 
                value={alert.status} 
                onChange={(e) => handleUpdateStatus(alert.id, e.target.value)}
                className={`status-select status-${alert.status}`}
              >
                <option value="nouvelle">🟡 Nouvelle</option>
                <option value="en_cours">🔵 En cours</option>
                <option value="traitee">🟢 Traitée</option>
                <option value="resolue">✅ Résolue</option>
              </select>
            </div>
            <div className="alert-actions">
              <button className="action-btn view" onClick={() => { setSelectedAlert(alert); setShowDetails(true); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                </svg>
              </button>
              <button className="action-btn video" onClick={() => alert("Vidéo surveillance")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <polygon points="9 9 15 12 9 15 9 9"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="no-alerts">
          <div className="no-alerts-icon">✅</div>
          <h3>Aucune alerte trouvée</h3>
          <p>Aucune alerte ne correspond à vos critères de recherche</p>
        </div>
      )}

      {showDetails && selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}