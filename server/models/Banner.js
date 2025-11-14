const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'image_url',
    comment: '图片URL'
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '跳转链接（可选）'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：1启用，0禁用'
  }
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['sort']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Banner;

