/**
 * API服务层 - 拍版宝
 * 所有后端接口调用封装在此
 */

const app = getApp()

// 通用请求方法
function request(url, method, data, showLoading = true) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({ title: '加载中...', mask: true })
    }
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success(res) {
        if (showLoading) wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          app.globalData.isLogin = false
          reject({ code: 401, message: '请重新登录' })
        } else {
          reject(res.data || { message: '请求失败' })
        }
      },
      fail(err) {
        if (showLoading) wx.hideLoading()
        reject({ message: '网络错误，请稍后再试' })
      }
    })
  })
}

// 上传图片
function uploadImage(filePath, type) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '上传中...', mask: true })
    wx.uploadFile({
      url: `${app.globalData.baseUrl}/api/upload`,
      filePath: filePath,
      name: 'file',
      formData: {
        type: type // 'garment' 或 'model'
      },
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success(res) {
        wx.hideLoading()
        const data = JSON.parse(res.data)
        if (res.statusCode === 200) {
          resolve(data)
        } else {
          reject(data)
        }
      },
      fail(err) {
        wx.hideLoading()
        reject({ message: '上传失败' })
      }
    })
  })
}

// ========== 具体接口 ==========

// 微信登录
function wxLogin(code) {
  return request('/api/auth/wxlogin', 'POST', { code })
}

// 获取用户信息
function getUserInfo() {
  return request('/api/user/info', 'GET')
}

// 发起换装任务
function createTryOnTask(garmentImageUrl, modelImageUrl, options = {}) {
  return request('/api/tryon/create', 'POST', {
    garment_image: garmentImageUrl,
    model_image: modelImageUrl,
    category: options.category || 'upper_body', // upper_body, lower_body, full_body
    ...options
  })
}

// 查询换装任务状态
function getTaskStatus(taskId) {
  return request('/api/tryon/status', 'GET', { task_id: taskId }, false)
}

// 获取换装结果
function getTaskResult(taskId) {
  return request('/api/tryon/result', 'GET', { task_id: taskId })
}

// 获取历史记录
function getHistory(page = 1, pageSize = 20) {
  return request('/api/tryon/history', 'GET', { page, page_size: pageSize })
}

// 删除历史记录
function deleteHistory(taskId) {
  return request('/api/tryon/delete', 'POST', { task_id: taskId })
}

// 获取剩余额度
function getCredits() {
  return request('/api/user/credits', 'GET')
}

// ========== 模拟接口（开发调试用）==========

// 模拟换装结果（无后端时使用）
function mockCreateTryOnTask(garmentImage, modelImage) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          task_id: 'task_' + Date.now(),
          status: 'processing',
          estimated_time: 15
        }
      })
    }, 1000)
  })
}

function mockGetTaskResult(taskId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          task_id: taskId,
          status: 'completed',
          result_image: '/images/demo-result.png',
          created_at: new Date().toISOString()
        }
      })
    }, 500)
  })
}

module.exports = {
  request,
  uploadImage,
  wxLogin,
  getUserInfo,
  createTryOnTask,
  getTaskStatus,
  getTaskResult,
  getHistory,
  deleteHistory,
  getCredits,
  // 模拟接口
  mockCreateTryOnTask,
  mockGetTaskResult
}
