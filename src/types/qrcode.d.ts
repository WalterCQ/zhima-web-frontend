/**
 * 二维码管理 - TypeScript 类型定义
 * @module types/qrcode
 */

/**
 * 二维码类型枚举
 */
export type QRCodeType =
  | 'wechat-official'  // 微信公众号
  | 'wechat-group'     // 微信群
  | 'app-ios'          // iOS APP
  | 'app-android'      // Android APP
  | 'whatsapp'         // WhatsApp
  | 'telegram'         // Telegram
  | 'line'             // Line
  | 'custom'           // 自定义

/**
 * 使用场景枚举
 */
export type QRCodeScene =
  | 'header'           // 顶部导航
  | 'footer'           // 页脚
  | 'app-download'     // APP下载
  | 'contact'          // 联系我们
  | 'share'            // 分享
  | 'article'          // 文章内嵌

/**
 * 目标平台枚举
 */
export type QRCodePlatform =
  | 'ios'              // iOS设备
  | 'android'          // Android设备
  | 'web'              // Web浏览器
  | 'all'              // 所有平台

/**
 * 二维码扩展元数据
 */
export interface QRCodeMetadata {
  /** 显示时间段 */
  displayHours?: string
  /** 地域限制 */
  regionRestriction?: string[]
  /** A/B测试分组 */
  abTestGroup?: string
  /** 是否启用点击追踪 */
  clickTracking?: boolean
  /** 过期时间 */
  expiresAt?: string
  /** 优先级 */
  priority?: 'high' | 'medium' | 'low'
  /** 标签 */
  tags?: string[]
  /** 其他自定义字段 */
  [key: string]: any
}

/**
 * 二维码生成配置
 */
export interface QRCodeGenerationConfig {
  /** 二维码尺寸 */
  size?: number
  /** 边距 */
  margin?: number
  /** 容错级别 */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  /** 颜色配置 */
  color?: {
    /** 前景色 */
    dark?: string
    /** 背景色 */
    light?: string
  }
}

/**
 * 扫码统计配置
 */
export interface QRCodeTrackingConfig {
  /** 是否启用统计 */
  enabled: boolean
  /** 统计接口URL */
  trackingUrl?: string
  /** 扫码次数（只读） */
  scanCount?: number
}

/**
 * 二维码配置对象
 */
export interface QRCodeConfig {
  /** 二维码唯一标识ID */
  qrcodeId: number
  /** 二维码类型 */
  type: QRCodeType
  /** 使用场景 */
  scene: QRCodeScene
  /** 显示标题 */
  title: string
  /** 描述文本 */
  description: string
  /** 目标链接（用于生成二维码） */
  targetUrl: string
  /** 目标平台 */
  platform: QRCodePlatform
  /** 是否启用 */
  enabled: boolean
  /** 排序权重 */
  sortOrder: number
  /** 二维码生成配置 */
  qrConfig?: QRCodeGenerationConfig
  /** 统计配置 */
  tracking?: QRCodeTrackingConfig
  /** 扩展元数据 */
  metadata?: QRCodeMetadata
  /** 创建时间（ISO 8601） */
  createdAt: string
  /** 更新时间（ISO 8601） */
  updatedAt: string
}

/**
 * 创建二维码请求参数
 */
export interface QRCodeCreateRequest {
  /** 二维码类型 */
  type: QRCodeType
  /** 使用场景 */
  scene: QRCodeScene
  /** 显示标题 */
  title: string
  /** 描述文本 */
  description: string
  /** 目标链接 */
  targetUrl: string
  /** 目标平台 */
  platform?: QRCodePlatform
  /** 是否启用 */
  enabled?: boolean
  /** 排序权重 */
  sortOrder?: number
  /** 二维码生成配置 */
  qrConfig?: QRCodeGenerationConfig
  /** 统计配置 */
  tracking?: QRCodeTrackingConfig
  /** 扩展元数据 */
  metadata?: QRCodeMetadata
}

/**
 * 更新二维码请求参数
 */
export interface QRCodeUpdateRequest {
  /** 显示标题 */
  title?: string
  /** 描述文本 */
  description?: string
  /** 目标链接 */
  targetUrl?: string
  /** 目标平台 */
  platform?: QRCodePlatform
  /** 是否启用 */
  enabled?: boolean
  /** 排序权重 */
  sortOrder?: number
  /** 二维码生成配置 */
  qrConfig?: QRCodeGenerationConfig
  /** 统计配置 */
  tracking?: QRCodeTrackingConfig
  /** 扩展元数据 */
  metadata?: QRCodeMetadata
}

/**
 * 批量更新状态请求参数
 */
export interface QRCodeBatchStatusRequest {
  /** 二维码ID列表 */
  qrcodeIds: number[]
  /** 启用状态 */
  enabled: boolean
}

/**
 * 批量更新状态响应
 */
export interface QRCodeBatchStatusResponse {
  /** 更新成功的数量 */
  updatedCount: number
  /** 失败的ID列表 */
  failedIds: number[]
}

/**
 * 获取二维码列表的查询参数
 */
export interface QRCodeListQuery {
  /** 是否只返回启用的 */
  enabled?: boolean
  /** 按场景过滤 */
  scene?: QRCodeScene
}

/**
 * 扫码统计请求参数
 */
export interface QRCodeTrackRequest {
  /** 用户ID（可选） */
  userId?: number
  /** 来源 */
  source: string
  /** 用户代理 */
  userAgent?: string
  /** 来源页面 */
  referer?: string
}

/**
 * API 响应结构
 */
export interface QRCodeAPIResponse<T = any> {
  /** 业务状态 */
  status: 'success' | 'fail' | 'error'
  /** 提示消息 */
  message: string
  /** 返回的数据 */
  data: T
  /** 错误代码 */
  errorCode?: string | null
  /** 调试信息 */
  debugInfo?: string | null
}

