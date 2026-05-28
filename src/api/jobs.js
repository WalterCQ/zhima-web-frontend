import { request } from './index'

export const jobsAPI = {
  // 获取招聘信息列表
  getJobsList: (params = {}) => request.get('/jobs', params),

  // 获取招聘信息详情
  getJobDetail: (id) => request.get(`/jobs/${id}`),

  // 发布招聘信息
  publishJob: (data) => request.post('/jobs', data),

  // 更新招聘信息
  updateJob: (id, data) => request.put(`/jobs/${id}`, data),

  // 删除招聘信息
  deleteJob: (id) => request.delete(`/jobs/${id}`),

  // 获取招聘分类
  getJobCategories: () => request.get('/jobs/categories'),

  // 获取职位类型
  getJobTypes: () => request.get('/jobs/types'),

  // 获取薪资范围
  getSalaryRanges: () => request.get('/jobs/salary-ranges'),

  // 获取工作经验要求
  getExperienceLevels: () => request.get('/jobs/experience-levels'),

  // 获取教育要求
  getEducationLevels: () => request.get('/jobs/education-levels'),

  // 搜索招聘信息
  searchJobs: (params = {}) => request.get('/jobs/search', params),

  // 筛选招聘信息
  filterJobs: (params = {}) => request.get('/jobs/filter', params),

  // 获取热门招聘
  getHotJobs: (limit = 20) => request.get('/jobs/hot', { limit }),

  // 获取推荐招聘
  getRecommendedJobs: (params = {}) => request.get('/jobs/recommended', params),

  // 申请职位
  applyJob: (id, data) => request.post(`/jobs/${id}/apply`, data),

  // 获取我的申请记录
  getMyApplications: (params = {}) => request.get('/jobs/applications', params),

  // 获取我发布的招聘
  getMyJobs: (params = {}) => request.get('/jobs/my', params),

  // 获取职位申请者列表
  getJobApplicants: (id, params = {}) => request.get(`/jobs/${id}/applicants`, params),

  // 处理申请（通过/拒绝）
  handleApplication: (jobId, applicationId, data) => request.put(`/jobs/${jobId}/applications/${applicationId}`, data),

  // 收藏招聘信息
  favoriteJob: (id) => request.post(`/jobs/${id}/favorite`),

  // 取消收藏招聘信息
  unfavoriteJob: (id) => request.delete(`/jobs/${id}/favorite`),

  // 获取收藏的招聘信息
  getFavoriteJobs: (params = {}) => request.get('/jobs/favorites', params),

  // 获取公司信息
  getCompanyInfo: (id) => request.get(`/companies/${id}`),

  // 获取公司发布的招聘
  getCompanyJobs: (id, params = {}) => request.get(`/companies/${id}/jobs`, params),

  // 举报招聘信息
  reportJob: (id, data) => request.post(`/jobs/${id}/report`, data),

  // 获取招聘统计信息
  getJobStats: (id) => request.get(`/jobs/${id}/stats`),

  // 上传招聘图片
  uploadJobImage: (formData) => request.upload('/jobs/upload/image', formData),

  // 获取附近招聘
  getNearbyJobs: (params = {}) => request.get('/jobs/nearby', params),

  // 获取招聘趋势
  getJobTrends: (params = {}) => request.get('/jobs/trends', params)
}
