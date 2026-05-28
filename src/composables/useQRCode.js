/**
 * 二维码组合式函数
 * @module composables/useQRCode
 */

import { computed, onMounted } from 'vue'
import { useQRCodeStore } from '@/stores/qrcode'
import { storeToRefs } from 'pinia'

/**
 * 使用二维码数据
 * @param {Object} options - 配置选项
 * @param {boolean} [options.autoLoad=true] - 是否自动加载
 * @param {string} [options.scene] - 指定场景，自动过滤
 * @param {string} [options.type] - 指定类型，自动返回
 * @returns {Object} 二维码相关数据和方法
 */
export function useQRCode(options = {}) {
  const { autoLoad = true, scene, type } = options
  
  const qrcodeStore = useQRCodeStore()
  const { qrcodes, loading, loaded, error } = storeToRefs(qrcodeStore)
  
  // 如果指定了场景，返回该场景的二维码
  const filteredQRCodes = computed(() => {
    if (scene) {
      return qrcodeStore.getByScene(scene)
    }
    if (type) {
      const qr = qrcodeStore.getByType(type)
      return qr ? [qr] : []
    }
    return qrcodes.value
  })
  
  // 单个二维码（当指定type时）
  const qrcode = computed(() => {
    if (type) {
      return qrcodeStore.getByType(type)
    }
    return filteredQRCodes.value[0] || null
  })
  
  // 自动加载
  if (autoLoad) {
    onMounted(() => {
      qrcodeStore.fetchAll()
    })
  }
  
  return {
    // 状态
    qrcodes: filteredQRCodes,
    qrcode,
    loading,
    loaded,
    error,
    
    // 方法
    fetch: qrcodeStore.fetchAll,
    refresh: qrcodeStore.refresh,
    getByScene: qrcodeStore.getByScene,
    getByType: qrcodeStore.getByType,
    getById: qrcodeStore.getById,
    trackScan: qrcodeStore.trackScan,
    getStats: qrcodeStore.getStats
  }
}

/**
 * 使用页脚二维码
 * @returns {Object}
 */
export function useFooterQRCodes() {
  return useQRCode({ scene: 'footer' })
}

/**
 * 使用顶部导航二维码
 * @returns {Object}
 */
export function useHeaderQRCodes() {
  return useQRCode({ scene: 'header' })
}

/**
 * 使用APP下载二维码
 * @returns {Object}
 */
export function useAppDownloadQRCodes() {
  return useQRCode({ scene: 'app-download' })
}

/**
 * 使用微信公众号二维码
 * @returns {Object}
 */
export function useWeChatQRCode() {
  return useQRCode({ type: 'wechat-official' })
}

/**
 * 使用iOS APP二维码
 * @returns {Object}
 */
export function useIOSAppQRCode() {
  return useQRCode({ type: 'app-ios' })
}

/**
 * 使用Android APP二维码
 * @returns {Object}
 */
export function useAndroidAppQRCode() {
  return useQRCode({ type: 'app-android' })
}

/**
 * 使用WhatsApp二维码
 * @returns {Object}
 */
export function useWhatsAppQRCode() {
  return useQRCode({ type: 'whatsapp' })
}

/**
 * 二维码工具函数
 */
export const qrcodeUtils = {
  /**
   * 检查二维码是否在有效时间内
   * @param {Object} qrcode - 二维码配置
   * @returns {boolean}
   */
  isInDisplayHours(qrcode) {
    if (!qrcode.metadata?.displayHours) return true
    
    const [start, end] = qrcode.metadata.displayHours.split('-')
    const now = new Date()
    const currentTime = `${now.getHours()}:${now.getMinutes()}`
    
    return currentTime >= start && currentTime <= end
  },
  
  /**
   * 检查二维码是否在允许的地域
   * @param {Object} qrcode - 二维码配置
   * @param {string} region - 当前地域代码
   * @returns {boolean}
   */
  isInAllowedRegion(qrcode, region) {
    if (!qrcode.metadata?.regionRestriction) return true
    return qrcode.metadata.regionRestriction.includes(region)
  },
  
  /**
   * 检查二维码是否已过期
   * @param {Object} qrcode - 二维码配置
   * @returns {boolean}
   */
  isExpired(qrcode) {
    if (!qrcode.metadata?.expiresAt) return false
    return new Date(qrcode.metadata.expiresAt) < new Date()
  },
  
  /**
   * 检查二维码是否应该显示
   * @param {Object} qrcode - 二维码配置
   * @param {Object} context - 上下文信息
   * @param {string} context.region - 当前地域
   * @returns {boolean}
   */
  shouldDisplay(qrcode, context = {}) {
    if (!qrcode.enabled) return false
    if (this.isExpired(qrcode)) return false
    if (!this.isInDisplayHours(qrcode)) return false
    if (context.region && !this.isInAllowedRegion(qrcode, context.region)) return false
    return true
  },

  /**
   * 生成带统计的目标URL
   * @param {Object} qrcode - 二维码配置
   * @param {Object} options - 可选参数
   * @returns {string}
   */
  getTrackedUrl(qrcode, options = {}) {
    if (!qrcode.tracking?.enabled || !qrcode.targetUrl) {
      return qrcode.targetUrl || '#'
    }
    
    // 如果配置了统计URL，使用统计URL作为跳转链接
    const trackingUrl = qrcode.tracking.trackingUrl
    if (trackingUrl) {
      const url = new URL(trackingUrl)
      url.searchParams.set('qrcodeId', qrcode.qrcodeId)
      url.searchParams.set('target', qrcode.targetUrl)
      if (options.source) url.searchParams.set('source', options.source)
      return url.toString()
    }
    
    return qrcode.targetUrl
  }
}

