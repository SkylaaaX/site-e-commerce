import { useContext } from "react";
import { PanierContext } from "./Context/PanierContext";

function DetailProduitCatalogue({ produit, onClose }) {
  const { ajouterAuPanier } = useContext(PanierContext);

  if (!produit) return null;

  const categoryMap = {
    1: "Casques",
    2: "Accessoires",
    3: "Jeux",
    4: "Simulateurs",
  };

  const safeNom = produit.nom || "Produit";
  const safeDescription =
    produit.description || "Aucune description disponible pour ce produit.";
  const safePrix =
    produit.prix !== undefined && produit.prix !== null ? produit.prix : "N/A";
  const safeImage =
    produit.image ||
    "https://via.placeholder.com/400x250?text=Produit+VR";
  const safeCategory = categoryMap[produit.idCategorie] || produit.categorie || "Non catégorisé";
  const orderedCount = Number(produit.nb_commandes || 0);
  const stock = Number(produit.quantite || 0);
  const isTrending = orderedCount >= 3;

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
      padding: "28px",
      maxWidth: "760px",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      position: "relative",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#eef2ff",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "22px",
    },
    close: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "22px",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#eef2ff",
    },
    image: {
      width: "100%",
      height: "290px",
      objectFit: "contain",
      borderRadius: "12px",
      backgroundColor: "#08102b",
      border: "1px solid rgba(255,255,255,0.08)",
    },
    left: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    right: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    name: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#eef2ff",
      marginTop: "6px",
    },
    tendance: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      backgroundColor: isTrending ? "#ef4444" : "#1e293b",
      color: "#fff",
      fontSize: "12px",
      fontWeight: 800,
      width: "fit-content",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    meta: {
      display: "grid",
      gap: "8px",
      backgroundColor: "#08102b",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "12px",
      color: "#cbd5e1",
      fontSize: "14px",
    },
    description: {
      fontSize: "15px",
      color: "#cbd5e1",
      lineHeight: 1.55,
      backgroundColor: "#08102b",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "12px",
      minHeight: "100px",
    },
    price: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#60a5fa",
    },
    buttonRow: {
      display: "flex",
      gap: "10px",
      marginTop: "8px",
    },
    button: {
      padding: "12px 16px",
      backgroundColor: "#00d9ff",
      border: "none",
      borderRadius: "12px",
      color: "#070a1a",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "15px",
      flex: 1,
    },
    secondary: {
      padding: "12px 16px",
      backgroundColor: "#1f2937",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: "12px",
      color: "#e5e7eb",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "15px",
      flex: 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span style={styles.close} onClick={onClose}>
          ×
        </span>

        <div style={styles.left}>
          <img src={safeImage} alt={safeNom} style={styles.image} />
        </div>

        <div style={styles.right}>
          <div style={styles.tendance}>{isTrending ? "Tendance" : "Produit"}</div>
          <div style={styles.name}>{safeNom}</div>

          <div style={styles.price}>{safePrix} €</div>

          <div style={styles.meta}>
            <div><strong>Catégorie :</strong> {safeCategory}</div>
            <div><strong>Stock disponible :</strong> {stock}</div>
            <div><strong>Commandes :</strong> {orderedCount}</div>
          </div>

          <div style={styles.description}>
            <strong>Description</strong>
            <div style={{ marginTop: "8px" }}>{safeDescription}</div>
          </div>

          <div style={styles.buttonRow}>
            <button
              style={styles.button}
              onClick={() => {
                ajouterAuPanier(produit);
                onClose();
              }}
            >
              Ajouter au panier
            </button>
            <button style={styles.secondary} onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduitCatalogue;
