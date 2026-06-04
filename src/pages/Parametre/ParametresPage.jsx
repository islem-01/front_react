import React, { useState } from "react";
import GeneralTab from "./tabs/GeneralTab";
import ApparenceTab from "./tabs/ApparenceTab";
import SecuriteTab from "./tabs/SecuriteTab";
import NotificationsTab from "./tabs/NotificationsTab";
import IntegrationTab from "./tabs/IntegrationTab";
import SauvegardeTab from "./tabs/SauvegardeTab";
import LicenceTab from "./tabs/LicenceTab";
import "./ParametresPage.css";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { id: "general", label: "⚙️ Général", icon: "⚙️" },
    { id: "apparence", label: "🎨 Apparence", icon: "🎨" },
    { id: "securite", label: "🔒 Sécurité", icon: "🔒" },
    { id: "notifications", label: "🔔 Notifications", icon: "🔔" },
    { id: "integration", label: "🔌 Intégrations", icon: "🔌" },
    { id: "sauvegarde", label: "💾 Sauvegarde", icon: "💾" },
    { id: "licence", label: "📜 Licence", icon: "📜" }
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case "general":
        return <GeneralTab onSave={handleSave} />;
      case "apparence":
        return <ApparenceTab onSave={handleSave} />;
      case "securite":
        return <SecuriteTab onSave={handleSave} />;
      case "notifications":
        return <NotificationsTab onSave={handleSave} />;
      case "integration":
        return <IntegrationTab onSave={handleSave} />;
      case "sauvegarde":
        return <SauvegardeTab onSave={handleSave} />;
      case "licence":
        return <LicenceTab onSave={handleSave} />;
      default:
        return <GeneralTab onSave={handleSave} />;
    }
  };

  return (
    <div className="parametres-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Paramètres système</h1>
          <p className="page-subtitle">Configuration et personnalisation de l'application</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="toast-success">
          ✅ Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}