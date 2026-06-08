import React, { useState } from 'react';

export default function TeacherReports({ user }) {
  const [reports, setReports] = useState([
    { id: 1, examen: "Algorithmique", date: "2026-06-15", nbrAnomalies: 2, nbrSuspects: 3, riskMoyen: 78, statut: "disponible" },
    { id: 2, examen: "Base de données", date: "2026-06-14", nbrAnomalies: 1, nbrSuspects: 2, riskMoyen: 65, statut: "disponible" },
    { id: 3, examen: "Réseaux", date: "2026-06-10", nbrAnomalies: 0, nbrSuspects: 1, riskMoyen: 45, statut: "disponible" }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: reports.length + 1,
        examen: "IA",
        date: new Date().toISOString().split('T')[0],
        nbrAnomalies: 3,
        nbrSuspects: 2,
        riskMoyen: 82,
        statut: "disponible"
      };
      setReports([newReport, ...reports]);
      setGenerating(false);
      alert("Rapport généré avec succès !");
    }, 2000);
  };

  return (
    <div className="teacher-reports">
      <div className="reports-header">
        <h3><i className="fas fa-chart-line"></i> Rapports d'examen</h3>
        <button className="btn-generate" onClick={handleGenerateReport} disabled={generating}>
          {generating ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-plus"></i>}
          {generating ? " Génération..." : " Générer un rapport"}
        </button>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <div>
                <h4>{report.examen}</h4>
                <p className="report-date">{report.date}</p>
              </div>
              <span className={`risk-badge ${report.riskMoyen >= 75 ? "high" : report.riskMoyen >= 60 ? "medium" : "low"}`}>
                Risk: {report.riskMoyen}%
              </span>
            </div>
            <div className="report-stats">
              <div className="stat">
                <span className="stat-value">{report.nbrAnomalies}</span>
                <span className="stat-label">Anomalies</span>
              </div>
              <div className="stat">
                <span className="stat-value">{report.nbrSuspects}</span>
                <span className="stat-label">Suspects</span>
              </div>
              <div className="stat">
                <span className="stat-value">{report.riskMoyen}%</span>
                <span className="stat-label">Score moyen</span>
              </div>
            </div>
            <div className="report-actions">
              <button className="btn-view" onClick={() => setSelectedReport(report)}>
                <i className="fas fa-eye"></i> Voir détails
              </button>
              <button className="btn-download">
                <i className="fas fa-download"></i> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Détails Rapport */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rapport - {selectedReport.examen}</h3>
              <button className="close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="report-summary">
                <div className="summary-card">
                  <h4><i className="fas fa-chart-bar"></i> Statistiques globales</h4>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span className="stat-label">Date de l'examen</span>
                      <span className="stat-value">{selectedReport.date}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Anomalies détectées</span>
                      <span className="stat-value">{selectedReport.nbrAnomalies}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Comportements suspects</span>
                      <span className="stat-value">{selectedReport.nbrSuspects}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Risk Score moyen</span>
                      <span className="stat-value">{selectedReport.riskMoyen}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h4><i className="fas fa-exclamation-triangle"></i> Détail des incidents</h4>
                  <div className="incidents-list">
                    <div className="incident-item abnormal">
                      <span className="incident-time">09:23</span>
                      <span className="incident-desc">Comportement anormal - Ahmed Ben Ali (Place B3)</span>
                      <span className="incident-status">Confirmé</span>
                    </div>
                    <div className="incident-item suspect">
                      <span className="incident-time">09:15</span>
                      <span className="incident-desc">Comportement suspect - Sofia Touati (Place C2)</span>
                      <span className="incident-status">En cours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-download">
                <i className="fas fa-file-pdf"></i> Télécharger PDF
              </button>
              <button className="btn-print">
                <i className="fas fa-print"></i> Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}