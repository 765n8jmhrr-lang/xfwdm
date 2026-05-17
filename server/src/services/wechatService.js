/**
 * 微信相关服务
 */
const axios = require('axios')
const config = require('../config')

/**
 * 使用code换取openid和session_key
 * @param {string} code - wx.login()获取的code
 * @returns {Object} { openid, session_key }
 */
async function code2Session(code) {
  const url = 'https://api.weixin.qq.com/sns/jscode2session'
  const params = {
    appid: config.wechat.appId,
    secret: config.wechat.appSecret,
    js_code: code,
    grant_type: 'authorization_code'
  }

  const { data } = await axios.get(url, { params })

  if (data.errcode) {
    throw new Error(`微信登录失败: ${data.errmsg} (code: ${data.errcode})`)
  }

  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid || null
  }
}

module.exports = { code2Session }
