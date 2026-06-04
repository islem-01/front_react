import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/AdminLayout";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, email) => {
    // Ajouter un nom d'utilisateur basé sur l'email
    const name = email.split('@')[0];
    setUser({ 
      role, 
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1) // Première lettre en majuscule
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="app">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout} />
  );
}

export default App;