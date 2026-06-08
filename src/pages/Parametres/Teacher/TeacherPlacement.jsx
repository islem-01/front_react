import React, { useState } from 'react';

export default function TeacherPlacement({ user }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Données du plan de placement
  const seats = [
    { id: "A1", student: "Ahmed Ben Ali", present: true, level: "L1", group: "A", photo: "👨‍🎓" },
    { id: "A2", student: "Sofia Touati", present: true, level: "L1", group: "A", photo: "👩‍🎓" },
    { id: "A3", student: "Karim Dridi", present: false, level: "L1", group: "A", photo: "👨‍🎓" },
    { id: "A4", student: "Leila Hamdi", present: true, level: "L1", group: "A", photo: "👩‍🎓" },
    { id: "B1", student: "Mohamed Salah", present: true, level: "L1", group: "B", photo: "👨‍🎓" },
    { id: "B2", student: "Nadia Ben Ali", present: true, level: "L1", group: "B", photo: "👩‍🎓" },
    { id: "B3", student: "Yassine Khelil", present: false, level: "L1", group: "B", photo: "👨‍🎓" },
    { id: "B4", student: "Ines Mansouri", present: true, level: "L1", group: "B", photo: "👩‍🎓" },
    { id: "C1", student: "Hichem Jaouadi", present: true, level: "L1", group: "C", photo: "👨‍🎓" },
    { id: "C2", student: "Fatima Zahra", present: true, level: "L1", group: "C", photo: "👩‍🎓" },
    { id: "C3", student: "Rami Ferchichi", present: false, level: "L1", group: "C", photo: "👨‍🎓" },
    { id: "C4", student: "Syrine Ayari", present: true, level: "L1", group: "C", photo: "👩‍🎓" }
  ];

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat.id);
    setSelectedStudent(seat);
  };

  const getSeatClass = (seat) => {
    if (selectedSeat === seat.id) return "seat selected";
    if (!seat.present) return "seat absent";
    return "seat occupied";
  };

  return (
    <div className="teacher-placement">
      <div className="placement-header">
        <h3><i className="fas fa-chair"></i> Plan de placement - Salle A12</h3>
        <p>Algorithmique - 15/06/2026 - 09:00-12:00</p>
        <div className="legend">
          <span className="legend-occupied">🟢 Occupé</span>
          <span className="legend-absent">🔴 Absent</span>
          <span className="legend-selected">🔵 Sélectionné</span>
        </div>
      </div>

      <div className="placement-grid">
        <div className="board">TABLEAU</div>
        <div className="seats-container">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={getSeatClass(seat)}
              onClick={() => handleSeatClick(seat)}
            >
              <div className="seat-id">{seat.id}</div>
              <div className="seat-student">
                <span className="student-photo">{seat.photo}</span>
                <span className="student-name">{seat.student.split(' ')[0]}</span>
              </div>
              <div className="seat-status">
                {seat.present ? "✅" : "❌"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Détails de l'étudiant sélectionné */}
      {selectedStudent && (
        <div className="student-details-panel">
          <div className="panel-header">
            <h4><i className="fas fa-user"></i> Détails de l'étudiant</h4>
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
          </div>
          <div className="panel-body">
            <div className="student-photo-large">{selectedStudent.photo}</div>
            <div className="student-info">
              <p><strong>Nom:</strong> {selectedStudent.student}</p>
              <p><strong>Place:</strong> {selectedStudent.id}</p>
              <p><strong>Niveau:</strong> {selectedStudent.level}</p>
              <p><strong>Groupe:</strong> {selectedStudent.group}</p>
              <p><strong>Statut:</strong> {selectedStudent.present ? "✅ Présent" : "❌ Absent"}</p>
            </div>
          </div>
          <div className="panel-footer">
            <button className="btn-view-alerts">
              <i className="fas fa-bell"></i> Voir les alertes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}