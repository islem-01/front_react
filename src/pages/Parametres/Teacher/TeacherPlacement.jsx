import React, { useState, useEffect } from 'react';

export default function TeacherPlacement({ user }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [roomLayout, setRoomLayout] = useState(null);
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [studentsPresence, setStudentsPresence] = useState({});

  // Examens disponibles (avec les salles associées)
  const exams = [
    { id: 1, matiere: "Algorithmique Avancée", date: "15/06/2026", salleId: "E1_S01", salle: "Salle A12", etage: "1er étage", horaire: "08:30-10:30" },
    { id: 2, matiere: "Base de données", date: "20/06/2026", salleId: "E2_S05", salle: "Salle B05", etage: "2ème étage", horaire: "11:00-13:00" },
    { id: 3, matiere: "Java Avancé", date: "28/06/2026", salleId: "E3_S08", salle: "Salle C03", etage: "3ème étage", horaire: "09:00-11:00" }
  ];

  // Données des étudiants par siège (à remplacer par API)
  const studentsData = {
    "A1": { id: "20240001", name: "Ahmed Ben Ali", groupe: "G1", email: "ahmed.benali@iit.tn" },
    "A2": { id: "20240002", name: "Sofia Touati", groupe: "G1", email: "sofia.touati@iit.tn" },
    "A3": { id: "20240003", name: "Karim Dridi", groupe: "G1", email: "karim.dridi@iit.tn" },
    "A4": { id: "20240004", name: "Leila Hamdi", groupe: "G1", email: "leila.hamdi@iit.tn" },
    "A5": { id: "20240005", name: "Mohamed Salah", groupe: "G1", email: "mohamed.salah@iit.tn" },
    "A6": { id: "20240006", name: "Nadia Ben Ali", groupe: "G1", email: "nadia.benali@iit.tn" },
    "B1": { id: "20240007", name: "Yassine Khelil", groupe: "G2", email: "yassine.khelil@iit.tn" },
    "B2": { id: "20240008", name: "Ines Mansouri", groupe: "G2", email: "ines.mansouri@iit.tn" },
    "B3": { id: "20240009", name: "Hichem Jaouadi", groupe: "G2", email: "hichem.jaouadi@iit.tn" },
    "B4": { id: "20240010", name: "Fatima Zahra", groupe: "G2", email: "fatima.zahra@iit.tn" },
    "B5": { id: "20240011", name: "Rami Ferchichi", groupe: "G2", email: "rami.ferchichi@iit.tn" },
    "B6": { id: "20240012", name: "Syrine Ayari", groupe: "G2", email: "syrine.ayari@iit.tn" },
    "C1": { id: "20240013", name: "Wassim Marzouk", groupe: "G3", email: "wassim.marzouk@iit.tn" },
    "C2": { id: "20240014", name: "Nour Bouaziz", groupe: "G3", email: "nour.bouaziz@iit.tn" },
    "C3": { id: "20240015", name: "Fares Ayari", groupe: "G3", email: "fares.ayari@iit.tn" },
    "C4": { id: "20240016", name: "Eya Dridi", groupe: "G3", email: "eya.dridi@iit.tn" },
    "C5": { id: "20240017", name: "Omar Ben Hassine", groupe: "G3", email: "omar.benhassine@iit.tn" },
    "C6": { id: "20240018", name: "Salma Trabelsi", groupe: "G3", email: "salma.trabelsi@iit.tn" }
  };

  // Initialiser les présences depuis localStorage ou par défaut
  useEffect(() => {
    const savedPresence = localStorage.getItem('teacher_presence');
    if (savedPresence) {
      setStudentsPresence(JSON.parse(savedPresence));
    } else {
      // Par défaut, tous les étudiants sont absents
      const initialPresence = {};
      Object.keys(studentsData).forEach(seatId => {
        initialPresence[seatId] = false;
      });
      setStudentsPresence(initialPresence);
    }
  }, []);

  // Récupérer le layout de la salle depuis localStorage (créé par l'admin dans RoomDesigner2D)
  const loadRoomLayout = (salleId) => {
    setLoadingLayout(true);
    const savedLayout = localStorage.getItem(`room_layout_${salleId}`);
    if (savedLayout) {
      setRoomLayout(JSON.parse(savedLayout));
    } else {
      // Layout par défaut si non configuré
      const defaultLayout = {
        seats: [
          { id: "A1", row: "A", col: 1 }, { id: "A2", row: "A", col: 2 }, { id: "A3", row: "A", col: 3 }, { id: "A4", row: "A", col: 4 }, { id: "A5", row: "A", col: 5 }, { id: "A6", row: "A", col: 6 },
          { id: "B1", row: "B", col: 1 }, { id: "B2", row: "B", col: 2 }, { id: "B3", row: "B", col: 3 }, { id: "B4", row: "B", col: 4 }, { id: "B5", row: "B", col: 5 }, { id: "B6", row: "B", col: 6 },
          { id: "C1", row: "C", col: 1 }, { id: "C2", row: "C", col: 2 }, { id: "C3", row: "C", col: 3 }, { id: "C4", row: "C", col: 4 }, { id: "C5", row: "C", col: 5 }, { id: "C6", row: "C", col: 6 }
        ],
        cols: 6,
        rows: 3,
        capacity: 18
      };
      setRoomLayout(defaultLayout);
    }
    setLoadingLayout(false);
  };

  // Sélectionner un examen
  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setSelectedSeat(null);
    setSelectedStudent(null);
    loadRoomLayout(exam.salleId);
  };

  // Obtenir l'étudiant d'un siège
  const getStudentAtSeat = (seatId) => {
    const student = studentsData[seatId];
    if (student) {
      return {
        ...student,
        seatId: seatId,
        present: studentsPresence[seatId] || false
      };
    }
    return { id: "", name: "Place libre", groupe: "", email: "", present: false, seatId: seatId };
  };

  // Changer le statut de présence
  const togglePresence = (seatId) => {
    const newPresence = !studentsPresence[seatId];
    setStudentsPresence(prev => ({
      ...prev,
      [seatId]: newPresence
    }));
    
    // Mettre à jour l'étudiant sélectionné
    if (selectedStudent && selectedStudent.seatId === seatId) {
      setSelectedStudent(prev => ({
        ...prev,
        present: newPresence
      }));
    }
  };

  // Clic sur un siège
  const handleSeatClick = (seat) => {
    const student = getStudentAtSeat(seat.id);
    setSelectedSeat(seat.id);
    setSelectedStudent(student);
  };

  // Sauvegarder les présences et envoyer à l'admin
  const handleSave = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem('teacher_presence', JSON.stringify(studentsPresence));
    
    // Préparer le rapport à envoyer à l'admin
    const presenceReport = {
      examen: selectedExam?.matiere,
      date: selectedExam?.date,
      salle: selectedExam?.salle,
      horaire: selectedExam?.horaire,
      enseignant: user?.name || "Dr. Amine Ben Ali",
      timestamp: new Date().toISOString(),
      presence: studentsPresence,
      details: Object.entries(studentsPresence).map(([seatId, present]) => ({
        seatId,
        etudiant: studentsData[seatId]?.name || "Inconnu",
        idEtudiant: studentsData[seatId]?.id || "",
        groupe: studentsData[seatId]?.groupe || "",
        present: present
      }))
    };
    
    // Sauvegarder le rapport dans localStorage pour l'admin
    const reports = JSON.parse(localStorage.getItem('presence_reports') || '[]');
    reports.unshift(presenceReport);
    localStorage.setItem('presence_reports', JSON.stringify(reports.slice(0, 50)));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    console.log("Rapport de présence envoyé à l'admin:", presenceReport);
  };

  // Statistiques
  const placedCount = Object.values(studentsPresence).filter(p => p === true).length;
  const totalSeats = Object.keys(studentsData).length;
  const presenceRate = totalSeats > 0 ? Math.round((placedCount / totalSeats) * 100) : 0;

  return (
    <div className="teacher-placement" style={{ padding: '0' }}>
      
      {/* Toast de succès */}
      {saveSuccess && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <i className="fas fa-check-circle"></i> Présences enregistrées ! Rapport envoyé à l'administrateur.
        </div>
      )}

      {/* Sélection de l'examen */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><i className="fas fa-chalkboard"></i> Sélectionner un examen</h3>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {exams.map(exam => (
            <button
              key={exam.id}
              onClick={() => handleSelectExam(exam)}
              style={{
                flex: 1,
                padding: '16px',
                background: selectedExam?.id === exam.id ? '#4f46e5' : 'white',
                border: selectedExam?.id === exam.id ? 'none' : '1px solid #eef2f6',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                color: selectedExam?.id === exam.id ? 'white' : '#1f2937',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 700 }}>{exam.matiere}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{exam.salle} · {exam.etage} · {exam.date} · {exam.horaire}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedExam && (
        <>
          {/* Statistiques de présence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon green"><i className="fas fa-user-check"></i></div>
              <div className="stat-info">
                <div className="stat-value">{placedCount}</div>
                <div className="stat-label">Présents</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><i className="fas fa-user-times"></i></div>
              <div className="stat-info">
                <div className="stat-value">{totalSeats - placedCount}</div>
                <div className="stat-label">Absents</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><i className="fas fa-users"></i></div>
              <div className="stat-info">
                <div className="stat-value">{totalSeats}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><i className="fas fa-chart-line"></i></div>
              <div className="stat-info">
                <div className="stat-value">{presenceRate}%</div>
                <div className="stat-label">Taux de présence</div>
              </div>
            </div>
          </div>

          {/* Layout: Plan de salle à gauche + Détails étudiant à droite */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            
            {/* Plan de la salle - gauche (récupéré du Room Designer) */}
            <div className="dashboard-section" style={{ flex: 2, minWidth: '300px' }}>
              <div className="section-header">
                <h3><i className="fas fa-building"></i> Plan de la salle - {selectedExam.salle}</h3>
                <div className="legend" style={{ display: 'flex', gap: '20px' }}>
                  <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#10b981', borderRadius: '3px', marginRight: '6px' }}></span> Présent</span>
                  <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px', marginRight: '6px' }}></span> Absent</span>
                  <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#4f46e5', borderRadius: '3px', marginRight: '6px' }}></span> Sélectionné</span>
                </div>
              </div>

              {loadingLayout ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <i className="fas fa-spinner fa-pulse" style={{ fontSize: '32px', color: '#4f46e5' }}></i>
                  <p style={{ marginTop: '16px', color: '#64748b' }}>Chargement du plan...</p>
                </div>
              ) : roomLayout ? (
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${roomLayout.cols}, minmax(90px, 1fr))`,
                    gap: '12px',
                    minWidth: '500px'
                  }}>
                    {roomLayout.seats.map(seat => {
                      const student = studentsData[seat.id];
                      const isPresent = studentsPresence[seat.id] || false;
                      const isSelected = selectedSeat === seat.id;
                      const studentName = student?.name || "Libre";
                      
                      return (
                        <div 
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          style={{
                            background: isPresent ? '#ecfdf5' : '#fef2f2',
                            border: `2px solid ${isSelected ? '#4f46e5' : isPresent ? '#a7f3d0' : '#fecaca'}`,
                            borderRadius: '12px',
                            padding: '12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 4px 12px rgba(79,70,229,0.2)' : 'none'
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: '#1f2937' }}>{seat.id}</div>
                          <div style={{ fontSize: '11px', fontWeight: 500, marginBottom: '4px', color: '#4b5563' }}>{studentName}</div>
                          <div style={{ 
                            fontSize: '9px', 
                            color: isPresent ? '#10b981' : '#ef4444', 
                            fontWeight: 600,
                            background: isPresent ? '#d1fae5' : '#fee2e2',
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '20px'
                          }}>
                            {isPresent ? 'PRÉSENT' : 'ABSENT'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '16px' }}>
                  <i className="fas fa-door-closed" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
                  <h3 style={{ fontSize: '16px', color: '#64748b' }}>Plan non configuré</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    L'administrateur n'a pas encore configuré le plan de cette salle.
                  </p>
                </div>
              )}
            </div>

            {/* Panneau détails étudiant - droite */}
            <div className="dashboard-section" style={{ flex: 1, minWidth: '280px' }}>
              {selectedStudent ? (
                <>
                  <div className="section-header">
                    <h3><i className="fas fa-user-graduate"></i> Détails de l'étudiant</h3>
                    <button onClick={() => { setSelectedSeat(null); setSelectedStudent(null); }} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '40px',
                      color: 'white'
                    }}>
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{selectedStudent.name}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>ID: {selectedStudent.id}</p>
                  </div>

                  <div style={{ 
                    background: '#f8fafc', 
                    borderRadius: '16px', 
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef2f6' }}>
                      <span style={{ color: '#64748b' }}><i className="fas fa-chair"></i> Place</span>
                      <span style={{ fontWeight: 600 }}>{selectedStudent.seatId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef2f6' }}>
                      <span style={{ color: '#64748b' }}><i className="fas fa-users"></i> Groupe</span>
                      <span style={{ fontWeight: 600 }}>{selectedStudent.groupe}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef2f6' }}>
                      <span style={{ color: '#64748b' }}><i className="fas fa-envelope"></i> Email</span>
                      <span style={{ fontWeight: 600, fontSize: '11px' }}>{selectedStudent.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ color: '#64748b' }}><i className="fas fa-calendar-alt"></i> Statut</span>
                      <span style={{ 
                        fontWeight: 600, 
                        color: selectedStudent.present ? '#10b981' : '#ef4444',
                        background: selectedStudent.present ? '#ecfdf5' : '#fef2f2',
                        padding: '2px 10px',
                        borderRadius: '20px'
                      }}>
                        {selectedStudent.present ? 'PRÉSENT' : 'ABSENT'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => togglePresence(selectedStudent.seatId)}
                      style={{
                        flex: 1,
                        background: selectedStudent.present ? '#fef2f2' : '#ecfdf5',
                        border: `1px solid ${selectedStudent.present ? '#fecaca' : '#a7f3d0'}`,
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: selectedStudent.present ? '#ef4444' : '#10b981',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className={`fas ${selectedStudent.present ? 'fa-user-times' : 'fa-user-check'}`}></i>
                      {selectedStudent.present ? ' Marquer absent' : ' Marquer présent'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <i className="fas fa-hand-pointer" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
                  <h3 style={{ fontSize: '16px', color: '#64748b' }}>Aucun étudiant sélectionné</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    Cliquez sur un siège dans le plan de la salle
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bouton d'enregistrement */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button onClick={handleSave} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
              <i className="fas fa-save"></i> Enregistrer les présences
            </button>
          </div>
        </>
      )}

      {!selectedExam && (
        <div className="dashboard-section" style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-chair" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ fontSize: '16px', color: '#64748b' }}>Sélectionnez un examen</h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Choisissez un examen pour gérer les présences</p>
        </div>
      )}
    </div>
  );
}