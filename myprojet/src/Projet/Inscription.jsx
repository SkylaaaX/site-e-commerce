import { Link } from "react-router-dom";
import { useState } from "react";

function Inscription() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    ville: "",
    age: "",
    adresse: "",
  });
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

    if (!formData.nom || !formData.prenom || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          ville: formData.ville,
          age: formData.age,
          adresse: formData.adresse,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur d'inscription.");
      } else {
        setSuccess("Inscription réussie !");
        setFormData({ nom: "", prenom: "", email: "", password: "", confirmPassword: "", ville: "", age: "", adresse: "" });
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
    box: {
      width: "100%",
      maxWidth: "440px",
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
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      border: "none",
      borderRadius: "12px",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "16px",
    },
    error: {
      color: "#fca5a5",
      marginTop: "14px",
      fontSize: "14px",
    },
    success: {
      color: "#34d399",
      marginTop: "14px",
      fontSize: "14px",
    },
    footerText: {
      marginTop: "20px",
      color: "#94a3b8",
      fontSize: "14px",
    },
    link: {
      color: "#60a5fa",
      fontWeight: 700,
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={styles.title}>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
            style={styles.input}
          />
          <input
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            style={styles.input}
          />
          <input
            name="ville"
            type="text"
            value={formData.ville}
            onChange={handleChange}
            placeholder="Ville"
            style={styles.input}
          />
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Âge"
            style={styles.input}
          />
          <textarea
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Adresse complète"
            style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            style={styles.input}
          />
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmer le mot de passe"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            S'inscrire
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <p style={styles.footerText}>
          Déjà un compte ? <Link to="/connexion" style={styles.link}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;
