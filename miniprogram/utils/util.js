/**
 * 工具函数
 */

// 格式化时间
function formatTime(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = padZero(d.getMonth() + 1)
  const day = padZero(d.getDate())
  const hour = padZero(d.getHours())
  const minute = padZero(d.getMinutes())
  const second = padZero(d.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = padZero(d.getMonth() + 1)
  const day = padZero(d.getDate())
  return `${year}-${month}-${day}`
}

function padZero(num) {
  return num < 10 ? '0' + num : '' + num
}

// 选择图片（从相册或拍照）
function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: count,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(res) {
        resolve(res.tempFiles.map(f => f.tempFilePath))
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 保存图片到相册
function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' })
        resolve()
      },
      fail(err) {
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success(modalRes) {
              if (modalRes.confirm) {
                wx.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

// 下载网络图片到临时文件
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error('下载失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 显示提示
function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 })
}

// 显示确认弹窗
function showConfirm(title, content) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm)
      }
    })
  })
}

// 节流函数
function throttle(fn, delay = 1000) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      return fn.apply(this, args)
    }
  }
}

module.exports = {
  formatTime,
  formatDate,
  chooseImage,
  saveImageToAlbum,
  downloadImage,
  showToast,
  showConfirm,
  throttle
}
