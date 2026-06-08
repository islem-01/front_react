// src/components/RoomDesigner2D/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import './RoomDesigner2D.css';

// Import des images
import table4Img from '../../assets/table4.png';
import tableindiImg from '../../assets/tableindi.png';
import teacherImg from '../../assets/table_teacher.png';
import roomEmptyImg from '../../assets/room_empty.png';

const OBJECTS = [
  { id: 'table4', name: 'Table 4 places (2 chaises)', image: table4Img, defaultWidth: 350, defaultHeight: 260 },
  { id: 'tableindi', name: 'Table individuelle', image: tableindiImg, defaultWidth: 180, defaultHeight: 180 },
  { id: 'teacher', name: 'Bureau enseignant', image: teacherImg, defaultWidth: 400, defaultHeight: 300 }
];

const DEPTH_ROWS = {
  1: { scale: 1.0, yOffset: 0 },
  2: { scale: 0.92, yOffset: 25 },
  3: { scale: 0.84, yOffset: 48 },
  4: { scale: 0.76, yOffset: 68 },
  5: { scale: 0.68, yOffset: 85 }
};

export default function RoomDesigner2D({ room, onSave, onClose }) {
  const [objects, setObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [draggedObject, setDraggedObject] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [rotationStart, setRotationStart] = useState({ x: 0, y: 0, angle: 0, startAngle: 0 });
  const canvasRef = useRef(null);

  const getDisplayDimensions = (obj) => {
    const row = DEPTH_ROWS[obj.depthRow] || DEPTH_ROWS[2];
    return {
      width: obj.width * row.scale,
      height: obj.height * row.scale,
      yOffset: row.yOffset
    };
  };

  // Générer le layout des sièges à partir des objets
  const generateSeatLayoutFromObjects = () => {
    const seats = [];
    let seatCounter = 1;
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
    objects.forEach(obj => {
      if (obj.type === 'table4') {
        // Table 4 places : 2 sièges (un à gauche, un à droite)
        for (let i = 0; i < 2; i++) {
          const rowLetter = rows[Math.floor((seatCounter - 1) / 4)];
          const seatNumber = ((seatCounter - 1) % 4) + 1;
          seats.push({
            id: `${rowLetter}${seatNumber}`,
            position: { row: rowLetter, col: seatNumber },
            x: obj.x + (i === 0 ? -30 : obj.width + 30),
            y: obj.y + obj.height / 2,
            occupied: false
          });
          seatCounter++;
        }
      } else if (obj.type === 'tableindi') {
        const rowLetter = rows[Math.floor((seatCounter - 1) / 4)];
        const seatNumber = ((seatCounter - 1) % 4) + 1;
        seats.push({
          id: `${rowLetter}${seatNumber}`,
          position: { row: rowLetter, col: seatNumber },
          x: obj.x + obj.width / 2,
          y: obj.y + obj.height / 2,
          occupied: false
        });
        seatCounter++;
      }
    });
    
    const cols = Math.ceil(Math.sqrt(seats.length));
    const rowsCount = Math.ceil(seats.length / cols);
    
    return {
      seats: seats,
      cols: cols,
      rows: rowsCount,
      capacity: seats.length,
      generatedAt: new Date().toISOString()
    };
  };

  // Charger les objets sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem(`room2d_${room.id}`);
    if (saved) {
      setObjects(JSON.parse(saved));
    } else {
      setObjects([
        { id: 'table4_1', type: 'table4', name: 'Table 4 places', x: 180, y: 350, width: 350, height: 260, rotation: 0, depthRow: 1 },
        { id: 'table4_2', type: 'table4', name: 'Table 4 places', x: 580, y: 350, width: 350, height: 260, rotation: 0, depthRow: 1 },
        { id: 'table4_3', type: 'table4', name: 'Table 4 places', x: 180, y: 530, width: 350, height: 260, rotation: 0, depthRow: 2 },
        { id: 'table4_4', type: 'table4', name: 'Table 4 places', x: 580, y: 530, width: 350, height: 260, rotation: 0, depthRow: 2 },
        { id: 'table4_5', type: 'table4', name: 'Table 4 places', x: 180, y: 710, width: 350, height: 260, rotation: 0, depthRow: 3 },
        { id: 'table4_6', type: 'table4', name: 'Table 4 places', x: 580, y: 710, width: 350, height: 260, rotation: 0, depthRow: 3 },
        { id: 'table4_7', type: 'table4', name: 'Table 4 places', x: 180, y: 890, width: 350, height: 260, rotation: 0, depthRow: 4 },
        { id: 'table4_8', type: 'table4', name: 'Table 4 places', x: 580, y: 890, width: 350, height: 260, rotation: 0, depthRow: 4 },
        { id: 'teacher_1', type: 'teacher', name: 'Bureau enseignant', x: 450, y: 100, width: 400, height: 300, rotation: 0, depthRow: 5 }
      ]);
    }
  }, [room.id]);

  // Calcul des statistiques
  const tablesCount = objects.filter(o => o.type === 'table4').length;
  const indiCount = objects.filter(o => o.type === 'tableindi').length;
  const totalSeats = (tablesCount * 2) + indiCount;

  // Supprimer un objet
  const handleDeleteSelected = () => {
    if (selectedObjectId && window.confirm('Supprimer cet objet ?')) {
      setObjects(objects.filter(obj => obj.id !== selectedObjectId));
      setSelectedObjectId(null);
    }
  };

  // Vider la salle
  const handleClear = () => {
    if (window.confirm('Vider toute la salle ?')) {
      setObjects([]);
      setSelectedObjectId(null);
    }
  };

  // Démarrer le drag
  const handleMouseDown = (e, obj) => {
    e.stopPropagation();
    setSelectedObjectId(obj.id);
    setDraggedObject(obj);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) - obj.x,
      y: (e.clientY - rect.top) - obj.y
    });
  };

  // Démarrer le redimensionnement
  const handleResizeStart = (e, obj) => {
    e.stopPropagation();
    setIsResizing(true);
    setSelectedObjectId(obj.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: obj.width,
      height: obj.height
    });
  };

  // Démarrer la rotation
  const handleRotateStart = (e, obj) => {
    e.stopPropagation();
    setIsRotating(true);
    setSelectedObjectId(obj.id);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
    
    setRotationStart({
      x: mouseX,
      y: mouseY,
      angle: obj.rotation,
      startAngle: angle
    });
  };

  // Déplacer, redimensionner ou tourner
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (draggedObject) {
      let newX = (e.clientX - rect.left) - dragOffset.x;
      let newY = (e.clientY - rect.top) - dragOffset.y;
      newX = Math.max(20, Math.min(rect.width - draggedObject.width - 20, newX));
      newY = Math.max(20, Math.min(rect.height - draggedObject.height - 20, newY));
      setObjects(objects.map(obj =>
        obj.id === draggedObject.id ? { ...obj, x: newX, y: newY } : obj
      ));
    }
    
    if (isResizing && selectedObjectId) {
      const obj = objects.find(o => o.id === selectedObjectId);
      if (obj) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(100, Math.min(600, resizeStart.width + deltaX));
        const newHeight = Math.max(80, Math.min(450, resizeStart.height + deltaY));
        setObjects(objects.map(o =>
          o.id === selectedObjectId ? { ...o, width: newWidth, height: newHeight } : o
        ));
      }
    }
    
    if (isRotating && selectedObjectId) {
      const obj = objects.find(o => o.id === selectedObjectId);
      if (obj) {
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
        const deltaAngle = currentAngle - rotationStart.startAngle;
        let newRotation = rotationStart.angle + deltaAngle;
        newRotation = ((newRotation % 360) + 360) % 360;
        setObjects(objects.map(o =>
          o.id === selectedObjectId ? { ...o, rotation: newRotation } : o
        ));
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedObject(null);
    setIsResizing(false);
    setIsRotating(false);
  };

  const handleAddObject = (type) => {
    const defaultObj = OBJECTS.find(o => o.id === type);
    setObjects([...objects, {
      id: `${type}_${Date.now()}`,
      type: type,
      name: defaultObj?.name,
      x: 400,
      y: 300,
      width: defaultObj?.defaultWidth || 100,
      height: defaultObj?.defaultHeight || 80,
      rotation: 0,
      depthRow: type === 'teacher' ? 5 : 2
    }]);
  };

  const handleRotateButton = () => {
    if (selectedObjectId) {
      setObjects(objects.map(obj =>
        obj.id === selectedObjectId ? { ...obj, rotation: (obj.rotation + 15) % 360 } : obj
      ));
    }
  };

  const handleIncreaseSize = () => {
    if (selectedObjectId) {
      setObjects(objects.map(obj =>
        obj.id === selectedObjectId ? { ...obj, width: obj.width + 40, height: obj.height + 30 } : obj
      ));
    }
  };

  const handleDecreaseSize = () => {
    if (selectedObjectId) {
      const obj = objects.find(o => o.id === selectedObjectId);
      if (obj.width > 100 && obj.height > 80) {
        setObjects(objects.map(o =>
          o.id === selectedObjectId ? { ...o, width: o.width - 40, height: o.height - 30 } : o
        ));
      }
    }
  };

  const handleResetSize = () => {
    if (selectedObjectId) {
      const obj = objects.find(o => o.id === selectedObjectId);
      const defaultObj = OBJECTS.find(o => o.id === obj.type);
      if (defaultObj) {
        setObjects(objects.map(o =>
          o.id === selectedObjectId ? { ...o, width: defaultObj.defaultWidth, height: defaultObj.defaultHeight } : o
        ));
      }
    }
  };

  const handleDepthChange = (delta) => {
    if (selectedObjectId) {
      const obj = objects.find(o => o.id === selectedObjectId);
      if (obj) {
        const newDepth = Math.max(1, Math.min(5, obj.depthRow + delta));
        setObjects(objects.map(o => o.id === selectedObjectId ? { ...o, depthRow: newDepth } : o));
      }
    }
  };

  // Sauvegarder
  const handleSave = () => {
    const seatLayout = generateSeatLayoutFromObjects();
    
    const updatedRoom = { 
      ...room, 
      seatLayout: seatLayout,
      planConfigured: true,
      mobilier: objects,
      tablesCount: tablesCount,
      chaisesCount: (tablesCount * 2) + indiCount
    };
    
    localStorage.setItem(`room_layout_${room.id}`, JSON.stringify(seatLayout));
    localStorage.setItem(`room_objects_${room.id}`, JSON.stringify(objects));
    
    onSave(updatedRoom);
  };

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="designer-overlay" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="designer-container">
        
        {/* Header */}
        <div className="designer-header">
          <div className="datetime-info">
            <i className="far fa-clock"></i>
            {new Date().toLocaleString('fr-FR', { 
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).replace(/\//g, '.')}
          </div>
          <div className="camera-info">
            <i className="fas fa-video"></i>
            IIT-{room.etage?.replace(/\s/g, '')}-{room.name?.replace('Salle ', 'S')}-EXT2
          </div>
          <button className="designer-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="designer-body">
          
          {/* Sidebar gauche */}
          <div className="designer-sidebar">
            <div className="sidebar-title">
              <i className="fas fa-cube"></i> OBJETS
            </div>
            {OBJECTS.map(obj => (
              <div key={obj.id} className="object-item" onClick={() => handleAddObject(obj.id)}>
                <img src={obj.image} alt={obj.name} style={{ width: '40px' }} />
                <span>{obj.name}</span>
              </div>
            ))}
            
            <div className="divider"></div>
            
            <div className="sidebar-title">
              <i className="fas fa-arrows-alt-v"></i> PROFONDEUR
            </div>
            <div className="depth-buttons">
              <button onClick={() => handleDepthChange(-1)} disabled={!selectedObject || selectedObject.depthRow <= 1}>
                <i className="fas fa-arrow-up"></i> Avancer
              </button>
              <button onClick={() => handleDepthChange(1)} disabled={!selectedObject || selectedObject.depthRow >= 5}>
                <i className="fas fa-arrow-down"></i> Reculer
              </button>
            </div>
            {selectedObject && (
              <div className="current-depth">
                <i className="fas fa-layer-group"></i> Rang {selectedObject.depthRow}
              </div>
            )}
            
            <div className="divider"></div>
            
            <div className="sidebar-title">
              <i className="fas fa-expand-alt"></i> TAILLE
            </div>
            <div className="size-buttons">
              <button className="size-btn" onClick={handleIncreaseSize}>
                <i className="fas fa-plus"></i> Agrandir
              </button>
              <button className="size-btn" onClick={handleDecreaseSize}>
                <i className="fas fa-minus"></i> Réduire
              </button>
              <button className="size-btn" onClick={handleResetSize}>
                <i className="fas fa-undo-alt"></i> Normal
              </button>
            </div>
            
            <div className="divider"></div>
            
            <div className="sidebar-title">
              <i className="fas fa-sync-alt"></i> ROTATION
            </div>
            <div className="rotation-buttons">
              <button className="rotation-btn" onClick={handleRotateButton}>
                <i className="fas fa-undo"></i> Tourner +15°
              </button>
              <div className="rotation-hint">
                <i className="fas fa-mouse-pointer"></i> Glisser le cercle vert pour tourner
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="sidebar-title">
              <i className="fas fa-tools"></i> ACTIONS
            </div>
            <button className="action-btn" onClick={handleDeleteSelected}>
              <i className="fas fa-trash-alt"></i> Supprimer
            </button>
            <button className="action-btn" onClick={handleClear}>
              <i className="fas fa-broom"></i> Vider
            </button>
            
            <button className="btn-save" onClick={handleSave}>
              <i className="fas fa-save"></i> Enregistrer
            </button>
          </div>

          {/* Zone centrale - Photo de la salle */}
          <div className="designer-canvas-area">
            <div 
              ref={canvasRef}
              className="room-canvas"
              style={{
                backgroundImage: `url(${roomEmptyImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {objects.map(obj => {
                const display = getDisplayDimensions(obj);
                return (
                  <div
                    key={obj.id}
                    className={`room-object ${selectedObjectId === obj.id ? 'selected' : ''}`}
                    style={{
                      position: 'absolute',
                      left: obj.x,
                      top: obj.y + display.yOffset,
                      width: display.width,
                      height: display.height,
                      transform: `rotate(${obj.rotation}deg)`,
                      cursor: 'grab',
                      zIndex: obj.depthRow
                    }}
                    onMouseDown={(e) => handleMouseDown(e, obj)}
                    onClick={(e) => { e.stopPropagation(); setSelectedObjectId(obj.id); }}
                  >
                    <img 
                      src={OBJECTS.find(o => o.id === obj.type)?.image} 
                      alt={obj.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      draggable={false}
                    />
                    
                    {selectedObjectId === obj.id && (
                      <>
                        <div 
                          className="control-corner resize-corner" 
                          onMouseDown={(e) => handleResizeStart(e, obj)}
                          title="Tirer pour redimensionner"
                        >
                          <i className="fas fa-expand"></i>
                        </div>
                        <div 
                          className="control-corner rotate-corner" 
                          onMouseDown={(e) => handleRotateStart(e, obj)}
                          title="Tirer pour tourner"
                        >
                          <i className="fas fa-sync-alt"></i>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="info-sidebar">
            <div className="info-row">
              <span><i className="fas fa-door-open"></i> Salle</span>
              <strong>{room.name}</strong>
            </div>
            <div className="info-row">
              <span><i className="fas fa-building"></i> Étage</span>
              <strong>{room.etage}</strong>
            </div>
            <div className="divider"></div>
            <div className="info-row">
              <span><i className="fas fa-table"></i> Tables 4p</span>
              <strong>{tablesCount}</strong>
            </div>
            <div className="info-row">
              <span><i className="fas fa-chair"></i> Tables indi</span>
              <strong>{indiCount}</strong>
            </div>
            <div className="info-row highlight">
              <span><i className="fas fa-users"></i> Capacité</span>
              <strong>{totalSeats} places</strong>
            </div>
            
            {selectedObject && (
              <>
                <div className="divider"></div>
                <div className="info-row">
                  <span><i className="fas fa-cube"></i> Objet</span>
                  <strong>{selectedObject.name}</strong>
                </div>
                <div className="info-row">
                  <span><i className="fas fa-arrows-alt-h"></i> Largeur</span>
                  <strong>{Math.round(selectedObject.width)}px</strong>
                </div>
                <div className="info-row">
                  <span><i className="fas fa-arrows-alt-v"></i> Hauteur</span>
                  <strong>{Math.round(selectedObject.height)}px</strong>
                </div>
                <div className="info-row">
                  <span><i className="fas fa-sync-alt"></i> Rotation</span>
                  <strong>{selectedObject.rotation}°</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}