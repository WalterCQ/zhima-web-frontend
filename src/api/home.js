import { request } from './index'
import duducarAPI from './duducar-integration'

// 辅助函数：转换响应格式
const transformResponse = (apiResponse) => {
  if (apiResponse.success) {
    return { code: 200, message: apiResponse.message, data: apiResponse.data }
  } else {
    return { code: 400, message: apiResponse.message, data: null }
  }
}

export const homeAPI = {
  /**
   * 获取首页所有数据（统一接口）
   * TODO: 等待后端提供统一的首页数据API
   * 
   * 返回数据结构：
   * {
   *   code: 200,
   *   data: {
   *     topAds: [{ id, image, link, title }],           // 顶部4个广告横幅
   *     heroSlides: [{ id, image, title, link }],        // Hero轮播图（3-5张）
   *     hotNews: {                                        // 热搜数据（4个tab）
   *       newsHot: [...],      // 新闻热点 Top5
   *       forumHot: [...],     // 论坛热点 Top5
   *       chinaHot: [...],     // 中国热点 Top5
   *       officialHot: [...]   // 官方消息 Top5
   *     },
   *     middleAds: [{ id, image, link }],                // 中间4行广告横幅
   *     localNews: [...],                                // 本地新闻列表（6条）
   *     investment: [...],                               // 创业投资列表（6条）
   *     sidebarAds: [{ id, image, link }],              // 右侧竖向5格广告
   *     helpPosts: [...],                                // 互助爆料（6条）
   *     lawyerConsult: [...],                            // 律师咨询（6条）
   *     bottomAd: { id, image, link }                    // 底部广告横幅
   *   }
   * }
   */
  getHomepageData: async () => {
    try {
      // TODO: 替换为真实的后端API
      // const response = await request.get('/api/homepage/data')
      // return response
      
      // 临时使用模拟数据结构
      return {
        code: 200,
        message: '获取成功',
        data: {
          topAds: [],
          heroSlides: [],
          hotNews: {
            newsHot: [],
            forumHot: [],
            chinaHot: [],
            officialHot: []
          },
          middleAds: [],
          localNews: [],
          investment: [],
          sidebarAds: [],
          helpPosts: [],
          lawyerConsult: [],
          bottomAd: null
        }
      }
    } catch (error) {
      console.error('获取首页数据失败:', error)
      return {
        code: 500,
        message: error.message || '获取首页数据失败',
        data: null
      }
    }
  },

  // 获取首页轮播图 - 使用页面动态管理API
  getBanners: async () => {
    try {
      const response = await duducarAPI.page.getAllPages()
      if (response.success && response.data) {
        // 筛选出轮播图类型的页面或使用前几个页面作为轮播图
        const banners = response.data.slice(0, 5).map((page, index) => ({
          id: page.pageId,
          image: page.pagePic || '/banner-placeholder.jpg',
          title: page.pageName,
          link: `/page/${page.pageId}`,
          order: index
        }))
        return { code: 200, message: '获取成功', data: banners }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      console.error('获取轮播图失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐内容 - 使用文章列表API
  getRecommendedContent: async (params = {}) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit: params.limit || 10,
        offset: params.offset || 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('🔍 获取推荐内容失败:', error.message || error)
      // 返回空数据而不是抛出错误，让页面继续工作
      return { code: 200, message: '获取成功', data: { articles: [] } }
    }
  },

  // 获取首页热门内容
  getHotContent: async (limit = 20) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取热门内容失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页最新内容
  getLatestContent: async (limit = 20) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取最新内容失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页统计数据
  getHomepageStats: async () => {
    try {
      // 返回模拟统计数据，因为API中没有直接的统计接口
      return {
        code: 200,
        message: '获取成功',
        data: {
          users: 0,
          posts: 0,
          services: 0,
          views: 0
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      return { code: 200, message: '获取成功', data: {} }
    }
  },

  // 获取首页分类导航 - 使用页面列表API
  getCategoryNavigation: async () => {
    try {
      const response = await duducarAPI.page.getAllPages()
      if (response.success && response.data) {
        const categories = response.data.map(page => ({
          id: page.pageId,
          name: page.pageName,
          icon: page.pagePic,
          link: `/page/${page.pageId}`,
          count: 0
        }))
        return { code: 200, message: '获取成功', data: categories }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      console.error('获取分类导航失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页快捷入口
  getQuickLinks: async () => {
    try {
      // 返回默认快捷入口
      return {
        code: 200,
        message: '获取成功',
        data: [
          { id: 1, name: '知马圈', icon: 'circle', link: '/circles' },
          { id: 2, name: '新闻资讯', icon: 'newspaper', link: '/news' },
          { id: 3, name: '房产信息', icon: 'home', link: '/services/housing' },
          { id: 4, name: '招聘求职', icon: 'briefcase', link: '/services/jobs' },
          { id: 5, name: '二手车', icon: 'car', link: '/services/cars' },
          { id: 6, name: '生活分享', icon: 'coffee', link: '/circles/lifestyle' }
        ]
      }
    } catch (error) {
      console.error('获取快捷入口失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页公告 - 使用文章API获取公告类型文章
  getHomepageAnnouncements: async (limit = 5) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit,
        offset: 0
      })
      if (response.success && response.data?.articles) {
        const announcements = response.data.articles.slice(0, limit).map(article => ({
          id: article.articleId,
          title: article.articleName,
          content: article.articleContent?.substring(0, 100),
          created_at: article.createdAt
        }))
        return { code: 200, message: '获取成功', data: announcements }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      console.error('获取公告失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页活动
  getHomepageActivities: async (limit = 10) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit,
        offset: 0
      })
      if (response.success && response.data?.articles) {
        const activities = response.data.articles.slice(0, limit).map(article => ({
          id: article.articleId,
          title: article.articleName,
          description: article.articleContent?.substring(0, 100),
          image: article.images?.[0]?.pictureUrl || '/placeholder-news.jpg',
          created_at: article.createdAt
        }))
        return { code: 200, message: '获取成功', data: activities }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      console.error('获取活动失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐用户
  getRecommendedUsers: async (limit = 10) => {
    try {
      // 暂时返回空数组，因为API中没有推荐用户接口
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐服务
  getRecommendedServices: async (limit = 10) => {
    try {
      // 暂时返回空数组
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐知马圈
  getRecommendedCircles: async (limit = 10) => {
    try {
      const response = await duducarAPI.article.getChannels(4) // 4=小红书/知马圈
      if (response.success && response.data) {
        const circles = response.data.map(channel => ({
          id: channel.channelId,
          name: channel.channelName,
          description: channel.channelDescription || '',
          icon: '/placeholder-circle.svg',
          members_count: 0
        }))
        return { code: 200, message: '获取成功', data: circles.slice(0, limit) }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐新闻
  getRecommendedNews: async (limit = 10) => {
    try {
      const response = await duducarAPI.article.getArticles({
        pageId: 2, // 2=财经/新闻
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐房产
  getRecommendedHousing: async (limit = 10) => {
    try {
      const response = await duducarAPI.property.getRentalList({
        pageId: 10, // 假设10是房产页面ID
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐招聘
  getRecommendedJobs: async (limit = 10) => {
    try {
      // 暂时返回空数组
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐二手车
  getRecommendedCars: async (limit = 10) => {
    try {
      const response = await duducarAPI.property.getRentalList({
        pageId: 11, // 假设11是二手车页面ID
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取首页推荐生活分享
  getRecommendedLifestyle: async (limit = 10) => {
    try {
      const response = await duducarAPI.article.getArticles({
        pageId: 4, // 4=小红书/生活分享
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      return { code: 200, message: '获取成功', data: [] }
    }
  }
}
