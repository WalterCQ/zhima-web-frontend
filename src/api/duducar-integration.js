/**
 * 知马网 API 集成模块
 * Base URL: http://duducar.cloud:8888
 * 
 * 这个文件整合了所有来自 duducar.cloud 的 API 接口
 * 用于替代或补充现有的模拟 API
 */

import axios from 'axios'

// =====================================================
// 创建专用的 axios 实例
// =====================================================
const duducarClient = axios.create({
  baseURL: 'http://duducar.cloud:8888',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// =====================================================
// 请求拦截器 - 自动添加 JWT Token
// =====================================================
duducarClient.interceptors.request.use(
  config => {
    // 兼容多种存储键：优先 access_token，其次 zhimawang_token
    const token = sessionStorage.getItem('access_token') || sessionStorage.getItem('zhimawang_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// =====================================================
// 响应拦截器 - 统一错误处理
// =====================================================
duducarClient.interceptors.response.use(
  response => {
    // 统一的响应格式处理
    const { status, message, data, errorCode } = response.data
    
    if (status === 'success') {
      return { success: true, data, message }
    } else {
      return Promise.reject({ 
        success: false, 
        message, 
        errorCode,
        data 
      })
    }
  },
  error => {
    console.error('API 请求失败:', error)
    
    // 处理 401 未授权
    if (error.response?.status === 401) {
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      sessionStorage.removeItem('zhimawang_token')
      sessionStorage.removeItem('zhimawang_refresh_token')
      window.location.href = '/auth/login'
    }
    
    return Promise.reject(error)
  }
)

// =====================================================
// 1. 用户管理 API
// =====================================================
export const userAPI = {
  /**
   * 发送短信验证码
   * @param {Object} data - { phone, type: 'register'|'login'|'verify' }
   */
  sendSms: (data) => duducarClient.post('/api/user/send-sms', data),

  /**
   * 用户注册
   * @param {Object} data - { phone, code }
   */
  register: (data) => duducarClient.post('/api/user/register', data),

  /**
   * 用户登录
   * @param {Object} data - { type: 'password'|'sms', phone, identifier }
   */
  login: (data) => duducarClient.post('/api/user/login', data),

  /**
   * 刷新 Token
   * @param {Object} data - { refreshToken }
   */
  refreshToken: (data) => duducarClient.post('/api/user/refresh', data),

  /**
   * 获取当前用户信息
   */
  getUserInfo: () => duducarClient.get('/api/user/info'),

  /**
   * 检查手机号是否可用
   * @param {string} phone - 手机号
   */
  checkPhone: (phone) => duducarClient.get('/api/user/check-phone', { params: { phone } }),

  /**
   * 修改密码
   * @param {Object} params - { phone, verificationCode, newPassword }
   */
  changePassword: (params) => duducarClient.post('/api/user/change-password', null, { params }),

  /**
   * 获取活跃会话列表
   */
  getActiveSessions: () => duducarClient.get('/api/user/sessions'),

  /**
   * 退出登录
   */
  logout: () => duducarClient.post('/api/user/logout'),

  /**
   * 登出其他设备
   */
  logoutOthers: () => duducarClient.post('/api/user/logout-others'),

  /**
   * 登出所有设备
   */
  logoutAll: () => duducarClient.post('/api/user/logout-all'),

  /**
   * 账号注销
   */
  deleteAccount: () => duducarClient.post('/api/user/delete-account'),

  /**
   * 获取用户权限信息
   */
  getUserPermissions: () => duducarClient.get('/api/user/permissions/sections'),

  /**
   * 更新用户资料
   * @param {Object} data - 用户资料数据
   */
  updateProfile: (data) => duducarClient.put('/api/user/profile', data),

  /**
   * 上传用户头像
   * @param {FormData} formData - 包含头像文件的表单数据
   */
  uploadAvatar: (formData) => duducarClient.post('/api/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /**
   * 上传用户封面
   * @param {FormData} formData - 包含封面文件的表单数据
   */
  uploadCover: (formData) => duducarClient.post('/api/user/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// =====================================================
// 2. 文章管理 API
// =====================================================
export const articleAPI = {
  /**
   * 获取文章列表
   * @param {Object} params - { pageId, channelId, limit, offset, randomSeed }
   */
  getArticles: (params) => duducarClient.get('/api/articles', { params }),

  /**
   * 获取文章详情
   * @param {number} articleId - 文章ID
   */
  getArticleDetail: (articleId) => duducarClient.get(`/api/articles/${articleId}`),

  /**
   * 发布文章（新版）
   * @param {FormData} formData - 文章数据
   */
  publishArticle: (formData) => duducarClient.post('/api/articles/publish', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /**
   * 发布文章（旧版）
   * @param {Object} data - 文章数据
   */
  publishArticleLegacy: (data) => duducarClient.post('/api/articles/publish/legacy', data),

  /**
   * 更新文章
   * @param {number} articleId - 文章ID
   * @param {Object} data - 更新数据
   */
  updateArticle: (articleId, data) => duducarClient.put(`/api/articles/${articleId}`, data),

  /**
   * 删除文章
   * @param {number} articleId - 文章ID
   */
  deleteArticle: (articleId) => duducarClient.delete(`/api/articles/${articleId}`),

  /**
   * 获取频道列表
   * @param {number} pageId - 页面类型ID
   */
  getChannels: (pageId) => duducarClient.get('/api/articles/channels', { params: { pageId } }),

  /**
   * 生成随机种子
   */
  generateRandomSeed: () => duducarClient.get('/api/articles/random-seed'),
}

// =====================================================
// 3. 文章评论 API
// =====================================================
export const commentAPI = {
  /**
   * 获取文章评论列表
   * @param {number} articleId - 文章ID
   * @param {Object} params - { limit, offset }
   */
  getComments: (articleId, params) => duducarClient.get(`/api/articles/${articleId}/comments`, { params }),

  /**
   * 添加根评论
   * @param {number} articleId - 文章ID
   * @param {number} userId - 用户ID
   * @param {string} text - 评论内容
   */
  addRootComment: (articleId, userId, text) => duducarClient.post(`/api/articles/${articleId}/comments`, null, { 
    params: { userId, text } 
  }),

  /**
   * 添加回复评论
   * @param {number} articleId - 文章ID
   * @param {number} userId - 用户ID
   * @param {number} parentId - 父评论ID
   * @param {string} text - 回复内容
   */
  addReplyComment: (articleId, userId, parentId, text) => duducarClient.post(`/api/articles/${articleId}/comments/reply`, null, { 
    params: { userId, parentId, text } 
  }),
}

// =====================================================
// 4. 文章浏览量 API
// =====================================================
export const articleViewAPI = {
  /**
   * 记录文章浏览量
   * @param {number} articleId - 文章ID
   * @param {Object} headers - { 'X-User-Id', 'X-Session-Id' }
   */
  hitView: (articleId, headers = {}) => duducarClient.post(`/api/articles/${articleId}/views/hit`, null, { headers }),

  /**
   * 获取文章浏览量
   * @param {number} articleId - 文章ID
   */
  getViewCount: (articleId) => duducarClient.get(`/api/articles/${articleId}/views`),

  /**
   * 设置浏览量初始值（管理员）
   * @param {number} articleId - 文章ID
   * @param {number} initial - 初始浏览量
   */
  setInitialView: (articleId, initial) => duducarClient.post(`/api/articles/${articleId}/views/init`, null, {
    params: { initial }
  }),

  /**
   * 调整浏览量（管理员）
   * @param {number} articleId - 文章ID
   * @param {number} delta - 增量
   */
  adjustView: (articleId, delta) => duducarClient.post(`/api/articles/${articleId}/views/incr`, null, {
    params: { delta }
  }),
}

// =====================================================
// 5. 点赞功能 API
// =====================================================
export const likeAPI = {
  /**
   * 点赞/取消点赞
   * @param {number} articleId - 文章ID
   */
  toggleLike: (articleId) => duducarClient.post('/api/feed/like', null, { params: { articleId } }),

  /**
   * 获取文章点赞数
   * @param {number} articleId - 文章ID
   */
  getLikeCount: (articleId) => duducarClient.get('/api/feed/like-count', { params: { articleId } }),
}

// =====================================================
// 6. 用户关注 API
// =====================================================
export const followAPI = {
  /**
   * 关注用户
   * @param {number} targetId - 目标用户ID
   */
  follow: (targetId) => duducarClient.post(`/api/users/${targetId}/follow`),

  /**
   * 取消关注
   * @param {number} targetId - 目标用户ID
   */
  unfollow: (targetId) => duducarClient.post(`/api/users/${targetId}/unfollow`),

  /**
   * 检查关注状态
   * @param {number} targetId - 目标用户ID
   */
  isFollowing: (targetId) => duducarClient.get(`/api/users/${targetId}/is-following`),

  /**
   * 获取互相关注状态
   * @param {number} targetUserId - 目标用户ID
   */
  getMutualFollowStatus: (targetUserId) => duducarClient.get(`/api/users/${targetUserId}/mutual-follow-status`),

  /**
   * 获取关注列表
   * @param {number} userId - 用户ID
   * @param {Object} params - { cursorTime, cursorId, limit }
   */
  getFollowing: (userId, params) => duducarClient.get(`/api/users/${userId}/following`, { params }),

  /**
   * 获取粉丝列表
   * @param {number} userId - 用户ID
   * @param {Object} params - { cursorTime, cursorId, limit }
   */
  getFollowers: (userId, params) => duducarClient.get(`/api/users/${userId}/followers`, { params }),

  /**
   * 获取关注统计
   * @param {number} userId - 用户ID
   */
  getFollowCounts: (userId) => duducarClient.get(`/api/users/${userId}/follow-counts`),
}

// =====================================================
// 7. 论坛主题管理 API
// =====================================================
export const forumAPI = {
  /**
   * 创建新帖子
   * @param {number} channelId - 频道ID
   * @param {Object} data - { title, content, writer, publish }
   */
  createTopic: (channelId, data) => duducarClient.post(`/api/channels/${channelId}/topics`, data),

  /**
   * 置顶帖子
   * @param {number} channelId - 频道ID
   * @param {number} articleId - 帖子ID
   */
  pinTopic: (channelId, articleId) => duducarClient.post(`/api/channels/${channelId}/topics/${articleId}/pin`),

  /**
   * 取消置顶帖子
   * @param {number} channelId - 频道ID
   * @param {number} articleId - 帖子ID
   */
  unpinTopic: (channelId, articleId) => duducarClient.post(`/api/channels/${channelId}/topics/${articleId}/unpin`),
}

// =====================================================
// 8. 企业认证 API
// =====================================================
export const companyAPI = {
  /**
   * 分页查询企业列表
   * @param {Object} params - { pageNum, pageSize, verificationStatus, status }
   */
  getCompanyList: (params) => duducarClient.get('/api/companies', { params }),

  /**
   * 创建企业认证
   * @param {Object} data - 企业信息
   */
  createCompany: (data) => duducarClient.post('/api/companies', data),

  /**
   * 获取企业详情
   * @param {number} companyId - 企业ID
   */
  getCompanyById: (companyId) => duducarClient.get(`/api/companies/${companyId}`),

  /**
   * 获取用户企业信息
   * @param {number} userId - 用户ID
   */
  getCompanyByUserId: (userId) => duducarClient.get(`/api/companies/user/${userId}`),

  /**
   * 更新企业信息
   * @param {number} companyId - 企业ID
   * @param {Object} data - 企业信息
   */
  updateCompany: (companyId, data) => duducarClient.put(`/api/companies/${companyId}`, data),

  /**
   * 删除企业
   * @param {number} companyId - 企业ID
   */
  deleteCompany: (companyId) => duducarClient.delete(`/api/companies/${companyId}`),

  /**
   * 企业认证审核（管理员）
   * @param {number} companyId - 企业ID
   * @param {number} verificationStatus - 认证状态
   */
  verifyCompany: (companyId, verificationStatus) => duducarClient.put(`/api/companies/${companyId}/verify`, null, {
    params: { verificationStatus }
  }),

  /**
   * 检查企业名称
   * @param {string} companyName - 企业名称
   * @param {number} excludeId - 排除的企业ID
   */
  checkCompanyName: (companyName, excludeId) => duducarClient.get('/api/companies/check-name', {
    params: { companyName, excludeId }
  }),

  /**
   * 检查企业代码
   * @param {string} companyCode - 企业代码
   * @param {number} excludeId - 排除的企业ID
   */
  checkCompanyCode: (companyCode, excludeId) => duducarClient.get('/api/companies/check-code', {
    params: { companyCode, excludeId }
  }),
}

// =====================================================
// 9. 固有资产信息管理 API（二手房、二手车）
// =====================================================
export const propertyAPI = {
  /**
   * 获取固定资产信息列表（租房）
   * @param {Object} params - { pageId, limit, offset, randomSeed }
   */
  getRentalPropertyList: (params) => duducarClient.get('/api/properties/rental', { params }),
}

// =====================================================
// 10. 页面管理 API
// =====================================================
export const pageAPI = {
  /**
   * 获取首页页面按钮
   */
  getAllPages: () => duducarClient.get('/api/page/list'),

  /**
   * 按页面编排返回大JSON
   * @param {number} pageId - 页面ID
   */
  composePage: (pageId) => duducarClient.get('/api/page/compose', { params: { pageId } }),
}

// =====================================================
// 11. 业务角色管理 API
// =====================================================
export const businessRoleAPI = {
  /**
   * 获取所有业务角色
   */
  getAllBusinessRoles: () => duducarClient.get('/api/business-roles/list'),

  /**
   * 获取业务角色详情
   * @param {number} roleId - 角色ID
   */
  getBusinessRoleById: (roleId) => duducarClient.get(`/api/business-roles/${roleId}`),

  /**
   * 获取用户的业务角色
   * @param {number} userId - 用户ID
   */
  getUserBusinessRoles: (userId) => duducarClient.get(`/api/business-roles/user/${userId}`),

  /**
   * 创建业务角色
   * @param {Object} data - { roleName, roleCode, description, status, permissions }
   */
  createBusinessRole: (data) => duducarClient.post('/api/business-roles/create', data),

  /**
   * 更新业务角色
   * @param {number} roleId - 角色ID
   * @param {Object} data - 角色信息
   */
  updateBusinessRole: (roleId, data) => duducarClient.put(`/api/business-roles/${roleId}`, data),

  /**
   * 删除业务角色
   * @param {number} roleId - 角色ID
   */
  deleteBusinessRole: (roleId) => duducarClient.delete(`/api/business-roles/${roleId}`),

  /**
   * 为用户分配业务角色
   * @param {Object} data - { userId, roleId }
   */
  assignRole: (data) => duducarClient.post('/api/business-roles/assign', data),

  /**
   * 移除用户的业务角色
   * @param {number} userId - 用户ID
   * @param {number} roleId - 角色ID
   */
  removeRole: (userId, roleId) => duducarClient.delete('/api/business-roles/assign', {
    params: { userId, roleId }
  }),
}

// =====================================================
// 12. 权限管理 API（管理员）
// =====================================================
export const permissionAPI = {
  /**
   * 获取所有API权限配置列表
   */
  getAllPermissions: () => duducarClient.get('/api/roles-manage/permissions'),

  /**
   * 更新API权限配置
   * @param {Object} data - 权限配置
   */
  updatePermission: (data) => duducarClient.put('/api/roles-manage/permissions', data),

  /**
   * 获取所有角色信息
   */
  getAllRoles: () => duducarClient.get('/api/roles-manage/all'),

  /**
   * 为用户分配角色
   * @param {Object} data - { userId, roleId }
   */
  assignRoleToUser: (data) => duducarClient.post('/api/roles-manage/assign-role', data),
}

// =====================================================
// 13. 腾讯云COS图片管理 API
// =====================================================
export const cosImageAPI = {
  /**
   * 上传通用图片（用于文章、帖子等）
   * @param {File} file - 图片文件
   * @returns {Promise} - { objectKey, proxyUrl, cdnUrl }
   */
  uploadCommonImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return duducarClient.post('/api/cos/image/upload/common', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /**
   * 获取所有图片列表
   */
  getAllImages: () => duducarClient.get('/api/cos/image/list'),
}

// =====================================================
// 14. 网络信息 API
// =====================================================
export const networkAPI = {
  /**
   * 获取客户端IP地址
   */
  getClientIp: () => duducarClient.get('/api/get-ip'),

  /**
   * 仅获取客户端IP地址
   */
  getClientIpOnly: () => duducarClient.get('/api/network/ip-only'),
}

// =====================================================
// 15. OpenIM 增强认证 API
// =====================================================
export const openimAPI = {
  /**
   * 导入用户到OpenIM
   * @param {Object} data - 用户数据
   */
  registerOpenIMUsers: (data) => duducarClient.post('/api/auth/enhanced/openim/register', data),

  /**
   * 获取已注册用户列表
   */
  getOpenIMUsers: () => duducarClient.post('/api/auth/enhanced/openim/get-users'),

  /**
   * 获取OpenIM Token
   */
  getCurrentUserOpenIMToken: () => duducarClient.post('/api/auth/enhanced/openim/get-token'),
}

// =====================================================
// 导出所有 API
// =====================================================
export default {
  user: userAPI,
  article: articleAPI,
  comment: commentAPI,
  articleView: articleViewAPI,
  like: likeAPI,
  follow: followAPI,
  forum: forumAPI,
  company: companyAPI,
  property: propertyAPI,
  page: pageAPI,
  businessRole: businessRoleAPI,
  permission: permissionAPI,
  cos: cosImageAPI,  // 改为 cos，更简洁
  network: networkAPI,
  openim: openimAPI,
}

