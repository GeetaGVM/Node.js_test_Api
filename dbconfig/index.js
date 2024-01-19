// // models.js (or the file where you import and define models)

// const { DataTypes } = require('sequelize');
// const sequelize = require('./db');
// const User = require('./user');
// const Order = require('./order');
// const Cart = require('./cart');
// const Product = require('./product');
// const CartItem = require('./cartitem');


// User.hasMany(Cart, { foreignKey: 'UserID', as: 'carts' });
// Cart.belongsTo(User);

// User.hasMany(Order, { foreignKey: 'UserId', as: 'orders' });
// Order.belongsTo(User);

// Cart.hasMany(CartItem, { foreignKey: 'CartId', onDelete: 'CASCADE' });
// CartItem.belongsTo(Cart);

// Product.hasMany(CartItem, { foreignKey: 'ProductId', as: 'cartItem' });
// CartItem.belongsTo(Product);


// // Order.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

// module.exports = { User, Order, Cart, Product, CartItem, sequelize };
