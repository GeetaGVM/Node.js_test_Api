const { DataTypes } = require('sequelize');
const sequelize =require('./db')
const Cart = require('./Cart')

const Order = require('./Order');


const User = sequelize.define('User', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Country_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Is_otp_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  Otp_expiration_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Login_type: {
    type: DataTypes.STRING, //ENUM('phone','email')
    allowNull: false
  },
  
  Role: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  AccessToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: 'User',
  timestamps: false
});

User.hasMany(Order, { foreignKey: 'UserID', as: 'orders', });
Order.belongsTo(User);

User.hasMany(Cart, { foreignKey: 'UserID' });
Cart.belongsTo(User);




module.exports = User;
