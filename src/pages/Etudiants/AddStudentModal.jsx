import React, { useState } from "react";
import "./EtudiantsPage.css";

export default function AddStudentModal({ onAdd, onClose, niveaux, filieres }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    photo: null,
    photoPreview: null,
    niveau: "",
    filiere: "",
    groupe: "A",
    email: "",
    phone: "",
    cin: "",
    dateNaissance: "",
    lieuNaissance: "",
    adresse: "",
    inscription: new Date().getFullYear().toString()
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prenom || !formData.nom || !formData.niveau || !formData.filiere) {
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
            <i className="fas fa-user-plus"></i>
            Ajouter un étudiant
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Photo Upload Section */}
            <div className="form-group photo-upload-section">
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
                <label>CIN</label>
                <input 
                  type="text" 
                  value={formData.cin} 
                  onChange={(e) => setFormData({...formData, cin: e.target.value})} 
                  className="form-input" 
                  placeholder="Numéro CIN"
                />
              </div>
              <div className="form-group">
                <label>Date de naissance</label>
                <input 
                  type="date" 
                  value={formData.dateNaissance} 
                  onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})} 
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Lieu de naissance</label>
                <input 
                  type="text" 
                  value={formData.lieuNaissance} 
                  onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})} 
                  className="form-input" 
                  placeholder="Ville de naissance"
                />
              </div>
            </div>

            <div className="form-section-title">
              <i className="fas fa-graduation-cap"></i> Informations académiques
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Niveau *</label>
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
              <div className="form-group">
                <label>Filière *</label>
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
                <label>Groupe</label>
                <select 
                  value={formData.groupe} 
                  onChange={(e) => setFormData({...formData, groupe: e.target.value})} 
                  className="form-select"
                >
                  <option value="A">Groupe A</option>
                  <option value="B">Groupe B</option>
                  <option value="C">Groupe C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Année d'inscription</label>
                <input 
                  type="text" 
                  value={formData.inscription} 
                  onChange={(e) => setFormData({...formData, inscription: e.target.value})} 
                  className="form-input" 
                  placeholder="Année"
                />
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