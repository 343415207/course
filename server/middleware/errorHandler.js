/**
 * 统一错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: '数据验证失败',
      code: 'VALIDATION_ERROR',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: '数据已存在',
      code: 'DUPLICATE_ENTRY',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize 外键约束错误
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: '关联数据不存在',
      code: 'FOREIGN_KEY_ERROR'
    });
  }

  // 默认错误
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR'
  });
};

module.exports = errorHandler;

