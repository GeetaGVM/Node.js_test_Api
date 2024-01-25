const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./Product');
const User = require('./User');


const Wishlist = sequelize.define('Wishlist', {
    ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'ID',
      },
    },
    ProductID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: Product,
        key: 'ID',
      },
    },
  }, {
    tableName: 'Wishlist',
    timestamps: false
});
  
module.exports = Wishlist;
