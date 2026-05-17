/**
 * 换装任务控制器
 */
const { v4: uuidv4 } = require('uuid')
const { TryonTask, User } = require('../models')
const { addTryonJob } = require('../queue/tryonQueue')

/**
 * 创建换装任务
 * POST /api/tryon/create
 * body: { garment_image, model_image, category }
 */
async function createTask(req, res, next) {
  try {
    const { garment_image, model_image, category = 'upper_body' } = req.body
    const userId = req.user.userId

    // 参数校验
    if (!garment_image || !model_image) {
      return res.status(400).json({ code: 400, message: '请提供服装图片和模特图片' })
    }

    const validCategories = ['upper_body', 'lower_body', 'full_body']
    if (!validCategories.includes(category)) {
      return res.status(400).json({ code: 400, message: '无效的换装部位' })
    }

    // 检查额度
    const user = await User.findByPk(userId)
    if (!user || user.credits <= 0) {
      return res.status(403).json({ code: 403, message: '换装次数不足，请充值' })
    }

    // 扣减额度（先扣后用，失败退还）
    await user.decrement('credits', { by: 1 })
    await user.increment('total_used', { by: 1 })

    // 创建任务记录
    const taskId = uuidv4()
    const task = await TryonTask.create({
      task_id: taskId,
      user_id: userId,
      garment_url: garment_image,
      model_url: model_image,
      category,
      status: 'pending'
    })

    // 加入队列
    await addTryonJob({
      taskId,
      garmentUrl: garment_image,
      modelUrl: model_image,
      category
    })

    res.json({
      code: 0,
      message: '任务已创建',
      data: {
        task_id: taskId,
        status: 'pending',
        estimated_time: 15 // 预估秒数
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 查询任务状态
 * GET /api/tryon/status?task_id=xxx
 */
async function getTaskStatus(req, res, next) {
  try {
    const { task_id } = req.query
    if (!task_id) {
      return res.status(400).json({ code: 400, message: '缺少task_id参数' })
    }

    const task = await TryonTask.findOne({
      where: { task_id, user_id: req.user.userId }
    })

    if (!task) {
      return res.status(404).json({ code: 404, message: '任务不存在' })
    }

    res.json({
      code: 0,
      data: {
        task_id: task.task_id,
        status: task.status,
        error_msg: task.error_msg,
        result_url: task.result_url,
        created_at: task.created_at,
        completed_at: task.completed_at
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取换装结果
 * GET /api/tryon/result?task_id=xxx
 */
async function getTaskResult(req, res, next) {
  try {
    const { task_id } = req.query
    if (!task_id) {
      return res.status(400).json({ code: 400, message: '缺少task_id参数' })
    }

    const task = await TryonTask.findOne({
      where: { task_id, user_id: req.user.userId }
    })

    if (!task) {
      return res.status(404).json({ code: 404, message: '任务不存在' })
    }

    if (task.status !== 'completed') {
      return res.json({
        code: 0,
        data: { task_id: task.task_id, status: task.status, result_url: null }
      })
    }

    res.json({
      code: 0,
      data: {
        task_id: task.task_id,
        status: 'completed',
        result_url: task.result_url,
        garment_url: task.garment_url,
        model_url: task.model_url,
        category: task.category,
        created_at: task.created_at,
        completed_at: task.completed_at
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { createTask, getTaskStatus, getTaskResult }
