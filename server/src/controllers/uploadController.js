/**
 * 上传控制器
 */
const sharp = require('sharp')
const path = require('path')
const config = require('../config')
const ossService = require('../services/ossService')

/**
 * 上传图片
 * POST /api/upload
 * form-data: file, type(garment|model)
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '请选择图片' })
    }

    const type = req.body.type || 'garment' // garment or model
    if (!['garment', 'model'].includes(type)) {
      return res.status(400).json({ code: 400, message: '无效的图片类型' })
    }

    // 获取原始文件扩展名
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg'

    // 使用 sharp 处理图片（压缩+限制尺寸）
    const maxWidth = type === 'garment' ? config.upload.garmentMaxWidth : config.upload.modelMaxWidth
    
    let processedBuffer = await sharp(req.file.buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()

    // 上传到 OSS
    const imageUrl = await ossService.uploadBuffer(processedBuffer, type, '.jpg')

    res.json({
      code: 0,
      message: '上传成功',
      data: {
        url: imageUrl,
        type: type,
        size: processedBuffer.length
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { uploadImage }
