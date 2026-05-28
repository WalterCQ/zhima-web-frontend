// 路由预加载工具
class RoutePreloader {
  constructor() {
    this.preloadedRoutes = new Set()
    this.preloadPromises = new Map()
    this.isEnabled = true
  }

  // 预加载指定路由的组件
  async preloadRoute(routeName, componentLoader) {
    if (!this.isEnabled || this.preloadedRoutes.has(routeName)) {
      return
    }

    try {
      // 如果已经在加载中，返回现有的 Promise
      if (this.preloadPromises.has(routeName)) {
        return this.preloadPromises.get(routeName)
      }

      // 创建预加载 Promise
      const preloadPromise = componentLoader()
      this.preloadPromises.set(routeName, preloadPromise)

      // 执行预加载
      await preloadPromise
      this.preloadedRoutes.add(routeName)
      this.preloadPromises.delete(routeName)
      
    } catch (error) {
      console.warn(`Failed to preload route ${routeName}:`, error)
      this.preloadPromises.delete(routeName)
    }
  }

  // 预加载主要路由
  async preloadMainRoutes() {
    const mainRoutes = [
      {
        name: 'News',
        loader: () => import('@/views/NewsPage.vue')
      },
      {
        name: 'Services', 
        loader: () => import('@/views/ServicesPage.vue')
      },
      {
        name: 'Circles',
        loader: () => import('@/views/CirclesPage.vue')
      },
      {
        name: 'Search',
        loader: () => import('@/views/SearchPage.vue')
      }
    ]

    // 延迟预加载，避免阻塞首屏渲染
    setTimeout(() => {
      mainRoutes.forEach(route => {
        this.preloadRoute(route.name, route.loader)
      })
    }, 1000)
  }

  // 智能预加载：基于用户行为
  setupIntelligentPreload() {
    // 鼠标悬停预加载
    this.setupHoverPreload()
    
    // 基于导航历史预加载
    this.setupHistoryBasedPreload()
  }

  // 设置悬停预加载
  setupHoverPreload() {
    // 监听导航链接的悬停事件
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[href], .nav-item')
      if (!link) return

      const href = link.getAttribute('href') || link.getAttribute('to')
      if (!href || href.startsWith('http') || href === '#') return

      // 根据 href 确定要预加载的路由
      const routeMap = {
        '/news': () => import('@/views/NewsPage.vue'),
        '/services': () => import('@/views/ServicesPage.vue'),
        '/circles': () => import('@/views/CirclesPage.vue'),
        '/search': () => import('@/views/SearchPage.vue'),
        '/profile': () => import('@/views/ProfilePage.vue'),
        // dedicated publish pages
        '/publish/news': () => import('@/views/publish/NewsPublishPage.vue'),
        '/publish/services': () => import('@/views/publish/CityPublishPage.vue'),
        '/publish/circles': () => import('@/views/publish/CirclesPublishPage.vue')
      }

      const routePath = href.split('?')[0] // 移除查询参数
      const loader = routeMap[routePath]
      
      if (loader) {
        this.preloadRoute(routePath, loader)
      }
    })
  }

  // 基于历史记录的预加载
  setupHistoryBasedPreload() {
    // 获取用户最常访问的路由
    const visitHistory = this.getVisitHistory()
    const frequentRoutes = this.getFrequentRoutes(visitHistory)
    
    // 预加载用户常访问的路由
    frequentRoutes.forEach(routeName => {
      const routeMap = {
        'News': () => import('@/views/NewsPage.vue'),
        'Services': () => import('@/views/ServicesPage.vue'),
        'Circles': () => import('@/views/CirclesPage.vue'),
        'Search': () => import('@/views/SearchPage.vue')
      }

      const loader = routeMap[routeName]
      if (loader) {
        this.preloadRoute(routeName, loader)
      }
    })
  }

  // 获取访问历史
  getVisitHistory() {
    try {
      return JSON.parse(localStorage.getItem('routeVisitHistory') || '[]')
    } catch {
      return []
    }
  }

  // 记录路由访问
  recordVisit(routeName) {
    if (!routeName) return

    try {
      const history = this.getVisitHistory()
      const now = Date.now()
      
      // 添加新的访问记录
      history.push({ route: routeName, timestamp: now })
      
      // 只保留最近100条记录
      const recentHistory = history.slice(-100)
      
      localStorage.setItem('routeVisitHistory', JSON.stringify(recentHistory))
    } catch (error) {
      console.warn('Failed to record route visit:', error)
    }
  }

  // 获取最常访问的路由
  getFrequentRoutes(history, limit = 3) {
    if (!history.length) return []

    // 统计每个路由的访问次数
    const routeCounts = {}
    history.forEach(record => {
      routeCounts[record.route] = (routeCounts[record.route] || 0) + 1
    })

    // 按访问次数排序
    const sortedRoutes = Object.entries(routeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([route]) => route)

    return sortedRoutes
  }

  // 预加载与当前路由相关的路由
  preloadRelatedRoutes(currentRoute) {
    const relatedRoutes = {
      'News': ['Search', 'NewsPublish'],
      'Services': ['Search', 'ServicesPublish'],
      'Circles': ['Search', 'CirclesPublish'],
      'Home': ['News', 'Services', 'Circles']
    }

    const related = relatedRoutes[currentRoute] || []
    related.forEach(routeName => {
      const routeMap = {
        'News': () => import('@/views/NewsPage.vue'),
        'Services': () => import('@/views/ServicesPage.vue'),
        'Circles': () => import('@/views/CirclesPage.vue'),
        'Search': () => import('@/views/SearchPage.vue'),
        'NewsPublish': () => import('@/views/publish/NewsPublishPage.vue'),
        'ServicesPublish': () => import('@/views/publish/CityPublishPage.vue'),
        'CirclesPublish': () => import('@/views/publish/CirclesPublishPage.vue')
      }

      const loader = routeMap[routeName]
      if (loader) {
        // 延迟预加载相关路由
        setTimeout(() => {
          this.preloadRoute(routeName, loader)
        }, 500)
      }
    })
  }

  // 禁用预加载（在低带宽或低性能设备上）
  disable() {
    this.isEnabled = false
    console.log('Route preloading disabled')
  }

  // 启用预加载
  enable() {
    this.isEnabled = true
    console.log('Route preloading enabled')
  }

  // 清理预加载缓存
  clear() {
    this.preloadedRoutes.clear()
    this.preloadPromises.clear()
  }

  // 获取预加载状态
  getStatus() {
    return {
      enabled: this.isEnabled,
      preloadedCount: this.preloadedRoutes.size,
      loadingCount: this.preloadPromises.size,
      preloadedRoutes: Array.from(this.preloadedRoutes)
    }
  }
}

// 创建全局实例
export const routePreloader = new RoutePreloader()

// 便捷方法
export const preloadRoute = (routeName, loader) => 
  routePreloader.preloadRoute(routeName, loader)

export const preloadMainRoutes = () => 
  routePreloader.preloadMainRoutes()

export const recordRouteVisit = (routeName) => 
  routePreloader.recordVisit(routeName)

export const preloadRelatedRoutes = (currentRoute) => 
  routePreloader.preloadRelatedRoutes(currentRoute)

export default routePreloader
