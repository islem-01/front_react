import React, { useState } from 'react';
import './SeatingPage.css';

// Données mockées
const mockStudents = [
  { id: 'IIT00001', nom: 'Ben Ali', prenom: 'Ahmed', photo: '👨', groupe: 'A', niveau: 'L3', filiere: 'Informatique' },
  { id: 'IIT00002', nom: 'Touati', prenom: 'Sofia', photo: '👩', groupe: 'A', niveau: 'L3', filiere: 'Informatique' },
  { id: 'IIT00003', nom: 'Khelil', prenom: 'Yassine', photo: '👨', groupe: 'B', niveau: 'L3', filiere: 'Informatique' },
  { id: 'IIT00004', nom: 'Mansouri', prenom: 'Nadia', photo: '👩', groupe: 'B', niveau: 'L3', filiere: 'Informatique' },
  { id: 'IIT00005', nom: 'Saidi', prenom: 'Karim', photo: '👨', groupe: 'C', niveau: 'L3', filiere: 'Informatique' },
  { id: 'IIT00006', nom: 'Hamdi', prenom: 'Leila', photo: '👩', groupe: 'C', niveau: 'L3', filiere: 'Informatique' },
];

const mockSeats = [
  { id: 'A1', row: 1, col: 1, studentId: null },
  { id: 'A2', row: 1, col: 2, studentId: null },
  { id: 'A3', row: 1, col: 3, studentId: null },
  { id: 'B1', row: 2, col: 1, studentId: null },
  { id: 'B2', row: 2, col: 2, studentId: null },
  { id: 'B3', row: 2, col: 3, studentId: null },
  { id: 'C1', row: 3, col: 1, studentId: null },
  { id: 'C2', row: 3, col: 2, studentId: null },
  { id: 'C3', row: 3, col: 3, studentId: null },
];

export default function SeatingPage() {
  const [students, setStudents] = useState(mockStudents);
  const [seats, setSeats] = useState(mockSeats);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getStudentAtSeat = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return students.find(s => s.id === seat?.studentId);
  };

  const handleAssign = (seatId) => {
    if (!selectedStudent) return;
    
    const existingSeat = seats.find(s => s.studentId === selectedStudent.id);
    if (existingSeat) {
      setSeats(prev => prev.map(s => 
        s.id === existingSeat.id ? { ...s, studentId: null } : s
      ));
    }
    
    setSeats(prev => prev.map(s => 
      s.id === seatId ? { ...s, studentId: selectedStudent.id } : s
    ));
    
    setSelectedStudent(null);
  };

  const handleRemove = (seatId) => {
    setSeats(prev => prev.map(s => 
      s.id === seatId ? { ...s, studentId: null } : s
    ));
  };

  const handleRandomPlacement = () => {
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newSeats = seats.map((seat, index) => ({
      ...seat,
      studentId: shuffled[index]?.id || null
    }));
    setSeats(newSeats);
  };

  const handleClearAll = () => {
    if (window.confirm('Vider toutes les places ?')) {
      setSeats(prev => prev.map(s => ({ ...s, studentId: null })));
    }
  };

  const assignedCount = seats.filter(s => s.studentId).length;
  const totalStudents = students.length;

  return (
    <div className="seating-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="seating-header">
        <div>
          <h1><i className="fas fa-chair"></i> Plan de salle</h1>
          <p>Affectation des places d'examen</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{assignedCount}</span>
            <span className="stat-label">Placés</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalStudents - assignedCount}</span>
            <span className="stat-label">Restants</span>
          </div>
        </div>
      </div>

      <div className="seating-layout">
        <div className="student-list">
          <div className="list-header">
            <h3>Étudiants</h3>
            <div className="list-actions">
              <button className="btn-icon" onClick={handleRandomPlacement} title="Placement aléatoire">
                <i className="fas fa-random"></i>
              </button>
              <button className="btn-icon" onClick={handleClearAll} title="Tout vider">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div className="students-container">
            {students.map(student => {
              const isAssigned = seats.some(s => s.studentId === student.id);
              const isSelected = selectedStudent?.id === student.id;
              return (
                <div
                  key={student.id}
                  className={`student-card ${isAssigned ? 'assigned' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isAssigned && setSelectedStudent(isSelected ? null : student)}
                >
                  <div className="student-avatar">{student.photo}</div>
                  <div className="student-details">
                    <div className="student-name">{student.prenom} {student.nom}</div>
                    <div className="student-info">Groupe {student.groupe} · {student.id}</div>
                  </div>
                  {isAssigned && <span className="assigned-badge"><i className="fas fa-check"></i></span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="seats-plan">
          <div className="plan-header">
            <div className="board">TABLEAU</div>
            {selectedStudent && (
              <div className="selected-hint">
                <i className="fas fa-user"></i> {selectedStudent.prenom} {selectedStudent.nom} sélectionné
              </div>
            )}
          </div>
          <div className="seats-grid">
            {seats.map(seat => {
              const student = getStudentAtSeat(seat.id);
              return (
                <div
                  key={seat.id}
                  className={`seat ${student ? 'occupied' : 'empty'} ${selectedStudent ? 'selectable' : ''}`}
                  onClick={() => selectedStudent && !student && handleAssign(seat.id)}
                >
                  {student ? (
                    <>
                      <div className="seat-student">
                        <span className="seat-avatar">{student.photo}</span>
                        <span className="seat-name">{student.prenom}</span>
                      </div>
                      <button 
                        className="seat-remove"
                        onClick={(e) => { e.stopPropagation(); handleRemove(seat.id); }}
                        title="Retirer"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  ) : (
                    <div className="seat-empty">
                      <span className="seat-number">{seat.id}</span>
                      {selectedStudent && <span className="seat-hint">Cliquez</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}