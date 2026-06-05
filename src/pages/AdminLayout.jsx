import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import TopBar from '../components/TopBar/TopBar';
import DashboardPage from './Dashboard/DashboardPage';
import EtudiantsPage from './Etudiants/EtudiantsPage';
import EnseignantsPage from './Enseignants/EnseignantsPage';
import ExamensPage from './Examens/ExamensPage';
import AlertesIAPage from './AlertesIA/AlertesIAPage';
import RapportsPage from './Rapports/RapportsPage';
import SallesPage from './Salles/SallesPage';
import ParametresPage from './Parametres/ParametresPage';
import './AdminLayout.css';

export default function AdminLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'etudiants': return <EtudiantsPage />;
      case 'enseignants': return <EnseignantsPage />;
      case 'examens': return <ExamensPage />;
      case 'salles': return <SallesPage />;
      case 'alertes': return <AlertesIAPage />;
      case 'rapports': return <RapportsPage />;
      case 'parametres': return <ParametresPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={onLogout} />
      <div className="admin-main">
        <TopBar activePage={activePage} user={user} />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}