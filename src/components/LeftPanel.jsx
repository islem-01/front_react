import React from "react";
import iitLogo from "../assets/iit_blanc.png";
import "./LeftPanel.css";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M20.188 10.934c.388.472.605 1.02.605 1.566s-.217 1.094-.605 1.566C18.768 15.768 15.636 18 12 18s-6.768-2.232-8.188-3.934A2.51 2.51 0 013.207 12c0-.546.217-1.094.605-1.566C5.232 8.232 8.364 6 12 6s6.768 2.232 8.188 3.934z"/>
      </svg>
    ),
    title: "Surveillance IA en temps réel",
    desc: "Détection automatique des comportements suspects pendant les examens.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: "Gestion dynamique des salles",
    desc: "Créez, organisez et modifiez vos salles intelligemment.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Suivi et rapports détaillés",
    desc: "Statistiques, historiques et alertes pour un meilleur contrôle.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Sécurisé et fiable",
    desc: "Vos données sont protégées avec des standards de sécurité élevés.",
  },
];

export default function LeftPanel() {
  return (
    <aside className="left-panel">
      <div className="left-panel-inner">
        {/* Logo */}
        <div className="left-logo-wrapper">
          <img src={iitLogo} alt="IIT Logo" className="left-logo" />
        </div>

        {/* Title */}
        <h1 className="left-title">
          Smart Exam<br />Monitoring System
        </h1>
        <div className="left-divider" />
        <p className="left-subtitle">
          Surveillance intelligente des examens et gestion des salles
        </p>

        {/* Features */}
        <ul className="left-features">
          {features.map((f, i) => (
            <li key={i} className="left-feature-item">
              <span className="left-feature-icon">{f.icon}</span>
              <div className="left-feature-text">
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <footer className="left-footer">
          © 2026 Université – Tous droits réservés
        </footer>
      </div>
    </aside>
  );
}
