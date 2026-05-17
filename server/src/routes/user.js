/**
 * 用户路由
 */
const express = require('express')
const router = express.Router()
const { authRequired } = require('../middleware/auth')
const userController = require('../controllers/userController')

// GET /api/user/info - 获取用户信息
router.get('/info', authRequired, userController.getUserInfo)

// GET /api/user/credits - 获取剩余额度
router.get('/credits', authRequired, userController.getCredits)

// PUT /api/user/profile - 更新用户资料
router.put('/profile', authRequired, userController.updateProfile)

module.exports = router
