/**
 * 支付路由
 */
const express = require('express')
const router = express.Router()
const { authRequired } = require('../middleware/auth')
const paymentController = require('../controllers/paymentController')

// GET /api/payment/plans - 获取套餐列表
router.get('/plans', paymentController.getPlans)

// POST /api/payment/create - 创建支付订单
router.post('/create', authRequired, paymentController.createOrder)

// POST /api/payment/notify - 微信支付回调（无需鉴权）
router.post('/notify', paymentController.payNotify)

// GET /api/payment/orders - 我的订单列表
router.get('/orders', authRequired, paymentController.getOrders)

module.exports = router
