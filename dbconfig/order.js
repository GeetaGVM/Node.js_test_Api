// order.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user')

const Order = sequelize.define('Order', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  UserId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'ID',
    },
  },
  TotalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
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
    type: DataTypes.STRING, // ENUM('pending', 'shipped', 'delivered', 'cancelled', etc.)
    allowNull: false,
    defaultValue: 'pending'
  },
  OrderDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  PaymentStatus: {
    type: DataTypes.STRING, // ENUM('pending', 'paid', 'failed', etc.)
    allowNull: false,
    defaultValue: 'pending'
  },
  DeliveredDateTime: {
    type: DataTypes.DATE,
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
  tableName: 'Order',
  timestamps: false
});


User.hasMany(Order, { foreignKey: 'UserId', as: 'orders' });
Order.belongsTo(User);

// sequelize.sync().then(() => {
//     console.log('order tables created successfully!');
//   }).catch((error) => {
//     console.error('Unable to create table : ', error);
//   });

module.exports = Order;
