const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '课程名称'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    comment: '所属用户ID',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    }
  ]
});

// 定义关联关系
Course.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Course, { foreignKey: 'userId', as: 'courses' });

module.exports = Course;

