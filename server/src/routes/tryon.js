/**
 * 换装任务路由
 */
const express = require('express')
const router = express.Router()
const { authRequired } = require('../middleware/auth')
const { tryonLimiter } = require('../middleware/rateLimit')
const tryonController = require('../controllers/tryonController')

// POST /api/tryon/create - 创建换装任务
router.post('/create', authRequired, tryonLimiter, tryonController.createTask)

// GET /api/tryon/status - 查询任务状态
router.get('/status', authRequired, tryonController.getTaskStatus)

// GET /api/tryon/result - 获取换装结果
router.get('/result', authRequired, tryonController.getTaskResult)

module.exports = router
