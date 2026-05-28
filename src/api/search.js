import { request } from './index'

export const searchAPI = {
  // 全站搜索
  globalSearch: (params = {}) => request.get('/search/global', params),

  // 搜索用户
  searchUsers: (params = {}) => request.get('/search/users', params),

  // 搜索帖子
  searchPosts: (params = {}) => request.get('/search/posts', params),

  // 搜索服务
  searchServices: (params = {}) => request.get('/search/services', params),

  // 搜索知马圈
  searchCircles: (params = {}) => request.get('/search/circles', params),

  // 搜索新闻
  searchNews: (params = {}) => request.get('/search/news', params),

  // 搜索房产
  searchHousing: (params = {}) => request.get('/search/housing', params),

  // 搜索招聘
  searchJobs: (params = {}) => request.get('/search/jobs', params),

  // 搜索二手车
  searchCars: (params = {}) => request.get('/search/cars', params),

  // 获取热搜关键词
  getTrendingKeywords: () => request.get('/search/trending'),

  // 获取搜索建议
  getSearchSuggestions: (keyword) => request.get('/search/suggestions', { keyword }),

  // 获取搜索历史
  getSearchHistory: () => request.get('/search/history'),

  // 清除搜索历史
  clearSearchHistory: () => request.delete('/search/history'),

  // 保存搜索记录
  saveSearchRecord: (keyword) => request.post('/search/record', { keyword }),

  // 获取搜索统计
  getSearchStats: (params = {}) => request.get('/search/stats', params)
}
