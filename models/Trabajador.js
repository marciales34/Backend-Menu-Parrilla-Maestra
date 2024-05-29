const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Trabajador = sequelize.define('Trabajador', {
  id_formulario_trabajadores: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hoja_vida: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'formulario_trabajadores',
  timestamps: false,
});

module.exports = Trabajador;
