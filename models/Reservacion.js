const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./Usuario');

const Reservacion = sequelize.define('Reservacion', {
  id_reservaciones: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_reservacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_reservacion: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  num_personas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuarios: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuarios',
    },
    allowNull: false,
  },
}, {
  tableName: 'reservaciones',
  timestamps: false,
});

Usuario.hasMany(Reservacion, { foreignKey: 'id_usuarios' });
Reservacion.belongsTo(Usuario, { foreignKey: 'id_usuarios' });

module.exports = Reservacion;
