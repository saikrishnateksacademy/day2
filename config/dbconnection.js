const { Sequelize, Model, DataTypes } = require('sequelize');

    const sequelize = new Sequelize('world', 'root', '00000000', {
  host: 'localhost',
//   port: 3306,
  dialect:'mysql' 
});

const dbconnection =async() =>{

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
};
};
sequelize.sync({ alter: true }) // alter: true updates table to match model
  .then(() => console.log("Database synced"))
  .catch(err => console.log("DB sync error:", err));
module.exports = { sequelize, dbconnection, Model, DataTypes };