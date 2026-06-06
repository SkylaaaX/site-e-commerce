/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const PanierContext = createContext();

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState(() => {
    // récupère le panier depuis localStorage si existant
    const stored = localStorage.getItem("panier");
    return stored ? JSON.parse(stored) : [];
  });

  // Synchronise avec localStorage pour persistance
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  // Fonction pour ajouter un produit (avec quantité)
  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const exist = prev.find((p) => p.idProduit === produit.idProduit);
      if (exist) {
        // Si déjà présent, on augmente la quantité
        return prev.map((p) =>
          p.idProduit === produit.idProduit ? { ...p, quantite: (p.quantite || 1) + 1 } : p
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  // Supprimer un article
  const supprimerArticle = (idProduit) => {
    setPanier((prev) => prev.filter((p) => p.idProduit !== idProduit));
  };

  // Modifier la quantité
  const modifierQuantite = (idProduit, nouvelleQuantite) => {
    setPanier((prev) =>
      prev.map((p) =>
        p.idProduit === idProduit ? { ...p, quantite: Math.max(1, nouvelleQuantite) } : p
      )
    );
  };

  return (
    <PanierContext.Provider
      value={{ panier, setPanier, ajouterAuPanier, supprimerArticle, modifierQuantite }}
    >
      {children}
    </PanierContext.Provider>
  );
}
