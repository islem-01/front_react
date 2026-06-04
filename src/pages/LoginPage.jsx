import React, { useState } from "react";
import LeftPanel from "../components/LeftPanel";
import LoginForm from "../components/LoginForm";
import imageEnBas from "../assets/image_en_bas.png";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("administrateur");

  return (
    <div className="login-page">
      <div className="login-container">
        <LeftPanel />

        <div className="login-right">
          <div className="login-card">
            <LoginForm role={role} setRole={setRole} onLogin={onLogin} />
          </div>

          {/* Bottom illustration from assets */}
          <div className="login-bottom-illustration" aria-hidden="true">
            <img src={imageEnBas} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
