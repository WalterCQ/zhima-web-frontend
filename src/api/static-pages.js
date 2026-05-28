import { request } from './index'

export const staticPagesAPI = {
  // 获取关于我们页面内容
  getAboutPage: () => request.get('/pages/about'),

  // 获取联系我们页面内容
  getContactPage: () => request.get('/pages/contact'),

  // 获取广告合作页面内容
  getAdCooperationPage: () => request.get('/pages/ad-cooperation'),

  // 获取内容投稿页面内容
  getContentSubmissionPage: () => request.get('/pages/content-submission'),

  // 获取免责声明页面内容
  getDisclaimerPage: () => request.get('/pages/disclaimer'),

  // 获取隐私政策页面内容
  getPrivacyPolicyPage: () => request.get('/pages/privacy-policy'),

  // 获取新手指南页面内容
  getNewbieGuidePage: () => request.get('/pages/newbie-guide'),

  // 获取常见问题页面内容
  getFAQPage: () => request.get('/pages/faq'),

  // 获取在线客服页面内容
  getOnlineSupportPage: () => request.get('/pages/online-support'),

  // 获取意见反馈页面内容
  getFeedbackPage: () => request.get('/pages/feedback'),

  // 获取违规举报页面内容
  getReportPage: () => request.get('/pages/report'),

  // 提交意见反馈
  submitFeedback: (data) => request.post('/feedback', data),

  // 提交举报
  submitReport: (data) => request.post('/reports', data),

  // 获取系统公告
  getSystemAnnouncements: (params = {}) => request.get('/announcements', params),

  // 获取系统公告详情
  getAnnouncementDetail: (id) => request.get(`/announcements/${id}`),

  // 获取帮助文档
  getHelpDocs: (params = {}) => request.get('/help/docs', params),

  // 获取帮助文档详情
  getHelpDocDetail: (id) => request.get(`/help/docs/${id}`),

  // 获取系统配置
  getSystemConfig: () => request.get('/system/config'),

  // 获取网站统计信息
  getWebsiteStats: () => request.get('/system/stats')
}
