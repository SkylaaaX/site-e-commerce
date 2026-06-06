const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const User = require('../models/User');

// Middleware pour vérifier le rôle admin
const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent effectuer cette action.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST — Créer un nouveau produit
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { nom, prix, quantite, description, image, idCategorie } = req.body;
    
    if (!nom || !prix || !idCategorie) {
      return res.status(400).json({ message: 'Nom, prix et catégorie sont obligatoires' });
    }
    
    const newProduit = await Produit.create({
      nom,
      prix,
      quantite: quantite || 0,
      description: description || null,
      image: image || null,
      idCategorie,
    });
    
    res.status(201).json(newProduit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT — Modifier un produit existant
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prix, quantite, description, image, idCategorie } = req.body;
    
    const produit = await Produit.findByPk(id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Mettre à jour les champs fournis
    if (nom !== undefined) produit.nom = nom;
    if (prix !== undefined) produit.prix = prix;
    if (quantite !== undefined) produit.quantite = quantite;
    if (description !== undefined) produit.description = description;
    if (image !== undefined) produit.image = image;
    if (idCategorie !== undefined) produit.idCategorie = idCategorie;
    
    await produit.save();
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE — Supprimer un produit
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const produit = await Produit.findByPk(id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    await produit.destroy();
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
