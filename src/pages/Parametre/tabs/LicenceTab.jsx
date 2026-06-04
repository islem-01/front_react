import React, { useState } from "react";

export default function LicenceTab({ onSave }) {
  const [license, setLicense] = useState({
    licenseKey: "SMART-EXAM-2026-ABCD-EFGH",
    licenseType: "enterprise",
    expirationDate: "2027-03-31",
    seats: 50,
    supportUntil: "2027-03-31",
    registeredTo: "Institut International de Technologie"
  });

  const [newLicenseKey, setNewLicenseKey] = useState("");

  const handleActivateLicense = () => {
    if (newLicenseKey) {
      alert(`Licence ${newLicenseKey} activée avec succès !`);
      setLicense({ ...license, licenseKey: newLicenseKey });
      setNewLicenseKey("");
    } else {
      alert("Veuillez saisir une clé de licence valide");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const expiry = new Date(license.expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h3>📜 Informations de licence</h3>
        <div className="section-desc">Statut et activation de votre licence</div>
        
        <div className="info-card">
          <div className="info-title">Statut de la licence</div>
          <div className="info-text">
            <strong>Type de licence :</strong> {license.licenseType === "enterprise" ? "Entreprise" : license.licenseType}<br />
            <strong>Enregistré à :</strong> {license.registeredTo}<br />
            <strong>Nombre de sièges :</strong> {license.seats} utilisateurs<br />
            <strong>Date d'expiration :</strong> {license.expirationDate}<br />
            <strong>Jours restants :</strong> <span className={daysRemaining < 30 ? "warning" : ""}>{daysRemaining} jours</span>
          </div>
        </div>
        
        {daysRemaining < 30 && daysRemaining > 0 && (
          <div className="warning-card">
            <div className="warning-title">⚠️ Licence bientôt expirée</div>
            <div className="info-text">Votre licence expirera dans {daysRemaining} jours. Veuillez la renouveler.</div>
          </div>
        )}
        
        {daysRemaining <= 0 && (
          <div className="warning-card" style={{ background: "#fee2e2", borderColor: "#fecaca" }}>
            <div className="warning-title" style={{ color: "#dc2626" }}>❌ Licence expirée</div>
            <div className="info-text">Votre licence a expiré. Certaines fonctionnalités peuvent être limitées.</div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>🔑 Activation</h3>
        <div className="section-desc">Activez ou renouvelez votre licence</div>
        
        <div className="form-group">
          <label>Clé de licence actuelle</label>
          <input type="text" value={license.licenseKey} className="form-input" disabled style={{ background: "#f3f4f6", fontFamily: "monospace" }} />
        </div>
        
        <div className="form-group">
          <label>Nouvelle clé de licence</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" value={newLicenseKey} onChange={(e) => setNewLicenseKey(e.target.value)} className="form-input" placeholder="XXXX-XXXX-XXXX-XXXX" style={{ fontFamily: "monospace" }} />
            <button type="button" className="btn-secondary" onClick={handleActivateLicense}>Activer</button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>🛠️ Support</h3>
        <div className="section-desc">Assistance et maintenance</div>
        
        <div className="info-card">
          <div className="info-title">📞 Contact support</div>
          <div className="info-text">
            <strong>Email :</strong> support@smartexam.iit.tn<br />
            <strong>Téléphone :</strong> +216 70 000 000<br />
            <strong>Horaires :</strong> Lundi - Vendredi, 08:00 - 17:00<br />
            <strong>Support jusqu'au :</strong> {license.supportUntil}
          </div>
        </div>
        
        <div className="info-card">
          <div className="info-title">📚 Documentation</div>
          <div className="info-text">
            <a href="#" style={{ color: "#1a3a8f" }}>📖 Guide d'utilisation</a><br />
            <a href="#" style={{ color: "#1a3a8f" }}>🔧 Guide d'administration</a><br />
            <a href="#" style={{ color: "#1a3a8f" }}>📘 API Documentation</a>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>📊 Utilisation</h3>
        <div className="section-desc">Statistiques d'utilisation du système</div>
        
        <div className="info-card">
          <div className="info-title">Statistiques</div>
          <div className="info-text">
            <strong>Utilisateurs actifs :</strong> 12 / {license.seats}<br />
            <strong>Examens créés :</strong> 156<br />
            <strong>Étudiants enregistrés :</strong> 1248<br />
            <strong>Stockage utilisé :</strong> 2.4 Go / 10 Go
          </div>
        </div>
      </div>

      <button type="submit" className="btn-save">Enregistrer</button>
    </form>
  );
}