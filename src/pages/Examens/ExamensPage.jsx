import React, { useState, useEffect } from "react";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import ExamDetailsModal from "./ExamDetailsModal";
import "./ExamensPage.css";

// Données mockées des examens
const generateMockExams = () => {
  const matieres = [
    "Architecture des Ordinateurs", "Algorithmique Avancée", "Bases de Données", 
    "Réseaux et Télécommunications", "Intelligence Artificielle", "Génie Logiciel",
    "Cryptographie", "Développement Web", "Systèmes d'Exploitation", "Programmation Mobile",
    "Mathématiques Appliquées", "Physique Quantique", "Analyse Numérique", "Statistiques"
  ];
  
  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C", "Labo Info"];
  const professeurs = [
    "Dr. Karim Benali", "Pr. Salima Mansouri", "Dr. Amine Touati", 
    "Pr. Nadia Khelil", "Dr. Sofiene Marzouk", "Pr. Hichem Jaouadi"
  ];
  const niveaux = [
    "1ère Licence", "2ème Licence", "3ème Licence", 
    "1ère Master", "2ème Master", "1ère Ingénieur", "2ème Ingénieur", "3ème Ingénieur"
  ];
  const statuts = ["Planifié", "En cours", "Terminé", "Annulé", "Reporté"];
  
  const exams = [];
  const today = new Date();
  
  for (let i = 1; i <= 24; i++) {
    const examDate = new Date(today);
    examDate.setDate(today.getDate() + (i - 12));
    
    const startHour = 8 + Math.floor(Math.random() * 8);
    const duration = [2, 3, 4][Math.floor(Math.random() * 3)];
    
    exams.push({
      id: `EX${String(i).padStart(4, '0')}`,
      matiere: matieres[i % matieres.length],
      code: `INF${Math.floor(Math.random() * 900 + 100)}`,
      niveau: niveaux[Math.floor(Math.random() * niveaux.length)],
      filiere: ["Informatique", "Réseaux", "Mathématiques", "IA"][Math.floor(Math.random() * 4)],
      groupe: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      professeur: professeurs[i % professeurs.length],
      coProfesseur: i % 3 === 0 ? professeurs[(i + 1) % professeurs.length] : null,
      salle: salles[Math.floor(Math.random() * salles.length)],
      date: examDate.toISOString().split('T')[0],
      heureDebut: `${String(startHour).padStart(2, '0')}:00`,
      heureFin: `${String(startHour + duration).padStart(2, '0')}:00`,
      duree: duration,
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      nbrEtudiants: Math.floor(Math.random() * 100 + 20),
      nbrPresent: 0,
      nbrAbsent: 0,
      observations: "",
      createdAt: new Date().toISOString()
    });
  }
  
  // Calculer les présences/absences
  exams.forEach(exam => {
    exam.nbrPresent = Math.floor(Math.random() * exam.nbrEtudiants);
    exam.nbrAbsent = exam.nbrEtudiants - exam.nbrPresent;
  });
  
  return exams;
};

export default function ExamensPage() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, calendar
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setExams(generateMockExams());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchTerm, selectedNiveau, selectedFiliere, selectedStatut, selectedDate]);

  const filterExams = () => {
    let filtered = [...exams];
    
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.professeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.salle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedNiveau) {
      filtered = filtered.filter(e => e.niveau === selectedNiveau);
    }
    
    if (selectedFiliere) {
      filtered = filtered.filter(e => e.filiere === selectedFiliere);
    }
    
    if (selectedStatut) {
      filtered = filtered.filter(e => e.statut === selectedStatut);
    }
    
    if (selectedDate) {
      filtered = filtered.filter(e => e.date === selectedDate);
    }
    
    setFilteredExams(filtered);
  };

  const handleAddExam = (newExam) => {
    const examWithId = {
      ...newExam,
      id: `EX${String(exams.length + 1).padStart(4, '0')}`,
      nbrPresent: 0,
      nbrAbsent: 0,
      createdAt: new Date().toISOString(),
      statut: "Planifié"
    };
    setExams([examWithId, ...exams]);
    setShowAddModal(false);
  };

  const handleEditExam = (updatedExam) => {
    setExams(exams.map(e => e.id === updatedExam.id ? updatedExam : e));
    setShowEditModal(false);
  };

  const handleDeleteExam = (exam) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'examen ${exam.matiere} ?`)) {
      setExams(exams.filter(e => e.id !== exam.id));
      setShowDetailsModal(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedExams.length === 0) return;
    if (window.confirm(`Voulez-vous vraiment supprimer ${selectedExams.length} examen(s) ?`)) {
      setExams(exams.filter(e => !selectedExams.includes(e.id)));
      setSelectedExams([]);
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedExams([]);
    } else {
      setSelectedExams(filteredExams.map(e => e.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectExam = (examId) => {
    if (selectedExams.includes(examId)) {
      setSelectedExams(selectedExams.filter(id => id !== examId));
    } else {
      setSelectedExams([...selectedExams, examId]);
    }
  };

  const niveauxUniques = [...new Set(exams.map(e => e.niveau))];
  const filieresUniques = [...new Set(exams.map(e => e.filiere))];
  const statutsUniques = ["Planifié", "En cours", "Terminé", "Annulé", "Reporté"];

  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Planifié": return <span className="statut-badge planifie">📅 Planifié</span>;
      case "En cours": return <span className="statut-badge encours">▶ En cours</span>;
      case "Terminé": return <span className="statut-badge termine">✅ Terminé</span>;
      case "Annulé": return <span className="statut-badge annule">❌ Annulé</span>;
      case "Reporté": return <span className="statut-badge reporte">⏰ Reporté</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getDateClass = (date) => {
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return "date-today";
    if (date < today) return "date-past";
    return "date-future";
  };

  const getPresenceRate = (exam) => {
    if (exam.nbrEtudiants === 0) return 0;
    return Math.round((exam.nbrPresent / exam.nbrEtudiants) * 100);
  };

  if (loading) {
    return (
      <div className="examens-page loading">
        <div className="spinner"></div>
        <p>Chargement des examens...</p>
      </div>
    );
  }

  // Calendar view
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i).toISOString().split('T')[0]);
    }
    return days;
  };

  const getExamsForDate = (date) => {
    return filteredExams.filter(e => e.date === date);
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  return (
    <div className="examens-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📝 Gestion des examens</h1>
          <p className="page-subtitle">Planification et suivi des examens</p>
        </div>
        <div className="header-actions">
          <button className="btn-import">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Importer
          </button>
          <button className="btn-export">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Exporter
          </button>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Planifier
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{exams.length}</div>
            <div className="stat-label">Total examens</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{exams.filter(e => e.statut === "Planifié").length}</div>
            <div className="stat-label">Planifiés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">▶</div>
          <div className="stat-info">
            <div className="stat-value">{exams.filter(e => e.statut === "En cours").length}</div>
            <div className="stat-label">En cours</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{exams.filter(e => e.statut === "Terminé").length}</div>
            <div className="stat-label">Terminés</div>
          </div>
        </div>
      </div>

      <div className="view-tabs">
        <button className={`view-tab ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Grille
        </button>
        <button className={`view-tab ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Liste
        </button>
        <button className={`view-tab ${viewMode === "calendar" ? "active" : ""}`} onClick={() => setViewMode("calendar")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Calendrier
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher par matière, code, professeur ou salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
          <option value="">Tous les niveaux</option>
          {niveauxUniques.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className="filter-select" value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          {filieresUniques.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="filter-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statutsUniques.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="filter-date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} placeholder="Date" />
        {selectedExams.length > 0 && (
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            🗑️ Supprimer ({selectedExams.length})
          </button>
        )}
      </div>

      {viewMode === "grid" && (
        <div className="examens-grid">
          {filteredExams.map(exam => (
            <div key={exam.id} className={`exam-card ${selectedExams.includes(exam.id) ? 'selected' : ''}`}>
              <div className="exam-card-header">
                <div className="exam-info">
                  <h3 className="exam-title">{exam.matiere}</h3>
                  <p className="exam-code">{exam.code}</p>
                </div>
                <input
                  type="checkbox"
                  className="exam-select"
                  checked={selectedExams.includes(exam.id)}
                  onChange={() => handleSelectExam(exam.id)}
                />
              </div>
              <div className="exam-details">
                <div className="detail-row">
                  <span className="detail-label">📚 Niveau:</span>
                  <span>{exam.niveau} - {exam.filiere}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👨‍🏫 Professeur:</span>
                  <span>{exam.professeur}</span>
                </div>
                {exam.coProfesseur && (
                  <div className="detail-row">
                    <span className="detail-label">👥 Co-professeur:</span>
                    <span>{exam.coProfesseur}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">🏛️ Salle:</span>
                  <span>{exam.salle}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span className={getDateClass(exam.date)}>{exam.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Horaire:</span>
                  <span>{exam.heureDebut} - {exam.heureFin} ({exam.duree}h)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👥 Étudiants:</span>
                  <span>{exam.nbrEtudiants}</span>
                </div>
                {exam.statut === "Terminé" && (
                  <div className="presence-bar">
                    <div className="presence-label">Présence: {getPresenceRate(exam)}%</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${getPresenceRate(exam)}%` }}></div>
                    </div>
                    <div className="presence-stats">
                      <span className="present">✅ {exam.nbrPresent} présents</span>
                      <span className="absent">❌ {exam.nbrAbsent} absents</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="exam-footer">
                {getStatutBadge(exam.statut)}
                <div className="exam-actions">
                  <button className="action-btn view" onClick={() => { setSelectedExam(exam); setShowDetailsModal(true); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    </svg>
                  </button>
                  <button className="action-btn edit" onClick={() => { setSelectedExam(exam); setShowEditModal(true); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-6.17 6.17a2 2 0 01-1.42.59H5a2 2 0 01-2-2v-8a2 2 0 01.59-1.42l6.17-6.17a2 2 0 012.83 0l7.24 7.24a2 2 0 010 2.83z"/>
                      <line x1="16.5" y1="9.5" x2="7.5" y2="18.5"/>
                    </svg>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteExam(exam)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="examens-table-container">
          <table className="examens-table">
            <thead>
              <tr>
                <th className="checkbox-col"><input type="checkbox" checked={selectAll && filteredExams.length > 0} onChange={handleSelectAll} /></th>
                <th>Code</th>
                <th>Matière</th>
                <th>Niveau</th>
                <th>Professeur</th>
                <th>Salle</th>
                <th>Date</th>
                <th>Horaire</th>
                <th>Étudiants</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr key={exam.id} className={selectedExams.includes(exam.id) ? 'selected' : ''}>
                  <td className="checkbox-col"><input type="checkbox" checked={selectedExams.includes(exam.id)} onChange={() => handleSelectExam(exam.id)} /></td>
                  <td className="code-cell">{exam.code}</td>
                  <td className="title-cell">{exam.matiere}</td>
                  <td>{exam.niveau}<br/><small>{exam.filiere}</small></td>
                  <td>{exam.professeur}</td>
                  <td>{exam.salle}</td>
                  <td className={getDateClass(exam.date)}>{exam.date}</td>
                  <td>{exam.heureDebut}<br/><small>{exam.duree}h</small></td>
                  <td>{exam.nbrEtudiants}</td>
                  <td>{getStatutBadge(exam.statut)}</td>
                  <td className="actions-cell">
                    <button className="action-btn view" onClick={() => { setSelectedExam(exam); setShowDetailsModal(true); }}>👁️</button>
                    <button className="action-btn edit" onClick={() => { setSelectedExam(exam); setShowEditModal(true); }}>✏️</button>
                    <button className="action-btn delete" onClick={() => handleDeleteExam(exam)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="calendar-view">
          <div className="calendar-header">
            <button className="calendar-nav" onClick={() => changeMonth(-1)}>←</button>
            <h3>{currentDate.toLocaleString('fr', { month: 'long', year: 'numeric' })}</h3>
            <button className="calendar-nav" onClick={() => changeMonth(1)}>→</button>
          </div>
          <div className="calendar-weekdays">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {getDaysInMonth(currentDate).map(date => {
              const examsOfDay = getExamsForDate(date);
              return (
                <div key={date} className={`calendar-day ${examsOfDay.length > 0 ? 'has-exams' : ''}`}>
                  <div className="day-number">{parseInt(date.split('-')[2])}</div>
                  {examsOfDay.slice(0, 3).map(exam => (
                    <div key={exam.id} className="calendar-exam" onClick={() => { setSelectedExam(exam); setShowDetailsModal(true); }}>
                      <span className="exam-time">{exam.heureDebut}</span>
                      <span className="exam-name">{exam.matiere.substring(0, 15)}</span>
                    </div>
                  ))}
                  {examsOfDay.length > 3 && (
                    <div className="calendar-more">+{examsOfDay.length - 3} autres</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddExamModal
          onAdd={handleAddExam}
          onClose={() => setShowAddModal(false)}
          niveaux={niveauxUniques}
          filieres={filieresUniques}
        />
      )}

      {showEditModal && selectedExam && (
        <EditExamModal
          exam={selectedExam}
          onSave={handleEditExam}
          onClose={() => setShowEditModal(false)}
          niveaux={niveauxUniques}
          filieres={filieresUniques}
        />
      )}

      {showDetailsModal && selectedExam && (
        <ExamDetailsModal
          exam={selectedExam}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onDelete={() => handleDeleteExam(selectedExam)}
        />
      )}
    </div>
  );
}