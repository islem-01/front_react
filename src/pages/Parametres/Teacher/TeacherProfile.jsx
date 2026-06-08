import React, { useState } from 'react';

export default function TeacherProfile({ user, onLogout }) {
  const [profile, setProfile] = useState({
    nom: user?.name || "Prof. Kamel Mansouri",
    email: user?.email || "kamel.mansouri@iit.tn",
    telephone: "+216 98 123 456",
    departement: "Informatique",
    bureau: "B-301",
    dateEmbauche: "2015-09-01",
    bio: "Professeur d'informatique spécialisé en Algorithmique et Intelligence Artificielle."
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    email: true,
    realtime: true,
    weekly: false,
    system: true
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwordData.new.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    alert("Mot de passe modifié avec succès !");
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowPasswordForm(false);
  };

  const examHistory = [
    { matiere: "Algorithmique", date: "15/06/2026", salle: "A12", etudiants: 28 },
    { matiere: "Base de données", date: "10/06/2026", salle: "B05", etudiants: 32 },
    { matiere: "Réseaux", date: "05/06/2026", salle: "C08", etudiants: 25 }
  ];

  return (
    <div className="teacher-profile">
      {saveSuccess && (
        <div className="toast-success">
          <i className="fas fa-check-circle"></i> Profil mis à jour avec succès !
        </div>
      )}

      <div className="profile-grid">
        {/* Avatar Section */}
        <div className="profile-card">
          <h3><i className="fas fa-user-circle"></i> Photo de profil</h3>
          <div className="avatar-section">
            <div className="avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fas fa-user-graduate"></i>
                </div>
              )}
            </div>
            <label className="btn-upload">
              <i className="fas fa-camera"></i> Changer la photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="profile-card">
          <h3><i className="fas fa-id-card"></i> Informations personnelles</h3>
          <div className="form-group">
            <label>Nom complet</label>
            <input type="text" value={profile.nom} onChange={(e) => setProfile({...profile, nom: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input type="tel" value={profile.telephone} onChange={(e) => setProfile({...profile, telephone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Département</label>
            <input type="text" value={profile.departement} onChange={(e) => setProfile({...profile, departement: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Bureau</label>
            <input type="text" value={profile.bureau} onChange={(e) => setProfile({...profile, bureau: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Date d'embauche</label>
            <input type="date" value={profile.dateEmbauche} onChange={(e) => setProfile({...profile, dateEmbauche: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows="3" />
          </div>
        </div>

        {/* Sécurité */}
        <div className="profile-card">
          <h3><i className="fas fa-shield-alt"></i> Sécurité</h3>
          {!showPasswordForm ? (
            <button className="btn-secondary" onClick={() => setShowPasswordForm(true)}>
              <i className="fas fa-key"></i> Changer le mot de passe
            </button>
          ) : (
            <div className="password-form">
              <input type="password" placeholder="Mot de passe actuel" value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} />
              <input type="password" placeholder="Nouveau mot de passe" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} />
              <input type="password" placeholder="Confirmer" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} />
              <div className="form-actions">
                <button className="btn-save" onClick={handleChangePassword}>Enregistrer</button>
                <button className="btn-cancel" onClick={() => setShowPasswordForm(false)}>Annuler</button>
              </div>
            </div>
          )}
          
          <div className="security-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Activer l'authentification à deux facteurs (2FA)</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="profile-card">
          <h3><i className="fas fa-bell"></i> Préférences de notification</h3>
          <div className="notification-option">
            <label className="switch">
              <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} />
              <span className="slider"></span>
            </label>
            <div className="option-info">
              <strong>Alertes par email</strong>
              <p>Recevez les alertes par email</p>
            </div>
          </div>
          <div className="notification-option">
            <label className="switch">
              <input type="checkbox" checked={notifications.realtime} onChange={(e) => setNotifications({...notifications, realtime: e.target.checked})} />
              <span className="slider"></span>
            </label>
            <div className="option-info">
              <strong>Alertes en temps réel</strong>
              <p>Notifications instantanées pendant l'examen</p>
            </div>
          </div>
          <div className="notification-option">
            <label className="switch">
              <input type="checkbox" checked={notifications.weekly} onChange={(e) => setNotifications({...notifications, weekly: e.target.checked})} />
              <span className="slider"></span>
            </label>
            <div className="option-info">
              <strong>Rapport hebdomadaire</strong>
              <p>Résumé des activités de la semaine</p>
            </div>
          </div>
        </div>

        {/* Historique des examens */}
        <div className="profile-card full-width">
          <h3><i className="fas fa-history"></i> Historique des examens surveillés</h3>
          <div className="exam-history-table">
            <table>
              <thead>
                <tr><th>Matière</th><th>Date</th><th>Salle</th><th>Étudiants</th></tr>
              </thead>
              <tbody>
                {examHistory.map((exam, idx) => (
                  <tr key={idx}>
                    <td>{exam.matiere}</td>
                    <td>{exam.date}</td>
                    <td>{exam.salle}</td>
                    <td>{exam.etudiants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-save" onClick={handleSaveProfile}>
          <i className="fas fa-save"></i> Enregistrer les modifications
        </button>
        <button className="btn-danger" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </div>
    </div>
  );
}