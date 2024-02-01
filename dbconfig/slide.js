const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const SliderName = require('./SliderName');

const Slide = sequelize.define('Slide', {
    ID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    SliderNameID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'SliderName',
            key: 'ID'
        }
    },
    Header: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    SubHeader: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
  tableName: 'Slide',
  timestamps: false
});

SliderName.hasMany(Slide, { foreignKey: 'SliderNameID', onDelete: 'CASCADE' });
Slide.belongsTo(SliderName, { foreignKey: 'SliderNameID' });

module.exports = Slide;
