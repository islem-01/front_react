import React, { useState, useCallback, useMemo } from "react";
import "./RoomEditor3D.css";

/* ============================================================
   CONSTANTS & UTILS
   ============================================================ */
const CELL = 52;
const ISO_X = 0.86;
const ISO_Y = 0.5;
const ROOM_COLS = 11;
const ROOM_ROWS = 8;

// Structure hiérarchique des données académiques
const ACADEMIC_DATA = {
  // 1er cycle - Licence
  "L1": {
    name: "1ère Année Licence",
    specialites: [
      { id: "GL", name: "Génie Logiciel", groupes: ["Groupe A", "Groupe B", "Groupe C", "Groupe D"] },
      { id: "RS", name: "Réseaux & Sécurité", groupes: ["Groupe A", "Groupe B"] },
      { id: "IA", name: "Intelligence Artificielle", groupes: ["Groupe A", "Groupe B"] },
      { id: "INF", name: "Informatique Générale", groupes: ["Groupe A", "Groupe B", "Groupe C"] }
    ]
  },
  "L2": {
    name: "2ème Année Licence",
    specialites: [
      { id: "GL", name: "Génie Logiciel", groupes: ["Groupe A", "Groupe B", "Groupe C"] },
      { id: "RS", name: "Réseaux & Sécurité", groupes: ["Groupe A", "Groupe B"] },
      { id: "IA", name: "Intelligence Artificielle", groupes: ["Groupe A", "Groupe B"] }
    ]
  },
  "L3": {
    name: "3ème Année Licence",
    specialites: [
      { id: "GL", name: "Génie Logiciel", groupes: ["Groupe A", "Groupe B", "Groupe C"] },
      { id: "RS", name: "Réseaux & Sécurité", groupes: ["Groupe A", "Groupe B"] }
    ]
  },
  
  // 2ème cycle - Master
  "M1": {
    name: "1ère Année Master",
    specialites: [
      { id: "DS", name: "Data Science", groupes: ["Groupe A", "Groupe B"] },
      { id: "CYBER", name: "Cybersécurité", groupes: ["Groupe A", "Groupe B"] },
      { id: "ARCHI", name: "Architecture Logicielle", groupes: ["Groupe A"] }
    ]
  },
  "M2": {
    name: "2ème Année Master",
    specialites: [
      { id: "DS", name: "Data Science", groupes: ["Groupe A", "Groupe B"] },
      { id: "CYBER", name: "Cybersécurité", groupes: ["Groupe A"] }
    ]
  },
  
  // Cycle Ingénieur (2ème cycle comme demandé)
  "ING1": {
    name: "1ère Année Cycle Ingénieur",
    specialites: [
      { id: "GLID", name: "Génie Logiciel et Innovation Digitale", groupes: ["Classe 1", "Classe 2", "Classe 3", "Classe 4", "Classe 5", "Classe 6"] },
      { id: "ARSI", name: "Architecture des Réseaux et Sécurité Informatique", groupes: ["Classe 1"] }
    ]
  },
  "ING2": {
    name: "2ème Année Cycle Ingénieur",
    specialites: [
      { id: "GLID", name: "Génie Logiciel et Innovation Digitale", groupes: ["Classe 1", "Classe 2", "Classe 3", "Classe 4", "Classe 5", "Classe 6"] },
      { id: "ARSI", name: "Architecture des Réseaux et Sécurité Informatique", groupes: ["Classe 1"] }
    ]
  },
  "ING3": {
    name: "3ème Année Cycle Ingénieur",
    specialites: [
      { id: "GLID", name: "Génie Logiciel et Innovation Digitale", groupes: ["Classe 1", "Classe 2", "Classe 3", "Classe 4", "Classe 5", "Classe 6"] },
      { id: "ARSI", name: "Architecture des Réseaux et Sécurité Informatique", groupes: ["Classe 1"] }
    ]
  }
};

// Liste des niveaux pour les selects
const ACADEMIC_LEVELS = [
  { id: "L1", name: "1ère Année Licence" },
  { id: "L2", name: "2ème Année Licence" },
  { id: "L3", name: "3ème Année Licence" },
  { id: "M1", name: "1ère Année Master" },
  { id: "M2", name: "2ème Année Master" },
  { id: "ING1", name: "1ère Année Cycle Ingénieur" },
  { id: "ING2", name: "2ème Année Cycle Ingénieur" },
  { id: "ING3", name: "3ème Année Cycle Ingénieur" }
];

const AI_STATUS = { OK: "ok", SUSPECT: "sus", ABNORMAL: "bad" };
const AI_STATUS_CONFIG = {
  [AI_STATUS.OK]: { label: "Normal", color: "#22c55e", icon: "✓" },
  [AI_STATUS.SUSPECT]: { label: "Suspect", color: "#f59e0b", icon: "◉" },
  [AI_STATUS.ABNORMAL]: { label: "Anormal", color: "#ef4444", icon: "⚠" }
};

// Salles disponibles
const AVAILABLE_ROOMS = [
  { id: 1, name: "Salle S3.11", floor: "Étage 3", physicalCapacity: 30, tables: 6 },
  { id: 2, name: "Salle S2.08", floor: "Étage 2", physicalCapacity: 40, tables: 7 },
  { id: 3, name: "Salle S1.04", floor: "Étage 1", physicalCapacity: 25, tables: 5 },
  { id: 4, name: "Salle S4.02", floor: "Étage 4", physicalCapacity: 35, tables: 6 },
  { id: 5, name: "Salle S0.05", floor: "RDC", physicalCapacity: 20, tables: 4 },
  { id: 6, name: "Amphi A", floor: "RDC", physicalCapacity: 120, tables: 24 },
  { id: 7, name: "Amphi B", floor: "RDC", physicalCapacity: 100, tables: 20 }
];

// Génération des étudiants mockés basée sur la structure
const generateMockStudentsByLevel = (niveauId, specialiteId, groupeName) => {
  const students = [];
  const levelData = ACADEMIC_DATA[niveauId];
  const specialite = levelData?.specialites.find(s => s.id === specialiteId);
  
  if (!specialite) return [];
  
  // Nombre d'étudiants par groupe (entre 20 et 35)
  const studentCount = specialiteId === "GLID" ? 35 : 
                       specialiteId === "ARSI" ? 25 : 
                       Math.floor(Math.random() * 15) + 20;
  
  const prenoms = ["Ahmed", "Sofia", "Yassine", "Nadia", "Karim", "Leila", "Oussama", "Amira", "Mohamed", "Ines", 
                   "Hichem", "Fatima", "Rami", "Mariem", "Omar", "Syrine", "Wassim", "Nour", "Fares", "Eya"];
  const noms = ["Ben Ali", "Touati", "Khelil", "Mansouri", "Bennour", "Saidi", "Hamdi", "Chenini", "Salah", "Trabelsi",
                "Jaouadi", "Zahra", "Gharbi", "Mabrouk", "Chakroun", "Dridi", "Marzouk", "Ayari", "Bouaziz"];
  const colors = ["#1d4ed8", "#7c3aed", "#b45309", "#0f766e", "#dc2626", "#059669", "#d97706", "#4f46e5"];
  
  for (let i = 1; i <= studentCount; i++) {
    const prenom = prenoms[i % prenoms.length];
    const nom = noms[i % noms.length];
    students.push({
      id: `${specialiteId}${String(i).padStart(3, '0')}`,
      nom: `${prenom} ${nom}`,
      niveau: levelData.name,
      niveauId: niveauId,
      specialite: specialite.name,
      specialiteId: specialiteId,
      grp: groupeName,
      init: prenom[0] + nom[0],
      col: colors[i % colors.length],
      seat: null,
      aiStatus: null
    });
  }
  return students;
};

// Tous les étudiants mockés initiaux (pour démo)
const MOCK_STUDENTS_BASE = [
  ...generateMockStudentsByLevel("ING1", "GLID", "Classe 1"),
  ...generateMockStudentsByLevel("ING1", "GLID", "Classe 2"),
  ...generateMockStudentsByLevel("ING1", "ARSI", "Classe 1")
];

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
const toIso = (col, row) => ({
  x: (col - row) * CELL * ISO_X,
  y: (col + row) * CELL * ISO_Y,
});

const buildDefaultDesks = () => [
  { id: "T1", col: 1, row: 1, seatsPerSide: 3, orientation: "h", seats: [] },
  { id: "T2", col: 1, row: 3, seatsPerSide: 3, orientation: "h", seats: [] },
  { id: "T3", col: 1, row: 5, seatsPerSide: 3, orientation: "h", seats: [] },
  { id: "T4", col: 6, row: 1, seatsPerSide: 3, orientation: "h", seats: [] },
  { id: "T5", col: 6, row: 3, seatsPerSide: 3, orientation: "h", seats: [] },
  { id: "T6", col: 6, row: 5, seatsPerSide: 3, orientation: "h", seats: [] },
];

const generateSeatId = (deskId, side, index) => `${deskId}-${side}${index + 1}`;

/* ============================================================
   HOOKS
   ============================================================ */
const useHistory = () => {
  const [history, setHistory] = useState([]);
  
  const addHistory = useCallback((action, label, changedBy = "Admin") => {
    setHistory(prev => [{
      action,
      label,
      time: new Date().toLocaleTimeString(),
      changedBy,
    }, ...prev].slice(0, 50));
  }, []);
  
  return { history, addHistory };
};

const useSeatManagement = (desks, initialStudents) => {
  const [students, setStudents] = useState(initialStudents);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedDesk, setSelectedDesk] = useState(null);
  
  const allSeats = useMemo(() => {
    const seats = [];
    desks.forEach(desk => {
      for (let i = 0; i < desk.seatsPerSide; i++) {
        seats.push(generateSeatId(desk.id, "T", i));
        seats.push(generateSeatId(desk.id, "B", i));
      }
    });
    return seats;
  }, [desks]);
  
  const getFreeSeats = useCallback(() => {
    const occupiedSeats = students.filter(s => s.seat).map(s => s.seat);
    return allSeats.filter(seat => !occupiedSeats.includes(seat));
  }, [students, allSeats]);
  
  const getStudentAtSeat = useCallback((seatId) => {
    return students.find(s => s.seat === seatId);
  }, [students]);
  
  const assignStudent = useCallback((seatId, studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return false;
    
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, seat: seatId, aiStatus: AI_STATUS.OK } : s
    ));
    return true;
  }, [students]);
  
  const removeStudent = useCallback((seatId) => {
    const student = students.find(s => s.seat === seatId);
    if (!student) return false;
    
    setStudents(prev => prev.map(s =>
      s.seat === seatId ? { ...s, seat: null, aiStatus: null } : s
    ));
    return true;
  }, [students]);
  
  const autoPlace = useCallback(() => {
    const unplaced = students.filter(s => !s.seat);
    const freeSeats = getFreeSeats();
    const newStudents = [...students];
    
    unplaced.forEach((student, idx) => {
      if (freeSeats[idx]) {
        const studentIdx = newStudents.findIndex(s => s.id === student.id);
        newStudents[studentIdx] = { ...newStudents[studentIdx], seat: freeSeats[idx], aiStatus: AI_STATUS.OK };
      }
    });
    
    setStudents(newStudents);
    return { placed: Math.min(unplaced.length, freeSeats.length), total: unplaced.length };
  }, [students, getFreeSeats]);
  
  const clearAllPlacements = useCallback(() => {
    setStudents(prev => prev.map(s => ({ ...s, seat: null, aiStatus: null })));
    setSelectedSeat(null);
    setSelectedDesk(null);
  }, []);
  
  const handleSeatClick = useCallback((seatId, desk) => {
    setSelectedSeat(seatId);
    setSelectedDesk(desk);
  }, []);
  
  const closeSeatPanel = useCallback(() => {
    setSelectedSeat(null);
    setSelectedDesk(null);
  }, []);
  
  const placedCount = students.filter(s => s.seat).length;
  const totalSeats = allSeats.length;
  
  return {
    students,
    selectedSeat,
    selectedDesk,
    placedCount,
    totalSeats,
    assignStudent,
    removeStudent,
    autoPlace,
    clearAllPlacements,
    handleSeatClick,
    closeSeatPanel,
    getStudentAtSeat,
    getFreeSeats,
  };
};

/* ============================================================
   COMPONENTS
   ============================================================ */
const StepIndicator = ({ steps, currentStep, onStepChange }) => (
  <div className="re3d-steps">
    {steps.map(({ number, label }) => (
      <button
        key={number}
        className={`re3d-step-btn ${currentStep === number ? "active" : currentStep > number ? "done" : ""}`}
        onClick={() => onStepChange(number)}
      >
        <span className="re3d-step-num">{currentStep > number ? "✓" : number}</span>
        {label}
      </button>
    ))}
  </div>
);

// Composant ConfigStep avec la logique hiérarchique
const ConfigStep = ({ config, setConfig, desks, totalSeats, placedCount, onNext }) => {
  // Obtenir les spécialités du niveau sélectionné
  const currentLevelData = ACADEMIC_DATA[config.niveauId];
  const specialites = currentLevelData?.specialites || [];
  
  // Obtenir les groupes de la spécialité sélectionnée
  const currentSpecialite = specialites.find(s => s.id === config.specialiteId);
  const groupes = currentSpecialite?.groupes || [];
  
  // Mise à jour du niveau
  const handleNiveauChange = (niveauId) => {
    const newLevelData = ACADEMIC_DATA[niveauId];
    const firstSpecialite = newLevelData?.specialites[0];
    setConfig({
      ...config,
      niveauId: niveauId,
      niveau: newLevelData?.name || "",
      specialiteId: firstSpecialite?.id || "",
      specialite: firstSpecialite?.name || "",
      groupe: firstSpecialite?.groupes[0] || ""
    });
  };
  
  // Mise à jour de la spécialité
  const handleSpecialiteChange = (specialiteId) => {
    const newSpecialite = specialites.find(s => s.id === specialiteId);
    setConfig({
      ...config,
      specialiteId: specialiteId,
      specialite: newSpecialite?.name || "",
      groupe: newSpecialite?.groupes[0] || ""
    });
  };
  
  // Mise à jour du groupe
  const handleGroupeChange = (groupe) => {
    setConfig({ ...config, groupe });
  };
  
  const handleRoomChange = (roomName) => {
    const selectedRoom = AVAILABLE_ROOMS.find(r => r.name === roomName);
    if (selectedRoom) {
      setConfig({
        ...config,
        name: selectedRoom.name,
        floor: selectedRoom.floor,
        physicalCapacity: selectedRoom.physicalCapacity,
      });
    } else if (roomName === "autre") {
      setConfig({ ...config, name: "autre", customName: "" });
    }
  };

  return (
    <div className="re3d-step-config">
      <div className="re3d-config-grid">
        {/* Bloc Salle */}
        <div className="re3d-config-bloc">
          <div className="re3d-config-bloc-title">
            <span className="re3d-bloc-icon"></span>
            Informations de la salle
          </div>
          <div className="re3d-form-row">
            <label>Nom de la salle</label>
            <select 
              value={config.name} 
              onChange={(e) => handleRoomChange(e.target.value)} 
              className="re3d-select"
            >
              {AVAILABLE_ROOMS.map(room => (
                <option key={room.id} value={room.name}>
                  {room.name} - {room.floor} ({room.physicalCapacity} places)
                </option>
              ))}
              <option value="autre">+ Ajouter une nouvelle salle...</option>
            </select>
          </div>
          {config.name === "autre" && (
            <div className="re3d-form-row">
              <label>Nom personnalisé</label>
              <input 
                value={config.customName || ""} 
                onChange={e => setConfig({ ...config, customName: e.target.value, name: e.target.value })} 
                className="re3d-input" 
                placeholder="Entrez le nom de la salle"
              />
            </div>
          )}
          <div className="re3d-form-row">
            <label>Étage</label>
            <select 
              value={config.floor} 
              onChange={e => setConfig({ ...config, floor: e.target.value })} 
              className="re3d-select"
            >
              <option>Étage 1</option>
              <option>Étage 2</option>
              <option>Étage 3</option>
              <option>Étage 4</option>
              <option>RDC</option>
            </select>
          </div>
          <div className="re3d-form-row">
            <label>Capacité physique</label>
            <input 
              type="number" 
              value={config.physicalCapacity} 
              min={10} 
              max={120}
              onChange={e => setConfig({ ...config, physicalCapacity: +e.target.value })} 
              className="re3d-input"
            />
          </div>
          <div className="re3d-form-row">
            <label>Examen / Module</label>
            <input 
              value={config.exam} 
              onChange={e => setConfig({ ...config, exam: e.target.value })} 
              className="re3d-input"
              placeholder="Ex: Algorithmique & Programmation"
            />
          </div>
          <div className="re3d-form-row-2">
            <div>
              <label>Date</label>
              <input 
                type="date" 
                value={config.date} 
                onChange={e => setConfig({ ...config, date: e.target.value })} 
                className="re3d-input"
              />
            </div>
            <div>
              <label>Heure début</label>
              <input 
                type="time" 
                value={config.heureDebut} 
                onChange={e => setConfig({ ...config, heureDebut: e.target.value })} 
                className="re3d-input"
              />
            </div>
            <div>
              <label>Heure fin</label>
              <input 
                type="time" 
                value={config.heureFin} 
                onChange={e => setConfig({ ...config, heureFin: e.target.value })} 
                className="re3d-input"
              />
            </div>
          </div>
        </div>

        {/* Bloc Académique - avec hiérarchie niveau → spécialité → groupe */}
        <div className="re3d-config-bloc">
          <div className="re3d-config-bloc-title">
            <span className="re3d-bloc-icon"></span>
            Hiérarchie académique
          </div>
          
          
          {/* Sélection du Niveau */}
          <div className="re3d-form-row">
            <label>Niveau</label>
            <select 
              value={config.niveauId} 
              onChange={(e) => handleNiveauChange(e.target.value)} 
              className="re3d-select"
            >
              {ACADEMIC_LEVELS.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
          
          {/* Sélection de la Spécialité (dépend du niveau) */}
          <div className="re3d-form-row">
            <label>Spécialité</label>
            <select 
              value={config.specialiteId} 
              onChange={(e) => handleSpecialiteChange(e.target.value)} 
              className="re3d-select"
              disabled={specialites.length === 0}
            >
              {specialites.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>
          
          {/* Sélection du Groupe (dépend de la spécialité) */}
          <div className="re3d-form-row">
            <label>Groupe / Classe</label>
            <select 
              value={config.groupe} 
              onChange={(e) => handleGroupeChange(e.target.value)} 
              className="re3d-select"
              disabled={groupes.length === 0}
            >
              {groupes.map(grp => (
                <option key={grp} value={grp}>{grp}</option>
              ))}
            </select>
          </div>
          
          {/* Affichage récapitulatif des sélections */}
          <div className="re3d-config-chip-row">
            <span className="re3d-chip re3d-chip-blue">{currentLevelData?.name || config.niveau}</span>
            <span className="re3d-chip re3d-chip-purple">{currentSpecialite?.name || config.specialite}</span>
            <span className="re3d-chip re3d-chip-gray">{config.groupe}</span>
          </div>
          
          
        </div>

        {/* Bloc Enseignant */}
        <div className="re3d-config-bloc">
          <div className="re3d-config-bloc-title">
            <span className="re3d-bloc-icon"></span>
            Enseignant surveillant
          </div>
          <div className="re3d-form-row">
            <label>Surveillant principal</label>
            <select 
              value={config.enseignant} 
              onChange={e => setConfig({ ...config, enseignant: e.target.value })} 
              className="re3d-select"
            >
              <option value="">— Sélectionner —</option>
              <option>Prof. Kamel Mansouri</option>
              <option>Prof. Salma Bouaziz</option>
              <option>Prof. Walid Ferchichi</option>
              <option>Dr. Ines Trabelsi</option>
              <option>Dr. Nadia Khelifa</option>
            </select>
          </div>
          <div className="re3d-form-row">
            <label>Co-surveillant (optionnel)</label>
            <select 
              value={config.coSurveillant} 
              onChange={e => setConfig({ ...config, coSurveillant: e.target.value })} 
              className="re3d-select"
            >
              <option value="">— Optionnel —</option>
              <option>Prof. Sami Rejeb</option>
              <option>Prof. Lina Chaabane</option>
              <option>Dr. Mehdi Bouaziz</option>
            </select>
          </div>
          
        
        </div>

       
        
      </div>
      <div className="re3d-step-footer">
        <button className="re3d-btn-primary" onClick={onNext}>
          Continuer vers le Plan 3D →
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENT: SeatPanel (simplifié)
   ============================================================ */
const SeatPanel = ({ seatId, deskInfo, students, allStudents, onAssign, onRemove, onClose }) => {
  const current = students.find(s => s.seat === seatId);
  const unplaced = allStudents.filter(s => !students.find(x => x.id === s.id && x.seat));

  return (
    <div className="re3d-seat-panel">
      <div className="re3d-seat-panel-header">
        <div>
          <div className="re3d-seat-id">{seatId}</div>
          <div className="re3d-seat-desk">Table {deskInfo?.id}</div>
        </div>
        <button className="re3d-close-btn" onClick={onClose}>✕</button>
      </div>

      {current ? (
        <div className="re3d-assigned">
          <div className="re3d-stu-card">
            <div className="re3d-stu-av" style={{ background: current.col + "22", color: current.col }}>
              {current.init}
            </div>
            <div>
              <div className="re3d-stu-name">{current.nom}</div>
              <div className="re3d-stu-meta">{current.id} · {current.specialite} · {current.grp}</div>
            </div>
          </div>
          <button className="re3d-btn-remove" onClick={() => onRemove(seatId)}>
            Retirer de la place
          </button>
        </div>
      ) : (
        <div className="re3d-unassigned">
          <div className="re3d-seat-empty-label">Place libre — Affecter un étudiant :</div>
          <div className="re3d-student-list">
            {unplaced.slice(0, 10).map(s => (
              <div key={s.id} className="re3d-stu-row" onClick={() => onAssign(seatId, s.id)}>
                <div className="re3d-stu-av-sm" style={{ background: s.col + "22", color: s.col }}>
                  {s.init}
                </div>
                <div className="re3d-stu-row-info">
                  <div className="re3d-stu-row-name">{s.nom}</div>
                  <div className="re3d-stu-row-meta">{s.id} · {s.grp}</div>
                </div>
                <span className="re3d-assign-icon">→</span>
              </div>
            ))}
            {unplaced.length === 0 && (
              <div className="re3d-no-students">Tous les étudiants sont placés</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   COMPONENT: Room3DCanvas (simplifié)
   ============================================================ */
const Room3DCanvas = () => {
  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      borderRadius: "12px"
    }}>
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏛️</div>
        <div>Vue 3D de la salle</div>
        <div style={{ fontSize: "12px", marginTop: "8px" }}>Interface isométrique</div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT: RoomEditor3D
   ============================================================ */
export default function RoomEditor3D({ room, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: room?.name || "Salle S3.11",
    floor: room?.floor || "Étage 3",
    niveauId: "ING1",
    niveau: "1ère Année Cycle Ingénieur",
    specialiteId: "GLID",
    specialite: "Génie Logiciel et Innovation Digitale",
    groupe: "Classe 1",
    enseignant: "Prof. Kamel Mansouri",
    coSurveillant: "",
    exam: "Algorithmique & Programmation",
    date: "2026-05-20",
    heureDebut: "09:00",
    heureFin: "12:00",
    physicalCapacity: 30,
  });
  
  const [desks] = useState(buildDefaultDesks);
  const [sideTab, setSideTab] = useState("students");
  const [filterGrp, setFilterGrp] = useState("all");
  
  // Générer les étudiants en fonction de la configuration sélectionnée
  const initialStudents = useMemo(() => {
    return generateMockStudentsByLevel(config.niveauId, config.specialiteId, config.groupe);
  }, [config.niveauId, config.specialiteId, config.groupe]);
  
  const { history, addHistory } = useHistory();
  const {
    students,
    selectedSeat,
    selectedDesk,
    placedCount,
    totalSeats,
    assignStudent,
    removeStudent,
    autoPlace,
    clearAllPlacements,
    handleSeatClick,
    closeSeatPanel,
    getStudentAtSeat,
  } = useSeatManagement(desks, initialStudents);
  
  const handleAssignWithHistory = (seatId, studentId) => {
    const student = students.find(s => s.id === studentId);
    if (assignStudent(seatId, studentId)) {
      addHistory("assign", `${student?.nom} → ${seatId}`);
      closeSeatPanel();
    }
  };
  
  const handleRemoveWithHistory = (seatId) => {
    const student = getStudentAtSeat(seatId);
    if (removeStudent(seatId)) {
      addHistory("remove", `${student?.nom} retiré de ${seatId}`);
      closeSeatPanel();
    }
  };
  
  const handleAutoPlaceWithHistory = () => {
    const { placed, total } = autoPlace();
    addHistory("auto", `Placement automatique — ${placed}/${total} étudiants placés`);
  };
  
  const handleClearAllWithHistory = () => {
    clearAllPlacements();
    addHistory("clear", "Tous les placements effacés");
  };
  
  const steps = [
    { number: 1, label: "Configuration" },
    { number: 2, label: "Plan 3D" },
    { number: 3, label: "Affectation" },
  ];
  
  const filteredStudents = students.filter(s => filterGrp === "all" || s.grp === filterGrp);
  
  return (
    <div className="re3d-overlay">
      <div className="re3d-container">
        <div className="re3d-header">
          <div className="re3d-header-left">
            <div className="re3d-logo-dot" />
            <div>
              <div className="re3d-header-title">Smart Exam Monitoring — Éditeur de salle</div>
              <div className="re3d-header-sub">{config.name} · {config.floor} · IIT</div>
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={step} onStepChange={setStep} />
          <button className="re3d-header-close" onClick={onClose}>✕</button>
        </div>
        
        {step === 1 && (
          <ConfigStep
            config={config}
            setConfig={setConfig}
            desks={desks}
            totalSeats={totalSeats}
            placedCount={placedCount}
            onNext={() => setStep(2)}
          />
        )}
        
        {step === 2 && (
          <div className="re3d-step-plan">
            <div className="re3d-plan-toolbar">
              <div className="re3d-toolbar-left">
                <div className="re3d-toolbar-info">
                  <span className="re3d-tb-badge">{config.name}</span>
                  <span className="re3d-tb-badge">{config.niveau}</span>
                  <span className="re3d-tb-badge">{config.specialite}</span>
                  <span className="re3d-tb-badge">{config.groupe}</span>
                </div>
              </div>
              <div className="re3d-toolbar-actions">
                <button className="re3d-btn-ghost" onClick={handleAutoPlaceWithHistory}>⚡ Placement auto</button>
                <button className="re3d-btn-ghost re3d-danger" onClick={handleClearAllWithHistory}>🗑 Vider</button>
                <button className="re3d-btn-primary" onClick={() => setStep(3)}>Valider le plan →</button>
              </div>
            </div>
            
            <div className="re3d-plan-body">
              <div className="re3d-canvas-wrap">
                <div className="re3d-canvas-label">
                  <span>Vue isométrique — {config.name}</span>
                  <span className="re3d-canvas-live">● LIVE</span>
                </div>
                <div className="re3d-canvas">
                  <Room3DCanvas />
                </div>
                
                {selectedSeat && (
                  <SeatPanel
                    seatId={selectedSeat}
                    deskInfo={selectedDesk}
                    students={students}
                    allStudents={initialStudents}
                    onAssign={handleAssignWithHistory}
                    onRemove={handleRemoveWithHistory}
                    onClose={closeSeatPanel}
                  />
                )}
                
                <div className="re3d-legend">
                  <div className="re3d-leg-item"><span className="re3d-leg-dot" style={{ background: "#1c1c1c" }} /> Libre</div>
                  <div className="re3d-leg-item"><span className="re3d-leg-dot" style={{ background: "#22c55e" }} /> Normal</div>
                  <div className="re3d-leg-item"><span className="re3d-leg-dot" style={{ background: "#f59e0b" }} /> Suspect</div>
                  <div className="re3d-leg-item"><span className="re3d-leg-dot" style={{ background: "#ef4444" }} /> Anormal</div>
                </div>
              </div>
              
              <div className="re3d-side-panel">
                <div className="re3d-side-tabs">
                  <button className={`re3d-side-tab ${sideTab === "students" ? "active" : ""}`} onClick={() => setSideTab("students")}>
                    Étudiants ({students.length})
                  </button>
                  <button className={`re3d-side-tab ${sideTab === "history" ? "active" : ""}`} onClick={() => setSideTab("history")}>
                    Historique
                  </button>
                </div>
                
                {sideTab === "students" && (
                  <div className="re3d-students-panel">
                    <div className="re3d-students-filter">
                      <select value={filterGrp} onChange={e => setFilterGrp(e.target.value)} className="re3d-select-sm">
                        <option value="all">Tous les groupes</option>
                        {[...new Set(students.map(s => s.grp))].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <span className="re3d-placed-count">{placedCount}/{students.length} placés</span>
                    </div>
                    <div className="re3d-progress">
                      <div className="re3d-progress-fill" style={{ width: `${totalSeats ? (placedCount / totalSeats * 100) : 0}%` }} />
                    </div>
                    <div className="re3d-stu-scroll">
                      {filteredStudents.map(s => (
                        <div 
                          key={s.id} 
                          className={`re3d-stu-item ${s.seat ? "placed" : ""}`} 
                          onClick={() => { if (s.seat) handleSeatClick(s.seat, desks.find(d => s.seat?.startsWith(d.id))); }}
                        >
                          <div className="re3d-stu-av-sm" style={{ background: s.col + "22", color: s.col }}>
                            {s.init}
                          </div>
                          <div className="re3d-stu-item-info">
                            <div className="re3d-stu-item-name">{s.nom}</div>
                            <div className="re3d-stu-item-meta">{s.id}</div>
                          </div>
                          <div className="re3d-stu-item-seat">
                            {s.seat ? <span className="re3d-seat-tag">{s.seat}</span> : <span className="re3d-seat-free">libre</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {sideTab === "history" && (
                  <div className="re3d-history-list">
                    {history.length === 0 ? (
                      <div className="re3d-history-empty">Aucune action enregistrée.</div>
                    ) : (
                      history.map((entry, i) => (
                        <div key={i} className="re3d-history-item">
                          <div className="re3d-history-dot" style={{ background: entry.action === "assign" ? "#22c55e" : entry.action === "remove" ? "#ef4444" : "#f59e0b" }} />
                          <div className="re3d-history-body">
                            <div className="re3d-history-title">{entry.label}</div>
                            <div className="re3d-history-time">{entry.time} · {entry.changedBy}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="re3d-step-affectation">
            <div className="re3d-aff-header">
              <div>
                <div className="re3d-aff-title">Récapitulatif de la session</div>
                <div className="re3d-aff-sub">{config.name} · {config.exam} · {config.date} · {config.heureDebut}–{config.heureFin}</div>
              </div>
              <div className="re3d-aff-actions">
                <button className="re3d-btn-ghost">📄 Exporter PDF</button>
                <button className="re3d-btn-ghost">📊 Exporter Excel</button>
                <button className="re3d-btn-primary" onClick={() => onSave?.({ ...room, config, desks, students })}>
                  💾 Sauvegarder
                </button>
              </div>
            </div>
            
            <div className="re3d-aff-stats">
              {[
                { label: "Salle", value: config.name },
                { label: "Niveau", value: config.niveau },
                { label: "Spécialité", value: config.specialite },
                { label: "Groupe", value: config.groupe },
                { label: "Étudiants", value: `${students.length}` },
                { label: "Placés", value: `${placedCount}/${students.length}` },
              ].map(s => (
                <div key={s.label} className="re3d-aff-stat">
                  <div className="re3d-aff-stat-label">{s.label}</div>
                  <div className="re3d-aff-stat-val">{s.value}</div>
                </div>
              ))}
            </div>
            
            <div className="re3d-history-section">
              <div className="re3d-hs-title">Journal des actions</div>
              <div className="re3d-history-list">
                {history.length === 0 ? (
                  <div className="re3d-history-empty">Aucune action enregistrée.</div>
                ) : (
                  history.map((entry, i) => (
                    <div key={i} className="re3d-history-item">
                      <div className="re3d-history-dot" style={{ background: entry.action === "assign" ? "#22c55e" : entry.action === "remove" ? "#ef4444" : "#f59e0b" }} />
                      <div className="re3d-history-body">
                        <div className="re3d-history-title">{entry.label}</div>
                        <div className="re3d-history-time">{entry.time} · {entry.changedBy}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}