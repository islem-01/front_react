import React, { useState } from "react";

export default function EditExamModal({ exam, onSave, onClose, niveaux, filieres }) {
  const [formData, setFormData] = useState({ ...exam });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <i className="fas fa-edit"></i>
            Modifier l'examen
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Informations générales */}
            <div className="form-section-title">
              <i className="fas fa-info-circle"></i> Informations générales
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-book"></i> Matière</label>
                <input 
                  type="text" 
                  value={formData.matiere} 
                  onChange={(e) => setFormData({...formData, matiere: e.target.value})} 
                  className="form-input" 
                  placeholder="Ex: Algorithmique Avancée"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-barcode"></i> Code</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                  className="form-input" 
                  placeholder="Ex: INF301"
                />
              </div>
            </div>

            {/* Informations académiques */}
            <div className="form-section-title">
              <i className="fas fa-graduation-cap"></i> Informations académiques
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-layer-group"></i> Niveau</label>
                <select 
                  value={formData.niveau} 
                  onChange={(e) => setFormData({...formData, niveau: e.target.value})} 
                  className="form-select"
                >
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><i className="fas fa-chalkboard-user"></i> Filière</label>
                <select 
                  value={formData.filiere} 
                  onChange={(e) => setFormData({...formData, filiere: e.target.value})} 
                  className="form-select"
                >
                  {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Planning */}
            <div className="form-section-title">
              <i className="fas fa-calendar-alt"></i> Planning
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-door-open"></i> Salle</label>
                <input 
                  type="text" 
                  value={formData.salle} 
                  onChange={(e) => setFormData({...formData, salle: e.target.value})} 
                  className="form-input" 
                  placeholder="Ex: Salle A101"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-calendar-day"></i> Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  className="form-input" 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-clock"></i> Heure début</label>
                <input 
                  type="time" 
                  value={formData.heureDebut} 
                  onChange={(e) => setFormData({...formData, heureDebut: e.target.value})} 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-hourglass-end"></i> Heure fin</label>
                <input 
                  type="time" 
                  value={formData.heureFin} 
                  onChange={(e) => setFormData({...formData, heureFin: e.target.value})} 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Enseignants */}
            <div className="form-section-title">
              <i className="fas fa-chalkboard"></i> Enseignants
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-user-tie"></i> Professeur principal</label>
                <input 
                  type="text" 
                  value={formData.professeur} 
                  onChange={(e) => setFormData({...formData, professeur: e.target.value})} 
                  className="form-input" 
                  placeholder="Ex: Dr. Karim Benali"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-user-friends"></i> Co-professeur</label>
                <input 
                  type="text" 
                  value={formData.coProfesseur || ""} 
                  onChange={(e) => setFormData({...formData, coProfesseur: e.target.value})} 
                  className="form-input" 
                  placeholder="Optionnel"
                />
              </div>
            </div>

            {/* Statut et étudiants */}
            <div className="form-section-title">
              <i className="fas fa-users"></i> Statut & étudiants
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-tag"></i> Statut</label>
                <select 
                  value={formData.statut} 
                  onChange={(e) => setFormData({...formData, statut: e.target.value})} 
                  className="form-select"
                >
                  <option value="Planifié"><i className="fas fa-calendar-alt"></i> Planifié</option>
                  <option value="En cours"><i className="fas fa-play-circle"></i> En cours</option>
                  <option value="Terminé"><i className="fas fa-check-circle"></i> Terminé</option>
                  <option value="Annulé"><i className="fas fa-ban"></i> Annulé</option>
                  <option value="Reporté"><i className="fas fa-clock"></i> Reporté</option>
                </select>
              </div>
              <div className="form-group">
                <label><i className="fas fa-user-graduate"></i> Nombre d'étudiants</label>
                <input 
                  type="number" 
                  value={formData.nbrEtudiants} 
                  onChange={(e) => setFormData({...formData, nbrEtudiants: parseInt(e.target.value)})} 
                  className="form-input" 
                  min="1" 
                  max="200"
                />
              </div>
            </div>

            {/* Présences (si terminé) */}
            {formData.statut === "Terminé" && (
              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-user-check"></i> Présents</label>
                  <input 
                    type="number" 
                    value={formData.nbrPresent} 
                    onChange={(e) => {
                      const presents = parseInt(e.target.value);
                      setFormData({
                        ...formData, 
                        nbrPresent: presents, 
                        nbrAbsent: formData.nbrEtudiants - presents
                      });
                    }} 
                    className="form-input" 
                    min="0" 
                    max={formData.nbrEtudiants}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-user-times"></i> Absents</label>
                  <input 
                    type="number" 
                    value={formData.nbrAbsent} 
                    disabled 
                    className="form-input" 
                  />
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="form-section-title">
              <i className="fas fa-sticky-note"></i> Observations
            </div>
            <div className="form-group">
              <textarea 
                value={formData.observations || ""} 
                onChange={(e) => setFormData({...formData, observations: e.target.value})} 
                className="form-textarea" 
                rows="3"
                placeholder="Instructions particulières, remarques..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <i className="fas fa-times"></i> Annuler
            </button>
            <button type="submit" className="btn-save">
              <i className="fas fa-save"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-section-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin: 20px 0 12px 0;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-section-title:first-of-type {
          margin-top: 0;
        }
        
        .form-section-title i {
          color: #3b82f6;
          font-size: 14px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-group {
          margin-bottom: 0;
        }
        
        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .form-group label i {
          font-size: 11px;
          color: #3b82f6;
        }
        
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          transition: all 0.2s;
          background: white;
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        
        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 70px;
        }
        
        .form-input:disabled {
          background: #f1f5f9;
          color: #64748b;
          cursor: not-allowed;
        }
        
        .modal-container {
          width: 650px;
          max-width: 90vw;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        
        .btn-cancel, .btn-save {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .btn-cancel {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        
        .btn-cancel:hover {
          background: #f1f5f9;
        }
        
        .btn-save {
          background: #3b82f6;
          color: white;
        }
        
        .btn-save:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .btn-cancel, .btn-save {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}