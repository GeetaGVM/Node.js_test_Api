const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Order = require('./Order');
const Product = require('./Product');
const User = require('./User');

const OrderItem = sequelize.define('OrderItem', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
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
    allowNull: false,
  },
  TotalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
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
  tableName: 'OrderItem',
  timestamps: false
  
});


Product.hasMany(OrderItem, { foreignKey: 'ProductID' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductID' });

User.hasMany(OrderItem, { foreignKey: 'UserID' });
OrderItem.belongsTo(User, { foreignKey: 'UserID' });


module.exports = OrderItem;
