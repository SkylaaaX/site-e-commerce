import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Favoris() {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoris");
      const parsed = raw ? JSON.parse(raw) : [];
      setFavoris(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavoris([]);
    }
  }, []);

  const totalFavoris = useMemo(() => favoris.length, [favoris]);

  const removeFavori = (idProduit) => {
    const next = favoris.filter((item) => item.idProduit !== idProduit);
    setFavoris(next);
    localStorage.setItem("favoris", JSON.stringify(next));
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px 20px",
      color: "#eef2ff",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    title: {
      fontSize: "32px",
      marginBottom: "8px",
      color: "#eef2ff",
    },
    subtitle: {
      color: "#94a3b8",
      marginBottom: "24px",
    },
    empty: {
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "26px",
      textAlign: "center",
    },
    button: {
      marginTop: "12px",
      padding: "10px 16px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      fontWeight: 700,
      cursor: "pointer",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px",
      padding: "14px",
      textAlign: "center",
    },
    image: {
      width: "100%",
      height: "170px",
      objectFit: "contain",
      borderRadius: "10px",
      backgroundColor: "#0b1220",
      marginBottom: "10px",
    },
    name: {
      fontWeight: 700,
      marginBottom: "8px",
      color: "#eef2ff",
    },
    price: {
      color: "#60a5fa",
      marginBottom: "10px",
    },
    row: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
    },
    secondary: {
      padding: "9px 12px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.18)",
      backgroundColor: "transparent",
      color: "#e5e7eb",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page} className="page-enter section-reveal">
      <div style={styles.container}>
        <h1 style={styles.title} className="gradient-title">Mes favoris</h1>
        <p style={styles.subtitle}>{totalFavoris} article{totalFavoris > 1 ? "s" : ""}</p>

        {favoris.length === 0 ? (
          <div style={styles.empty} className="card-polish interactive-lift">
            <p>Aucun favori pour le moment.</p>
            <button style={styles.button} onClick={() => navigate("/catalogue")}>
              Découvrir le catalogue
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {favoris.map((item) => (
              <div key={item.idProduit} style={styles.card} className="card-polish interactive-lift stagger-item">
                <img src={item.image} alt={item.nom} style={styles.image} />
                <div style={styles.name}>{item.nom}</div>
                <div style={styles.price}>{item.prix} €</div>
                <div style={styles.row}>
                  <button style={styles.button} onClick={() => navigate("/catalogue")}>
                    Voir
                  </button>
                  <button style={styles.secondary} onClick={() => removeFavori(item.idProduit)}>
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoris;
