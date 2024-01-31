const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');
const ReviewImages = require('./ReviewImages');

const Review = sequelize.define('Review', {
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
  targetType: {
    type: DataTypes.ENUM('Product', 'Order'),
    allowNull: false,
  },
  TargetID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
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
  tableName: 'Review',
  timestamps: false
});


Product.hasMany(Review, { foreignKey: 'TargetID', constraints: false, scope: { targetType: 'Product' }, as: 'reviewsAndRatings' });
Review.belongsTo(Product, { foreignKey: 'TargetID', constraints: false, as: 'product' });


Order.hasMany(Review, { foreignKey: 'TargetID', constraints: false, scope: { targetType: 'Order' }, as: 'reviewsAndRatings' });
Review.belongsTo(Order, { foreignKey: 'TargetID', constraints: false, as: 'order' });

;

Review.hasMany(ReviewImages, {foreignKey: 'TargetID',as: 'ReviewImage'});
ReviewImages.belongsTo(Review, { foreignKey: 'TargetID',as: 'ReviewImage' });


module.exports = Review;
