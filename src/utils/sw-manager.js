// Service Worker 管理器
export class ServiceWorkerManager {
  constructor() {
    this.registration = null
    this.isSupported = 'serviceWorker' in navigator
    this.isOnline = navigator.onLine
    this.listeners = new Map()
    
    this.init()
  }
  
  async init() {
    if (!this.isSupported) {
      console.warn('Service Worker not supported')
      return
    }
    
    try {
      // 注册 Service Worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered:', this.registration)
      
      // 监听更新
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound()
      })
      
      // 监听网络状态
      window.addEventListener('online', () => {
        this.isOnline = true
        this.emit('online')
      })
      
      window.addEventListener('offline', () => {
        this.isOnline = false
        this.emit('offline')
      })
      
      // 监听来自 SW 的消息
      navigator.serviceWorker.addEventListener('message', event => {
        this.handleMessage(event)
      })
      
      // 检查是否有等待中的 SW
      if (this.registration.waiting) {
        this.handleWaitingSW()
      }
      
      // 检查是否有活跃的 SW
      if (this.registration.active) {
        this.emit('ready')
      }
      
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
  
  handleUpdateFound() {
    const newWorker = this.registration.installing
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // 有新版本可用
          this.emit('updateAvailable', { newWorker })
        } else {
          // 首次安装完成
          this.emit('ready')
        }
      }
    })
  }
  
  handleWaitingSW() {
    this.emit('updateAvailable', { 
      newWorker: this.registration.waiting 
    })
  }
  
  handleMessage(event) {
    const { type, payload } = event.data
    this.emit('message', { type, payload })
  }
  
  // 应用更新
  async applyUpdate() {
    if (!this.registration || !this.registration.waiting) {
      return false
    }
    
    // 告诉等待中的 SW 跳过等待
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // 等待控制权转移
    return new Promise(resolve => {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
        resolve(true)
      }, { once: true })
    })
  }
  
  // 清理缓存
  async clearCache(cacheNames = []) {
    if (!this.registration || !this.registration.active) {
      return false
    }
    
    this.registration.active.postMessage({
      type: 'CLEAR_CACHE',
      payload: cacheNames
    })
    
    return true
  }
  
  // 获取缓存统计
  async getCacheStats() {
    if (!this.registration || !this.registration.active) {
      return {}
    }
    
    return new Promise(resolve => {
      const channel = new MessageChannel()
      
      channel.port1.onmessage = event => {
        const { type, payload } = event.data
        if (type === 'CACHE_STATS') {
          resolve(payload)
        }
      }
      
      this.registration.active.postMessage(
        { type: 'CACHE_STATS' },
        [channel.port2]
      )
      
      // 超时处理
      setTimeout(() => resolve({}), 5000)
    })
  }
  
  // 事件监听
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
  }
  
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback)
    }
  }
  
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Event listener error:', error)
        }
      })
    }
  }
  
  // 获取网络状态
  getNetworkStatus() {
    return {
      online: this.isOnline,
      effectiveType: navigator.connection?.effectiveType,
      downlink: navigator.connection?.downlink,
      rtt: navigator.connection?.rtt
    }
  }
  
  // 预缓存重要资源
  async precacheImportantAssets(urls) {
    if (!this.registration || !this.registration.active) {
      return false
    }
    
    try {
      // 使用后台同步预缓存
      await Promise.all(
        urls.map(url => fetch(url, { mode: 'no-cors' }))
      )
      return true
    } catch (error) {
      console.warn('Precache failed:', error)
      return false
    }
  }
}

// 创建全局实例
export const swManager = new ServiceWorkerManager()

// 便捷方法
export const updateApp = () => swManager.applyUpdate()
export const clearAppCache = (cacheNames) => swManager.clearCache(cacheNames)
export const getAppCacheStats = () => swManager.getCacheStats()
export const isAppOnline = () => swManager.isOnline
