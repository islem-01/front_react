import React, { useState } from "react";
import RoomEditor3D from "./RoomEditor3D";
import "./SallesPage.css";

/* ── Mock data ── */
const initialRooms = [
  {
    id: 1, name: "Salle S3.11", floor: "Étage 3",
    physicalCapacity: 30, examCapacity: 30, tables: 6,
    exam: "Algorithmique & Programmation", status: "en-cours",
    time: "09:00 – 12:00", live: true,
    niveau: "L1", specialite: "Génie Logiciel",
    groupes: ["Groupe A", "Groupe B"],
    enseignant: "Prof. Kamel Mansouri",
    placedCount: 28, aiEngine: "ResNet50",
    camera: "IIT-Etage3-S3.11-EXT2",
  },
  {
    id: 2, name: "Salle S2.08", floor: "Étage 2",
    physicalCapacity: 40, examCapacity: 40, tables: 7,
    exam: "Réseaux Informatiques", status: "termine",
    time: "14:00 – 17:00", live: false,
    niveau: "L2", specialite: "Réseaux & Sécurité",
    groupes: ["Groupe A"],
    enseignant: "Prof. Salma Bouaziz",
    placedCount: 35, aiEngine: "ResNet50",
    camera: "IIT-Etage2-S2.08-EXT1",
  },
  {
    id: 3, name: "Salle S1.04", floor: "Étage 1",
    physicalCapacity: 25, examCapacity: 25, tables: 5,
    exam: "Base de données", status: "programme",
    time: "09:00 – 11:00", live: false,
    niveau: "L3", specialite: "Génie Logiciel",
    groupes: ["Groupe A"],
    enseignant: "Dr. Ines Trabelsi",
    placedCount: 0, aiEngine: "ResNet50",
    camera: "IIT-Etage1-S1.04-EXT1",
  },
];

function StatusBadge({ status }) {
  if (status === "en-cours") return (
    <span className="status-badge live">
      <span className="live-dot"></span>
      En direct
    </span>
  );
  if (status === "termine") return <span className="status-badge done">Terminé</span>;
  return <span className="status-badge scheduled">Programmé</span>;
}

function RoomCard({ room, onEdit, onDelete }) {
  const occupancyRate = Math.round((room.placedCount / room.physicalCapacity) * 100);

  return (
    <div className={`room-card ${room.status === "en-cours" ? "live" : ""}`}>
      {/* Header */}
      <div className="card-header">
        <div className="room-info">
          <div className="room-icon">
            <i className="fas fa-door-open"></i>
          </div>
          <div>
            <h3 className="room-name">{room.name}</h3>
            <p className="room-location">{room.floor} · IIT Tunis</p>
          </div>
        </div>
        <StatusBadge status={room.status} />
      </div>

      {/* AI Status */}
      <div className="ai-status">
        <div className={`ai-indicator ${room.live ? "active" : "idle"}`}>
          <i className="fas fa-microchip"></i>
          <span>{room.live ? "Surveillance active" : "En veille"}</span>
        </div>
        <span className="camera-ref">
          <i className="fas fa-video"></i> {room.camera}
        </span>
      </div>

      {/* Exam Details */}
      <div className="exam-details">
        <div className="detail-row">
          <i className="fas fa-book-open"></i>
          <span className="detail-label">Examen:</span>
          <strong>{room.exam}</strong>
        </div>
        <div className="detail-row">
          <i className="fas fa-graduation-cap"></i>
          <span className="detail-label">Filière:</span>
          <span>{room.niveau} · {room.specialite}</span>
        </div>
        <div className="detail-row">
          <i className="fas fa-chalkboard-user"></i>
          <span className="detail-label">Enseignant:</span>
          <span>{room.enseignant}</span>
        </div>
        <div className="detail-row">
          <i className="fas fa-users"></i>
          <span className="detail-label">Groupes:</span>
          <span>{room.groupes.join(", ")}</span>
        </div>
        {room.live && (
          <div className="detail-row">
            <i className="fas fa-clock"></i>
            <span className="detail-label">Horaire:</span>
            <span className="live-time">{room.time}</span>
          </div>
        )}
      </div>

      {/* Occupancy */}
      <div className="occupancy-section">
        <div className="occupancy-header">
          <span className="occupancy-label">Occupation</span>
          <span className="occupancy-value">{room.placedCount} / {room.physicalCapacity} places</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${occupancyRate}%`,
              background: occupancyRate > 80 ? "#10b981" : occupancyRate > 40 ? "#f59e0b" : "#3b82f6"
            }}
          />
        </div>
        <div className="occupancy-percentage">{occupancyRate}%</div>
      </div>

      {/* Tags */}
      <div className="room-tags">
        <span className="tag"><i className="fas fa-chair"></i> {room.tables} tables</span>
        <span className="tag"><i className="fas fa-users"></i> {room.physicalCapacity} places</span>
        <span className="tag"><i className="fas fa-layer-group"></i> {room.niveau}</span>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(room)}>
          <i className="fas fa-cog"></i>
          Configurer
        </button>
        {room.live && (
          <button className="btn-monitor">
            <i className="fas fa-eye"></i>
            Surveiller
          </button>
        )}
        <button className="btn-delete" onClick={() => onDelete(room.id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

export default function SallesPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const stats = {
    total: rooms.length,
    enCours: rooms.filter(r => r.status === "en-cours").length,
    programmees: rooms.filter(r => r.status === "programme").length,
    placesTotales: rooms.reduce((sum, r) => sum + r.physicalCapacity, 0)
  };

  const handleEdit = (room) => { setSelectedRoom(room); setShowEditor(true); };
  const handleDelete = (id) => setRooms(r => r.filter(x => x.id !== id));
  const handleAdd = () => {
    const newRoom = {
      id: Date.now(), name: "Nouvelle salle", floor: "Étage 1",
      physicalCapacity: 30, examCapacity: 30, tables: 5,
      exam: "—", status: "programme", time: "— – —", live: false,
      niveau: "L1", specialite: "Génie Logiciel", groupes: ["Groupe A"],
      enseignant: "—", placedCount: 0, aiEngine: "ResNet50",
      camera: "IIT-EXT-NEW",
    };
    setSelectedRoom(newRoom);
    setShowEditor(true);
  };
  const handleSave = (updated) => {
    setRooms(prev => {
      const exists = prev.find(r => r.id === updated.id);
      if (exists) return prev.map(r => r.id === updated.id ? { ...r, ...updated } : r);
      return [...prev, updated];
    });
    setShowEditor(false);
    setSelectedRoom(null);
  };

  const filtered = rooms.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.exam.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="salles-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1></h1>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus"></i>
          Nouvelle salle
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher une salle ou un examen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {[
            { value: "all", label: "Toutes", icon: "fas fa-th-large" },
            { value: "en-cours", label: "En cours", icon: "fas fa-play-circle" },
            { value: "programme", label: "Programmées", icon: "fas fa-clock" },
            { value: "termine", label: "Terminées", icon: "fas fa-check-circle" },
          ].map(filter => (
            <button
              key={filter.value}
              className={`filter-tab ${filterStatus === filter.value ? "active" : ""}`}
              onClick={() => setFilterStatus(filter.value)}
            >
              <i className={filter.icon}></i>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="rooms-grid">
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            <div className="add-card" onClick={handleAdd}>
              <div className="add-card-content">
                <i className="fas fa-plus-circle add-icon"></i>
                <h4>Ajouter une salle</h4>
                <p>Configurer un nouveau plan d'examen</p>
              </div>
            </div>
          </div>
          <div className="pagination-info">
            <i className="fas fa-door-open"></i>
            {filtered.length} salle(s) affichée(s) sur {rooms.length}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-door-closed"></i>
          </div>
          <h3>Aucune salle trouvée</h3>
          <p>Modifiez votre recherche ou ajoutez une nouvelle salle</p>
          <button className="btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Nouvelle salle
          </button>
        </div>
      )}

      {/* 3D Editor Modal */}
      {showEditor && selectedRoom && (
        <RoomEditor3D
          room={selectedRoom}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setSelectedRoom(null); }}
        />
      )}
    </div>
  );
}