/**
 * 认证控制器
 */
const jwt = require('jsonwebtoken')
const config = require('../config')
const { User } = require('../models')
const wechatService = require('../services/wechatService')

/**
 * 微信登录
 * POST /api/auth/wxlogin
 * body: { code, nickName?, avatarUrl? }
 */
async function wxLogin(req, res, next) {
  try {
    const { code, nickName, avatarUrl } = req.body

    if (!code) {
      return res.status(400).json({ code: 400, message: '缺少登录code' })
    }

    // 1. 使用code换取openid
    const wxRes = await wechatService.code2Session(code)
    const { openid } = wxRes

    // 2. 查找或创建用户
    let user = await User.findOne({ where: { openid } })

    if (!user) {
      // 新用户注册
      user = await User.create({
        openid,
        nickname: nickName || '',
        avatar_url: avatarUrl || '',
        credits: config.defaultCredits,
        last_login_at: new Date()
      })
    } else {
      // 老用户更新登录时间和头像
      const updates = { last_login_at: new Date() }
      if (nickName) updates.nickname = nickName
      if (avatarUrl) updates.avatar_url = avatarUrl
      await user.update(updates)
    }

    // 3. 签发JWT Token
    const token = jwt.sign(
      { userId: user.id, openid: user.openid },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    res.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          userId: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatar_url,
          credits: user.credits,
          totalUsed: user.total_used
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 刷新Token
 * POST /api/auth/refresh
 */
async function refreshToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未提供Token' })
    }

    const oldToken = authHeader.slice(7)
    let decoded

    try {
      decoded = jwt.verify(oldToken, config.jwt.secret, { ignoreExpiration: true })
    } catch (err) {
      return res.status(401).json({ code: 401, message: 'Token无效' })
    }

    // 签发新Token
    const newToken = jwt.sign(
      { userId: decoded.userId, openid: decoded.openid },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    res.json({ code: 0, data: { token: newToken } })
  } catch (err) {
    next(err)
  }
}

module.exports = { wxLogin, refreshToken }
