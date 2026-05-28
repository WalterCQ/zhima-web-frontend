import { request } from './index'

export const lifestyleAPI = {
  // 获取生活圈分类
  getCategories: () => request.get('/lifestyle/categories'),

  // 获取生活分享列表
  getPosts: (params) => request.get('/lifestyle/posts', params),

  // 获取生活分享详情
  getPostDetail: (id) => request.get(`/lifestyle/posts/${id}`),

  // 发布生活分享
  publishPost: (data) => request.post('/lifestyle/posts', data),

  // 点赞/取消点赞
  toggleLike: (id) => request.post(`/lifestyle/posts/${id}/like`),

  // 获取评论
  getComments: (id, params) => request.get(`/lifestyle/posts/${id}/comments`, params),

  // 发表评论
  postComment: (id, data) => request.post(`/lifestyle/posts/${id}/comments`, data)
}

