import React, { useState } from 'react';

export default function TeacherPlacement({ user }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Examens disponibles
  const exams = [
    { id: 1, matiere: "Algorithmique Avancée", date: "15/06/2026", salle: "A12", horaire: "08:30-10:30" },
    { id: 2, matiere: "Base de données", date: "20/06/2026", salle: "B05", horaire: "11:00-13:00" },
    { id: 3, matiere: "Java Avancé", date: "28/06/2026", salle: "C03", horaire: "09:00-11:00" }
  ];

  // Dans TeacherPlacement.jsx, ajoute cette fonction
const getRoomLayout = (salleName) => {
  // Ici tu récupères depuis le localStorage le layout sauvegardé dans Gestion des salles
  const savedLayout = localStorage.getItem(`room_layout_${salleName}`);
  if (savedLayout) {
    return JSON.parse(savedLayout);
  }
  return null;
};
  // Plan de la salle A12 (avec état modifiable)
  const [roomPlan, setRoomPlan] = useState({
    name: "Salle A12",
    rows: 6,
    cols: 6,
    seats: [
      { id: "A1", student: "Ahmed Ben Ali", idEtudiant: "20240001", groupe: "G1", photo: "👨‍🎓", present: true },
      { id: "A2", student: "Sofia Touati", idEtudiant: "20240002", groupe: "G1", photo: "👩‍🎓", present: true },
      { id: "A3", student: "Karim Dridi", idEtudiant: "20240003", groupe: "G1", photo: "👨‍🎓", present: false },
      { id: "A4", student: "Leila Hamdi", idEtudiant: "20240004", groupe: "G1", photo: "👩‍🎓", present: true },
      { id: "A5", student: "Mohamed Salah", idEtudiant: "20240005", groupe: "G1", photo: "👨‍🎓", present: true },
      { id: "A6", student: "Nadia Ben Ali", idEtudiant: "20240006", groupe: "G1", photo: "👩‍🎓", present: true },
      
      { id: "B1", student: "Yassine Khelil", idEtudiant: "20240007", groupe: "G2", photo: "👨‍🎓", present: true },
      { id: "B2", student: "Ines Mansouri", idEtudiant: "20240008", groupe: "G2", photo: "👩‍🎓", present: true },
      { id: "B3", student: "Hichem Jaouadi", idEtudiant: "20240009", groupe: "G2", photo: "👨‍🎓", present: false },
      { id: "B4", student: "Fatima Zahra", idEtudiant: "20240010", groupe: "G2", photo: "👩‍🎓", present: true },
      { id: "B5", student: "Rami Ferchichi", idEtudiant: "20240011", groupe: "G2", photo: "👨‍🎓", present: true },
      { id: "B6", student: "Syrine Ayari", idEtudiant: "20240012", groupe: "G2", photo: "👩‍🎓", present: true },
      
      { id: "C1", student: "Wassim Marzouk", idEtudiant: "20240013", groupe: "G3", photo: "👨‍🎓", present: true },
      { id: "C2", student: "Nour Bouaziz", idEtudiant: "20240014", groupe: "G3", photo: "👩‍🎓", present: true },
      { id: "C3", student: "Fares Ayari", idEtudiant: "20240015", groupe: "G3", photo: "👨‍🎓", present: true },
      { id: "C4", student: "Eya Dridi", idEtudiant: "20240016", groupe: "G3", photo: "👩‍🎓", present: false },
      { id: "C5", student: "Omar Ben Hassine", idEtudiant: "20240017", groupe: "G3", photo: "👨‍🎓", present: true },
      { id: "C6", student: "Salma Trabelsi", idEtudiant: "20240018", groupe: "G3", photo: "👩‍🎓", present: true }
    ]
  });

  // Plan de la salle B05
  const [roomPlanB05, setRoomPlanB05] = useState({
    name: "Salle B05",
    rows: 5,
    cols: 5,
    seats: [
      { id: "A1", student: "Ali Ben Mabrouk", idEtudiant: "20240019", groupe: "G1", photo: "👨‍🎓", present: true },
      { id: "A2", student: "Mariem Chaabane", idEtudiant: "20240020", groupe: "G1", photo: "👩‍🎓", present: true },
      { id: "A3", student: "Ahmed Gharbi", idEtudiant: "20240021", groupe: "G1", photo: "👨‍🎓", present: false },
      { id: "A4", student: "Amira Jaouadi", idEtudiant: "20240022", groupe: "G1", photo: "👩‍🎓", present: true },
      { id: "A5", student: "Mohamed Kacem", idEtudiant: "20240023", groupe: "G1", photo: "👨‍🎓", present: true }
    ]
  });

  const getCurrentPlan = () => {
    if (!selectedExam) return roomPlan;
    if (selectedExam.salle === "A12") return roomPlan;
    if (selectedExam.salle === "B05") return roomPlanB05;
    return roomPlan;
  };

  const updateCurrentPlan = (newPlan) => {
    if (!selectedExam) return;
    if (selectedExam.salle === "A12") {
      setRoomPlan(newPlan);
    } else if (selectedExam.salle === "B05") {
      setRoomPlanB05(newPlan);
    }
  };

  const togglePresence = (seatId) => {
    const currentPlan = getCurrentPlan();
    const updatedSeats = currentPlan.seats.map(seat =>
      seat.id === seatId ? { ...seat, present: !seat.present } : seat
    );
    updateCurrentPlan({ ...currentPlan, seats: updatedSeats });
    
    // Mettre à jour l'étudiant sélectionné s'il s'agit du même
    if (selectedStudent && selectedStudent.id === seatId) {
      const updatedSeat = updatedSeats.find(s => s.id === seatId);
      setSelectedStudent(updatedSeat);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat && seat.student) {
      setSelectedSeat(seat.id);
      setSelectedStudent(seat);
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    // Ici vous pouvez ajouter l'appel API pour sauvegarder les présences
    console.log("Présences sauvegardées:", getCurrentPlan().seats);
  };

  const currentPlan = getCurrentPlan();
  const stats = {
    presents: currentPlan.seats.filter(s => s.present).length,
    absents: currentPlan.seats.filter(s => !s.present).length,
    total: currentPlan.seats.length,
    taux: Math.round((currentPlan.seats.filter(s => s.present).length / currentPlan.seats.length) * 100)
  };

  return (
    <div className="teacher-placement">
      {/* Toast de succès */}
      {saveSuccess && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', zIndex: 1000 }}>
          <i className="fas fa-check-circle"></i> Présences enregistrées !
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
              onClick={() => {
                setSelectedExam(exam);
                setSelectedSeat(null);
                setSelectedStudent(null);
              }}
              style={{
                flex: 1,
                padding: '16px',
                background: selectedExam?.id === exam.id ? '#3b82f6' : 'white',
                border: selectedExam?.id === exam.id ? 'none' : '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                color: selectedExam?.id === exam.id ? 'white' : '#1e293b'
              }}
            >
              <div style={{ fontWeight: 700 }}>{exam.matiere}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{exam.salle} · {exam.date} · {exam.horaire}</div>
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
                <div className="stat-value">{stats.presents}</div>
                <div className="stat-label">Présents</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><i className="fas fa-user-times"></i></div>
              <div className="stat-info">
                <div className="stat-value">{stats.absents}</div>
                <div className="stat-label">Absents</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><i className="fas fa-users"></i></div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><i className="fas fa-chart-line"></i></div>
              <div className="stat-info">
                <div className="stat-value">{stats.taux}%</div>
                <div className="stat-label">Taux de présence</div>
              </div>
            </div>
          </div>

          {/* Plan de la salle */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3><i className="fas fa-building"></i> Plan de la salle - {currentPlan.name}</h3>
              <div className="legend" style={{ display: 'flex', gap: '20px' }}>
                <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#10b981', borderRadius: '3px', marginRight: '6px' }}></span> Présent</span>
                <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#ef4444', borderRadius: '3px', marginRight: '6px' }}></span> Absent</span>
                <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#3b82f6', borderRadius: '3px', marginRight: '6px' }}></span> Sélectionné</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${currentPlan.cols + 1}, auto)`, 
                gap: '10px',
                minWidth: '550px',
                marginBottom: '20px'
              }}>
                {/* En-têtes */}
                <div style={{ fontWeight: 600, fontSize: '11px', color: '#64748b', padding: '8px' }}></div>
                {Array(currentPlan.cols).fill().map((_, i) => (
                  <div key={`col-${i}`} style={{ textAlign: 'center', fontWeight: 600, fontSize: '11px', color: '#64748b', padding: '8px' }}>
                    {i + 1}
                  </div>
                ))}
                
                {/* Lignes de sièges */}
                {Array(currentPlan.rows).fill().map((_, rowIdx) => {
                  const rowLetter = String.fromCharCode(65 + rowIdx);
                  const rowSeats = currentPlan.seats.filter(s => s.id.startsWith(rowLetter));
                  
                  return (
                    <React.Fragment key={rowIdx}>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px', padding: '8px' }}>
                        {rowLetter}
                      </div>
                      {Array(currentPlan.cols).fill().map((_, colIdx) => {
                        const seatId = `${rowLetter}${colIdx + 1}`;
                        const seat = rowSeats.find(s => s.id === seatId);
                        if (!seat) {
                          return <div key={seatId} style={{ padding: '8px', background: '#f8fafc', borderRadius: '10px', minHeight: '110px' }}></div>;
                        }
                        const isSelected = selectedSeat === seatId;
                        return (
                          <div 
                            key={seatId}
                            onClick={() => handleSeatClick(seat)}
                            style={{
                              background: seat.present ? '#ecfdf5' : '#fef2f2',
                              border: `2px solid ${isSelected ? '#3b82f6' : seat.present ? '#a7f3d0' : '#fecaca'}`,
                              borderRadius: '12px',
                              padding: '10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{seatId}</div>
                            <div style={{ fontSize: '28px' }}>{seat.photo}</div>
                            <div style={{ fontSize: '10px', fontWeight: 500, marginTop: '6px' }}>{seat.student.split(' ')[0]}</div>
                            <div style={{ 
                              fontSize: '9px', 
                              color: seat.present ? '#10b981' : '#ef4444', 
                              marginTop: '4px', 
                              fontWeight: 600,
                              background: seat.present ? '#d1fae5' : '#fee2e2',
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '20px'
                            }}>
                              {seat.present ? 'PRÉSENT' : 'ABSENT'}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePresence(seat.id); }}
                              style={{
                                position: 'absolute',
                                bottom: '6px',
                                right: '6px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '20px',
                                padding: '3px 8px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                color: seat.present ? '#ef4444' : '#10b981'
                              }}
                              title={seat.present ? "Marquer absent" : "Marquer présent"}
                            >
                              <i className={`fas ${seat.present ? 'fa-user-times' : 'fa-user-check'}`}></i>
                            </button>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
              <i className="fas fa-info-circle"></i> Cliquez sur une place pour voir les détails | 
              <i className="fas fa-user-check" style={{ marginLeft: '8px', color: '#10b981' }}></i> / 
              <i className="fas fa-user-times" style={{ color: '#ef4444' }}></i> pour changer le statut
            </div>
          </div>

          {/* Panneau des détails de l'étudiant */}
          {selectedStudent && (
            <div className="dashboard-section">
              <div className="section-header">
                <h3><i className="fas fa-user"></i> Détails de l'étudiant</h3>
                <button 
                  onClick={() => { setSelectedSeat(null); setSelectedStudent(null); }}
                  style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '40px'
                }}>
                  {selectedStudent.photo}
                </div>
                <div style={{ flex: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr><td style={{ padding: '6px', fontWeight: 600, width: '120px' }}>Nom complet:</td><td>{selectedStudent.student}</td></tr>
                      <tr><td style={{ padding: '6px', fontWeight: 600 }}>ID étudiant:</td><td>{selectedStudent.idEtudiant}</td></tr>
                      <tr><td style={{ padding: '6px', fontWeight: 600 }}>Place:</td><td>{selectedStudent.id}</td></tr>
                      <tr><td style={{ padding: '6px', fontWeight: 600 }}>Groupe:</td><td>{selectedStudent.groupe}</td></tr>
                      <tr><td style={{ padding: '6px', fontWeight: 600 }}>Statut:</td><td>
                        <button 
                          onClick={() => togglePresence(selectedStudent.id)}
                          style={{
                            background: selectedStudent.present ? '#ecfdf5' : '#fef2f2',
                            border: `1px solid ${selectedStudent.present ? '#10b981' : '#ef4444'}`,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            color: selectedStudent.present ? '#10b981' : '#ef4444',
                            fontWeight: 500
                          }}
                        >
                          <i className={`fas ${selectedStudent.present ? 'fa-user-check' : 'fa-user-times'}`}></i>
                          {selectedStudent.present ? ' Présent' : ' Absent'}
                        </button>
                      </td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bouton d'enregistrement */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button onClick={handleSave} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
              <i className="fas fa-save"></i> Enregistrer les présences
            </button>
          </div>
          {/* Résumé des présences */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3><i className="fas fa-chart-bar"></i> Résumé des présences</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                  {currentPlan.seats.filter(s => s.present === true).length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Présents</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>
                  {currentPlan.seats.filter(s => s.present === false).length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Absents</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>
                  {currentPlan.seats.length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Total</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6' }}>
                  {Math.round((currentPlan.seats.filter(s => s.present === true).length / currentPlan.seats.length) * 100)}%
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Taux de présence</div>
              </div>
            </div>
          </div>
        </>
      )}
     
      

      {!selectedExam && (
        <div className="dashboard-section" style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-chair" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
          <h3>Sélectionnez un examen</h3>
          <p style={{ color: '#64748b' }}>Choisissez un examen dans la liste ci-dessus pour gérer les présences</p>
        </div>
      )}
    </div>
  );
}