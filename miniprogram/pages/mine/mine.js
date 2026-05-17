const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    isLogin: false,
    userInfo: null,
    remainingCredits: 10,
    totalUsed: 0,
    historyCount: 0
  },

  onLoad() {
    this.refreshData()
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const history = wx.getStorageSync('tryonHistory') || []
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      remainingCredits: app.globalData.remainingCredits,
      totalUsed: history.length,
      historyCount: history.length
    })
  },

  // 微信登录
  onLogin() {
    wx.getUserProfile({
      desc: '用于展示用户头像和昵称',
      success: (res) => {
        const userInfo = res.userInfo
        app.globalData.isLogin = true
        app.globalData.userInfo = userInfo
        this.setData({
          isLogin: true,
          userInfo: userInfo
        })

        // 调用后端登录接口
        wx.login({
          success(loginRes) {
            if (loginRes.code) {
              // api.wxLogin(loginRes.code).then(...)
              console.log('登录成功，code:', loginRes.code)
            }
          }
        })
      },
      fail: (err) => {
        console.log('用户拒绝授权', err)
      }
    })
  },

  // 充值
  goRecharge() {
    util.showToast('充值功能开发中')
    // 实际项目中跳转到充值页面
    // wx.navigateTo({ url: '/pages/recharge/recharge' })
  },

  // 联系客服
  contactService() {
    // 使用微信客服
    util.showToast('请通过微信客服联系我们')
  },

  // 使用帮助
  goHelp() {
    util.showToast('使用帮助开发中')
  },

  // 关于我们
  goAbout() {
    util.showToast('拍版宝 v1.0.0')
  },

  // 清除缓存
  async clearCache() {
    const confirmed = await util.showConfirm('清除缓存', '将清除所有本地数据，是否继续？')
    if (!confirmed) return

    wx.clearStorageSync()
    app.globalData.remainingCredits = 10
    this.refreshData()
    util.showToast('缓存已清除')
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '拍版宝 - AI一键换装，让服装展示更轻松',
      path: '/pages/index/index'
    }
  }
})
