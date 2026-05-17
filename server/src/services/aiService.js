/**
 * AI换装推理服务调用
 * 对接 Python FastAPI AI Worker
 */
const axios = require('axios')
const config = require('../config')

/**
 * 调用AI Worker进行虚拟换装
 * @param {string} garmentUrl - 服装图片URL
 * @param {string} modelUrl - 模特图片URL
 * @param {string} category - 换装部位 upper_body/lower_body/full_body
 * @returns {string} 结果图片URL
 */
async function processVirtualTryOn(garmentUrl, modelUrl, category) {
  try {
    const response = await axios.post(
      `${config.aiWorker.url}/api/tryon`,
      {
        garment_image_url: garmentUrl,
        model_image_url: modelUrl,
        category: category
      },
      {
        timeout: config.aiWorker.timeout,
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'AI推理失败')
    }

    return response.data.data.result_url
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('AI服务超时，请稍后重试')
    }
    if (err.response) {
      throw new Error(`AI服务错误: ${err.response.status}`)
    }
    throw err
  }
}

/**
 * 检查AI Worker健康状态
 */
async function healthCheck() {
  try {
    const res = await axios.get(`${config.aiWorker.url}/health`, { timeout: 5000 })
    return res.data.status === 'ok'
  } catch {
    return false
  }
}

module.exports = { processVirtualTryOn, healthCheck }
