const { DataTypes } = require('sequelize');
const sequelize = require('./db'); 
const Cart = require('./Cart');
const Product = require('./Product');
const Order = require('./Order');

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
  OrderID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    references: {
      model: Order,
      key: 'ID',
    },
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TotalAmount: {
    type: DataTypes.STRING,
    allowNull:false
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

Order.hasMany(CartItem, { foreignKey: 'OrderID' });
CartItem.belongsTo(Order);


module.exports = CartItem;

