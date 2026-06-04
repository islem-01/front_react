import React, { useState } from "react";

export default function AddTeacherModal({ onAdd, onClose, grades, filieres, statuts }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    photo: "👨‍🏫",
    grade: "",
    filiere: "",
    specialites: [],
    statut: "",
    email: "",
    phone: "",
    bureau: "",
    dateEmbauche: "",
    disponibilites: ["", ""],
    contactUrgence: "",
    adresse: "",
    diplome: "",
    universiteOrigine: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prenom || !formData.nom || !formData.grade || !formData.filiere) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>➕ Ajouter un enseignant</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="form-input" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Grade *</label>
                <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="form-select" required>
                  <option value="">Sélectionner</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
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
                <label>Statut *</label>
                <select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="form-select" required>
                  <option value="">Sélectionner</option>
                  {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Bureau</label>
                <input type="text" value={formData.bureau} onChange={(e) => setFormData({...formData, bureau: e.target.value})} className="form-input" placeholder="Ex: B301" />
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
              <label>Contact d'urgence</label>
              <input type="tel" value={formData.contactUrgence} onChange={(e) => setFormData({...formData, contactUrgence: e.target.value})} className="form-input" />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <textarea value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="form-textarea" rows="2" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}