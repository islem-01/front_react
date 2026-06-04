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
  for (let i = 1; i <= 24; i++) {
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const filiere = filieres[Math.floor(Math.random() * filieres.length)];
    teachers.push({
      id: `PROF${String(i).padStart(4, '0')}`,
      prenom: prenoms[i % prenoms.length],
      nom: noms[i % noms.length],
      photo: i % 2 === 0 ? "👩‍🏫" : "👨‍🏫",
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

  useEffect(() => {
    setTimeout(() => {
      setTeachers(generateMockTeachers());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedGrade, selectedFiliere, selectedStatut]);

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
      setSelectedTeachers(filteredTeachers.map(t => t.id));
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
      case "Permanent": return <span className="statut-badge permanent">✅ Permanent</span>;
      case "Contractuel": return <span className="statut-badge contractuel">📝 Contractuel</span>;
      case "Vacataire": return <span className="statut-badge vacataire">⏳ Vacataire</span>;
      case "Chercheur": return <span className="statut-badge chercheur">🔬 Chercheur</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getGradeBadge = (grade) => {
    switch(grade) {
      case "Professeur": return <span className="grade-badge professeur">👨‍🏫 Professeur</span>;
      case "Maître de conférences": return <span className="grade-badge maitre">📖 MCF</span>;
      case "Maître assistant": return <span className="grade-badge assistant">📚 MA</span>;
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
      <div className="page-header">
        <div>
          <h1 className="page-title">👨‍🏫 Gestion des enseignants</h1>
          <p className="page-subtitle">Gestion complète des ressources humaines (encadrants)</p>
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
            Ajouter
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Total enseignants</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{teachers.filter(t => t.statut === "Permanent").length}</div>
            <div className="stat-label">Permanents</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <div className="stat-value">{teachers.reduce((sum, t) => sum + t.examensSupervises, 0)}</div>
            <div className="stat-label">Examens supervisés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{new Set(teachers.map(t => t.filiere)).size}</div>
            <div className="stat-label">Filières</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, ID, email ou filière..."
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
            🗑️ Supprimer ({selectedTeachers.length})
          </button>
        )}
      </div>

      <div className="teachers-grid">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className={`teacher-card ${selectedTeachers.includes(teacher.id) ? 'selected' : ''}`}>
            <div className="teacher-card-header">
              <div className="teacher-photo">{teacher.photo}</div>
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
                <span className="detail-icon">📚</span>
                <span>{teacher.filiere}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📧</span>
                <span>{teacher.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📞</span>
                <span>{teacher.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏢</span>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                </svg>
                Détails
              </button>
              <button className="action-btn edit" onClick={() => { setSelectedTeacher(teacher); setShowEditModal(true); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-6.17 6.17a2 2 0 01-1.42.59H5a2 2 0 01-2-2v-8a2 2 0 01.59-1.42l6.17-6.17a2 2 0 012.83 0l7.24 7.24a2 2 0 010 2.83z"/>
                  <line x1="16.5" y1="9.5" x2="7.5" y2="18.5"/>
                </svg>
                Modifier
              </button>
              <button className="action-btn delete" onClick={() => handleDeleteTeacher(teacher)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

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