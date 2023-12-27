const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('../dbconfig/product')

const ProductMedia = sequelize.define('ProductMedia', {
    ProductID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'ID'
      }
    },
    ImagePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Is_Main_Image: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'ProductMedia',
    timestamps: false
  });
  

Product.hasOne(ProductMedia, { as: 'ProductMedia',foreignKey: 'ProductID' });
ProductMedia.belongsTo(Product)

module.exports = { ProductMedia };
