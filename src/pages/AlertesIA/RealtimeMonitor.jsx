import React, { useState, useEffect } from "react";

export default function RealtimeMonitor({ onClose }) {
  const [liveFeed, setLiveFeed] = useState([
    { camera: "Caméra 1 - Salle A101", status: "active", stream: "🎥" },
    { camera: "Caméra 2 - Salle A102", status: "active", stream: "🎥" },
    { camera: "Caméra 3 - Salle B201", status: "active", stream: "🎥" },
    { camera: "Caméra 4 - Salle B202", status: "warning", stream: "⚠️" },
    { camera: "Caméra 5 - Amphithéâtre", status: "active", stream: "🎥" }
  ]);

  const [detections, setDetections] = useState([]);

  useEffect(() => {
    // Simuler des détections en temps réel
    const interval = setInterval(() => {
      const newDetection = {
        id: Date.now(),
        camera: ["Salle A101", "Salle A102", "Salle B201"][Math.floor(Math.random() * 3)],
        type: ["regard suspect", "téléphone", "mouvement"][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 30 + 70),
        timestamp: new Date().toLocaleTimeString()
      };
      setDetections(prev => [newDetection, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="realtime-monitor">
      <div className="realtime-header">
        <h3>
          <span className="pulse-dot"></span>
          Surveillance en temps réel - IA Active
        </h3>
        <button className="close-realtime" onClick={onClose}>✕</button>
      </div>
      <div className="realtime-grid">
        {liveFeed.map((cam, index) => (
          <div key={index} className={`camera-feed ${cam.status}`}>
            <div className="camera-header">
              <span>{cam.camera}</span>
              <span className={`status-badge ${cam.status}`}>
                {cam.status === "active" ? "🟢 LIVE" : "⚠️ ALERTE"}
              </span>
            </div>
            <div className="camera-stream">
              <div className="stream-placeholder">
                {cam.stream} Flux vidéo en direct
              </div>
              <div className="ai-overlay">
                <div className="ai-box" style={{ top: "30%", left: "40%", width: "100px", height: "100px" }}></div>
              </div>
            </div>
            <div className="camera-footer">
              <span>Détections: {Math.floor(Math.random() * 5)}</span>
              <span>IA Confidence: {Math.floor(Math.random() * 30 + 70)}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="realtime-detections">
        <h4>📡 Détections en temps réel</h4>
        <div className="detections-list">
          {detections.map(det => (
            <div key={det.id} className="detection-item">
              <span className="detection-time">{det.timestamp}</span>
              <span className="detection-camera">📹 {det.camera}</span>
              <span className="detection-type">⚠️ {det.type}</span>
              <span className="detection-confidence">Confiance: {det.confidence}%</span>
            </div>
          ))}
          {detections.length === 0 && <div className="no-detections">En attente de détections...</div>}
        </div>
      </div>
    </div>
  );
}