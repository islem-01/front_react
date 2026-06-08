import React, { useState } from "react";

export default function AddExamModal({ onAdd, onClose, niveaux, filieres }) {
  const [formData, setFormData] = useState({
    matiere: "",
    code: "",
    niveau: "",
    filiere: "",
    groupe: "A",
    professeur: "",
    coProfesseur: "",
    salle: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    duree: 2,
    nbrEtudiants: 30,
    observations: ""
  });

  // Liste des professeurs disponibles
  const professeursDisponibles = [
    { id: 1, nom: "Dr. Karim Benali", grade: "Professeur", specialite: "Algorithmique" },
    { id: 2, nom: "Pr. Salima Mansouri", grade: "Professeur", specialite: "Base de données" },
    { id: 3, nom: "Dr. Amine Touati", grade: "Maître de conférences", specialite: "Réseaux" },
    { id: 4, nom: "Pr. Nadia Khelil", grade: "Professeur", specialite: "IA" },
    { id: 5, nom: "Dr. Sofiene Marzouk", grade: "Maître assistant", specialite: "Cryptographie" },
    { id: 6, nom: "Pr. Hichem Jaouadi", grade: "Professeur", specialite: "Génie Logiciel" },
    { id: 7, nom: "Dr. Ines Trabelsi", grade: "Maître de conférences", specialite: "Web" },
    { id: 8, nom: "Pr. Walid Ferchichi", grade: "Professeur", specialite: "Mobile" }
  ];

  // Liste des salles disponibles
  const sallesDisponibles = [
    { id: 1, nom: "Salle A101", capacite: 30, equipements: ["Vidéo projecteur", "Tableau blanc"] },
    { id: 2, nom: "Salle A102", capacite: 25, equipements: ["Vidéo projecteur"] },
    { id: 3, nom: "Salle B201", capacite: 40, equipements: ["Vidéo projecteur", "Tableau blanc", "Climatisation"] },
    { id: 4, nom: "Salle B202", capacite: 35, equipements: ["Vidéo projecteur", "Climatisation"] },
    { id: 5, nom: "Amphithéâtre C", capacite: 120, equipements: ["Vidéo projecteur", "Sonorisation", "Tableau blanc"] },
    { id: 6, nom: "Labo Info", capacite: 20, equipements: ["Ordinateurs", "Vidéo projecteur"] }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.matiere || !formData.niveau || !formData.filiere || !formData.professeur || !formData.salle || !formData.date || !formData.heureDebut || !formData.heureFin) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    // Calcul automatique de la durée
    if (formData.heureDebut && formData.heureFin) {
      const debut = parseInt(formData.heureDebut.split(':')[0]);
      const fin = parseInt(formData.heureFin.split(':')[0]);
      formData.duree = fin - debut;
    }
    onAdd(formData);
  };

  // Générer un code automatiquement
  const generateCode = () => {
    const randomNum = Math.floor(Math.random() * 900 + 100);
    setFormData({ ...formData, code: `INF${randomNum}` });
  };

  // Obtenir la salle sélectionnée
  const selectedSalle = sallesDisponibles.find(s => s.nom === formData.salle);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <i className="fas fa-calendar-plus"></i>
            Planifier un examen
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Section Informations générales */}
            <div className="form-section">
              <div className="form-section-title">
                <i className="fas fa-info-circle"></i>
                Informations générales
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Matière *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-book"></i>
                    <input 
                      type="text" 
                      value={formData.matiere} 
                      onChange={(e) => setFormData({...formData, matiere: e.target.value})} 
                      className="form-input" 
                      placeholder="Ex: Algorithmique Avancée"
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Code examen</label>
                  <div className="input-with-icon" style={{ position: "relative" }}>
                    <i className="fas fa-barcode"></i>
                    <input 
                      type="text" 
                      value={formData.code} 
                      onChange={(e) => setFormData({...formData, code: e.target.value})} 
                      className="form-input" 
                      placeholder="Ex: INF101"
                      style={{ paddingRight: "90px" }}
                    />
                    <button 
                      type="button" 
                      className="btn-generate-code"
                      onClick={generateCode}
                    >
                      <i className="fas fa-random"></i> Générer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Académique */}
            <div className="form-section">
              <div className="form-section-title">
                <i className="fas fa-graduation-cap"></i>
                Informations académiques
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Niveau *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-layer-group"></i>
                    <select 
                      value={formData.niveau} 
                      onChange={(e) => setFormData({...formData, niveau: e.target.value})} 
                      className="form-select" 
                      required
                    >
                      <option value="">Sélectionner un niveau</option>
                      {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Filière *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-chalkboard-user"></i>
                    <select 
                      value={formData.filiere} 
                      onChange={(e) => setFormData({...formData, filiere: e.target.value})} 
                      className="form-select" 
                      required
                    >
                      <option value="">Sélectionner une filière</option>
                      {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Groupe</label>
                  <div className="input-with-icon">
                    <i className="fas fa-users"></i>
                    <select 
                      value={formData.groupe} 
                      onChange={(e) => setFormData({...formData, groupe: e.target.value})} 
                      className="form-select"
                    >
                      <option value="A">Groupe A</option>
                      <option value="B">Groupe B</option>
                      <option value="C">Groupe C</option>
                      <option value="Tous">Tous les groupes</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Nombre d'étudiants</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user-graduate"></i>
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
              </div>
            </div>

            {/* Section Enseignants avec listes déroulantes */}
            <div className="form-section">
              <div className="form-section-title">
                <i className="fas fa-chalkboard"></i>
                Enseignants
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Professeur principal *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user-tie"></i>
                    <select 
                      value={formData.professeur} 
                      onChange={(e) => setFormData({...formData, professeur: e.target.value})} 
                      className="form-select" 
                      required
                    >
                      <option value="">Sélectionner un professeur</option>
                      {professeursDisponibles.map(p => (
                        <option key={p.id} value={p.nom}>
                          {p.nom} - {p.grade} ({p.specialite})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Co-professeur</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user-friends"></i>
                    <select 
                      value={formData.coProfesseur} 
                      onChange={(e) => setFormData({...formData, coProfesseur: e.target.value})} 
                      className="form-select"
                    >
                      <option value="">Aucun</option>
                      {professeursDisponibles
                        .filter(p => p.nom !== formData.professeur)
                        .map(p => (
                          <option key={p.id} value={p.nom}>
                            {p.nom} - {p.grade}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Planning avec liste des salles */}
            <div className="form-section">
              <div className="form-section-title">
                <i className="fas fa-calendar-alt"></i>
                Planning
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Salle *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-door-open"></i>
                    <select 
                      value={formData.salle} 
                      onChange={(e) => setFormData({...formData, salle: e.target.value})} 
                      className="form-select" 
                      required
                    >
                      <option value="">Sélectionner une salle</option>
                      {sallesDisponibles.map(s => (
                        <option key={s.id} value={s.nom}>
                          {s.nom} - Capacité: {s.capacite} places
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedSalle && (
                    <div className="salle-info">
                      <i className="fas fa-info-circle"></i>
                      <span>Capacité: {selectedSalle.capacite} places</span>
                      {selectedSalle.equipements && (
                        <span>Équipements: {selectedSalle.equipements.join(", ")}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-calendar-day"></i>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Heure début *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-clock"></i>
                    <input 
                      type="time" 
                      value={formData.heureDebut} 
                      onChange={(e) => setFormData({...formData, heureDebut: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Heure fin *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-hourglass-end"></i>
                    <input 
                      type="time" 
                      value={formData.heureFin} 
                      onChange={(e) => setFormData({...formData, heureFin: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>
              </div>
              {formData.heureDebut && formData.heureFin && (
                <div className="info-banner">
                  <i className="fas fa-info-circle"></i>
                  Durée estimée: {parseInt(formData.heureFin.split(':')[0]) - parseInt(formData.heureDebut.split(':')[0])} heure(s)
                </div>
              )}
            </div>

            {/* Section Observations */}
            <div className="form-section">
              <div className="form-section-title">
                <i className="fas fa-sticky-note"></i>
                Observations
              </div>
              <div className="form-group">
                <div className="input-with-icon">
                  <i className="fas fa-pen"></i>
                  <textarea 
                    value={formData.observations} 
                    onChange={(e) => setFormData({...formData, observations: e.target.value})} 
                    className="form-textarea" 
                    rows="3" 
                    placeholder="Instructions particulières, matériel nécessaire, etc..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <i className="fas fa-times"></i> Annuler
            </button>
            <button type="submit" className="btn-save">
              <i className="fas fa-save"></i> Planifier l'examen
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .btn-generate-code {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11px;
          cursor: pointer;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        
        .btn-generate-code:hover {
          background: #e2e8f0;
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        .salle-info {
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px;
          margin-top: 8px;
          font-size: 11px;
          color: #475569;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .salle-info i {
          color: #3b82f6;
          margin-right: 4px;
        }
        
        .info-banner {
          background: #eff6ff;
          border-radius: 8px;
          padding: 8px 12px;
          margin-top: 12px;
          font-size: 12px;
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-banner i {
          font-size: 14px;
        }
        
        .form-section {
          margin-bottom: 20px;
        }
        
        .form-section-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-section-title i {
          color: #3b82f6;
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
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
          pointer-events: none;
        }
        
        .input-with-icon .form-input,
        .input-with-icon .form-select,
        .input-with-icon .form-textarea {
          padding-left: 36px;
          width: 100%;
        }
        
        .input-with-icon .form-textarea {
          padding-top: 10px;
          padding-bottom: 10px;
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
        
        .modal-container {
          width: 750px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-body {
          padding: 20px;
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