const { Sequelize } = require('sequelize');

// ── MySQL (Sequelize) → Utilisateurs + Produits ──────
const sequelize = new Sequelize(
  'vrs',
  'root',
  '',        // ← mot de passe MAMP
  {
    host: 'localhost',
    port: 3306,  // ← XAMPP default port
    dialect: 'mysql',
    logging: false,
    timezone: '+02:00', // Europe/Paris (UTC+2 en heure d'été)
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Connecté à MySQL');
  } catch (err) {
    console.error('❌ Erreur MySQL :', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectMySQL };
