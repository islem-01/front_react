import React, { useState } from 'react';

export default function TeacherExams({ user }) {
  const [exams, setExams] = useState([
    { id: 1, matiere: 'Algorithmique Avancée', code: 'INF301', salle: 'A12', date: '15/06/2026', heureDebut: '08:30', heureFin: '10:30', duree: '2h', nbrEtudiants: 28, statut: 'accepté', type: 'Examen final' },
    { id: 2, matiere: 'Base de données', code: 'INF202', salle: 'B05', date: '20/06/2026', heureDebut: '11:00', heureFin: '13:00', duree: '2h', nbrEtudiants: 32, statut: 'en_attente', type: 'Examen final' },
    { id: 3, matiere: 'Java Avancé', code: 'INF305', salle: 'C03', date: '28/06/2026', heureDebut: '09:00', heureFin: '11:00', duree: '2h', nbrEtudiants: 25, statut: 'en_attente', type: 'Examen final' },
    { id: 4, matiere: 'Réseaux', code: 'INF203', salle: 'B08', date: '10/06/2026', heureDebut: '14:00', heureFin: '16:00', duree: '2h', nbrEtudiants: 30, statut: 'terminé', type: 'Examen final' }
  ]);

  const [filter, setFilter] = useState('tous');
  const [selectedExam, setSelectedExam] = useState(null);

  const filteredExams = exams.filter(e => filter === 'tous' || e.statut === filter);

  const stats = {
    total: exams.length,
    acceptes: exams.filter(e => e.statut === 'accepté').length,
    enAttente: exams.filter(e => e.statut === 'en_attente').length,
    etudiants: exams.reduce((sum, e) => sum + e.nbrEtudiants, 0)
  };

  const getStatusBadge = (statut) => {
    switch(statut) {
      case 'accepté': return <span className="status-badge accepted"><i className="fas fa-check-circle"></i> Accepté</span>;
      case 'en_attente': return <span className="status-badge pending"><i className="fas fa-clock"></i> En attente</span>;
      case 'terminé': return <span className="status-badge done"><i className="fas fa-check-double"></i> Terminé</span>;
      default: return <span className="status-badge">{statut}</span>;
    }
  };

  return (
    <div className="teacher-exams">
      {/* Statistiques */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon blue"><i className="fas fa-file-alt"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total examens</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.acceptes}</div>
            <div className="stat-label">Acceptés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.enAttente}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><i className="fas fa-users"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.etudiants}</div>
            <div className="stat-label">Total étudiants</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-filter"></i> Filtrer</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'tous', label: 'Tous', color: '#64748b' },
              { value: 'accepté', label: 'Acceptés', color: '#10b981' },
              { value: 'en_attente', label: 'En attente', color: '#f59e0b' },
              { value: 'terminé', label: 'Terminés', color: '#8b5cf6' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: filter === f.value ? f.color : '#f1f5f9',
                  color: filter === f.value ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des examens */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-list"></i> Mes examens</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="exams-table">
            <thead>
              <tr>
                <th>Matière</th><th>Code</th><th>Date</th><th>Horaire</th><th>Salle</th><th>Étudiants</th><th>Statut</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr key={exam.id}>
                  <td><strong>{exam.matiere}</strong></td>
                  <td style={{ color: '#64748b' }}>{exam.code}</td>
                  <td>{exam.date}</td>
                  <td>{exam.heureDebut} - {exam.heureFin}</td>
                  <td>{exam.salle}</td>
                  <td>{exam.nbrEtudiants}</td>
                  <td>{getStatusBadge(exam.statut)}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedExam(exam)}
                      style={{ background: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      <i className="fas fa-eye"></i> Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedExam && (
        <div className="modal-overlay" onClick={() => setSelectedExam(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'examen</h3>
              <button className="close" onClick={() => setSelectedExam(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '12px' }}><strong>Matière:</strong> {selectedExam.matiere}</div>
              <div style={{ marginBottom: '12px' }}><strong>Code:</strong> {selectedExam.code}</div>
              <div style={{ marginBottom: '12px' }}><strong>Type:</strong> {selectedExam.type}</div>
              <div style={{ marginBottom: '12px' }}><strong>Salle:</strong> {selectedExam.salle}</div>
              <div style={{ marginBottom: '12px' }}><strong>Date:</strong> {selectedExam.date}</div>
              <div style={{ marginBottom: '12px' }}><strong>Horaire:</strong> {selectedExam.heureDebut} - {selectedExam.heureFin}</div>
              <div style={{ marginBottom: '12px' }}><strong>Durée:</strong> {selectedExam.duree}</div>
              <div style={{ marginBottom: '12px' }}><strong>Étudiants:</strong> {selectedExam.nbrEtudiants}</div>
              <div><strong>Statut:</strong> {getStatusBadge(selectedExam.statut)}</div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedExam(null)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}