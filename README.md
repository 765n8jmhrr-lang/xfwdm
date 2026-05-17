# 拍版宝 - AI服装一键换装微信小程序

## 项目简介

**拍版宝**是一款基于AI技术的服装换装微信小程序，类似焦点AI(www.jiaodianai.com)，帮助服装商家、电商卖家、穿搭博主快速生成模特换装效果图。

用户只需上传一张服装图片和一张模特照片，AI即可智能生成逼真的换装效果。

## 核心功能

- **AI一键换装**：上传服装+模特图片，AI智能合成换装效果
- **多种模特选择**：支持自拍/上传真人照片，或使用预设AI模特
- **换装部位选择**：支持上装、下装、全身换装
- **效果对比**：原图与换装效果左右对比查看
- **保存分享**：一键保存到相册或分享到微信
- **历史记录**：所有换装记录自动保存，随时回看

## 技术架构

```
miniprogram/
├── app.js                  # 小程序入口
├── app.json                # 全局配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
├── sitemap.json
├── images/                 # 图片资源
├── utils/
│   ├── api.js              # API接口封装
│   └── util.js             # 工具函数
└── pages/
    ├── index/              # 首页（上传换装）
    │   ├── index.wxml
    │   ├── index.wxss
    │   ├── index.js
    │   └── index.json
    ├── result/             # 换装结果页
    │   ├── result.wxml
    │   ├── result.wxss
    │   ├── result.js
    │   └── result.json
    ├── history/            # 历史记录页
    │   ├── history.wxml
    │   ├── history.wxss
    │   ├── history.js
    │   └── history.json
    └── mine/               # 个人中心
        ├── mine.wxml
        ├── mine.wxss
        ├── mine.js
        └── mine.json
```

## 使用方法

### 1. 导入项目
1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择「导入项目」
3. 选择 `miniprogram` 目录
4. 填入你的 AppID（或使用测试号）

### 2. 配置后端
- 修改 `app.js` 中的 `baseUrl` 为你的后端API地址
- 后端需实现 AI 换装接口（可对接 IDM-VTON、OOTDiffusion 等开源模型，或第三方API）

### 3. 图片资源
请在 `images/` 目录放入以下图片资源：
- `tab-home.png` / `tab-home-active.png` — TabBar换装图标
- `tab-history.png` / `tab-history-active.png` — TabBar记录图标
- `tab-mine.png` / `tab-mine-active.png` — TabBar我的图标
- `icon-camera.png` — 相机图标
- `icon-person.png` — 人物图标
- `icon-empty.png` — 空状态图标
- `default-avatar.png` — 默认头像
- `model-f1.png`, `model-f2.png`, `model-m1.png`, `model-m2.png` — 预设模特图

## 后端API接口说明

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/wxlogin` | POST | 微信登录 |
| `/api/user/info` | GET | 获取用户信息 |
| `/api/user/credits` | GET | 获取剩余额度 |
| `/api/upload` | POST | 上传图片 |
| `/api/tryon/create` | POST | 创建换装任务 |
| `/api/tryon/status` | GET | 查询任务状态 |
| `/api/tryon/result` | GET | 获取换装结果 |
| `/api/tryon/history` | GET | 获取历史记录 |
| `/api/tryon/delete` | POST | 删除记录 |

## 开发计划

- [x] 首页上传UI
- [x] 换装结果展示
- [x] 历史记录管理
- [x] 个人中心
- [ ] 接入真实AI换装API
- [ ] 微信支付充值
- [ ] 批量换装
- [ ] 模特姿势调整
- [ ] 视频换装

## 注意事项

- 当前为前端演示版本，AI换装接口使用模拟数据
- 正式使用需要：
  1. 注册微信小程序并获取 AppID
  2. 部署后端服务并对接 AI 换装模型
  3. 替换 `project.config.json` 中的 appid
  4. 在微信后台配置服务器域名白名单
  5. 准备 TabBar 图标和预设模特图片

## License

MIT
