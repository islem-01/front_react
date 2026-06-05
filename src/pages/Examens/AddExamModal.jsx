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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.matiere || !formData.niveau || !formData.filiere || !formData.professeur || !formData.salle || !formData.date || !formData.heureDebut || !formData.heureFin) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onAdd(formData);
  };

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
                  <div className="input-with-icon">
                    <i className="fas fa-barcode"></i>
                    <input 
                      type="text" 
                      value={formData.code} 
                      onChange={(e) => setFormData({...formData, code: e.target.value})} 
                      className="form-input" 
                      placeholder="Ex: INF101" 
                    />
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

            {/* Section Enseignants */}
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
                    <input 
                      type="text" 
                      value={formData.professeur} 
                      onChange={(e) => setFormData({...formData, professeur: e.target.value})} 
                      className="form-input" 
                      placeholder="Ex: Dr. Karim Benali"
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Co-professeur</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user-friends"></i>
                    <input 
                      type="text" 
                      value={formData.coProfesseur} 
                      onChange={(e) => setFormData({...formData, coProfesseur: e.target.value})} 
                      className="form-input" 
                      placeholder="Optionnel" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Planning */}
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
                    <input 
                      type="text" 
                      value={formData.salle} 
                      onChange={(e) => setFormData({...formData, salle: e.target.value})} 
                      className="form-input" 
                      placeholder="Ex: Salle A101"
                      required 
                    />
                  </div>
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
    </div>
  );
}