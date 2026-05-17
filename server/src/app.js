/**
 * 拍版宝 后端服务入口
 */
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { errorHandler } = require('./middleware/errorHandler')
const config = require('./config')

const app = express()

// ===== 中间件 =====
app.use(helmet())
app.use(cors({
  origin: '*', // 小程序不需要限制CORS origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan(config.isDev ? 'dev' : 'combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ===== 路由 =====
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const uploadRoutes = require('./routes/upload')
const tryonRoutes = require('./routes/tryon')
const paymentRoutes = require('./routes/payment')
const historyRoutes = require('./routes/history')

app.use(`${config.apiPrefix}/auth`, authRoutes)
app.use(`${config.apiPrefix}/user`, userRoutes)
app.use(`${config.apiPrefix}/upload`, uploadRoutes)
app.use(`${config.apiPrefix}/tryon`, tryonRoutes)
app.use(`${config.apiPrefix}/payment`, paymentRoutes)
app.use(`${config.apiPrefix}/history`, historyRoutes)

// ===== 健康检查 =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '1.0.0' })
})

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

// ===== 全局错误处理 =====
app.use(errorHandler)

// ===== 启动服务 =====
const PORT = config.port
app.listen(PORT, () => {
  console.log(`[拍版宝] 服务已启动: http://localhost:${PORT}`)
  console.log(`[拍版宝] 环境: ${config.env}`)
  console.log(`[拍版宝] API前缀: ${config.apiPrefix}`)
})

module.exports = app
