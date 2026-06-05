import React, { useState, useEffect } from "react";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import TeacherDetailsModal from "./TeacherDetailsModal";
import "./EnseignantsPage.css";

// Données mockées des enseignants
const generateMockTeachers = () => {
  const grades = [
    "Professeur", "Maître de conférences", "Maître assistant", 
    "Assistant", "Professeur émérite", "Chercheur post-doc"
  ];
  const filieres = ["Informatique", "Réseaux", "Mathématiques", "IA", "Cyber Sécurité", "Génie Logiciel", "Physique", "Électronique"];
  const statuts = ["Permanent", "Contractuel", "Vacataire", "Chercheur"];
  const prenoms = ["Karim", "Salima", "Amine", "Nadia", "Sofiene", "Leila", "Hichem", "Fatima", "Mohamed", "Ines"];
  const noms = ["Ben Ali", "Mansouri", "Touati", "Khelil", "Marzouk", "Saidi", "Jaouadi", "Zahra", "Salah", "Trabelsi"];
  
  const teachers = [];
  for (let i = 1; i <= 48; i++) {
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const filiere = filieres[Math.floor(Math.random() * filieres.length)];
    teachers.push({
      id: `PROF${String(i).padStart(4, '0')}`,
      prenom: prenoms[i % prenoms.length],
      nom: noms[i % noms.length],
      photo: null,
      grade: grade,
      filiere: filiere,
      specialites: [filiere, filieres[(i + 1) % filieres.length]].slice(0, 2),
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      email: `${prenoms[i % prenoms.length].toLowerCase()}.${noms[i % noms.length].toLowerCase()}@iit.tn`,
      phone: `+216 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
      bureau: `B${Math.floor(Math.random() * 100)}`,
      dateEmbauche: `201${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      disponibilites: [
        `${["Lun", "Mar", "Mer", "Jeu", "Ven"][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 8 + 8)}:00-${Math.floor(Math.random() * 4 + 12)}:00`,
        `${["Lun", "Mar", "Mer", "Jeu", "Ven"][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 4 + 14)}:00-${Math.floor(Math.random() * 4 + 17)}:00`
      ],
      cours: [`Cours ${filiere} 101`, `TP ${filiere} 102`],
      examensSupervises: Math.floor(Math.random() * 20),
      etudiantsEncadres: Math.floor(Math.random() * 30),
      contactUrgence: `+216 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
      adresse: `${Math.floor(Math.random() * 100)} Rue ${["Habib Bourguiba", "Farhat Hached", "Mohamed V"][Math.floor(Math.random() * 3)]}, Tunis`,
      diplome: ["Doctorat", "HDR", "Master", "Ingénieur"][Math.floor(Math.random() * 4)],
      universiteOrigine: ["Université de Tunis", "Université de Sfax", "Université de Sousse", "Université Paris-Saclay"][Math.floor(Math.random() * 4)],
      publications: Math.floor(Math.random() * 50),
      projets: Math.floor(Math.random() * 10)
    });
  }
  return teachers;
};

export default function EnseignantsPage() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const mockTeachers = generateMockTeachers();
      setTeachers(mockTeachers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedGrade, selectedFiliere, selectedStatut]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTeachers.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredTeachers, itemsPerPage]);

  const filterTeachers = () => {
    let filtered = [...teachers];
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.filiere.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGrade) {
      filtered = filtered.filter(t => t.grade === selectedGrade);
    }
    
    if (selectedFiliere) {
      filtered = filtered.filter(t => t.filiere === selectedFiliere);
    }
    
    if (selectedStatut) {
      filtered = filtered.filter(t => t.statut === selectedStatut);
    }
    
    setFilteredTeachers(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleAddTeacher = (newTeacher) => {
    const teacherWithId = {
      ...newTeacher,
      id: `PROF${String(teachers.length + 1).padStart(4, '0')}`,
      examensSupervises: 0,
      etudiantsEncadres: 0,
      publications: 0,
      projets: 0
    };
    setTeachers([teacherWithId, ...teachers]);
    setShowAddModal(false);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    setShowEditModal(false);
  };

  const handleDeleteTeacher = (teacher) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ${teacher.prenom} ${teacher.nom} ?`)) {
      setTeachers(teachers.filter(t => t.id !== teacher.id));
      setShowDetailsModal(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedTeachers.length === 0) return;
    if (window.confirm(`Voulez-vous vraiment supprimer ${selectedTeachers.length} enseignant(s) ?`)) {
      setTeachers(teachers.filter(t => !selectedTeachers.includes(t.id)));
      setSelectedTeachers([]);
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(currentTeachers.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectTeacher = (teacherId) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId));
    } else {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    }
  };

  const gradesUniques = [...new Set(teachers.map(t => t.grade))];
  const filieresUniques = [...new Set(teachers.map(t => t.filiere))];
  const statutsUniques = [...new Set(teachers.map(t => t.statut))];

  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Permanent": return <span className="statut-badge permanent">Permanent</span>;
      case "Contractuel": return <span className="statut-badge contractuel">Contractuel</span>;
      case "Vacataire": return <span className="statut-badge vacataire">Vacataire</span>;
      case "Chercheur": return <span className="statut-badge chercheur">Chercheur</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getGradeBadge = (grade) => {
    switch(grade) {
      case "Professeur": return <span className="grade-badge professeur">Professeur</span>;
      case "Maître de conférences": return <span className="grade-badge maitre">M. Conférences</span>;
      case "Maître assistant": return <span className="grade-badge assistant">M. Assistant</span>;
      default: return <span className="grade-badge">{grade}</span>;
    }
  };

  if (loading) {
    return (
      <div className="enseignants-page loading">
        <div className="spinner"></div>
        <p>Chargement des enseignants...</p>
      </div>
    );
  }

  return (
    <div className="enseignants-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        
        <div className="header-actions">
          
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i>
            Ajouter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-chalkboard-user"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Total enseignants</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.filter(t => t.statut === "Permanent").length}</div>
            <div className="stat-label">Permanents</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.reduce((sum, t) => sum + t.examensSupervises, 0)}</div>
            <div className="stat-label">Examens supervisés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{new Set(teachers.map(t => t.filiere)).size}</div>
            <div className="stat-label">Filières</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, ID, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          <option value="">Tous les grades</option>
          {gradesUniques.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="filter-select" value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          {filieresUniques.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="filter-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statutsUniques.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {selectedTeachers.length > 0 && (
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            <i className="fas fa-trash-alt"></i>
            Supprimer ({selectedTeachers.length})
          </button>
        )}
      </div>

      {/* Selection Bar */}
      {currentTeachers.length > 0 && (
        <div className="selection-bar">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectAll && currentTeachers.length > 0}
              onChange={handleSelectAll}
            />
            <span>Sélectionner tout</span>
          </label>
          <span className="selection-count">{filteredTeachers.length} enseignant(s) au total</span>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="teachers-grid">
        {currentTeachers.map(teacher => (
          <div key={teacher.id} className={`teacher-card ${selectedTeachers.includes(teacher.id) ? 'selected' : ''}`}>
            <div className="teacher-card-header">
              <div className="teacher-photo">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={`${teacher.prenom} ${teacher.nom}`} />
                ) : (
                  <div className="photo-placeholder">
                    <i className="fas fa-chalkboard-user"></i>
                  </div>
                )}
              </div>
              <div className="teacher-info">
                <h3 className="teacher-name">{teacher.prenom} {teacher.nom}</h3>
                <p className="teacher-id">{teacher.id}</p>
                <div className="teacher-badges">
                  {getGradeBadge(teacher.grade)}
                  {getStatutBadge(teacher.statut)}
                </div>
              </div>
              <input
                type="checkbox"
                className="teacher-select"
                checked={selectedTeachers.includes(teacher.id)}
                onChange={() => handleSelectTeacher(teacher.id)}
              />
            </div>
            <div className="teacher-details">
              <div className="detail-item">
                <i className="fas fa-graduation-cap"></i>
                <span>{teacher.filiere}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-envelope"></i>
                <span>{teacher.email}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-phone"></i>
                <span>{teacher.phone}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-building"></i>
                <span>Bureau {teacher.bureau}</span>
              </div>
            </div>
            <div className="teacher-specialites">
              {teacher.specialites.map((s, i) => (
                <span key={i} className="specialite-tag">{s}</span>
              ))}
            </div>
            <div className="teacher-stats">
              <div className="stat">
                <span className="stat-value">{teacher.examensSupervises}</span>
                <span className="stat-label">Examens</span>
              </div>
              <div className="stat">
                <span className="stat-value">{teacher.etudiantsEncadres}</span>
                <span className="stat-label">Encadrés</span>
              </div>
              <div className="stat">
                <span className="stat-value">{teacher.publications}</span>
                <span className="stat-label">Publications</span>
              </div>
            </div>
            <div className="teacher-actions">
              <button className="action-btn view" onClick={() => { setSelectedTeacher(teacher); setShowDetailsModal(true); }}>
                <i className="fas fa-eye"></i>
                Détails
              </button>
              <button className="action-btn edit" onClick={() => { setSelectedTeacher(teacher); setShowEditModal(true); }}>
                <i className="fas fa-edit"></i>
                Modifier
              </button>
              <button className="action-btn delete" onClick={() => handleDeleteTeacher(teacher)}>
                <i className="fas fa-trash-alt"></i>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="pagination-pages">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`pagination-page ${currentPage === pageNumber ? 'active' : ''}`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="pagination-dots">...</span>;
              }
              return null;
            })}
          </div>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="pagination-info">
        <i className="fas fa-users"></i>
        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredTeachers.length)} sur {filteredTeachers.length} enseignant(s)
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTeacherModal
          onAdd={handleAddTeacher}
          onClose={() => setShowAddModal(false)}
          grades={gradesUniques}
          filieres={filieresUniques}
          statuts={statutsUniques}
        />
      )}

      {showEditModal && selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          onSave={handleEditTeacher}
          onClose={() => setShowEditModal(false)}
          grades={gradesUniques}
          filieres={filieresUniques}
          statuts={statutsUniques}
        />
      )}

      {showDetailsModal && selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onDelete={() => handleDeleteTeacher(selectedTeacher)}
        />
      )}
    </div>
  );
}