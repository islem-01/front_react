import React, { useState } from "react";

export default function NotificationsTab({ onSave }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    examReminder: true,
    examReminderTime: 60,
    anomalyAlert: true,
    systemUpdate: true,
    reportGeneration: false,
    adminEmail: "admin@iit.tn",
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: ""
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleTestEmail = () => {
    alert(`Email de test envoyé à ${settings.adminEmail}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>🔔 Canaux de notification</h3>
        <div className="section-desc">Choisissez comment recevoir les alertes</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="emailNotifications" checked={settings.emailNotifications} onChange={(e) => handleChange("emailNotifications", e.target.checked)} />
          <label htmlFor="emailNotifications">Notifications par email</label>
        </div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="pushNotifications" checked={settings.pushNotifications} onChange={(e) => handleChange("pushNotifications", e.target.checked)} />
          <label htmlFor="pushNotifications">Notifications push (navigateur)</label>
        </div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="smsAlerts" checked={settings.smsAlerts} onChange={(e) => handleChange("smsAlerts", e.target.checked)} />
          <label htmlFor="smsAlerts">Alertes SMS</label>
        </div>
      </div>

      <div className="settings-section">
        <h3>📧 Configuration email</h3>
        <div className="section-desc">Paramètres du serveur SMTP</div>
        
        <div className="form-group">
          <label>Email administrateur</label>
          <input type="email" value={settings.adminEmail} onChange={(e) => handleChange("adminEmail", e.target.value)} className="form-input" />
        </div>
        
        <div className="form-group">
          <label>Serveur SMTP</label>
          <input type="text" value={settings.smtpServer} onChange={(e) => handleChange("smtpServer", e.target.value)} className="form-input" />
        </div>
        
        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>Port SMTP</label>
            <input type="text" value={settings.smtpPort} onChange={(e) => handleChange("smtpPort", e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label>SSL/TLS</label>
            <select className="form-select" defaultValue="tls">
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">Aucun</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Nom d'utilisateur SMTP</label>
          <input type="text" value={settings.smtpUser} onChange={(e) => handleChange("smtpUser", e.target.value)} className="form-input" />
        </div>
        
        <div className="form-group">
          <label>Mot de passe SMTP</label>
          <input type="password" value={settings.smtpPass} onChange={(e) => handleChange("smtpPass", e.target.value)} className="form-input" />
        </div>
        
        <button type="button" className="btn-secondary" onClick={handleTestEmail}>📧 Tester l'envoi d'email</button>
      </div>

      <div className="settings-section">
        <h3>⚡ Types d'alertes</h3>
        <div className="section-desc">Choisissez les événements à surveiller</div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="examReminder" checked={settings.examReminder} onChange={(e) => handleChange("examReminder", e.target.checked)} />
          <label htmlFor="examReminder">Rappels d'examen</label>
        </div>
        
        {settings.examReminder && (
          <div className="form-group" style={{ marginLeft: "1.5rem" }}>
            <label>Rappeler avant (minutes)</label>
            <select value={settings.examReminderTime} onChange={(e) => handleChange("examReminderTime", parseInt(e.target.value))} className="form-select" style={{ width: "150px" }}>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
            </select>
          </div>
        )}
        
        <div className="checkbox-group">
          <input type="checkbox" id="anomalyAlert" checked={settings.anomalyAlert} onChange={(e) => handleChange("anomalyAlert", e.target.checked)} />
          <label htmlFor="anomalyAlert">Alertes d'anomalie IA</label>
        </div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="systemUpdate" checked={settings.systemUpdate} onChange={(e) => handleChange("systemUpdate", e.target.checked)} />
          <label htmlFor="systemUpdate">Mises à jour système</label>
        </div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="reportGeneration" checked={settings.reportGeneration} onChange={(e) => handleChange("reportGeneration", e.target.checked)} />
          <label htmlFor="reportGeneration">Génération de rapports</label>
        </div>
      </div>

      <button type="submit" className="btn-save">Enregistrer les préférences</button>
    </form>
  );
}