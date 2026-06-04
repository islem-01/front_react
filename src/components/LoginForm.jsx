import React, { useState } from "react";
import iitColorLogo from "../assets/iit_couleur.png";
import "./LoginForm.css";

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginForm({ role, setRole, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onLogin(role, email);
  };

  return (
    <div className="login-form-wrapper">
      {/* IIT colored logo */}
      <div className="form-logo-wrapper">
        <img src={iitColorLogo} alt="IIT Logo" className="form-logo" />
      </div>

      <h2 className="form-title">Bienvenue !</h2>
      <p className="form-subtitle">Connectez-vous à votre espace</p>

      {/* Role tabs */}
      <div className="role-tabs">
        <button
          type="button"
          className={`role-tab ${role === "administrateur" ? "active" : ""}`}
          onClick={() => setRole("administrateur")}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="tab-icon">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
          Administrateur
        </button>
        <button
          type="button"
          className={`role-tab ${role === "enseignant" ? "active" : ""}`}
          onClick={() => setRole("enseignant")}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="tab-icon">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z"/>
          </svg>
          Enseignant
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="form-field">
          <label htmlFor="email">Adresse e-mail</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 6.667l7.5 5 7.5-5"/>
                <rect x="1.667" y="4.167" width="16.667" height="11.667" rx="2"/>
              </svg>
            </span>
            <input
              id="email"
              type="email"
              placeholder="exemple@universite.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-field">
          <label htmlFor="password">Mot de passe</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="14" height="10" rx="2"/>
                <path d="M7 9V6a3 3 0 016 0v3"/>
              </svg>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Afficher/masquer le mot de passe"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="checkbox-custom" />
            Se souvenir de moi
          </label>
          <button type="button" className="forgot-link">
            Mot de passe oublié ?
          </button>
        </div>

        {/* Error */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className={`submit-btn ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 3H7a2 2 0 00-2 2v10a2 2 0 002 2h6"/>
                <path d="M16 10H9m4-3l3 3-3 3"/>
              </svg>
              Se connecter
            </>
          )}
        </button>

        {/* Divider */}
        <div className="divider-or">
          <span>ou continuer avec</span>
        </div>

        {/* Social buttons */}
        <div className="social-btns">
          <button type="button" className="social-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="social-btn">
            <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Microsoft
          </button>
        </div>

        {/* Register link */}
        <p className="register-link">
          Vous n'avez pas de compte ?{" "}
          <button type="button" className="link-btn">Demander un accès</button>
        </p>
      </form>
    </div>
  );
}
