/**
 * 请求限流中间件
 */
const rateLimit = require('express-rate-limit')
const config = require('../config')

// 全局限流
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { code: 429, message: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false
})

// 换装接口专用限流（更严格）
const tryonLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 5, // 每分钟最多5次
  message: { code: 429, message: '换装请求过于频繁，请稍后再试' },
  keyGenerator: (req) => req.user?.userId || req.ip
})

// 上传接口限流
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { code: 429, message: '上传过于频繁，请稍后再试' }
})

module.exports = { globalLimiter, tryonLimiter, uploadLimiter }
