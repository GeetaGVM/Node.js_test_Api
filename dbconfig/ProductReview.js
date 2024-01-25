const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./Product');
const User = require('./User');

const ProductReview = sequelize.define('ProductReview', {
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
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  Review: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'ProductReview',
  timestamps: false
});


Product.hasMany(ProductReview, { foreignKey: 'ProductID' });
ProductReview.belongsTo(Product);



module.exports = ProductReview;
