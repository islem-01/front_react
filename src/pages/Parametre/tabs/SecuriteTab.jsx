import React, { useState } from "react";

export default function SecuriteTab({ onSave }) {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: [],
    newPassword: "",
    confirmPassword: ""
  });
  const [newIp, setNewIp] = useState("");

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleAddIp = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      setSettings({ ...settings, ipWhitelist: [...settings.ipWhitelist, newIp] });
      setNewIp("");
    }
  };

  const handleRemoveIp = (ip) => {
    setSettings({ ...settings, ipWhitelist: settings.ipWhitelist.filter(i => i !== ip) });
  };

  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    alert("Mot de passe modifié avec succès !");
    setSettings({ ...settings, newPassword: "", confirmPassword: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>🔐 Authentification</h3>
        <div className="section-desc">Renforcez la sécurité de votre compte</div>
        
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="twoFactorAuth" 
            checked={settings.twoFactorAuth} 
            onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
          />
          <label htmlFor="twoFactorAuth">Authentification à deux facteurs (2FA)</label>
        </div>
        
        {settings.twoFactorAuth && (
          <div className="info-card">
            <div className="info-title">📱 Configuration 2FA</div>
            <div className="info-text">Scannez le QR code avec Google Authenticator ou Authy</div>
            <div style={{ marginTop: "10px", padding: "10px", background: "white", borderRadius: "8px", textAlign: "center" }}>
              [QR Code Placeholder]
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label>Délai d'expiration de session (minutes)</label>
          <input 
            type="number" 
            value={settings.sessionTimeout} 
            onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
            min="5"
            max="120"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Expiration du mot de passe (jours)</label>
          <input 
            type="number" 
            value={settings.passwordExpiry} 
            onChange={(e) => handleChange("passwordExpiry", parseInt(e.target.value))}
            min="30"
            max="365"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Tentatives de connexion autorisées</label>
          <select value={settings.loginAttempts} onChange={(e) => handleChange("loginAttempts", parseInt(e.target.value))} className="form-select">
            <option value={3}>3 tentatives</option>
            <option value={5}>5 tentatives</option>
            <option value={10}>10 tentatives</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>🔑 Modifier le mot de passe</h3>
        <div className="section-desc">Changez votre mot de passe de connexion</div>
        
        <div className="form-group">
          <label>Nouveau mot de passe</label>
          <input 
            type="password" 
            value={settings.newPassword} 
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className="form-input"
            placeholder="••••••••"
          />
        </div>
        
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <input 
            type="password" 
            value={settings.confirmPassword} 
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="form-input"
            placeholder="••••••••"
          />
        </div>
        
        <button type="button" className="btn-secondary" onClick={handlePasswordChange}>Modifier le mot de passe</button>
      </div>

      <div className="settings-section">
        <h3>🌐 IP autorisées</h3>
        <div className="section-desc">Limitez l'accès à certaines adresses IP</div>
        
        <div className="form-group">
          <label>Ajouter une IP</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              value={newIp} 
              onChange={(e) => setNewIp(e.target.value)}
              className="form-input"
              placeholder="192.168.1.1"
            />
            <button type="button" className="btn-secondary" onClick={handleAddIp}>Ajouter</button>
          </div>
        </div>
        
        {settings.ipWhitelist.length > 0 && (
          <div className="info-card">
            <div className="info-title">IPs autorisées</div>
            {settings.ipWhitelist.map(ip => (
              <div key={ip} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0" }}>
                <span>{ip}</span>
                <button type="button" className="btn-danger" style={{ padding: "0.2rem 0.5rem" }} onClick={() => handleRemoveIp(ip)}>Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="warning-card">
        <div className="warning-title">⚠️ Journal d'activité</div>
        <div className="info-text">Dernières connexions suspectes : Aucune activité suspecte détectée</div>
      </div>

      <button type="submit" className="btn-save">Enregistrer les paramètres de sécurité</button>
    </form>
  );
}