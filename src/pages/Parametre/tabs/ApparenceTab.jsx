import React, { useState } from "react";

export default function ApparenceTab({ onSave }) {
  const [settings, setSettings] = useState({
    theme: "light",
    primaryColor: "#1a3a8f",
    sidebarColor: "#1a3a8f",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    showLogo: true
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
    // Appliquer le thème
    document.body.className = `theme-${settings.theme}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>🎨 Thème</h3>
        <div className="section-desc">Personnalisez l'apparence de l'application</div>
        
        <div className="form-group">
          <label>Thème principal</label>
          <div className="theme-selector">
            <div className={`theme-option ${settings.theme === "light" ? "selected" : ""}`} onClick={() => handleChange("theme", "light")}>
              <div className="theme-preview light"></div>
              <span>Clair</span>
            </div>
            <div className={`theme-option ${settings.theme === "dark" ? "selected" : ""}`} onClick={() => handleChange("theme", "dark")}>
              <div className="theme-preview dark"></div>
              <span>Sombre</span>
            </div>
            <div className={`theme-option ${settings.theme === "blue" ? "selected" : ""}`} onClick={() => handleChange("theme", "blue")}>
              <div className="theme-preview blue"></div>
              <span>Bleu</span>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Couleur principale</label>
          <div className="color-preview">
            <input 
              type="color" 
              value={settings.primaryColor} 
              onChange={(e) => handleChange("primaryColor", e.target.value)}
              className="form-input"
              style={{ width: "80px" }}
            />
            <div className="color-value" style={{ background: settings.primaryColor }}></div>
            <span className="color-hex">{settings.primaryColor}</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Taille de police</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" value="small" checked={settings.fontSize === "small"} onChange={() => handleChange("fontSize", "small")} />
              Petite
            </label>
            <label className="radio-option">
              <input type="radio" value="medium" checked={settings.fontSize === "medium"} onChange={() => handleChange("fontSize", "medium")} />
              Moyenne
            </label>
            <label className="radio-option">
              <input type="radio" value="large" checked={settings.fontSize === "large"} onChange={() => handleChange("fontSize", "large")} />
              Grande
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>🖥️ Interface</h3>
        <div className="section-desc">Configuration de l'interface utilisateur</div>
        
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="compactMode" 
            checked={settings.compactMode} 
            onChange={(e) => handleChange("compactMode", e.target.checked)}
          />
          <label htmlFor="compactMode">Mode compact (réduit les marges et espacements)</label>
        </div>
        
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="animations" 
            checked={settings.animations} 
            onChange={(e) => handleChange("animations", e.target.checked)}
          />
          <label htmlFor="animations">Activer les animations</label>
        </div>
        
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="showLogo" 
            checked={settings.showLogo} 
            onChange={(e) => handleChange("showLogo", e.target.checked)}
          />
          <label htmlFor="showLogo">Afficher le logo dans la barre latérale</label>
        </div>
      </div>

      <button type="submit" className="btn-save">Appliquer les modifications</button>
    </form>
  );
}