import React, { useContext } from "react";
import { PanierContext } from "../Context/PanierContext";

function ArticleCard({ produit }) {
  const { ajouterAuPanier } = useContext(PanierContext);

  const styles = {
    card: {
      background: "#0f172a",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "18px",
      boxShadow: "0 2px 14px rgba(0,0,0,0.35)",
      textAlign: "center",
    },
    image: {
      width: "100%",
      maxHeight: "180px",
      objectFit: "contain",
      borderRadius: "10px",
      marginBottom: "10px",
      backgroundColor: "#08102b",
    },
    name: { fontSize: "16px", fontWeight: "600", marginBottom: "5px", color: "#eef2ff" },
    price: { fontSize: "15px", marginBottom: "10px", color: "#60a5fa" },
    button: {
      padding: "10px",
      width: "100%",
      backgroundColor: "#00d9ff",
      border: "none",
      borderRadius: "25px",
      color: "#070a1a",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.card}>
      <img src={produit.image} alt={produit.nom} style={styles.image} />
      <div style={styles.name}>{produit.nom}</div>
      <div style={styles.price}>{produit.prix} €</div>
      <button
        style={styles.button}
        onClick={() => ajouterAuPanier(produit)}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#99ddff")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#88ccff")}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default ArticleCard;
