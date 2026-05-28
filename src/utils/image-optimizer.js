// 图片处理工具
export class ImageOptimizer {
  static instance = null
  
  constructor() {
    if (ImageOptimizer.instance) {
      return ImageOptimizer.instance
    }
    
    this.cache = new Map()
    this.loadingPromises = new Map()
    this.supportsWebP = null
    this.supportsAvif = null
    
    ImageOptimizer.instance = this
  }
  
  // 检查浏览器支持的图片格式
  async checkFormatSupport() {
    if (this.supportsWebP === null) {
      this.supportsWebP = await this.testFormat('webp')
    }
    if (this.supportsAvif === null) {
      this.supportsAvif = await this.testFormat('avif')
    }
    
    return {
      webp: this.supportsWebP,
      avif: this.supportsAvif
    }
  }
  
  // 测试特定格式支持
  testFormat(format) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 1, 1)
      
      canvas.toBlob(blob => {
        resolve(!!blob)
      }, `image/${format}`)
    })
  }
  
  // 获取最优图片格式
  async getOptimalImageUrl(originalUrl, options = {}) {
    const { width, height, quality = 85 } = options
    
    // 如果已经缓存，直接返回
    const cacheKey = `${originalUrl}_${width || 'auto'}_${height || 'auto'}_${quality}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    // 如果正在加载，返回现有的 Promise
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }
    
    const loadPromise = this._processImage(originalUrl, options)
    this.loadingPromises.set(cacheKey, loadPromise)
    
    try {
      const result = await loadPromise
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.loadingPromises.delete(cacheKey)
    }
  }
  
  async _processImage(originalUrl, options) {
    const { width, height, quality = 85 } = options
    
    // 检查格式支持
    const formats = await this.checkFormatSupport()
    
    // 处理本地图片
    if (originalUrl.startsWith('/') || originalUrl.startsWith('./')) {
      const optimizedUrl = this._tryOptimizedFormats(originalUrl, formats)
      if (optimizedUrl !== originalUrl) {
        const isAvailable = await this._checkImageExists(optimizedUrl)
        if (isAvailable) {
          return optimizedUrl
        }
      }
    }
    
    // 如果需要动态调整大小，使用 Canvas 处理
    if (width || height) {
      return this._resizeImage(originalUrl, { width, height, quality, formats })
    }
    
    return originalUrl
  }
  
  // 尝试获取优化格式的图片
  _tryOptimizedFormats(url, formats) {
    const lastDotIndex = url.lastIndexOf('.')
    if (lastDotIndex === -1) return url
    
    const basePath = url.substring(0, lastDotIndex)
    const extension = url.substring(lastDotIndex + 1).toLowerCase()
    
    // 只处理常见的图片格式
    if (!['jpg', 'jpeg', 'png'].includes(extension)) return url
    
    // 优先使用 AVIF，其次 WebP
    if (formats.avif) {
      return `${basePath}.avif`
    } else if (formats.webp) {
      return `${basePath}.webp`
    }
    
    return url
  }
  
  // 检查图片是否存在
  _checkImageExists(url) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }
  
  // 使用 Canvas 调整图片大小
  async _resizeImage(url, options) {
    const { width, height, quality, formats } = options
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 计算新尺寸
        const { newWidth, newHeight } = this._calculateDimensions(
          img.width, img.height, width, height
        )
        
        canvas.width = newWidth
        canvas.height = newHeight
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        
        // 选择最佳输出格式
        const outputFormat = formats.avif ? 'image/avif' 
          : formats.webp ? 'image/webp' 
          : 'image/jpeg'
        
        const dataUrl = canvas.toDataURL(outputFormat, quality / 100)
        resolve(dataUrl)
      }
      
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }
  
  // 计算保持比例的新尺寸
  _calculateDimensions(originalWidth, originalHeight, targetWidth, targetHeight) {
    if (!targetWidth && !targetHeight) {
      return { newWidth: originalWidth, newHeight: originalHeight }
    }
    
    if (targetWidth && targetHeight) {
      return { newWidth: targetWidth, newHeight: targetHeight }
    }
    
    if (targetWidth) {
      const ratio = targetWidth / originalWidth
      return { newWidth: targetWidth, newHeight: Math.round(originalHeight * ratio) }
    }
    
    if (targetHeight) {
      const ratio = targetHeight / originalHeight
      return { newWidth: Math.round(originalWidth * ratio), newHeight: targetHeight }
    }
  }
  
  // 清理缓存
  clearCache() {
    this.cache.clear()
    this.loadingPromises.clear()
  }
  
  // 预加载关键图片
  async preloadImages(urls) {
    const promises = urls.map(url => {
      if (typeof url === 'string') {
        return this.getOptimalImageUrl(url)
      } else {
        return this.getOptimalImageUrl(url.src, url.options)
      }
    })
    
    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Preload images failed:', error)
    }
  }
}

// 创建单例实例
export const imageOptimizer = new ImageOptimizer()

// 便捷方法
export const optimizeImage = (url, options) => {
  return imageOptimizer.getOptimalImageUrl(url, options)
}

export const preloadImages = (urls) => {
  return imageOptimizer.preloadImages(urls)
}
