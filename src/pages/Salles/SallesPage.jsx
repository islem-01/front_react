// SallesPage.jsx - Gestion des salles uniquement
import React, { useState, useEffect } from "react";
import RoomDesigner2D from '../../components/RoomDesigner2D';
import "./SallesPage.css";

// Générer 48 salles : 4 étages × 12 salles
// Générer 48 salles : 4 étages × 12 salles
const generateMockRooms = () => {
  const rooms = [];
  const etages = ["1er étage", "2ème étage", "3ème étage", "4ème étage"];
  
  for (let e = 0; e < etages.length; e++) {
    for (let s = 1; s <= 12; s++) {
      const capacite = Math.floor(Math.random() * (22 - 16 + 1)) + 16;
      const numSalle = s < 10 ? `0${s}` : `${s}`;
      
      rooms.push({
        id: `E${e + 1}_S${numSalle}`,
        name: `Salle ${numSalle}`,
        etage: etages[e],
        description: "",
        capacite: capacite,
        places: capacite,
        camera: null,
        planConfigured: false,
        tablesCount: 0,
        chaisesCount: capacite,
        createdAt: new Date().toISOString().split('T')[0],
        mobilier: null,
        cameraConfig: null
      });
    }
  }
  
  return rooms;
};

// Composant Carte Salle
function RoomCard({ room, onEdit, onOpenDesigner, onDelete }) {
  return (
    <div className="room-card">
      <div className="card-icon">
        <i className="fas fa-door-open"></i>
      </div>
      
      <div className="card-content">
        <h3 className="room-name">{room.name}</h3>
        <div className="room-details">
          <div className="detail">
            <i className="fas fa-building"></i>
            <span>{room.etage}</span>
          </div>
          <div className="detail">
            <i className="fas fa-chair"></i>
            <span>{room.capacite} places</span>
          </div>
          <div className="detail">
            <i className="fas fa-video"></i>
            <span>{room.camera || "Aucune caméra"}</span>
          </div>
          <div className="detail">
            <i className="fas fa-calendar-alt"></i>
            <span>Créée le {room.createdAt}</span>
          </div>
        </div>
        
        <div className={`plan-status ${room.planConfigured ? "configured" : "not-configured"}`}>
          <i className={`fas ${room.planConfigured ? "fa-check-circle" : "fa-times-circle"}`}></i>
          {room.planConfigured ? "Plan configuré" : "Plan non configuré"}
        </div>
        
        {room.description && (
          <p className="room-description">{room.description}</p>
        )}
      </div>
      
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(room)}>
          <i className="fas fa-edit"></i> Modifier
        </button>
        <button className="btn-designer" onClick={() => onOpenDesigner(room)}>
          <i className="fas fa-cube"></i> Ouvrir Designer
        </button>
        <button className="btn-delete" onClick={() => onDelete(room.id)}>
          <i className="fas fa-trash-alt"></i> Supprimer
        </button>
      </div>
    </div>
  );
}

// Modal d'ajout/modification de salle
function RoomModal({ room, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    etage: room?.etage || "1er étage",
    description: room?.description || "",
    camera: room?.camera || "",
    capacite: room?.capacite || 18
  });

  const etages = [ "1er étage", "2ème étage", "3ème étage","4ème étage" ];
  const cameras = ["Aucune", "CAM_RDC_01", "CAM_RDC_02", "CAM_ET1_01", "CAM_ET1_02", "CAM_ET2_01", "CAM_ET2_02", "CAM_ET3_01", "CAM_ET3_02"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Veuillez saisir un nom de salle");
      return;
    }
    onSave({
      ...formData,
      id: room?.id || `ROOM_${Date.now()}`,
      planConfigured: room?.planConfigured || false,
      createdAt: room?.createdAt || new Date().toISOString().split('T')[0],
      places: formData.capacite,
      tablesCount: 0,
      chaisesCount: formData.capacite,
      mobilier: room?.mobilier || null,
      cameraConfig: room?.cameraConfig || null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-door-open"></i> {room ? "Modifier la salle" : "Ajouter une salle"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label><i className="fas fa-tag"></i> Nom de la salle</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Salle 1.1" className="form-input" required />
            </div>
            <div className="form-group">
              <label><i className="fas fa-building"></i> Étage</label>
              <select value={formData.etage} onChange={e => setFormData({...formData, etage: e.target.value})} className="form-select">
                {etages.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><i className="fas fa-info-circle"></i> Description</label>
              <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Salle de TP Informatique" className="form-input" />
            </div>
            <div className="form-group">
              <label><i className="fas fa-chair"></i> Capacité (places)</label>
              <input type="number" value={formData.capacite} onChange={e => setFormData({...formData, capacite: parseInt(e.target.value)})} min="10" max="40" className="form-input" />
              <small className="form-hint">Capacité recommandée : 16 à 22 places</small>
            </div>
            <div className="form-group">
              <label><i className="fas fa-video"></i> Caméra associée</label>
              <select value={formData.camera} onChange={e => setFormData({...formData, camera: e.target.value === "Aucune" ? null : e.target.value})} className="form-select">
                {cameras.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">{room ? "Enregistrer" : "Créer la salle"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SallesPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEtage, setFilterEtage] = useState("all");

  useEffect(() => {
    const savedRooms = localStorage.getItem("rooms_config");
    
    setTimeout(() => {
      let mockRooms = generateMockRooms();
      if (savedRooms) {
        const parsed = JSON.parse(savedRooms);
        mockRooms = mockRooms.map(room => {
          const saved = parsed.find(r => r.id === room.id);
          return saved ? { ...room, ...saved } : room;
        });
      }
      setRooms(mockRooms);
      setLoading(false);
    }, 500);
  }, []);

  const saveRooms = (updatedRooms) => {
    setRooms(updatedRooms);
    localStorage.setItem("rooms_config", JSON.stringify(updatedRooms));
  };

  const stats = {
    total: rooms.length,
    disponibles: rooms.filter(r => !r.estOccupee).length,
    placesTotales: rooms.reduce((sum, r) => sum + r.capacite, 0),
    cameras: rooms.filter(r => r.camera).length
  };

  const filteredRooms = rooms.filter(room => {
    const matchSearch = room.name.toLowerCase().includes(search.toLowerCase()) ||
                        (room.description && room.description.toLowerCase().includes(search.toLowerCase()));
    const matchEtage = filterEtage === "all" || room.etage === filterEtage;
    return matchSearch && matchEtage;
  });

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowRoomModal(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleSaveRoom = (roomData) => {
    let updatedRooms;
    if (selectedRoom) {
      updatedRooms = rooms.map(r => r.id === selectedRoom.id ? { ...r, ...roomData } : r);
    } else {
      const newRoom = { ...roomData, id: `ROOM_${Date.now()}` };
      updatedRooms = [newRoom, ...rooms];
    }
    saveRooms(updatedRooms);
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm("Supprimer définitivement cette salle ?")) {
      const updatedRooms = rooms.filter(r => r.id !== id);
      saveRooms(updatedRooms);
    }
  };

  const handleOpenDesigner = (room) => {
    setSelectedRoom(room);
    setShowDesigner(true);
  };

const handleSaveDesigner = (updatedRoom) => {
  const updatedRooms = rooms.map(r => 
    r.id === updatedRoom.id ? updatedRoom : r
  );
  saveRooms(updatedRooms);
  setShowDesigner(false);
  setSelectedRoom(null);
};

  const uniqueEtages = ["all", ...new Set(rooms.map(r => r.etage))];

  if (loading) {
    return (
      <div className="salles-page loading">
        <div className="spinner"></div>
        <p>Chargement des salles...</p>
      </div>
    );
  }

  return (
    <div className="salles-page">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1><i className="fas fa-door-open"></i> Gestion des salles</h1>
          <p className="page-subtitle">Préparation et configuration des salles d'examen</p>
        </div>
        <button className="btn-add" onClick={handleAddRoom}>
          <i className="fas fa-plus"></i> Ajouter une salle
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><i className="fas fa-door-open"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total salles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.disponibles}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><i className="fas fa-chair"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.placesTotales}</div>
            <div className="stat-label">Places totales</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><i className="fas fa-video"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.cameras}</div>
            <div className="stat-label">Caméras</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Rechercher une salle..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="etage-filters">
          {uniqueEtages.map(etage => (
            <button key={etage} className={`etage-filter ${filterEtage === etage ? "active" : ""}`} onClick={() => setFilterEtage(etage)}>
              {etage === "all" ? "Tous les étages" : etage}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des salles */}
      {filteredRooms.length > 0 ? (
        <>
          <div className="rooms-grid">
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onEdit={handleEditRoom}
                onOpenDesigner={handleOpenDesigner}
                onDelete={handleDeleteRoom}
              />
            ))}
            <div className="add-card" onClick={handleAddRoom}>
              <div className="add-card-content">
                <i className="fas fa-plus-circle"></i>
                <h4>Ajouter une salle</h4>
                <p>Créer une nouvelle salle d'examen</p>
              </div>
            </div>
          </div>
          <div className="pagination-info">
            <i className="fas fa-door-open"></i>
            {filteredRooms.length} salle(s) affichée(s) sur {rooms.length}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-door-closed"></i>
          <h3>Aucune salle trouvée</h3>
          <p>Modifiez votre recherche ou ajoutez une nouvelle salle</p>
          <button className="btn-add" onClick={handleAddRoom}>Nouvelle salle</button>
        </div>
      )}

      {/* Modal Ajouter/Modifier salle */}
      {showRoomModal && (
        <RoomModal
          room={selectedRoom}
          onSave={handleSaveRoom}
          onClose={() => { setShowRoomModal(false); setSelectedRoom(null); }}
        />
      )}

      {/* Room Designer */}
      {showDesigner && selectedRoom && (
        <RoomDesigner2D
          room={selectedRoom}
          onSave={handleSaveDesigner}
          onClose={() => { setShowDesigner(false); setSelectedRoom(null); }}
        />
      )}
    </div>
  );
}