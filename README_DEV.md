## Vue d’ensemble du projet

Le projet est une application e-commerce simple avec deux parties :

1. Back-end : API Node.js + Express + Sequelize/MySQL
2. myprojet : Frontend React + Vite

---

## Back-end

### Structure
- package.json
- src
  - `db.js` : connexion Sequelize à la base MySQL
  - `expressApp.js` : configuration d’Express, des middlewares et des routes
  - `server.js` : lancement du serveur
  - `models/` : définitions Sequelize
    - `Produit.js`, `User.js`, `RefreshToken.js`, `LoginAttempts.js`
  - `controllers/`
    - `authController.js` : login, inscription, refresh token, logout
  - `routes/`
    - `authRoutes.js` : routes d’authentification
    - `Produits.js` : routes produits
    - `adminProduits.js` : routes admin CRUD sur produits

### Fonctionnalités principales
- Authentification JWT + refresh token
- CRUD produits côté admin
- Gestion des utilisateurs
- Accès aux produits pour le frontend

---

## Front-end

### Structure
- package.json
- vite.config.js
- index.html
- src
  - `main.jsx` : point d’entrée React
  - `App.css`, `index.css` : styles globaux
  - `src/Projet/`
    - Pages : `Home.jsx`, `Catalogue.jsx`, `Panier.jsx`, Admin.jsx, MonEspace.jsx, Connexion.jsx, `Inscription.jsx`, Launch.jsx, `Header/Footer/Menu`
    - `Context/` : providers et context partagés
      - `ProductsContext.js`, `ProductsProvider.jsx`
      - `PanierContext.js`, `PanierProvider.jsx`
      - `UserContext.js`, UserProvider.jsx

### Flux de l’application
- Launch.jsx encapsule l’application dans :
  - `UserProvider`
  - `ProductsProvider`
  - `PanierProvider`
- `Main.jsx` définit les routes React Router et affiche les pages

### Etat partagé
- `ProductsProvider` charge les produits depuis le backend ou une source locale.
- `PanierProvider` gère le panier, stocke en `localStorage` et fournit des actions d’ajout/suppression.
- `UserProvider` garde l’état de l’utilisateur connecté.

---

## Pages clés

### `Home.jsx`
- page d’accueil simplifiée
- présente le magasin `VR-Store`
- affiche éventuellement les meilleurs produits ou un lien vers le catalogue

### `Catalogue.jsx`
- affiche la liste des produits
- utilise `ProductsContext`
- permet d’ajouter des produits au panier

### `Panier.jsx`
- montre le contenu du panier
- calcule le total
- permet de supprimer des articles

### Admin.jsx
- gestion des produits pour l’administrateur
- CRUD des produits via API
- page déjà simplifiée comme tu l’as demandé

### Connexion.jsx
- formulaire de connexion simple
- envoie les infos à `http://localhost:3000/api/auth/login`
- met à jour l’état utilisateur

### `Inscription.jsx`
- formulaire d’inscription simple
- poste vers `http://localhost:3000/api/auth/register`

### MonEspace.jsx
- page utilisateur après connexion
- affiche les informations de session et un bouton de déconnexion

---

## Branding et simplification

- L’application a été normalisée autour de `VR-Store`
- Les composants ont été simplifiés pour être plus accessibles à un niveau débutant/BTS
- Les formes complexes, animations ou surcouches visuelles ont été retirées

---

## Points techniques importants

- Le frontend utilise React fonctionnel et hooks
- Les données produits sont centralisées dans un contexte partagé
- Le panier est persistant via `localStorage`
- L’authentification est gérée avec une API backend et stockée localement
- Le backend utilise Sequelize pour la base de données MySQL

---

## Ce que tu as maintenant

- un backend API pour l’authentification et les produits
- un frontend React léger avec routes et pages simples
- un état partagé clair (`Products`, `Panier`, `User`)
- une logique de connexion/inscription séparée et simple
