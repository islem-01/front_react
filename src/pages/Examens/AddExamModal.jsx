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
          <h2>📝 Planifier un examen</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Matière *</label>
                <input type="text" value={formData.matiere} onChange={(e) => setFormData({...formData, matiere: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Code examen</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="form-input" placeholder="Ex: INF101" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Niveau *</label>
                <select value={formData.niveau} onChange={(e) => setFormData({...formData, niveau: e.target.value})} className="form-select" required>
                  <option value="">Sélectionner</option>
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Filière *</label>
                <select value={formData.filiere} onChange={(e) => setFormData({...formData, filiere: e.target.value})} className="form-select" required>
                  <option value="">Sélectionner</option>
                  {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Groupe</label>
                <select value={formData.groupe} onChange={(e) => setFormData({...formData, groupe: e.target.value})} className="form-select">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nombre d'étudiants</label>
                <input type="number" value={formData.nbrEtudiants} onChange={(e) => setFormData({...formData, nbrEtudiants: parseInt(e.target.value)})} className="form-input" min="1" max="200" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Professeur principal *</label>
                <input type="text" value={formData.professeur} onChange={(e) => setFormData({...formData, professeur: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Co-professeur</label>
                <input type="text" value={formData.coProfesseur} onChange={(e) => setFormData({...formData, coProfesseur: e.target.value})} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Salle *</label>
                <input type="text" value={formData.salle} onChange={(e) => setFormData({...formData, salle: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="form-input" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Heure début *</label>
                <input type="time" value={formData.heureDebut} onChange={(e) => setFormData({...formData, heureDebut: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Heure fin *</label>
                <input type="time" value={formData.heureFin} onChange={(e) => setFormData({...formData, heureFin: e.target.value})} className="form-input" required />
              </div>
            </div>
            <div className="form-group">
              <label>Observations</label>
              <textarea value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} className="form-textarea" rows="2" placeholder="Instructions particulières..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">Planifier</button>
          </div>
        </form>
      </div>
    </div>
  );
}