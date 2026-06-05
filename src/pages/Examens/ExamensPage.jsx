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
  
  for (let i = 1; i <= 48; i++) {
    const examDate = new Date(today);
    examDate.setDate(today.getDate() + (i - 24));
    
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
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setExams(generateMockExams());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...exams];
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.professeur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedNiveau) filtered = filtered.filter(e => e.niveau === selectedNiveau);
    if (selectedFiliere) filtered = filtered.filter(e => e.filiere === selectedFiliere);
    if (selectedStatut) filtered = filtered.filter(e => e.statut === selectedStatut);
    
    setFilteredExams(filtered);
    setCurrentPage(1);
  }, [exams, searchTerm, selectedNiveau, selectedFiliere, selectedStatut]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const niveauxUniques = [...new Set(exams.map(e => e.niveau))];
  const filieresUniques = [...new Set(exams.map(e => e.filiere))];
  const statutsUniques = ["Planifié", "En cours", "Terminé", "Annulé", "Reporté"];

  const getStatutConfig = (statut) => {
    const configs = {
      "Planifié": { icon: "fa-calendar-week", color: "#3b82f6", bg: "#eff6ff" },
      "En cours": { icon: "fa-play", color: "#f59e0b", bg: "#fffbeb" },
      "Terminé": { icon: "fa-check", color: "#10b981", bg: "#ecfdf5" },
      "Annulé": { icon: "fa-ban", color: "#ef4444", bg: "#fef2f2" },
      "Reporté": { icon: "fa-clock", color: "#6b7280", bg: "#f3f4f6" }
    };
    return configs[statut] || { icon: "fa-tag", color: "#6b7280", bg: "#f3f4f6" };
  };

  // Handlers
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
    if (window.confirm(`Supprimer "${exam.matiere}" ?`)) {
      setExams(exams.filter(e => e.id !== exam.id));
      setShowDetailsModal(false);
    }
  };

  if (loading) {
    return (
      <div className="examens-page loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="examens-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header-minimal">
        <div className="header-left">
         
         
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Planifier
        </button>
      </div>

 

      {/* Filtres */}
      <div className="filters-integrated">
        <div className="search-field">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Rechercher une matière, un code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          <select value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
            <option value="">Niveaux</option>
            {niveauxUniques.map(n => <option key={n}>{n}</option>)}
          </select>
          <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
            <option value="">Filières</option>
            {filieresUniques.map(f => <option key={f}>{f}</option>)}
          </select>
          <select value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            <option value="">Statuts</option>
            {statutsUniques.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grille d'examens */}
      <div className="exams-grid">
        {currentExams.map(exam => {
          const statutConfig = getStatutConfig(exam.statut);
          return (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <div className="exam-code">{exam.code}</div>
                <span className="exam-status" style={{ background: statutConfig.bg, color: statutConfig.color }}>
                  <i className={`fas ${statutConfig.icon}`}></i> {exam.statut}
                </span>
              </div>
              <h3 className="exam-title">{exam.matiere}</h3>
              <div className="exam-details-grid">
                <div className="exam-detail">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{exam.niveau}</span>
                </div>
                <div className="exam-detail">
                  <i className="fas fa-chalkboard-user"></i>
                  <span>{exam.professeur.split(' ')[1] || exam.professeur}</span>
                </div>
                <div className="exam-detail">
                  <i className="fas fa-door-open"></i>
                  <span>{exam.salle}</span>
                </div>
                <div className="exam-detail">
                  <i className="fas fa-calendar-day"></i>
                  <span>{exam.date}</span>
                </div>
                <div className="exam-detail">
                  <i className="fas fa-clock"></i>
                  <span>{exam.heureDebut} - {exam.heureFin}</span>
                </div>
                <div className="exam-detail">
                  <i className="fas fa-users"></i>
                  <span>{exam.nbrEtudiants} étudiants</span>
                </div>
              </div>
              <div className="exam-card-footer">
                {exam.statut === "Terminé" && (
                  <div className="presence-mini">
                    <div className="presence-bar">
                      <div className="presence-fill" style={{ width: `${(exam.nbrPresent / exam.nbrEtudiants) * 100}%` }}></div>
                    </div>
                    <span>{exam.nbrPresent}/{exam.nbrEtudiants} présents</span>
                  </div>
                )}
                <div className="exam-actions">
                  <button className="icon-btn" onClick={() => { setSelectedExam(exam); setShowDetailsModal(true); }} title="Détails">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="icon-btn" onClick={() => { setSelectedExam(exam); setShowEditModal(true); }} title="Modifier">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDeleteExam(exam)} title="Supprimer">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-minimal">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="page-indicator">
            Page {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      )}

      {/* Modals */}
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