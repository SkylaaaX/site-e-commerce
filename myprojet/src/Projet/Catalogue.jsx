import { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PanierContext } from "./Context/PanierContext.jsx";
import DetailProduitCatalogue from "./DetailProduitCatalogue";
import { ProductsContext } from "./Context/ProductsContext";

function Catalogue() {
  const navigate = useNavigate();
  const { panier, ajouterAuPanier } = useContext(PanierContext);
  const { produits, refreshProducts } = useContext(ProductsContext);

  const [recherche, setRecherche] = useState("");
  const [produitDetail, setProduitDetail] = useState(null);
  const [favoris, setFavoris] = useState([]);

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase())
    );
  }, [produits, recherche]);

  const produitsPopulaires = useMemo(() => {
    return [...produitsFiltres].sort(
      (a, b) => Number(b.nb_commandes || 0) - Number(a.nb_commandes || 0)
    );
  }, [produitsFiltres]);

  useEffect(() => {
    refreshProducts();

    try {
      const raw = localStorage.getItem("favoris");
      const parsed = raw ? JSON.parse(raw) : [];
      setFavoris(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavoris([]);
    }
  }, [refreshProducts]);

  const toggleFavori = (produit) => {
    setFavoris((prev) => {
      const exists = prev.some((p) => p.idProduit === produit.idProduit);
      const next = exists
        ? prev.filter((p) => p.idProduit !== produit.idProduit)
        : [...prev, produit];
      localStorage.setItem("favoris", JSON.stringify(next));
      return next;
    });
  };

  const categoryMap = {
    1: "Casques",
    2: "Accessoires",
    3: "Jeux",
    4: "Simulateurs",
  };

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
    card: {
      background: "#0f172a",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "18px",
      boxShadow: "0 2px 14px rgba(0,0,0,0.35)",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    tendanceBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "#ef4444",
      color: "#fff",
      fontWeight: 800,
      fontSize: "11px",
      letterSpacing: "0.4px",
      padding: "6px 8px",
      textTransform: "uppercase",
    },
    tag: { display: "inline-block", marginBottom: "10px", padding: "6px 14px", borderRadius: "999px", backgroundColor: "#00d9ff", color: "#070a1a", fontSize: "12px", fontWeight: "700" },
    image: { width: "100%", height: "180px", objectFit: "contain", borderRadius: "10px", marginBottom: "10px", backgroundColor: "#070a1a" },
    name: { fontSize: "16px", fontWeight: "600", marginBottom: "5px", color: "#eef2ff" },
    price: { fontSize: "15px", marginBottom: "10px", color: "#60a5fa" },
    button: { padding: "10px", width: "100%", backgroundColor: "#00d9ff", border: "none", borderRadius: "25px", color: "#070a1a", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
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
    favoriteButton: {
      marginTop: "10px",
      padding: "10px",
      width: "100%",
      backgroundColor: "#f59e0b",
      border: "none",
      borderRadius: "20px",
      color: "#111827",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "700",
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={styles.search}
        onFocus={(e) => (e.target.style.borderColor = "#88ccff")}
        onBlur={(e) => (e.target.style.borderColor = "#dcdcdc")}
      />

      <div style={styles.header}>
        <h2 style={styles.title}>Produits tendance</h2>
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

      <div style={styles.grid}>
        {produitsPopulaires.map((p, index) => (
          <div key={p.idProduit} style={styles.card}>
            {(Number(p.nb_commandes || 0) >= 3 || index < 3) && (
              <div style={styles.tendanceBar}>Tendance</div>
            )}

            {p.tag && <div style={{ ...styles.tag, marginTop: "18px" }}>{p.tag}</div>}
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

            <button style={styles.detailButton} onClick={() => setProduitDetail(p)}>
              Voir le détail
            </button>

            <button style={styles.favoriteButton} onClick={() => toggleFavori(p)}>
              {favoris.some((f) => f.idProduit === p.idProduit)
                ? "Retirer des favoris"
                : "Ajouter aux favoris"}
            </button>

            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
              {Number(p.nb_commandes || 0)} commande{Number(p.nb_commandes || 0) > 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>

      {produitDetail && typeof produitDetail === "object" && (
        <DetailProduitCatalogue
          produit={produitDetail}
          onClose={() => setProduitDetail(null)}
        />
      )}
    </div>
  );
}

export default Catalogue;
