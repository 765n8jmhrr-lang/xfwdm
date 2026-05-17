/**
 * AI换装任务队列（BullMQ）
 */
const { Queue, Worker } = require('bullmq')
const config = require('../config')
const { TryonTask, User } = require('../models')
const aiService = require('../services/aiService')

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined
}

// 创建队列
const tryonQueue = new Queue('tryon-tasks', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50
  }
})

/**
 * 添加换装任务到队列
 */
async function addTryonJob(taskData) {
  const job = await tryonQueue.add('process-tryon', taskData, {
    priority: 1,
    jobId: taskData.taskId
  })
  return job
}

/**
 * 创建 Worker 处理换装任务
 */
function startWorker() {
  const worker = new Worker('tryon-tasks', async (job) => {
    const { taskId, garmentUrl, modelUrl, category } = job.data
    console.log(`[Worker] 开始处理任务: ${taskId}`)

    try {
      // 更新状态为 processing
      await TryonTask.update(
        { status: 'processing' },
        { where: { task_id: taskId } }
      )

      // 调用 AI Worker 进行推理
      const resultUrl = await aiService.processVirtualTryOn(garmentUrl, modelUrl, category)

      // 更新任务为完成
      await TryonTask.update(
        {
          status: 'completed',
          result_url: resultUrl,
          completed_at: new Date()
        },
        { where: { task_id: taskId } }
      )

      console.log(`[Worker] 任务完成: ${taskId}`)
      return { resultUrl }

    } catch (err) {
      console.error(`[Worker] 任务失败: ${taskId}`, err.message)

      // 更新任务为失败
      await TryonTask.update(
        {
          status: 'failed',
          error_msg: err.message,
          retry_count: job.attemptsMade
        },
        { where: { task_id: taskId } }
      )

      // 如果是最后一次重试，退还额度
      if (job.attemptsMade >= 3) {
        const task = await TryonTask.findOne({ where: { task_id: taskId } })
        if (task) {
          await User.increment('credits', { by: 1, where: { id: task.user_id } })
          await User.decrement('total_used', { by: 1, where: { id: task.user_id } })
        }
      }

      throw err
    }
  }, {
    connection,
    concurrency: 3, // 并发数
    limiter: { max: 10, duration: 60000 } // 每分钟最多10个
  })

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed:`, err.message)
  })

  return worker
}

module.exports = { tryonQueue, addTryonJob, startWorker }
