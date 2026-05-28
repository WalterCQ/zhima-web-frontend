/**
 * 知马圈页面优化配置
 * 整合所有优化工具的统一配置
 */

import { 
  imageOptimizer, 
  memoryManager, 
  performanceMonitor, 
  measureWebVitals,
  preloadCriticalResources 
} from './performance-optimizer'

import { 
  structuredDataGenerator, 
  metaTagManager, 
  keywordOptimizer, 
  contentQualityAssessor 
} from './seo-optimizer'

import { 
  accessibilityOptimizer, 
  loadingStateManager, 
  errorHandler, 
  interactionFeedback 
} from './ux-optimizer'

// 页面优化配置
export const optimizationConfig = {
  // 性能优化配置
  performance: {
    enableImageOptimization: true,
    enableVirtualScroll: true,
    enableMemoryManagement: true,
    enablePerformanceMonitoring: true,
    enableWebVitals: true,
    enablePreloading: true,
    maxCacheSize: 100,
    imageLazyLoadMargin: '50px',
    virtualScrollItemHeight: 200
  },

  // SEO优化配置
  seo: {
    enableStructuredData: true,
    enableMetaTags: true,
    enableKeywordOptimization: true,
    enableContentQualityAssessment: true,
    baseTitle: "知马网 - 马来西亚华人信息集散平台",
    baseDescription: "知马网是马来西亚华人社区的信息集散平台，提供最新资讯、生活服务、社交圈子等综合服务，让大马华人生活更便利。",
    baseKeywords: "马来西亚,华人,资讯,服务,圈子,生活,社交,大马",
    minWordCount: 300,
    idealWordCount: 800,
    targetKeywordDensity: 2
  },

  // 用户体验配置
  ux: {
    enableAccessibility: true,
    enableLoadingStates: true,
    enableErrorHandling: true,
    enableInteractionFeedback: true,
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableColorContrastCheck: true,
    notificationDuration: 5000,
    loadingTimeout: 10000
  }
}

// 页面优化管理器
export class PageOptimizer {
  constructor(config = optimizationConfig) {
    this.config = config
    this.initialized = false
  }

  // 初始化所有优化
  async init() {
    if (this.initialized) return

    try {
      // 性能优化初始化
      if (this.config.performance.enablePreloading) {
        preloadCriticalResources()
      }

      if (this.config.performance.enableWebVitals) {
        measureWebVitals()
      }

      if (this.config.performance.enablePerformanceMonitoring) {
        performanceMonitor.observeLongTasks()
        performanceMonitor.observeLayoutShift()
      }

      // 用户体验优化初始化
      if (this.config.ux.enableAccessibility) {
        accessibilityOptimizer.init()
      }

      if (this.config.ux.enableErrorHandling) {
        errorHandler.setupGlobalErrorHandling()
      }

      if (this.config.ux.enableInteractionFeedback) {
        interactionFeedback.addInteractionStyles()
        loadingStateManager.addLoadingStyles()
      }

      this.initialized = true
      console.log('页面优化初始化完成')
    } catch (error) {
      console.error('页面优化初始化失败:', error)
    }
  }

  // 优化页面内容
  optimizePageContent(pageData) {
    const optimizations = {}

    // SEO优化
    if (this.config.seo.enableMetaTags) {
      optimizations.metaTags = this.generateMetaTags(pageData)
    }

    if (this.config.seo.enableStructuredData) {
      optimizations.structuredData = this.generateStructuredData(pageData)
    }

    if (this.config.seo.enableKeywordOptimization) {
      optimizations.keywords = this.optimizeKeywords(pageData)
    }

    if (this.config.seo.enableContentQualityAssessment) {
      optimizations.contentQuality = this.assessContentQuality(pageData)
    }

    return optimizations
  }

  // 生成元标签
  generateMetaTags(pageData) {
    const { title, description, keywords, image, url, author, publishedTime, modifiedTime, tags } = pageData

    metaTagManager.setTitle(title)
    metaTagManager.setDescription(description)
    metaTagManager.setKeywords(keywords)
    
    if (image) metaTagManager.setImage(image)
    if (url) metaTagManager.setUrl(url)
    if (author) metaTagManager.setAuthor(author)
    if (publishedTime) metaTagManager.setPublishedTime(publishedTime)
    if (modifiedTime) metaTagManager.setModifiedTime(modifiedTime)
    if (tags) metaTagManager.setTags(tags)

    return {
      title: metaTagManager.baseTitle,
      description: metaTagManager.baseDescription,
      keywords: metaTagManager.baseKeywords
    }
  }

  // 生成结构化数据
  generateStructuredData(pageData) {
    const { type, data } = pageData

    let structuredData = null

    switch (type) {
      case 'article':
        structuredData = structuredDataGenerator.generateArticleSchema(data)
        break
      case 'service':
        structuredData = structuredDataGenerator.generateServiceSchema(data)
        break
      case 'website':
        structuredData = structuredDataGenerator.generateWebsiteSchema()
        break
      case 'breadcrumb':
        structuredData = structuredDataGenerator.generateBreadcrumbSchema(data)
        break
      case 'faq':
        structuredData = structuredDataGenerator.generateFAQSchema(data)
        break
    }

    if (structuredData) {
      this.injectStructuredData(structuredData)
    }

    return structuredData
  }

  // 注入结构化数据
  injectStructuredData(data) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // 优化关键词
  optimizeKeywords(pageData) {
    const { content, title, description } = pageData
    const fullText = `${title} ${description} ${content}`

    const keywords = keywordOptimizer.extractKeywords(fullText)
    const keywordDensity = keywordOptimizer.analyzeKeywordDensity(fullText, keywords)
    const optimization = keywordOptimizer.optimizeKeywordDensity(content, keywords[0])

    return {
      keywords,
      keywordDensity,
      optimization
    }
  }

  // 评估内容质量
  assessContentQuality(pageData) {
    const { content } = pageData
    return contentQualityAssessor.assessContent(content)
  }

  // 显示加载状态
  showLoading(element, type = 'default') {
    if (this.config.ux.enableLoadingStates) {
      return loadingStateManager.showLoading(element, type)
    }
    return null
  }

  // 隐藏加载状态
  hideLoading(id) {
    if (this.config.ux.enableLoadingStates && id) {
      loadingStateManager.hideLoading(id)
    }
  }

  // 处理错误
  handleError(error, type = 'Error') {
    if (this.config.ux.enableErrorHandling) {
      errorHandler.handleError(error, type)
    }
  }

  // 优化图片
  optimizeImage(img) {
    if (this.config.performance.enableImageOptimization) {
      imageOptimizer.observe(img)
    }
  }

  // 检查颜色对比度
  checkColorContrast(foreground, background) {
    if (this.config.ux.enableColorContrastCheck) {
      return accessibilityOptimizer.checkColorContrast(foreground, background)
    }
    return { ratio: 0, level: 'Unknown' }
  }

  // 获取性能指标
  getPerformanceMetrics() {
    if (this.config.performance.enablePerformanceMonitoring) {
      return performanceMonitor.getMetrics()
    }
    return {}
  }

  // 清理资源
  cleanup() {
    if (this.config.performance.enablePerformanceMonitoring) {
      performanceMonitor.disconnect()
    }

    if (this.config.performance.enableImageOptimization) {
      imageOptimizer.disconnect()
    }

    if (this.config.performance.enableMemoryManagement) {
      memoryManager.clear()
    }
  }
}

// 页面特定优化配置
export const pageOptimizations = {
  // 首页优化
  homePage: {
    ...optimizationConfig,
    seo: {
      ...optimizationConfig.seo,
      title: "知马网首页 - 马来西亚华人信息集散平台",
      description: "知马网首页，提供马来西亚华人社区最新资讯、生活服务、社交圈子等综合服务。",
      keywords: "马来西亚,华人,首页,资讯,服务,圈子,生活,社交,大马"
    },
    performance: {
      ...optimizationConfig.performance,
      enablePreloading: true,
      enableWebVitals: true
    }
  },

  // 知马圈页面优化
  circlesPage: {
    ...optimizationConfig,
    seo: {
      ...optimizationConfig.seo,
      title: "知马圈 - 马来西亚华人社交圈子",
      description: "知马圈是马来西亚华人社区社交平台，分享生活点滴，交流经验心得，建立华人社交网络。",
      keywords: "马来西亚,华人,社交,圈子,分享,交流,生活,经验,网络"
    },
    performance: {
      ...optimizationConfig.performance,
      enableVirtualScroll: true,
      enableImageOptimization: true
    },
    ux: {
      ...optimizationConfig.ux,
      enableAccessibility: true,
      enableLoadingStates: true
    }
  },

  // 详情页优化
  detailPage: {
    ...optimizationConfig,
    seo: {
      ...optimizationConfig.seo,
      enableStructuredData: true,
      enableContentQualityAssessment: true
    },
    performance: {
      ...optimizationConfig.performance,
      enableImageOptimization: true,
      enableMemoryManagement: true
    }
  }
}

// 导出默认实例
export const pageOptimizer = new PageOptimizer()

// 自动初始化（在页面加载时）
if (typeof window !== 'undefined') {
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      pageOptimizer.init()
    })
  } else {
    pageOptimizer.init()
  }
}
