/**
 * 用户控制器
 */
const { User } = require('../models')

/**
 * 获取用户信息
 * GET /api/user/info
 */
async function getUserInfo(req, res, next) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'nickname', 'avatar_url', 'credits', 'total_used', 'created_at']
    })

    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }

    res.json({
      code: 0,
      data: {
        userId: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatar_url,
        credits: user.credits,
        totalUsed: user.total_used,
        createdAt: user.created_at
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取剩余额度
 * GET /api/user/credits
 */
async function getCredits(req, res, next) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['credits', 'total_used']
    })

    res.json({
      code: 0,
      data: {
        credits: user.credits,
        totalUsed: user.total_used
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 更新用户资料
 * PUT /api/user/profile
 */
async function updateProfile(req, res, next) {
  try {
    const { nickname, avatarUrl } = req.body
    const updates = {}
    if (nickname) updates.nickname = nickname
    if (avatarUrl) updates.avatar_url = avatarUrl

    await User.update(updates, { where: { id: req.user.userId } })
    res.json({ code: 0, message: '更新成功' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getUserInfo, getCredits, updateProfile }
