import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "./Context/UserContext.js";

function Header() {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const navItems = useMemo(
    () => [
      { path: "/home", label: "Accueil" },
      { path: "/catalogue", label: "Catalogue" },
      { path: "/panier", label: "Panier" },
      { path: "/favoris", label: "Favoris" },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  const styles = {
    header: {
      backgroundColor: "#070a1a",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "14px 32px",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
      position: "relative",
    },
    logo: {
      textDecoration: "none",
      color: "#fff",
      fontWeight: 700,
      fontSize: "22px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    nav: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    navLink: (active) => ({
      color: active ? "#00d9ff" : "#cbd5e1",
      textDecoration: "none",
      fontWeight: active ? 700 : 500,
      padding: "8px 12px",
      borderRadius: "8px",
      backgroundColor: active ? "rgba(0, 217, 255, 0.12)" : "transparent",
    }),
    user: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#fff",
      fontSize: "14px",
      position: "relative",
    },
    userButton: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.16)",
      backgroundColor: "transparent",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      userSelect: "none",
    },
    dropdown: {
      position: "absolute",
      right: 0,
      top: "calc(100% + 10px)",
      minWidth: "220px",
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "14px",
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      padding: "10px",
      zIndex: 50,
    },
    dropdownItem: {
      display: "flex",
      width: "100%",
      padding: "12px 12px",
      borderRadius: "10px",
      textDecoration: "none",
      fontWeight: 700,
      cursor: "pointer",
      color: "#e5e7eb",
      backgroundColor: "transparent",
      border: "none",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dropdownItemHover: {
      backgroundColor: "rgba(0, 217, 255, 0.12)",
      color: "#fff",
    },
    button: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      fontWeight: 700,
      cursor: "pointer",
      textDecoration: "none",
    },
    secondaryButton: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.16)",
      backgroundColor: "transparent",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      textDecoration: "none",
    },
    caret: {
      fontSize: "12px",
      opacity: 0.9,
    },
  };

  const userLabel = user?.prenom || "Utilisateur";

  return (
    <header style={styles.header} onClick={() => setOpenDropdown(false)}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <Link
          to="/home"
          style={styles.logo}
          onClick={() => {
            setOpenDropdown(false);
          }}
        >
          <span>🥽</span> VR-Store
        </Link>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={styles.navLink(isActive(item.path))}
              onClick={() => setOpenDropdown(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={styles.user}>
          {user ? (
            <>
              <button
                type="button"
                style={styles.userButton}
                onClick={() => setOpenDropdown((v) => !v)}
              >
                <span>{userLabel}</span>
                <span style={styles.caret}>▼</span>
              </button>

              {openDropdown && (
                <div style={styles.dropdown}>
                  <Link
                    to="/mon-espace?section=orders"
                    style={styles.dropdownItem}
                    onClick={() => {
                      setOpenDropdown(false);
                      navigate("/mon-espace?section=orders");
                    }}
                  >
                    <span>Commandes</span>
                    <span style={{ opacity: 0.75 }}>→</span>
                  </Link>

                  <Link
                    to="/mon-espace?section=profile"
                    style={styles.dropdownItem}
                    onClick={() => {
                      setOpenDropdown(false);
                      navigate("/mon-espace?section=profile");
                    }}
                  >
                    <span>Mon espace</span>
                    <span style={{ opacity: 0.75 }}>→</span>
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      style={styles.dropdownItem}
                      onClick={() => {
                        setOpenDropdown(false);
                        navigate("/admin");
                      }}
                    >
                      <span>Admin</span>
                      <span style={{ opacity: 0.75 }}>→</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    style={{ ...styles.dropdownItem, width: "100%", marginTop: 6 }}
                    onClick={() => {
                      setOpenDropdown(false);
                      logout();
                      navigate("/home");
                    }}
                  >
                    <span>Déconnexion</span>
                    <span style={{ opacity: 0.75 }}>→</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/connexion" style={styles.secondaryButton}>
                Connexion
              </Link>
              <Link to="/inscription" style={styles.button}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
