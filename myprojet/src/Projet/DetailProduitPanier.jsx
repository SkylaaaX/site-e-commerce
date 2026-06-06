import React, { useContext } from "react";
import { PanierContext } from "./Context/PanierContext";

function DetailProduitPanier({ produit, onClose }) {
  const { supprimerArticle } = useContext(PanierContext);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      overflowY: "auto",
      padding: "20px",
    },
    modal: {
      background: "#0f172a",
      padding: "30px",
      borderRadius: "12px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      position: "relative",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
    },
    image: {
      width: "100%",
      height: "auto",
      maxHeight: "300px",
      objectFit: "contain",
      borderRadius: "10px",
      marginBottom: "20px",
      backgroundColor: "#08102b",
    },
    nom: { fontSize: "22px", fontWeight: 600, marginBottom: "10px", color: "#eef2ff" },
    desc: { fontSize: "16px", marginBottom: "10px", color: "#cbd5e1" },
    prix: { fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "#60a5fa" },
    button: {
      padding: "10px 20px",
      margin: "10px 0",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
      color: "#fff",
      backgroundColor: "#ef4444",
    },
    close: { position: "absolute", top: "10px", right: "15px", cursor: "pointer", fontSize: "20px", fontWeight: 700, color: "#eef2ff" },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span style={styles.close} onClick={onClose}>×</span>
        <img src={produit.image} alt={produit.nom} style={styles.image} />
        <div style={styles.nom}>{produit.nom}</div>
        <div style={styles.desc}>{produit.description || "Pas de description disponible."}</div>
        <div style={styles.prix}>Prix : {produit.prix} €</div>

        <button
          style={styles.button}
          onClick={() => { supprimerArticle(produit.idProduit); onClose(); }}
        >
          Supprimer du panier
        </button>
      </div>
    </div>
  );
}

export default DetailProduitPanier;
