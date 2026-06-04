import React, { useState, useEffect } from "react";
import AnomalyDetailsModal from "./AnomalyDetailsModal";
import QualityMetrics from "./QualityMetrics";
import "./AnomaliesPage.css";

// Données mockées des anomalies
const generateMockAnomalies = () => {
  const anomalyTypes = [
    { 
      type: "caméra_offline", 
      label: "📹 Caméra hors ligne", 
      category: "technique", 
      severity: "critical",
      icon: "📹",
      description: "Caméra de surveillance déconnectée"
    },
    { 
      type: "salle_surchargee", 
      label: "🏛️ Salle surchargée", 
      category: "logistique", 
      severity: "high",
      icon: "🏛️",
      description: "Nombre d'étudiants dépasse la capacité"
    },
    { 
      type: "etudiant_absent", 
      label: "👤 Étudiant absent non signalé", 
      category: "comportementale", 
      severity: "medium",
      icon: "👤",
      description: "Absence non justifiée"
    },
    { 
      type: "retard_prof", 
      label: "⏰ Retard surveillant", 
      category: "logistique", 
      severity: "medium",
      icon: "⏰",
      description: "Surveillant en retard"
    },
    { 
      type: "materiel_defectueux", 
      label: "💻 Matériel défectueux", 
      category: "technique", 
      severity: "high",
      icon: "💻",
      description: "Équipement non fonctionnel"
    },
    { 
      type: "tentative_triche", 
      label: "⚠️ Tentative de triche", 
      category: "comportementale", 
      severity: "critical",
      icon: "⚠️",
      description: "Comportement suspect détecté"
    },
    { 
      type: "connexion_instable", 
      label: "🌐 Connexion instable", 
      category: "technique", 
      severity: "medium",
      icon: "🌐",
      description: "Problème de réseau"
    },
    { 
      type: "document_manquant", 
      label: "📄 Document manquant", 
      category: "administrative", 
      severity: "low",
      icon: "📄",
      description: "Justificatif non fourni"
    }
  ];

  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C", "Labo Info"];
  const etudiants = [
    { id: "IIT00001", nom: "Ben Ali", prenom: "Ahmed" },
    { id: "IIT00002", nom: "Touati", prenom: "Sofia" }
  ];
  const surveillants = ["Dr. Karim Benali", "Pr. Salima Mansouri", "Dr. Amine Touati"];

  const anomalies = [];
  const now = new Date();

  for (let i = 1; i <= 35; i++) {
    const anomalyType = anomalyTypes[i % anomalyTypes.length];
    const salle = salles[i % salles.length];
    const date = new Date(now);
    date.setHours(now.getHours() - i * 2);
    
    anomalies.push({
      id: `ANM${String(i).padStart(4, '0')}`,
      type: anomalyType.type,
      label: anomalyType.label,
      category: anomalyType.category,
      severity: anomalyType.severity,
      icon: anomalyType.icon,
      description: anomalyType.description,
      salle: salle,
      salleId: i % 5 + 1,
      etudiant: i % 3 === 0 ? etudiants[i % etudiants.length] : null,
      surveillant: surveillants[i % surveillants.length],
      timestamp: date.toISOString(),
      resolution: i < 20 ? {
        resolvedBy: "Admin",
        resolvedAt: new Date(date.getTime() + 3600000).toISOString(),
        action: i % 3 === 0 ? "Capteur recalibré" : "Intervention technique",
        comment: "Problème résolu"
      } : null,
      status: i < 20 ? "resolue" : (i < 28 ? "en_cours" : "nouvelle"),
      impact: {
        etudiants_affectes: Math.floor(Math.random() * 30) + 5,
        duree: Math.floor(Math.random() * 60) + 5
      }
    });
  }

  return anomalies;
};

// Statistiques de qualité
const qualityMetrics = {
  scoreGlobal: 87.5,
  tauxResolution: 78.2,
  dureeMoyenneResolution: 45,
  anomaliesParCategorie: [
    { categorie: "Technique", count: 42, resolved: 35 },
    { categorie: "Logistique", count: 28, resolved: 22 },
    { categorie: "Comportementale", count: 35, resolved: 28 },
    { categorie: "Administrative", count: 15, resolved: 12 }
  ],
  tendanceMensuelle: [
    { mois: "Jan", anomalies: 12, resolues: 10 },
    { mois: "Fév", anomalies: 15, resolues: 13 },
    { mois: "Mar", anomalies: 18, resolues: 15 },
    { mois: "Avr", anomalies: 14, resolues: 12 },
    { mois: "Mai", anomalies: 20, resolues: 16 },
    { mois: "Juin", anomalies: 16, resolues: 14 }
  ]
};

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [filteredAnomalies, setFilteredAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQualityMetrics, setShowQualityMetrics] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("toutes");
  const [selectedSeverity, setSelectedSeverity] = useState("tous");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedSalle, setSelectedSalle] = useState("toutes");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    setTimeout(() => {
      setAnomalies(generateMockAnomalies());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterAnomalies();
  }, [anomalies, searchTerm, selectedCategory, selectedSeverity, selectedStatus, selectedSalle, dateRange]);

  const filterAnomalies = () => {
    let filtered = [...anomalies];
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.salle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "toutes") {
      filtered = filtered.filter(a => a.category === selectedCategory);
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
    
    if (dateRange.start) {
      filtered = filtered.filter(a => a.timestamp.split('T')[0] >= dateRange.start);
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(a => a.timestamp.split('T')[0] <= dateRange.end);
    }
    
    setFilteredAnomalies(filtered);
  };

  const handleResolveAnomaly = (anomalyId, resolution) => {
    setAnomalies(anomalies.map(a => 
      a.id === anomalyId ? { 
        ...a, 
        status: "resolue",
        resolution: {
          resolvedBy: "Administrateur",
          resolvedAt: new Date().toISOString(),
          action: resolution.action,
          comment: resolution.comment
        }
      } : a
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

  const getCategoryLabel = (category) => {
    switch(category) {
      case "technique": return "🔧 Technique";
      case "logistique": return "📦 Logistique";
      case "comportementale": return "👤 Comportementale";
      case "administrative": return "📋 Administrative";
      default: return category;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "nouvelle": return "🟡 Nouvelle";
      case "en_cours": return "🔵 En cours";
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

  const sallesUniques = [...new Set(anomalies.map(a => a.salle))];
  const categoriesUniques = ["technique", "logistique", "comportementale", "administrative"];
  const severitesUniques = ["critical", "high", "medium", "low"];

  if (loading) {
    return (
      <div className="anomalies-page loading">
        <div className="spinner"></div>
        <p>Chargement des anomalies...</p>
      </div>
    );
  }

  return (
    <div className="anomalies-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔍 Anomalies - Contrôle qualité</h1>
          <p className="page-subtitle">Détection et suivi des anomalies système et comportementales</p>
        </div>
        <div className="header-actions">
          <button className="btn-quality" onClick={() => setShowQualityMetrics(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/>
            </svg>
            Métriques qualité
          </button>
          <button className="btn-export" onClick={() => alert("Export des anomalies")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Exporter
          </button>
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
            placeholder="Rechercher une anomalie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="toutes">Toutes catégories</option>
          {categoriesUniques.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
        </select>
        <select className="filter-select" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
          <option value="tous">Toutes sévérités</option>
          <option value="critical">Critique</option>
          <option value="high">Élevée</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
        <select className="filter-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="tous">Tous statuts</option>
          <option value="nouvelle">Nouvelle</option>
          <option value="en_cours">En cours</option>
          <option value="resolue">Résolue</option>
        </select>
        <select className="filter-select" value={selectedSalle} onChange={(e) => setSelectedSalle(e.target.value)}>
          <option value="toutes">Toutes salles</option>
          {sallesUniques.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="filter-date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} placeholder="Date début" />
        <input type="date" className="filter-date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} placeholder="Date fin" />
      </div>

      {/* Statistiques rapides */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{anomalies.length}</div>
            <div className="stat-label">Total anomalies</div>
          </div>
        </div>
        <div className="stat-card critical">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">{anomalies.filter(a => a.severity === "critical").length}</div>
            <div className="stat-label">Critiques</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{anomalies.filter(a => a.status === "resolue").length}</div>
            <div className="stat-label">Résolues</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{anomalies.filter(a => a.status === "en_cours").length}</div>
            <div className="stat-label">En cours</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-info">
            <div className="stat-value">{anomalies.filter(a => a.status === "nouvelle").length}</div>
            <div className="stat-label">Nouvelles</div>
          </div>
        </div>
      </div>

      {/* Liste des anomalies */}
      <div className="anomalies-list">
        <div className="anomalies-header">
          <span>🕒 Date/Heure</span>
          <span>📊 Sévérité</span>
          <span>📋 Type d'anomalie</span>
          <span>📍 Lieu</span>
          <span>📂 Catégorie</span>
          <span>👤 Responsable</span>
          <span>🔧 Statut</span>
          <span>⚡ Actions</span>
        </div>
        
        {filteredAnomalies.map(anomaly => (
          <div key={anomaly.id} className={`anomaly-item severity-${anomaly.severity}`}>
            <div className="anomaly-time">
              <span className="time">{formatTime(anomaly.timestamp)}</span>
              <span className="date">{new Date(anomaly.timestamp).toLocaleDateString('fr')}</span>
            </div>
            <div className="anomaly-severity">
              <span className={`severity-badge ${getSeverityColor(anomaly.severity)}`}>
                {getSeverityLabel(anomaly.severity)}
              </span>
            </div>
            <div className="anomaly-type">
              <span className="type-icon">{anomaly.icon}</span>
              <span className="type-label">{anomaly.label}</span>
            </div>
            <div className="anomaly-location">
              <span className="room-name">{anomaly.salle}</span>
            </div>
            <div className="anomaly-category">
              <span className="category-badge">{getCategoryLabel(anomaly.category)}</span>
            </div>
            <div className="anomaly-responsible">
              <span>{anomaly.surveillant}</span>
            </div>
            <div className="anomaly-status">
              <span className={`status-badge status-${anomaly.status}`}>
                {getStatusLabel(anomaly.status)}
              </span>
            </div>
            <div className="anomaly-actions">
              <button className="action-btn view" onClick={() => { setSelectedAnomaly(anomaly); setShowDetails(true); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                </svg>
              </button>
              {anomaly.status !== "resolue" && (
                <button className="action-btn resolve" onClick={() => {
                  const action = prompt("Action corrective:", "Intervention technique");
                  if (action) {
                    handleResolveAnomaly(anomaly.id, { action, comment: "Résolu par administrateur" });
                  }
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAnomalies.length === 0 && (
        <div className="no-anomalies">
          <div className="no-anomalies-icon">✅</div>
          <h3>Aucune anomalie trouvée</h3>
          <p>Aucune anomalie ne correspond à vos critères de recherche</p>
        </div>
      )}

      {showDetails && selectedAnomaly && (
        <AnomalyDetailsModal
          anomaly={selectedAnomaly}
          onClose={() => setShowDetails(false)}
          onResolve={handleResolveAnomaly}
        />
      )}

      {showQualityMetrics && (
        <QualityMetrics
          metrics={qualityMetrics}
          anomalies={anomalies}
          onClose={() => setShowQualityMetrics(false)}
        />
      )}
    </div>
  );
}