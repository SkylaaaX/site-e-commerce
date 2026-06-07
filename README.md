# VR-Store — Plateforme E-Commerce de Réalité Virtuelle

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)

**VR-Store** est une application web e-commerce full-stack spécialisée dans la vente d'équipements et d'accessoires de réalité virtuelle.

Développée dans le cadre du **BTS SIO (Services Informatiques aux Organisations)**, option **SLAM (Solutions Logicielles et Applications Métiers)**, la plateforme permet aux utilisateurs de consulter un catalogue de produits, gérer leur compte, enregistrer des favoris, administrer leur panier et effectuer des achats à travers une interface moderne et responsive.

L'application repose sur une architecture client-serveur utilisant **React** pour le frontend, **Express.js** pour le backend, ainsi qu'une combinaison de **MongoDB** et **MySQL** pour la gestion des données.

---

# Sommaire

* [Fonctionnalités](#fonctionnalités)
* [Technologies utilisées](#technologies-utilisées)
* [Installation](#installation)
* [Structure du projet](#structure-du-projet)
* [Architecture des bases de données](#architecture-des-bases-de-données)
* [Sécurité](#sécurité)
* [Contexte du projet](#contexte-du-projet)
* [Auteur](#auteur)

---

# Fonctionnalités

## Fonctionnalités utilisateur

### Authentification

* Inscription utilisateur
* Connexion sécurisée
* Authentification via JWT
* Chiffrement des mots de passe avec bcrypt
* Gestion du profil utilisateur

### Catalogue de produits

* Consultation des produits VR
* Affichage détaillé des produits
* Navigation intuitive
* Classement par catégories

### Gestion des favoris

* Ajout d'articles aux favoris
* Suppression des favoris
* Consultation de sa liste personnelle

### Panier d'achat

* Ajout de produits au panier
* Modification des quantités
* Suppression d'articles
* Calcul automatique du montant total

### Gestion des commandes

* Validation d'une commande
* Historique des achats
* Conservation des données utilisateur

---

## Fonctionnalités administrateur

### Gestion des produits

* Création de produits
* Modification de produits
* Suppression de produits
* Gestion du catalogue

### Gestion des utilisateurs

* Consultation des comptes utilisateurs
* Administration des données clients

### Gestion des commandes

* Suivi des commandes
* Gestion des statuts de commande

---

# Technologies utilisées

| Composant             | Technologie        |
| --------------------- | ------------------ |
| Frontend              | React 19 + Vite    |
| Backend               | Express.js 5       |
| Base de données NoSQL | MongoDB (Mongoose) |
| Base de données SQL   | MySQL (Sequelize)  |
| Authentification      | JWT + bcrypt       |
| Routage Frontend      | React Router DOM   |
| Tests                 | Vitest             |
| Sécurité              | CORS + dotenv      |
| Versionning           | Git & GitHub       |

---

# Installation

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

* Node.js (v20 ou supérieur recommandé)
* npm
* XAMPP
* MongoDB Community Server
* Git

---

## Cloner le projet

```bash
git clone https://github.com/SkylaaaX/site-e-commerce.git
cd site-e-commerce
```

---

## Installer les dépendances

### Frontend

```bash
cd myprojet
npm install
```

### Backend

```bash
cd Back-end
npm install
```

---

## Configuration des bases de données

### MySQL (XAMPP)

1. Ouvrir le panneau de contrôle XAMPP.
2. Démarrer Apache et MySQL.
3. Accéder à phpMyAdmin.
4. Créer une base de données :

```sql
vrstore
```

5. Importer le fichier SQL du projet si nécessaire.

---

### MongoDB

Démarrer le service MongoDB :

```bash
mongod
```

Créer une base de données :

```text
vrstore_mongodb
```

---

## Configuration des variables d'environnement

Créer un fichier `.env` dans le dossier **Back-end** :

```env
PORT=5000

JWT_SECRET=your_secret_key

# MongoDB
MONGO_URI=mongodb://localhost:27017/vrstore_mongodb

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vrstore
DB_PORT=3306
```

---

## Lancer l'application

### Backend

```bash
cd Back-end
npm start
```

ou

```bash
npm run dev
```

### Frontend

```bash
cd myprojet
npm run dev
```

L'application sera accessible à l'adresse :

```text
http://localhost:5173
```

---

# Structure du projet

```text
site-e-commerce/
│
├── myprojet/
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── routes/
│
├── Back-end/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── services/
│   └── server.js
│
└── README.md
```

---

# Architecture des bases de données

VR-Store utilise une architecture hybride combinant **MongoDB** et **MySQL**.

## MongoDB (Mongoose)

MongoDB est utilisé pour gérer :

* Les informations utilisateur
* Les favoris
* Les données de session
* Les informations dynamiques nécessitant une structure flexible

Grâce à Mongoose, les schémas et les relations applicatives sont gérés de manière simplifiée.

## MySQL (Sequelize)

MySQL est utilisé pour gérer :

* Les produits
* Les catégories
* Les commandes
* Les relations métier principales

L'utilisation de Sequelize permet une abstraction de la couche SQL et facilite les opérations CRUD sur les données relationnelles.

Cette architecture permet de bénéficier de la flexibilité de MongoDB tout en conservant la robustesse relationnelle de MySQL.

---

# Sécurité

## Authentification

* Authentification par JSON Web Token (JWT)
* Routes protégées
* Vérification des sessions utilisateur

## Protection des mots de passe

* Hachage avec bcrypt
* Stockage sécurisé des informations sensibles

## Sécurité API

* Gestion des variables sensibles avec dotenv
* Configuration CORS
* Validation des requêtes

## Bonnes pratiques

* Séparation Frontend / Backend
* Architecture modulaire
* Gestion du versionning via Git et GitHub
* Réutilisation des composants React

---

# Contexte du projet

VR-Store a été développé dans le cadre du BTS SIO option SLAM.

L'objectif du projet était de concevoir une application e-commerce complète permettant de mettre en pratique les compétences acquises durant la formation :

* Développement d'applications web full-stack
* Gestion et modélisation de bases de données
* Création d'API REST
* Sécurisation des applications
* Gestion de projet informatique
* Utilisation des outils de collaboration Git et GitHub

Le projet constitue une réalisation professionnelle présentée dans le cadre de l'épreuve E6 du BTS SIO.

---

# Auteur

**Skyla Fox Escandell**

Étudiante BTS SIO 
GitHub : https://github.com/SkylaaaX

Projet réalisé dans le cadre de la formation BTS Services Informatiques aux Organisations.
