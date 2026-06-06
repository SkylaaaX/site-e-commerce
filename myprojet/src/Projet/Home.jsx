import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProductsContext } from "./Context/ProductsContext.js";

function Home() {
  const { produits } = useContext(ProductsContext);

  const featuredProducts = useMemo(() => {
    if (!Array.isArray(produits)) return [];
    return [...produits]
      .sort((a, b) => Number(b.nb_commandes || 0) - Number(a.nb_commandes || 0))
      .slice(0, 4);
  }, [produits]);

  const styles = {
    page: {
      color: "#eef2ff",
      backgroundColor: "transparent",
      minHeight: "100vh",
    },
    hero: {
      padding: "80px 20px",
      textAlign: "center",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    heroTitle: {
      fontSize: "42px",
      margin: "0 0 16px",
      color: "#eef2ff",
    },
    heroText: {
      fontSize: "18px",
      maxWidth: "680px",
      margin: "0 auto 24px",
      lineHeight: 1.7,
      color: "#cbd5e1",
    },
    heroButton: {
      display: "inline-block",
      padding: "14px 28px",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: 700,
    },
    section: {
      padding: "60px 20px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "32px",
      marginBottom: "14px",
      color: "#eef2ff",
    },
    sectionText: {
      fontSize: "16px",
      color: "#cbd5e1",
      marginBottom: "32px",
      maxWidth: "700px",
    },
    grid: {
      display: "grid",
      gap: "20px",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    },
    card: {
      backgroundColor: "#0f172a",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "24px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.35)",
      position: "relative",
      overflow: "hidden",
    },
    cardImageWrap: {
      width: "100%",
      height: "180px",
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "12px",
      background: "linear-gradient(160deg, rgba(10,18,42,0.95), rgba(8,14,33,0.92))",
      border: "1px solid rgba(148,163,184,0.14)",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      display: "block",
    },
    tendanceBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 3,
      backgroundColor: "#ef4444",
      color: "#fff",
      fontWeight: 800,
      fontSize: "11px",
      letterSpacing: "0.4px",
      padding: "6px 8px",
      textTransform: "uppercase",
      boxShadow: "0 6px 14px rgba(0,0,0,0.28)",
    },
    cardTag: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#00d9ff",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    cardTitle: {
      fontSize: "20px",
      margin: "0 0 10px",
      color: "#eef2ff",
    },
    cardPrice: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#f97316",
      marginBottom: "12px",
    },
    cardText: {
      fontSize: "14px",
      color: "#cbd5e1",
      lineHeight: 1.7,
      marginBottom: "20px",
    },
    cardButton: {
      display: "inline-block",
      padding: "10px 18px",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      textDecoration: "none",
      borderRadius: "10px",
      fontWeight: 700,
    },
  };

  const features = [
    { title: "Livraison rapide", description: "Recevez vos produits VR chez vous en quelques jours." },
    { title: "Paiement sécurisé", description: "Payer en ligne en toute confiance avec nos options sécurisées." },
    { title: "Support client", description: "Notre équipe est disponible pour vous aider à chaque étape." },
  ];

  return (
    <div style={styles.page} className="page-enter section-reveal">
      <section style={styles.hero} className="section-reveal">
        <p style={{ color: "#0284c7", fontWeight: 700, marginBottom: "16px" }} className="stagger-item">Bienvenue chez VR-Store</p>
        <h1 style={styles.heroTitle} className="gradient-title">Tout pour votre expérience de réalité virtuelle</h1>
        <p style={styles.heroText}>
          VR-Store vous propose une sélection de casques, accessoires et jeux VR. Notre objectif est de garder le site simple, clair et accessible.
        </p>
        <Link to="/catalogue" style={styles.heroButton} className="interactive-lift">
          Voir le catalogue
        </Link>
      </section>

      <section style={styles.section} className="section-reveal">
        <h2 style={styles.sectionTitle} className="gradient-title">Pourquoi choisir VR-Store</h2>
        <p style={styles.sectionText}>Des produits choisis pour la réalité virtuelle, un service simple et une navigation claire pour tous.</p>
        <div style={styles.grid}>
          {features.map((feature) => (
            <div key={feature.title} style={styles.card} className="card-polish interactive-lift stagger-item">
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", color: "#0f172a" }}>{feature.title}</div>
              <div style={styles.cardText}>{feature.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section} className="section-reveal">
        <h2 style={styles.sectionTitle} className="gradient-title">Produits tendance</h2>
        <p style={styles.sectionText}>Les produits les plus commandés du moment.</p>
        <div style={styles.grid}>
          {featuredProducts.map((produit, index) => (
            <div key={produit.idProduit || produit.id} style={styles.card} className="card-polish interactive-lift stagger-item">
              {(Number(produit.nb_commandes || 0) >= 3 || index < 3) && (
                <div style={styles.tendanceBar}>Tendance</div>
              )}
              <div style={{ ...styles.cardTag, marginTop: "16px" }}>{produit.tag || "Populaire"}</div>
              <div style={styles.cardImageWrap}>
                <img src={produit.image} alt={produit.nom || produit.name} style={styles.cardImage} />
              </div>
              <div style={styles.cardTitle}>{produit.nom || produit.name}</div>
              <div style={styles.cardPrice}>{produit.prix ? `${produit.prix} €` : produit.price}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
                {Number(produit.nb_commandes || 0)} commande{Number(produit.nb_commandes || 0) > 1 ? "s" : ""}
              </div>
              <Link to="/catalogue" style={styles.cardButton} className="interactive-lift">
                Voir le catalogue
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
