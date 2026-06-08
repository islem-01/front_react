import React, { useState, useEffect } from "react";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import ExamDetailsModal from "./ExamDetailsModal";
import "./ExamensPage.css";

// Données mockées des demandes d'examen des enseignants
const generateMockRequests = () => {
  const matieres = ["Algorithmique", "Base de données", "Réseaux", "IA", "Java", "Cryptographie"];
  const niveaux = ["L1", "L2", "L3", "M1", "M2", "ING1", "ING2", "ING3"];
  const filieres = ["Informatique", "Réseaux", "IA", "Génie Logiciel", "Cyber Sécurité"];
  const groupes = ["Groupe A", "Groupe B", "Groupe C", "Classe 1", "Classe 2"];
  const enseignants = ["Prof. Kamel Mansouri", "Prof. Salma Bouaziz", "Dr. Ines Trabelsi", "Prof. Walid Ferchichi"];
  
  const requests = [];
  const today = new Date();
  
  for (let i = 1; i <= 8; i++) {
    const requestDate = new Date(today);
    requestDate.setDate(today.getDate() + (i * 2));
    
    requests.push({
      id: `DEM${String(i).padStart(4, '0')}`,
      matiere: matieres[i % matieres.length],
      niveau: niveaux[i % niveaux.length],
      filiere: filieres[i % filieres.length],
      groupe: groupes[i % groupes.length],
      enseignant: enseignants[i % enseignants.length],
      dateProposee: requestDate.toISOString().split('T')[0],
      heureDebut: ["08:00", "09:00", "10:00", "14:00"][i % 4],
      heureFin: ["10:00", "11:00", "12:00", "16:00"][i % 4],
      duree: 2,
      nbrEtudiants: Math.floor(Math.random() * 50 + 20),
      observations: i % 3 === 0 ? "Salle avec vidéoprojecteur souhaitée" : "",
      statut: i < 3 ? "en_attente" : (i < 5 ? "acceptee" : "refusee"),
      createdAt: new Date(today).toISOString(),
      salleAttribuee: i % 2 === 0 ? "Salle A12" : null
    });
  }
  return requests;
};

// Données mockées des examens
const generateMockExams = () => {
  const matieres = [
    "Architecture des Ordinateurs", "Algorithmique Avancée", "Bases de Données", 
    "Réseaux et Télécommunications", "Intelligence Artificielle", "Génie Logiciel",
    "Cryptographie", "Développement Web", "Systèmes d'Exploitation"
  ];
  
  const salles = ["Salle A101", "Salle A102", "Salle B201", "Salle B202", "Amphithéâtre C", "Labo Info"];
  const professeurs = [
    "Dr. Karim Benali", "Pr. Salima Mansouri", "Dr. Amine Touati", 
    "Pr. Nadia Khelil", "Dr. Sofiene Marzouk", "Pr. Hichem Jaouadi"
  ];
  const niveaux = ["L1", "L2", "L3", "M1", "M2", "ING1", "ING2", "ING3"];
  const statuts = ["Planifié", "En cours", "Terminé", "Annulé"];
  
  const exams = [];
  const today = new Date();
  
  for (let i = 1; i <= 12; i++) {
    const examDate = new Date(today);
    examDate.setDate(today.getDate() + (i - 6));
    
    exams.push({
      id: `EX${String(i).padStart(4, '0')}`,
      matiere: matieres[i % matieres.length],
      code: `INF${Math.floor(Math.random() * 900 + 100)}`,
      niveau: niveaux[i % niveaux.length],
      filiere: ["Informatique", "Réseaux", "Mathématiques", "IA"][i % 4],
      groupes: ["Groupe A", "Groupe B"].slice(0, Math.floor(Math.random() * 2) + 1),
      professeur: professeurs[i % professeurs.length],
      surveillants: [professeurs[(i + 1) % professeurs.length]],
      salle: salles[i % salles.length],
      date: examDate.toISOString().split('T')[0],
      heureDebut: `${8 + (i % 8)}:00`,
      heureFin: `${10 + (i % 8)}:00`,
      duree: 2,
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      nbrEtudiants: Math.floor(Math.random() * 80 + 20),
      nbrPresent: 0,
      nbrAbsent: 0,
      demandeId: i < 4 ? `DEM${String(i).padStart(4, '0')}` : null,
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
  const [requests, setRequests] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("examens"); // examens, demandes
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setExams(generateMockExams());
      setRequests(generateMockRequests());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterExams();
    filterRequests();
  }, [exams, requests, searchTerm, selectedNiveau, selectedFiliere, selectedStatut, selectedDate]);

  const filterExams = () => {
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
    if (selectedDate) filtered = filtered.filter(e => e.date === selectedDate);
    setFilteredExams(filtered);
    setCurrentPage(1);
  };

  const filterRequests = () => {
    let filtered = [...requests];
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.enseignant.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedNiveau) filtered = filtered.filter(r => r.niveau === selectedNiveau);
    if (selectedFiliere) filtered = filtered.filter(r => r.filiere === selectedFiliere);
    if (selectedStatut) filtered = filtered.filter(r => r.statut === selectedStatut);
    if (selectedDate) filtered = filtered.filter(r => r.dateProposee === selectedDate);
    setFilteredRequests(filtered);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((activeTab === "examens" ? filteredExams.length : filteredRequests.length) / itemsPerPage);

  const niveauxUniques = [...new Set([...exams.map(e => e.niveau), ...requests.map(r => r.niveau)])];
  const filieresUniques = [...new Set([...exams.map(e => e.filiere), ...requests.map(r => r.filiere)])];
  const statutsUniques = ["Planifié", "En cours", "Terminé", "Annulé"];

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
    alert(`✅ Examen "${newExam.matiere}" créé avec succès !\n📧 Une notification a été envoyée à l'enseignant.`);
  };

  const handleEditExam = (updatedExam) => {
    setExams(exams.map(e => e.id === updatedExam.id ? updatedExam : e));
    setShowEditModal(false);
  };

  const handleDeleteExam = (exam) => {
    if (window.confirm(`Supprimer l'examen "${exam.matiere}" ?`)) {
      setExams(exams.filter(e => e.id !== exam.id));
      setShowDetailsModal(false);
    }
  };

  const handleAcceptRequest = (request) => {
    // Créer automatiquement un examen à partir de la demande
    const newExam = {
      matiere: request.matiere,
      code: `INF${Math.floor(Math.random() * 900 + 100)}`,
      niveau: request.niveau,
      filiere: request.filiere,
      groupes: [request.groupe],
      professeur: request.enseignant,
      surveillants: [],
      salle: request.salleAttribuee || "Salle à définir",
      date: request.dateProposee,
      heureDebut: request.heureDebut,
      heureFin: request.heureFin,
      duree: request.duree,
      statut: "Planifié",
      nbrEtudiants: request.nbrEtudiants,
      demandeId: request.id
    };
    
    const examWithId = {
      ...newExam,
      id: `EX${String(exams.length + 1).padStart(4, '0')}`,
      nbrPresent: 0,
      nbrAbsent: 0,
      createdAt: new Date().toISOString()
    };
    
    setExams([examWithId, ...exams]);
    setRequests(requests.map(r => r.id === request.id ? { ...r, statut: "acceptee", salleAttribuee: examWithId.salle } : r));
    alert(`✅ Demande acceptée !\n📧 Une notification a été envoyée à ${request.enseignant}\n📅 Examen programmé le ${request.dateProposee} en ${examWithId.salle}`);
  };

  const handleRejectRequest = (request) => {
    if (window.confirm(`Refuser la demande de ${request.enseignant} pour "${request.matiere}" ?`)) {
      setRequests(requests.map(r => r.id === request.id ? { ...r, statut: "refusee" } : r));
      alert(`❌ Demande refusée.\n📧 Une notification a été envoyée à ${request.enseignant}`);
    }
  };

  const handleDeleteRequest = (request) => {
    if (window.confirm(`Supprimer la demande de "${request.matiere}" ?`)) {
      setRequests(requests.filter(r => r.id !== request.id));
    }
  };

  const getStatutBadge = (statut) => {
    switch(statut) {
      case "Planifié": return <span className="statut-badge planifie"><i className="fas fa-calendar"></i> Planifié</span>;
      case "En cours": return <span className="statut-badge encours"><i className="fas fa-play-circle"></i> En cours</span>;
      case "Terminé": return <span className="statut-badge termine"><i className="fas fa-check-circle"></i> Terminé</span>;
      case "Annulé": return <span className="statut-badge annule"><i className="fas fa-ban"></i> Annulé</span>;
      default: return <span className="statut-badge">{statut}</span>;
    }
  };

  const getRequestStatutBadge = (statut) => {
    switch(statut) {
      case "en_attente": return <span className="request-badge pending"><i className="fas fa-clock"></i> En attente</span>;
      case "acceptee": return <span className="request-badge accepted"><i className="fas fa-check-circle"></i> Acceptée</span>;
      case "refusee": return <span className="request-badge refused"><i className="fas fa-times-circle"></i> Refusée</span>;
      default: return <span className="request-badge">{statut}</span>;
    }
  };

  if (loading) {
    return <div className="examens-page loading"><div className="spinner"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="examens-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1><i className="fas fa-calendar-alt"></i> Gestion des examens</h1>
          <p className="page-subtitle">Centralisation et contrôle des sessions d'évaluation</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Créer un examen
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === "examens" ? "active" : ""}`} onClick={() => setActiveTab("examens")}>
          <i className="fas fa-calendar-alt"></i> Examens
          <span className="tab-count">{exams.length}</span>
        </button>
        <button className={`tab-btn ${activeTab === "demandes" ? "active" : ""}`} onClick={() => setActiveTab("demandes")}>
          <i className="fas fa-inbox"></i> Demandes des enseignants
          <span className="tab-count pending-count">{requests.filter(r => r.statut === "en_attente").length}</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
          <option value="">Tous les niveaux</option>
          {niveauxUniques.map(n => <option key={n}>{n}</option>)}
        </select>
        <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          {filieresUniques.map(f => <option key={f}>{f}</option>)}
        </select>
        <select value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statutsUniques.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" className="filter-date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {/* Tableau des examens */}
      {activeTab === "examens" && (
        <div className="table-container">
          <table className="examens-table">
            <thead>
              <tr>
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
              {currentExams.map(exam => (
                <tr key={exam.id}>
                  <td className="code-cell">{exam.code}</td>
                  <td className="title-cell">{exam.matiere}</td>
                  <td>{exam.niveau} • {exam.filiere}</td>
                  <td>{exam.professeur}</td>
                  <td>{exam.salle}</td>
                  <td className={exam.date < new Date().toISOString().split('T')[0] ? "date-past" : "date-future"}>{exam.date}</td>
                  <td>{exam.heureDebut} - {exam.heureFin} (<span className="duree">{exam.duree}h</span>)</td>
                  <td>{exam.nbrEtudiants}</td>
                  <td>{getStatutBadge(exam.statut)}</td>
                  <td className="actions">
                    <button className="btn-icon" onClick={() => { setSelectedExam(exam); setShowDetailsModal(true); }} title="Détails">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-icon" onClick={() => { setSelectedExam(exam); setShowEditModal(true); }} title="Modifier">
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteExam(exam)} title="Supprimer">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau des demandes */}
      {activeTab === "demandes" && (
        <div className="table-container">
          <table className="examens-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Matière</th>
                <th>Niveau/Filière</th>
                <th>Groupe</th>
                <th>Date proposée</th>
                <th>Horaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map(request => (
                <tr key={request.id} className={`request-row ${request.statut}`}>
                  <td className="teacher-cell">
                    <div className="teacher-info">
                      <i className="fas fa-chalkboard-user"></i>
                      <span>{request.enseignant}</span>
                    </div>
                  </td>
                  <td className="title-cell">{request.matiere}</td>
                  <td>{request.niveau} • {request.filiere}</td>
                  <td>{request.groupe}</td>
                  <td className={request.dateProposee < new Date().toISOString().split('T')[0] ? "date-past" : "date-future"}>{request.dateProposee}</td>
                  <td>{request.heureDebut} - {request.heureFin}</td>
                  <td>{getRequestStatutBadge(request.statut)}</td>
                  <td className="actions">
                    {request.statut === "en_attente" ? (
                      <>
                        <button className="btn-icon accept" onClick={() => handleAcceptRequest(request)} title="Accepter">
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="btn-icon reject" onClick={() => handleRejectRequest(request)} title="Refuser">
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <button className="btn-icon view" onClick={() => { setSelectedRequest(request); setShowRequestModal(true); }} title="Détails">
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    <button className="btn-icon delete" onClick={() => handleDeleteRequest(request)} title="Supprimer">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><i className="fas fa-angle-double-left"></i></button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><i className="fas fa-chevron-left"></i></button>
          <span className="page-info">Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}><i className="fas fa-chevron-right"></i></button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><i className="fas fa-angle-double-right"></i></button>
        </div>
      )}

      <div className="pagination-info">
        <i className="fas fa-list"></i> {activeTab === "examens" ? filteredExams.length : filteredRequests.length} élément(s)
      </div>

      {/* Modals */}
      {showAddModal && <AddExamModal onAdd={handleAddExam} onClose={() => setShowAddModal(false)} niveaux={niveauxUniques} filieres={filieresUniques} />}
      {showEditModal && selectedExam && <EditExamModal exam={selectedExam} onSave={handleEditExam} onClose={() => setShowEditModal(false)} niveaux={niveauxUniques} filieres={filieresUniques} />}
      {showDetailsModal && selectedExam && <ExamDetailsModal exam={selectedExam} onClose={() => setShowDetailsModal(false)} onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }} onDelete={() => handleDeleteExam(selectedExam)} />}
      
      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-inbox"></i> Détails de la demande</h3>
              <button className="close" onClick={() => setShowRequestModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><strong>Enseignant:</strong> {selectedRequest.enseignant}</div>
              <div className="detail-row"><strong>Matière:</strong> {selectedRequest.matiere}</div>
              <div className="detail-row"><strong>Niveau:</strong> {selectedRequest.niveau}</div>
              <div className="detail-row"><strong>Filière:</strong> {selectedRequest.filiere}</div>
              <div className="detail-row"><strong>Groupe:</strong> {selectedRequest.groupe}</div>
              <div className="detail-row"><strong>Date proposée:</strong> {selectedRequest.dateProposee}</div>
              <div className="detail-row"><strong>Horaire:</strong> {selectedRequest.heureDebut} - {selectedRequest.heureFin}</div>
              <div className="detail-row"><strong>Durée:</strong> {selectedRequest.duree} heures</div>
              <div className="detail-row"><strong>Nombre d'étudiants:</strong> {selectedRequest.nbrEtudiants}</div>
              {selectedRequest.observations && <div className="detail-row"><strong>Observations:</strong> {selectedRequest.observations}</div>}
              {selectedRequest.salleAttribuee && <div className="detail-row"><strong>Salle attribuée:</strong> {selectedRequest.salleAttribuee}</div>}
              <div className="detail-row"><strong>Statut:</strong> {getRequestStatutBadge(selectedRequest.statut)}</div>
            </div>
            <div className="modal-footer">
              {selectedRequest.statut === "en_attente" && (
                <>
                  <button className="btn-accept" onClick={() => { handleAcceptRequest(selectedRequest); setShowRequestModal(false); }}>Accepter</button>
                  <button className="btn-reject" onClick={() => { handleRejectRequest(selectedRequest); setShowRequestModal(false); }}>Refuser</button>
                </>
              )}
              <button className="btn-close" onClick={() => setShowRequestModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}