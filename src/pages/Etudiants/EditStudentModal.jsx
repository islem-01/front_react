import React, { useState } from "react";
import "./EtudiantsPage.css";

export default function EditStudentModal({ student, onSave, onClose, niveaux, filieres }) {
  const [formData, setFormData] = useState({ ...student });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>✏️ Modifier l'étudiant</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="form-input" />
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
                <label>Groupe</label>
                <select value={formData.groupe} onChange={(e) => setFormData({...formData, groupe: e.target.value})} className="form-select">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="form-select">
                  <option value="Actif">Actif</option>
                  <option value="Suspendu">Suspendu</option>
                  <option value="Diplômé">Diplômé</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <textarea value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="form-textarea" rows="2" />
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