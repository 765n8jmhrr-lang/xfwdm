/**
 * 认证路由 - 微信登录
 */
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// POST /api/auth/wxlogin - 微信登录
router.post('/wxlogin', authController.wxLogin)

// POST /api/auth/refresh - 刷新Token
router.post('/refresh', authController.refreshToken)

module.exports = router
