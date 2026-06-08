import React, { useState, useEffect } from "react";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import TeacherDetailsModal from "./TeacherDetailsModal";
import "./EnseignantsPage.css";

// Données mockées des enseignants avec photos
const generateMockTeachers = () => {
  const grades = ["Professeur", "Maître de conférences", "Maître assistant", "Assistant"];
  const filieres = ["Informatique", "Réseaux", "Mathématiques", "IA", "Cyber Sécurité", "Génie Logiciel"];
  const statuts = ["Permanent", "Contractuel", "Vacataire"];
  const prenoms = ["Karim", "Salima", "Amine", "Nadia", "Sofiene", "Leila", "Hichem", "Fatima", "Mohamed", "Ines"];
  const noms = ["Ben Ali", "Mansouri", "Touati", "Khelil", "Marzouk", "Saidi", "Jaouadi", "Zahra", "Salah", "Trabelsi"];
  
  // URLs d'images placeholder (utilisation de picsum.photos pour des images génériques)
  const avatarUrls = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
    "https://randomuser.me/api/portraits/men/4.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
    "https://randomuser.me/api/portraits/women/5.jpg",
  ];
  
  const teachers = [];
  for (let i = 1; i <= 24; i++) {
    teachers.push({
      id: `PROF${String(i).padStart(4, '0')}`,
      prenom: prenoms[i % prenoms.length],
      nom: noms[i % noms.length],
      photo: avatarUrls[i % avatarUrls.length],
      grade: grades[Math.floor(Math.random() * grades.length)],
      filiere: filieres[Math.floor(Math.random() * filieres.length)],
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      email: `${prenoms[i % prenoms.length].toLowerCase()}.${noms[i % noms.length].toLowerCase()}@iit.tn`,
      phone: `+216 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
      bureau: `B${Math.floor(Math.random() * 100)}`,
      compteActif: true
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setTeachers(generateMockTeachers());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...teachers];
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedGrade) filtered = filtered.filter(t => t.grade === selectedGrade);
    if (selectedFiliere) filtered = filtered.filter(t => t.filiere === selectedFiliere);
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [teachers, searchTerm, selectedGrade, selectedFiliere]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const gradesUniques = [...new Set(teachers.map(t => t.grade))];
  const filieresUniques = [...new Set(teachers.map(t => t.filiere))];

  const handleAddTeacher = (newTeacher) => {
    const teacherWithId = {
      ...newTeacher,
      id: `PROF${String(teachers.length + 1).padStart(4, '0')}`,
      compteActif: true,
      photo: newTeacher.photoPreview || null
    };
    setTeachers([teacherWithId, ...teachers]);
    setShowAddModal(false);
    alert(`✅ Enseignant ajouté avec succès !\n📧 Email: ${newTeacher.email}\n🔑 Mot de passe: teacher123`);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    setShowEditModal(false);
  };

  const handleDeleteTeacher = (teacher) => {
    if (window.confirm(`Supprimer ${teacher.prenom} ${teacher.nom} ?`)) {
      setTeachers(teachers.filter(t => t.id !== teacher.id));
    }
  };

  if (loading) {
    return <div className="enseignants-page loading"><div className="spinner"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="enseignants-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Enseignants</h1>
          <p>Gestion du personnel académique</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          <option value="">Tous les grades</option>
          {gradesUniques.map(g => <option key={g}>{g}</option>)}
        </select>
        <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          {filieresUniques.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="table-container">
        <table className="teachers-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Enseignant</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Filière</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="photo-cell">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={`${teacher.prenom} ${teacher.nom}`} className="teacher-photo" />
                  ) : (
                    <div className="teacher-photo-placeholder">
                      <i className="fas fa-user-circle"></i>
                    </div>
                  )}
                </td>
                <td>
                  <div className="teacher-name">{teacher.prenom} {teacher.nom}</div>
                  <div className="teacher-id">{teacher.id}</div>
                </td>
                <td className="teacher-email">{teacher.email}</td>
                <td><span className="badge grade">{teacher.grade}</span></td>
                <td>{teacher.filiere}</td>
                <td>
                  <span className={`badge status ${teacher.compteActif ? 'active' : 'inactive'}`}>
                    {teacher.compteActif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => { setSelectedTeacher(teacher); setShowDetailsModal(true); }} title="Voir">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="btn-icon" onClick={() => { setSelectedTeacher(teacher); setShowEditModal(true); }} title="Modifier">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDeleteTeacher(teacher)} title="Supprimer">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><i className="fas fa-angle-double-left"></i></button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><i className="fas fa-chevron-left"></i></button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}><i className="fas fa-chevron-right"></i></button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><i className="fas fa-angle-double-right"></i></button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddTeacherModal onAdd={handleAddTeacher} onClose={() => setShowAddModal(false)} grades={gradesUniques} filieres={filieresUniques} statuts={["Permanent", "Contractuel", "Vacataire"]} />}
      {showEditModal && selectedTeacher && <EditTeacherModal teacher={selectedTeacher} onSave={handleEditTeacher} onClose={() => setShowEditModal(false)} grades={gradesUniques} filieres={filieresUniques} statuts={["Permanent", "Contractuel", "Vacataire"]} />}
      {showDetailsModal && selectedTeacher && <TeacherDetailsModal teacher={selectedTeacher} onClose={() => setShowDetailsModal(false)} onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }} onDelete={() => handleDeleteTeacher(selectedTeacher)} />}
    </div>
  );
}