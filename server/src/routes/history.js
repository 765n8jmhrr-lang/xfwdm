/**
 * 历史记录路由
 */
const express = require('express')
const router = express.Router()
const { authRequired } = require('../middleware/auth')
const historyController = require('../controllers/historyController')

// GET /api/history/list - 获取换装历史
router.get('/list', authRequired, historyController.getList)

// GET /api/history/detail - 获取单条记录
router.get('/detail', authRequired, historyController.getDetail)

// POST /api/history/delete - 删除记录
router.post('/delete', authRequired, historyController.deleteRecord)

module.exports = router
