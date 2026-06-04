import React, { useState, useEffect } from "react";
import RapportDetails from "./RapportDetails";
import ExportModal from "./ExportModal";
import "./RapportsPage.css";

// Données mockées des rapports
const generateMockData = () => {
  // Statistiques générales
  const statsGenerales = {
    totalExamens: 156,
    totalEtudiants: 1248,
    totalSalles: 12,
    totalEnseignants: 48,
    tauxReussiteGlobal: 78.5,
    tauxPresenceMoyen: 85.3,
    alertesTotal: 243,
    anomaliesTotal: 87
  };

  // Données mensuelles
  const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const donneesMensuelles = mois.map((mois, index) => ({
    mois: mois,
    examens: Math.floor(Math.random() * 20 + 5),
    presence: Math.floor(Math.random() * 20 + 75),
    reussite: Math.floor(Math.random() * 25 + 65),
    alertes: Math.floor(Math.random() * 30 + 5)
  }));

  // Données par filière
  const filieres = ["Informatique", "Réseaux", "Mathématiques", "IA", "Génie Logiciel", "Cyber Sécurité"];
  const donneesParFiliere = filieres.map(filiere => ({
    filiere: filiere,
    etudiants: Math.floor(Math.random() * 300 + 100),
    examens: Math.floor(Math.random() * 30 + 10),
    reussite: Math.floor(Math.random() * 25 + 65),
    presence: Math.floor(Math.random() * 20 + 75),
    alertes: Math.floor(Math.random() * 30 + 5)
  }));

  // Données par niveau
  const niveaux = ["1ère Licence", "2ème Licence", "3ème Licence", "1ère Master", "2ème Master", "1ère Ingénieur", "2ème Ingénieur", "3ème Ingénieur"];
  const donneesParNiveau = niveaux.map(niveau => ({
    niveau: niveau,
    etudiants: Math.floor(Math.random() * 200 + 50),
    examens: Math.floor(Math.random() * 25 + 5),
    reussite: Math.floor(Math.random() * 25 + 65),
    presence: Math.floor(Math.random() * 20 + 75)
  }));

  // Données par salle
  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C", "Labo Info"];
  const donneesParSalle = salles.map(salle => ({
    salle: salle,
    capacite: [30, 30, 40, 40, 120, 25][salles.indexOf(salle)],
    examens: Math.floor(Math.random() * 20 + 5),
    utilisation: Math.floor(Math.random() * 30 + 60),
    alertes: Math.floor(Math.random() * 20 + 2)
  }));

  // Données par enseignant
  const enseignants = [
    "Dr. Karim Benali", "Pr. Salima Mansouri", "Dr. Amine Touati",
    "Pr. Nadia Khelil", "Dr. Sofiene Marzouk", "Pr. Hichem Jaouadi"
  ];
  const donneesParEnseignant = enseignants.map(enseignant => ({
    enseignant: enseignant,
    examensSurveilles: Math.floor(Math.random() * 30 + 10),
    etudiantsEncadres: Math.floor(Math.random() * 200 + 50),
    tauxReussite: Math.floor(Math.random() * 25 + 65),
    alertesSignalees: Math.floor(Math.random() * 15 + 2)
  }));

  // Alertes récentes pour le dashboard
  const alertesRecentes = [
    { type: "Tentative de triche", salle: "Salle A101", date: "2026-03-25", statut: "Traitée" },
    { type: "Téléphone détecté", salle: "Salle B201", date: "2026-03-24", statut: "En cours" },
    { type: "Comportement suspect", salle: "Amphithéâtre C", date: "2026-03-23", statut: "Résolue" },
    { type: "Caméra hors ligne", salle: "Salle A102", date: "2026-03-22", statut: "En attente" }
  ];

  // Examens récents
  const examensRecents = [
    { matiere: "Architecture", date: "2026-03-25", presence: 85, reussite: 78 },
    { matiere: "Algorithmique", date: "2026-03-24", presence: 92, reussite: 82 },
    { matiere: "Réseaux", date: "2026-03-23", presence: 78, reussite: 71 },
    { matiere: "IA", date: "2026-03-22", presence: 88, reussite: 85 }
  ];

  return {
    statsGenerales,
    donneesMensuelles,
    donneesParFiliere,
    donneesParNiveau,
    donneesParSalle,
    donneesParEnseignant,
    alertesRecentes,
    examensRecents
  };
};

export default function RapportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("annee");
  const [selectedFiliere, setSelectedFiliere] = useState("toutes");
  const [selectedNiveau, setSelectedNiveau] = useState("tous");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);
  }, []);

  const handleExport = (format) => {
    alert(`Export en ${format} lancé !`);
    setShowExportModal(false);
  };

  const handleViewRapport = (type) => {
    setSelectedRapport(type);
  };

  if (loading) {
    return (
      <div className="rapports-page loading">
        <div className="spinner"></div>
        <p>Chargement des rapports...</p>
      </div>
    );
  }

  const maxExamens = Math.max(...data.donneesMensuelles.map(d => d.examens));
  const maxPresence = Math.max(...data.donneesMensuelles.map(d => d.presence));
  const maxReussite = Math.max(...data.donneesMensuelles.map(d => d.reussite));

  return (
    <div className="rapports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Rapports & Statistiques</h1>
          <p className="page-subtitle">Analyse post-examen et indicateurs de performance</p>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={() => setShowExportModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <select className="filter-select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="mois">Ce mois</option>
          <option value="trimestre">Ce trimestre</option>
          <option value="semestre">Ce semestre</option>
          <option value="annee">Cette année</option>
        </select>
        <select className="filter-select" value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="toutes">Toutes filières</option>
          {data.donneesParFiliere.map(f => <option key={f.filiere} value={f.filiere}>{f.filiere}</option>)}
        </select>
        <select className="filter-select" value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
          <option value="tous">Tous niveaux</option>
          {data.donneesParNiveau.map(n => <option key={n.niveau} value={n.niveau}>{n.niveau}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div className="report-tabs">
        <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          📈 Dashboard
        </button>
        <button className={`tab-btn ${activeTab === "filieres" ? "active" : ""}`} onClick={() => setActiveTab("filieres")}>
          🎓 Par filière
        </button>
        <button className={`tab-btn ${activeTab === "niveaux" ? "active" : ""}`} onClick={() => setActiveTab("niveaux")}>
          📚 Par niveau
        </button>
        <button className={`tab-btn ${activeTab === "salles" ? "active" : ""}`} onClick={() => setActiveTab("salles")}>
          🏛️ Par salle
        </button>
        <button className={`tab-btn ${activeTab === "enseignants" ? "active" : ""}`} onClick={() => setActiveTab("enseignants")}>
          👨‍🏫 Par enseignant
        </button>
        <button className={`tab-btn ${activeTab === "alertes" ? "active" : ""}`} onClick={() => setActiveTab("alertes")}>
          ⚠️ Alertes & Anomalies
        </button>
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="dashboard-reports">
          {/* Cartes KPI */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">📋</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.totalExamens}</div>
                <div className="kpi-label">Examens organisés</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.totalEtudiants}</div>
                <div className="kpi-label">Étudiants inscrits</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.tauxReussiteGlobal}%</div>
                <div className="kpi-label">Taux de réussite</div>
                <div className="kpi-trend up">+5.2% vs année dernière</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">📊</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.tauxPresenceMoyen}%</div>
                <div className="kpi-label">Taux de présence</div>
                <div className="kpi-trend up">+2.1% vs année dernière</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">⚠️</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.alertesTotal}</div>
                <div className="kpi-label">Alertes IA</div>
                <div className="kpi-trend down">-8% vs année dernière</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">🔧</div>
              <div className="kpi-info">
                <div className="kpi-value">{data.statsGenerales.anomaliesTotal}</div>
                <div className="kpi-label">Anomalies techniques</div>
                <div className="kpi-trend down">-12% vs année dernière</div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="charts-row">
            <div className="chart-card large">
              <div className="chart-header">
                <h3>📈 Évolution mensuelle</h3>
                <div className="chart-legend">
                  <span><span className="legend-color examens"></span> Examens</span>
                  <span><span className="legend-color presence"></span> Présence (%)</span>
                  <span><span className="legend-color reussite"></span> Réussite (%)</span>
                </div>
              </div>
              <div className="line-chart">
                {data.donneesMensuelles.map((item, index) => (
                  <div key={index} className="chart-column">
                    <div className="chart-bars">
                      <div className="bar examens" style={{ height: `${(item.examens / maxExamens) * 100}%` }}></div>
                      <div className="bar presence" style={{ height: `${item.presence}%` }}></div>
                      <div className="bar reussite" style={{ height: `${item.reussite}%` }}></div>
                    </div>
                    <div className="chart-label">{item.mois}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="charts-row two-cols">
            <div className="chart-card">
              <h3>🏆 Top filières par réussite</h3>
              <div className="ranking-list">
                {data.donneesParFiliere.sort((a, b) => b.reussite - a.reussite).slice(0, 5).map((f, i) => (
                  <div key={i} className="ranking-item">
                    <div className="ranking-rank">{i + 1}</div>
                    <div className="ranking-name">{f.filiere}</div>
                    <div className="ranking-value">{f.reussite}%</div>
                    <div className="ranking-bar"><div className="bar-fill" style={{ width: `${f.reussite}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-card">
              <h3>🏆 Top salles par utilisation</h3>
              <div className="ranking-list">
                {data.donneesParSalle.sort((a, b) => b.utilisation - a.utilisation).slice(0, 5).map((s, i) => (
                  <div key={i} className="ranking-item">
                    <div className="ranking-rank">{i + 1}</div>
                    <div className="ranking-name">{s.salle}</div>
                    <div className="ranking-value">{s.utilisation}%</div>
                    <div className="ranking-bar"><div className="bar-fill" style={{ width: `${s.utilisation}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="charts-row two-cols">
            <div className="chart-card">
              <h3>📝 Derniers examens</h3>
              <table className="recent-table">
                <thead>
                  <tr><th>Matière</th><th>Date</th><th>Présence</th><th>Réussite</th></tr>
                </thead>
                <tbody>
                  {data.examensRecents.map((exam, i) => (
                    <tr key={i}>
                      <td>{exam.matiere}</td>
                      <td>{exam.date}</td>
                      <td><span className="presence-badge">{exam.presence}%</span></td>
                      <td><span className="success-badge">{exam.reussite}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="chart-card">
              <h3>⚠️ Alertes récentes</h3>
              <div className="alerts-list">
                {data.alertesRecentes.map((alerte, i) => (
                  <div key={i} className="alert-item-small">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-info">
                      <div className="alert-title">{alerte.type}</div>
                      <div className="alert-meta">{alerte.salle} • {alerte.date}</div>
                    </div>
                    <div className={`alert-status ${alerte.statut === "Traitée" ? "resolved" : "pending"}`}>{alerte.statut}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Par filière */}
      {activeTab === "filieres" && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Filière</th>
                <th>Étudiants</th>
                <th>Examens</th>
                <th>Taux de présence</th>
                <th>Taux de réussite</th>
                <th>Alertes</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.donneesParFiliere.map((f, i) => (
                <tr key={i}>
                  <td className="title-cell">{f.filiere}</td>
                  <td>{f.etudiants}</td>
                  <td>{f.examens}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.presence}%`, background: "#22c55e" }}></div></div>
                      <span>{f.presence}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.reussite}%`, background: "#1a3a8f" }}></div></div>
                      <span>{f.reussite}%</span>
                    </div>
                  </td>
                  <td>{f.alertes}</td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewRapport(f.filiere)}>Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Par niveau */}
      {activeTab === "niveaux" && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Niveau</th>
                <th>Étudiants</th>
                <th>Examens</th>
                <th>Taux de présence</th>
                <th>Taux de réussite</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.donneesParNiveau.map((n, i) => (
                <tr key={i}>
                  <td className="title-cell">{n.niveau}</td>
                  <td>{n.etudiants}</td>
                  <td>{n.examens}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${n.presence}%`, background: "#22c55e" }}></div></div>
                      <span>{n.presence}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${n.reussite}%`, background: "#1a3a8f" }}></div></div>
                      <span>{n.reussite}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewRapport(n.niveau)}>Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Par salle */}
      {activeTab === "salles" && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Salle</th>
                <th>Capacité</th>
                <th>Examens</th>
                <th>Taux d'utilisation</th>
                <th>Alertes</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.donneesParSalle.map((s, i) => (
                <tr key={i}>
                  <td className="title-cell">{s.salle}</td>
                  <td>{s.capacite}</td>
                  <td>{s.examens}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.utilisation}%`, background: "#eab308" }}></div></div>
                      <span>{s.utilisation}%</span>
                    </div>
                  </td>
                  <td>{s.alertes}</td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewRapport(s.salle)}>Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Par enseignant */}
      {activeTab === "enseignants" && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Examens surveillés</th>
                <th>Étudiants encadrés</th>
                <th>Taux de réussite</th>
                <th>Alertes signalées</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.donneesParEnseignant.map((e, i) => (
                <tr key={i}>
                  <td className="title-cell">{e.enseignant}</td>
                  <td>{e.examensSurveilles}</td>
                  <td>{e.etudiantsEncadres}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${e.tauxReussite}%`, background: "#1a3a8f" }}></div></div>
                      <span>{e.tauxReussite}%</span>
                    </div>
                  </td>
                  <td>{e.alertesSignalees}</td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewRapport(e.enseignant)}>Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alertes & Anomalies */}
      {activeTab === "alertes" && (
        <div className="alertes-report">
          <div className="stats-cards small">
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <div className="stat-value">{data.statsGenerales.alertesTotal}</div>
                <div className="stat-label">Alertes totales</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔧</div>
              <div className="stat-info">
                <div className="stat-value">{data.statsGenerales.anomaliesTotal}</div>
                <div className="stat-label">Anomalies techniques</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-value">87%</div>
                <div className="stat-label">Alertes résolues</div>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>📊 Répartition des alertes par type</h3>
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div className="pie-segment" style={{ transform: "rotate(0deg)", background: "#dc2626" }}></div>
                <div className="pie-segment" style={{ transform: "rotate(130deg)", background: "#f97316" }}></div>
                <div className="pie-segment" style={{ transform: "rotate(230deg)", background: "#eab308" }}></div>
                <div className="pie-segment" style={{ transform: "rotate(300deg)", background: "#22c55e" }}></div>
              </div>
              <div className="pie-legend">
                <div><span className="legend-color critical"></span> Critique (32%)</div>
                <div><span className="legend-color high"></span> Élevée (28%)</div>
                <div><span className="legend-color medium"></span> Moyenne (24%)</div>
                <div><span className="legend-color low"></span> Basse (16%)</div>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>📈 Évolution des alertes</h3>
            <div className="line-chart-simple">
              {data.donneesMensuelles.map((item, i) => (
                <div key={i} className="line-point" style={{ bottom: `${(item.alertes / 35) * 100}%`, left: `${(i / 11) * 100}%` }}>
                  <div className="point-label">{item.alertes}</div>
                </div>
              ))}
              <div className="line-connection"></div>
              <div className="x-axis">
                {data.donneesMensuelles.map((item, i) => <span key={i}>{item.mois}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <ExportModal
          onExport={handleExport}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {selectedRapport && (
        <RapportDetails
          type={selectedRapport}
          data={data}
          onClose={() => setSelectedRapport(null)}
        />
      )}
    </div>
  );
}