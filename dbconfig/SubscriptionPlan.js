const { DataTypes } = require('sequelize');
const sequelize = require('./db');


const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    ID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }, 
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.STRING, 
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
    tableName: 'SubscriptionPlan',
    timestamps: false
});



module.exports = SubscriptionPlan;