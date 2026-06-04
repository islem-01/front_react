import React, { useState, useMemo } from "react";
import { NIVEAUX, PROFESSORS, ROOMS, STUDENTS_DB } from "./data";
import "./AffectationWizard.css";

const STEPS = ["Groupe", "Examen", "Surveillants", "Salle", "Confirmation"];

function Field({ label, required, children }) {
  return (
    <div className="wiz-field">
      <label className="wiz-label">{label}{required && <span className="req">*</span>}</label>
      {children}
    </div>
  );
}

export default function AffectationWizard({ onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    niveau: "", filiere: "", groupe: "",
    examName: "", examDate: "", examStart: "", examEnd: "",
    professorId: "", coSupervisorId: "",
    roomId: "", observations: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Derived data
  const selectedNiveau = useMemo(() => NIVEAUX.find(n => n.name === form.niveau), [form.niveau]);
  const filieres = selectedNiveau?.filieres || [];

  const groupes = useMemo(() => {
    if (!form.niveau || !form.filiere) return [];
    const students = STUDENTS_DB.filter(s => s.niveau === form.niveau && s.filiere === form.filiere);
    const gSet = [...new Set(students.map(s => s.groupe))].sort();
    return gSet.map(g => ({ name: g, count: students.filter(s => s.groupe === g).length }));
  }, [form.niveau, form.filiere]);

  const groupStudents = useMemo(() => {
    if (!form.groupe) return [];
    return STUDENTS_DB.filter(s => s.niveau === form.niveau && s.filiere === form.filiere && s.groupe === form.groupe);
  }, [form.niveau, form.filiere, form.groupe]);

  const selectedRoom = ROOMS.find(r => r.id === form.roomId);
  const roomOk = selectedRoom && selectedRoom.capacity >= groupStudents.length;

  const validate = () => {
    if (step === 0 && (!form.niveau || !form.filiere || !form.groupe)) return "Veuillez sélectionner le niveau, la filière et le groupe.";
    if (step === 1 && (!form.examName || !form.examDate || !form.examStart || !form.examEnd)) return "Veuillez remplir toutes les informations de l'examen.";
    if (step === 2 && !form.professorId) return "Veuillez sélectionner un professeur principal.";
    if (step === 3 && !form.roomId) return "Veuillez choisir une salle.";
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { alert(err); return; }
    setStep(s => s + 1);
  };
  const prev = () => setStep(s => s - 1);

  const submit = () => {
    onComplete({
      niveau: form.niveau, filiere: form.filiere, groupe: form.groupe,
      examName: form.examName, examDate: form.examDate, examStart: form.examStart, examEnd: form.examEnd,
      professorId: parseInt(form.professorId), coSupervisorId: form.coSupervisorId ? parseInt(form.coSupervisorId) : null,
      roomId: form.roomId, observations: form.observations, seatMap: {},
    });
  };

  const prof = PROFESSORS.find(p => p.id === parseInt(form.professorId));
  const coprof = PROFESSORS.find(p => p.id === parseInt(form.coSupervisorId));

  return (
    <div className="wiz-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="wiz-modal">
        {/* Header */}
        <div className="wiz-header">
          <div>
            <h2 className="wiz-title">Nouvelle affectation d'examen</h2>
            <p className="wiz-subtitle">Étape {step+1} sur {STEPS.length}</p>
          </div>
          <button className="wiz-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Progress */}
        <div className="wiz-progress">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`wiz-step ${i < step ? "done" : i === step ? "active" : ""}`}>
                <div className="wiz-step-circle">
                  {i < step ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : <span>{i+1}</span>}
                </div>
                <span className="wiz-step-label">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`wiz-step-line ${i < step ? "done" : ""}`}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="wiz-body">

          {/* ── STEP 0: Groupe ────────────────── */}
          {step === 0 && (
            <div className="wiz-section">
              <h3 className="wiz-section-title">
                <span>🎓</span> Informations du groupe
              </h3>
              <div className="wiz-grid2">
                <Field label="Niveau d'étude" required>
                  <select className="wiz-select" value={form.niveau} onChange={e => { set("niveau", e.target.value); set("filiere",""); set("groupe",""); }}>
                    <option value="">— Sélectionner —</option>
                    {NIVEAUX.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                  </select>
                </Field>
                <Field label="Filière / Spécialité" required>
                  <select className="wiz-select" value={form.filiere} onChange={e => { set("filiere", e.target.value); set("groupe",""); }} disabled={!form.niveau}>
                    <option value="">— Sélectionner —</option>
                    {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Groupe" required>
                <div className="groupe-cards">
                  {groupes.map(g => (
                    <button key={g.name} type="button"
                      className={`groupe-card ${form.groupe === g.name ? "selected" : ""}`}
                      onClick={() => set("groupe", g.name)}>
                      <span className="groupe-letter">{g.name}</span>
                      <span className="groupe-count">{g.count} étudiants</span>
                    </button>
                  ))}
                  {!form.filiere && <p className="hint-text">Sélectionnez d'abord une filière</p>}
                </div>
              </Field>
              {groupStudents.length > 0 && (
                <div className="info-banner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  <strong>{groupStudents.length} étudiants</strong> dans ce groupe seront affectés à la salle.
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: Examen ─────────────────── */}
          {step === 1 && (
            <div className="wiz-section">
              <h3 className="wiz-section-title"><span>📝</span> Informations de l'examen</h3>
              <Field label="Matière / Intitulé de l'examen" required>
                <input className="wiz-input" type="text" value={form.examName} onChange={e => set("examName", e.target.value)} placeholder="Ex: Architecture des Ordinateurs" />
              </Field>
              <div className="wiz-grid3">
                <Field label="Date" required>
                  <input className="wiz-input" type="date" value={form.examDate} onChange={e => set("examDate", e.target.value)} />
                </Field>
                <Field label="Heure début" required>
                  <input className="wiz-input" type="time" value={form.examStart} onChange={e => set("examStart", e.target.value)} />
                </Field>
                <Field label="Heure fin" required>
                  <input className="wiz-input" type="time" value={form.examEnd} onChange={e => set("examEnd", e.target.value)} />
                </Field>
              </div>
              {form.examDate && form.examStart && form.examEnd && (
                <div className="info-banner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Durée: <strong>{(() => { const [h1,m1]=form.examStart.split(":").map(Number); const [h2,m2]=form.examEnd.split(":").map(Number); const diff=(h2*60+m2)-(h1*60+m1); return `${Math.floor(diff/60)}h${(diff%60).toString().padStart(2,"0")}`; })()}</strong>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Surveillants ─────────────── */}
          {step === 2 && (
            <div className="wiz-section">
              <h3 className="wiz-section-title"><span>👨‍🏫</span> Équipe de surveillance</h3>
              <Field label="Professeur principal" required>
                <select className="wiz-select" value={form.professorId} onChange={e => set("professorId", e.target.value)}>
                  <option value="">— Sélectionner —</option>
                  {PROFESSORS.filter(p => !["Assistante pédagogique","Surveillant"].includes(p.grade)).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.specialite})</option>
                  ))}
                </select>
              </Field>
              {prof && (
                <div className="prof-card">
                  <div className="prof-avatar">{prof.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div className="prof-info">
                    <div className="prof-name">{prof.name}</div>
                    <div className="prof-grade">{prof.grade} — {prof.specialite}</div>
                    <div className="prof-contact">📧 {prof.email} &nbsp; 📞 {prof.phone}</div>
                  </div>
                </div>
              )}
              <Field label="Co-surveillant (optionnel)">
                <select className="wiz-select" value={form.coSupervisorId} onChange={e => set("coSupervisorId", e.target.value)}>
                  <option value="">— Aucun —</option>
                  {PROFESSORS.filter(p => p.id !== parseInt(form.professorId)).map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.grade}</option>
                  ))}
                </select>
              </Field>
              {coprof && (
                <div className="prof-card secondary">
                  <div className="prof-avatar secondary">{coprof.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div className="prof-info">
                    <div className="prof-name">{coprof.name}</div>
                    <div className="prof-grade">{coprof.grade}</div>
                    <div className="prof-contact">📧 {coprof.email}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Salle ────────────────────── */}
          {step === 3 && (
            <div className="wiz-section">
              <h3 className="wiz-section-title"><span>🏛️</span> Choisir la salle</h3>
              <p className="wiz-hint">Groupe de <strong>{groupStudents.length} étudiants</strong>. Sélectionnez une salle avec une capacité suffisante.</p>
              <div className="room-cards">
                {ROOMS.map(room => {
                  const ok = room.capacity >= groupStudents.length;
                  return (
                    <button key={room.id} type="button"
                      className={`room-card ${form.roomId === room.id ? "selected" : ""} ${!ok ? "too-small" : ""}`}
                      onClick={() => ok && set("roomId", room.id)}>
                      <div className="room-card-header">
                        <div className="room-card-icon" style={{ background: room.color }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                        </div>
                        <div>
                          <div className="room-card-name">{room.name}</div>
                          <div className="room-card-floor">{room.floor}</div>
                        </div>
                        {form.roomId === room.id && (
                          <div className="room-selected-check">✓</div>
                        )}
                      </div>
                      <div className="room-card-stats">
                        <span className={`capacity-badge ${ok ? "ok" : "nok"}`}>
                          {room.capacity} places
                        </span>
                        <span className="room-grid-info">{room.cols}×{room.rows}</span>
                      </div>
                      <div className="room-equip">
                        {room.equipement.slice(0,3).map(e => <span key={e} className="equip-tag">{e}</span>)}
                      </div>
                      {!ok && <div className="room-too-small">Capacité insuffisante</div>}
                    </button>
                  );
                })}
              </div>
              <Field label="Observations (facultatif)">
                <textarea className="wiz-textarea" rows={2} value={form.observations} onChange={e => set("observations", e.target.value)} placeholder="Instructions spéciales pour cette affectation…" />
              </Field>
            </div>
          )}

          {/* ── STEP 4: Confirmation ─────────────── */}
          {step === 4 && (
            <div className="wiz-section">
              <h3 className="wiz-section-title"><span>✅</span> Récapitulatif</h3>
              <div className="recap-grid">
                <div className="recap-block">
                  <div className="recap-icon">🎓</div>
                  <div className="recap-content">
                    <div className="recap-label">Groupe</div>
                    <div className="recap-value">{form.niveau}</div>
                    <div className="recap-sub">{form.filiere} — Groupe {form.groupe} • {groupStudents.length} étudiants</div>
                  </div>
                </div>
                <div className="recap-block">
                  <div className="recap-icon">📝</div>
                  <div className="recap-content">
                    <div className="recap-label">Examen</div>
                    <div className="recap-value">{form.examName}</div>
                    <div className="recap-sub">{form.examDate} • {form.examStart} – {form.examEnd}</div>
                  </div>
                </div>
                <div className="recap-block">
                  <div className="recap-icon">👨‍🏫</div>
                  <div className="recap-content">
                    <div className="recap-label">Surveillance</div>
                    <div className="recap-value">{prof?.name}</div>
                    {coprof && <div className="recap-sub">Co: {coprof.name}</div>}
                  </div>
                </div>
                <div className="recap-block">
                  <div className="recap-icon">🏛️</div>
                  <div className="recap-content">
                    <div className="recap-label">Salle</div>
                    <div className="recap-value">{selectedRoom?.name}</div>
                    <div className="recap-sub">{selectedRoom?.floor} • {selectedRoom?.capacity} places disponibles</div>
                  </div>
                </div>
              </div>
              <div className="info-banner success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Tout est prêt. Après confirmation, vous pourrez placer chaque étudiant dans la salle via le plan interactif.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="wiz-footer">
          <button className="wiz-btn-cancel" onClick={onClose}>Annuler</button>
          <div style={{ display:"flex", gap:".5rem" }}>
            {step > 0 && <button className="wiz-btn-prev" onClick={prev}>← Précédent</button>}
            {step < STEPS.length - 1
              ? <button className="wiz-btn-next" onClick={next}>Suivant →</button>
              : <button className="wiz-btn-submit" onClick={submit}>✓ Confirmer l'affectation</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
