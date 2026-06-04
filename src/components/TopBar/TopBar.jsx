import React from "react";
import "./TopBar.css";

const pageTitles = {
  dashboard: { title: "Dashboard", breadcrumb: "Accueil / Dashboard" },
  etudiants: { title: "Gestion des étudiants", breadcrumb: "Accueil / Étudiants" },
  enseignants: { title: "Gestion des enseignants", breadcrumb: "Accueil / Enseignants" },
  affectation: { title: "Affectation des places", breadcrumb: "Accueil / Affectation" },
  salles: { title: "Gestion des salles", breadcrumb: "Accueil / Salles" },
  examens: { title: "Examens", breadcrumb: "Accueil / Examens" },
  alertes: { title: "Alertes IA", breadcrumb: "Accueil / Alertes" },
  anomalies: { title: "Anomalies", breadcrumb: "Accueil / Anomalies" },
  rapports: { title: "Rapports & Statistiques", breadcrumb: "Accueil / Rapports" },
  parametres: { title: "Paramètres", breadcrumb: "Accueil / Paramètres" },
};

export default function TopBar({ activePage, user }) {
  const { title, breadcrumb } = pageTitles[activePage] || pageTitles.dashboard;
  
  const getInitials = () => {
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "AD";
  };
  
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return "Administrateur";
  };
  
  const getRoleName = () => {
    if (user?.role === "administrateur") return "Administrateur";
    if (user?.role === "enseignant") return "Enseignant";
    return user?.role || "Admin";
  };

  const initials = getInitials();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{title}</span>
        <span className="topbar-breadcrumb">{breadcrumb}</span>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Rechercher..." />
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="notif-badge">3</span>
        </button>

        {/* Settings */}
        <button className="topbar-icon-btn" title="Paramètres rapides">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>

        {/* User */}
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{getDisplayName()}</span>
            <span className="topbar-user-role">{getRoleName()}</span>
          </div>
          <span className="topbar-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
}