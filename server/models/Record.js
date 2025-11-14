const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Course = require('./Course');
const User = require('./User');

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id',
    comment: '所属课程ID',
    references: {
      model: Course,
      key: 'id'
    }
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
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注文字'
  }
}, {
  tableName: 'records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['course_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

// 定义关联关系
Record.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Record.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Course.hasMany(Record, { foreignKey: 'courseId', as: 'records' });
User.hasMany(Record, { foreignKey: 'userId', as: 'records' });

module.exports = Record;

