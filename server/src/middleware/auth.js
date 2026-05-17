/**
 * JWT 认证中间件
 */
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 必须登录的中间件
 */
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录，请先登录'
    })
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = {
      userId: decoded.userId,
      openid: decoded.openid
    }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: 'Token已过期，请重新登录' })
    }
    return res.status(401).json({ code: 401, message: 'Token无效' })
  }
}

/**
 * 可选登录（有Token则解析，没有也放行）
 */
function authOptional(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      req.user = { userId: decoded.userId, openid: decoded.openid }
    } catch (err) {
      // Token无效，忽略
    }
  }

  next()
}

module.exports = { authRequired, authOptional }
