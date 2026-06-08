import React, { useState, useRef, useEffect } from 'react';

export default function TeacherLive({ user }) {
  const [activeExam, setActiveExam] = useState({
    id: 1, matiere: 'Algorithmique Avancée', salle: 'A12', horaire: '08:30 - 10:30',
    etudiants: { presents: 28, absents: 2, total: 30 },
    alertes: 2, tempsRestant: '01:14:37',
    cameras: [
      { id: 0, name: 'Caméra 1 - Vue générale', stream: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
      { id: 1, name: 'Caméra 2 - Vue détaillée', stream: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' }
    ]
  });
  
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [liveAlerts, setLiveAlerts] = useState([
    { id: 1, type: 'Mouvement suspect', etudiant: 'Aymon Ben Ali', place: 'B4', time: '10:45:23', severity: 'high' },
    { id: 2, type: 'Consultation non autorisée', etudiant: 'Sara Haddad', place: 'C2', time: '10:32:11', severity: 'medium' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: 'Utilisation de téléphone',
        etudiant: 'Mehdi Kacem',
        place: 'D3',
        time: new Date().toLocaleTimeString(),
        severity: 'high'
      };
      setLiveAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="teacher-live">
      {/* Sélection examen */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-video"></i> Session en cours</h3>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>{activeExam.matiere}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{activeExam.salle} · {activeExam.horaire}</div>
            </div>
            <div className="live-badge" style={{ margin: 0 }}>
              <span className="live-dot"></span> EN DIRECT
            </div>
          </div>
        </div>

        {/* Sélecteur caméra */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {activeExam.cameras.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => setSelectedCamera(idx)}
              style={{
                padding: '8px 20px',
                background: selectedCamera === idx ? '#3b82f6' : '#f1f5f9',
                border: 'none',
                borderRadius: '10px',
                color: selectedCamera === idx ? 'white' : '#475569',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {cam.name}
            </button>
          ))}
        </div>

        {/* Flux vidéo */}
        <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
          <video
            src={activeExam.cameras[selectedCamera].stream}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <div style={{ padding: '16px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div><span style={{ color: '#64748b' }}>📊 Présents:</span> <strong style={{ color: '#10b981' }}>{activeExam.etudiants.presents}/{activeExam.etudiants.total}</strong></div>
              <div><span style={{ color: '#64748b' }}>⚠️ Alertes:</span> <strong style={{ color: '#ef4444' }}>{activeExam.alertes}</strong></div>
              <div><span style={{ color: '#64748b' }}>⏱️ Restant:</span> <strong>{activeExam.tempsRestant}</strong></div>
            </div>
            <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
              <i className="fas fa-expand"></i> Plein écran
            </button>
          </div>
        </div>

        {/* Détection IA */}
        <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '16px', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i className="fas fa-robot" style={{ color: '#ef4444' }}></i>
            <strong style={{ color: '#ef4444' }}>Détection IA en cours</strong>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px' }}>
            <span>🎯 Confiance: 87%</span>
            <span>👁️ Comportement: Mouvement suspect détecté</span>
            <span>📍 Position: Zone B4</span>
          </div>
        </div>
      </div>

      {/* Alertes en direct */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-bell"></i> Alertes en direct</h3>
          <span className="section-link">Voir toutes →</span>
        </div>
        
        {liveAlerts.map(alert => (
          <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#fef2f2', borderRadius: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{alert.type}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{alert.etudiant} - Place {alert.place} - {alert.time}</div>
            </div>
            <button style={{ background: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
              <i className="fas fa-eye"></i> Voir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}