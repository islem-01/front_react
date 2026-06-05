import React, { useState } from "react";

export default function AddTeacherModal({ onAdd, onClose, grades, filieres, statuts }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    photo: null,
    photoPreview: null,
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

  const [newSpecialite, setNewSpecialite] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialite = () => {
    if (newSpecialite.trim() && !formData.specialites.includes(newSpecialite.trim())) {
      setFormData({
        ...formData,
        specialites: [...formData.specialites, newSpecialite.trim()]
      });
      setNewSpecialite("");
    }
  };

  const handleRemoveSpecialite = (specialite) => {
    setFormData({
      ...formData,
      specialites: formData.specialites.filter(s => s !== specialite)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prenom || !formData.nom || !formData.grade || !formData.filiere || !formData.statut) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>
            <i className="fas fa-chalkboard-user"></i>
            Ajouter un enseignant
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Photo Upload Section */}
            <div className="photo-upload-section">
              <label>Photo de profil</label>
              <div className="photo-upload-container">
                {formData.photoPreview ? (
                  <div className="photo-preview">
                    <img src={formData.photoPreview} alt="Aperçu" className="preview-image" />
                    <button
                      type="button"
                      className="remove-photo"
                      onClick={() => setFormData({ ...formData, photo: null, photoPreview: null })}
                    >
                      <i className="fas fa-trash-alt"></i> Supprimer
                    </button>
                  </div>
                ) : (
                  <div className="photo-upload-placeholder">
                    <i className="fas fa-camera"></i>
                    <span>Cliquez pour ajouter une photo</span>
                  </div>
                )}
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpeg, image/png, image/jpg, image/gif"
                  onChange={handlePhotoChange}
                  className="photo-input"
                />
                <label htmlFor="photo-upload" className="photo-upload-label">
                  <i className="fas fa-upload"></i> Choisir une image
                </label>
                <p className="photo-hint">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
              </div>
            </div>

            <div className="form-section-title">
              <i className="fas fa-user"></i> Informations personnelles
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input 
                  type="text" 
                  value={formData.prenom} 
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
                  className="form-input" 
                  placeholder="Prénom"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input 
                  type="text" 
                  value={formData.nom} 
                  onChange={(e) => setFormData({...formData, nom: e.target.value})} 
                  className="form-input" 
                  placeholder="Nom"
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Diplôme</label>
                <input 
                  type="text" 
                  value={formData.diplome} 
                  onChange={(e) => setFormData({...formData, diplome: e.target.value})} 
                  className="form-input" 
                  placeholder="Doctorat, HDR, Master..."
                />
              </div>
              <div className="form-group">
                <label>Université d'origine</label>
                <input 
                  type="text" 
                  value={formData.universiteOrigine} 
                  onChange={(e) => setFormData({...formData, universiteOrigine: e.target.value})} 
                  className="form-input" 
                  placeholder="Université"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date d'embauche</label>
                <input 
                  type="date" 
                  value={formData.dateEmbauche} 
                  onChange={(e) => setFormData({...formData, dateEmbauche: e.target.value})} 
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-section-title">
              <i className="fas fa-graduation-cap"></i> Informations professionnelles
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grade *</label>
                <select 
                  value={formData.grade} 
                  onChange={(e) => setFormData({...formData, grade: e.target.value})} 
                  className="form-select" 
                  required
                >
                  <option value="">Sélectionner un grade</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Filière principale *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label>Statut *</label>
                <select 
                  value={formData.statut} 
                  onChange={(e) => setFormData({...formData, statut: e.target.value})} 
                  className="form-select" 
                  required
                >
                  <option value="">Sélectionner un statut</option>
                  {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Bureau</label>
                <input 
                  type="text" 
                  value={formData.bureau} 
                  onChange={(e) => setFormData({...formData, bureau: e.target.value})} 
                  className="form-input" 
                  placeholder="Ex: B301"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Spécialités</label>
              <div className="specialites-input">
                <input 
                  type="text" 
                  value={newSpecialite} 
                  onChange={(e) => setNewSpecialite(e.target.value)} 
                  className="form-input" 
                  placeholder="Ajouter une spécialité"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialite())}
                />
                <button type="button" className="btn-add-specialite" onClick={handleAddSpecialite}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="specialites-list">
                {formData.specialites.map((s, index) => (
                  <span key={index} className="specialite-tag">
                    {s}
                    <button type="button" onClick={() => handleRemoveSpecialite(s)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section-title">
              <i className="fas fa-envelope"></i> Contact
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="form-input" 
                  placeholder="exemple@iit.tn"
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="form-input" 
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contact d'urgence</label>
              <input 
                type="tel" 
                value={formData.contactUrgence} 
                onChange={(e) => setFormData({...formData, contactUrgence: e.target.value})} 
                className="form-input" 
                placeholder="+216 XX XXX XXX"
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <textarea 
                value={formData.adresse} 
                onChange={(e) => setFormData({...formData, adresse: e.target.value})} 
                className="form-textarea" 
                rows="2"
                placeholder="Adresse complète"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <i className="fas fa-times"></i> Annuler
            </button>
            <button type="submit" className="btn-save">
              <i className="fas fa-save"></i> Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}