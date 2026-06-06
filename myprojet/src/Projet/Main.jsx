import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./Connexion.jsx";
import Home from "./Home.jsx";
import Inscription from "./Inscription.jsx";
import Catalogue from "./Catalogue.jsx";
import Panier from "./Panier.jsx";
import MonEspace from "./MonEspace.jsx";
import Admin from "./Admin.jsx";
import Favoris from "./Favoris.jsx";

function Main() {
  return (
    <main style={{ minHeight: "80vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/mon-espace" element={<MonEspace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
}

export default Main;
