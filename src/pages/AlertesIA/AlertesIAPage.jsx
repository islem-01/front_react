import React, { useState, useEffect } from "react";
import AlertDetailsModal from "./AlertDetailsModal";
import "./AlertesIAPage.css";

// Données mockées des alertes IA - Version simplifiée
const generateMockAlerts = () => {
  const statuses = [
    { type: "normal", label: "Normal", severity: "low", icon: "fa-check-circle", color: "#10b981" },
    { type: "suspect", label: "Suspect", severity: "medium", icon: "fa-question-circle", color: "#f59e0b" },
    { type: "anormal", label: "Anormal", severity: "high", icon: "fa-exclamation-triangle", color: "#ef4444" }
  ];
  
  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C"];
  const etudiants = [
    { id: "IIT00001", nom: "Ben Ali", prenom: "Ahmed" },
    { id: "IIT00002", nom: "Touati", prenom: "Sofia" },
    { id: "IIT00003", nom: "Khelil", prenom: "Yassine" },
    { id: "IIT00004", nom: "Mansouri", prenom: "Nadia" },
    { id: "IIT00005", nom: "Saidi", prenom: "Karim" },
    { id: "IIT00006", nom: "Hamdi", prenom: "Leila" }
  ];
  
  const alerts = [];
  const now = new Date();
  
  for (let i = 1; i <= 48; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const salle = salles[i % salles.length];
    const etudiant = etudiants[i % etudiants.length];
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 5);
    
    alerts.push({
      id: `ALT${String(i).padStart(4, '0')}`,
      type: status.type,
      label: status.label,
      severity: status.severity,
      icon: status.icon,
      color: status.color,
      salle: salle,
      etudiant: etudiant,
      seat: `${String.fromCharCode(65 + (i % 6))}${Math.floor(i / 6) + 1}`,
      timestamp: date.toISOString(),
      status: i < 10 ? "nouvelle" : (i < 20 ? "en_cours" : (i < 35 ? "traitee" : "resolue")),
      aiConfidence: status.type === "normal" ? Math.floor(Math.random() * 20 + 80) : 
                    status.type === "suspect" ? Math.floor(Math.random() * 30 + 50) :
                    Math.floor(Math.random() * 40 + 60),
      examInfo: {
        matiere: ["Architecture", "Algorithmique", "Réseaux", "IA"][i % 4],
        date: "2026-06-10",
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
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedSalle, setSelectedSalle] = useState("toutes");
  const [selectedType, setSelectedType] = useState("tous");
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    normaux: 0,
    suspects: 0,
    anormaux: 0,
    nouvelles: 0,
    enCours: 0,
    traitees: 0,
    resolues: 0
  });

  useEffect(() => {
    setTimeout(() => {
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
      updateStats(mockAlerts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterAlerts();
    setCurrentPage(1);
  }, [alerts, searchTerm, selectedStatus, selectedSalle, selectedType]);

  const updateStats = (alertsList) => {
    setStats({
      total: alertsList.length,
      normaux: alertsList.filter(a => a.type === "normal").length,
      suspects: alertsList.filter(a => a.type === "suspect").length,
      anormaux: alertsList.filter(a => a.type === "anormal").length,
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
        a.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== "tous") filtered = filtered.filter(a => a.status === selectedStatus);
    if (selectedSalle !== "toutes") filtered = filtered.filter(a => a.salle === selectedSalle);
    if (selectedType !== "tous") filtered = filtered.filter(a => a.type === selectedType);
    
    setFilteredAlerts(filtered);
  };

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const getStatusLabel = (status) => {
    const labels = {
      nouvelle: "🟡 Nouvelle",
      en_cours: "🔵 En cours",
      traitee: "🟢 Traitée",
      resolue: "✅ Résolue"
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      nouvelle: "nouvelle",
      en_cours: "encours",
      traitee: "traitee",
      resolue: "resolue"
    };
    return classes[status] || "";
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

  const getTypeClass = (type) => {
    const classes = {
      normal: "type-normal",
      suspect: "type-suspect",
      anormal: "type-anormal"
    };
    return classes[type] || "";
  };

  const sallesUniques = [...new Set(alerts.map(a => a.salle))];

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
        
      </div>

      
      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Rechercher par étudiant, salle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="tous">Tous les types</option>
          <option value="normal">Normal</option>
          <option value="suspect">Suspect</option>
          <option value="anormal">Anormal</option>
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
              <th><i className="fas fa-chart-line"></i> Statut IA</th>
              <th><i className="fas fa-user"></i> Étudiant</th>
              <th><i className="fas fa-chair"></i> Place</th>
              <th><i className="fas fa-door-open"></i> Salle</th>
              <th><i className="fas fa-percent"></i> Confiance</th>
              <th><i className="fas fa-circle"></i> Traitement</th>
              <th><i className="fas fa-cogs"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAlerts.map(alert => (
              <tr key={alert.id} className={getTypeClass(alert.type)}>
                <td className="alert-time">
                  <div className="time-main">{formatTime(alert.timestamp)}</div>
                  <div className="time-sub">{new Date(alert.timestamp).toLocaleDateString('fr')}</div>
                </td>
                <td>
                  <span className={`status-badge ${alert.type}`}>
                    <i className={`fas ${alert.icon}`}></i>
                    {alert.label}
                  </span>
                </td>
                <td>
                  <div className="student-info">
                    <strong>{alert.etudiant.prenom} {alert.etudiant.nom}</strong>
                    <div className="student-id">{alert.etudiant.id}</div>
                  </div>
                </td>
                <td className="seat-cell">
                  <span className="seat-badge">{alert.seat}</span>
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
                      <div className="confidence-fill" style={{ width: `${alert.aiConfidence}%`, background: alert.color }}></div>
                    </div>
                    <span className="confidence-value">{alert.aiConfidence}%</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={alert.status} 
                    onChange={(e) => handleUpdateStatus(alert.id, e.target.value)}
                    className={`status-select ${getStatusClass(alert.status)}`}
                  >
                    <option value="nouvelle">Nouvelle</option>
                    <option value="en_cours">En cours</option>
                    <option value="traitee">Traitée</option>
                    <option value="resolue">Résolue</option>
                  </select>
                </td>
                <td className="actions-cell">
                  <button className="action-btn view" onClick={() => { setSelectedAlert(alert); setShowDetails(true); }} title="Détails">
                    <i className="fas fa-eye"></i>
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
          <i className="fas fa-check-circle"></i>
          <h3>Aucune alerte trouvée</h3>
          <p>Aucune alerte ne correspond à vos critères de recherche</p>
        </div>
      )}

      {/* Modal */}
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