/**
 * 阿里云 OSS 对象存储服务
 */
const OSS = require('ali-oss')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const config = require('../config')

// 创建 OSS 客户端
const client = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket
})

/**
 * 上传Buffer到OSS
 * @param {Buffer} buffer - 文件Buffer
 * @param {string} type - 类型：garment | model | result
 * @param {string} ext - 文件扩展名
 * @returns {string} 图片访问URL
 */
async function uploadBuffer(buffer, type, ext = '.jpg') {
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const filename = `${type}/${dateStr}/${uuidv4()}${ext}`

  const result = await client.put(filename, buffer, {
    headers: {
      'Content-Type': getContentType(ext)
    }
  })

  // 如果有CDN域名则使用CDN地址
  if (config.oss.cdnDomain) {
    return `${config.oss.cdnDomain}/${filename}`
  }

  return result.url
}

/**
 * 删除OSS文件
 * @param {string} fileUrl - 文件URL
 */
async function deleteFile(fileUrl) {
  try {
    // 从URL中提取文件路径
    const urlObj = new URL(fileUrl)
    const key = urlObj.pathname.slice(1) // 去掉前导/
    await client.delete(key)
  } catch (err) {
    console.error('[OSS] 删除文件失败:', err.message)
  }
}

function getContentType(ext) {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  }
  return map[ext] || 'image/jpeg'
}

module.exports = { uploadBuffer, deleteFile }
