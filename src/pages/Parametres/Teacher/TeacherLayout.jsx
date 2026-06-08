import React, { useState } from 'react';
import TeacherDashboard from './TeacherDashboard';
import TeacherExams from './TeacherExams';
import TeacherLive from './TeacherLive';
import TeacherAlerts from './TeacherAlerts';
import TeacherReports from './TeacherReports';
import TeacherProfile from './TeacherProfile';
import TeacherPlanning from './TeacherPlanning';
import TeacherPlacement from './TeacherPlacement';
import './TeacherLayout.css';

export default function TeacherLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt' },
    { id: 'exams', label: 'Mes examens', icon: 'fas fa-calendar-alt' },
    { id: 'planning', label: 'Proposer une date', icon: 'fas fa-calendar-plus' },
    { id: 'live', label: 'Surveillance en direct', icon: 'fas fa-video' },
    { id: 'placement', label: 'Plan de placement', icon: 'fas fa-chair' },
    { id: 'alerts', label: 'Alertes IA', icon: 'fas fa-bell' },
    { id: 'reports', label: 'Rapports', icon: 'fas fa-file-alt' },
    { id: 'profile', label: 'Mon profil', icon: 'fas fa-user-circle' },
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <TeacherDashboard user={user} />;
      case 'exams': return <TeacherExams user={user} />;
      case 'planning': return <TeacherPlanning user={user} />;
      case 'live': return <TeacherLive user={user} />;
      case 'placement': return <TeacherPlacement user={user} />;
      case 'alerts': return <TeacherAlerts user={user} />;
      case 'reports': return <TeacherReports user={user} />;
      case 'profile': return <TeacherProfile user={user} onLogout={onLogout} />;
      default: return <TeacherDashboard user={user} />;
    }
  };

  return (
    <div className="teacher-layout">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Sidebar */}
      <aside className="teacher-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-chalkboard-user"></i>
            <span>Espace Enseignant</span>
          </div>
          <div className="teacher-info">
            <div className="teacher-avatar">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="teacher-name">{user?.name || "Enseignant"}</div>
            <div className="teacher-role">Surveillant d'examen</div>
            <div className="teacher-email">{user?.email}</div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="teacher-main">
        <div className="teacher-header">
          <div className="header-title">
            <h1>{menuItems.find(m => m.id === activePage)?.label}</h1>
            <p className="header-subtitle">
              {user?.name} · {user?.email}
            </p>
          </div>
          <div className="header-date">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
            <i className="fas fa-clock"></i>
            <span>{new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
        
        <div className="teacher-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}