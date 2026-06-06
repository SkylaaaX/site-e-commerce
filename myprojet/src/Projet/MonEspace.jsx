import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./Context/UserContext.js";
import { PanierContext } from "./Context/PanierContext.jsx";

function MonEspace() {
  const { user, login, logout } = useContext(UserContext);
  const panierContext = useContext(PanierContext);
  const panier = panierContext?.panier ?? [];
  const location = useLocation();

  const section = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("section");
  }, [location.search]);

  const [profileData, setProfileData] = useState({
    nom: "",
    prenom: "",
    email: "",
    ville: "",
    age: "",
    adresse: "",
    payment_method: "visa",
    payment_label: "",
  });
  const [paymentData, setPaymentData] = useState({
    method: "visa",
    cardNumber: "",
    paypalEmail: "",
    expiry: "",
    cvv: "",
    adresse_livraison: "",
  });

  // Saved payment infos (client-side only)
  const [savedPaymentInfos, setSavedPaymentInfos] = useState([]);
  const [selectedPaymentInfoId, setSelectedPaymentInfoId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [lastApiError, setLastApiError] = useState(null);

  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const userId = user?.idUser;

  useEffect(() => {
    if (!userId) return;
    setLastApiError(null);
    fetchProfile();

    // Load saved payment infos for this user
    try {
      const raw = localStorage.getItem(`paymentInfos:${userId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      setSavedPaymentInfos(Array.isArray(parsed) ? parsed : []);
      const first = Array.isArray(parsed) && parsed.length > 0 ? parsed[0].id : null;
      setSelectedPaymentInfoId(first);
    } catch {
      setSavedPaymentInfos([]);
      setSelectedPaymentInfoId(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Orders only when the user explicitly navigates to "Commandes"
  useEffect(() => {
    if (!userId) return;
    if (section === "orders") {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, userId]);

  const apiHeaders = () => ({
    "Content-Type": "application/json",
    "user-id": user?.idUser || "",
  });

  const fetchProfile = async () => {
    setProfileLoading(true);
    setLastApiError(null);
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        headers: apiHeaders(),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errMsg = data.message || "Erreur lors du chargement du profil.";
        setMessage(errMsg);
        setLastApiError({ endpoint: "profile", status: response.status, details: data });
        return;
      }

      if (data.user) {
        setProfileData((prev) => ({ ...prev, ...data.user }));
        // Avoid calling login() here to prevent re-triggering the user-dependent effects
        // and causing repeated API calls.
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau lors du chargement du profil.");
      setLastApiError({ endpoint: "profile", status: 0, details: String(err) });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/orders", {
        headers: apiHeaders(),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errMsg = data.message || "Erreur lors du chargement des commandes.";
        setMessage(errMsg);
        setLastApiError({ endpoint: "orders", status: response.status, details: data });
        return;
      }

      setOrders(data.commandes || []);
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau lors du chargement des commandes.");
      setLastApiError({ endpoint: "orders", status: 0, details: String(err) });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteOrder = async (idCommande) => {
    if (!userId) return;

    setDeletingOrderId(idCommande);
    setMessage("");
    setLastApiError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/user/orders/${idCommande}`, {
        method: "DELETE",
        headers: apiHeaders(),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data.message || "Erreur lors de la suppression.");
        setLastApiError({ endpoint: "deleteOrder", status: response.status, details: data });
        return;
      }

      setMessage("Commande supprimée.");
      await fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau pendant la suppression.");
      setLastApiError({ endpoint: "deleteOrder", status: 0, details: String(err) });
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({
          nom: profileData.nom,
          prenom: profileData.prenom,
          ville: profileData.ville,
          age: profileData.age,
          adresse: profileData.adresse,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Impossible de sauvegarder le profil.");
      } else {
        setMessage("Profil sauvegardé avec succès.");
        if (data.user) login({ ...user, ...data.user });
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur lors de la sauvegarde.");
    }
  };

  const handleSavePaymentInfo = () => {
    setMessage("");
    setLastApiError(null);

    const id = Date.now().toString();

    const base = {
      id,
      method: paymentData.method,
      adresse_livraison: paymentData.adresse_livraison || profileData.adresse || "",
    };

    let payload = null;

    if (paymentData.method === "visa") {
      if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
        setMessage("Veuillez renseigner le numéro de carte, l’expiration et le CVV.");
        return;
      }

      payload = {
        ...base,
        method: "visa",
        cardNumber: paymentData.cardNumber,
        expiry: paymentData.expiry,
        cvv: paymentData.cvv,
        paypalEmail: "",
      };
    } else {
      if (!paymentData.paypalEmail) {
        setMessage("Veuillez renseigner l’e-mail PayPal.");
        return;
      }

      payload = {
        ...base,
        method: "paypal",
        paypalEmail: paymentData.paypalEmail,
        cardNumber: "",
        expiry: "",
        cvv: "",
      };
    }

    const next = [payload, ...savedPaymentInfos].slice(0, 10);
    setSavedPaymentInfos(next);
    setSelectedPaymentInfoId(id);

    try {
      localStorage.setItem(`paymentInfos:${userId}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
      setMessage("Impossible de sauvegarder les informations de paiement sur cet appareil.");
    }
  };

  const handleSelectPaymentInfo = (infoId) => {
    setMessage("");
    setLastApiError(null);
    setSelectedPaymentInfoId(infoId);

    const info = savedPaymentInfos.find((p) => p.id === infoId);
    if (!info) return;

    setPaymentData((prev) => ({
      ...prev,
      method: info.method || "visa",
      cardNumber: info.cardNumber || "",
      expiry: info.expiry || "",
      cvv: info.cvv || "",
      paypalEmail: info.paypalEmail || "",
      adresse_livraison: info.adresse_livraison || profileData.adresse || "",
    }));
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const montant = panier.reduce((sum, article) => {
      const rawPrix = article.prix ?? article.price ?? 0;

      let prix = 0;
      if (typeof rawPrix === "string") {
        // "499 €" / "499,99" / "499.99" -> number
        const cleaned = rawPrix
          .replace(/[^\d.,\s-]/g, "")
          .replace(/\s/g, "");

        const normalized =
          cleaned.includes(",") && !cleaned.includes(".")
            ? cleaned.replace(",", ".")
            : cleaned.replace(/,/g, "");

        prix = Number(normalized);
      } else {
        prix = Number(rawPrix);
      }

      if (!Number.isFinite(prix) || Number.isNaN(prix)) prix = 0;

      const quantite = Number(article.quantite || 1);
      return sum + prix * quantite;
    }, 0).toFixed(2);

    try {
      const response = await fetch("http://localhost:3000/api/user/orders", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          montant,
          paymentMethod: paymentData.method,
          cardNumber: paymentData.cardNumber,
          paypalEmail: paymentData.paypalEmail,
          expiry: paymentData.expiry,
          cvv: paymentData.cvv,
          adresse_livraison: paymentData.adresse_livraison || profileData.adresse,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Erreur lors du paiement.");
      } else {
        setMessage("Paiement validé et commande enregistrée.");
        setPaymentData((prev) => ({ ...prev, cardNumber: "", paypalEmail: "", expiry: "", cvv: "" }));
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur pendant le paiement.");
    }
  };

  const statusStyle = (status) => {
    if (status === "annulée") return { color: "#f87171" };
    if (status === "en route") return { color: "#facc15" };
    return { color: "#34d399" };
  };

  const styles = {
    secondaryButton: {
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
      justifyContent: "center",
    },
    page: {

      minHeight: "100vh",
      padding: "40px 20px",
      backgroundColor: "#050816",
      color: "#eef2ff",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
      display: "grid",
      gap: "24px",
      gridTemplateColumns: "1fr 1.05fr",
    },
    panel: {
      backgroundColor: "#0f172a",
      borderRadius: "20px",
      padding: "28px",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
    },
    title: {
      fontSize: "28px",
      marginBottom: "18px",
      color: "#eef2ff",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      color: "#94a3b8",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.12)",
      marginBottom: "16px",
      backgroundColor: "#08102b",
      color: "#eef2ff",
    },
    textArea: {
      width: "100%",
      minHeight: "100px",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.12)",
      marginBottom: "16px",
      backgroundColor: "#08102b",
      color: "#eef2ff",
      resize: "vertical",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "14px 18px",
      backgroundColor: "#00d9ff",
      color: "#070a1a",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 700,
      width: "100%",
      marginTop: "8px",
    },
    smallButton: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#1e293b",
      color: "#eef2ff",
      cursor: "pointer",
      marginTop: "10px",
    },
    message: {
      color: "#60a5fa",
      marginTop: "16px",
      fontSize: "14px",
    },
    gridSmall: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    orderCard: {
      backgroundColor: "#08102b",
      borderRadius: "16px",
      padding: "18px",
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: "14px",
    },
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <h2 style={styles.title}>Mon Espace</h2>
          <p style={{ color: "#cbd5e1" }}>
            Une erreur de session s’est produite : l’utilisateur n’est pas détecté.
            <br />
            Essayez de vous reconnecter.
          </p>
          <Link to="/connexion" style={{ ...styles.button, width: "auto", textDecoration: "none" }}>
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          {(profileLoading || ordersLoading) && (
            <div style={{ color: "#94a3b8", marginBottom: "10px" }}>Chargement en cours...</div>
          )}

          {!!lastApiError && (
            <div style={{ color: "#fca5a5", marginBottom: "10px" }}>
              Problème lors de l’appel API ({lastApiError.endpoint}, statut {lastApiError.status}).
              <br />
              {typeof lastApiError.details === "object" && lastApiError.details?.message ? (
                <span>{lastApiError.details.message}</span>
              ) : (
                <span>Détails indisponibles.</span>
              )}
            </div>
          )}

          {message && <div style={{ color: "#60a5fa", marginBottom: "10px" }}>{message}</div>}

          <h2 style={styles.title}>Bienvenue, {user.prenom || user.nom}</h2>
          <div style={{ color: "#cbd5e1" }}>Gérez vos informations personnelles, sauvegardez votre adresse et suivez vos commandes.</div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            to="/mon-espace"
            style={{
              ...styles.secondaryButton,
              textDecoration: "none",
              width: "auto",
            }}
          >
            Mon espace
          </Link>
        </div>
      </div>

      <div style={styles.container}>
        <div
          style={{
            ...styles.panel,
            display: section && section !== "profile" ? "none" : "block",
          }}
        >
          <h3 style={styles.title}>Profil et adresse</h3>
          <form onSubmit={handleProfileSave}>
            <div style={styles.gridSmall}>
              <div>
                <label style={styles.label}>Nom</label>
                <input name="nom" value={profileData.nom} onChange={handleProfileChange} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Prénom</label>
                <input name="prenom" value={profileData.prenom} onChange={handleProfileChange} style={styles.input} />
              </div>
            </div>
            <label style={styles.label}>Email</label>
            <input name="email" value={profileData.email} disabled style={{ ...styles.input, opacity: 0.7 }} />
            <div style={styles.gridSmall}>
              <div>
                <label style={styles.label}>Ville</label>
                <input name="ville" value={profileData.ville || ""} onChange={handleProfileChange} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Âge</label>
                <input name="age" type="number" value={profileData.age || ""} onChange={handleProfileChange} style={styles.input} />
              </div>
            </div>
            <label style={styles.label}>Adresse</label>
            <textarea name="adresse" value={profileData.adresse || ""} onChange={handleProfileChange} style={styles.textArea} />
            <button type="submit" style={styles.button}>Sauvegarder mon profil</button>
          </form>

          <div style={{ marginTop: "26px" }}>
            <h3 style={styles.title}>Mode de paiement</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <button type="button" onClick={() => setPaymentData((prev) => ({ ...prev, method: 'visa' }))} style={{ ...styles.smallButton, backgroundColor: paymentData.method === 'visa' ? '#00d9ff' : '#1e293b' }}>
                Visa
              </button>
              <button type="button" onClick={() => setPaymentData((prev) => ({ ...prev, method: 'paypal' }))} style={{ ...styles.smallButton, backgroundColor: paymentData.method === 'paypal' ? '#00d9ff' : '#1e293b' }}>
                PayPal
              </button>
            </div>
            {paymentData.method === 'visa' ? (
              <>
                <label style={styles.label}>Numéro de carte</label>
                <input name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" style={styles.input} />
                <div style={styles.gridSmall}>
                  <div>
                    <label style={styles.label}>Expiration</label>
                    <input name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} placeholder="MM/AA" style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>CVV</label>
                    <input name="cvv" type="password" value={paymentData.cvv} onChange={handlePaymentChange} placeholder="123" style={styles.input} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <label style={styles.label}>E-mail PayPal</label>
                <input name="paypalEmail" value={paymentData.paypalEmail} onChange={handlePaymentChange} placeholder="email@paypal.com" style={styles.input} />
              </>
            )}

            <label style={styles.label}>Adresse de livraison</label>
            <textarea
              name="adresse_livraison"
              value={paymentData.adresse_livraison}
              onChange={handlePaymentChange}
              placeholder="Adresse de livraison"
              style={styles.textArea}
            />

            <button
              type="button"
              onClick={handleSavePaymentInfo}
              style={{
                ...styles.button,
                backgroundColor: "#1f2937",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              Enregistrer mes informations de paiement
            </button>

            {savedPaymentInfos.length > 0 && (
              <div style={{ marginTop: "18px" }}>
                <label style={styles.label}>Informations de paiement déjà enregistrées</label>
                <select
                  value={selectedPaymentInfoId ?? ""}
                  onChange={(e) => handleSelectPaymentInfo(e.target.value)}
                  style={styles.input}
                >
                  {savedPaymentInfos.map((info) => (
                    <option key={info.id} value={info.id}>
                      {info.method === "paypal"
                        ? `PayPal: ${info.paypalEmail || "—"}`
                        : (() => {
                            const card = String(info.cardNumber || "");
                            const last4 = card.slice(-4);
                            return last4 ? `Visa: **** ${last4}` : "Visa: Carte enregistrée";
                          })()}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => selectedPaymentInfoId && handleSelectPaymentInfo(selectedPaymentInfoId)}
                  style={{ ...styles.smallButton, width: "100%", marginTop: "10px" }}
                >
                  Utiliser les informations sélectionnées
                </button>
              </div>
            )}

            <button type="button" onClick={handlePaymentSubmit} style={{ ...styles.button, marginTop: "14px" }}>
              Payer maintenant
            </button>
            <p style={{ color: '#94a3b8', marginTop: '8px' }}>Votre adresse sera sauvegardée dans votre profil après paiement.</p>
          </div>

          {message && <div style={styles.message}>{message}</div>}
        </div>

        <div
          style={{
            ...styles.panel,
            display: section && section !== "orders" && section !== "payment" ? "none" : "block",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <h3 style={styles.title}>Suivi des commandes</h3>
            <button type="button" onClick={fetchOrders} style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "#00d9ff",
              color: "#070a1a",
              fontWeight: 700,
              cursor: "pointer",
              width: "auto",
            }}>
              Mes commandes
            </button>
          </div>

          {ordersLoading && <div style={styles.message}>Chargement en cours...</div>}
          {!ordersLoading && orders.length === 0 && (
            <p style={{ color: '#cbd5e1' }}>Aucune commande disponible pour le moment.</p>
          )}
          {orders.map((commande) => (
            <div key={commande.idCommande} style={styles.orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#eef2ff' }}>Commande #{commande.idCommande}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={statusStyle(commande.statut)}>{commande.statut}</div>
                </div>
              </div>

              <div style={{ color: '#cbd5e1', marginBottom: '8px' }}>Montant : {Number(commande.montant).toFixed(2)} €</div>
              <div style={{ color: '#cbd5e1', marginBottom: '8px' }}>Adresse : {commande.adresse_livraison || 'N/A'}</div>
              <div style={{ color: '#cbd5e1' }}>Paiement : {commande.payment_reference || 'Non précisé'}</div>

              <button
                type="button"
                onClick={() => handleDeleteOrder(commande.idCommande)}
                disabled={deletingOrderId === commande.idCommande}
                style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(239,68,68,0.7)',
                  backgroundColor: deletingOrderId === commande.idCommande ? '#991b1b' : '#1f2937',
                  color: '#fecaca',
                  cursor: deletingOrderId === commande.idCommande ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  width: '100%',
                }}
              >
                {deletingOrderId === commande.idCommande ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={logout} style={{ ...styles.smallButton, width: '140px' }}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default MonEspace;
