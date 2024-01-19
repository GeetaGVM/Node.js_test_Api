const Sequelize = require('sequelize')
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DAILECT,
  host: process.env.DB_HOST,
  port:process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch((err) => {
  console.log('Unable to connect to the database:', err);
});


module.exports = sequelize;



