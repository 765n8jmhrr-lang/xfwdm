/**
 * Redis 连接配置
 */
const { createClient } = require('redis')
const config = require('./index')

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  password: config.redis.password || undefined
})

redisClient.on('connect', () => {
  console.log('[Redis] 连接成功')
})

redisClient.on('error', (err) => {
  console.error('[Redis] 连接错误:', err.message)
})

// 延迟连接（避免启动时Redis未就绪导致崩溃）
;(async () => {
  try {
    await redisClient.connect()
  } catch (err) {
    console.error('[Redis] 初始化连接失败:', err.message)
  }
})()

module.exports = redisClient
