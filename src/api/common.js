import { request } from './index'

export const commonAPI = {
  // 全站搜索
  search: (params) => request.get('/search', params),

  // 热搜关键词
  getTrendingKeywords: () => request.get('/search/trending'),

  // 上传图片
  uploadImage: (formData) => request.upload('/upload/image', formData),

  // 上传多张图片
  uploadImages: (formData) => request.upload('/upload/images', formData),

  // 获取系统配置
  getSystemConfig: () => request.get('/system/config'),

  // 举报内容
  reportContent: (data) => request.post('/system/report', data),

  // 获取通知
  getNotifications: (params) => request.get('/notifications', params),

  // 标记通知已读
  markNotificationRead: (id) => request.put(`/notifications/${id}/read`),

  // 获取首页统计数据
  getHomepageStats: () => request.get('/statistics/homepage')
}

// 公开IP服务：通过外部接口获取客户端真实IP
export const ipAPI = {
  // 新接口：仅获取客户端IP信息（服务器环境可得真实IP）
  // 文档：http://duducar.cloud:8888/swagger-ui/index.html#/网络信息/getClientIpOnly
  // 网关会返回 { status, message, data } 结构，由拦截器统一兼容
  getClientIp: () => request.get('http://duducar.cloud:8888/api/network/ip-only', {}, { loading: false })
}

// 兼容历史代码：导出 request，防止其他模块错误从 common.js 引入
export { request }

