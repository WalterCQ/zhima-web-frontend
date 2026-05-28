// 性能监控工具
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.enabled = 'performance' in window
  }
  
  // 开始计时
  start(name) {
    if (!this.enabled) return
    
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    })
  }
  
  // 结束计时
  end(name) {
    if (!this.enabled || !this.metrics.has(name)) return
    
    const metric = this.metrics.get(name)
    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime
    
    console.log(`Performance: ${name} took ${metric.duration.toFixed(2)}ms`)
    return metric.duration
  }
  
  // 测量函数执行时间
  async measure(name, fn) {
    this.start(name)
    try {
      const result = await fn()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }
  
  // 获取页面加载性能指标
  getPageMetrics() {
    if (!this.enabled) return {}
    
    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    
    return {
      // 页面加载时间
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
      // DNS 查询时间
      dnsTime: navigation?.domainLookupEnd - navigation?.domainLookupStart,
      // TCP 连接时间
      tcpTime: navigation?.connectEnd - navigation?.connectStart,
      // 请求响应时间
      responseTime: navigation?.responseEnd - navigation?.requestStart,
      // DOM 解析时间
      domParseTime: navigation?.domContentLoadedEventStart - navigation?.responseEnd,
      // 首次绘制时间
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      // 首次内容绘制时间
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      // 总的页面加载时间
      totalLoadTime: navigation?.loadEventEnd - navigation?.navigationStart
    }
  }
  
  // 监控 Largest Contentful Paint (LCP)
  observeLCP(callback) {
    if (!('PerformanceObserver' in window)) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      callback(lastEntry.startTime)
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.set('lcp', observer)
  }
  
  // 监控 First Input Delay (FID)
  observeFID(callback) {
    if (!('PerformanceObserver' in window)) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        callback(entry.processingStart - entry.startTime)
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
    this.observers.set('fid', observer)
  }
  
  // 监控 Cumulative Layout Shift (CLS)
  observeCLS(callback) {
    if (!('PerformanceObserver' in window)) return
    
    let clsValue = 0
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      callback(clsValue)
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('cls', observer)
  }
  
  // 监控长任务
  observeLongTasks(callback) {
    if (!('PerformanceObserver' in window)) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        callback({
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name
        })
      })
    })
    
    observer.observe({ entryTypes: ['longtask'] })
    this.observers.set('longtask', observer)
  }
  
  // 监控资源加载性能
  getResourceMetrics() {
    if (!this.enabled) return []
    
    const resources = performance.getEntriesByType('resource')
    
    return resources.map(resource => ({
      name: resource.name,
      type: this.getResourceType(resource),
      size: resource.transferSize,
      duration: resource.responseEnd - resource.startTime,
      startTime: resource.startTime
    }))
  }
  
  // 获取资源类型
  getResourceType(resource) {
    if (resource.initiatorType) {
      return resource.initiatorType
    }
    
    const url = resource.name
    if (url.includes('.js')) return 'script'
    if (url.includes('.css')) return 'stylesheet'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.includes('/api/')) return 'api'
    
    return 'other'
  }
  
  // 内存使用情况
  getMemoryMetrics() {
    if (!('memory' in performance)) return {}
    
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(2)
    }
  }
  
  // 网络连接信息
  getConnectionMetrics() {
    if (!('connection' in navigator)) return {}
    
    const connection = navigator.connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  
  // 生成性能报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      metrics: {
        page: this.getPageMetrics(),
        memory: this.getMemoryMetrics(),
        connection: this.getConnectionMetrics(),
        resources: this.getResourceMetrics(),
        custom: Object.fromEntries(this.metrics)
      }
    }
    
    return report
  }
  
  // 清理观察器
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers.clear()
  }
  
  // 发送性能数据（示例）
  async sendMetrics(endpoint = '/api/v1/analytics/performance') {
    try {
      const report = this.generateReport()
      
      // 使用 beacon API 发送数据，即使页面卸载也能发送
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(endpoint, JSON.stringify(report))
      } else {
        // 降级使用 fetch
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
          keepalive: true
        }).catch(() => {}) // 静默失败
      }
    } catch (error) {
      console.warn('Failed to send performance metrics:', error)
    }
  }
}

// 创建全局实例
export const perfMonitor = new PerformanceMonitor()

// 便捷方法
export const startTiming = (name) => perfMonitor.start(name)
export const endTiming = (name) => perfMonitor.end(name)
export const measurePerf = (name, fn) => perfMonitor.measure(name, fn)

// 自动监控核心指标
export function setupCoreMetrics() {
  // 监控 LCP
  perfMonitor.observeLCP((lcp) => {
    console.log(`LCP: ${lcp.toFixed(2)}ms`)
  })
  
  // 监控 FID
  perfMonitor.observeFID((fid) => {
    console.log(`FID: ${fid.toFixed(2)}ms`)
  })
  
  // 监控 CLS
  perfMonitor.observeCLS((cls) => {
    console.log(`CLS: ${cls.toFixed(4)}`)
  })
  
  // 监控长任务
  perfMonitor.observeLongTasks((task) => {
    if (task.duration > 50) { // 只记录超过 50ms 的任务
      console.warn(`Long task detected: ${task.duration.toFixed(2)}ms`)
    }
  })
  
  // 页面卸载时发送数据
  window.addEventListener('beforeunload', () => {
    perfMonitor.sendMetrics()
  })
  
  // 页面隐藏时发送数据
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      perfMonitor.sendMetrics()
    }
  })
}

// 页面加载完成后的性能检查
export function checkPagePerformance() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = perfMonitor.getPageMetrics()
      
      // 性能警告阈值
      const thresholds = {
        totalLoadTime: 3000,
        firstContentfulPaint: 1500,
        largestContentfulPaint: 2500
      }
      
      Object.entries(thresholds).forEach(([metric, threshold]) => {
        if (metrics[metric] && metrics[metric] > threshold) {
          console.warn(`Performance warning: ${metric} (${metrics[metric].toFixed(2)}ms) exceeds threshold (${threshold}ms)`)
        }
      })
      
      // 资源加载分析
      const resources = perfMonitor.getResourceMetrics()
      const slowResources = resources.filter(r => r.duration > 1000)
      
      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources)
      }
      
    }, 1000)
  })
}
