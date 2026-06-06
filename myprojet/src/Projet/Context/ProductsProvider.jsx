import React, { useState, useCallback, useEffect } from "react";
import { ProductsContext } from "./ProductsContext";
import { products as produitsParDefaut } from "../productsData";

export function ProductsProvider({ children }) {
  const [produits, setProduits] = useState(produitsParDefaut);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/produits");
      if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
      const data = await res.json();
      if (Array.isArray(data) && data.length) setProduits(data);
    } catch (err) {
      // on garde le fallback local
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  // Polling léger pour approcher une mise à jour temps-réel
  useEffect(() => {
    const id = setInterval(() => {
      fetchProduits();
    }, 5000);
    return () => clearInterval(id);
  }, [fetchProduits]);

  // Helpers that call backend then refresh
  const refreshProducts = useCallback(() => fetchProduits(), [fetchProduits]);

  const parseApiResponse = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(text || res.statusText || "Erreur serveur inconnue");
    }
  };

  const createProduit = async (payload, userId) => {
    const res = await fetch("http://localhost:3000/api/admin/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json", "user-id": userId },
      body: JSON.stringify(payload),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw data;
    await fetchProduits();
    return data;
  };

  const updateProduit = async (id, payload, userId) => {
    const res = await fetch(`http://localhost:3000/api/admin/produits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "user-id": userId },
      body: JSON.stringify(payload),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw data;
    await fetchProduits();
    return data;
  };

  const deleteProduit = async (id, userId) => {
    const res = await fetch(`http://localhost:3000/api/admin/produits/${id}`, {
      method: "DELETE",
      headers: { "user-id": userId },
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw data;
    await fetchProduits();
    return data;
  };

  return (
    <ProductsContext.Provider
      value={{ produits, loading, error, refreshProducts, createProduit, updateProduit, deleteProduit, setProduits }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
