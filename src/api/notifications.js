import { request } from './index'

export const notificationsAPI = {
  // 获取通知列表
  getNotifications: (params = {}) => request.get('/notifications', params),

  // 获取通知详情
  getNotificationDetail: (id) => request.get(`/notifications/${id}`),

  // 标记通知为已读
  markAsRead: (id) => request.put(`/notifications/${id}/read`),

  // 批量标记通知为已读
  markAllAsRead: () => request.put('/notifications/read-all'),

  // 删除通知
  deleteNotification: (id) => request.delete(`/notifications/${id}`),

  // 批量删除通知
  deleteAllNotifications: () => request.delete('/notifications/all'),

  // 获取未读通知数量
  getUnreadCount: () => request.get('/notifications/unread-count'),

  // 获取通知设置
  getNotificationSettings: () => request.get('/notifications/settings'),

  // 更新通知设置
  updateNotificationSettings: (settings) => request.put('/notifications/settings', settings),

  // 获取系统通知
  getSystemNotifications: (params = {}) => request.get('/notifications/system', params),

  // 获取用户通知
  getUserNotifications: (params = {}) => request.get('/notifications/user', params),

  // 获取评论通知
  getCommentNotifications: (params = {}) => request.get('/notifications/comments', params),

  // 获取点赞通知
  getLikeNotifications: (params = {}) => request.get('/notifications/likes', params),

  // 获取关注通知
  getFollowNotifications: (params = {}) => request.get('/notifications/follows', params),

  // 获取私信通知
  getMessageNotifications: (params = {}) => request.get('/notifications/messages', params)
}
