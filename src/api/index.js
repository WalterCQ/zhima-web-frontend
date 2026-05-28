import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import router from '@/router'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 全局加载实例
let loadingInstance = null

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加Token
    const token = sessionStorage.getItem('zhimawang_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 显示加载状态（可选）
    if (config.loading !== false) {
      loadingInstance = ElLoading.service({
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.3)'
      })
    }

    return config
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 关闭加载状态
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }

    // 兼容两种返回结构：
    // 1) { code, message, data }
    // 2) { status: 'success'|'error', message, data }
    const payload = response.data || {}
    const isOk = (payload.code === 200) || (payload.status === 'success' || payload.success === true)
    if (!isOk) {
      const msg = payload.message || '请求失败'
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }
    const data = payload.data !== undefined ? payload.data : payload
    return { ...response, data }
  },
  (error) => {
    // 关闭加载状态
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }

    // 处理HTTP错误
    const { response } = error
    let message = '请求失败'

    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 400:
          message = data.message || '请求参数错误'
          break
        case 401:
          message = '登录已过期，请重新登录'
          // 清除登录状态
          sessionStorage.removeItem('zhimawang_token')
          sessionStorage.removeItem('zhimawang_user')
          // 跳转到登录页
          router.push('/auth/login')
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 409:
          message = data.message || '资源冲突'
          break
        case 429:
          message = '请求过于频繁，请稍后再试'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败 (${status})`
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时，请检查网络连接'
    } else {
      message = '网络错误，请检查网络连接'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 通用请求方法
export const request = {
  get: (url, params = {}, config = {}) => {
    return api.get(url, { params, ...config })
  },

  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config)
  },

  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config)
  },

  patch: (url, data = {}, config = {}) => {
    return api.patch(url, data, config)
  },

  delete: (url, params = {}, config = {}) => {
    return api.delete(url, { params, ...config })
  },

  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
  }
}

export default api

