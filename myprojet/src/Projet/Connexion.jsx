import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "./Context/UserContext.js";

function Connexion() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur de connexion.");
      } else {
        login(data.user);
        setSuccess("Connexion réussie !");
        setFormData({ email: "", password: "" });
        setTimeout(() => navigate("/mon-espace"), 800);
      }
    } catch {
      setError("Erreur serveur. Réessayez plus tard.");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      backgroundColor: "transparent",
      color: "#eef2ff",
    },
    formBox: {
      width: "100%",
      maxWidth: "420px",
      backgroundColor: "#0f172a",
      borderRadius: "20px",
      padding: "36px",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
    },
    title: {
      fontSize: "26px",
      marginBottom: "24px",
      color: "#eef2ff",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.18)",
      marginBottom: "16px",
      fontSize: "16px",
      backgroundColor: "#0b1223",
      color: "#eef2ff",
    },
    button: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "16px",
    },
    error: {
      color: "#fca5a5",
      marginTop: "16px",
      fontSize: "14px",
    },
    success: {
      color: "#34d399",
      marginTop: "16px",
      fontSize: "14px",
    },
    footerText: {
      marginTop: "20px",
      fontSize: "14px",
      color: "#94a3b8",
    },
    link: {
      color: "#60a5fa",
      textDecoration: "none",
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Se connecter
          </button>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
        </form>
        <p style={styles.footerText}>
          Pas encore de compte ? <Link to="/inscription" style={styles.link}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
