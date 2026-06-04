import React, { useState, useEffect } from "react";
import RoomEditor from "./RoomPlanner";
import RoomPlanner from "./RoomPlanner";
import "./SallesPage.css";

// Données mockées des salles
const mockRooms = [
  {
    id: 1,
    name: "Salle S3.11",
    floor: "Étage 3",
    building: "Bâtiment A",
    capacity: 32,
    tablesCount: 8,
    equipments: ["Projecteur", "Tableau blanc", "Climatisation", "WiFi"],
    status: "disponible",
    currentExam: null,
    nextExam: { name: "Architecture", date: "2026-03-25", time: "09:00-12:00" },
    furniture: [
      { id: 101, type: "large-table", x: 1, y: 1, seats: 4, students: [] },
      { id: 102, type: "large-table", x: 1, y: 3, seats: 4, students: [] },
      { id: 103, type: "large-table", x: 3, y: 1, seats: 4, students: [] },
      { id: 104, type: "large-table", x: 3, y: 3, seats: 4, students: [] },
      { id: 105, type: "large-table", x: 5, y: 1, seats: 4, students: [] },
      { id: 106, type: "large-table", x: 5, y: 3, seats: 4, students: [] },
      { id: 107, type: "large-table", x: 7, y: 1, seats: 4, students: [] },
      { id: 108, type: "large-table", x: 7, y: 3, seats: 4, students: [] },
    ],
    rows: 8,
    cols: 5
  },
  {
    id: 2,
    name: "Salle S2.08",
    floor: "Étage 2",
    building: "Bâtiment A",
    capacity: 40,
    tablesCount: 7,
    equipments: ["Projecteur", "Tableau blanc", "Climatisation"],
    status: "occupee",
    currentExam: { name: "Réseaux", time: "14:00-17:00" },
    nextExam: { name: "Sécurité", date: "2026-03-26", time: "08:00-11:00" },
    furniture: [
      { id: 201, type: "large-table", x: 2, y: 2, seats: 6, students: [] },
      { id: 202, type: "large-table", x: 2, y: 4, seats: 6, students: [] },
      { id: 203, type: "large-table", x: 4, y: 2, seats: 6, students: [] },
      { id: 204, type: "small-table", x: 4, y: 4, seats: 3, students: [] },
      { id: 205, type: "large-table", x: 6, y: 2, seats: 6, students: [] },
      { id: 206, type: "large-table", x: 6, y: 4, seats: 6, students: [] },
      { id: 207, type: "teacher-desk", x: 1, y: 1, seats: 1, students: [] },
    ],
    rows: 7,
    cols: 6
  },
  {
    id: 3,
    name: "Amphithéâtre A",
    floor: "Rez-de-chaussée",
    building: "Bâtiment B",
    capacity: 120,
    tablesCount: 30,
    equipments: ["Projecteur", "Sonorisation", "Climatisation", "Tableau interactif", "WiFi"],
    status: "disponible",
    currentExam: null,
    nextExam: null,
    furniture: [],
    rows: 10,
    cols: 12
  },
  {
    id: 4,
    name: "Labo Info",
    floor: "Étage 2",
    building: "Bâtiment C",
    capacity: 25,
    tablesCount: 25,
    equipments: ["Ordinateurs", "Projecteur", "Climatisation", "Tableau blanc", "WiFi"],
    status: "maintenance",
    currentExam: null,
    nextExam: null,
    furniture: [],
    rows: 5,
    cols: 5
  }
];

export default function SallesPage() {
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [filterStatus, setFilterStatus] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setShowEditor(true);
  };

  const handleViewPlanner = (room) => {
    setSelectedRoom(room);
    setShowPlanner(true);
  };

  const handleSaveRoom = (updatedRoom) => {
    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setShowEditor(false);
    setSelectedRoom(null);
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: Date.now(),
      name: "Nouvelle salle",
      floor: "Étage 1",
      building: "Bâtiment A",
      capacity: 30,
      tablesCount: 0,
      equipments: [],
      status: "disponible",
      currentExam: null,
      nextExam: null,
      furniture: [],
      rows: 6,
      cols: 5
    };
    setSelectedRoom(newRoom);
    setShowEditor(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "disponible":
        return <span className="status-badge available">🟢 Disponible</span>;
      case "occupee":
        return <span className="status-badge occupied">🔴 Occupée</span>;
      case "maintenance":
        return <span className="status-badge maintenance">🟡 Maintenance</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchStatus = filterStatus === "tous" || room.status === filterStatus;
    const matchSearch = !searchTerm || 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="salles-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏛️ Gestion des salles</h1>
          <p className="page-subtitle">Configurer et gérer toutes les salles d'examen</p>
        </div>
        <button className="btn-add-room" onClick={handleAddRoom}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle salle
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${filterStatus === "tous" ? "active" : ""}`} onClick={() => setFilterStatus("tous")}>Toutes</button>
          <button className={`filter-tab ${filterStatus === "disponible" ? "active" : ""}`} onClick={() => setFilterStatus("disponible")}>Disponibles</button>
          <button className={`filter-tab ${filterStatus === "occupee" ? "active" : ""}`} onClick={() => setFilterStatus("occupee")}>Occupées</button>
          <button className={`filter-tab ${filterStatus === "maintenance" ? "active" : ""}`} onClick={() => setFilterStatus("maintenance")}>Maintenance</button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-info">
            <div className="stat-value">{rooms.length}</div>
            <div className="stat-label">Total salles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <div className="stat-value">{rooms.filter(r => r.status === "disponible").length}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <div className="stat-value">{rooms.filter(r => r.status === "occupee").length}</div>
            <div className="stat-label">Occupées</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🪑</div>
          <div className="stat-info">
            <div className="stat-value">{rooms.reduce((sum, r) => sum + r.capacity, 0)}</div>
            <div className="stat-label">Places totales</div>
          </div>
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-card-header">
              <div>
                <h3 className="room-name">{room.name}</h3>
                <span className="room-location">{room.building} • {room.floor}</span>
              </div>
              {getStatusBadge(room.status)}
            </div>

            <div className="room-stats">
              <div className="room-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>{room.capacity} places</span>
              </div>
              <div className="room-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span>{room.tablesCount} tables</span>
              </div>
            </div>

            <div className="room-equipments">
              {room.equipments.slice(0, 3).map(eq => (
                <span key={eq} className="equipment-tag">{eq}</span>
              ))}
              {room.equipments.length > 3 && (
                <span className="equipment-tag more">+{room.equipments.length - 3}</span>
              )}
            </div>

            {room.currentExam && (
              <div className="current-exam">
                <div className="exam-label">En cours:</div>
                <div className="exam-name">{room.currentExam.name}</div>
                <div className="exam-time">{room.currentExam.time}</div>
              </div>
            )}

            {room.nextExam && !room.currentExam && (
              <div className="next-exam">
                <div className="exam-label">Prochain examen:</div>
                <div className="exam-name">{room.nextExam.name}</div>
                <div className="exam-time">{room.nextExam.date} • {room.nextExam.time}</div>
              </div>
            )}

            <div className="room-actions">
              <button className="btn-planner" onClick={() => handleViewPlanner(room)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                Plan
              </button>
              <button className="btn-config" onClick={() => handleEditRoom(room)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.59 13.41l-6.17 6.17a2 2 0 01-1.42.59H5a2 2 0 01-2-2v-8a2 2 0 01.59-1.42l6.17-6.17a2 2 0 012.83 0l7.24 7.24a2 2 0 010 2.83z"/>
                  <line x1="16.5" y1="9.5" x2="7.5" y2="18.5"/>
                </svg>
                Configurer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEditor && selectedRoom && (
        <RoomEditor
          room={selectedRoom}
          onSave={handleSaveRoom}
          onClose={() => setShowEditor(false)}
        />
      )}

      {showPlanner && selectedRoom && (
        <RoomPlanner
          room={selectedRoom}
          onClose={() => setShowPlanner(false)}
        />
      )}
    </div>
  );
}