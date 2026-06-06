const app = require('./expressApp');
const { connectMySQL } = require('./db');

// Importation des modèles pour que Sequelize les enregistre au démarrage
require('./models/User');
require('./models/RefreshToken');
require('./models/LoginAttempts');
require('./models/Produit');
require('./models/Commande');

const start = async () => {
  await connectMySQL(); // MySQL → utilisateurs + produits

  app.listen(3000, () => {
    console.log('🚀 Serveur démarré sur le port 3000');
  });
};

start();
