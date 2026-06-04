import React, { useState, useEffect } from "react";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentDetailsModal from "./StudentDetailsModal";
import "./EtudiantsPage.css";

// Données mockées des étudiants
const generateMockStudents = () => {
  const niveaux = [
    "1ère Année Licence", "2ème Année Licence", "3ème Année Licence",
    "1ère Année Master", "2ème Année Master",
    "1ère Année Cycle Ingénieur", "2ème Année Cycle Ingénieur", "3ème Année Cycle Ingénieur"
  ];
  const filieres = ["Informatique", "Réseaux", "Mathématiques", "IA", "Cyber Sécurité", "Génie Logiciel"];
  const groupes = ["A", "B", "C"];
  const prenoms = ["Ahmed", "Sofia", "Yassine", "Nadia", "Karim", "Leila", "Oussama", "Amira", "Mohamed", "Ines", "Hichem", "Fatima", "Rami", "Mariem", "Omar"];
  const noms = ["Ben Ali", "Touati", "Khelil", "Mansouri", "Bennour", "Saidi", "Hamdi", "Chenini", "Salah", "Trabelsi", "Jaouadi", "Zahra", "Gharbi", "Mabrouk", "Chakroun"];
  
  const students = [];
  for (let i = 1; i <= 48; i++) {
    const niveau = niveaux[Math.floor(Math.random() * niveaux.length)];
    const filiere = filieres[Math.floor(Math.random() * filieres.length)];
    students.push({
      id: `IIT${String(i).padStart(5, '0')}`,
      prenom: prenoms[i % prenoms.length],
      nom: noms[i % noms.length],
      photo: i % 2 === 0 ? "👩" : "👨",
      niveau: niveau,
      filiere: filiere,
      groupe: groupes[Math.floor(Math.random() * groupes.length)],
      email: `${prenoms[i % prenoms.length].toLowerCase()}.${noms[i % noms.length].toLowerCase()}@iit.tn`,
      phone: `+216 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
      cin: `${Math.floor(Math.random() * 90000000 + 10000000)}`,
      dateNaissance: `${Math.floor(Math.random() * 28 + 1)}/${Math.floor(Math.random() * 12 + 1)}/${1990 + Math.floor(Math.random() * 15)}`,
      lieuNaissance: ["Tunis", "Sfax", "Sousse", "Bizerte", "Nabeul"][Math.floor(Math.random() * 5)],
      adresse: `${Math.floor(Math.random() * 100)} Rue ${["Habib Bourguiba", "Farhat Hached", "Mohamed V", "de la Liberté", "de Carthage"][Math.floor(Math.random() * 5)]}, ${["Tunis", "Sfax", "Sousse", "Bizerte", "Nabeul"][Math.floor(Math.random() * 5)]}`,
      inscription: `202${Math.floor(Math.random() * 4)}`,
      moyenne: (Math.random() * 6 + 10).toFixed(2),
      statut: ["Actif", "Suspendu", "Diplômé"][Math.floor(Math.random() * 3)],
      examens: [],
      presence: Math.floor(Math.random() * 30)
    });
  }
  return students;
};

export default function EtudiantsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStudents(generateMockStudents());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedNiveau, selectedFiliere, selectedGroupe, selectedStatut]);

  const filterStudents = () => {
    let filtered = [...students];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedNiveau) {
      filtered = filtered.filter(s => s.niveau === selectedNiveau);
    }
    
    if (selectedFiliere) {
      filtered = filtered.filter(s => s.filiere === selectedFiliere);
    }
    
    if (selectedGroupe) {
      filtered = filtered.filter(s => s.groupe === selectedGroupe);
    }
    
    if (selectedStatut) {
      filtered = filtered.filter(s => s.statut === selectedStatut);
    }
    
    setFilteredStudents(filtered);
  };

  const handleAddStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: `IIT${String(students.length + 1).padStart(5, '0')}`,
      statut: "Actif",
      presence: 0,
      examens: []
    };
    setStudents([studentWithId, ...students]);
    setShowAddModal(false);
  };

  const handleEditStudent = (updatedStudent) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setShowEditModal(false);
  };

  const handleDeleteStudent = (student) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ${student.prenom} ${student.nom} ?`)) {
      setStudents(students.filter(s => s.id !== student.id));
      setShowDetailsModal(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) return;
    if (window.confirm(`Voulez-vous vraiment supprimer ${selectedStudents.length} étudiants ?`)) {
      setStudents(students.filter(s => !selectedStudents.includes(s.id)));
      setSelectedStudents([]);
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const niveauxUniques = [...new Set(students.map(s => s.niveau))];
  const filieresUniques = [...new Set(students.map(s => s.filiere))];
  const groupesUniques = ["A", "B", "C"];

  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Actif": return <span className="statut-badge actif">🟢 Actif</span>;
      case "Suspendu": return <span className="statut-badge suspendu">🟡 Suspendu</span>;
      case "Diplômé": return <span className="statut-badge diplome">🎓 Diplômé</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  if (loading) {
    return (
      <div className="etudiants-page loading">
        <div className="spinner"></div>
        <p>Chargement des étudiants...</p>
      </div>
    );
  }

  return (
    <div className="etudiants-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">👨‍🎓 Gestion des étudiants</h1>
          <p className="page-subtitle">Gestion complète des ressources humaines (apprenants)</p>
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
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total étudiants</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <div className="stat-value">{students.filter(s => s.statut === "Actif").length}</div>
            <div className="stat-label">Actifs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <div className="stat-value">{students.filter(s => s.statut === "Diplômé").length}</div>
            <div className="stat-label">Diplômés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{niveauxUniques.length}</div>
            <div className="stat-label">Niveaux</div>
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
            placeholder="Rechercher par nom, prénom, ID ou email..."
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
        <select className="filter-select" value={selectedGroupe} onChange={(e) => setSelectedGroupe(e.target.value)}>
          <option value="">Tous les groupes</option>
          {groupesUniques.map(g => <option key={g} value={g}>Groupe {g}</option>)}
        </select>
        <select className="filter-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Suspendu">Suspendu</option>
          <option value="Diplômé">Diplômé</option>
        </select>
        {selectedStudents.length > 0 && (
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            🗑️ Supprimer ({selectedStudents.length})
          </button>
        )}
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectAll && filteredStudents.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Photo</th>
              <th>ID</th>
              <th>Nom complet</th>
              <th>Niveau</th>
              <th>Filière</th>
              <th>Groupe</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className={selectedStudents.includes(student.id) ? 'selected' : ''}>
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </td>
                <td className="photo-cell">
                  <div className="student-photo">{student.photo}</div>
                </td>
                <td className="id-cell">{student.id}</td>
                <td className="name-cell">
                  <span className="student-name">{student.prenom} {student.nom}</span>
                </td>
                <td>{student.niveau}</td>
                <td>{student.filiere}</td>
                <td><span className="groupe-badge">Groupe {student.groupe}</span></td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{getStatutBadge(student.statut)}</td>
                <td className="actions-cell">
                  <button className="action-btn view" onClick={() => { setSelectedStudent(student); setShowDetailsModal(true); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    </svg>
                  </button>
                  <button className="action-btn edit" onClick={() => { setSelectedStudent(student); setShowEditModal(true); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-6.17 6.17a2 2 0 01-1.42.59H5a2 2 0 01-2-2v-8a2 2 0 01.59-1.42l6.17-6.17a2 2 0 012.83 0l7.24 7.24a2 2 0 010 2.83z"/>
                      <line x1="16.5" y1="9.5" x2="7.5" y2="18.5"/>
                    </svg>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteStudent(student)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">{filteredStudents.length} étudiants affichés</span>
      </div>

      {showAddModal && (
        <AddStudentModal
          onAdd={handleAddStudent}
          onClose={() => setShowAddModal(false)}
          niveaux={niveauxUniques}
          filieres={filieresUniques}
        />
      )}

      {showEditModal && selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onSave={handleEditStudent}
          onClose={() => setShowEditModal(false)}
          niveaux={niveauxUniques}
          filieres={filieresUniques}
        />
      )}

      {showDetailsModal && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onDelete={() => handleDeleteStudent(selectedStudent)}
        />
      )}
    </div>
  );
}