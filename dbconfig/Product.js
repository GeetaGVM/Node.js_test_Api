const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const ProductReview = require('./ProductReview');

const Product = sequelize.define('Product', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IsInStock: {  
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ProductStatus: {
    type: DataTypes.ENUM('published', 'inactive', 'draft'),
    allowNull: false,
    defaultValue: 'draft',
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Product',
  timestamps: false
});




module.exports = Product;
