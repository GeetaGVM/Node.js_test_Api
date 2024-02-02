const { DataTypes } = require('sequelize');
const sequelize = require('../dbconfig/db');
const SliderName = require('./SliderName');
const Slide = require('./slide');

const ImageSetting = sequelize.define('ImageSetting', {
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
            model: SliderName,
            key: 'ID'
        }
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    format: {
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
    tableName: 'ImageSetting',
    timestamps: false
});

SliderName.hasMany(ImageSetting,{ foreignKey: 'SliderNameID'})
ImageSetting.belongsTo(SliderName);

Slide.hasMany(ImageSetting, { foreignKey: 'order', onDelete: 'CASCADE', sourceKey: 'order' });
ImageSetting.belongsTo(Slide);


module.exports = ImageSetting;
