import React from "react";

export default function RapportDetails({ type, data, onClose }) {
  const getDetailsData = () => {
    if (type === "Informatique" || type === "Réseaux" || type === "Mathématiques" || type === "IA") {
      return data.donneesParFiliere.find(f => f.filiere === type);
    }
    if (type.includes("Licence") || type.includes("Master") || type.includes("Ingénieur")) {
      return data.donneesParNiveau.find(n => n.niveau === type);
    }
    if (type.includes("Salle")) {
      return data.donneesParSalle.find(s => s.salle === type);
    }
    return data.donneesParEnseignant.find(e => e.enseignant === type);
  };

  const detailData = getDetailsData();

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>📋 Rapport détaillé - {type}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {detailData && (
            <div className="details-grid">
              {Object.entries(detailData).map(([key, value]) => (
                <div key={key} className="detail-card">
                  <div className="detail-title">{key}</div>
                  <div className="detail-value">{typeof value === 'number' ? value : value}</div>
                </div>
              ))}
            </div>
          )}
          <div className="info-card">
            <div className="info-title">📊 Analyse</div>
            <div className="info-text">
              • Performance globale: {detailData?.reussite > 75 ? "Excellent" : detailData?.reussite > 60 ? "Bon" : "À améliorer"}<br />
              • Taux de présence: {detailData?.presence > 80 ? "Très bon" : detailData?.presence > 70 ? "Acceptable" : "Préoccupant"}<br />
              • Recommandations: {detailData?.reussite < 70 ? "Renforcer l'encadrement" : "Maintenir les bonnes pratiques"}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}