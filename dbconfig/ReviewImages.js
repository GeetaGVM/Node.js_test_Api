// models/Image.js
const { DataTypes } = require('sequelize');
const sequelize = require('../dbconfig/db'); 
const Review = require('./Review');

const ReviewImages = sequelize.define('ReviewImages', {
    ID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Review,
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
    tableName: 'ReviewImages',
    timestamps: false
});
  

module.exports = ReviewImages;
