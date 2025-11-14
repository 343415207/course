const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Record = require('./Record');

const RecordImage = sequelize.define('RecordImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'record_id',
    comment: '所属记录ID',
    references: {
      model: Record,
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'image_url',
    comment: '图片URL'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  }
}, {
  tableName: 'record_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['record_id']
    }
  ]
});

// 定义关联关系
RecordImage.belongsTo(Record, { foreignKey: 'recordId', as: 'record' });
Record.hasMany(RecordImage, { foreignKey: 'recordId', as: 'images' });

module.exports = RecordImage;

