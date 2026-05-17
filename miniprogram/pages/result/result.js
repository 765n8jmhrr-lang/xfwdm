const util = require('../../utils/util')

Page({
  data: {
    taskId: '',
    garmentImage: '',
    modelImage: '',
    resultImage: '',
    viewMode: 'compare', // compare | result
    createTime: ''
  },

  onLoad(options) {
    const { taskId, garment, model } = options
    this.setData({
      taskId: taskId || '',
      garmentImage: garment ? decodeURIComponent(garment) : '',
      modelImage: model ? decodeURIComponent(model) : '',
      // 模拟结果图片（实际应从后端获取）
      resultImage: model ? decodeURIComponent(model) : '/images/demo-result.png',
      createTime: util.formatTime(new Date())
    })

    // 保存到本地历史
    this.saveToHistory()
  },

  // 切换查看模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ viewMode: mode })
  },

  // 预览大图
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: [this.data.modelImage, this.data.resultImage].filter(Boolean)
    })
  },

  // 保存到相册
  async saveToAlbum() {
    try {
      const filePath = this.data.resultImage
      // 如果是网络图片需要先下载
      if (filePath.startsWith('http')) {
        const tempPath = await util.downloadImage(filePath)
        await util.saveImageToAlbum(tempPath)
      } else {
        await util.saveImageToAlbum(filePath)
      }
    } catch (err) {
      util.showToast('保存失败')
    }
  },

  // 分享
  shareResult() {
    // 触发小程序分享
    util.showToast('请点击右上角"..."分享')
  },

  // 再试一次
  tryAgain() {
    wx.navigateBack()
  },

  // 保存到本地历史记录
  saveToHistory() {
    try {
      const history = wx.getStorageSync('tryonHistory') || []
      const record = {
        taskId: this.data.taskId,
        garmentImage: this.data.garmentImage,
        modelImage: this.data.modelImage,
        resultImage: this.data.resultImage,
        createTime: this.data.createTime,
        timestamp: Date.now()
      }
      history.unshift(record)
      // 最多保留100条
      if (history.length > 100) history.pop()
      wx.setStorageSync('tryonHistory', history)
    } catch (e) {
      console.error('保存历史记录失败', e)
    }
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: '看看我用拍版宝做的AI换装效果！',
      imageUrl: this.data.resultImage,
      path: '/pages/index/index'
    }
  }
})
