import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PanierContext } from "./Context/PanierContext.jsx";
import DetailProduitCatalogue from "./DetailProduitCatalogue";
import { useEffect } from "react";
import { ProductsContext } from "./Context/ProductsContext";

function Catalogue() {
  const navigate = useNavigate(); // pour redirection
  const { panier, ajouterAuPanier } = useContext(PanierContext);

  const { produits, refreshProducts } = useContext(ProductsContext);
  const [recherche, setRecherche] = useState("");
  const [produitDetail, setProduitDetail] = useState(null); // Pour le modal

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase())
    );
  }, [produits, recherche]);

  useEffect(() => {
    // ensure we have latest products when this view mounts
    refreshProducts();
  }, [refreshProducts]);

  const categoryMap = {
    1: "Casques",
    2: "Accessoires",
    3: "Jeux",
    4: "Simulateurs",
  };

  // Styles
  const styles = {
    container: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px", color: "#eef2ff" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", fontWeight: "600", color: "#eef2ff" },
    panierContainer: { display: "flex", alignItems: "center", gap: "15px" },
    panierCompteur: { fontSize: "18px", fontWeight: "500" },
    boutonPanier: {
      padding: "8px 16px",
      borderRadius: "25px",
      border: "none",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      cursor: "pointer",
      fontWeight: 500,
      transition: "background-color 0.3s",
    },
    search: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.18)",
      fontSize: "15px",
      backgroundColor: "#0f172a",
      color: "#eef2ff",
      outline: "none",
      marginBottom: "25px",
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
    card: { background: "#0f172a", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 14px rgba(0,0,0,0.35)", textAlign: "center" },
    tag: { display: "inline-block", marginBottom: "10px", padding: "6px 14px", borderRadius: "999px", backgroundColor: "#00d9ff", color: "#070a1a", fontSize: "12px", fontWeight: "700" },
    image: { width: "100%", height: "180px", objectFit: "contain", borderRadius: "10px", marginBottom: "10px", backgroundColor: "#070a1a" },
    name: { fontSize: "16px", fontWeight: "600", marginBottom: "5px", color: "#eef2ff" },
    price: { fontSize: "15px", marginBottom: "10px", color: "#60a5fa" },
    button: { padding: "10px", width: "100%", backgroundColor: "#00d9ff", border: "none", borderRadius: "25px", color: "#070a1a", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
    error: { color: "#fca5a5", textAlign: "center", marginTop: "40px" },

    detailButton: {
      marginTop: "10px",
      padding: "10px",
      width: "100%",
      backgroundColor: "#22c55e",
      border: "none",
      borderRadius: "20px",
      color: "#070a1a",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={styles.search}
        onFocus={(e) => (e.target.style.borderColor = "#88ccff")}
        onBlur={(e) => (e.target.style.borderColor = "#dcdcdc")}
      />

      {/* Header Catalogue */}
      <div style={styles.header}>
        <h2 style={styles.title}>Catalogue</h2>
        <div style={styles.panierContainer}>
          <span style={styles.panierCompteur}>
  🛒 {panier.reduce((total, item) => total + (item.quantite || 1), 0)}
</span>

          <button
            style={styles.boutonPanier}
            onClick={() => navigate("/panier")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#99ddff")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#88ccff")}
          >
            Voir le panier
          </button>
        </div>
      </div>

      {/* Grille des produits */}
      <div style={styles.grid}>
        {produitsFiltres.map((p) => (
          <div key={p.idProduit} style={styles.card}>
            {p.tag && <div style={styles.tag}>{p.tag}</div>}
            <img src={p.image} alt={p.nom} style={styles.image} />
            <div style={styles.name}>{p.nom}</div>
            <div style={styles.price}>{p.prix} €</div>
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
              {categoryMap[p.idCategorie] || p.categorie || ""}
            </div>
            <button
              style={styles.button}
              onClick={() => ajouterAuPanier(p)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#99ddff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#88ccff")}
            >
              Ajouter au panier
            </button>
            <button
              style={styles.detailButton}
              onClick={() => setProduitDetail(p)}
            >
              Voir le détail
            </button>
          </div>
        ))}
      </div>
      {produitDetail && (
        <DetailProduitCatalogue
          produit={produitDetail}
          onClose={() => setProduitDetail(null)}
        />
      )}
    </div>
  );
}

export default Catalogue;
