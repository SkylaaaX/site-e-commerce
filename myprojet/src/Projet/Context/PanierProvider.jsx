import { useState, useEffect } from "react";
import { PanierContext } from "./PanierContext.jsx";

const parsePrix = (value) => {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[^\d.,\s-]/g, "")
      .replace(/\s/g, "");

    // "1234,56" -> "1234.56"
    const normalized =
      cleaned.includes(",") && !cleaned.includes(".")
        ? cleaned.replace(",", ".")
        : cleaned.includes(",")
          ? cleaned.replace(/,/g, "")
          : cleaned;

    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const normalizeItem = (item) => {
  // If localStorage has legacy/non-object entries, try to keep UI alive.
  if (!item) {
    return { idProduit: undefined, quantite: 1, prix: 0 };
  }

  // Non-object (string/number) -> interpret as a price-ish value
  if (typeof item !== "object") {
    return { idProduit: undefined, quantite: 1, prix: parsePrix(item) };
  }

  // Support multiple historical shapes
  const idProduit =
    item.idProduit ?? item.id ?? item.produitId ?? item.productId;

  const quantiteRaw = item.quantite ?? item.quantiteProduit ?? 1;
  const quantite = Math.max(1, Number(quantiteRaw) || 1);

  const prix = parsePrix(item.prix ?? item.price);

  return {
    ...item,
    ...(idProduit !== undefined && idProduit !== null ? { idProduit } : {}),
    quantite,
    prix,
  };
};

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState(() => {
    const stored = localStorage.getItem("panier");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(normalizeItem) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const normalizedProduit = normalizeItem(produit);
      if (!normalizedProduit) return prev;

      const exist = prev.find((item) => item.idProduit === normalizedProduit.idProduit);
      if (exist) {
        return prev.map((item) =>
          item.idProduit === normalizedProduit.idProduit
            ? { ...item, quantite: (item.quantite || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...normalizedProduit, quantite: 1 }];
    });
  };

  const supprimerArticle = (idProduit) => {
    setPanier((prev) => prev.filter((item) => item.idProduit !== idProduit));
  };

  const modifierQuantite = (idProduit, nouvelleQuantite) => {
    setPanier((prev) =>
      prev.map((item) =>
        item.idProduit === idProduit
          ? { ...item, quantite: Math.max(1, nouvelleQuantite) }
          : item
      )
    );
  };

  return (
    <PanierContext.Provider
      value={{ panier, ajouterAuPanier, supprimerArticle, modifierQuantite }}
    >
      {children}
    </PanierContext.Provider>
  );
}
