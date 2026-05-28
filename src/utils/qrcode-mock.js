/**
 * 二维码 Mock 数据
 * 用于开发环境测试，后端API未实现前使用
 */

export const mockQRCodes = [
  // 页脚二维码
  {
    qrcodeId: 1,
    type: 'wechat-official',
    scene: 'footer',
    title: '微信公众号',
    description: '扫码关注我们的公众号，获取最新资讯',
    targetUrl: 'https://mp.weixin.qq.com/s/example-wechat-article',
    platform: 'all',
    enabled: true,
    sortOrder: 1,
    qrConfig: {
      size: 180,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    },
    tracking: {
      enabled: true,
      scanCount: 1258
    },
    metadata: {
      clickTracking: true,
      tags: ['social', 'wechat']
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  {
    qrcodeId: 2,
    type: 'app-ios',
    scene: 'footer',
    title: 'iPhone APP',
    description: '手机扫码下载iOS版',
    targetUrl: 'https://apps.apple.com/cn/app/zhimawang/id123456789',
    platform: 'ios',
    enabled: true,
    sortOrder: 2,
    qrConfig: {
      size: 200,
      margin: 2,
      errorCorrectionLevel: 'H'
    },
    tracking: {
      enabled: true,
      scanCount: 856
    },
    metadata: {
      priority: 'high'
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  {
    qrcodeId: 3,
    type: 'app-android',
    scene: 'footer',
    title: 'Android APP',
    description: '手机扫码下载Android版',
    targetUrl: 'https://play.google.com/store/apps/details?id=com.zhimawang.app',
    platform: 'android',
    enabled: true,
    sortOrder: 3,
    qrConfig: {
      size: 200,
      margin: 2,
      errorCorrectionLevel: 'H'
    },
    tracking: {
      enabled: true,
      scanCount: 1425
    },
    metadata: {
      priority: 'high'
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  
  // 顶部导航二维码
  {
    qrcodeId: 4,
    type: 'whatsapp',
    scene: 'header',
    title: 'WhatsApp咨询',
    description: '扫码添加WhatsApp咨询',
    targetUrl: 'https://wa.me/60123456789?text=你好，我想咨询一下',
    platform: 'all',
    enabled: true,
    sortOrder: 1,
    qrConfig: {
      size: 180,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#25D366',
        light: '#FFFFFF'
      }
    },
    tracking: {
      enabled: true,
      scanCount: 643
    },
    metadata: {
      displayHours: '9:00-18:00',
      clickTracking: true
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  {
    qrcodeId: 5,
    type: 'telegram',
    scene: 'header',
    title: 'Telegram频道',
    description: '加入我们的Telegram频道',
    targetUrl: 'https://t.me/zhimawang_channel',
    platform: 'all',
    enabled: true,
    sortOrder: 2,
    qrConfig: {
      size: 180,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0088cc',
        light: '#FFFFFF'
      }
    },
    tracking: {
      enabled: true,
      scanCount: 342
    },
    metadata: {},
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  
  // APP下载场景
  {
    qrcodeId: 6,
    type: 'app-ios',
    scene: 'app-download',
    title: 'iPhone版下载',
    description: '适用于iPhone和iPad',
    targetUrl: 'https://apps.apple.com/cn/app/zhimawang/id123456789',
    platform: 'ios',
    enabled: true,
    sortOrder: 1,
    qrConfig: {
      size: 200,
      margin: 2,
      errorCorrectionLevel: 'H'
    },
    tracking: {
      enabled: true,
      scanCount: 2314
    },
    metadata: {
      minVersion: '12.0',
      fileSize: '45.6MB'
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },
  {
    qrcodeId: 7,
    type: 'app-android',
    scene: 'app-download',
    title: 'Android版下载',
    description: '适用于Android 5.0及以上',
    targetUrl: 'https://play.google.com/store/apps/details?id=com.zhimawang.app',
    platform: 'android',
    enabled: true,
    sortOrder: 2,
    qrConfig: {
      size: 200,
      margin: 2,
      errorCorrectionLevel: 'H'
    },
    tracking: {
      enabled: true,
      scanCount: 3127
    },
    metadata: {
      minVersion: '5.0',
      fileSize: '38.2MB'
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  },

  // 联系我们场景
  {
    qrcodeId: 8,
    type: 'custom',
    scene: 'contact',
    title: '在线客服',
    description: '扫码进入在线客服中心',
    targetUrl: 'https://www.zhimawang.com/customer-service',
    platform: 'web',
    enabled: true,
    sortOrder: 1,
    qrConfig: {
      size: 180,
      margin: 1,
      errorCorrectionLevel: 'M'
    },
    tracking: {
      enabled: true,
      scanCount: 523
    },
    metadata: {
      displayHours: '9:00-18:00'
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-14T08:30:00Z'
  }
]

/**
 * Mock API 响应生成器
 */
export const mockQRCodeAPI = {
  /**
   * 获取所有二维码
   */
  getAll: (params = {}) => {
    let result = [...mockQRCodes]
    
    // 过滤启用状态
    if (params.enabled !== undefined) {
      result = result.filter(qr => qr.enabled === params.enabled)
    }
    
    // 按场景过滤
    if (params.scene) {
      result = result.filter(qr => qr.scene === params.scene)
    }
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '获取成功',
        data: result,
        errorCode: null,
        debugInfo: null
      }
    })
  },
  
  /**
   * 按类型获取
   */
  getByType: (type) => {
    const qrcode = mockQRCodes.find(qr => qr.type === type)
    
    if (!qrcode) {
      return Promise.reject({
        response: {
          status: 404,
          data: {
            status: 'fail',
            message: '二维码不存在',
            errorCode: 'QRCODE_NOT_FOUND'
          }
        }
      })
    }
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '获取成功',
        data: qrcode,
        errorCode: null
      }
    })
  },
  
  /**
   * 按场景获取
   */
  getByScene: (scene) => {
    const qrcodes = mockQRCodes.filter(qr => qr.scene === scene && qr.enabled)
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '获取成功',
        data: qrcodes,
        errorCode: null
      }
    })
  },
  
  /**
   * 按ID获取
   */
  getById: (qrcodeId) => {
    const qrcode = mockQRCodes.find(qr => qr.qrcodeId === qrcodeId)
    
    if (!qrcode) {
      return Promise.reject({
        response: {
          status: 404,
          data: {
            status: 'fail',
            message: '二维码不存在',
            errorCode: 'QRCODE_NOT_FOUND'
          }
        }
      })
    }
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '获取成功',
        data: qrcode,
        errorCode: null
      }
    })
  },

  /**
   * 记录扫码统计
   */
  track: (qrcodeId, data) => {
    console.log(`[Mock] 记录扫码统计: qrcodeId=${qrcodeId}`, data)
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '统计记录成功',
        data: { recorded: true },
        errorCode: null
      }
    })
  },

  /**
   * 获取统计数据
   */
  getStats: (qrcodeId) => {
    const qrcode = mockQRCodes.find(qr => qr.qrcodeId === qrcodeId)
    
    if (!qrcode) {
      return Promise.reject({
        response: {
          status: 404,
          data: {
            status: 'fail',
            message: '二维码不存在',
            errorCode: 'QRCODE_NOT_FOUND'
          }
        }
      })
    }
    
    return Promise.resolve({
      data: {
        status: 'success',
        message: '获取成功',
        data: {
          qrcodeId,
          totalScans: qrcode.tracking?.scanCount || 0,
          todayScans: Math.floor(Math.random() * 100),
          weekScans: Math.floor(Math.random() * 500),
          monthScans: Math.floor(Math.random() * 2000)
        },
        errorCode: null
      }
    })
  }
}

/**
 * 启用 Mock 模式
 * 在 main.js 中调用此函数来启用 Mock 数据
 */
export function enableQRCodeMock() {
  if (import.meta.env.DEV) {
    console.log('[QRCode Mock] Mock 模式已启用')
    // 可以在这里拦截 API 请求，返回 Mock 数据
    // 或使用 MSW (Mock Service Worker) 等工具
  }
}
