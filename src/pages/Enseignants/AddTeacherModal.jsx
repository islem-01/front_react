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
    universiteOrigine: "",
    password: "",
    confirmPassword: ""
  });

  const [newSpecialite, setNewSpecialite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La photo ne doit pas dépasser 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: file, photoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialite = () => {
    if (newSpecialite.trim() && !formData.specialites.includes(newSpecialite.trim())) {
      setFormData({ ...formData, specialites: [...formData.specialites, newSpecialite.trim()] });
      setNewSpecialite("");
    }
  };

  const handleRemoveSpecialite = (specialite) => {
    setFormData({ ...formData, specialites: formData.specialites.filter(s => s !== specialite) });
  };

  const generateRandomPassword = () => {
    // Mot de passe plus sécurisé avec mélange de caractères
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specials = "!@#$%";
    
    const allChars = lowercase + uppercase + numbers + specials;
    let password = "";
    
    // Au moins une minuscule
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    // Au moins une majuscule
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    // Au moins un chiffre
    password += numbers[Math.floor(Math.random() * numbers.length)];
    // Au moins un caractère spécial
    password += specials[Math.floor(Math.random() * specials.length)];
    
    // Compléter avec des caractères aléatoires
    for (let i = password.length; i < 10; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Mélanger le mot de passe
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData({ ...formData, password: password, confirmPassword: password });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.prenom || !formData.nom) {
      alert("Veuillez saisir le prénom et le nom");
      return;
    }
    if (!formData.grade) {
      alert("Veuillez sélectionner un grade");
      return;
    }
    if (!formData.filiere) {
      alert("Veuillez sélectionner une filière");
      return;
    }
    if (!formData.statut) {
      alert("Veuillez sélectionner un statut");
      return;
    }
    if (!formData.email) {
      alert("L'email est obligatoire pour la création du compte");
      return;
    }
    if (!formData.password) {
      alert("Veuillez saisir un mot de passe");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Veuillez saisir un email valide");
      return;
    }
    
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2><i className="fas fa-chalkboard-user"></i> Ajouter un enseignant</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Photo Upload */}
            <div className="photo-upload-section">
              <label>Photo de profil</label>
              <div className="photo-upload-container">
                {formData.photoPreview ? (
                  <div className="photo-preview">
                    <img src={formData.photoPreview} alt="Aperçu" className="preview-image" />
                    <button type="button" className="remove-photo" onClick={() => setFormData({ ...formData, photo: null, photoPreview: null })}>
                      <i className="fas fa-trash-alt"></i> Supprimer
                    </button>
                  </div>
                ) : (
                  <div className="photo-upload-placeholder">
                    <i className="fas fa-camera"></i>
                    <span>Cliquez pour ajouter une photo</span>
                  </div>
                )}
                <input type="file" id="photo-upload" accept="image/jpeg, image/png, image/jpg, image/gif" onChange={handlePhotoChange} className="photo-input" />
                <label htmlFor="photo-upload" className="photo-upload-label"><i className="fas fa-upload"></i> Choisir une image</label>
                <p className="photo-hint">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
              </div>
            </div>

            <div className="form-section-title"><i className="fas fa-user"></i> Informations personnelles</div>
            <div className="form-row">
              <div className="form-group"><label>Prénom *</label><input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="form-input" placeholder="Prénom" required /></div>
              <div className="form-group"><label>Nom *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="form-input" placeholder="Nom" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Diplôme</label><input type="text" value={formData.diplome} onChange={(e) => setFormData({...formData, diplome: e.target.value})} className="form-input" placeholder="Doctorat, HDR, Master..." /></div>
              <div className="form-group"><label>Université d'origine</label><input type="text" value={formData.universiteOrigine} onChange={(e) => setFormData({...formData, universiteOrigine: e.target.value})} className="form-input" placeholder="Université" /></div>
            </div>
            <div className="form-row"><div className="form-group"><label>Date d'embauche</label><input type="date" value={formData.dateEmbauche} onChange={(e) => setFormData({...formData, dateEmbauche: e.target.value})} className="form-input" /></div></div>

            <div className="form-section-title"><i className="fas fa-graduation-cap"></i> Informations professionnelles</div>
            <div className="form-row">
              <div className="form-group"><label>Grade *</label><select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="form-select" required>
                <option value="">Sélectionner un grade</option>{grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select></div>
              <div className="form-group"><label>Filière principale *</label><select value={formData.filiere} onChange={(e) => setFormData({...formData, filiere: e.target.value})} className="form-select" required>
                <option value="">Sélectionner une filière</option>{filieres.map(f => <option key={f} value={f}>{f}</option>)}
              </select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Statut *</label><select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="form-select" required>
                <option value="">Sélectionner un statut</option>{statuts.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
              <div className="form-group"><label>Bureau</label><input type="text" value={formData.bureau} onChange={(e) => setFormData({...formData, bureau: e.target.value})} className="form-input" placeholder="Ex: B301" /></div>
            </div>

            <div className="form-group">
              <label>Spécialités</label>
              <div className="specialites-input">
                <input type="text" value={newSpecialite} onChange={(e) => setNewSpecialite(e.target.value)} className="form-input" placeholder="Ajouter une spécialité" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialite())} />
                <button type="button" className="btn-add-specialite" onClick={handleAddSpecialite}><i className="fas fa-plus"></i></button>
              </div>
              <div className="specialites-list">{formData.specialites.map((s, index) => (<span key={index} className="specialite-tag">{s}<button type="button" onClick={() => handleRemoveSpecialite(s)}><i className="fas fa-times"></i></button></span>))}</div>
            </div>

            <div className="form-section-title"><i className="fas fa-envelope"></i> Compte utilisateur</div>
            <div className="form-row">
              <div className="form-group"><label>Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" placeholder="exemple@iit.tn" required /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-input" placeholder="+216 XX XXX XXX" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mot de passe *</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="form-input" 
                    placeholder="Mot de passe" 
                    required 
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe *</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    className="form-input" 
                    placeholder="Confirmer le mot de passe" 
                    required 
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <button type="button" className="btn-generate-password" onClick={generateRandomPassword}>
                <i className="fas fa-random"></i> Générer un mot de passe aléatoire
              </button>
            </div>

            <div className="form-group"><label>Contact d'urgence</label><input type="tel" value={formData.contactUrgence} onChange={(e) => setFormData({...formData, contactUrgence: e.target.value})} className="form-input" placeholder="+216 XX XXX XXX" /></div>
            <div className="form-group"><label>Adresse</label><textarea value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="form-textarea" rows="2" placeholder="Adresse complète" /></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}><i className="fas fa-times"></i> Annuler</button>
            <button type="submit" className="btn-save"><i className="fas fa-save"></i> Créer le compte</button>
          </div>
        </form>
      </div>

      <style>{`
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-input-wrapper input {
          padding-right: 40px;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }
        .password-toggle:hover {
          color: #1a3a8f;
        }
        .btn-generate-password {
          width: 100%;
          padding: 8px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          color: #475569;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-generate-password:hover {
          background: #e2e8f0;
          border-color: #3b82f6;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
}