import { Link } from "react-router-dom";

function Footer() {
  const styles = {
    footer: {
      backgroundColor: "#070a1a",
      color: "#cbd5e1",
      padding: "32px 20px",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
    },
    brand: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    logo: {
      color: "#fff",
      fontSize: "20px",
      fontWeight: 700,
      textDecoration: "none",
    },
    sectionTitle: {
      marginBottom: "12px",
      fontSize: "14px",
      fontWeight: 700,
      color: "#f8fafc",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    link: {
      display: "block",
      color: "#94a3b8",
      textDecoration: "none",
      marginBottom: "8px",
      fontSize: "14px",
    },
    bottom: {
      marginTop: "32px",
      fontSize: "13px",
      color: "#94a3b8",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Link to="/home" style={styles.logo}>
            🥽 VR-Store
          </Link>
          <p>
            Boutique en ligne de produits VR simples et accessibles pour tous les passionnés de réalité virtuelle.
          </p>
        </div>

        <div>
          <div style={styles.sectionTitle}>Navigation</div>
          <Link to="/home" style={styles.link}>
            Accueil
          </Link>
          <Link to="/catalogue" style={styles.link}>
            Catalogue
          </Link>
          <Link to="/panier" style={styles.link}>
            Panier
          </Link>
        </div>

        <div>
          <div style={styles.sectionTitle}>Compte</div>
          <Link to="/connexion" style={styles.link}>
            Connexion
          </Link>
          <Link to="/inscription" style={styles.link}>
            Inscription
          </Link>
          <Link to="/mon-espace" style={styles.link}>
            Mon espace
          </Link>
        </div>

        <div>
          <div style={styles.sectionTitle}>Aide</div>
          <Link to="/home" style={styles.link}>
            À propos
          </Link>
          <Link to="/home" style={styles.link}>
            Contact
          </Link>
          <Link to="/home" style={styles.link}>
            Confidentialité
          </Link>
        </div>
      </div>
      <div style={styles.bottom}>© 2026 VR-Store. Tous droits réservés.</div>
    </footer>
  );
}

export default Footer;
