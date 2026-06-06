const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  idUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  pw: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ville: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_label: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  date_inscription: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'client',
  },
}, {
  tableName: 'Utilisateur',
  timestamps: false,
});

module.exports = User;
