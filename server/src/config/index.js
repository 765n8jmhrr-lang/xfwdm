/**
 * 全局配置
 */
module.exports = {
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  port: parseInt(process.env.PORT) || 3000,
  apiPrefix: process.env.API_PREFIX || '/api',

  // 数据库
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'paibanbao',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // 微信小程序
  wechat: {
    appId: process.env.WX_APPID || '',
    appSecret: process.env.WX_SECRET || ''
  },

  // 对象存储 OSS
  oss: {
    region: process.env.OSS_REGION || 'oss-cn-hangzhou',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
    bucket: process.env.OSS_BUCKET || 'paibanbao-images',
    cdnDomain: process.env.OSS_CDN_DOMAIN || ''
  },

  // AI Worker
  aiWorker: {
    url: process.env.AI_WORKER_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.AI_WORKER_TIMEOUT) || 60000
  },

  // 微信支付
  wxPay: {
    mchId: process.env.WX_PAY_MCH_ID || '',
    key: process.env.WX_PAY_KEY || '',
    notifyUrl: process.env.WX_PAY_NOTIFY_URL || ''
  },

  // 限流
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 30
  },

  // 上传限制
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    garmentMaxWidth: 2048,
    modelMaxWidth: 2048
  },

  // 新用户默认额度
  defaultCredits: 10
}
