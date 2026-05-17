/**
 * 图片上传路由
 */
const express = require('express')
const router = express.Router()
const { authRequired } = require('../middleware/auth')
const { uploadLimiter } = require('../middleware/rateLimit')
const upload = require('../middleware/upload')
const uploadController = require('../controllers/uploadController')

// POST /api/upload - 上传图片
router.post('/',
  authRequired,
  uploadLimiter,
  upload.single('file'),
  uploadController.uploadImage
)

module.exports = router
