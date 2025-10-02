const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/auth.sqlite'
});

// Sincronizar
sequelize.sync({ force: false })
  .then(() => console.log('Base de datos lista'))
  .catch(err => console.error('Error al conectar DB:', err));

module.exports = sequelize;
