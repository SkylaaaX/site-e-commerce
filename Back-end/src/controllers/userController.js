const User = require('../models/User');
const Commande = require('../models/Commande');
const Produit = require('../models/Produit');
const { sequelize } = require('../db');

const getUserId = (req) => {
  const userId = req.headers['user-id'];
  return userId ? Number(userId) : null;
};

const maskCard = (cardNumber) => {
  if (!cardNumber) return null;
  const normalized = cardNumber.replace(/\D/g, '');
  return normalized.length >= 4 ? `**** **** **** ${normalized.slice(-4)}` : '****';
};

exports.getProfile = async (req, res) => {
  try {
    const idUser = getUserId(req);
    if (!idUser) return res.status(401).json({ message: 'Utilisateur non identifié.' });

    const user = await User.findByPk(idUser, {
      attributes: ['idUser', 'nom', 'prenom', 'email', 'ville', 'age', 'adresse', 'payment_method', 'payment_label'],
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const idUser = getUserId(req);
    if (!idUser) return res.status(401).json({ message: 'Utilisateur non identifié.' });

    const { nom, prenom, ville, age, adresse } = req.body;
    const user = await User.findByPk(idUser);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    await user.update({
      nom: nom || user.nom,
      prenom: prenom || user.prenom,
      ville: ville || user.ville,
      age: age || user.age,
      adresse: adresse || user.adresse,
    });

    res.status(200).json({ message: 'Profil mis à jour.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const idUser = getUserId(req);
    if (!idUser) {
      await transaction.rollback();
      return res.status(401).json({ message: 'Utilisateur non identifié.' });
    }

    const user = await User.findByPk(idUser, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const { paymentMethod, cardNumber, paypalEmail, expiry, cvv, adresse_livraison } = req.body;

    const rawMontant = req.body?.montant ?? req.body?.total ?? req.body?.amount;

    let parsedMontant = 0;
    if (rawMontant !== undefined && rawMontant !== null) {
      if (typeof rawMontant === 'string') {
        const cleaned = rawMontant
          .replace(/[^\d.,\s-]/g, '')
          .replace(/\s/g, '');

        const normalized = cleaned.includes(',') && !cleaned.includes('.')
          ? cleaned.replace(',', '.')
          : cleaned.replace(/,/g, '');

        parsedMontant = Number(normalized);
      } else {
        parsedMontant = Number(rawMontant);
      }
    }

    if (!Number.isFinite(parsedMontant) || Number.isNaN(parsedMontant)) {
      parsedMontant = 0;
    }

    const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
    if (rawItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'La commande doit contenir au moins un produit.' });
    }

    const normalizedItems = rawItems
      .map((item) => {
        const idProduit = Number(item?.idProduit);
        const quantite = Number(item?.quantite || 1);
        const prix = Number(item?.prix || 0);
        return {
          idProduit,
          quantite: Number.isFinite(quantite) && quantite > 0 ? Math.floor(quantite) : 0,
          prix: Number.isFinite(prix) ? prix : 0,
          nom: item?.nom || '',
        };
      })
      .filter((item) => Number.isFinite(item.idProduit) && item.idProduit > 0 && item.quantite > 0);

    if (normalizedItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Produits de commande invalides.' });
    }

    const groupedItems = normalizedItems.reduce((acc, item) => {
      if (!acc[item.idProduit]) {
        acc[item.idProduit] = { ...item };
      } else {
        acc[item.idProduit].quantite += item.quantite;
      }
      return acc;
    }, {});

    const productIds = Object.keys(groupedItems).map((id) => Number(id));
    const produits = await Produit.findAll({
      where: { idProduit: productIds },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (produits.length !== productIds.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Un ou plusieurs produits sont introuvables.' });
    }

    for (const produit of produits) {
      const ordered = groupedItems[produit.idProduit];
      const currentStock = Number(produit.quantite || 0);
      if (ordered.quantite > currentStock) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Stock insuffisant pour ${produit.nom}. Stock disponible: ${currentStock}.`,
        });
      }
    }

    for (const produit of produits) {
      const ordered = groupedItems[produit.idProduit];
      const newStock = Number(produit.quantite || 0) - ordered.quantite;
      const newNbCommandes = Number(produit.nb_commandes || 0) + ordered.quantite;
      await produit.update(
        {
          quantite: newStock,
          nb_commandes: newNbCommandes,
        },
        { transaction }
      );
    }

    const paymentLabel =
      paymentMethod === 'paypal'
        ? `PayPal ${paypalEmail || user.email}`
        : paymentMethod === 'visa'
          ? `Visa ${maskCard(cardNumber)}`
          : paymentMethod || user.payment_method;

    await user.update(
      {
        payment_method: paymentMethod || user.payment_method,
        payment_label: paymentLabel,
        adresse: adresse_livraison || user.adresse,
      },
      { transaction }
    );

    const orderItemsSnapshot = Object.values(groupedItems).map((item) => ({
      idProduit: item.idProduit,
      quantite: item.quantite,
      prix: item.prix,
      nom: item.nom,
    }));

    const commande = await Commande.create(
      {
        idUser,
        montant: parsedMontant,
        statut: 'en attente',
        adresse_livraison: adresse_livraison || user.adresse || 'Adresse non définie',
        payment_method: paymentMethod || user.payment_method,
        payment_reference: paymentLabel,
        items: JSON.stringify(orderItemsSnapshot),
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({ message: 'Commande créée.', commande });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const idUser = getUserId(req);
    if (!idUser) return res.status(401).json({ message: 'Utilisateur non identifié.' });

    const commandes = await Commande.findAll({
      where: { idUser },
      order: [['date_commande', 'DESC']],
    });

    res.status(200).json({ commandes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const idUser = getUserId(req);
    if (!idUser) {
      await transaction.rollback();
      return res.status(401).json({ message: 'Utilisateur non identifié.' });
    }

    const idCommande = Number(req.params.idCommande);
    if (!Number.isFinite(idCommande) || Number.isNaN(idCommande)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'idCommande invalide.' });
    }

    const commande = await Commande.findOne({
      where: { idCommande, idUser },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!commande) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    let orderItems = [];
    if (commande.items) {
      try {
        const parsed = JSON.parse(commande.items);
        if (Array.isArray(parsed)) {
          orderItems = parsed;
        }
      } catch (e) {
        console.error('Impossible de parser les items de la commande:', e);
      }
    }

    const groupedItems = orderItems.reduce((acc, item) => {
      const idProduit = Number(item?.idProduit);
      const quantite = Number(item?.quantite || 0);
      if (!Number.isFinite(idProduit) || idProduit <= 0 || !Number.isFinite(quantite) || quantite <= 0) {
        return acc;
      }
      if (!acc[idProduit]) acc[idProduit] = 0;
      acc[idProduit] += Math.floor(quantite);
      return acc;
    }, {});

    const productIds = Object.keys(groupedItems).map((id) => Number(id));
    if (productIds.length > 0) {
      const produits = await Produit.findAll({
        where: { idProduit: productIds },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      for (const produit of produits) {
        const qtyToRestore = groupedItems[produit.idProduit] || 0;
        if (qtyToRestore > 0) {
          await produit.update(
            {
              quantite: Number(produit.quantite || 0) + qtyToRestore,
            },
            { transaction }
          );
        }
      }
    }

    await Commande.destroy({
      where: { idCommande, idUser },
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ message: 'Commande annulée et stock restauré.' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
