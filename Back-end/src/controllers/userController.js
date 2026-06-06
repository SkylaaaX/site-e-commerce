const User     = require('../models/User');
const Commande = require('../models/Commande');

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
  try {
    const idUser = getUserId(req);
    if (!idUser) return res.status(401).json({ message: 'Utilisateur non identifié.' });

    const user = await User.findByPk(idUser);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    // Normalize amount robustly (frontend can send number or string)
    const { paymentMethod, cardNumber, paypalEmail, expiry, cvv, adresse_livraison } = req.body;

    const rawMontant =
      req.body?.montant ?? req.body?.total ?? req.body?.amount;

    let parsedMontant = 0;
    if (rawMontant !== undefined && rawMontant !== null) {
      if (typeof rawMontant === "string") {
        // Strip currency symbols/text, keep digits, dot/comma/space
        const cleaned = rawMontant
          .replace(/[^\d.,\s-]/g, "")
          .replace(/\s/g, "");

        // If comma is used as decimal separator: "1234,56" -> "1234.56"
        // If dot is used: "1234.56" stays as-is.
        const normalized = cleaned.includes(",") && !cleaned.includes(".")
          ? cleaned.replace(",", ".")
          : cleaned.replace(/,/g, "");

        parsedMontant = Number(normalized);
      } else {
        parsedMontant = Number(rawMontant);
      }
    }

    if (!Number.isFinite(parsedMontant) || Number.isNaN(parsedMontant)) {
      parsedMontant = 0;
    }

    const paymentLabel =
      paymentMethod === 'paypal'
        ? `PayPal ${paypalEmail || user.email}`
        : paymentMethod === 'visa'
          ? `Visa ${maskCard(cardNumber)}`
          : paymentMethod || user.payment_method;

    await user.update({
      payment_method: paymentMethod || user.payment_method,
      payment_label: paymentLabel,
      adresse: adresse_livraison || user.adresse,
    });

    const commande = await Commande.create({
      idUser,
      montant: parsedMontant,
      statut: 'en attente',
      adresse_livraison: adresse_livraison || user.adresse || 'Adresse non définie',
      payment_method: paymentMethod || user.payment_method,
      payment_reference: paymentLabel,
    });

    res.status(201).json({ message: 'Commande créée.', commande });
  } catch (err) {
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
  try {
    const idUser = getUserId(req);
    if (!idUser) return res.status(401).json({ message: 'Utilisateur non identifié.' });

    const idCommande = Number(req.params.idCommande);
    if (!Number.isFinite(idCommande) || Number.isNaN(idCommande)) {
      return res.status(400).json({ message: 'idCommande invalide.' });
    }

    const commande = await Commande.findOne({
      where: { idCommande, idUser },
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    await Commande.destroy({
      where: { idCommande, idUser },
    });

    res.status(200).json({ message: 'Commande supprimée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
