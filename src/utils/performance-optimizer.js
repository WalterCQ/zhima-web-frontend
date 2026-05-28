/**
 * 性能优化工具集合
 * 基于2025年最佳实践的性能优化方案
 */

// 图片懒加载优化
export class ImageOptimizer {
  constructor() {
    this.observer = null
    this.initIntersectionObserver()
  }

  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              this.loadImage(img)
              this.observer.unobserve(img)
            }
          })
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      )
    }
  }

  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src
      img.removeAttribute('data-src')
    }
    
    // 添加加载完成事件
    img.addEventListener('load', () => {
      img.classList.add('loaded')
    })
  }

  observe(img) {
    if (this.observer) {
      this.observer.observe(img)
    } else {
      // 降级处理
      this.loadImage(img)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// 防抖函数
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 虚拟滚动优化
export class VirtualScroll {
  constructor(container, itemHeight, renderItem) {
    this.container = container
    this.itemHeight = itemHeight
    this.renderItem = renderItem
    this.items = []
    this.visibleItems = []
    this.scrollTop = 0
    this.containerHeight = 0
    
    this.init()
  }

  init() {
    this.containerHeight = this.container.clientHeight
    this.updateVisibleItems()
    
    this.container.addEventListener('scroll', throttle(() => {
      this.scrollTop = this.container.scrollTop
      this.updateVisibleItems()
    }, 16)) // 60fps
  }

  updateVisibleItems() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.items.length
    )

    this.visibleItems = this.items.slice(startIndex, endIndex)
    this.render()
  }

  setItems(items) {
    this.items = items
    this.updateVisibleItems()
  }

  render() {
    // 实现渲染逻辑
    this.renderItem(this.visibleItems)
  }
}

// 内存管理
export class MemoryManager {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  get(key) {
    const value = this.cache.get(key)
    if (value) {
      // LRU: 重新设置以更新位置
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  clear() {
    this.cache.clear()
  }
}

// 性能监控
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
  }

  // 监控长任务
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // 超过50ms的任务
            console.warn('Long task detected:', entry)
            this.metrics.longTasks = this.metrics.longTasks || []
            this.metrics.longTasks.push(entry)
          }
        })
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    }
  }

  // 监控布局偏移
  observeLayoutShift() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput && entry.value > 0.1) {
            console.warn('Layout shift detected:', entry)
            this.metrics.layoutShifts = this.metrics.layoutShifts || []
            this.metrics.layoutShifts.push(entry)
          }
        })
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    }
  }

  // 获取性能指标
  getMetrics() {
    return {
      ...this.metrics,
      navigation: performance.getEntriesByType('navigation')[0],
      paint: performance.getEntriesByType('paint'),
      resource: performance.getEntriesByType('resource')
    }
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
  }
}

// Web Vitals 监控
export function measureWebVitals() {
  // LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      console.log('CLS:', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }
}

// 预加载关键资源
export function preloadCriticalResources() {
  const criticalResources = [
    '/logo.png',
    '/css/index.css',
    '/js/index.js'
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    link.as = resource.endsWith('.css') ? 'style' : 'script'
    document.head.appendChild(link)
  })
}

// 代码分割辅助
export function loadComponent(componentPath) {
  return () => import(/* webpackChunkName: "[request]" */ `@/components/${componentPath}`)
}

// 缓存策略
export class CacheStrategy {
  constructor() {
    this.cache = new Map()
    this.maxAge = 5 * 60 * 1000 // 5分钟
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  clear() {
    this.cache.clear()
  }
}

// 导出默认实例
export const imageOptimizer = new ImageOptimizer()
export const memoryManager = new MemoryManager()
export const performanceMonitor = new PerformanceMonitor()
export const cacheStrategy = new CacheStrategy()
