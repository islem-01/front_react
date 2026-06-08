import React, { useState } from 'react';

export default function TeacherNotifications({ user }) {
  const [filter, setFilter] = useState('tous');

  const [notifications, setNotifications] = useState([
    {
      id: 1, type: 'surveillance', lu: false,
      titre: 'Nouvelle surveillance affectée',
      corps: 'Vous avez été affecté comme surveillant pour l\'examen Base de données.',
      detail: { examen: 'Base de données', date: '15/06/2026', salle: '1.1', horaire: '08h00 - 10h00' },
      heure: '09:32', date: 'Aujourd\'hui'
    },
    {
      id: 2, type: 'validation', lu: false,
      titre: 'Demande d\'examen acceptée',
      corps: 'Votre demande pour Algorithmique Avancée a été acceptée.',
      detail: { examen: 'Algorithmique Avancée', date: '20/06/2026', salle: 'A12', horaire: '09h00 - 11h00' },
      heure: '08:15', date: 'Aujourd\'hui'
    },
    {
      id: 3, type: 'refus', lu: false,
      titre: 'Demande d\'examen refusée',
      corps: 'Votre demande pour Réseaux TCP/IP a été refusée. Motif : conflit de salle.',
      detail: { examen: 'Réseaux TCP/IP', date: '—', salle: '—', horaire: '—' },
      heure: '17:45', date: 'Hier'
    },
    {
      id: 4, type: 'modification', lu: true,
      titre: 'Modification de salle',
      corps: 'La salle de votre examen Java Avancé a été modifiée de C03 à B08.',
      detail: { examen: 'Java Avancé', date: '28/06/2026', salle: 'B08', horaire: '09h00 - 11h00' },
      heure: '14:20', date: 'Hier'
    },
    {
      id: 5, type: 'modification', lu: true,
      titre: 'Modification d\'horaire',
      corps: 'L\'horaire de l\'examen Base de données a été décalé à 10h00.',
      detail: { examen: 'Base de données', date: '15/06/2026', salle: '1.1', horaire: '10h00 - 12h00' },
      heure: '11:05', date: '06/06/2026'
    },
    {
      id: 6, type: 'rapport', lu: true,
      titre: 'Rapport IA disponible',
      corps: 'Le rapport d\'analyse IA pour l\'examen Algorithmique est prêt à être consulté.',
      detail: { examen: 'Algorithmique', date: '05/06/2026', salle: 'A12', horaire: '—' },
      heure: '16:30', date: '05/06/2026'
    },
    {
      id: 7, type: 'annulation', lu: true,
      titre: 'Examen annulé',
      corps: 'L\'examen Physique Quantique prévu le 22/06/2026 a été annulé.',
      detail: { examen: 'Physique Quantique', date: '22/06/2026', salle: 'C05', horaire: '14h00 - 16h00' },
      heure: '10:00', date: '04/06/2026'
    },
    {
      id: 8, type: 'ia', lu: true,
      titre: 'Fin d\'analyse IA',
      corps: 'L\'analyse IA de la session Algorithmique est terminée. 3 anomalies détectées.',
      detail: { examen: 'Algorithmique', date: '05/06/2026', salle: 'A12', horaire: '—' },
      heure: '13:45', date: '05/06/2026'
    }
  ]);

  const typeConfig = {
    surveillance: { color: '#3b82f6', bg: '#eff6ff', icon: 'fa-shield-alt', label: 'Surveillance' },
    validation: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-check-circle', label: 'Validation' },
    refus: { color: '#ef4444', bg: '#fef2f2', icon: 'fa-times-circle', label: 'Refus' },
    modification: { color: '#f59e0b', bg: '#fffbeb', icon: 'fa-edit', label: 'Modification' },
    rapport: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-file-alt', label: 'Rapport' },
    annulation: { color: '#64748b', bg: '#f1f5f9', icon: 'fa-ban', label: 'Annulation' },
    ia: { color: '#06b6d4', bg: '#ecfeff', icon: 'fa-robot', label: 'IA' }
  };

  const filtered = filter === 'tous' ? notifications
    : filter === 'non_lu' ? notifications.filter(n => !n.lu)
    : notifications.filter(n => n.type === filter);

  const nonLuCount = notifications.filter(n => !n.lu).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, lu: true })));
  const markRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n));

  const groupedByDate = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <div className="teacher-notifications">
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: notifications.length, color: '#3b82f6', bg: '#eff6ff', icon: 'fa-bell' },
          { label: 'Non lues', value: nonLuCount, color: '#ef4444', bg: '#fef2f2', icon: 'fa-bell' },
          { label: 'Aujourd\'hui', value: notifications.filter(n => n.date === 'Aujourd\'hui').length, color: '#10b981', bg: '#ecfdf5', icon: 'fa-calendar-day' },
          { label: 'Cette semaine', value: notifications.length, color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-calendar-week' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <i className={`fas ${s.icon}`} style={{ color: s.color }}></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres + actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-filter"></i> Filtrer</h3>
          <button onClick={markAllRead} style={{
            background: '#eff6ff', border: 'none', padding: '7px 16px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#3b82f6', fontWeight: 500
          }}>
            <i className="fas fa-check-double"></i> Tout marquer lu
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { value: 'tous', label: 'Toutes', color: '#64748b' },
            { value: 'non_lu', label: `Non lues (${nonLuCount})`, color: '#ef4444' },
            { value: 'surveillance', label: 'Surveillance', color: '#3b82f6' },
            { value: 'validation', label: 'Validation', color: '#10b981' },
            { value: 'modification', label: 'Modification', color: '#f59e0b' },
            { value: 'rapport', label: 'Rapport', color: '#8b5cf6' },
            { value: 'ia', label: 'IA', color: '#06b6d4' }
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none',
              background: filter === f.value ? f.color : '#f1f5f9',
              color: filter === f.value ? 'white' : '#475569',
              cursor: 'pointer', fontSize: '12px', fontWeight: 500
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Notifications groupées */}
      {Object.entries(groupedByDate).map(([date, notifs]) => (
        <div key={date} className="dashboard-section">
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {date}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifs.map(notif => {
              const tc = typeConfig[notif.type];
              return (
                <div key={notif.id} onClick={() => markRead(notif.id)} style={{
                  display: 'flex', gap: '14px', padding: '16px 18px',
                  background: notif.lu ? 'white' : '#f8fbff',
                  borderRadius: '12px',
                  border: notif.lu ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                  cursor: 'pointer', position: 'relative',
                  transition: 'all 0.15s'
                }}>
                  {!notif.lu && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6'
                    }} />
                  )}
                  <div style={{
                    width: '42px', height: '42px', background: tc.bg, borderRadius: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <i className={`fas ${tc.icon}`} style={{ color: tc.color, fontSize: '17px' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: notif.lu ? 500 : 700, fontSize: '14px', marginBottom: '3px' }}>
                      {notif.titre}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{notif.corps}</div>
                    {/* Détail card */}
                    <div style={{
                      display: 'inline-flex', gap: '16px', padding: '8px 14px',
                      background: tc.bg, borderRadius: '8px', flexWrap: 'wrap'
                    }}>
                      <span style={{ fontSize: '12px', color: tc.color, fontWeight: 600 }}>
                        <i className="fas fa-book" style={{ marginRight: '4px' }}></i>{notif.detail.examen}
                      </span>
                      {notif.detail.date !== '—' && (
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          <i className="fas fa-calendar" style={{ marginRight: '4px' }}></i>{notif.detail.date}
                        </span>
                      )}
                      {notif.detail.salle !== '—' && (
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          <i className="fas fa-door-open" style={{ marginRight: '4px' }}></i>Salle {notif.detail.salle}
                        </span>
                      )}
                      {notif.detail.horaire !== '—' && (
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          <i className="fas fa-clock" style={{ marginRight: '4px' }}></i>{notif.detail.horaire}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, paddingTop: '2px' }}>{notif.heure}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="dashboard-section" style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-bell-slash" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: '#94a3b8' }}>Aucune notification</h3>
        </div>
      )}
    </div>
  );
}