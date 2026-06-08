import React, { useState, useRef } from 'react';

export default function TeacherLive({ user }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const videoRefs = useRef({});

  const activeExams = [
    { id: 1, matiere: "Algorithmique", salle: "A12", horaire: "09:00-12:00", cameras: ["Caméra 1", "Caméra 2", "Caméra 3"] },
    { id: 2, matiere: "Réseaux", salle: "B05", horaire: "09:00-11:00", cameras: ["Caméra 1", "Caméra 2"] }
  ];

  const [selectedExamData, setSelectedExamData] = useState(activeExams[0]);

  // Simulation de flux vidéo
  const videoStreams = {
    "Caméra 1": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "Caméra 2": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "Caméra 3": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  };

  // Simulation de présence
  const [presence, setPresence] = useState({
    presents: 26,
    absents: 2,
    total: 28,
    liste: [
      { nom: "Ahmed Ben Ali", place: "B3", present: true },
      { nom: "Sofia Touati", place: "C2", present: true },
      { nom: "Karim Dridi", place: "A4", present: false },
      { nom: "Leila Hamdi", place: "D1", present: true }
    ]
  });

  return (
    <div className="teacher-live">
      {/* Sélection de l'examen */}
      <div className="exam-selector">
        {activeExams.map(exam => (
          <button
            key={exam.id}
            className={`exam-btn ${selectedExamData?.id === exam.id ? "active" : ""}`}
            onClick={() => setSelectedExamData(exam)}
          >
            <i className="fas fa-video"></i>
            <div>
              <div className="exam-matiere">{exam.matiere}</div>
              <div className="exam-info">{exam.salle} · {exam.horaire}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Grille des caméras */}
      <div className="cameras-grid">
        {selectedExamData && selectedExamData.cameras.map((camera, index) => (
          <div key={index} className="camera-card">
            <div className="camera-header">
              <span className="camera-name">{camera}</span>
              <span className="live-badge">LIVE</span>
            </div>
            <div className="camera-video">
              <video
                ref={el => videoRefs.current[camera] = el}
                src={videoStreams[camera]}
                autoPlay
                muted
                loop
                playsInline
                className="video-stream"
              />
              <div className="ai-overlay">
                <div className="detection-box" style={{ top: "30%", left: "40%", width: "80px", height: "80px" }}>
                  <span className="risk">82%</span>
                </div>
              </div>
            </div>
            <div className="camera-footer">
              <button className="btn-fullscreen">
                <i className="fas fa-expand"></i>
              </button>
              <span className="ai-status">
                <i className="fas fa-microchip"></i> IA active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Suivi des présences */}
      <div className="presence-panel">
        <h4><i className="fas fa-users"></i> Suivi des présences</h4>
        <div className="presence-stats">
          <div className="presence-stat present">
            <span className="stat-value">{presence.presents}</span>
            <span className="stat-label">Présents</span>
          </div>
          <div className="presence-stat absent">
            <span className="stat-value">{presence.absents}</span>
            <span className="stat-label">Absents</span>
          </div>
          <div className="presence-stat total">
            <span className="stat-value">{presence.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="presence-list">
          {presence.liste.map((student, idx) => (
            <div key={idx} className={`presence-item ${student.present ? "present" : "absent"}`}>
              <span className="student-name">{student.nom}</span>
              <span className="student-place">Place {student.place}</span>
              <span className="student-status">
                {student.present ? "✅ Présent" : "❌ Absent"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes en direct */}
      <div className="live-alerts">
        <h4><i className="fas fa-bell"></i> Alertes en direct</h4>
        <div className="live-alerts-list">
          <div className="alert-item abnormal">
            <div className="alert-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <div className="alert-info">
              <div className="alert-title">Comportement anormal détecté</div>
              <div className="alert-desc">Salle A12 · Place B3 · Élève: Ahmed Ben Ali</div>
            </div>
            <div className="alert-time">À l'instant</div>
          </div>
          <div className="alert-item suspect">
            <div className="alert-icon"><i className="fas fa-question-circle"></i></div>
            <div className="alert-info">
              <div className="alert-title">Comportement suspect détecté</div>
              <div className="alert-desc">Salle A12 · Place C2 · Élève: Sofia Touati</div>
            </div>
            <div className="alert-time">Il y a 2 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}