const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('parrilla_maestra', 'root', 'Diego3112381429', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
