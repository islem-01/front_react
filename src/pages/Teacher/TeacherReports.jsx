import React, { useState } from 'react';

export default function TeacherReports({ user }) {
  const [reports] = useState([
    { id: 1, title: 'Rapport - Base de données', date: '15/06/2026', salle: 'A12', type: 'IA', hasPDF: true },
    { id: 2, title: 'Rapport - Réseaux Informatiques', date: '05/06/2026', salle: 'B05', type: 'IA', hasPDF: true },
    { id: 3, title: 'Rapport - Java Avancé', date: '30/05/2026', salle: 'C03', type: 'IA', hasPDF: true },
    { id: 4, title: 'Rapport de présence - A12', date: '15/06/2026', salle: 'A12', type: 'Présence', hasPDF: true },
    { id: 5, title: 'Rapport d\'incidents', date: '15/06/2026', salle: 'A12', type: 'Incidents', hasPDF: true }
  ]);

  return (
    <div className="teacher-reports">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-robot"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">3</div>
            <div className="stat-label">Rapports IA</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">1</div>
            <div className="stat-label">Rapports présence</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">1</div>
            <div className="stat-label">Rapports incidents</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-file-alt"></i> Tous mes rapports</h3>
          <button style={{ background: '#3b82f6', border: 'none', padding: '0.4rem 1rem', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <i className="fas fa-download"></i> Exporter tout
          </button>
        </div>
        
        {reports.map(report => (
          <div key={report.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1rem',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{ width: '40px', height: '40px', background: report.type === 'IA' ? '#eff6ff' : report.type === 'Présence' ? '#ecfdf5' : '#fef2f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`fas ${report.type === 'IA' ? 'fa-robot' : report.type === 'Présence' ? 'fa-user-check' : 'fa-exclamation-triangle'}`} style={{ color: report.type === 'IA' ? '#3b82f6' : report.type === 'Présence' ? '#10b981' : '#f59e0b' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{report.title}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{report.date} - {report.salle}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                <i className="fas fa-eye"></i> Voir
              </button>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                <i className="fas fa-download"></i> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}