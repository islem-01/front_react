import React, { useState } from "react";

export default function IntegrationTab({ onSave }) {
  const [settings, setSettings] = useState({
    googleCalendar: false,
    googleApiKey: "",
    microsoftTeams: false,
    teamsWebhook: "",
    whatsappBot: false,
    whatsappNumber: "",
    apiEnabled: true,
    apiKey: "",
    apiSecret: "",
    webhookUrl: ""
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleGenerateApiKey = () => {
    const newKey = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
    handleChange("apiKey", newKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>📅 Calendrier</h3>
        <div className="section-desc">Synchronisation avec les calendriers externes</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="googleCalendar" checked={settings.googleCalendar} onChange={(e) => handleChange("googleCalendar", e.target.checked)} />
          <label htmlFor="googleCalendar">Google Calendar</label>
        </div>
        
        {settings.googleCalendar && (
          <div className="form-group" style={{ marginLeft: "1.5rem" }}>
            <label>API Key Google</label>
            <input type="text" value={settings.googleApiKey} onChange={(e) => handleChange("googleApiKey", e.target.value)} className="form-input" placeholder="AIzaSy..." />
          </div>
        )}
        
        <div className="checkbox-group">
          <input type="checkbox" id="microsoftTeams" checked={settings.microsoftTeams} onChange={(e) => handleChange("microsoftTeams", e.target.checked)} />
          <label htmlFor="microsoftTeams">Microsoft Teams</label>
        </div>
        
        {settings.microsoftTeams && (
          <div className="form-group" style={{ marginLeft: "1.5rem" }}>
            <label>Webhook Teams</label>
            <input type="text" value={settings.teamsWebhook} onChange={(e) => handleChange("teamsWebhook", e.target.value)} className="form-input" placeholder="https://... webhook" />
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>📱 Messagerie</h3>
        <div className="section-desc">Notifications via applications de messagerie</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="whatsappBot" checked={settings.whatsappBot} onChange={(e) => handleChange("whatsappBot", e.target.checked)} />
          <label htmlFor="whatsappBot">WhatsApp Business API</label>
        </div>
        
        {settings.whatsappBot && (
          <div className="form-group" style={{ marginLeft: "1.5rem" }}>
            <label>Numéro WhatsApp</label>
            <input type="tel" value={settings.whatsappNumber} onChange={(e) => handleChange("whatsappNumber", e.target.value)} className="form-input" placeholder="+216 00 000 000" />
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>🔌 API REST</h3>
        <div className="section-desc">Configuration des accès API externes</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="apiEnabled" checked={settings.apiEnabled} onChange={(e) => handleChange("apiEnabled", e.target.checked)} />
          <label htmlFor="apiEnabled">Activer l'API REST</label>
        </div>
        
        {settings.apiEnabled && (
          <>
            <div className="form-group">
              <label>Clé API</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type={showApiKey ? "text" : "password"} value={settings.apiKey} onChange={(e) => handleChange("apiKey", e.target.value)} className="form-input" placeholder="Clé API" readOnly />
                <button type="button" className="btn-secondary" onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? "🙈" : "👁️"}</button>
                <button type="button" className="btn-secondary" onClick={handleGenerateApiKey}>Générer</button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Secret API</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type={showSecret ? "text" : "password"} value={settings.apiSecret} onChange={(e) => handleChange("apiSecret", e.target.value)} className="form-input" placeholder="Secret API" readOnly />
                <button type="button" className="btn-secondary" onClick={() => setShowSecret(!showSecret)}>{showSecret ? "🙈" : "👁️"}</button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Webhook URL</label>
              <input type="text" value={settings.webhookUrl} onChange={(e) => handleChange("webhookUrl", e.target.value)} className="form-input" placeholder="https://..." />
            </div>
            
            <div className="info-card">
              <div className="info-title">📡 Documentation API</div>
              <div className="info-text">URL de l'API : <code>https://api.smartexam.iit.tn/v1</code></div>
              <div className="info-text">Documentation Swagger : <code>https://api.smartexam.iit.tn/docs</code></div>
            </div>
          </>
        )}
      </div>

      <button type="submit" className="btn-save">Enregistrer les intégrations</button>
    </form>
  );
}