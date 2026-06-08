import React, { useState } from 'react';

export default function TeacherPlanning({ user }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({ start: "09:00", end: "12:00" });
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [observations, setObservations] = useState("");
  const [showCalendar, setShowCalendar] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const matieres = ["Algorithmique", "Base de données", "Réseaux", "IA", "Cryptographie"];
  const rooms = ["Salle A12", "Salle B05", "Salle C08", "Amphi A"];

  // Générer les jours du mois
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const availableDays = [10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26];

  const handleSubmit = () => {
    if (!selectedMatiere || !selectedRoom || !selectedDate) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      alert(`Demande envoyée pour ${selectedMatiere} le ${selectedDate}`);
      setSubmitted(false);
    }, 1000);
  };

  return (
    <div className="teacher-planning">
      <div className="planning-header">
        <h3><i className="fas fa-calendar-plus"></i> Proposer une date d'examen</h3>
        <p>Sélectionnez vos disponibilités et envoyez une demande à l'administration</p>
      </div>

      <div className="planning-content">
        {/* Calendrier */}
        <div className="calendar-section">
          <div className="calendar-header">
            <span className="month">{currentDate.toLocaleString('fr', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="calendar-weekdays">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {Array(daysInMonth).fill().map((_, i) => {
              const day = i + 1;
              const isAvailable = availableDays.includes(day);
              const isSelected = selectedDate === day;
              return (
                <div
                  key={day}
                  className={`calendar-day ${isAvailable ? "available" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => isAvailable && setSelectedDate(day)}
                >
                  {day}
                  {isAvailable && <span className="available-badge">✓</span>}
                </div>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span className="legend available">✅ Disponible</span>
            <span className="legend selected">📌 Sélectionné</span>
            <span className="legend unavailable">❌ Indisponible</span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="form-section">
          <h4><i className="fas fa-info-circle"></i> Informations de la demande</h4>
          
          <div className="form-group">
            <label>Matière *</label>
            <select value={selectedMatiere} onChange={(e) => setSelectedMatiere(e.target.value)}>
              <option value="">Sélectionner une matière</option>
              {matieres.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Salle souhaitée *</label>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
              <option value="">Sélectionner une salle</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Heure début</label>
              <input type="time" value={selectedTime.start} onChange={(e) => setSelectedTime({...selectedTime, start: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Heure fin</label>
              <input type="time" value={selectedTime.end} onChange={(e) => setSelectedTime({...selectedTime, end: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Date sélectionnée</label>
            <div className="selected-date-display">
              {selectedDate ? `${selectedDate} ${currentDate.toLocaleString('fr', { month: 'long' })} ${currentYear}` : "Aucune date sélectionnée"}
            </div>
          </div>

          <div className="form-group">
            <label>Observations</label>
            <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows="3" placeholder="Informations complémentaires..." />
          </div>

          <button className="btn-submit" onClick={handleSubmit} disabled={submitted}>
            {submitted ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-paper-plane"></i>}
            {submitted ? " Envoi en cours..." : " Envoyer la demande"}
          </button>
        </div>
      </div>

      {/* Demandes en attente */}
      <div className="pending-requests">
        <h4><i className="fas fa-clock"></i> Demandes en attente</h4>
        <div className="requests-list">
          <div className="request-card">
            <div className="request-info">
              <span className="request-matiere">Base de données</span>
              <span className="request-date">Proposé le: 18/06/2026</span>
            </div>
            <span className="request-status pending">En attente</span>
          </div>
          <div className="request-card">
            <div className="request-info">
              <span className="request-matiere">Réseaux</span>
              <span className="request-date">Proposé le: 20/06/2026</span>
            </div>
            <span className="request-status pending">En attente</span>
          </div>
        </div>
      </div>
    </div>
  );
}