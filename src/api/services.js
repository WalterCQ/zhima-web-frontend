/**
 * 便民服务 API
 */
import { request } from './index'

export const servicesAPI = {
  /**
   * 获取服务列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 服务分类
   * @param {string} params.sort - 排序方式
   * @param {string} params.priceRange - 价格范围
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getServices(params = {}) {
    return request.get('/services', params)
  },

  /**
   * 获取服务详情
   * @param {number|string} id - 服务ID
   */
  getServiceDetail(id) {
    return request.get(`/services/${id}`)
  },

  /**
   * 获取热门服务
   * @param {number} limit - 数量限制
   */
  getHotServices(limit = 20) {
    return request.get('/services/hot', { limit })
  },

  /**
   * 获取热门服务商
   * @param {number} limit - 数量限制
   */
  getTopProviders(limit = 10) {
    return request.get('/services/providers/top', { limit })
  },

  /**
   * 获取服务分类列表
   */
  getServiceCategories() {
    return request.get('/services/categories')
  },

  /**
   * 搜索服务
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.category - 分类筛选
   * @param {string} params.location - 位置筛选
   * @param {string} params.priceRange - 价格范围
   */
  searchServices(params = {}) {
    return request.get('/services/search', params)
  },

  /**
   * 发布服务
   * @param {Object} serviceData - 服务数据
   * @param {string} serviceData.title - 服务标题
   * @param {string} serviceData.description - 服务描述
   * @param {string} serviceData.category - 服务分类
   * @param {number} serviceData.price - 价格
   * @param {string} serviceData.unit - 价格单位
   * @param {Array} serviceData.images - 服务图片
   * @param {Array} serviceData.tags - 服务标签
   * @param {Object} serviceData.contact - 联系方式
   */
  publishService(serviceData) {
    return request.post('/services', serviceData)
  },

  /**
   * 更新服务信息
   * @param {number|string} id - 服务ID
   * @param {Object} serviceData - 更新数据
   */
  updateService(id, serviceData) {
    return request.put(`/services/${id}`, serviceData)
  },

  /**
   * 删除服务
   * @param {number|string} id - 服务ID
   */
  deleteService(id) {
    return request.delete(`/services/${id}`)
  },

  /**
   * 收藏服务
   * @param {number|string} id - 服务ID
   */
  favoriteService(id) {
    return request.post(`/services/${id}/favorite`)
  },

  /**
   * 取消收藏服务
   * @param {number|string} id - 服务ID
   */
  unfavoriteService(id) {
    return request.delete(`/services/${id}/favorite`)
  },

  /**
   * 收藏/取消收藏服务
   * @param {number|string} id - 服务ID
   */
  toggleFavorite(id) {
    return request.post(`/services/${id}/favorite`)
  },

  /**
   * 获取我的收藏服务
   * @param {Object} params - 查询参数
   */
  getFavoriteServices(params = {}) {
    return request.get('/services/favorites', params)
  },

  /**
   * 获取我发布的服务
   * @param {Object} params - 查询参数
   */
  getMyServices(params = {}) {
    return request.get('/services/my', params)
  },

  /**
   * 联系服务商
   * @param {number|string} serviceId - 服务ID
   * @param {Object} contactInfo - 联系信息
   * @param {string} contactInfo.message - 留言
   * @param {string} contactInfo.phone - 联系电话
   */
  contactProvider(serviceId, contactInfo) {
    return request.post(`/services/${serviceId}/contact`, contactInfo)
  },

  /**
   * 获取服务统计信息
   * @param {number|string} id - 服务ID
   */
  getServiceStats(id) {
    return request.get(`/services/${id}/stats`)
  },

  /**
   * 举报服务
   * @param {number|string} id - 服务ID
   * @param {Object} reportData - 举报信息
   * @param {string} reportData.reason - 举报原因
   * @param {string} reportData.description - 详细描述
   */
  reportService(id, reportData) {
    return request.post(`/services/${id}/report`, reportData)
  },

  /**
   * 获取服务评价
   * @param {number|string} id - 服务ID
   * @param {Object} params - 查询参数
   */
  getServiceReviews(id, params = {}) {
    return request.get(`/services/${id}/reviews`, params)
  },

  /**
   * 添加服务评价
   * @param {number|string} id - 服务ID
   * @param {Object} reviewData - 评价数据
   * @param {number} reviewData.rating - 评分 (1-5)
   * @param {string} reviewData.comment - 评价内容
   * @param {Array} reviewData.images - 评价图片
   */
  addServiceReview(id, reviewData) {
    return request.post(`/services/${id}/reviews`, reviewData)
  },

  /**
   * 获取服务商信息
   * @param {number|string} providerId - 服务商ID
   */
  getProviderInfo(providerId) {
    return request.get(`/providers/${providerId}`)
  },

  /**
   * 获取服务商的所有服务
   * @param {number|string} providerId - 服务商ID
   * @param {Object} params - 查询参数
   */
  getProviderServices(providerId, params = {}) {
    return request.get(`/providers/${providerId}/services`, params)
  },

  /**
   * 上传服务图片
   * @param {File} file - 图片文件
   */
  uploadServiceImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    return request.post('/services/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 获取推荐服务
   * @param {Object} params - 查询参数
   * @param {string} params.category - 分类
   * @param {number} params.limit - 数量限制
   */
  getRecommendedServices(params = {}) {
    return request.get('/services/recommended', params)
  },

  /**
   * 获取附近服务
   * @param {Object} params - 位置参数
   * @param {number} params.latitude - 纬度
   * @param {number} params.longitude - 经度
   * @param {number} params.radius - 范围（公里）
   * @param {string} params.category - 分类筛选
   */
  getNearbyServices(params = {}) {
    return request.get('/services/nearby', params)
  }
}

// 导出默认 API 对象
export default servicesAPI