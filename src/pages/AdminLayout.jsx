import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import DashboardPage from "./Dashboard/DashboardPage";
import SallesPage from "./Salles/SallesPage";
import AffectationPage from "./Affectation/AffectationPage";
import EtudiantsPage from "./Etudiants/EtudiantsPage";
import EnseignantsPage from "./Enseignants/EnseignantsPage";
import ExamensPage from "./Examens/ExamensPage";
import AlertesIAPage from "./AlertesIA/AlertesIAPage";
import AnomaliesPage from "./Anomalies/AnomaliesPage";
import RapportsPage from "./Rapports/RapportsPage";
import ParametresPage from "./Parametre/ParametresPage";
import "./AdminLayout.css";

export default function AdminLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch(activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "etudiants":
        return <EtudiantsPage />;
      case "enseignants":
        return <EnseignantsPage />;
      case "affectation":
        return <AffectationPage />;
      case "salles":
        return <SallesPage />;
      case "examens":
        return <ExamensPage />;
      case "alertes":
        return <AlertesIAPage />;
      case "anomalies":
        return <AnomaliesPage />;
      case "rapports":
        return <RapportsPage />;
      case "parametres":
        return <ParametresPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />
      <div className="admin-main">
        <TopBar activePage={activePage} user={user} />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}