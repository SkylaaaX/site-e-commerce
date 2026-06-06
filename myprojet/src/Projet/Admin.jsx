import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./Context/UserContext";
import { ProductsContext } from "./Context/ProductsContext";
import { useNavigate } from "react-router-dom";

function Admin() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { produits, refreshProducts, createProduit, updateProduit, deleteProduit } = useContext(ProductsContext);
  const [formData, setFormData] = useState({
    nom: "",
    prix: "",
    quantite: "",
    description: "",
    image: "",
    idCategorie: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pré-programmer des catégories VR (id numérique envoyé au back)
  const categories = [
    { id: 1, name: "Casques" },
    { id: 2, name: "Accessoires" },
    { id: 3, name: "Jeux" },
    { id: 4, name: "Simulateurs" },
  ];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    // ensure admin view has latest products
    refreshProducts();
  }, [refreshProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir un fichier PNG ou JPEG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result || "" }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setFormData((prev) => ({ ...prev, image: reader.result || "" }));
            setError("");
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          return;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        prix: parseFloat(formData.prix),
        quantite: parseInt(formData.quantite) || 0,
        idCategorie: parseInt(formData.idCategorie),
      };

      if (editingId) {
        await updateProduit(editingId, payload, user.idUser);
        setSuccess("Produit modifié!");
      } else {
        await createProduit(payload, user.idUser);
        setSuccess("Produit ajouté!");
      }

      setFormData({ nom: "", prix: "", quantite: "", description: "", image: "", idCategorie: 1 });
      setEditingId(null);
    } catch (err) {
      setError((err && err.message) || String(err));
    }
  };

  const handleEdit = (produit) => {
    setFormData({
      nom: produit.nom,
      prix: produit.prix,
      quantite: produit.quantite,
      description: produit.description || "",
      image: produit.image || "",
      idCategorie: produit.idCategorie,
    });
    setEditingId(produit.idProduit);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de supprimer ce produit?")) return;

    try {
      await deleteProduit(id, user.idUser);
      setSuccess("Produit supprimé!");
    } catch (err) {
      setError(err.message || err);
    }
  };

  const s = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 32px",
    },
    title: {
      fontSize: "42px",
      fontWeight: "700",
      fontFamily: "'Poppins', sans-serif",
      marginBottom: "12px",
      color: "var(--text)",
    },
    subtitle: {
      fontSize: "15px",
      color: "var(--text-secondary)",
      marginBottom: "40px",
    },
    alert: {
      padding: "16px 20px",
      borderRadius: "12px",
      marginBottom: "24px",
      fontSize: "14px",
      fontWeight: "500",
      border: "1px solid",
    },
    alertError: {
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      color: "#ef4444",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
    alertSuccess: {
      backgroundColor: "rgba(0, 217, 255, 0.08)",
      color: "#00d9ff",
      borderColor: "rgba(0, 217, 255, 0.2)",
    },
    section: {
      backgroundColor: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      padding: "32px",
      marginBottom: "40px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "var(--text)",
      marginBottom: "24px",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "var(--text-secondary)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid var(--border)",
      backgroundColor: "var(--card-hover)",
      color: "var(--text)",
      fontSize: "14px",
      fontFamily: "inherit",
      outline: "none",
      transition: "all 0.3s ease",
    },
    textarea: {
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid var(--border)",
      backgroundColor: "var(--card-hover)",
      color: "var(--text)",
      fontSize: "14px",
      fontFamily: "inherit",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      transition: "all 0.3s ease",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      gridColumn: "1 / -1",
      marginTop: "8px",
    },
    btnSubmit: {
      padding: "12px 32px",
      backgroundColor: "#00d9ff",
      color: "var(--bg)",
      border: "none",
      borderRadius: "10px",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
    },
    btnCancel: {
      padding: "12px 32px",
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
    },
    productsList: {
      display: "grid",
      gap: "16px",
    },
    productItem: {
      display: "grid",
      gridTemplateColumns: "1fr 140px 100px",
      gap: "20px",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "var(--card-hover)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      transition: "all 0.3s ease",
    },
    productInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    productName: {
      fontSize: "16px",
      fontWeight: "700",
      color: "var(--text)",
    },
    productDetails: {
      fontSize: "13px",
      color: "var(--text-secondary)",
    },
    actions: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
    },
    btnEdit: {
      padding: "8px 16px",
      backgroundColor: "#00d9ff",
      color: "var(--bg)",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
    },
    btnDelete: {
      padding: "8px 16px",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
    },
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>🛠️ Gestion des Produits</h1>
      <p style={s.subtitle}>Administrez votre catalogue de produits VR</p>

      {error && <div style={{ ...s.alert, ...s.alertError }}>{error}</div>}
      {success && <div style={{ ...s.alert, ...s.alertSuccess }}>{success}</div>}

      {/* Form Section */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>
          {editingId ? "Modifier un produit" : "Ajouter un nouveau produit"}
        </h2>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.formGroup}>
            <label style={s.label}>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              placeholder="Ex: Meta Quest 3"
              style={s.input}
              required
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Prix (€)</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleInputChange}
              placeholder="499.99"
              step="0.01"
              style={s.input}
              required
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Quantité</label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleInputChange}
              placeholder="10"
              style={s.input}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Catégorie</label>
            <select
              name="idCategorie"
              value={formData.idCategorie}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, idCategorie: parseInt(e.target.value) }))
              }
              style={s.input}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Image du produit</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="https://... ou coller une image"
              style={s.input}
            />
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              style={{ marginTop: "12px", color: "var(--text)" }}
            />
            <small style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Upload PNG/JPEG ou collez directement une image depuis le presse-papiers.
            </small>
            {formData.image && (
              <img
                src={formData.image}
                alt="Aperçu du produit"
                style={{ width: "100%", maxHeight: "260px", height: "auto", objectFit: "contain", borderRadius: "12px", marginTop: "14px", border: "1px solid var(--border)", display: "block" }}
              />
            )}
          </div>

          <div style={{ ...s.formGroup, gridColumn: "1 / -1" }}>
            <label style={s.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Détails du produit..."
              style={s.textarea}
            />
          </div>

          <div style={s.buttonGroup}>
            <button type="submit" style={s.btnSubmit}>
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
            {editingId && (
              <button
                type="button"
                style={s.btnCancel}
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    nom: "",
                    prix: "",
                    quantite: "",
                    description: "",
                    image: "",
                    idCategorie: 1,
                  });
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Produits ({produits.length})</h2>
        <div style={s.productsList}>
          {produits.map((p) => (
            <div key={p.idProduit} style={s.productItem}>
              <div style={s.productInfo}>
                <div style={s.productName}>{p.nom}</div>
                <div style={s.productDetails}>
                  {p.prix}€ • Stock: {p.quantite} • Cat: {p.idCategorie}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#ff6b9d" }}>
                  {p.prix}€
                </div>
              </div>
              <div style={s.actions}>
                <button style={s.btnEdit} onClick={() => handleEdit(p)}>
                  Modifier
                </button>
                <button style={s.btnDelete} onClick={() => handleDelete(p.idProduit)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;

