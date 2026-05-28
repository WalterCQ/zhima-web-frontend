# 二维码管理API接口规范设计（链接转二维码方案）

## 目标

基于知马网现有API规范，设计统一的二维码管理API接口，用于动态管理和获取网站所有二维码资源。采用**链接转二维码**的方案，前端使用`qrcode`库动态生成二维码，支持动态统计功能。

## 核心方案

### 1. 数据存储

后端只存储**目标链接**和**配置信息**，不存储二维码图片：

```json
{
  "qrcodeId": 1,
  "targetUrl": "https://mp.weixin.qq.com/s/example",
  "qrConfig": {
    "size": 180,
    "margin": 1,
    "errorCorrectionLevel": "M",
    "color": {
      "dark": "#000000",
      "light": "#FFFFFF"
    }
  },
  "tracking": {
    "enabled": true,
    "scanCount": 1258
  }
}
```

### 2. 前端生成

使用`qrcode`库（轻量级，纯JavaScript）动态生成二维码：

```javascript
import QRCode from 'qrcode'

QRCode.toCanvas(canvas, targetUrl, {
  width: 180,
  margin: 1,
  errorCorrectionLevel: 'M'
})
```

### 3. 统计功能

- 前端扫码后调用统计接口
- 后端记录扫码次数、来源、时间等
- 支持统计数据查询和分析

## API规范概览

**基础路径**: `/api/qrcodes`

**认证方式**: Bearer Token (JWT)

**响应格式**: 统一 `apiResponse` 结构

### 核心接口列表

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/qrcodes | 获取所有二维码 | 公开 |
| GET | /api/qrcodes/type/{type} | 按类型获取 | 公开 |
| GET | /api/qrcodes/scene/{scene} | 按场景获取 | 公开 |
| GET | /api/qrcodes/{id} | 获取单个二维码 | 公开 |
| POST | /api/qrcodes/{id}/track | 记录扫码统计 | 公开 |
| GET | /api/qrcodes/{id}/stats | 获取统计数据 | 管理员 |
| POST | /api/qrcodes | 创建二维码 | 管理员 |
| PUT | /api/qrcodes/{id} | 更新二维码 | 管理员 |
| DELETE | /api/qrcodes/{id} | 删除二维码 | 管理员 |
| PUT | /api/qrcodes/batch/status | 批量更新状态 | 管理员 |

## 数据结构设计

### QRCodeConfig 对象

```typescript
{
  qrcodeId: number,              // 二维码ID
  type: string,                  // 类型：wechat, app-ios, app-android, whatsapp
  scene: string,                 // 场景：header, footer, app-download, share
  title: string,                 // 标题
  description: string,           // 描述文本
  targetUrl: string,             // 目标链接（用于生成二维码）
  platform: string,              // 平台：ios, android, all, web
  enabled: boolean,              // 是否启用
  sortOrder: number,             // 排序（同场景内）
  qrConfig: {                    // 二维码生成配置
    size: number,                // 尺寸
    margin: number,              // 边距
    errorCorrectionLevel: string,// 容错级别：L/M/Q/H
    color: {
      dark: string,              // 前景色
      light: string              // 背景色
    }
  },
  tracking: {                    // 统计配置
    enabled: boolean,            // 是否启用统计
    scanCount: number            // 扫码次数（只读）
  },
  metadata: object,              // 扩展元数据（JSON格式）
  createdAt: string,             // 创建时间
  updatedAt: string              // 更新时间
}
```

### 预定义类型和场景

**type 类型枚举**:

- `wechat-official` - 微信公众号
- `wechat-group` - 微信群
- `app-ios` - iOS APP
- `app-android` - Android APP
- `whatsapp` - WhatsApp
- `telegram` - Telegram
- `line` - Line
- `custom` - 自定义

**scene 场景枚举**:

- `header` - 顶部导航
- `footer` - 页脚
- `app-download` - APP下载
- `contact` - 联系我们
- `share` - 分享
- `article` - 文章内嵌

## 前端集成方案

### 文件结构

```
src/
├── components/
│   └── QRCodeImage.vue         # 二维码生成组件
├── api/
│   └── qrcodes.js              # API封装
├── stores/
│   └── qrcode.js               # Pinia状态管理
├── composables/
│   └── useQRCode.js            # 组合式函数
├── utils/
│   └── qrcode-mock.js          # Mock数据
└── types/
    └── qrcode.d.ts             # TypeScript类型定义
```

### 使用流程

1. 应用启动时，通过Pinia store加载所有二维码配置
2. 组件使用`QRCodeImage.vue`动态生成二维码
3. 用户扫码后，自动调用统计接口
4. 数据自动缓存，减少重复请求

### 组件使用示例

```vue
<template>
  <QRCodeImage 
    :url="qrcode.targetUrl"
    :size="qrcode.qrConfig?.size || 180"
    :tracking-enabled="qrcode.tracking?.enabled"
    :qrcode-id="qrcode.qrcodeId"
    @scanned="handleScanned"
  />
</template>

<script setup>
import { useQRCode } from '@/composables/useQRCode'

const { qrcode } = useWeChatQRCode()

function handleScanned(event) {
  console.log('二维码已扫描:', event)
}
</script>
```

## 后端实现要点

### 数据库表结构

```sql
CREATE TABLE qrcode_configs (
    qrcode_id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    scene VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    target_url VARCHAR(500) NOT NULL,
    platform VARCHAR(20) DEFAULT 'all',
    enabled TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    qr_config JSON,
    tracking_config JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_scene (scene),
    INDEX idx_enabled (enabled)
);

CREATE TABLE qrcode_tracking (
    track_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    qrcode_id INT NOT NULL,
    user_id INT,
    source VARCHAR(50),
    user_agent VARCHAR(500),
    referer VARCHAR(500),
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_qrcode_id (qrcode_id),
    INDEX idx_tracked_at (tracked_at),
    FOREIGN KEY (qrcode_id) REFERENCES qrcode_configs(qrcode_id) ON DELETE CASCADE
);
```

### 权限配置

- 公开接口：所有用户可访问（查询、统计记录）
- 管理接口：需要 `qrcode:manage` 或 `sys:admin` 权限

### 缓存策略

- Redis缓存：5分钟过期
- 更新时自动清除缓存
- 支持按场景批量获取

## 方案优势

### ✅ 相比图片方案的优势

1. **灵活性高**：修改链接即时生效，无需重新生成图片
2. **存储节省**：只存储链接和配置，无需存储大量图片文件
3. **样式可定制**：前端可根据需求自定义颜色、尺寸等
4. **动态统计**：每次扫码可精准统计，支持数据分析
5. **维护简单**：无需管理图片上传、CDN等复杂流程
6. **支持实时更新**：链接变更无需通知客户端更新

### 技术选型：qrcode 库

- ✅ 轻量级（~20KB）
- ✅ 纯JavaScript，无依赖
- ✅ 支持Canvas和SVG
- ✅ 广泛使用，成熟稳定
- ✅ 支持自定义样式

### 不保留错误降级

- 简化实现逻辑
- 减少复杂度
- 统一用户体验
- 如生成失败，显示重试按钮

## 扩展性设计

### Metadata 字段用途

```json
{
  "displayHours": "9:00-18:00",
  "regionRestriction": ["CN", "MY"],
  "abTestGroup": "A",
  "expiresAt": "2025-12-31"
}
```

### 未来功能支持

- 多语言标题/描述
- 地域限制展示
- A/B测试不同链接
- 深度统计和分析
- 定时启用/禁用
- 动态参数注入（用户ID、来源等）

## 实施状态

- ✅ TypeScript类型定义
- ✅ QRCodeImage组件
- ✅ API封装（含统计接口）
- ✅ Pinia Store
- ✅ 组合式函数
- ✅ Mock数据
- ✅ qrcode库安装
- ⏳ 后端API实现（待后端开发）
- ⏳ 统计分析功能（待后端开发）
