import React from "react";

export default function SeatPlan({ room, onSeatSelect, selectedSeat, dragStudent, onDragStart, onDrop }) {
  if (!room) {
    return (
      <div className="seatplan-empty">
        <i className="fas fa-chair"></i>
        <p>Sélectionnez une salle pour voir le plan</p>
      </div>
    );
  }

  const { affectations, layout } = room;
  const rows = layout?.rows || 5;
  const cols = layout?.cols || 6;

  const seatMap = {};
  affectations.forEach(a => { seatMap[a.seatId] = a; });

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="seatplan">
      <div className="seatplan-header">
        <div className="seatplan-title">
          <i className="fas fa-door-open"></i> {room.room}
          <span className="seatplan-badge">{room.allocated} / {room.capacity}</span>
        </div>
      </div>

      <div className="seatplan-grid">
        {/* Tableau */}
        <div className="seatplan-board">
          <i className="fas fa-chalkboard"></i> Tableau
        </div>

        {/* Sièges */}
        <div className="seatplan-seats">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="seatplan-row">
              <span className="seatplan-row-lbl">{String.fromCharCode(65 + r)}</span>
              <div className="seatplan-row-seats">
                {Array.from({ length: cols }, (_, c) => {
                  const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
                  const aff = seatMap[seatId];
                  const occupied = !!aff;
                  const isSelected = selectedSeat?.seatId === seatId;
                  const isDragging = dragStudent?.seatId === seatId;

                  return (
                    <div
                      key={c}
                      className={`sp-seat ${occupied ? "occupied" : "free"} ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""}`}
                      onClick={() => occupied && onSeatSelect(aff)}
                      draggable={occupied}
                      onDragStart={() => occupied && onDragStart(aff)}
                      onDragOver={handleDragOver}
                      onDrop={() => onDrop(seatId, room.roomId)}
                    >
                      <span className="sp-seat-id">{seatId}</span>
                      {occupied ? (
                        <div className="sp-avatar">
                          {aff.student.prenom.charAt(0)}{aff.student.nom.charAt(0)}
                        </div>
                      ) : (
                        <i className="fas fa-chair sp-empty-icon"></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bureau surveillant */}
        <div className="seatplan-desk">
          <i className="fas fa-desktop"></i> Bureau surveillant
        </div>
      </div>
    </div>
  );
}
