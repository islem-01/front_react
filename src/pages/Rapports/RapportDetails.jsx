import React, { useState } from "react";

export default function RapportDetails({ report, onClose }) {
  const [reviewed, setReviewed] = useState(report.reviewed);

  const riskLevel = report.riskScore >= 85 ? "Très élevé" : report.riskScore >= 75 ? "Élevé" : "Modéré";
  const riskColor = report.riskScore >= 85 ? "#dc2626" : report.riskScore >= 75 ? "#f59e0b" : "#eab308";

  const handleMarkReviewed = () => {
    setReviewed(true);
    alert("Rapport marqué comme révisé");
  };

  const handleDownload = () => {
    alert("Téléchargement du rapport...");
  };

  const handleViewReplay = () => {
    alert("Lecture du replay vidéo...");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2><i className="fas fa-file-alt"></i> Détail du rapport</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="modal-body">
          {/* Student Information */}
          <div className="detail-section">
            <div className="section-title">
              <i className="fas fa-user-graduate"></i> Student Information
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Name :</span>
                <span className="info-value">{report.student.prenom} {report.student.nom}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Student ID :</span>
                <span className="info-value">{report.student.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Level :</span>
                <span className="info-value">{report.student.niveau}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Group :</span>
                <span className="info-value">{report.student.groupe}</span>
              </div>
            </div>
          </div>

          {/* Exam Information */}
          <div className="detail-section">
            <div className="section-title">
              <i className="fas fa-calendar-alt"></i> Exam Information
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Exam :</span>
                <span className="info-value">{report.exam.matiere}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date :</span>
                <span className="info-value">{new Date(report.exam.date).toLocaleDateString('fr')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Room :</span>
                <span className="info-value">{report.exam.salle}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Seat :</span>
                <span className="info-value">{report.seat}</span>
              </div>
            </div>
          </div>

          {/* Analysis Result */}
          <div className="detail-section">
            <div className="section-title">
              <i className="fas fa-chart-line"></i> Analysis Result
            </div>
            <div className="analysis-box">
              <div className="status-badge abnormal">
                <i className="fas fa-exclamation-triangle"></i> STATUS : ABNORMAL
              </div>
              <div className="risk-display">
                <span className="risk-label">Risk Score :</span>
                <span className="risk-value" style={{ color: riskColor }}>{report.riskScore}%</span>
                <span className="risk-level" style={{ background: `${riskColor}15`, color: riskColor }}>{riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-section">
            <div className="section-title">
              <i className="fas fa-cogs"></i> Actions
            </div>
            <div className="actions-buttons">
              <button className="action-btn video" onClick={handleViewReplay}>
                <i className="fas fa-video"></i> View Replay
              </button>
              <button className="action-btn download" onClick={handleDownload}>
                <i className="fas fa-download"></i> Download Report
              </button>
              {!reviewed && (
                <button className="action-btn review" onClick={handleMarkReviewed}>
                  <i className="fas fa-check-circle"></i> Mark as Reviewed
                </button>
              )}
              {reviewed && (
                <div className="reviewed-badge">
                  <i className="fas fa-check-circle"></i> Already Reviewed
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}