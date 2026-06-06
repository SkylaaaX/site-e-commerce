import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useMemo, useState, useEffect } from "react";
import { UserContext } from "./Context/UserContext.js";

function Header() {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const styles = {
    header: {
      background: isScrolled
        ? "linear-gradient(135deg, rgba(7,12,33,0.94), rgba(10,22,54,0.92), rgba(19,35,74,0.9))"
        : "linear-gradient(135deg, rgba(7,10,26,0.85), rgba(8,19,46,0.8), rgba(9,27,67,0.78))",
      borderBottom: isScrolled
        ? "1px solid rgba(103,232,249,0.35)"
        : "1px solid rgba(255,255,255,0.08)",
      padding: "12px 32px",
      position: "sticky",
      top: 0,
      zIndex: 90,
      transform: isScrolled ? "translateY(-1px)" : "translateY(0)",
      backdropFilter: "blur(8px)",
      boxShadow: isScrolled ? "0 10px 22px rgba(4,10,30,0.35)" : "0 2px 10px rgba(4,10,30,0.12)",
      transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease, transform 0.4s ease",
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
      fontWeight: 800,
      fontSize: "21px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "transform 0.35s ease, text-shadow 0.35s ease",
      letterSpacing: "0.3px",
      textShadow: "0 8px 24px rgba(26, 132, 255, 0.28)",
    },
    nav: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    navLink: (active) => ({
      color: active ? "#a5f3fc" : "#cbd5e1",
      textDecoration: "none",
      fontWeight: active ? 700 : 500,
      padding: "9px 13px",
      borderRadius: "10px",
      background: active
        ? "linear-gradient(90deg, rgba(34,211,238,0.2), rgba(59,130,246,0.2))"
        : "transparent",
      border: active ? "1px solid rgba(103,232,249,0.35)" : "1px solid transparent",
      transform: active ? "translateY(-1px)" : "translateY(0)",
      transition: "all 0.28s ease",
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
          className="section-reveal"
          onClick={() => {
            setOpenDropdown(false);
          }}
        >
          <span style={{ filter: "drop-shadow(0 6px 16px rgba(59,130,246,0.35))" }}>🥽</span>
          <span className="gradient-title">VR-Store</span>
        </Link>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="stagger-item"
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
