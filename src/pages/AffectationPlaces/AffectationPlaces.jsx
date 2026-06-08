// AffectationPlaces.jsx - Version complète avec gestion des conflits et notifications
import React, { useState, useEffect } from "react";
import "./AffectationPlaces.css";

// Données mockées des examens planifiés
const generateMockExams = () => {
  return [
    {
      id: "EX2024001",
      matiere: "Architecture des Ordinateurs",
      code: "ARCH301",
      niveau: "L3",
      filiere: "Informatique",
      groupes: ["INFO1", "INFO2", "INFO3"],
      professeur: "Dr. Karim Benali",
      date: "2026-06-20",
      heureDebut: "09:00",
      heureFin: "11:00",
      duree: 2,
      statut: "Planifie"
    },
    {
      id: "EX2024002",
      matiere: "Algorithmique Avancee",
      code: "ALGO401",
      niveau: "M1",
      filiere: "Genie Logiciel",
      groupes: ["GL1", "GL2"],
      professeur: "Pr. Salima Mansouri",
      date: "2026-06-22",
      heureDebut: "14:00",
      heureFin: "16:00",
      duree: 2,
      statut: "Planifie"
    }
  ];
};

// Générer 48 salles : 4 etages x 12 salles
const generateMockRooms = () => {
  const rooms = [];
  const etages = ["1er etage", "2eme etage", "3eme etage", "4eme etage"];
  
  for (let e = 0; e < etages.length; e++) {
    for (let s = 1; s <= 12; s++) {
      const capacite = Math.floor(Math.random() * (22 - 16 + 1)) + 16;
      const numSalle = s < 10 ? `0${s}` : `${s}`;
      
      rooms.push({
        id: `E${e + 1}_S${numSalle}`,
        nom: `${etages[e]} - Salle ${numSalle}`,
        etage: etages[e],
        numero: numSalle,
        capacite: capacite,
        estOccupee: false,
        examenId: null,
        dateOccupation: null,
        horaireOccupation: null,
        seatLayout: null
      });
    }
  }
  return rooms;
};

// Données mockees des etudiants
const generateMockStudents = () => {
  const students = [];
  const firstNames = ["Ahmed", "Sofia", "Yassine", "Nadia", "Karim", "Leila", "Oussama", "Amira", "Mohamed", "Ines"];
  const lastNames = ["Ben Ali", "Touati", "Khelil", "Mansouri", "Bennour", "Saidi", "Hamdi", "Chenini"];
  
  // L3 Informatique - 68 etudiants
  for (let i = 1; i <= 68; i++) {
    students.push({
      id: `2025${String(i).padStart(4, '0')}`,
      nom: lastNames[i % lastNames.length],
      prenom: firstNames[i % firstNames.length],
      email: `etudiant${i}@univ.tn`,
      niveau: "L3",
      filiere: "Informatique",
      groupe: `INFO${Math.floor(Math.random() * 3) + 1}`,
      photo: null
    });
  }
  
  // M1 Genie Logiciel - 45 etudiants
  for (let i = 69; i <= 114; i++) {
    students.push({
      id: `2025${String(i).padStart(4, '0')}`,
      nom: lastNames[(i + 2) % lastNames.length],
      prenom: firstNames[(i + 3) % firstNames.length],
      email: `etudiant${i}@univ.tn`,
      niveau: "M1",
      filiere: "Genie Logiciel",
      groupe: `GL${Math.floor(Math.random() * 2) + 1}`,
      photo: null
    });
  }
  
  return students;
};

// Liste des enseignants pour la surveillance
const supervisors = [
  { id: 1, nom: "Dr. Karim Benali", email: "karim.benali@univ.tn" },
  { id: 2, nom: "Pr. Salima Mansouri", email: "salima.mansouri@univ.tn" },
  { id: 3, nom: "Dr. Amine Touati", email: "amine.touati@univ.tn" },
  { id: 4, nom: "Pr. Nadia Khelil", email: "nadia.khelil@univ.tn" },
  { id: 5, nom: "Dr. Sofiene Marzouk", email: "sofiene.marzouk@univ.tn" },
  { id: 6, nom: "Pr. Hichem Jaouadi", email: "hichem.jaouadi@univ.tn" }
];

export default function AffectationPlacesPage() {
  const [exams, setExams] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  
  // Etats de selection
  const [selectedExam, setSelectedExam] = useState(null);
  const [autoAssignedRooms, setAutoAssignedRooms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  
  // Etats d'affectation
  const [assignments, setAssignments] = useState({});
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  
  // Filtres
  const [searchExam, setSearchExam] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("");
  
  // Etape actuelle
  const [currentStep, setCurrentStep] = useState(1);
  const [validationMessage, setValidationMessage] = useState(null);
  
  // Initialisation
  useEffect(() => {
    const savedRooms = localStorage.getItem("rooms_occupation");
    const savedNotifications = localStorage.getItem("teacher_notifications");
    
    setTimeout(() => {
      const mockStudents = generateMockStudents();
      const mockExams = generateMockExams();
      let mockRooms = generateMockRooms();
      
      if (savedRooms) {
        mockRooms = JSON.parse(savedRooms);
      }
      
      setAllStudents(mockStudents);
      setExams(mockExams);
      setRooms(mockRooms);
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      
      setLoading(false);
    }, 500);
  }, []);
  
  // Récupérer la disposition des sièges depuis la salle configurée
  const getRoomSeatLayout = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.seatLayout || null;
  };
  
  // Obtenir la liste des enseignants disponibles (non déjà assignés)
  const getAvailableSupervisors = (currentRoomId) => {
    // Enseignants déjà assignés à d'autres salles (sauf la salle courante)
    const assignedToOtherRooms = Object.entries(selectedSupervisors)
      .filter(([id, name]) => id !== currentRoomId && name)
      .map(([, name]) => name);
    
    // Filtrer les enseignants déjà pris
    return supervisors.filter(s => !assignedToOtherRooms.includes(s.nom));
  };
  
  // Sauvegarder une notification
  const saveNotification = (notification) => {
    const updated = [notification, ...notifications];
    setNotifications(updated);
    localStorage.setItem("teacher_notifications", JSON.stringify(updated));
    
    setLastNotification(notification);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 5000);
  };
  
  // Envoyer une notification a l'enseignant
  const sendNotificationToTeacher = (teacherName, examDetails, roomsList) => {
    const notification = {
      id: `NOTIF_${Date.now()}_${Math.random()}`,
      enseignant: teacherName,
      type: "affectation_examen",
      titre: "Nouvelle affectation d'examen",
      message: `Vous avez ete designe comme surveillant pour l'examen : ${examDetails.matiere}`,
      details: {
        examenId: examDetails.id,
        matiere: examDetails.matiere,
        code: examDetails.code,
        niveau: examDetails.niveau,
        filiere: examDetails.filiere,
        groupes: examDetails.groupes,
        date: examDetails.date,
        heureDebut: examDetails.heureDebut,
        heureFin: examDetails.heureFin,
        duree: examDetails.duree,
        salles: roomsList.map(room => ({
          id: room.id,
          nom: room.nom,
          etage: room.etage,
          capacite: room.capacite
        }))
      },
      dateEnvoi: new Date().toISOString(),
      lu: false
    };
    
    saveNotification(notification);
  };
  
  // Filtrer les salles disponibles selon la date et l'horaire
  const getAvailableRooms = (examDate, examStartTime, examEndTime) => {
    return rooms.filter(room => {
      if (!room.estOccupee) return true;
      
      if (room.dateOccupation === examDate) {
        const existingStart = room.horaireOccupation?.debut;
        const existingEnd = room.horaireOccupation?.fin;
        
        if (existingStart && existingEnd) {
          const conflict = (examStartTime < existingEnd && examEndTime > existingStart);
          return !conflict;
        }
      }
      return true;
    });
  };
  
  // Calcul automatique des salles necessaires
  const calculateRequiredRooms = (studentCount, examDate, examStartTime, examEndTime) => {
    const availableRooms = getAvailableRooms(examDate, examStartTime, examEndTime);
    
    if (availableRooms.length === 0) {
      alert(`Aucune salle disponible pour le ${examDate} de ${examStartTime} a ${examEndTime}. Veuillez modifier la date ou l'horaire de l'examen.`);
      return { rooms: [], totalCapacity: 0, remainingSeats: 0, available: false };
    }
    
    const sortedRooms = [...availableRooms].sort((a, b) => b.capacite - a.capacite);
    const selectedRoomsList = [];
    let totalCapacity = 0;
    
    for (let room of sortedRooms) {
      if (totalCapacity < studentCount) {
        selectedRoomsList.push(room);
        totalCapacity += room.capacite;
      } else {
        break;
      }
    }
    
    if (totalCapacity < studentCount) {
      alert(`Capacite insuffisante ! Etudiants a placer: ${studentCount} / Capacite disponible: ${totalCapacity}`);
      return { rooms: [], totalCapacity: 0, remainingSeats: 0, available: false };
    }
    
    return { 
      rooms: selectedRoomsList, 
      totalCapacity, 
      remainingSeats: totalCapacity - studentCount,
      available: true 
    };
  };
  
  // Selectionner un examen
  const handleSelectExam = (exam) => {
    let studentsForExam = allStudents.filter(s => 
      s.niveau === exam.niveau && 
      s.filiere === exam.filiere
    );
    
    if (exam.groupes && exam.groupes.length > 0) {
      studentsForExam = studentsForExam.filter(s => 
        exam.groupes.includes(s.groupe)
      );
    }
    
    const totalCount = studentsForExam.length;
    
    if (totalCount === 0) {
      alert(`Aucun etudiant inscrit pour ${exam.niveau} ${exam.filiere}`);
      return;
    }
    
    const { rooms: calculatedRooms, available } = 
      calculateRequiredRooms(totalCount, exam.date, exam.heureDebut, exam.heureFin);
    
    if (!available) return;
    
    setSelectedExam({
      ...exam,
      nbrEtudiants: totalCount
    });
    setFilteredStudents(studentsForExam);
    setTotalStudentsCount(totalCount);
    setAutoAssignedRooms(calculatedRooms);
    
    setCurrentStep(2);
  };
  
  // Marquer les salles comme occupees
  const markRoomsAsOccupied = (roomsList, exam) => {
    const updatedRooms = rooms.map(room => {
      const isSelected = roomsList.find(r => r.id === room.id);
      if (isSelected) {
        return {
          ...room,
          estOccupee: true,
          examenId: exam.id,
          dateOccupation: exam.date,
          horaireOccupation: { debut: exam.heureDebut, fin: exam.heureFin }
        };
      }
      return room;
    });
    
    setRooms(updatedRooms);
    localStorage.setItem("rooms_occupation", JSON.stringify(updatedRooms));
  };
  
  // Affectation automatique
  const autoAssign = () => {
    if (!selectedExam) return;
    
    const studentsToAssign = [...filteredStudents];
    const newAssignments = {};
    let studentIdx = 0;
    
    for (let room of autoAssignedRooms) {
      const seatLayout = getRoomSeatLayout(room.id);
      if (!seatLayout || !seatLayout.seats) continue;
      
      for (let seat of seatLayout.seats) {
        if (studentIdx < studentsToAssign.length) {
          const student = studentsToAssign[studentIdx];
          newAssignments[`${room.id}_${seat.id}`] = {
            studentId: student.id,
            studentName: `${student.prenom} ${student.nom}`,
            studentEmail: student.email,
            niveau: student.niveau,
            filiere: student.filiere,
            groupe: student.groupe,
            roomId: room.id,
            seatId: seat.id,
            assignedAt: new Date().toISOString()
          };
          studentIdx++;
        }
      }
    }
    
    setAssignments(newAssignments);
    
    const remaining = filteredStudents.length - studentIdx;
    if (remaining > 0) {
      alert(`${remaining} etudiant(s) n'ont pas pu etre places.`);
    }
  };
  
  // Drag & Drop
  const handleDragStart = (student) => {
    setDraggedStudent(student);
  };
  
  const handleDrop = (roomId, seatId) => {
    if (!draggedStudent) return;
    
    const assignmentKey = `${roomId}_${seatId}`;
    if (assignments[assignmentKey]) {
      alert("Ce siege est deja occupe !");
      return;
    }
    
    if (draggedStudent.niveau !== selectedExam.niveau || 
        draggedStudent.filiere !== selectedExam.filiere) {
      alert("Cet etudiant n'est pas autorise a passer cet examen.");
      return;
    }
    
    if (selectedExam.groupes && selectedExam.groupes.length > 0 && 
        !selectedExam.groupes.includes(draggedStudent.groupe)) {
      alert(`Le groupe ${draggedStudent.groupe} ne participe pas a cet examen.`);
      return;
    }
    
    const newAssignment = {
      studentId: draggedStudent.id,
      studentName: `${draggedStudent.prenom} ${draggedStudent.nom}`,
      studentEmail: draggedStudent.email,
      niveau: draggedStudent.niveau,
      filiere: draggedStudent.filiere,
      groupe: draggedStudent.groupe,
      roomId,
      seatId,
      assignedAt: new Date().toISOString()
    };
    
    setAssignments({
      ...assignments,
      [assignmentKey]: newAssignment
    });
    
    setDraggedStudent(null);
  };
  
  // Supprimer une affectation
  const removeAssignment = (roomId, seatId) => {
    const newAssignments = { ...assignments };
    delete newAssignments[`${roomId}_${seatId}`];
    setAssignments(newAssignments);
  };
  
  // Valider l'affectation
  const validateAssignment = () => {
    const totalAssigned = Object.keys(assignments).length;
    
    if (totalAssigned !== selectedExam.nbrEtudiants) {
      alert(`Nombre d'etudiants affectes incorrect ! Total: ${selectedExam.nbrEtudiants} / Affectes: ${totalAssigned}`);
      return;
    }
    
    const missingSupervisors = autoAssignedRooms.filter(room => !selectedSupervisors[room.id]);
    if (missingSupervisors.length > 0) {
      alert(`Veuillez assigner un surveillant pour chaque salle !`);
      return;
    }
    
    // 1. Marquer les salles comme occupees
    markRoomsAsOccupied(autoAssignedRooms, selectedExam);
    
    // 2. Envoyer les notifications aux enseignants surveillants
    const uniqueSupervisors = [...new Set(Object.values(selectedSupervisors))];
    uniqueSupervisors.forEach(supervisorName => {
      const supervisorRooms = autoAssignedRooms.filter(room => selectedSupervisors[room.id] === supervisorName);
      sendNotificationToTeacher(supervisorName, selectedExam, supervisorRooms);
    });
    
    // 3. Mettre a jour le statut de l'examen
    const updatedExams = exams.map(exam => 
      exam.id === selectedExam.id ? { ...exam, statut: "Affecte" } : exam
    );
    setExams(updatedExams);
    
    // 4. Afficher le resume
    alert(`✅ Affectation validee avec succes !\n\n` +
           `Resume:\n` +
           `- Examen: ${selectedExam.matiere}\n` +
           `- Date: ${selectedExam.date}\n` +
           `- Horaire: ${selectedExam.heureDebut} - ${selectedExam.heureFin}\n` +
           `- Salles utilisees: ${autoAssignedRooms.length}\n` +
           `- Etudiants affectes: ${totalAssigned}\n` +
           `- Enseignants notifies: ${uniqueSupervisors.length}\n\n` +
           `🔒 Les salles sont maintenant marquees comme occupees.`);
  };
  
  // Reinitialiser
  const reset = () => {
    setSelectedExam(null);
    setAutoAssignedRooms([]);
    setAssignments({});
    setSelectedSupervisors({});
    setFilteredStudents([]);
    setTotalStudentsCount(0);
    setCurrentStep(1);
    setValidationMessage(null);
  };
  
  // Filtrer les examens
  const filteredExams = exams.filter(exam => {
    if (searchExam && !exam.matiere.toLowerCase().includes(searchExam.toLowerCase()) && 
        !exam.code.toLowerCase().includes(searchExam.toLowerCase())) return false;
    if (filterNiveau && exam.niveau !== filterNiveau) return false;
    if (filterFiliere && exam.filiere !== filterFiliere) return false;
    return true;
  });
  
  const uniqueNiveaux = [...new Set(exams.map(e => e.niveau))];
  const uniqueFilieres = [...new Set(exams.map(e => e.filiere))];
  
  const totalCapacity = autoAssignedRooms.reduce((sum, r) => sum + (r.capacite || 0), 0);
  const remainingSeats = totalCapacity - totalStudentsCount;
  const placedCount = Object.keys(assignments).length;
  
  if (loading) {
    return (
      <div className="affectation-page loading">
        <div className="spinner"></div>
        <p>Chargement des salles...</p>
      </div>
    );
  }
  
  return (
    <div className="affectation-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Toast de notification */}
      {showNotificationToast && lastNotification && (
        <div className="notification-toast">
          <div className="toast-icon"><i className="fas fa-envelope"></i></div>
          <div className="toast-content">
            <div className="toast-title">Notification envoyee</div>
            <div className="toast-message">A {lastNotification.enseignant} : {lastNotification.titre}</div>
          </div>
          <button className="toast-close" onClick={() => setShowNotificationToast(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="aff-header">
        <div>
          <h1><i className="fas fa-chair"></i> Affectation des places</h1>
          <p>Selectionnez un examen → affectation automatique des salles → placement des etudiants</p>
        </div>
        {currentStep === 2 && (
          <button className="aff-reset-btn" onClick={reset}>
            <i className="fas fa-undo"></i> Nouvelle affectation
          </button>
        )}
      </div>
      
      {/* Progress Steps */}
      <div className="aff-steps">
        <div className={`aff-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "done" : ""}`}>
          <div className="aff-step-num">{currentStep > 1 ? "✓" : "1"}</div>
          <div className="aff-step-label">Selection examen</div>
        </div>
        <div className={`aff-step-line ${currentStep > 1 ? "done" : ""}`}></div>
        <div className={`aff-step ${currentStep >= 2 ? "active" : ""}`}>
          <div className="aff-step-num">2</div>
          <div className="aff-step-label">Affectation des places</div>
        </div>
      </div>
      
      {/* Etape 1 : Selection examen */}
      {currentStep === 1 && (
        <div className="aff-panel">
          <div className="aff-panel-title">
            <i className="fas fa-calendar-alt"></i>
            Examens planifies
          </div>
          
          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Rechercher par matiere ou code..." value={searchExam} onChange={(e) => setSearchExam(e.target.value)} />
            </div>
            <select value={filterNiveau} onChange={(e) => setFilterNiveau(e.target.value)}>
              <option value="">Tous les niveaux</option>
              {uniqueNiveaux.map(n => <option key={n}>{n}</option>)}
            </select>
            <select value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
              <option value="">Toutes les filieres</option>
              {uniqueFilieres.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          
          <div className="exams-grid">
            {filteredExams.map(exam => (
              <div key={exam.id} className="exam-card" onClick={() => handleSelectExam(exam)}>
                <div className="exam-card-header">
                  <span className="exam-code">{exam.code}</span>
                  <span className="exam-status">Planifie</span>
                </div>
                <h3 className="exam-title">{exam.matiere}</h3>
                <div className="exam-details">
                  <div className="exam-detail"><i className="fas fa-layer-group"></i><span>{exam.niveau}</span></div>
                  <div className="exam-detail"><i className="fas fa-chalkboard-user"></i><span>{exam.filiere}</span></div>
                  <div className="exam-detail"><i className="fas fa-users"></i><span>{exam.groupes?.join(", ")}</span></div>
                  <div className="exam-detail"><i className="fas fa-calendar-alt"></i><span>{exam.date}</span></div>
                  <div className="exam-detail"><i className="fas fa-clock"></i><span>{exam.heureDebut} - {exam.heureFin}</span></div>
                </div>
                <div className="exam-card-footer">
                  <div className="prof-info"><i className="fas fa-user-tie"></i><span>{exam.professeur}</span></div>
                  <div className="select-indicator"><i className="fas fa-chevron-right"></i> Selectionner</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Etape 2 : Affectation */}
      {currentStep === 2 && selectedExam && (
        <div className="aff-panel">
          <div className="aff-panel-title">
            <i className="fas fa-user-graduate"></i>
            Affectation des places - {selectedExam.matiere}
          </div>
          
          {/* Resume */}
          <div className="summary-banner">
            <div className="exam-summary">
              <h3><i className="fas fa-calendar-alt"></i> {selectedExam.matiere}</h3>
              <div className="exam-meta">
                <span><i className="fas fa-layer-group"></i> {selectedExam.niveau}</span>
                <span><i className="fas fa-chalkboard-user"></i> {selectedExam.filiere}</span>
                <span><i className="fas fa-calendar-day"></i> {selectedExam.date}</span>
                <span><i className="fas fa-clock"></i> {selectedExam.heureDebut} - {selectedExam.heureFin}</span>
              </div>
            </div>
            <div className="students-summary">
              <div className="student-count"><i className="fas fa-user-graduate"></i><span className="count">{totalStudentsCount}</span><span>etudiants</span></div>
              <div className="rooms-count"><i className="fas fa-door-open"></i><span className="count">{autoAssignedRooms.length}</span><span>salles</span></div>
              <div className="capacity-info"><i className="fas fa-chair"></i><span className="count">{totalCapacity}</span><span>places</span><span className={`remaining ${remainingSeats >= 0 ? 'positive' : 'negative'}`}>({remainingSeats >= 0 ? `${remainingSeats} restantes` : `${Math.abs(remainingSeats)} manquantes`})</span></div>
            </div>
          </div>
          
          {/* Information etudiants */}
          <div className="students-info-card">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Recuperation automatique des etudiants</strong>
              <p>{totalStudentsCount} etudiants de {selectedExam.niveau} {selectedExam.filiere}</p>
            </div>
          </div>
          
          {/* Salles selectionnees */}
          <div className="rooms-summary">
            <h3><i className="fas fa-building"></i> Salles selectionnees ({autoAssignedRooms.length})</h3>
            <div className="etages-rooms">
              {["1er etage", "2eme etage", "3eme etage", "4eme etage"].map(etage => {
                const sallesEtage = autoAssignedRooms.filter(r => r.etage === etage);
                if (sallesEtage.length === 0) return null;
                return (
                  <div key={etage} className="etage-group">
                    <div className="etage-title"><i className="fas fa-arrow-up"></i> {etage}</div>
                    <div className="etage-rooms-list">
                      {sallesEtage.map(room => (
                        <div key={room.id} className="etage-room-badge">
                          <i className="fas fa-door-open"></i> {room.nom} ({room.capacite} places)
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Surveillants avec suppression de la liste */}
          <div className="supervisors-section">
            <h3><i className="fas fa-chalkboard-user"></i> Assignation des surveillants</h3>
            <div className="supervisors-info">
              <i className="fas fa-info-circle"></i> Un enseignant ne peut pas surveiller deux salles en même temps
            </div>
            <div className="supervisors-grid">
              {autoAssignedRooms.map(room => {
                const availableSupervisors = getAvailableSupervisors(room.id);
                const currentValue = selectedSupervisors[room.id] || "";
                
                return (
                  <div key={room.id} className="supervisor-card">
                    <div className="room-name">
                      <i className="fas fa-door-open"></i> {room.nom}
                      <span className="capacity-badge">{room.capacite} places</span>
                      <span className="etage-badge">{room.etage}</span>
                    </div>
                    <select 
                      value={currentValue} 
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setSelectedSupervisors(prev => ({
                          ...prev,
                          [room.id]: newValue
                        }));
                      }}
                    >
                      <option value="">-- Selectionner --</option>
                      {availableSupervisors.map(s => (
                        <option key={s.id} value={s.nom}>{s.nom}</option>
                      ))}
                      {/* Si l'enseignant actuel n'est plus disponible, le montrer quand même */}
                      {currentValue && !availableSupervisors.find(s => s.nom === currentValue) && (
                        <option value={currentValue} disabled>{currentValue} (déjà assigné)</option>
                      )}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Affectation */}
          <div className="affectation-layout">
            <div className="students-list">
              <div className="students-header">
                <h3><i className="fas fa-users"></i> Etudiants ({filteredStudents.length})</h3>
                <button className="btn-auto-assign" onClick={autoAssign}><i className="fas fa-magic"></i> Auto</button>
              </div>
              <div className="students-stats-summary">
                <div className="stat-badge"><i className="fas fa-user-graduate"></i><span>Total: {filteredStudents.length}</span></div>
                <div className="stat-badge"><i className="fas fa-check-circle"></i><span>Places: {placedCount}</span></div>
                <div className="stat-badge"><i className="fas fa-hourglass-half"></i><span>Restants: {filteredStudents.length - placedCount}</span></div>
              </div>
              <div className="students-scroll">
                {filteredStudents.filter(s => !Object.values(assignments).some(a => a.studentId === s.id)).map(student => (
                  <div key={student.id} className="student-card" draggable onDragStart={() => handleDragStart(student)}>
                    <div className="student-avatar"><i className="fas fa-user-graduate"></i></div>
                    <div className="student-info">
                      <div className="student-name">{student.prenom} {student.nom}</div>
                      <div className="student-details"><span><i className="fas fa-id-card"></i> {student.id}</span><span><i className="fas fa-users"></i> {student.groupe}</span></div>
                    </div>
                    <div className="drag-handle"><i className="fas fa-grip-vertical"></i></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rooms-plan">
              <div className="rooms-plan-header">
                <h3><i className="fas fa-building"></i> Plan des salles</h3>
                <div className="drag-instruction"><i className="fas fa-arrows-alt"></i> Glissez un etudiant</div>
              </div>
              <div className="rooms-container">
                {["1er etage", "2eme etage", "3eme etage", "4eme etage"].map(etage => {
                  const sallesEtage = autoAssignedRooms.filter(r => r.etage === etage);
                  if (sallesEtage.length === 0) return null;
                  return (
                    <div key={etage} className="etage-plan">
                      <div className="etage-plan-header">
                        <h4><i className="fas fa-building"></i> {etage}</h4>
                        <span className="rooms-count-badge">{sallesEtage.length} salle(s)</span>
                      </div>
                      {sallesEtage.map(room => {
                        const seatLayout = getRoomSeatLayout(room.id);
                        
                        if (!seatLayout || !seatLayout.seats || seatLayout.seats.length === 0) {
                          return (
                            <div key={room.id} className="room-plan">
                              <div className="room-plan-header">
                                <h4><i className="fas fa-door-open"></i> {room.nom}</h4>
                                <div className="room-supervisor">
                                  <i className="fas fa-chalkboard-user"></i>
                                  {selectedSupervisors[room.id] || "Surveillant non assigné"}
                                </div>
                              </div>
                              <div className="no-layout-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p>Plan non configuré pour cette salle</p>
                                <small>Veuillez configurer le plan dans Gestion des salles</small>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={room.id} className="room-plan">
                            <div className="room-plan-header">
                              <h4><i className="fas fa-door-open"></i> {room.nom}</h4>
                              <div className="room-supervisor">
                                <i className="fas fa-chalkboard-user"></i>
                                {selectedSupervisors[room.id] || "Surveillant non assigné"}
                              </div>
                            </div>
                            
                            <div className="seats-grid" style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${seatLayout.cols || 4}, 1fr)`,
                              gap: '10px'
                            }}>
                              {seatLayout.seats.map(seat => {
                                const assignment = assignments[`${room.id}_${seat.id}`];
                                const isOccupied = !!assignment;
                                
                                return (
                                  <div
                                    key={seat.id}
                                    className={`seat ${isOccupied ? "occupied" : "empty"}`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(room.id, seat.id)}
                                  >
                                    {isOccupied ? (
                                      <div className="seat-content occupied">
                                        <div className="seat-label">{seat.id}</div>
                                        <div className="student-info-seat">
                                          <div className="student-name-seat">{assignment?.studentName}</div>
                                          <div className="student-id-seat">{assignment?.studentId}</div>
                                          <div className="student-group-seat">{assignment?.groupe}</div>
                                        </div>
                                        <button 
                                          className="remove-student" 
                                          onClick={() => removeAssignment(room.id, seat.id)}
                                          title="Retirer l'étudiant"
                                        >
                                          <i className="fas fa-times"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="seat-content empty">
                                        <div className="seat-label">{seat.id}</div>
                                        <div className="drop-zone">
                                          <i className="fas fa-arrow-down"></i>
                                          <span>Déposer</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="room-footer">
                              <div className="room-stat">
                                <i className="fas fa-chair"></i> 
                                Occupés: {seatLayout.seats.filter(s => assignments[`${room.id}_${s.id}`]).length} / {seatLayout.capacity}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="validation-section">
            <button className="btn-validate" onClick={validateAssignment}><i className="fas fa-check-circle"></i> Valider l'affectation</button>
          </div>
        </div>
      )}
    </div>
  );
}