const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    garmentImage: '',      // 服装图片本地路径
    modelImage: '',        // 模特图片本地路径
    garmentUrl: '',        // 服装图片上传后的URL
    modelUrl: '',          // 模特图片上传后的URL
    category: 'upper_body', // 换装部位
    isProcessing: false,   // 是否正在处理
    estimatedTime: 15,     // 预计时间
    progress: 0,           // 进度
    remainingCredits: 10,  // 剩余次数
    presetModels: [
      { id: 1, name: '女模A', image: '/images/model-f1.png' },
      { id: 2, name: '女模B', image: '/images/model-f2.png' },
      { id: 3, name: '男模A', image: '/images/model-m1.png' },
      { id: 4, name: '男模B', image: '/images/model-m2.png' }
    ]
  },

  onLoad() {
    this.setData({
      remainingCredits: app.globalData.remainingCredits
    })
  },

  onShow() {
    // 每次显示时刷新额度
    this.setData({
      remainingCredits: app.globalData.remainingCredits
    })
  },

  // 选择服装图片
  async chooseGarment() {
    try {
      const paths = await util.chooseImage(1)
      if (paths && paths.length > 0) {
        this.setData({ garmentImage: paths[0] })
      }
    } catch (e) {
      console.log('用户取消选择')
    }
  },

  // 选择模特图片
  async chooseModel() {
    try {
      const paths = await util.chooseImage(1)
      if (paths && paths.length > 0) {
        this.setData({ modelImage: paths[0] })
      }
    } catch (e) {
      console.log('用户取消选择')
    }
  },

  // 选择预设模特
  selectPresetModel(e) {
    const index = e.currentTarget.dataset.index
    const model = this.data.presetModels[index]
    this.setData({ modelImage: model.image })
  },

  // 选择换装部位
  selectCategory(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ category: value })
  },

  // 开始换装
  async startTryOn() {
    if (!this.data.garmentImage || !this.data.modelImage) {
      util.showToast('请先选择服装和模特图片')
      return
    }

    if (this.data.remainingCredits <= 0) {
      util.showToast('换装次数已用完，请充值')
      return
    }

    this.setData({ isProcessing: true, progress: 0 })

    // 模拟进度
    this.progressTimer = setInterval(() => {
      let progress = this.data.progress
      if (progress < 90) {
        progress += Math.random() * 10 + 3
        if (progress > 90) progress = 90
        this.setData({ progress })
      }
    }, 1000)

    try {
      // 1. 上传服装图片
      // 实际项目中应该调用 api.uploadImage
      // const garmentRes = await api.uploadImage(this.data.garmentImage, 'garment')
      // const modelRes = await api.uploadImage(this.data.modelImage, 'model')
      
      // 2. 发起换装任务（这里用模拟接口）
      const taskRes = await api.mockCreateTryOnTask(
        this.data.garmentImage,
        this.data.modelImage
      )

      const taskId = taskRes.data.task_id

      // 3. 轮询等待结果（模拟）
      await this.waitForResult(taskId)

      // 4. 完成
      this.setData({ progress: 100 })

      clearInterval(this.progressTimer)

      // 扣减额度
      app.globalData.remainingCredits -= 1
      this.setData({ 
        remainingCredits: app.globalData.remainingCredits,
        isProcessing: false 
      })

      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?taskId=${taskId}&garment=${encodeURIComponent(this.data.garmentImage)}&model=${encodeURIComponent(this.data.modelImage)}`
      })

    } catch (err) {
      clearInterval(this.progressTimer)
      this.setData({ isProcessing: false, progress: 0 })
      util.showToast(err.message || '换装失败，请重试')
    }
  },

  // 等待结果（模拟轮询）
  waitForResult(taskId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })
  },

  onUnload() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
    }
  }
})
