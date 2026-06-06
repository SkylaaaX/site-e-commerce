import { useContext } from "react";
import { PanierContext } from "./Context/PanierContext";

function DetailProduitCatalogue({ produit, onClose }) {
  const { ajouterAuPanier } = useContext(PanierContext);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#0f172a",
      borderRadius: "16px",
      padding: "30px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      position: "relative",
      border: "1px solid rgba(255,255,255,0.12)",
    },
    close: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#eef2ff",
    },
    image: {
      width: "100%",
      height: "250px",
      objectFit: "contain",
      borderRadius: "10px",
      marginBottom: "15px",
      backgroundColor: "#08102b",
    },
    name: { fontSize: "22px", fontWeight: "600", marginBottom: "10px", color: "#eef2ff" },
    description: { fontSize: "16px", marginBottom: "15px", color: "#cbd5e1" },
    price: { fontSize: "18px", fontWeight: "500", marginBottom: "20px", color: "#60a5fa" },
    button: {
      padding: "12px 20px",
      backgroundColor: "#00d9ff",
      border: "none",
      borderRadius: "25px",
      color: "#070a1a",
      fontWeight: 500,
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <span style={styles.close} onClick={onClose}>×</span>
        <img src={produit.image} alt={produit.nom} style={styles.image} />
        <div style={styles.name}>{produit.nom}</div>
        <div style={styles.description}>{produit.description}</div>
        <div style={styles.price}>{produit.prix} €</div>
        <button
          style={styles.button}
          onClick={() => {
            ajouterAuPanier(produit);
            onClose();
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#99ddff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#88ccff")}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default DetailProduitCatalogue;
