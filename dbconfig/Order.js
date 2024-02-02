const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User')
const Product = require('./Product');


const Order = sequelize.define('Order', {
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
  GrandTotal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TotalItems: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ShippingAddress: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  BillingAddress: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled','order placed'), 
    allowNull: false,
    defaultValue: 'order placed'
  },
  OrderDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  PaymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
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
  tableName: 'Order',
  timestamps: false
});



Order.belongsToMany(Product, { through: 'CartItem', foreignKey: 'OrderID' });
Product.belongsToMany(Order, { through: 'CartItem', foreignKey: 'ProductID' });




module.exports = Order;
