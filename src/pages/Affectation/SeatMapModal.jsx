import React, { useState, useCallback, useRef } from "react";
import { ROOMS, STUDENTS_DB, PROFESSORS } from "./data";
import "./SeatMapModal.css";

/* ── Student card in sidebar ─────────────────────────────── */
function StudentChip({ student, dragging, onDragStart, onDragEnd, seated }) {
  return (
    <div
      className={`student-chip ${dragging ? "dragging" : ""} ${seated ? "seated" : ""}`}
      draggable={!seated}
      onDragStart={!seated ? (e) => { e.dataTransfer.setData("studentId", student.id); e.dataTransfer.effectAllowed = "move"; onDragStart(student.id); } : undefined}
      onDragEnd={onDragEnd}
      title={seated ? "Déjà placé — cliquez sur sa place pour le retirer" : `Glisser ${student.prenom} ${student.nom} vers une place`}
    >
      <div className={`chip-avatar ${student.sexe === "F" ? "female" : "male"}`}>
        {student.prenom[0]}{student.nom[0]}
      </div>
      <div className="chip-info">
        <div className="chip-name">{student.prenom} {student.nom}</div>
        <div className="chip-id">{student.id}</div>
      </div>
      {seated && <div className="chip-seated-badge">✓</div>}
    </div>
  );
}

/* ── Individual seat cell ─────────────────────────────────── */
function SeatCell({ desk, studentMap, draggingId, onDrop, onRemove, allStudents }) {
  const [over, setOver] = useState(false);
  const isTeacher = desk.type === "teacher";
  const occupant = desk.studentId ? studentMap[desk.studentId] : null;

  const handleDragOver = (e) => {
    if (isTeacher) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    if (isTeacher) return;
    const sid = e.dataTransfer.getData("studentId");
    if (sid) onDrop(desk, sid);
  };

  if (isTeacher) {
    return (
      <div className="seat-cell teacher-desk">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
        <span>Bureau</span>
      </div>
    );
  }

  return (
    <div
      className={`seat-cell ${occupant ? "occupied" : "empty"} ${over && !occupant ? "drop-over" : ""} ${over && occupant ? "drop-blocked" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => occupant && onRemove(desk)}
      title={occupant ? `${occupant.prenom} ${occupant.nom} — Cliquer pour retirer` : `Place ${desk.seatIndex} — Glisser un étudiant ici`}
    >
      {occupant ? (
        <div className="seat-occupant">
          <div className={`seat-avatar ${occupant.sexe === "F" ? "female" : "male"}`}>
            {occupant.prenom[0]}{occupant.nom[0]}
          </div>
          <div className="seat-name-wrap">
            <div className="seat-student-name">{occupant.prenom.split(" ")[0]}</div>
            <div className="seat-student-name">{occupant.nom.split(" ")[0]}</div>
            <div className="seat-student-id">{occupant.id}</div>
          </div>
          <div className="seat-remove-hint">✕</div>
        </div>
      ) : (
        <div className="seat-empty-label">
          <span className="seat-number">{desk.seatIndex}</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SEAT MAP MODAL
═══════════════════════════════════════════════════════ */
export default function SeatMapModal({ affectation, onClose, onSave }) {
  const room = ROOMS.find(r => r.id === affectation.roomId);
  const professor = PROFESSORS.find(p => p.id === affectation.professorId);
  const allStudents = STUDENTS_DB.filter(s =>
    s.niveau === affectation.niveau &&
    s.filiere === affectation.filiere &&
    s.groupe === affectation.groupe
  );

  // desks: array of desk objects with studentId
  const [desks, setDesks] = useState(() =>
    room.desks.map(d => ({
      ...d,
      studentId: affectation.seatMap?.[d.id] || null,
    }))
  );

  const [draggingId, setDraggingId] = useState(null);
  const [searchStudent, setSearchStudent] = useState("");
  const [autoMode, setAutoMode] = useState(false);

  // Build studentId -> student lookup
  const studentMap = Object.fromEntries(allStudents.map(s => [s.id, s]));

  // Which students are already seated?
  const seatedIds = new Set(desks.filter(d => d.studentId).map(d => d.studentId));
  const unseatedStudents = allStudents.filter(s => !seatedIds.has(s.id));
  const filteredUnseated = unseatedStudents.filter(s =>
    !searchStudent ||
    `${s.prenom} ${s.nom} ${s.id}`.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Stats
  const totalSeats = desks.filter(d => d.type === "desk").length;
  const occupiedSeats = desks.filter(d => d.type === "desk" && d.studentId).length;
  const pct = totalSeats ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  /* ── Drop handler ─────────────────── */
  const handleDrop = useCallback((targetDesk, studentId) => {
    setDesks(prev => {
      const next = prev.map(d => ({ ...d }));
      // Remove student from any current seat
      next.forEach(d => { if (d.studentId === studentId) d.studentId = null; });
      // Remove whoever was in target seat (swap back to unplaced)
      const target = next.find(d => d.id === targetDesk.id);
      target.studentId = studentId;
      return next;
    });
  }, []);

  /* ── Remove (click on occupied seat) ─ */
  const handleRemove = useCallback((desk) => {
    setDesks(prev => prev.map(d => d.id === desk.id ? { ...d, studentId: null } : d));
  }, []);

  /* ── Auto-place all students ─────────── */
  const handleAutoPlace = () => {
    setDesks(prev => {
      const next = prev.map(d => ({ ...d, studentId: null }));
      const emptyDesks = next.filter(d => d.type === "desk");
      const shuffled = [...allStudents].sort(() => Math.random() - 0.5);
      shuffled.forEach((student, i) => {
        if (i < emptyDesks.length) emptyDesks[i].studentId = student.id;
      });
      return next;
    });
  };

  /* ── Clear all ─────────────────────── */
  const handleClearAll = () => {
    setDesks(prev => prev.map(d => ({ ...d, studentId: null })));
  };

  /* ── Save ──────────────────────────── */
  const handleSave = () => {
    const seatMap = {};
    desks.filter(d => d.studentId).forEach(d => { seatMap[d.id] = d.studentId; });
    onSave({ ...affectation, seatMap });
  };

  // Build grid (rows x cols)
  const grid = [];
  for (let r = 0; r < room.rows; r++) {
    const row = [];
    for (let c = 0; c < room.cols; c++) {
      const desk = desks.find(d => d.row === r && d.col === c) || null;
      row.push(desk);
    }
    grid.push(row);
  }

  return (
    <div className="sm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sm-modal">

        {/* ── Header ─────────────────────────── */}
        <div className="sm-header">
          <div className="sm-header-info">
            <h2 className="sm-title">Plan de salle — {room.name}</h2>
            <div className="sm-header-meta">
              <span>{room.floor}</span>
              <span>•</span>
              <span>{affectation.examName}</span>
              <span>•</span>
              <span>{affectation.examDate} {affectation.examStart}–{affectation.examEnd}</span>
              {professor && <><span>•</span><span>👨‍🏫 {professor.name}</span></>}
            </div>
          </div>
          <div className="sm-header-actions">
            <button className="sm-btn-auto" onClick={handleAutoPlace} title="Placer automatiquement tous les étudiants">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Auto-placer
            </button>
            <button className="sm-btn-clear" onClick={handleClearAll} title="Vider tous les sièges">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              Vider
            </button>
            <button className="sm-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* ── Progress bar ──────────────────── */}
        <div className="sm-progress-bar">
          <div className="sm-progress-info">
            <span>{occupiedSeats} / {allStudents.length} étudiants placés</span>
            <span className="sm-progress-pct">{pct}%</span>
          </div>
          <div className="sm-progress-track">
            <div className="sm-progress-fill" style={{ width: `${(occupiedSeats / allStudents.length) * 100}%` }} />
          </div>
        </div>

        {/* ── Main layout ───────────────────── */}
        <div className="sm-body">

          {/* LEFT: student list */}
          <div className="sm-sidebar">
            <div className="sm-sidebar-header">
              <div className="sm-sidebar-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                <span>Étudiants ({unseatedStudents.length} non placés)</span>
              </div>
              <div className="sm-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text" placeholder="Rechercher…"
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                />
              </div>
            </div>

            <div className="sm-student-list">
              {/* Unplaced students (draggable) */}
              {filteredUnseated.length > 0 && (
                <div className="sm-list-section">
                  <div className="sm-list-label">Non placés ({filteredUnseated.length})</div>
                  {filteredUnseated.map(s => (
                    <StudentChip
                      key={s.id} student={s} seated={false}
                      dragging={draggingId === s.id}
                      onDragStart={id => setDraggingId(id)}
                      onDragEnd={() => setDraggingId(null)}
                    />
                  ))}
                </div>
              )}
              {/* Seated students */}
              {allStudents.filter(s => seatedIds.has(s.id)).length > 0 && (
                <div className="sm-list-section">
                  <div className="sm-list-label placed">Placés ({allStudents.filter(s => seatedIds.has(s.id)).length})</div>
                  {allStudents.filter(s => seatedIds.has(s.id)).map(s => (
                    <StudentChip key={s.id} student={s} seated={true}
                      dragging={false} onDragStart={() => {}} onDragEnd={() => {}}
                    />
                  ))}
                </div>
              )}
              {filteredUnseated.length === 0 && unseatedStudents.length === 0 && (
                <div className="sm-all-placed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Tous les étudiants sont placés !
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: room grid */}
          <div className="sm-room-area">
            {/* Board / blackboard at top */}
            <div className="sm-board">
              <div className="sm-board-label">TABLEAU / ESTRADE</div>
            </div>

            <div className="sm-room-scroll">
              <div
                className="sm-grid"
                style={{
                  gridTemplateColumns: `repeat(${room.cols}, minmax(62px, 80px))`,
                  gridTemplateRows: `repeat(${room.rows}, minmax(62px, 78px))`,
                }}
              >
                {grid.map((row, ri) =>
                  row.map((desk, ci) =>
                    desk ? (
                      <SeatCell
                        key={desk.id}
                        desk={desk}
                        studentMap={studentMap}
                        draggingId={draggingId}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                        allStudents={allStudents}
                      />
                    ) : (
                      <div key={`empty-${ri}-${ci}`} className="seat-cell void" />
                    )
                  )
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="sm-legend">
              <div className="sm-legend-item"><div className="sm-legend-color occupied" /><span>Occupé</span></div>
              <div className="sm-legend-item"><div className="sm-legend-color empty" /><span>Libre</span></div>
              <div className="sm-legend-item"><div className="sm-legend-color teacher" /><span>Bureau prof</span></div>
              <div className="sm-legend-item"><div className="sm-legend-color hover-ex" /><span>Survol</span></div>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────── */}
        <div className="sm-footer">
          <div className="sm-footer-stats">
            <span className="sm-stat"><strong>{occupiedSeats}</strong> placés</span>
            <span className="sm-stat"><strong>{unseatedStudents.length}</strong> en attente</span>
            <span className="sm-stat"><strong>{totalSeats - occupiedSeats}</strong> places libres</span>
          </div>
          <div style={{ display:"flex", gap:".5rem" }}>
            <button className="sm-btn-secondary" onClick={onClose}>Fermer sans sauvegarder</button>
            <button className="sm-btn-save" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Sauvegarder le plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
