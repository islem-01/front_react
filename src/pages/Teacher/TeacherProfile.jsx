import React, { useState } from 'react';

export default function TeacherProfile({ user, onLogout }) {
  const [profile, setProfile] = useState({
    nom: 'Dr. Amine Ben Ali',
    email: 'amine.benali@iit.tn',
    telephone: '+216 98 123 456',
    departement: 'Informatique',
    bureau: 'B-301',
    specialites: ['Algorithmique', 'Base de données', 'Java Avancé', 'Réseaux']
  });

  const examHistory = [
    { matiere: 'Algorithmique Avancée', date: '15/06/2026', salle: 'A12', etudiants: 28 },
    { matiere: 'Base de données', date: '10/06/2026', salle: 'B05', etudiants: 32 },
    { matiere: 'Java Avancé', date: '05/06/2026', salle: 'C03', etudiants: 25 },
    { matiere: 'Réseaux', date: '30/05/2026', salle: 'A12', etudiants: 30 }
  ];

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="teacher-profile">
      {saveSuccess && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', zIndex: 1000 }}>
          <i className="fas fa-check-circle"></i> Profil mis à jour !
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Photo et infos */}
        <div className="dashboard-section" style={{ textAlign: 'center' }}>
          <div style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-user-graduate" style={{ fontSize: '48px', color: 'white' }}></i>
          </div>
          <h3>{profile.nom}</h3>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Professeur d'informatique</p>
          <button style={{ marginTop: '16px', background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
            <i className="fas fa-camera"></i> Changer la photo
          </button>
        </div>

        {/* Informations personnelles */}
        <div className="dashboard-section">
          <h3 style={{ marginBottom: '16px' }}><i className="fas fa-user"></i> Informations personnelles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><strong>Nom complet:</strong><br/>{profile.nom}</div>
            <div><strong>Email:</strong><br/>{profile.email}</div>
            <div><strong>Téléphone:</strong><br/>{profile.telephone}</div>
            <div><strong>Département:</strong><br/>{profile.departement}</div>
            <div><strong>Bureau:</strong><br/>{profile.bureau}</div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <strong>Matières enseignées:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {profile.specialites.map((s, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historique des examens */}
      <div className="dashboard-section" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h3><i className="fas fa-history"></i> Historique des examens surveillés</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="exams-table">
            <thead>
              <tr><th>Matière</th><th>Date</th><th>Salle</th><th>Étudiants</th><th>Rapport</th></tr>
            </thead>
            <tbody>
              {examHistory.map((exam, idx) => (
                <tr key={idx}>
                  <td><strong>{exam.matiere}</strong></td>
                  <td>{exam.date}</td>
                  <td>{exam.salle}</td>
                  <td>{exam.etudiants}</td>
                  <td><i className="fas fa-download" style={{ cursor: 'pointer', color: '#3b82f6' }}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
        <button onClick={handleSave} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer' }}>
          <i className="fas fa-save"></i> Enregistrer
        </button>
        <button onClick={onLogout} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer' }}>
          <i className="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </div>
    </div>
  );
}