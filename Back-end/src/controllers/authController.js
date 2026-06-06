const User          = require('../models/User');
const RefreshToken  = require('../models/RefreshToken');
const LoginAttempts = require('../models/LoginAttempts');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const { Op }        = require('sequelize');

const JWT_SECRET         = process.env.JWT_SECRET         || 'hightechshop_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'hightechshop_refresh_secret';

const ACCESS_TOKEN_EXPIRY     = '1m';
const REFRESH_TOKEN_EXPIRY    = '3m';
const REFRESH_TOKEN_EXPIRY_MS = 3 * 60 * 1000;

const BCRYPT_ROUNDS    = 10;
const MAX_ATTEMPTS     = 3;
const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// ── Helpers tokens ────────────────────────────────────
const generateAccessToken = (user) =>
  jwt.sign(
    { idUser: user.idUser, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { idUser: user.idUser },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

// ── INSCRIPTION ───────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, ville, age, adresse } = req.body;

    if (!nom || !prenom || !email || !password)
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Le mot de passe doit contenir au minimum 8 caractères.' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashedPw = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newUser  = await User.create({
      nom,
      prenom,
      email,
      pw: hashedPw,
      role: 'client',
      ville: ville || null,
      age: age ? Number(age) : null,
      adresse: adresse || null,
    });

    console.log('Utilisateur créé :', newUser.idUser, newUser.email);
    res.status(201).json({ message: 'Inscription réussie !' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── CONNEXION ─────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'inconnue';

    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis.' });

    const user = await User.findOne({ where: { email } });

    // ── Gestion des tentatives ──────────────────────────
    // On récupère ou crée l'entrée LoginAttempts pour cet utilisateur
    // Si l'utilisateur n'existe pas, on rejette sans créer d'entrée
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    let attempt = await LoginAttempts.findOne({ where: { idUser: user.idUser } });

    if (!attempt) {
      // Première tentative : créer l'entrée
      attempt = await LoginAttempts.create({ idUser: user.idUser, AttemptCount: 0 });
    }

    // Vérifier si le compte est bloqué
    if (attempt.LockedUntil && new Date() < new Date(attempt.LockedUntil)) {
      const remainingMs  = new Date(attempt.LockedUntil) - new Date();
      const remainingMin = Math.ceil(remainingMs / 1000 / 60);
      return res.status(429).json({
        message: `Compte temporairement bloqué. Réessayez dans ${remainingMin} minute(s).`,
      });
    }

    // Si le blocage est expiré, on remet à zéro et on recharge l'objet
    if (attempt.LockedUntil && new Date() >= new Date(attempt.LockedUntil)) {
      await attempt.update({ AttemptCount: 0, LockedUntil: null, LastAttemptAt: new Date() });
      await attempt.reload(); // recharger pour avoir AttemptCount = 0 à jour
    }

    // ── Vérification mot de passe ───────────────────────
    const isMatch = await bcrypt.compare(password, user.pw);

    if (!isMatch) {
      const newCount = attempt.AttemptCount + 1;

      if (newCount >= MAX_ATTEMPTS) {
        // Bloquer le compte pendant 5 minutes
        await attempt.update({
          AttemptCount:  newCount,
          LastAttemptAt: new Date(),
          LockedUntil:   new Date(Date.now() + LOCK_DURATION_MS),
          ip_adresse:    ip,
        });
        return res.status(429).json({
          message: `Trop de tentatives. Compte bloqué pendant 5 minutes.`,
        });
      }

      await attempt.update({
        AttemptCount:  newCount,
        LastAttemptAt: new Date(),
        ip_adresse:    ip,
      });

      const restantes = MAX_ATTEMPTS - newCount;
      return res.status(401).json({
        message: `Email ou mot de passe incorrect. ${restantes} tentative(s) restante(s).`,
      });
    }

    // ── Connexion réussie : remise à zéro des tentatives ──
    await attempt.update({ AttemptCount: 0, LockedUntil: null, LastAttemptAt: new Date() });

    // ── Génération des tokens ───────────────────────────
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Stocker le hash du refresh token en BDD (colonnes du MCD)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);

    await RefreshToken.create({
      idUser:     user.idUser,
      token_hash: hashedRefreshToken,   // hash — jamais le token brut
      ExpireAt:   new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      RevokedAt:  null,                 // null = actif
    });

    res.status(200).json({
      message: 'Connexion réussie !',
      accessToken,
      refreshToken,                     // token brut envoyé au client
      user: {
        idUser: user.idUser,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── REFRESH TOKEN ─────────────────────────────────────
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token manquant.' });

    // 1. Vérifier la signature JWT
    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token invalide ou expiré.' });
    }

    // 2. Récupérer les tokens actifs (non révoqués, non expirés) de l'utilisateur
    const userTokens = await RefreshToken.findAll({
      where: {
        idUser:    payload.idUser,
        RevokedAt: { [Op.is]: null },              // pas révoqué
        ExpireAt:  { [Op.gt]: new Date() },        // pas expiré
      },
    });

    // 3. Trouver le token correspondant via bcrypt.compare
    let storedToken = null;
    for (const record of userTokens) {
      const match = await bcrypt.compare(refreshToken, record.token_hash);
      if (match) { storedToken = record; break; }
    }

    if (!storedToken)
      return res.status(401).json({ message: 'Refresh token inconnu ou révoqué.' });

    // 4. Récupérer l'utilisateur
    const user = await User.findByPk(payload.idUser);
    if (!user)
      return res.status(401).json({ message: 'Utilisateur introuvable.' });

    // 5. Rotation : révoquer l'ancien (RevokedAt = maintenant), créer le nouveau
    await storedToken.update({ RevokedAt: new Date() });

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const hashedNew = await bcrypt.hash(newRefreshToken, BCRYPT_ROUNDS);

    await RefreshToken.create({
      idUser:     user.idUser,
      token_hash: hashedNew,
      ExpireAt:   new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      RevokedAt:  null,
    });

    res.status(200).json({
      accessToken:  newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── LOGOUT ────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      let payload;
      try {
        payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      } catch {
        return res.status(200).json({ message: 'Déconnexion réussie.' });
      }

      // Trouver le token et le révoquer (RevokedAt) au lieu de le supprimer
      const userTokens = await RefreshToken.findAll({
        where: { idUser: payload.idUser, RevokedAt: { [Op.is]: null } },
      });

      for (const record of userTokens) {
        const match = await bcrypt.compare(refreshToken, record.token_hash);
        if (match) {
          await record.update({ RevokedAt: new Date() }); // révocation propre
          break;
        }
      }
    }

    res.status(200).json({ message: 'Déconnexion réussie.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
