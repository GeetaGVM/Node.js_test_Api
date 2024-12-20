const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Slide = require('./slide');


const SlideImage = sequelize.define('SlideImage', {
    ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    }, 
    SlideID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: Slide,
          key: 'ID'
        }
    },
    ImagePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ImageOrder: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  tableName: 'SlideImage',
  timestamps: false
});

Slide.hasMany(SlideImage, { foreignKey: 'SliderID', onDelete: 'CASCADE' });
SlideImage.belongsTo(Slide);


module.exports = SlideImage;
