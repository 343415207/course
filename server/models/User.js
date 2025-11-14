const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '微信openid'
  },
  unionid: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '微信unionid'
  },
  nickName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nick_name',
    comment: '昵称'
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'avatar_url',
    comment: '头像URL'
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    comment: '角色：admin管理员，user普通用户'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['openid']
    }
  ]
});

module.exports = User;

