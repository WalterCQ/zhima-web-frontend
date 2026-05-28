/**
 * 二维码状态管理 Store
 * @module stores/qrcode
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { qrcodeAPI } from '@/api/qrcodes'

export const useQRCodeStore = defineStore('qrcode', () => {
  // ==================== 状态 ====================
  
  /** 所有二维码配置 */
  const qrcodes = ref([])
  
  /** 是否正在加载 */
  const loading = ref(false)
  
  /** 是否已加载 */
  const loaded = ref(false)
  
  /** 加载错误信息 */
  const error = ref(null)
  
  /** 缓存时间戳 */
  const cacheTimestamp = ref(0)
  
  /** 缓存过期时间（5分钟） */
  const CACHE_DURATION = 5 * 60 * 1000

  // ==================== 计算属性 ====================
  
  /**
   * 是否缓存已过期
   */
  const isCacheExpired = computed(() => {
    if (!loaded.value) return true
    return Date.now() - cacheTimestamp.value > CACHE_DURATION
  })
  
  /**
   * 按场景分组的二维码
   */
  const qrcodesByScene = computed(() => {
    const grouped = {}
    qrcodes.value.forEach(qr => {
      if (!grouped[qr.scene]) {
        grouped[qr.scene] = []
      }
      grouped[qr.scene].push(qr)
    })
    
    // 按排序字段排序
    Object.keys(grouped).forEach(scene => {
      grouped[scene].sort((a, b) => a.sortOrder - b.sortOrder)
    })
    
    return grouped
  })
  
  /**
   * 按类型索引的二维码
   */
  const qrcodesByType = computed(() => {
    const indexed = {}
    qrcodes.value.forEach(qr => {
      indexed[qr.type] = qr
    })
    return indexed
  })
  
  /**
   * 只包含已启用的二维码
   */
  const enabledQRCodes = computed(() => {
    return qrcodes.value.filter(qr => qr.enabled)
  })

  // ==================== 操作方法 ====================
  
  /**
   * 加载所有二维码配置
   * @param {boolean} forceRefresh - 是否强制刷新
   * @returns {Promise<Array>}
   */
  async function fetchAll(forceRefresh = false) {
    // 如果缓存未过期且不强制刷新，直接返回缓存数据
    if (!forceRefresh && !isCacheExpired.value && qrcodes.value.length > 0) {
      return qrcodes.value
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await qrcodeAPI.getAll({ enabled: true })
      qrcodes.value = response.data || []
      loaded.value = true
      cacheTimestamp.value = Date.now()
      return qrcodes.value
    } catch (err) {
      error.value = err.message || '加载二维码配置失败'
      console.error('[QRCode Store] 加载失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 按场景获取二维码
   * @param {string} scene - 场景标识
   * @returns {Array}
   */
  function getByScene(scene) {
    return qrcodesByScene.value[scene] || []
  }
  
  /**
   * 按类型获取二维码
   * @param {string} type - 二维码类型
   * @returns {Object|null}
   */
  function getByType(type) {
    return qrcodesByType.value[type] || null
  }
  
  /**
   * 按ID获取二维码
   * @param {number} qrcodeId - 二维码ID
   * @returns {Object|null}
   */
  function getById(qrcodeId) {
    return qrcodes.value.find(qr => qr.qrcodeId === qrcodeId) || null
  }
  
  /**
   * 获取页脚二维码（常用）
   * @returns {Array}
   */
  function getFooterQRCodes() {
    return getByScene('footer')
  }
  
  /**
   * 获取顶部导航二维码（常用）
   * @returns {Array}
   */
  function getHeaderQRCodes() {
    return getByScene('header')
  }
  
  /**
   * 获取APP下载二维码
   * @returns {Array}
   */
  function getAppDownloadQRCodes() {
    return getByScene('app-download')
  }
  
  /**
   * 获取iOS APP二维码
   * @returns {Object|null}
   */
  function getIOSAppQRCode() {
    return getByType('app-ios')
  }
  
  /**
   * 获取Android APP二维码
   * @returns {Object|null}
   */
  function getAndroidAppQRCode() {
    return getByType('app-android')
  }
  
  /**
   * 获取微信公众号二维码
   * @returns {Object|null}
   */
  function getWeChatQRCode() {
    return getByType('wechat-official')
  }
  
  /**
   * 获取WhatsApp二维码
   * @returns {Object|null}
   */
  function getWhatsAppQRCode() {
    return getByType('whatsapp')
  }
  
  /**
   * 清除缓存
   */
  function clearCache() {
    qrcodes.value = []
    loaded.value = false
    cacheTimestamp.value = 0
    error.value = null
  }
  
  /**
   * 刷新数据
   * @returns {Promise<Array>}
   */
  async function refresh() {
    return fetchAll(true)
  }

  // ==================== 管理操作（需要管理员权限） ====================
  
  /**
   * 创建二维码配置
   * @param {Object} data - 二维码数据
   * @returns {Promise<Object>}
   */
  async function create(data) {
    try {
      const response = await qrcodeAPI.create(data)
      // 刷新缓存
      await refresh()
      return response.data
    } catch (err) {
      console.error('[QRCode Store] 创建失败:', err)
      throw err
    }
  }
  
  /**
   * 更新二维码配置
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>}
   */
  async function update(qrcodeId, data) {
    try {
      const response = await qrcodeAPI.update(qrcodeId, data)
      // 更新本地缓存
      const index = qrcodes.value.findIndex(qr => qr.qrcodeId === qrcodeId)
      if (index !== -1) {
        qrcodes.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('[QRCode Store] 更新失败:', err)
      throw err
    }
  }
  
  /**
   * 删除二维码配置
   * @param {number} qrcodeId - 二维码ID
   * @returns {Promise<boolean>}
   */
  async function remove(qrcodeId) {
    try {
      const response = await qrcodeAPI.delete(qrcodeId)
      // 从本地缓存中移除
      const index = qrcodes.value.findIndex(qr => qr.qrcodeId === qrcodeId)
      if (index !== -1) {
        qrcodes.value.splice(index, 1)
      }
      return response.data
    } catch (err) {
      console.error('[QRCode Store] 删除失败:', err)
      throw err
    }
  }
  
  /**
   * 批量更新状态
   * @param {Array<number>} qrcodeIds - 二维码ID列表
   * @param {boolean} enabled - 启用状态
   * @returns {Promise<Object>}
   */
  async function batchUpdateStatus(qrcodeIds, enabled) {
    try {
      const response = await qrcodeAPI.batchUpdateStatus(qrcodeIds, enabled)
      // 更新本地缓存
      qrcodes.value.forEach(qr => {
        if (qrcodeIds.includes(qr.qrcodeId)) {
          qr.enabled = enabled
        }
      })
      return response.data
    } catch (err) {
      console.error('[QRCode Store] 批量更新失败:', err)
      throw err
    }
  }

  // ==================== 统计功能 ====================

  /**
   * 记录扫码统计
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} options - 可选参数
   * @returns {Promise<boolean>}
   */
  async function trackScan(qrcodeId, options = {}) {
    try {
      const trackData = {
        userId: options.userId,
        source: options.source || 'web',
        userAgent: navigator.userAgent,
        referer: document.referrer || window.location.href
      }
      
      await qrcodeAPI.track(qrcodeId, trackData)
      
      // 更新本地统计数据
      const qrcode = qrcodes.value.find(qr => qr.qrcodeId === qrcodeId)
      if (qrcode && qrcode.tracking) {
        qrcode.tracking.scanCount = (qrcode.tracking.scanCount || 0) + 1
      }
      
      return true
    } catch (err) {
      console.error('[QRCode Store] 记录扫码统计失败:', err)
      // 统计失败不抛出异常，不影响用户体验
      return false
    }
  }

  /**
   * 获取统计数据
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>}
   */
  async function getStats(qrcodeId, params = {}) {
    try {
      const response = await qrcodeAPI.getStats(qrcodeId, params)
      return response.data
    } catch (err) {
      console.error('[QRCode Store] 获取统计数据失败:', err)
      throw err
    }
  }

  return {
    // 状态
    qrcodes,
    loading,
    loaded,
    error,
    cacheTimestamp,
    
    // 计算属性
    isCacheExpired,
    qrcodesByScene,
    qrcodesByType,
    enabledQRCodes,
    
    // 查询方法
    fetchAll,
    getByScene,
    getByType,
    getById,
    getFooterQRCodes,
    getHeaderQRCodes,
    getAppDownloadQRCodes,
    getIOSAppQRCode,
    getAndroidAppQRCode,
    getWeChatQRCode,
    getWhatsAppQRCode,
    
    // 工具方法
    clearCache,
    refresh,
    
    // 管理方法
    create,
    update,
    remove,
    batchUpdateStatus,
    
    // 统计方法
    trackScan,
    getStats
  }
})

