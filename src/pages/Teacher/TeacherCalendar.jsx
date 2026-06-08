import React, { useState } from 'react';

export default function TeacherCalendar({ user }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Sélections
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedGroupe, setSelectedGroupe] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');

  // Données
  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2', 'ING1', 'ING2', 'ING3'];
  const filieresMap = {
    'L1': ['Informatique', 'Réseaux', 'IA'],
    'L2': ['Informatique', 'Réseaux'],
    'L3': ['Informatique'],
    'ING1': ['GLID', 'ARSI'],
    'ING2': ['GLID', 'ARSI'],
    'ING3': ['GLID', 'ARSI']
  };
  const groupesMap = {
    'Informatique': ['G1', 'G2', 'G3'],
    'Réseaux': ['G1', 'G2'],
    'IA': ['G1', 'G2'],
    'GLID': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
    'ARSI': ['C1']
  };
  const matieresMap = {
    'Informatique': ['Algorithmique', 'BD', 'Java', 'Réseaux'],
    'Réseaux': ['TCP/IP', 'Sécurité', 'VoIP'],
    'IA': ['ML', 'Deep Learning', 'NLP'],
    'GLID': ['Génie Logiciel', 'DevOps', 'Cloud'],
    'ARSI': ['Cyber', 'Pentesting', 'Forensics']
  };

  const availableSlots = {
    '2026-06-15': ['08:00', '10:00', '14:00'],
    '2026-06-16': ['08:00', '14:00'],
    '2026-06-17': ['10:00', '12:00'],
    '2026-06-18': ['08:00', '10:00', '14:00', '16:00']
  };

  const [requests, setRequests] = useState([
    { id: 1, matiere: 'Algorithmique', date: '15/06', heure: '08:30', statut: 'accepte' },
    { id: 2, matiere: 'Réseaux', date: '20/06', heure: '11:00', statut: 'attente' },
    { id: 3, matiere: 'Java', date: '28/06', heure: '09:00', statut: 'refuse' }
  ]);

  const handleNext = () => {
    if (!selectedMatiere) return;
    setLoading(true);
    setTimeout(() => { setStep(2); setLoading(false); }, 300);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeSlot) return;
    setLoading(true);
    setTimeout(() => {
      setRequests([{ id: Date.now(), matiere: selectedMatiere, date: selectedDate.split('-').reverse().join('/'), heure: selectedTimeSlot, statut: 'attente' }, ...requests]);
      alert('✅ Demande envoyée !');
      setStep(1);
      setSelectedNiveau(''); setSelectedFiliere(''); setSelectedGroupe(''); setSelectedMatiere('');
      setSelectedDate(null); setSelectedTimeSlot(null);
      setLoading(false);
    }, 800);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days = [];
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) days.push({ day: prevLast - i, current: false, date: new Date(year, month - 1, prevLast - i) });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true, date: new Date(year, month, i) });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false, date: new Date(year, month + 1, i) });
    return days;
  };

  const isAvailable = (date) => availableSlots[date.toISOString().split('T')[0]];

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getStatutStyle = (statut) => {
    if (statut === 'accepte') return { bg: '#ecfdf5', color: '#10b981', icon: '✓', text: 'Acceptée' };
    if (statut === 'attente') return { bg: '#fffbeb', color: '#f59e0b', icon: '⏳', text: 'En attente' };
    return { bg: '#fef2f2', color: '#ef4444', icon: '✗', text: 'Refusée' };
  };

  return (
    <div className="calendar-glass">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Hero section */}
      <div className="hero-glass">
        <div className="hero-badge">
          <i className="fas fa-calendar-check"></i> Planification
        </div>
        <h1>Proposer une date d'examen</h1>
        <p>Sélectionnez votre examen, choisissez une date et envoyez votre demande</p>
      </div>

      {/* Steps */}
      <div className="steps-glass">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">{step === 1 ? '1' : '✓'}</div>
          <span>Informations</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">{step === 2 ? '2' : step > 2 ? '✓' : ''}</div>
          <span>Calendrier</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="glass-card">
          <div className="card-header">
            <i className="fas fa-graduation-cap"></i>
            <h3>Informations de l'examen</h3>
          </div>
          
          <div className="selectors-horizontal">
            <div className="selector">
              <label>🎓 Niveau</label>
              <div className="chip-group">
                {niveaux.map(n => (
                  <button key={n} className={`chip ${selectedNiveau === n ? 'active' : ''}`} onClick={() => { setSelectedNiveau(n); setSelectedFiliere(''); setSelectedGroupe(''); setSelectedMatiere(''); }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {selectedNiveau && filieresMap[selectedNiveau] && (
              <div className="selector">
                <label>📚 Filière</label>
                <div className="chip-group">
                  {filieresMap[selectedNiveau].map(f => (
                    <button key={f} className={`chip ${selectedFiliere === f ? 'active' : ''}`} onClick={() => { setSelectedFiliere(f); setSelectedGroupe(''); setSelectedMatiere(''); }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedFiliere && groupesMap[selectedFiliere] && (
              <div className="selector">
                <label>👥 Groupe</label>
                <div className="chip-group">
                  {groupesMap[selectedFiliere].map(g => (
                    <button key={g} className={`chip ${selectedGroupe === g ? 'active' : ''}`} onClick={() => setSelectedGroupe(g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedGroupe && matieresMap[selectedFiliere] && (
              <div className="selector">
                <label>📖 Matière</label>
                <div className="chip-group">
                  {matieresMap[selectedFiliere].map(m => (
                    <button key={m} className={`chip ${selectedMatiere === m ? 'active' : ''}`} onClick={() => setSelectedMatiere(m)}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedMatiere && (
            <div className="recap-glass">
              <div className="recap-item">
                <i className="fas fa-check-circle"></i> {selectedNiveau}
              </div>
              <i className="fas fa-arrow-right"></i>
              <div className="recap-item">
                <i className="fas fa-check-circle"></i> {selectedFiliere}
              </div>
              <i className="fas fa-arrow-right"></i>
              <div className="recap-item">
                <i className="fas fa-check-circle"></i> {selectedGroupe}
              </div>
              <i className="fas fa-arrow-right"></i>
              <div className="recap-item active">
                <i className="fas fa-star"></i> {selectedMatiere}
              </div>
            </div>
          )}

          <button className="btn-glass next" onClick={handleNext} disabled={!selectedMatiere || loading}>
            {loading ? <i className="fas fa-spinner fa-pulse"></i> : 'Continuer'}
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="glass-card">
          <div className="card-header">
            <i className="fas fa-calendar-alt"></i>
            <h3>Choisissez une date</h3>
          </div>

          {/* Calendar navigation */}
          <div className="calendar-nav">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <span>{currentMonth.toLocaleString('fr', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Calendar grid */}
          <div className="calendar">
            <div className="weekdays">
              {weekDays.map(d => <div key={d} className="weekday">{d}</div>)}
            </div>
            <div className="days">
              {getDaysInMonth(currentMonth).map((day, idx) => {
                const available = day.current && isAvailable(day.date);
                const selected = selectedDate === day.date?.toISOString().split('T')[0];
                const today = day.current && day.day === new Date().getDate() && 
                  currentMonth.getMonth() === new Date().getMonth();
                
                return (
                  <div
                    key={idx}
                    className={`day ${available ? 'available' : ''} ${selected ? 'selected' : ''} ${today ? 'today' : ''} ${!day.current ? 'other' : ''}`}
                    onClick={() => available && setSelectedDate(day.date.toISOString().split('T')[0])}
                  >
                    {day.day}
                    {available && <div className="dot"></div>}
                    {today && <div className="today-badge">Auj</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <span><i className="fas fa-circle" style={{ color: '#10b981', fontSize: '10px' }}></i> Disponible</span>
            <span><i className="fas fa-circle" style={{ color: '#e2e8f0', fontSize: '10px' }}></i> Indisponible</span>
            <span><i className="fas fa-circle" style={{ color: '#3b82f6', fontSize: '10px' }}></i> Sélectionné</span>
          </div>

          {/* Time slots */}
          {selectedDate && availableSlots[selectedDate] && (
            <div className="slots">
              <div className="slots-header">
                <i className="fas fa-clock"></i>
                <span>Créneaux disponibles</span>
              </div>
              <div className="slots-grid">
                {availableSlots[selectedDate].map(slot => (
                  <button
                    key={slot}
                    className={`slot ${selectedTimeSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <i className="fas fa-clock"></i> {slot}h - {parseInt(slot) + 2}h
                    {selectedTimeSlot === slot && <i className="fas fa-check-circle"></i>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="options">
            <label className="option">
              <input type="checkbox" defaultChecked />
              <span>J'accepte n'importe quelle salle disponible</span>
            </label>
            <label className="option">
              <input type="checkbox" defaultChecked />
              <span>Me prévenir par email</span>
            </label>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn-glass back" onClick={() => setStep(1)}>
              <i className="fas fa-arrow-left"></i> Retour
            </button>
            <button className="btn-glass submit" onClick={handleSubmit} disabled={!selectedTimeSlot || loading}>
              {loading ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-paper-plane"></i>}
              {loading ? ' Envoi...' : ' Envoyer la demande'}
            </button>
          </div>
        </div>
      )}

      {/* Mes demandes */}
      <div className="glass-card requests">
        <div className="card-header">
          <i className="fas fa-history"></i>
          <h3>Mes demandes</h3>
        </div>
        <div className="requests-list">
          {requests.map(req => {
            const style = getStatutStyle(req.statut);
            return (
              <div key={req.id} className="request" style={{ borderLeftColor: style.color }}>
                <div className="request-info">
                  <div className="request-title">{req.matiere}</div>
                  <div className="request-date"><i className="fas fa-calendar"></i> {req.date} à {req.heure}</div>
                </div>
                <div className="request-status" style={{ background: style.bg, color: style.color }}>
                  <i className={`fas fa-${style.icon === '✓' ? 'check-circle' : style.icon === '⏳' ? 'clock' : 'times-circle'}`}></i>
                  {style.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .calendar-glass {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Hero */
        .hero-glass {
          text-align: center;
          margin-bottom: 40px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.1);
          padding: 6px 16px;
          border-radius: 40px;
          color: #3b82f6;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .hero-glass h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .hero-glass p {
          color: #64748b;
        }

        /* Steps */
        .steps-glass {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-circle {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
        }
        .step.active .step-circle {
          background: #3b82f6;
          color: white;
        }
        .step span {
          font-size: 13px;
          color: #94a3b8;
        }
        .step.active span {
          color: #3b82f6;
          font-weight: 500;
        }
        .step-line {
          width: 50px;
          height: 2px;
          background: #e2e8f0;
        }

        /* Glass Card */
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.05);
          border: 1px solid rgba(255,255,255,0.5);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .card-header i {
          color: #3b82f6;
          font-size: 18px;
        }
        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Selectors */
        .selectors-horizontal {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .selector label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          display: block;
          margin-bottom: 10px;
        }
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chip {
          padding: 8px 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover {
          background: #f1f5f9;
          transform: translateY(-1px);
        }
        .chip.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        /* Recap */
        .recap-glass {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
          padding: 16px;
          background: #f8fafc;
          border-radius: 60px;
          flex-wrap: wrap;
        }
        .recap-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: white;
          border-radius: 30px;
          font-size: 12px;
          color: #475569;
        }
        .recap-item.active {
          background: #3b82f6;
          color: white;
        }
        .recap-item i {
          font-size: 11px;
        }

        /* Calendar */
        .calendar-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .calendar-nav button {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .calendar-nav span {
          font-weight: 600;
        }
        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 8px;
        }
        .weekday {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          padding: 8px;
        }
        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .day {
          position: relative;
          text-align: center;
          padding: 12px 8px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .day.available {
          background: #ecfdf5;
          color: #10b981;
        }
        .day.available:hover {
          background: #d1fae5;
          transform: scale(1.02);
        }
        .day.selected {
          background: #3b82f6;
          color: white;
        }
        .day.today {
          border: 2px solid #3b82f6;
        }
        .day.other {
          opacity: 0.3;
          cursor: default;
        }
        .dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #10b981;
          border-radius: 50%;
        }
        .today-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #3b82f6;
          color: white;
          font-size: 8px;
          padding: 2px 5px;
          border-radius: 10px;
        }
        .calendar-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0 0;
          padding: 12px;
          background: #f8fafc;
          border-radius: 40px;
        }
        .calendar-legend span {
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Slots */
        .slots {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .slots-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }
        .slot {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slot:hover {
          transform: translateY(-2px);
        }
        .slot.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        /* Options */
        .options {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        /* Buttons */
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .btn-glass {
          padding: 10px 24px;
          border-radius: 40px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-glass.next {
          width: 100%;
          justify-content: center;
          background: #3b82f6;
          color: white;
          margin-top: 8px;
        }
        .btn-glass.next:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
        .btn-glass.back {
          background: #f1f5f9;
          color: #475569;
        }
        .btn-glass.submit {
          background: #10b981;
          color: white;
        }
        .btn-glass.submit:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        /* Requests */
        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .request {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: #f8fafc;
          border-radius: 16px;
          border-left: 3px solid;
        }
        .request-title {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .request-date {
          font-size: 11px;
          color: #64748b;
        }
        .request-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .recap-glass {
            flex-direction: column;
            border-radius: 20px;
          }
          .recap-glass i.fa-arrow-right {
            transform: rotate(90deg);
          }
          .slots-grid {
            grid-template-columns: 1fr 1fr;
          }
          .actions {
            flex-direction: column;
          }
          .request {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .steps-glass {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}