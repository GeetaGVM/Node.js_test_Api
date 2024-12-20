const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const SliderName = sequelize.define('SliderName', {
    ID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Order: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    IsHidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
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
    tableName: 'SliderName',
    timestamps: false
});

module.exports = SliderName;
