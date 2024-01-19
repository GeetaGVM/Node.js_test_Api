const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');


const Cart = sequelize.define('Cart', {
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
  tableName: 'Cart',
  timestamps: false
});


User.hasMany(Cart, { foreignKey: 'UserID' });
Cart.belongsTo(User);


// sequelize.sync().then(() => {
//   console.log('order tables created successfully!');
// }).catch((error) => {
//   console.error('Unable to create table : ', error);
// });

module.exports = Cart;

