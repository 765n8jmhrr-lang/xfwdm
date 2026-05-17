/**
 * 全局错误处理中间件
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

function errorHandler(err, req, res, next) {
  // 默认值
  let statusCode = err.statusCode || 500
  let message = err.message || '服务器内部错误'
  let code = err.code || 'INTERNAL_ERROR'

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400
    message = err.errors.map(e => e.message).join('; ')
    code = 'VALIDATION_ERROR'
  }

  // Sequelize 唯一约束冲突
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409
    message = '数据已存在'
    code = 'DUPLICATE_ERROR'
  }

  // Multer 文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400
    message = '文件大小超出限制（最大10MB）'
    code = 'FILE_TOO_LARGE'
  }

  // 开发环境打印错误堆栈
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error]', err)
  }

  res.status(statusCode).json({
    code: statusCode,
    error: code,
    message: message
  })
}

module.exports = { AppError, errorHandler }
