import React from "react";
import "./RoomPlanner.css";

export default function RoomPlanner({ room, onClose }) {
  const { name, floor, capacity, tablesCount, furniture, rows, cols } = room;

  // Créer une grille pour visualiser la salle
  const grid = Array(rows).fill().map(() => Array(cols).fill(null));
  
  furniture.forEach(f => {
    if (f.x >= 1 && f.x <= cols && f.y >= 1 && f.y <= rows) {
      grid[f.y - 1][f.x - 1] = f;
    }
  });

  const getFurnitureIcon = (type) => {
    switch(type) {
      case "large-table": return "🪑";
      case "small-table": return "🪑";
      case "single-desk": return "💺";
      case "teacher-desk": return "📚";
      default: return "⬜";
    }
  };

  const getFurnitureLabel = (type) => {
    switch(type) {
      case "large-table": return "Table 4p";
      case "small-table": return "Table 3p";
      case "single-desk": return "Place";
      case "teacher-desk": return "Bureau";
      default: return "";
    }
  };

  return (
    <div className="planner-overlay">
      <div className="planner-container">
        <div className="planner-header">
          <div>
            <h2>📐 Plan de {name}</h2>
            <p className="planner-subtitle">{floor} • Capacité: {capacity} places • {tablesCount} tables</p>
          </div>
          <button className="planner-close" onClick={onClose}>✕</button>
        </div>

        <div className="planner-content">
          <div className="room-legend">
            <div className="legend-item"><div className="legend-color table"></div><span>Table</span></div>
            <div className="legend-item"><div className="legend-color teacher"></div><span>Bureau prof</span></div>
            <div className="legend-item"><div className="legend-color empty"></div><span>Espace libre</span></div>
            <div className="legend-item"><div className="legend-color door"></div><span>Porte</span></div>
          </div>

          <div className="room-grid-container">
            <div className="room-grid" style={{
              gridTemplateColumns: `repeat(${cols}, minmax(50px, 70px))`,
              gridTemplateRows: `repeat(${rows}, minmax(50px, 70px))`
            }}>
              {grid.map((row, y) => (
                row.map((cell, x) => (
                  <div key={`${x}-${y}`} className={`grid-cell ${cell ? 'occupied' : ''}`}>
                    {cell ? (
                      <div className="furniture-item">
                        <span className="furniture-icon">{getFurnitureIcon(cell.type)}</span>
                        <span className="furniture-seats">{cell.seats}</span>
                      </div>
                    ) : (
                      <span className="empty-cell">•</span>
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div className="room-info-panel">
            <div className="info-section">
              <h4>📊 Statistiques</h4>
              <div className="info-row"><span>Capacité totale:</span><strong>{capacity} places</strong></div>
              <div className="info-row"><span>Tables configurées:</span><strong>{tablesCount}</strong></div>
              <div className="info-row"><span>Grille:</span><strong>{cols} x {rows}</strong></div>
            </div>
            <div className="info-section">
              <h4>🪑 Types de mobilier</h4>
              {furniture.reduce((acc, f) => {
                acc[f.type] = (acc[f.type] || 0) + 1;
                return acc;
              }, {}) && Object.entries(furniture.reduce((acc, f) => {
                acc[f.type] = (acc[f.type] || 0) + 1;
                return acc;
              }, {})).map(([type, count]) => (
                <div key={type} className="info-row">
                  <span>{getFurnitureLabel(type)}:</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="planner-footer">
          <button className="btn-close" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}