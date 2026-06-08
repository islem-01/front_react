import React, { useState, useEffect } from "react";

export default function RealtimeMonitor({ onClose, rooms = [], onNewAlert }) {
  const [liveFeed, setLiveFeed] = useState(
    rooms.filter(r => r.cameraUrl).map((room, idx) => ({
      id: room.id,
      camera: room.name,
      cameraRef: room.camera,
      status: "active",
      stream: "video"
    }))
  );

  const [detections, setDetections] = useState([]);

  // Si pas de salles avec caméras, utiliser des données mockées
  useEffect(() => {
    if (liveFeed.length === 0) {
      setLiveFeed([
        { id: 1, camera: "Salle 1.1", cameraRef: "CAM-ETG1-01", status: "active", stream: "video" },
        { id: 2, camera: "Salle 2.1", cameraRef: "CAM-ETG2-01", status: "active", stream: "video" },
        { id: 3, camera: "Salle 3.2", cameraRef: "CAM-ETG3-01", status: "warning", stream: "video" },
      ]);
    }
  }, [liveFeed.length]);

  useEffect(() => {
    // Simuler des détections en temps réel
    const interval = setInterval(() => {
      const cameras = liveFeed.filter(c => c.status === "active");
      if (cameras.length === 0) return;
      
      const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
      const behaviorTypes = [
        { type: "regard_frequent", label: "Regards fréquents", severity: "medium", icon: "fa-eye" },
        { type: "telephone", label: "Téléphone détecté", severity: "high", icon: "fa-mobile-alt" },
        { type: "mouvement", label: "Mouvement suspect", severity: "medium", icon: "fa-person-walking" },
        { type: "echange", label: "Échange suspect", severity: "critical", icon: "fa-exchange-alt" }
      ];
      const behavior = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];
      
      const newDetection = {
        id: Date.now(),
        camera: randomCamera.camera,
        seatId: `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${Math.floor(Math.random() * 8) + 1}`,
        type: behavior.type,
        label: behavior.label,
        severity: behavior.severity,
        icon: behavior.icon,
        confidence: Math.floor(Math.random() * 30 + 70),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setDetections(prev => [newDetection, ...prev].slice(0, 15));
      
      // Notifier d'une nouvelle alerte
      if (onNewAlert && (behavior.severity === "high" || behavior.severity === "critical")) {
        const newAlert = {
          id: `REALTIME_${Date.now()}`,
          type: behavior.type,
          label: behavior.label,
          severity: behavior.severity,
          icon: behavior.icon,
          salle: randomCamera.camera,
          seatId: newDetection.seatId,
          etudiant: {
            id: `IIT${Math.floor(Math.random() * 90000) + 10000}`,
            nom: "En cours",
            prenom: "Identification"
          },
          timestamp: new Date().toISOString(),
          status: "nouvelle",
          aiConfidence: newDetection.confidence,
          examInfo: { matiere: "Examen en cours", date: new Date().toLocaleDateString(), heure: "09:00-12:00" }
        };
        onNewAlert(newAlert);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [liveFeed, onNewAlert]);

  return (
    <div className="realtime-monitor">
      <div className="realtime-header">
        <h3>
          <span className="pulse-dot"></span>
          <i className="fas fa-video"></i>
          Surveillance en temps réel - IA Active
        </h3>
        <button className="close-realtime" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="realtime-grid">
        {liveFeed.map((cam) => (
          <div key={cam.id} className={`camera-feed ${cam.status}`}>
            <div className="camera-header">
              <div className="camera-title">
                <i className="fas fa-camera"></i>
                <span>{cam.camera}</span>
                <small className="camera-ref">{cam.cameraRef}</small>
              </div>
              <span className={`status-badge ${cam.status}`}>
                {cam.status === "active" ? (
                  <>
                    <i className="fas fa-circle"></i> LIVE
                  </>
                ) : (
                  <>
                    <i className="fas fa-exclamation-triangle"></i> ALERTE
                  </>
                )}
              </span>
            </div>
            <div className="camera-stream">
              <div className="stream-placeholder">
                <i className="fas fa-video"></i>
                <span>Flux vidéo en direct</span>
              </div>
              <div className="ai-overlay">
                <div className="ai-box" style={{ top: "30%", left: "40%", width: "80px", height: "80px" }}>
                  <i className="fas fa-robot"></i>
                </div>
              </div>
            </div>
            <div className="camera-footer">
              <span>
                <i className="fas fa-chart-line"></i> Détections: {Math.floor(Math.random() * 8)}
              </span>
              <span>
                <i className="fas fa-microchip"></i> IA: {Math.floor(Math.random() * 30 + 70)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="realtime-detections">
        <h4>
          <i className="fas fa-bell"></i> Détections en temps réel
        </h4>
        <div className="detections-list">
          {detections.map(det => (
            <div key={det.id} className={`detection-item severity-${det.severity}`}>
              <span className="detection-time">
                <i className="fas fa-clock"></i> {det.timestamp}
              </span>
              <span className="detection-camera">
                <i className="fas fa-video"></i> {det.camera}
              </span>
              <span className="detection-seat">
                <i className="fas fa-chair"></i> {det.seatId}
              </span>
              <span className="detection-type">
                <i className={`fas ${det.icon}`}></i> {det.label}
              </span>
              <span className="detection-confidence">
                <i className="fas fa-chart-line"></i> {det.confidence}%
              </span>
            </div>
          ))}
          {detections.length === 0 && (
            <div className="no-detections">
              <i className="fas fa-shield-alt"></i>
              <span>En attente de détections...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}