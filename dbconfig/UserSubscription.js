const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');
const SubscriptionPlan = require('./SubscriptionPlan');


const UserSubscription = sequelize.define('UserSubscription', {
  ID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  SubscriptionPlanID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
        model: SubscriptionPlan,
        key: 'ID',
      },
  },
  BillingAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PaymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Expired', 'Unsubscribed','Deleted'),
    allowNull: false,
    defaultValue: 'Active',
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'UserSubscription',
  timestamps: false,
});

SubscriptionPlan.hasMany(UserSubscription,{foreignKey: 'SubscriptionPlanID'})
UserSubscription.belongsTo(SubscriptionPlan);

module.exports = UserSubscription;
