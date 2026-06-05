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
  const statuts = ["Actif", "Actif", "Actif", "Actif", "Suspendu", "Diplômé"];
  
  const students = [];
  for (let i = 1; i <= 48; i++) {
    const niveau = niveaux[Math.floor(Math.random() * niveaux.length)];
    const filiere = filieres[Math.floor(Math.random() * filieres.length)];
    students.push({
      id: `IIT${String(i).padStart(5, '0')}`,
      prenom: prenoms[i % prenoms.length],
      nom: noms[i % noms.length],
      photo: null,
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
      statut: statuts[Math.floor(Math.random() * statuts.length)],
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
      case "Actif": return <span className="statut-badge actif">Actif</span>;
      case "Suspendu": return <span className="statut-badge suspendu">Suspendu</span>;
      case "Diplômé": return <span className="statut-badge diplome">Diplômé</span>;
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header simple */}
      <div className="page-header">
        
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i>
          Nouvel étudiant
        </button>
      </div>

      {/* Stats cards minimalistes */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total étudiants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter(s => s.statut === "Actif").length}</div>
          <div className="stat-label">Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter(s => s.statut === "Diplômé").length}</div>
          <div className="stat-label">Diplômés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{niveauxUniques.length}</div>
          <div className="stat-label">Niveaux</div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select className="filter-select" value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
            <option value="">Niveaux</option>
            {niveauxUniques.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select className="filter-select" value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
            <option value="">Filières</option>
            {filieresUniques.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select className="filter-select" value={selectedGroupe} onChange={(e) => setSelectedGroupe(e.target.value)}>
            <option value="">Groupes</option>
            {groupesUniques.map(g => <option key={g} value={g}>Groupe {g}</option>)}
          </select>
          <select className="filter-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            <option value="">Statuts</option>
            <option value="Actif">Actif</option>
            <option value="Suspendu">Suspendu</option>
            <option value="Diplômé">Diplômé</option>
          </select>
          {selectedStudents.length > 0 && (
            <button className="btn-bulk-delete" onClick={handleBulkDelete}>
              <i className="fas fa-trash"></i>
              {selectedStudents.length}
            </button>
          )}
        </div>
      </div>

      {/* Tableau simple */}
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
              <th>ID</th>
              <th>Nom complet</th>
              <th>Niveau</th>
              <th>Filière</th>
              <th>Groupe</th>
              <th>Email</th>
              <th>Statut</th>
              <th></th>
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
                <td className="id-cell">{student.id}</td>
                <td className="name-cell">
                  <div className="student-name">
                    <span className="initials">{student.prenom[0]}{student.nom[0]}</span>
                    <span>{student.prenom} {student.nom}</span>
                  </div>
                </td>
                <td>{student.niveau}</td>
                <td>{student.filiere}</td>
                <td className="groupe-cell">Groupe {student.groupe}</td>
                <td className="email-cell">{student.email}</td>
                <td className="status-cell">{getStatutBadge(student.statut)}</td>
                <td className="actions-cell">
                  <button className="action-btn" onClick={() => { setSelectedStudent(student); setShowDetailsModal(true); }}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn" onClick={() => { setSelectedStudent(student); setShowEditModal(true); }}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteStudent(student)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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