import React, { useState } from "react";

export default function EditTeacherModal({ teacher, onSave, onClose, grades, filieres, statuts }) {
  const [formData, setFormData] = useState({ 
    ...teacher,
    specialites: teacher.specialites || [],
    photoPreview: teacher.photo || null
  });
  const [newSpecialite, setNewSpecialite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

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

  const handleResetPassword = () => {
    const newPassword = "teacher123";
    alert(`🔑 Mot de passe réinitialisé pour ${formData.prenom} ${formData.nom}\n📧 Email: ${formData.email}\n🔑 Nouveau mot de passe: ${newPassword}`);
    setShowResetPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2><i className="fas fa-edit"></i> Modifier l'enseignant</h2>
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
                <label htmlFor="photo-upload" className="photo-upload-label"><i className="fas fa-upload"></i> Changer l'image</label>
                <p className="photo-hint">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
              </div>
            </div>

            <div className="form-section-title"><i className="fas fa-user"></i> Informations personnelles</div>
            <div className="form-row">
              <div className="form-group"><label>Prénom *</label><input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="form-input" required /></div>
              <div className="form-group"><label>Nom *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="form-input" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Diplôme</label><input type="text" value={formData.diplome || ""} onChange={(e) => setFormData({...formData, diplome: e.target.value})} className="form-input" placeholder="Doctorat, HDR, Master..." /></div>
              <div className="form-group"><label>Université d'origine</label><input type="text" value={formData.universiteOrigine || ""} onChange={(e) => setFormData({...formData, universiteOrigine: e.target.value})} className="form-input" placeholder="Université" /></div>
            </div>
            <div className="form-row"><div className="form-group"><label>Date d'embauche</label><input type="date" value={formData.dateEmbauche || ""} onChange={(e) => setFormData({...formData, dateEmbauche: e.target.value})} className="form-input" /></div></div>

            <div className="form-section-title"><i className="fas fa-graduation-cap"></i> Informations professionnelles</div>
            <div className="form-row">
              <div className="form-group"><label>Grade *</label><select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="form-select" required>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select></div>
              <div className="form-group"><label>Filière principale *</label><select value={formData.filiere} onChange={(e) => setFormData({...formData, filiere: e.target.value})} className="form-select" required>
                {filieres.map(f => <option key={f} value={f}>{f}</option>)}
              </select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Statut *</label><select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="form-select" required>
                {statuts.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
              <div className="form-group"><label>Bureau</label><input type="text" value={formData.bureau || ""} onChange={(e) => setFormData({...formData, bureau: e.target.value})} className="form-input" placeholder="Ex: B301" /></div>
            </div>

            <div className="form-group">
              <label>Spécialités</label>
              <div className="specialites-input">
                <input type="text" value={newSpecialite} onChange={(e) => setNewSpecialite(e.target.value)} className="form-input" placeholder="Ajouter une spécialité" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialite())} />
                <button type="button" className="btn-add-specialite" onClick={handleAddSpecialite}><i className="fas fa-plus"></i></button>
              </div>
              <div className="specialites-list">{formData.specialites.map((s, index) => (<span key={index} className="specialite-tag">{s}<button type="button" onClick={() => handleRemoveSpecialite(s)}><i className="fas fa-times"></i></button></span>))}</div>
            </div>

            <div className="form-section-title"><i className="fas fa-envelope"></i> Contact</div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" value={formData.email || ""} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-input" /></div>
            </div>
            <div className="form-group"><label>Contact d'urgence</label><input type="tel" value={formData.contactUrgence || ""} onChange={(e) => setFormData({...formData, contactUrgence: e.target.value})} className="form-input" /></div>
            <div className="form-group"><label>Adresse</label><textarea value={formData.adresse || ""} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="form-textarea" rows="2" /></div>

            <div className="form-section-title"><i className="fas fa-clock"></i> Disponibilités</div>
            <div className="form-row">
              <div className="form-group"><label>Créneau 1</label><input type="text" value={formData.disponibilites?.[0] || ""} onChange={(e) => setFormData({...formData, disponibilites: [e.target.value, formData.disponibilites?.[1] || ""]})} className="form-input" placeholder="Ex: Lun 08:00-12:00" /></div>
              <div className="form-group"><label>Créneau 2</label><input type="text" value={formData.disponibilites?.[1] || ""} onChange={(e) => setFormData({...formData, disponibilites: [formData.disponibilites?.[0] || "", e.target.value]})} className="form-input" placeholder="Ex: Mer 14:00-17:00" /></div>
            </div>

            <div className="form-section-title"><i className="fas fa-key"></i> Sécurité du compte</div>
            <div className="form-group">
              <button type="button" className="btn-reset-password" onClick={() => setShowResetPassword(true)}>
                <i className="fas fa-key"></i> Réinitialiser le mot de passe
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-save">Enregistrer</button>
          </div>
        </form>
      </div>

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="modal-overlay" onClick={() => setShowResetPassword(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-key"></i> Réinitialisation du mot de passe</h3>
              <button className="close" onClick={() => setShowResetPassword(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Voulez-vous réinitialiser le mot de passe de :</p>
              <p><strong>{formData.prenom} {formData.nom}</strong></p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p>Un nouveau mot de passe temporaire sera généré.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowResetPassword(false)}>Annuler</button>
              <button className="btn-save" onClick={handleResetPassword}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-reset-password {
          width: 100%;
          padding: 10px;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 8px;
          cursor: pointer;
          color: #d97706;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-reset-password:hover {
          background: #fde68a;
        }
      `}</style>
    </div>
  );
}