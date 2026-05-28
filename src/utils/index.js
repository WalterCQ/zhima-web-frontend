import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化时间
 */
export const formatTime = {
  // 相对时间
  fromNow: (time) => dayjs(time).fromNow(),
  
  // 标准格式
  format: (time, format = 'YYYY-MM-DD HH:mm') => dayjs(time).format(format),
  
  // 友好格式
  friendly: (time) => {
    const now = dayjs()
    const target = dayjs(time)
    const diff = now.diff(target, 'day')
    
    if (diff === 0) {
      return target.format('HH:mm')
    } else if (diff === 1) {
      return '昨天 ' + target.format('HH:mm')
    } else if (diff < 7) {
      return diff + '天前'
    } else {
      return target.format('MM-DD')
    }
  }
}

/**
 * 格式化数字
 */
export const formatNumber = {
  // 千分位分隔
  thousands: (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  
  // 简化大数字 (1000 -> 1K)
  compact: (num) => {
    if (num < 1000) return num.toString()
    if (num < 1000000) return Math.floor(num / 1000) + 'K'
    return Math.floor(num / 1000000) + 'M'
  },
  
  // 价格格式化
  price: (price, currency = 'RM') => {
    return `${currency} ${formatNumber.thousands(price)}`
  }
}

/**
 * 验证工具
 */
export const validate = {
  // 邮箱
  email: (email) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return reg.test(email)
  },
  
  // 手机号（马来西亚格式）
  phone: (phone) => {
    const reg = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/
    return reg.test(phone)
  },
  
  // 密码强度
  password: (password) => {
    return password.length >= 3
  },
  
  // 用户名
  username: (username) => {
    const reg = /^[a-zA-Z0-9_]{3,20}$/
    return reg.test(username)
  }
}

/**
 * 工具函数
 */
export const utils = {
  // 防抖
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  // 节流
  throttle: (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
  
  // 深拷贝
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj))
  },
  
  // 生成随机字符串
  randomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },
  
  // 获取文件扩展名
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  },
  
  // 图片压缩
  compressImage: (file, quality = 0.8, maxWidth = 1920) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        const { width, height } = img
        const ratio = Math.min(maxWidth / width, maxWidth / height)
        
        canvas.width = width * ratio
        canvas.height = height * ratio
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
}

/**
 * 本地存储工具
 */
export const storage = {
  // 设置
  set: (key, value, expire = null) => {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  },
  
  // 获取
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue
      
      const data = JSON.parse(item)
      
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        localStorage.removeItem(key)
        return defaultValue
      }
      
      return data.value
    } catch {
      return defaultValue
    }
  },
  
  // 删除
  remove: (key) => {
    localStorage.removeItem(key)
  },
  
  // 清空
  clear: () => {
    localStorage.clear()
  }
}

/**
 * URL工具
 */
export const url = {
  // 获取查询参数
  getQuery: (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  },
  
  // 构建查询字符串
  buildQuery: (params) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key])
      }
    })
    return searchParams.toString()
  }
}

/**
 * 图片URL工具
 */
export const image = {
  /**
   * 获取完整的图片 URL
   * @param {string} path - 图片路径（可以是相对路径或完整 URL）
   * @param {string} defaultImage - 默认图片路径
   * @returns {string} 完整的图片 URL
   */
  getImageUrl: (path, defaultImage = '/avatar-placeholder.svg') => {
    // 如果没有提供路径，返回默认图片
    if (!path) {
      return defaultImage
    }
    
    // 如果已经是完整的 URL（http:// 或 https://），直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // 如果是本地静态资源（以 / 开头），直接返回
    if (path.startsWith('/')) {
      return path
    }
    
    // 如果是相对路径（如 chatsImg/xxx.jpg），拼接服务器地址
    const baseURL = 'http://duducar.cloud:8888'
    return `${baseURL}/${path}`
  }
}

