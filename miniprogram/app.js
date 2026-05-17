App({
  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      this.globalData.isLogin = false
    }
  },

  globalData: {
    isLogin: false,
    userInfo: null,
    baseUrl: 'https://api.paibanbao.com', // 后端API地址（需替换为实际地址）
    remainingCredits: 10 // 剩余换装次数
  }
})
