/**
 * 历史记录控制器
 */
const { TryonTask } = require('../models')
const { Op } = require('sequelize')

/**
 * 获取换装历史列表
 * GET /api/history/list?page=1&page_size=20
 */
async function getList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = Math.min(parseInt(req.query.page_size) || 20, 50)
    const offset = (page - 1) * pageSize

    const { count, rows } = await TryonTask.findAndCountAll({
      where: {
        user_id: req.user.userId,
        is_deleted: 0
      },
      order: [['created_at', 'DESC']],
      offset,
      limit: pageSize,
      attributes: ['task_id', 'garment_url', 'model_url', 'result_url', 'category', 'status', 'created_at', 'completed_at']
    })

    res.json({
      code: 0,
      data: {
        list: rows,
        pagination: {
          page,
          page_size: pageSize,
          total: count,
          total_pages: Math.ceil(count / pageSize)
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取单条记录详情
 * GET /api/history/detail?task_id=xxx
 */
async function getDetail(req, res, next) {
  try {
    const { task_id } = req.query
    if (!task_id) {
      return res.status(400).json({ code: 400, message: '缺少task_id' })
    }

    const task = await TryonTask.findOne({
      where: {
        task_id,
        user_id: req.user.userId,
        is_deleted: 0
      }
    })

    if (!task) {
      return res.status(404).json({ code: 404, message: '记录不存在' })
    }

    res.json({ code: 0, data: task })
  } catch (err) {
    next(err)
  }
}

/**
 * 删除记录（软删除）
 * POST /api/history/delete
 * body: { task_id }
 */
async function deleteRecord(req, res, next) {
  try {
    const { task_id } = req.body
    if (!task_id) {
      return res.status(400).json({ code: 400, message: '缺少task_id' })
    }

    const result = await TryonTask.update(
      { is_deleted: 1 },
      { where: { task_id, user_id: req.user.userId } }
    )

    if (result[0] === 0) {
      return res.status(404).json({ code: 404, message: '记录不存在' })
    }

    res.json({ code: 0, message: '删除成功' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getList, getDetail, deleteRecord }
