import React, { useState } from 'react';

export default function TeacherSurveillances({ user }) {
  const [filter, setFilter] = useState('tous');
  const [selectedSurv, setSelectedSurv] = useState(null);

  const surveillances = [
    {
      id: 1,
      examen: 'Base de données',
      responsable: 'Dr. Ahmed Karim',
      date: '15/06/2026',
      horaire: '08h00 - 10h00',
      salle: '1.1',
      nbrEtudiants: 30,
      statut: 'confirmée',
      niveau: '2CI',
      filiere: 'Génie Logiciel',
      groupe: 'GL2'
    },
    {
      id: 2,
      examen: 'Mathématiques Avancées',
      responsable: 'Dr. Sonia Mansouri',
      date: '18/06/2026',
      horaire: '10h00 - 12h00',
      salle: 'B02',
      nbrEtudiants: 28,
      statut: 'confirmée',
      niveau: '1CI',
      filiere: 'Informatique',
      groupe: 'I1'
    },
    {
      id: 3,
      examen: 'Physique Quantique',
      responsable: 'Dr. Yassine Mrad',
      date: '22/06/2026',
      horaire: '14h00 - 16h00',
      salle: 'C05',
      nbrEtudiants: 24,
      statut: 'en_attente',
      niveau: '3CI',
      filiere: 'ARSI',
      groupe: 'A1'
    },
    {
      id: 4,
      examen: 'Algorithmique',
      responsable: 'Dr. Amine Ben Ali',
      date: '05/06/2026',
      horaire: '09h00 - 11h00',
      salle: 'A12',
      nbrEtudiants: 32,
      statut: 'terminée',
      niveau: '2CI',
      filiere: 'Génie Logiciel',
      groupe: 'GL1'
    }
  ];

  const filtered = filter === 'tous' ? surveillances : surveillances.filter(s => s.statut === filter);

  const statusConfig = {
    confirmée: { bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0', label: 'Confirmée', icon: 'fa-check-circle' },
    en_attente: { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a', label: 'En attente', icon: 'fa-clock' },
    terminée: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', label: 'Terminée', icon: 'fa-check-double' }
  };

  const stats = {
    total: surveillances.length,
    confirmees: surveillances.filter(s => s.statut === 'confirmée').length,
    enAttente: surveillances.filter(s => s.statut === 'en_attente').length,
    terminees: surveillances.filter(s => s.statut === 'terminée').length
  };

  return (
    <div className="teacher-surveillances">
      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total surveillances', value: stats.total, icon: 'fa-shield-alt', color: 'blue' },
          { label: 'Confirmées', value: stats.confirmees, icon: 'fa-check-circle', color: 'green' },
          { label: 'En attente', value: stats.enAttente, icon: 'fa-clock', color: 'orange' },
          { label: 'Terminées', value: stats.terminees, icon: 'fa-check-double', color: 'purple' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fas ${s.icon}`}></i></div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-filter"></i> Filtrer</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'tous', label: 'Toutes', color: '#64748b' },
              { value: 'confirmée', label: 'Confirmées', color: '#10b981' },
              { value: 'en_attente', label: 'En attente', color: '#f59e0b' },
              { value: 'terminée', label: 'Terminées', color: '#8b5cf6' }
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                padding: '6px 16px', borderRadius: '20px', border: 'none',
                background: filter === f.value ? f.color : '#f1f5f9',
                color: filter === f.value ? 'white' : '#475569',
                cursor: 'pointer', fontSize: '12px', fontWeight: 500
              }}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-shield-alt"></i> Mes surveillances affectées</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(surv => {
            const sc = statusConfig[surv.statut];
            return (
              <div key={surv.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', background: 'white',
                borderRadius: '14px', border: `1px solid #e2e8f0`,
                borderLeft: `4px solid ${sc.color}`,
                transition: 'box-shadow 0.2s'
              }}>
                <div style={{
                  width: '48px', height: '48px', background: sc.bg,
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`fas fa-shield-alt`} style={{ color: sc.color, fontSize: '20px' }}></i>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{surv.examen}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span><i className="fas fa-user-tie" style={{ marginRight: '4px' }}></i>{surv.responsable}</span>
                    <span><i className="fas fa-calendar" style={{ marginRight: '4px' }}></i>{surv.date}</span>
                    <span><i className="fas fa-clock" style={{ marginRight: '4px' }}></i>{surv.horaire}</span>
                    <span><i className="fas fa-door-open" style={{ marginRight: '4px' }}></i>{surv.salle}</span>
                    <span><i className="fas fa-users" style={{ marginRight: '4px' }}></i>{surv.nbrEtudiants} étudiants</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                    fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                  }}>
                    <i className={`fas ${sc.icon}`} style={{ marginRight: '4px' }}></i>{sc.label}
                  </span>
                  <button onClick={() => setSelectedSurv(surv)} style={{
                    background: '#eff6ff', border: 'none', padding: '7px 14px',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#3b82f6'
                  }}>
                    <i className="fas fa-eye"></i> Détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal détails */}
      {selectedSurv && (
        <div className="modal-overlay" onClick={() => setSelectedSurv(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3><i className="fas fa-shield-alt"></i> Détails de la surveillance</h3>
              <button onClick={() => setSelectedSurv(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                borderRadius: '12px', padding: '16px', marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{selectedSurv.examen}</div>
                <div style={{ fontSize: '13px', color: '#3b82f6' }}>Salle {selectedSurv.salle} · {selectedSurv.date} · {selectedSurv.horaire}</div>
              </div>

              {[
                { label: 'Prof responsable', value: selectedSurv.responsable, icon: 'fa-user-tie' },
                { label: 'Salle', value: selectedSurv.salle, icon: 'fa-door-open' },
                { label: 'Horaire', value: selectedSurv.horaire, icon: 'fa-clock' },
                { label: 'Niveau', value: selectedSurv.niveau, icon: 'fa-graduation-cap' },
                { label: 'Filière', value: selectedSurv.filiere, icon: 'fa-book' },
                { label: 'Groupe', value: selectedSurv.groupe, icon: 'fa-users' },
                { label: 'Étudiants', value: selectedSurv.nbrEtudiants, icon: 'fa-user-graduate' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fas ${item.icon}`} style={{ color: '#64748b', fontSize: '13px' }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedSurv(null)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}