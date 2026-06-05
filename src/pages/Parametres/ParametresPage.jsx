import React, { useState } from "react";
import "./ParametresPage.css";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Paramètres généraux
  const [general, setGeneral] = useState({
    universite: "Université Internationale de Technologie",
    langue: "fr",
    anneeUniversitaire: "2025-2026"
  });

  // Utilisateurs
  const [users, setUsers] = useState([
    { id: 1, nom: "Admin", email: "admin@iit.tn", role: "Administrateur", actif: true },
    { id: 2, nom: "Prof. Kamel Mansouri", email: "kamel@iit.tn", role: "Surveillant", actif: true },
    { id: 3, nom: "Prof. Salma Bouaziz", email: "salma@iit.tn", role: "Surveillant", actif: false }
  ]);

  // Seuils d'analyse
  const [thresholds, setThresholds] = useState({
    normal: 50,
    suspect: 75,
    abnormal: 100
  });

  // Stockage
  const [storage, setStorage] = useState({
    videos: 1248,
    used: "45.2 GB",
    available: "154.8 GB"
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ nom: "", email: "", role: "Surveillant" });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addUser = () => {
    if (newUser.nom && newUser.email) {
      setUsers([...users, { ...newUser, id: Date.now(), actif: true }]);
      setNewUser({ nom: "", email: "", role: "Surveillant" });
      setShowAddUser(false);
      handleSave();
    }
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, actif: !u.actif } : u));
    handleSave();
  };

  const deleteUser = (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      setUsers(users.filter(u => u.id !== id));
      handleSave();
    }
  };

  const clearVideos = () => {
    if (window.confirm("Supprimer toutes les vidéos ?")) {
      setStorage({ ...storage, videos: 0, used: "0 GB" });
      handleSave();
    }
  };

  const tabs = [
    { id: "general", label: "Général", icon: "fa-globe" },
    { id: "users", label: "Utilisateurs", icon: "fa-users" },
    { id: "analysis", label: "Analyse", icon: "fa-chart-line" },
    { id: "storage", label: "Stockage", icon: "fa-database" },
    { id: "security", label: "Sécurité", icon: "fa-shield-alt" }
  ];

  return (
    <div className="settings-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="settings-header">
        <h1><i className="fas fa-cog"></i> Paramètres</h1>
        <p>Configuration du système</p>
      </div>

      {/* Toast */}
      {saveSuccess && (
        <div className="toast">
          <i className="fas fa-check-circle"></i> Paramètres enregistrés
        </div>
      )}

      {/* Settings Container */}
      <div className="settings-wrapper">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-sidebar-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-main">
          {/* Onglet Général */}
          {activeTab === "general" && (
            <div className="settings-section">
              <h3><i className="fas fa-university"></i> Informations générales</h3>
              <div className="form-group">
                <label>Nom de l'université</label>
                <input 
                  type="text" 
                  value={general.universite} 
                  onChange={(e) => setGeneral({...general, universite: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Langue</label>
                  <select value={general.langue} onChange={(e) => setGeneral({...general, langue: e.target.value})} className="form-control">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Année universitaire</label>
                  <select value={general.anneeUniversitaire} onChange={(e) => setGeneral({...general, anneeUniversitaire: e.target.value})} className="form-control">
                    <option>2023-2024</option>
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Utilisateurs */}
          {activeTab === "users" && (
            <div className="settings-section">
              <div className="section-header">
                <h3><i className="fas fa-users"></i> Gestion des utilisateurs</h3>
                <button className="btn-add" onClick={() => setShowAddUser(true)}>
                  <i className="fas fa-plus"></i> Ajouter
                </button>
              </div>

              <div className="users-table">
                <div className="users-header">
                  <span>Utilisateur</span>
                  <span>Email</span>
                  <span>Rôle</span>
                  <span>Statut</span>
                  <span>Actions</span>
                </div>
                {users.map(user => (
                  <div key={user.id} className="users-row">
                    <span><strong>{user.nom}</strong></span>
                    <span>{user.email}</span>
                    <span><span className="role-tag">{user.role}</span></span>
                    <span>
                      <span className={`status-tag ${user.actif ? "active" : "inactive"}`}>
                        {user.actif ? "Actif" : "Inactif"}
                      </span>
                    </span>
                    <span className="user-actions">
                      <button onClick={() => toggleUserStatus(user.id)} title={user.actif ? "Désactiver" : "Activer"}>
                        <i className={`fas ${user.actif ? "fa-pause" : "fa-play"}`}></i>
                      </button>
                      <button onClick={() => deleteUser(user.id)} title="Supprimer">
                        <i className="fas fa-trash"></i>
                      </button>
                    </span>
                  </div>
                ))}
              </div>

              {/* Modal Ajout Utilisateur */}
              {showAddUser && (
                <div className="modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>Ajouter un utilisateur</h3>
                      <button className="modal-close" onClick={() => setShowAddUser(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      <input type="text" placeholder="Nom complet" value={newUser.nom} onChange={(e) => setNewUser({...newUser, nom: e.target.value})} />
                      <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                      <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                        <option value="Administrateur">Administrateur</option>
                        <option value="Surveillant">Surveillant</option>
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button className="btn-cancel" onClick={() => setShowAddUser(false)}>Annuler</button>
                      <button className="btn-save" onClick={addUser}>Ajouter</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Analyse */}
          {activeTab === "analysis" && (
            <div className="settings-section">
              <h3><i className="fas fa-chart-line"></i> Seuils d'analyse</h3>
              
              <div className="threshold-bar">
                <div className="threshold normal" style={{ width: `${thresholds.normal}%` }}>
                  Normal<br/><small>0-{thresholds.normal}%</small>
                </div>
                <div className="threshold suspect" style={{ width: `${thresholds.suspect - thresholds.normal}%` }}>
                  Suspect<br/><small>{thresholds.normal}-{thresholds.suspect}%</small>
                </div>
                <div className="threshold abnormal" style={{ width: `${100 - thresholds.suspect}%` }}>
                  Abnormal<br/><small>{thresholds.suspect}-100%</small>
                </div>
              </div>

              <div className="info-box">
                <i className="fas fa-info-circle"></i>
                Risk Score ≥ {thresholds.suspect}% → ABNORMAL
              </div>
            </div>
          )}

          {/* Onglet Stockage */}
          {activeTab === "storage" && (
            <div className="settings-section">
              <h3><i className="fas fa-database"></i> Gestion du stockage</h3>
              
              <div className="storage-stats">
                <div className="storage-card">
                  <i className="fas fa-video"></i>
                  <div>
                    <div className="storage-value">{storage.videos}</div>
                    <div className="storage-label">Vidéos stockées</div>
                  </div>
                </div>
                <div className="storage-card">
                  <i className="fas fa-hdd"></i>
                  <div>
                    <div className="storage-value">{storage.used}</div>
                    <div className="storage-label">Espace utilisé</div>
                  </div>
                </div>
                <div className="storage-card">
                  <i className="fas fa-cloud"></i>
                  <div>
                    <div className="storage-value">{storage.available}</div>
                    <div className="storage-label">Espace disponible</div>
                  </div>
                </div>
              </div>

              <button className="btn-danger" onClick={clearVideos}>
                <i className="fas fa-trash"></i> Supprimer les anciennes vidéos
              </button>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "security" && (
            <div className="settings-section">
              <h3><i className="fas fa-shield-alt"></i> Sécurité</h3>
              
              <div className="form-group">
                <label>Changer le mot de passe</label>
                <input type="password" placeholder="Nouveau mot de passe" className="form-control" />
                <input type="password" placeholder="Confirmer" className="form-control" style={{ marginTop: 8 }} />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="2fa" />
                <label htmlFor="2fa">Activer l'authentification à deux facteurs (2FA)</label>
              </div>
            </div>
          )}

          {/* Bouton Enregistrer */}
          {activeTab !== "users" && (
            <div className="form-actions">
              <button className="btn-save" onClick={handleSave}>
                <i className="fas fa-save"></i> Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}