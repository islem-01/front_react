import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/AdminLayout";
import TeacherLayout from "./pages/Teacher/TeacherLayout";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, email) => {
    // Définir le nom selon le rôle et l'email
    let name = "";
    
    if (role === "administrateur") {
      name = "Administrateur";
    } else if (role === "enseignant") {
      // Noms des enseignants selon l'email
      if (email === "kamel.mansouri@iit.tn") {
        name = "Prof. Kamel Mansouri";
      } else if (email === "salma.bouaziz@iit.tn") {
        name = "Prof. Salma Bouaziz";
      } else if (email === "ines.trabelsi@iit.tn") {
        name = "Dr. Ines Trabelsi";
      } else {
        name = email.split('@')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
    
    setUser({ 
      role, 
      email,
      name: name
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

  // Afficher le layout correspondant au rôle
  if (user.role === "administrateur") {
    return <AdminLayout user={user} onLogout={handleLogout} />;
  } else if (user.role === "enseignant") {
    return <TeacherLayout user={user} onLogout={handleLogout} />;
  }

  return null;
}

export default App;