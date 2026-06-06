/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef, useCallback } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const timerRef = useRef(null);

  // Déconnexion complète
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error(error);
      }
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Démarre le timer de déconnexion automatique (3 min = durée refresh token)
  const startAutoLogout = useCallback((delayMs) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
    }, delayMs);
  }, [logout]);

  // Connexion : on stocke user + tokens + on lance le timer
  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // Déconnexion auto dans 3 minutes (durée du refresh token)
    startAutoLogout(3 * 60 * 1000);
  };

  // Au rechargement de la page : restaurer la session si encore valide
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const refreshToken = localStorage.getItem("refreshToken");

    if (savedUser && refreshToken) {
      // Vérifier si le refresh token est encore valide via le back
      fetch("http://localhost:3000/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.accessToken) {
            // Token encore valide : on restaure la session
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            setUser(JSON.parse(savedUser));
            startAutoLogout(3 * 60 * 1000);
          } else {
            // Token expiré : on nettoie
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startAutoLogout]);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
