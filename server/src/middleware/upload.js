/**
 * 文件上传中间件（Multer）
 */
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')

// 内存存储（上传后直接传到OSS，不落盘）
const storage = multer.memoryStorage()

// 文件过滤器
const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的图片格式，请上传 JPG/PNG/WebP 格式'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
    files: 1
  }
})

module.exports = upload
