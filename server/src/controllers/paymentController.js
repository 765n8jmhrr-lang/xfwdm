/**
 * 支付控制器
 */
const { v4: uuidv4 } = require('uuid')
const { User, Order } = require('../models')

// 套餐配置
const PLANS = [
  { id: 1, name: '体验包', credits: 10, price: 9.9, desc: '10次换装' },
  { id: 2, name: '标准包', credits: 50, price: 39.9, desc: '50次换装，送10次' },
  { id: 3, name: '专业包', credits: 200, price: 99.9, desc: '200次换装，送50次' }
]

/**
 * 获取套餐列表
 * GET /api/payment/plans
 */
async function getPlans(req, res) {
  res.json({ code: 0, data: { plans: PLANS } })
}

/**
 * 创建支付订单
 * POST /api/payment/create
 * body: { plan_id }
 */
async function createOrder(req, res, next) {
  try {
    const { plan_id } = req.body
    const plan = PLANS.find(p => p.id === plan_id)

    if (!plan) {
      return res.status(400).json({ code: 400, message: '无效的套餐' })
    }

    // 生成订单号
    const orderNo = `PBB${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    // 创建订单记录
    const order = await Order.create({
      order_no: orderNo,
      user_id: req.user.userId,
      plan_id: plan.id,
      plan_name: plan.name,
      credits: plan.credits,
      amount: plan.price,
      status: 'pending'
    })

    // TODO: 调用微信支付统一下单接口获取 prepay_id
    // const payResult = await wxPayService.unifiedOrder(order, req.user.openid)

    res.json({
      code: 0,
      message: '订单创建成功',
      data: {
        order_no: orderNo,
        amount: plan.price,
        plan_name: plan.name,
        // payment_params: payResult  // 微信支付参数（前端调起支付用）
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 微信支付回调
 * POST /api/payment/notify
 */
async function payNotify(req, res, next) {
  try {
    // TODO: 验证签名、解密通知内容
    const { out_trade_no, transaction_id } = req.body

    const order = await Order.findOne({ where: { order_no: out_trade_no } })
    if (!order || order.status === 'paid') {
      return res.json({ code: 'SUCCESS', message: '成功' })
    }

    // 更新订单状态
    await order.update({
      status: 'paid',
      wx_transaction_id: transaction_id,
      paid_at: new Date()
    })

    // 增加用户额度
    await User.increment('credits', { by: order.credits, where: { id: order.user_id } })

    res.json({ code: 'SUCCESS', message: '成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取订单列表
 * GET /api/payment/orders
 */
async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']],
      limit: 50
    })

    res.json({ code: 0, data: { orders } })
  } catch (err) {
    next(err)
  }
}

module.exports = { getPlans, createOrder, payNotify, getOrders }
