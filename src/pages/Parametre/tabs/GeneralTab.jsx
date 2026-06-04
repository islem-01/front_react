import React, { useState } from "react";

export default function GeneralTab({ onSave }) {
  const [settings, setSettings] = useState({
    appName: "Smart Exam Monitoring System",
    appVersion: "2.0.0",
    institutionName: "Institut International de Technologie",
    institutionLogo: "iit_couleur.png",
    timezone: "Africa/Tunis",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "fr",
    itemsPerPage: 20,
    sessionTimeout: 30
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>🏢 Informations générales</h3>
        <div className="section-desc">Configuration de base de l'application</div>
        
        <div className="form-group">
          <label>Nom de l'application</label>
          <input 
            type="text" 
            value={settings.appName} 
            onChange={(e) => handleChange("appName", e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Nom de l'institution</label>
          <input 
            type="text" 
            value={settings.institutionName} 
            onChange={(e) => handleChange("institutionName", e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Logo de l'institution</label>
          <input 
            type="file" 
            accept="image/*"
            className="form-input"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleChange("institutionLogo", e.target.files[0].name);
              }
            }}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>🌍 Langue et région</h3>
        <div className="section-desc">Paramètres de langue et formatage</div>
        
        <div className="form-group">
          <label>Langue</label>
          <div className="language-selector">
            <div className={`lang-option ${settings.language === "fr" ? "selected" : ""}`} onClick={() => handleChange("language", "fr")}>
              <span className="lang-flag">🇫🇷</span>
              <span className="lang-name">Français</span>
            </div>
            <div className={`lang-option ${settings.language === "en" ? "selected" : ""}`} onClick={() => handleChange("language", "en")}>
              <span className="lang-flag">🇬🇧</span>
              <span className="lang-name">English</span>
            </div>
            <div className={`lang-option ${settings.language === "ar" ? "selected" : ""}`} onClick={() => handleChange("language", "ar")}>
              <span className="lang-flag">🇸🇦</span>
              <span className="lang-name">العربية</span>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Fuseau horaire</label>
          <select value={settings.timezone} onChange={(e) => handleChange("timezone", e.target.value)} className="form-select">
            <option value="Africa/Tunis">Afrique/Tunis (UTC+1)</option>
            <option value="Africa/Casablanca">Afrique/Casablanca (UTC+1)</option>
            <option value="Africa/Algiers">Afrique/Alger (UTC+1)</option>
            <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Format de date</label>
          <select value={settings.dateFormat} onChange={(e) => handleChange("dateFormat", e.target.value)} className="form-select">
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Format d'heure</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" value="24h" checked={settings.timeFormat === "24h"} onChange={() => handleChange("timeFormat", "24h")} />
              24h (14:30)
            </label>
            <label className="radio-option">
              <input type="radio" value="12h" checked={settings.timeFormat === "12h"} onChange={() => handleChange("timeFormat", "12h")} />
              12h (02:30 PM)
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>📊 Affichage</h3>
        <div className="section-desc">Configuration de l'affichage des données</div>
        
        <div className="form-group">
          <label>Éléments par page</label>
          <select value={settings.itemsPerPage} onChange={(e) => handleChange("itemsPerPage", parseInt(e.target.value))} className="form-select">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Délai d'inactivité (minutes)</label>
          <input 
            type="number" 
            value={settings.sessionTimeout} 
            onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
            min="5"
            max="120"
            className="form-input"
          />
          <small className="form-hint">Déconnexion automatique après inactivité</small>
        </div>
      </div>

      <div className="info-card">
        <div className="info-title">ℹ️ Version de l'application</div>
        <div className="info-text">Version {settings.appVersion} - Dernière mise à jour : Mars 2026</div>
      </div>

      <button type="submit" className="btn-save">Enregistrer les modifications</button>
    </form>
  );
}