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
          <h2>✏️ Modifier l'examen</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Matière</label>
                <input type="text" value={formData.matiere} onChange={(e) => setFormData({...formData, matiere: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Niveau</label>
                <select value={formData.niveau} onChange={(e) => setFormData({...formData, niveau: e.target.value})} className="form-select">
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Filière</label>
                <select value={formData.filiere} onChange={(e) => setFormData({...formData, filiere: e.target.value})} className="form-select">
                  {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Statut</label>
                <select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="form-select">
                  <option value="Planifié">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                  <option value="Reporté">Reporté</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nombre d'étudiants</label>
                <input type="number" value={formData.nbrEtudiants} onChange={(e) => setFormData({...formData, nbrEtudiants: parseInt(e.target.value)})} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Professeur</label>
                <input type="text" value={formData.professeur} onChange={(e) => setFormData({...formData, professeur: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label>Salle</label>
                <input type="text" value={formData.salle} onChange={(e) => setFormData({...formData, salle: e.target.value})} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label>Heure début</label>
                <input type="time" value={formData.heureDebut} onChange={(e) => setFormData({...formData, heureDebut: e.target.value})} className="form-input" />
              </div>
            </div>
            {formData.statut === "Terminé" && (
              <div className="form-row">
                <div className="form-group">
                  <label>Présents</label>
                  <input type="number" value={formData.nbrPresent} onChange={(e) => setFormData({...formData, nbrPresent: parseInt(e.target.value), nbrAbsent: formData.nbrEtudiants - parseInt(e.target.value)})} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Absents</label>
                  <input type="number" value={formData.nbrAbsent} disabled className="form-input" />
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Observations</label>
              <textarea value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} className="form-textarea" rows="2" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}