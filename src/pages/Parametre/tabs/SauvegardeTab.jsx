import React, { useState } from "react";

export default function SauvegardeTab({ onSave }) {
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    backupRetention: 30,
    backupLocation: "local",
    ftpHost: "",
    ftpUser: "",
    ftpPass: ""
  });

  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupHistory, setBackupHistory] = useState([
    { date: "2026-03-25 02:00", size: "45.2 MB", status: "success" },
    { date: "2026-03-24 02:00", size: "44.8 MB", status: "success" },
    { date: "2026-03-23 02:00", size: "45.0 MB", status: "success" },
    { date: "2026-03-22 02:00", size: "44.5 MB", status: "failed" }
  ]);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleManualBackup = () => {
    setIsBackingUp(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBackupProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsBackingUp(false);
        alert("✅ Sauvegarde manuelle terminée avec succès !");
        setBackupProgress(0);
      }
    }, 300);
  };

  const handleRestore = () => {
    if (window.confirm("⚠️ Attention : La restauration effacera toutes les données actuelles. Continuer ?")) {
      alert("Fonction de restauration à implémenter");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>💾 Sauvegarde automatique</h3>
        <div className="section-desc">Planifiez des sauvegardes régulières</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="autoBackup" checked={settings.autoBackup} onChange={(e) => handleChange("autoBackup", e.target.checked)} />
          <label htmlFor="autoBackup">Activer la sauvegarde automatique</label>
        </div>
        
        {settings.autoBackup && (
          <>
            <div className="form-group">
              <label>Fréquence</label>
              <select value={settings.backupFrequency} onChange={(e) => handleChange("backupFrequency", e.target.value)} className="form-select">
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Heure de sauvegarde</label>
              <input type="time" value={settings.backupTime} onChange={(e) => handleChange("backupTime", e.target.value)} className="form-input" style={{ width: "150px" }} />
            </div>
            
            <div className="form-group">
              <label>Conservation (jours)</label>
              <input type="number" value={settings.backupRetention} onChange={(e) => handleChange("backupRetention", parseInt(e.target.value))} min="7" max="365" className="form-input" style={{ width: "100px" }} />
            </div>
          </>
        )}
      </div>

      <div className="settings-section">
        <h3>📁 Emplacement de sauvegarde</h3>
        <div className="section-desc">Choisissez où stocker les sauvegardes</div>
        
        <div className="radio-group">
          <label className="radio-option">
            <input type="radio" value="local" checked={settings.backupLocation === "local"} onChange={() => handleChange("backupLocation", "local")} />
            Stockage local
          </label>
          <label className="radio-option">
            <input type="radio" value="ftp" checked={settings.backupLocation === "ftp"} onChange={() => handleChange("backupLocation", "ftp")} />
            Serveur FTP
          </label>
          <label className="radio-option">
            <input type="radio" value="cloud" checked={settings.backupLocation === "cloud"} onChange={() => handleChange("backupLocation", "cloud")} />
            Cloud (Google Drive)
          </label>
        </div>
        
        {settings.backupLocation === "ftp" && (
          <>
            <div className="form-group">
              <label>Hôte FTP</label>
              <input type="text" value={settings.ftpHost} onChange={(e) => handleChange("ftpHost", e.target.value)} className="form-input" placeholder="ftp.exemple.com" />
            </div>
            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Utilisateur</label>
                <input type="text" value={settings.ftpUser} onChange={(e) => handleChange("ftpUser", e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" value={settings.ftpPass} onChange={(e) => handleChange("ftpPass", e.target.value)} className="form-input" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="settings-section">
        <h3>⚡ Actions manuelles</h3>
        <div className="section-desc">Sauvegarde et restauration immédiates</div>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button type="button" className="btn-secondary" onClick={handleManualBackup} disabled={isBackingUp}>
            💾 Sauvegarder maintenant
          </button>
          <button type="button" className="btn-danger" onClick={handleRestore}>
            ⚠️ Restaurer une sauvegarde
          </button>
        </div>
        
        {isBackingUp && (
          <div className="info-card">
            <div className="info-title">Progression de la sauvegarde</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${backupProgress}%` }}></div>
            </div>
            <div className="info-text">{backupProgress}% - Veuillez patienter...</div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>📋 Historique des sauvegardes</h3>
        <div className="section-desc">Dernières sauvegardes effectuées</div>
        
        <div className="backup-history">
          {backupHistory.map((backup, index) => (
            <div key={index} className="backup-item">
              <div className="backup-info">
                <span className="backup-date">📅 {backup.date}</span>
                <span className="backup-size">📦 {backup.size}</span>
              </div>
              <div className={`backup-status ${backup.status}`}>
                {backup.status === "success" ? "✅ Succès" : "❌ Échec"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-save">Enregistrer les paramètres</button>
    </form>
  );
}