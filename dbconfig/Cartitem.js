const { DataTypes } = require('sequelize');
const sequelize = require('./db'); 
const Cart = require('./Cart');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  CartID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  ProductID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: Product,
      key: 'ID',
    },
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'CartItem',
  timestamps: false
});

Cart.hasMany(CartItem, { foreignKey: 'CartID', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart);

Product.hasMany(CartItem, { foreignKey: 'ProductID', as: 'cartItem' });
CartItem.belongsTo(Product);

module.exports = CartItem;

