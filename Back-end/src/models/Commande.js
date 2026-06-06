const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Commande = sequelize.define('Commande', {
  idCommande: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  statut: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'en attente',
  },
  adresse_livraison: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  date_commande: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Commande',
  timestamps: false,
});

module.exports = Commande;
