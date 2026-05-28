/**
 * 二维码管理 API
 * @module api/qrcodes
 */

import { request } from './index'

/**
 * 二维码 API 封装
 */
export const qrcodeAPI = {
  /**
   * 获取所有二维码配置
   * @param {Object} params - 查询参数
   * @param {boolean} [params.enabled=true] - 是否只返回启用的二维码
   * @param {string} [params.scene] - 按场景过滤
   * @returns {Promise<Array>} 二维码配置列表
   */
  getAll: (params = {}) => {
    return request.get('/qrcodes', params, { loading: false })
  },

  /**
   * 按类型获取二维码
   * @param {string} type - 二维码类型
   * @returns {Promise<Object>} 二维码配置对象
   */
  getByType: (type) => {
    return request.get(`/qrcodes/type/${type}`, {}, { loading: false })
  },

  /**
   * 按场景获取二维码组
   * @param {string} scene - 场景标识
   * @returns {Promise<Array>} 二维码配置列表
   */
  getByScene: (scene) => {
    return request.get(`/qrcodes/scene/${scene}`, {}, { loading: false })
  },

  /**
   * 获取单个二维码详情
   * @param {number} qrcodeId - 二维码ID
   * @returns {Promise<Object>} 二维码配置对象
   */
  getById: (qrcodeId) => {
    return request.get(`/qrcodes/${qrcodeId}`, {}, { loading: false })
  },

  /**
   * 创建二维码配置（需要管理员权限）
   * @param {Object} data - 二维码配置数据
   * @returns {Promise<Object>} 创建的二维码配置
   */
  create: (data) => {
    return request.post('/qrcodes', data)
  },

  /**
   * 更新二维码配置（需要管理员权限）
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} data - 更新的数据
   * @returns {Promise<Object>} 更新后的二维码配置
   */
  update: (qrcodeId, data) => {
    return request.put(`/qrcodes/${qrcodeId}`, data)
  },

  /**
   * 删除二维码配置（需要管理员权限）
   * @param {number} qrcodeId - 二维码ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  delete: (qrcodeId) => {
    return request.delete(`/qrcodes/${qrcodeId}`)
  },

  /**
   * 批量更新二维码状态（需要管理员权限）
   * @param {Array<number>} qrcodeIds - 二维码ID列表
   * @param {boolean} enabled - 启用状态
   * @returns {Promise<Object>} 批量更新结果
   */
  batchUpdateStatus: (qrcodeIds, enabled) => {
    return request.put('/qrcodes/batch/status', { qrcodeIds, enabled })
  },

  /**
   * 记录扫码统计（公开接口）
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} data - 统计数据
   * @param {number} data.userId - 用户ID（可选）
   * @param {string} data.source - 来源
   * @param {string} data.userAgent - 用户代理
   * @param {string} data.referer - 来源页面
   * @returns {Promise<Object>} 统计结果
   */
  track: (qrcodeId, data) => {
    return request.post(`/qrcodes/${qrcodeId}/track`, data, { loading: false })
  },

  /**
   * 获取二维码统计数据（需要管理员权限）
   * @param {number} qrcodeId - 二维码ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 统计数据
   */
  getStats: (qrcodeId, params = {}) => {
    return request.get(`/qrcodes/${qrcodeId}/stats`, params)
  }
}

/**
 * 二维码类型常量
 */
export const QRCODE_TYPES = {
  WECHAT_OFFICIAL: 'wechat-official',
  WECHAT_GROUP: 'wechat-group',
  APP_IOS: 'app-ios',
  APP_ANDROID: 'app-android',
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  LINE: 'line',
  CUSTOM: 'custom'
}

/**
 * 二维码场景常量
 */
export const QRCODE_SCENES = {
  HEADER: 'header',
  FOOTER: 'footer',
  APP_DOWNLOAD: 'app-download',
  CONTACT: 'contact',
  SHARE: 'share',
  ARTICLE: 'article'
}

/**
 * 二维码平台常量
 */
export const QRCODE_PLATFORMS = {
  IOS: 'ios',
  ANDROID: 'android',
  WEB: 'web',
  ALL: 'all'
}

export default qrcodeAPI

