import React, { useState, useEffect } from "react";
import RapportDetails from "./RapportDetails";
import "./RapportsPage.css";

// Données mockées - Uniquement les cas ABNORMAL
const generateMockReports = () => {
  const etudiants = [
    { id: "20260015", nom: "Ben Ali", prenom: "Aymen", niveau: "L1", groupe: "G2", filiere: "Informatique" },
    { id: "20260042", nom: "Trabelsi", prenom: "Mohamed Ali", niveau: "L3", groupe: "G1", filiere: "Informatique" },
    { id: "20260008", nom: "Mansouri", prenom: "Nadia", niveau: "M1", groupe: "G3", filiere: "IA" },
    { id: "20260023", nom: "Khelil", prenom: "Yassine", niveau: "L2", groupe: "G2", filiere: "Réseaux" },
    { id: "20260031", nom: "Saidi", prenom: "Karim", niveau: "ING2", groupe: "G1", filiere: "Génie Logiciel" }
  ];

  const examens = [
    { matiere: "Algorithmique", code: "INF301", date: "2026-06-15", salle: "A12", duree: "3h" },
    { matiere: "Base de données", code: "INF202", date: "2026-06-14", salle: "B05", duree: "2h" },
    { matiere: "IA", code: "INF405", date: "2026-06-13", salle: "C08", duree: "3h" }
  ];

  const reports = [];
  const now = new Date();

  for (let i = 0; i < etudiants.length; i++) {
    const exam = examens[i % examens.length];
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    reports.push({
      id: `RPT${String(i + 1).padStart(4, '0')}`,
      student: etudiants[i],
      exam: exam,
      seat: `${String.fromCharCode(65 + (i % 5))}${Math.floor(i / 5) + 1}`,
      status: "ABNORMAL",
      riskScore: [82, 88, 76, 91, 79][i],
      analysisDate: date.toISOString(),
      reviewed: i % 2 === 0,
      videoReplay: true,
      anomalies: [
        "Mouvements suspects répétés",
        "Regards fréquents vers le voisin"
      ]
    });
  }

  return reports;
};

export default function RapportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const mockReports = generateMockReports();
      setReports(mockReports);
      setFilteredReports(mockReports);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...reports];
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.exam.matiere.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const stats = {
    total: filteredReports.length,
    abnormal: filteredReports.length,
    lastAnalysis: new Date().toLocaleDateString('fr')
  };

  if (loading) {
    return (
      <div className="rapports-page loading">
        <div className="spinner"></div>
        <p>Chargement des rapports...</p>
      </div>
    );
  }

  return (
    <div className="rapports-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="page-header">
        <h1><i className="fas fa-file-alt"></i> Reports</h1>
        <p>Dossiers complets des cas ABNORMAL</p>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-flag"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.abnormal}</div>
            <div className="stat-label">Abnormal Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.lastAnalysis}</div>
            <div className="stat-label">Last Analysis</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Rechercher un étudiant..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Examen</th>
              <th>Salle</th>
              <th>Seat</th>
              <th>Risk Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td className="student-cell">
                  <div className="student-name">{report.student.prenom} {report.student.nom}</div>
                  <div className="student-id">{report.student.id}</div>
                </td>
                <td>{report.exam.matiere}</td>
                <td>{report.exam.salle}</td>
                <td><span className="seat-badge">{report.seat}</span></td>
                <td>
                  <span className={`risk-score ${report.riskScore >= 85 ? "high" : report.riskScore >= 75 ? "medium" : "low"}`}>
                    {report.riskScore}%
                  </span>
                </td>
                <td>
                  <button className="btn-view" onClick={() => { setSelectedReport(report); setShowDetails(true); }}>
                    <i className="fas fa-eye"></i> Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Détails */}
      {showDetails && selectedReport && (
        <RapportDetails
          report={selectedReport}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}