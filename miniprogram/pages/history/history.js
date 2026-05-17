const util = require('../../utils/util')

Page({
  data: {
    historyList: [],
    isEmpty: true
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  onPullDownRefresh() {
    this.loadHistory()
    wx.stopPullDownRefresh()
  },

  // 加载本地历史记录
  loadHistory() {
    const history = wx.getStorageSync('tryonHistory') || []
    this.setData({
      historyList: history,
      isEmpty: history.length === 0
    })
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.historyList[index]
    wx.navigateTo({
      url: `/pages/result/result?taskId=${item.taskId}&garment=${encodeURIComponent(item.garmentImage)}&model=${encodeURIComponent(item.modelImage)}`
    })
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },

  // 删除记录
  async deleteRecord(e) {
    const index = e.currentTarget.dataset.index
    const confirmed = await util.showConfirm('确认删除', '删除后无法恢复，是否继续？')
    if (!confirmed) return

    const history = this.data.historyList
    history.splice(index, 1)
    wx.setStorageSync('tryonHistory', history)
    this.setData({
      historyList: history,
      isEmpty: history.length === 0
    })
    util.showToast('删除成功')
  },

  // 清空所有记录
  async clearAll() {
    if (this.data.isEmpty) return
    const confirmed = await util.showConfirm('确认清空', '将删除所有换装记录，是否继续？')
    if (!confirmed) return

    wx.removeStorageSync('tryonHistory')
    this.setData({ historyList: [], isEmpty: true })
    util.showToast('已清空')
  }
})
