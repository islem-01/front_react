import React, { useState, useCallback, useRef, useEffect } from "react";
import "./RoomEditor.css";

const FURNITURE_TYPES = {
  "large-table": { 
    name: "Grande table ×6", 
    icon: "🪑", 
    seats: 6, 
    width: 2, 
    height: 1, 
    color: "#e8a87c",
    bgColor: "#fef3c7",
    borderColor: "#f59e0b"
  },
  "small-table": { 
    name: "Petite table ×3", 
    icon: "🪑", 
    seats: 3, 
    width: 1, 
    height: 1, 
    color: "#f3b38c",
    bgColor: "#fed7aa",
    borderColor: "#ea580c"
  },
  "single-desk": { 
    name: "Place individuelle", 
    icon: "💺", 
    seats: 1, 
    width: 1, 
    height: 1, 
    color: "#a8d8ea",
    bgColor: "#dbeafe",
    borderColor: "#3b82f6"
  },
  "teacher-desk": { 
    name: "Bureau professeur", 
    icon: "📚", 
    seats: 1, 
    width: 2, 
    height: 1, 
    color: "#d4a373",
    bgColor: "#f3e8ff",
    borderColor: "#9333ea"
  }
};

export default function RoomEditor({ room, onSave, onClose }) {
  const [editedRoom, setEditedRoom] = useState({ ...room });
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [dragMode, setDragMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const gridRef = useRef(null);

  const rows = editedRoom.config?.rows || 6;
  const cols = editedRoom.config?.cols || 8;
  const furniture = editedRoom.config?.furniture || [];

  const getGridCell = (x, y) => {
    return furniture.find(f => f.x === x && f.y === y);
  };

  const addFurniture = (type, x, y) => {
    if (getGridCell(x, y)) return;
    const newFurniture = {
      id: Date.now() + Math.random(),
      type,
      x,
      y,
      seats: FURNITURE_TYPES[type].seats
    };
    setEditedRoom({
      ...editedRoom,
      config: {
        ...editedRoom.config,
        furniture: [...furniture, newFurniture]
      }
    });
  };

  const removeFurniture = (id) => {
    setEditedRoom({
      ...editedRoom,
      config: {
        ...editedRoom.config,
        furniture: furniture.filter(f => f.id !== id)
      }
    });
  };

  const moveFurniture = (id, newX, newY) => {
    if (getGridCell(newX, newY)) return;
    setEditedRoom({
      ...editedRoom,
      config: {
        ...editedRoom.config,
        furniture: furniture.map(f => 
          f.id === id ? { ...f, x: newX, y: newY } : f
        )
      }
    });
  };

  const autoArrange = () => {
    const newFurniture = [];
    let posX = 1, posY = 1;
    furniture.forEach(f => {
      newFurniture.push({ ...f, x: posX, y: posY });
      posX += 2;
      if (posX > cols) {
        posX = 1;
        posY += 2;
      }
    });
    setEditedRoom({
      ...editedRoom,
      config: {
        ...editedRoom.config,
        furniture: newFurniture
      }
    });
  };

  const clearRoom = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider toute la salle ?")) {
      setEditedRoom({
        ...editedRoom,
        config: {
          ...editedRoom.config,
          furniture: []
        }
      });
    }
  };

  const updateRoomDetails = (field, value) => {
    setEditedRoom({ ...editedRoom, [field]: value });
  };

  const totalSeats = furniture.reduce((sum, f) => sum + (f.seats || 0), 0);
  const occupancyRate = editedRoom.capacity > 0 ? (totalSeats / editedRoom.capacity) * 100 : 0;

  // Statistiques par type de mobilier
  const furnitureStats = Object.keys(FURNITURE_TYPES).map(type => ({
    type,
    name: FURNITURE_TYPES[type].name,
    count: furniture.filter(f => f.type === type).length,
    seats: furniture.filter(f => f.type === type).reduce((sum, f) => sum + f.seats, 0)
  }));

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">Éditeur de plan de salle</h2>
            <div className="room-info-edit">
              <input
                type="text"
                value={editedRoom.name}
                onChange={(e) => updateRoomDetails("name", e.target.value)}
                className="room-name-input"
                placeholder="Nom de la salle"
              />
              <select
                value={editedRoom.floor}
                onChange={(e) => updateRoomDetails("floor", e.target.value)}
                className="room-floor-select"
              >
                <option>RDC</option>
                <option>Étage 1</option>
                <option>Étage 2</option>
                <option>Étage 3</option>
                <option>Étage 4</option>
              </select>
              <input
                type="number"
                value={editedRoom.capacity}
                onChange={(e) => updateRoomDetails("capacity", parseInt(e.target.value))}
                className="room-capacity-input"
                placeholder="Capacité"
                min={1}
                max={200}
              />
            </div>
          </div>
          <button className="editor-close" onClick={onClose}>✕</button>
        </div>

        <div className="editor-content">
          {/* Left Panel - Furniture Library */}
          <div className="furniture-panel">
            <div className="panel-section">
              <h3 className="panel-title">
                <span className="panel-icon">🪑</span>
                MOBILIER
              </h3>
              <div className="furniture-list">
                {Object.entries(FURNITURE_TYPES).map(([key, data]) => (
                  <div
                    key={key}
                    className="furniture-item"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("type", key);
                      setDragMode(true);
                    }}
                    onDragEnd={() => setDragMode(false)}
                  >
                    <div className="furniture-preview" style={{ background: data.bgColor, borderColor: data.borderColor }}>
                      <span className="furniture-icon">{data.icon}</span>
                      <span className="furniture-seats-badge">{data.seats}</span>
                    </div>
                    <div className="furniture-info">
                      <span className="furniture-name">{data.name}</span>
                      <span className="furniture-seats">{data.seats} places</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-section">
              <h3 className="panel-title">
                <span className="panel-icon">⚡</span>
                ACTIONS RAPIDES
              </h3>
              <div className="action-buttons">
                <button className="action-btn" onClick={autoArrange}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4v16h16M8 12h8M12 8v8"/>
                  </svg>
                  Auto-arrangement
                </button>
                <button className="action-btn danger" onClick={clearRoom}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                  Vider la salle
                </button>
              </div>
            </div>

            <div className="panel-section">
              <h3 className="panel-title">
                <span className="panel-icon">📊</span>
                STATISTIQUES
              </h3>
              <div className="stats-card">
                <div className="stat-item">
                  <span className="stat-label">Capacité totale</span>
                  <span className="stat-value">{totalSeats} / {editedRoom.capacity}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(occupancyRate, 100)}%` }} />
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tables configurées</span>
                  <span className="stat-value">{furniture.length}</span>
                </div>
                <div className="stat-divider" />
                {furnitureStats.filter(s => s.count > 0).map(stat => (
                  <div key={stat.type} className="stat-item-small">
                    <span className="stat-label">{stat.name}</span>
                    <span className="stat-value">{stat.count} x ({stat.seats} pl.)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-section">
              <div className="info-banner">
                <span className="info-icon">💡</span>
                <div className="info-text">
                  <strong>Astuce</strong><br />
                  Glissez-déposez les meubles depuis la liste vers la grille
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Grid Editor */}
          <div className="grid-panel">
            <div className="grid-header">
              <div className="grid-header-left">
                <span className="grid-label">Plan de la salle</span>
                <span className="grid-dimensions">{cols} × {rows}</span>
              </div>
              <div className="grid-header-right">
                <span className="grid-caption">
                  {dragMode ? "✨ Glissez sur la grille" : "📦 Drag & drop"}
                </span>
              </div>
            </div>
            <div 
              className="grid-container"
              ref={gridRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const rect = gridRef.current.getBoundingClientRect();
                const cellSize = 68;
                const x = Math.floor((e.clientX - rect.left) / cellSize) + 1;
                const y = Math.floor((e.clientY - rect.top) / cellSize) + 1;
                const type = e.dataTransfer.getData("type");
                if (type && x >= 1 && x <= cols && y >= 1 && y <= rows) {
                  addFurniture(type, x, y);
                }
                setDragMode(false);
              }}
            >
              <div 
                className="grid" 
                style={{
                  gridTemplateColumns: `repeat(${cols}, 68px)`,
                  gridTemplateRows: `repeat(${rows}, 68px)`
                }}
              >
                {Array(rows).fill().map((_, row) => (
                  Array(cols).fill().map((_, col) => {
                    const x = col + 1;
                    const y = row + 1;
                    const furnitureItem = getGridCell(x, y);
                    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
                    
                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`grid-cell ${furnitureItem ? "occupied" : ""} ${isHovered ? "hover" : ""}`}
                        style={{
                          background: furnitureItem ? FURNITURE_TYPES[furnitureItem.type]?.bgColor : "#f8fafc"
                        }}
                        onMouseEnter={() => setHoveredCell({ x, y })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {furnitureItem && (
                          <div 
                            className="grid-furniture"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("furnitureId", furnitureItem.id);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const draggedId = e.dataTransfer.getData("furnitureId");
                              if (draggedId && !getGridCell(x, y)) {
                                moveFurniture(parseInt(draggedId), x, y);
                              }
                            }}
                          >
                            <span className="furniture-emoji">
                              {FURNITURE_TYPES[furnitureItem.type]?.icon || "🪑"}
                            </span>
                            <button 
                              className="remove-furniture"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFurniture(furnitureItem.id);
                              }}
                            >
                              ✕
                            </button>
                            <span className="furniture-seats-count">{furnitureItem.seats}</span>
                          </div>
                        )}
                        <span className="grid-coord">{x},{y}</span>
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <div className="footer-actions">
            <button className="btn-cancel" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Annuler
            </button>
            <button className="btn-save" onClick={() => onSave(editedRoom)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}