import React, { useState } from 'react';
import TeacherDashboard from './TeacherDashboard';
import TeacherCalendar from './TeacherCalendar';
import TeacherExams from './TeacherExams';
import TeacherSupervisions from './Teachersurveillances';
import TeacherLive from './TeacherLive';
import TeacherPlacement from './TeacherPlacement';
import TeacherAlerts from './TeacherAlerts';
import TeacherReports from './TeacherReports';
import TeacherNotifications from './TeacherNotifications';
import TeacherProfile from './TeacherProfile';
import './TeacherLayout.css';

import iitLogo from '../../assets/iit_blanc.png';
import campusImg from '../../assets/schoolIIT.png';

export default function TeacherLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt' },
    { id: 'calendar', label: 'Calendrier & Demandes', icon: 'fas fa-calendar-alt' },
    { id: 'exams', label: 'Mes examens', icon: 'fas fa-file-alt' },
    { id: 'supervisions', label: 'Mes surveillances', icon: 'fas fa-shield-alt' },
    { id: 'live', label: 'Surveillance en direct', icon: 'fas fa-video' },
    { id: 'placement', label: 'Placement & Présence', icon: 'fas fa-map-marker-alt' },
    { id: 'alerts', label: 'Alertes IA', icon: 'fas fa-bell' },
    { id: 'reports', label: 'Rapports', icon: 'fas fa-chart-line' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'profile', label: 'Mon profil', icon: 'fas fa-user-circle' },
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <TeacherDashboard user={user} />;
      case 'calendar': return <TeacherCalendar user={user} />;
      case 'exams': return <TeacherExams user={user} />;
      case 'supervisions': return <TeacherSupervisions user={user} />;
      case 'live': return <TeacherLive user={user} />;
      case 'placement': return <TeacherPlacement user={user} />;
      case 'alerts': return <TeacherAlerts user={user} />;
      case 'reports': return <TeacherReports user={user} />;
      case 'notifications': return <TeacherNotifications user={user} />;
      case 'profile': return <TeacherProfile user={user} onLogout={onLogout} />;
      default: return <TeacherDashboard user={user} />;
    }
  };

  return (
    <div className="teacher-layout">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={iitLogo} alt="IIT" className="sidebar-brand-logo" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">IIT</span>
            <span className="sidebar-brand-sub">INSTITUT TECHNIQUE</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-institute">
          <div className="sidebar-institute-content">
            <div className="institute-icon">
              <i className="fas fa-university"></i>
            </div>
            <div className="institute-info">
              <span className="institute-name">SMART EXAM</span>
              <span className="institute-full">MONITORING SYSTEM</span>
            </div>
          </div>
          <img src={campusImg} alt="Campus IIT" className="sidebar-campus-img" />
        </div>

        <div className="sidebar-logout">
          <button className="logout-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="teacher-main">
        <div className="main-header">
          <div className="header-title">
            <h1>{menuItems.find(m => m.id === activePage)?.label}</h1>
            <p>Espace Enseignant · {user?.name || 'Dr. Amine Ben Ali'}</p>
          </div>
          <div className="header-date">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
            <i className="fas fa-clock"></i>
            <span>{new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>

        <div className="main-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}