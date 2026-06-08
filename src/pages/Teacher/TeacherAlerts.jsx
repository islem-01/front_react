import React, { useState } from 'react';

export default function TeacherAlerts({ user }) {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Mouvement suspect', etudiant: 'Aymon Ben Ali', place: 'B4', salle: 'A12', heure: '10:45', severity: 'high', status: 'nouvelle', videoUrl: '#' },
    { id: 2, type: 'Consultation non autorisée', etudiant: 'Sara Haddad', place: 'C2', salle: 'A12', heure: '10:32', severity: 'medium', status: 'nouvelle', videoUrl: '#' },
    { id: 3, type: 'Utilisation de téléphone', etudiant: 'Mehdi Kacem', place: 'D3', salle: 'A12', heure: '10:28', severity: 'high', status: 'traitee', videoUrl: '#' },
    { id: 4, type: 'Chuchotement répété', etudiant: 'Imen Trabelsi', place: 'A5', salle: 'A12', heure: '10:15', severity: 'medium', status: 'traitee', videoUrl: '#' }
  ]);

  const [filter, setFilter] = useState('tous');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [comment, setComment] = useState('');

  const filteredAlerts = alerts.filter(a => filter === 'tous' || a.status === filter);
  const unreadCount = alerts.filter(a => a.status === 'nouvelle').length;

  const handleMarkAsTreated = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'traitee' } : a));
    setSelectedAlert(null);
  };

  const getSeverityIcon = (severity) => severity === 'high' ? 'fa-circle' : 'fa-circle';
  const getSeverityColor = (severity) => severity === 'high' ? '#ef4444' : '#f59e0b';
  const getSeverityBg = (severity) => severity === 'high' ? '#fef2f2' : '#fffbeb';

  return (
    <div className="teacher-alerts" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
            <i className="fas fa-bell" style={{ color: '#ef4444', marginRight: '12px' }}></i>
            Alertes IA
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Surveillance en temps réel · Salle A12</p>
        </div>
        {unreadCount > 0 && (
          <div style={{ background: '#fef2f2', padding: '8px 16px', borderRadius: '30px' }}>
            <span style={{ fontWeight: 600, color: '#ef4444' }}>
              <i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '6px', verticalAlign: 'middle' }}></i>
              {unreadCount} alerte(s) non traitée(s)
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #eef2f6' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>{alerts.length}</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Total alertes</div>
        </div>
        <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '16px', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{alerts.filter(a => a.severity === 'high').length}</div>
          <div style={{ fontSize: '13px', color: '#ef4444' }}>Haute sévérité</div>
        </div>
        <div style={{ background: '#fffbeb', borderRadius: '16px', padding: '16px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{alerts.filter(a => a.severity === 'medium').length}</div>
          <div style={{ fontSize: '13px', color: '#f59e0b' }}>Moyenne sévérité</div>
        </div>
        <div style={{ background: '#ecfdf5', borderRadius: '16px', padding: '16px', border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{alerts.filter(a => a.status === 'traitee').length}</div>
          <div style={{ fontSize: '13px', color: '#10b981' }}>Traitées</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { value: 'tous', label: 'Toutes les alertes', color: '#64748b' },
          { value: 'nouvelle', label: 'Nouvelles', color: '#ef4444' },
          { value: 'traitee', label: 'Traitées', color: '#10b981' }
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', background: filter === f.value ? f.color : '#f1f5f9', color: filter === f.value ? 'white' : '#475569', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.map(alert => (
          <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', background: alert.status === 'nouvelle' ? '#ffffff' : '#fafbfc', borderRadius: '16px', border: alert.status === 'nouvelle' ? '1px solid #fee2e2' : '1px solid #eef2f6', boxShadow: alert.status === 'nouvelle' ? '0 2px 8px rgba(239,68,68,0.08)' : 'none' }}>
            <div style={{ width: '48px', height: '48px', background: getSeverityBg(alert.severity), borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`fas ${getSeverityIcon(alert.severity)}`} style={{ color: getSeverityColor(alert.severity), fontSize: '20px' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{alert.type}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: getSeverityBg(alert.severity), color: getSeverityColor(alert.severity), fontWeight: 600 }}>{alert.severity === 'high' ? 'Haute' : 'Moyenne'}</span>
                {alert.status === 'nouvelle' && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#fef2f2', color: '#ef4444', fontWeight: 600 }}><i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '4px', verticalAlign: 'middle' }}></i> Nouvelle</span>}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                <i className="fas fa-user-graduate" style={{ marginRight: '6px', width: '16px' }}></i>
                {alert.etudiant} · Place {alert.place} · {alert.heure}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => setSelectedAlert(alert)} style={{ background: '#f1f5f9', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-video"></i> Voir vidéo</button>
                <button onClick={() => alert(`Étudiant: ${alert.etudiant}\nPlace: ${alert.place}\nSalle: ${alert.salle}\nHeure: ${alert.heure}\nType: ${alert.type}`)} style={{ background: '#eff6ff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-user"></i> Voir étudiant</button>
                {alert.status === 'nouvelle' && <button onClick={() => handleMarkAsTreated(alert.id)} style={{ background: '#ecfdf5', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-check"></i> Traiter</button>}
                {alert.status === 'traitee' && <span style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-check-circle"></i> Traitée</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '20px' }}>
          <i className="fas fa-bell-slash" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ fontSize: '16px', color: '#64748b' }}>Aucune alerte</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucune alerte ne correspond à vos critères</p>
        </div>
      )}

      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3><i className="fas fa-video"></i> Extrait vidéo - {selectedAlert.type}</h3>
              <button className="close" onClick={() => setSelectedAlert(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#1e293b', borderRadius: '16px', padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-video" style={{ fontSize: '48px', color: '#64748b', marginBottom: '16px', display: 'block' }}></i>
                <div style={{ color: 'white', fontWeight: 500 }}>Vidéo de surveillance</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Salle {selectedAlert.salle} · Place {selectedAlert.place} · {selectedAlert.heure}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><i className="fas fa-user-graduate"></i></div>
                  <div><div style={{ fontWeight: 700 }}>{selectedAlert.etudiant}</div><div style={{ fontSize: '12px', color: '#64748b' }}>Place {selectedAlert.place} · Salle {selectedAlert.salle}</div></div>
                </div>
              </div>
              <textarea placeholder="Ajouter un commentaire..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '16px', minHeight: '80px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }} />
              <button onClick={() => { handleMarkAsTreated(selectedAlert.id); setComment(''); }} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}><i className="fas fa-check-circle"></i> Valider et traiter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}