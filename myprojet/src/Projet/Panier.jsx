import { useContext } from "react";
import { Link } from "react-router-dom";
import { PanierContext } from "./Context/PanierContext.jsx";

function Panier() {
  const { panier, supprimerArticle, modifierQuantite } = useContext(PanierContext);

  const total = panier.reduce((acc, item) => acc + item.prix * (item.quantite || 1), 0);
  const fraisPort = total > 0 && total < 50 ? 9.99 : 0;
  const totalFinal = total + fraisPort;

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px 20px",
      backgroundColor: "transparent",
      color: "#eef2ff",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
      color: "#eef2ff",
    },
    title: {
      fontSize: "32px",
      marginBottom: "6px",
    },
    subtitle: {
      color: "#94a3b8",
      marginBottom: "24px",
    },
    empty: {
      padding: "60px 30px",
      textAlign: "center",
      backgroundColor: "#0f172a",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.12)",
    },
    button: {
      display: "inline-block",
      padding: "12px 24px",
      borderRadius: "12px",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      textDecoration: "none",
      fontWeight: 700,
      marginTop: "20px",
    },
    grid: {
      display: "grid",
      gap: "24px",
      gridTemplateColumns: "1fr 320px",
    },
    item: {
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "100px 1fr 120px",
      gap: "18px",
      alignItems: "center",
    },
    image: {
      width: "100%",
      maxHeight: "100px",
      objectFit: "contain",
      borderRadius: "12px",
      backgroundColor: "#111827",
    },
    itemName: {
      fontWeight: 700,
      marginBottom: "8px",
      color: "#eef2ff",
    },
    itemPrice: {
      color: "#60a5fa",
      fontWeight: 700,
      marginBottom: "8px",
    },
    quantity: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
    },
    qtyButton: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.18)",
      backgroundColor: "#111827",
      cursor: "pointer",
      fontWeight: 700,
      color: "#eef2ff",
    },
    removeBtn: {
      padding: "10px 16px",
      borderRadius: "10px",
      border: "1px solid #ef4444",
      backgroundColor: "#1f2937",
      color: "#fecaca",
      cursor: "pointer",
      fontWeight: 700,
    },
    summary: {
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "24px",
    },
    summaryTitle: {
      fontSize: "20px",
      marginBottom: "16px",
      fontWeight: 700,
      color: "#eef2ff",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      color: "#94a3b8",
    },
    total: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: 700,
      fontSize: "18px",
      color: "#eef2ff",
      marginTop: "18px",
      paddingTop: "18px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
    },
    checkout: {
      width: "100%",
      marginTop: "20px",
      padding: "14px 18px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page} className="page-enter section-reveal">
      <div style={styles.container}>
        <h1 style={styles.title} className="gradient-title">Mon Panier</h1>
        <p style={styles.subtitle}>{panier.length} article{panier.length !== 1 ? "s" : ""}</p>

        {panier.length === 0 ? (
          <div style={styles.empty} className="card-polish interactive-lift">
            <p style={{ fontSize: "24px", marginBottom: "12px" }}>Votre panier est vide.</p>
            <p style={{ color: "#475569" }}>Ajoutez des produits depuis le catalogue pour commencer.</p>
            <Link to="/catalogue" style={styles.button}>
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            <div>
              {panier.map((item) => (
                <div key={item.idProduit} style={styles.item} className="card-polish interactive-lift stagger-item">
                  <img src={item.image} alt={item.nom} style={styles.image} />
                  <div>
                    <div style={styles.itemName}>{item.nom}</div>
                    <div style={styles.itemPrice}>{item.prix} €</div>
                    <div style={styles.quantity}>
                      <button
                        style={styles.qtyButton}
                        onClick={() => modifierQuantite(item.idProduit, (item.quantite || 1) - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantite || 1}</span>
                      <button
                        style={styles.qtyButton}
                        onClick={() => modifierQuantite(item.idProduit, (item.quantite || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button style={styles.removeBtn} onClick={() => supprimerArticle(item.idProduit)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.summary} className="card-polish interactive-lift">
              <div style={styles.summaryTitle}>Résumé de la commande</div>
              <div style={styles.summaryRow}>
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              {fraisPort > 0 ? (
                <div style={styles.summaryRow}>
                  <span>Frais de port</span>
                  <span>{fraisPort.toFixed(2)} €</span>
                </div>
              ) : (
                <div style={styles.summaryRow}>
                  <span>Livraison gratuite</span>
                  <span>0,00 €</span>
                </div>
              )}
              <div style={styles.total}>
                <span>Total</span>
                <span>{totalFinal.toFixed(2)} €</span>
              </div>
              <Link
                to="/mon-espace"
                style={{
                  ...styles.checkout,
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Procéder au paiement
              </Link>

              <Link to="/catalogue" style={{ ...styles.button, display: "block", textAlign: "center" }}>
                Continuer vos achats
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Panier;
