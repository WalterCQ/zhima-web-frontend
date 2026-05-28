import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { userV2API } from '@/api/user-v2'
import axios from 'axios'
import { authAPI } from '@/api/auth'
import { image } from '@/utils'

// 从sessionStorage加载初始状态（关闭浏览器后自动清除）
const loadStoredState = () => {
  try {
    const stored = sessionStorage.getItem('zhimawang_user_store')
    const token = sessionStorage.getItem('zhimawang_token')
    
    if (stored) {
      const parsed = JSON.parse(stored)
      // 如果有token，确保isLoggedIn为true
      const hasValidToken = token || parsed.token
      return {
        userInfo: parsed.userInfo || null,
        isLoggedIn: hasValidToken ? true : (parsed.isLoggedIn || false),
        token: token || parsed.token || null,
        permissions: parsed.permissions || [],
        loading: false
      }
    }
    
    // 如果没有store数据但有token，说明是刷新后的状态
    if (token) {
      return {
        userInfo: null,
        isLoggedIn: true, // 有token就认为已登录
        token: token,
        permissions: [],
        loading: false
      }
    }
  } catch (error) {
    console.error('加载用户状态失败:', error)
  }
  
  return {
    userInfo: null,
    isLoggedIn: false,
    token: null,
    permissions: [],
    loading: false
  }
}

export const useUserStore = defineStore('user', {
  state: () => loadStoredState(),

  getters: {
    // 获取用户头像
    userAvatar: (state) => {
      return image.getImageUrl(state.userInfo?.avatar, '/avatar-placeholder.svg')
    },
    
    // 获取用户昵称
    userNickname: (state) => {
      return state.userInfo?.nickname || state.userInfo?.username || '用户'
    },

    // 是否为管理员
    isAdmin: (state) => {
      return state.permissions.includes('admin')
    }
  },

  actions: {
    // 保存状态到sessionStorage（关闭浏览器后自动清除）
    saveToStorage() {
      try {
        const stateToSave = {
          userInfo: this.userInfo,
          isLoggedIn: this.isLoggedIn,
          token: this.token,
          permissions: this.permissions
        }
        sessionStorage.setItem('zhimawang_user_store', JSON.stringify(stateToSave))
      } catch (error) {
        console.error('保存用户状态失败:', error)
      }
    },

    // 设置Token
    setToken(token) {
      this.token = token
      sessionStorage.setItem('zhimawang_token', token)
      // 设置axios默认请求头
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        delete axios.defaults.headers.common['Authorization']
      }
      this.saveToStorage()
    },

    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
      this.saveToStorage()
    },

    // 登录
    async login(loginData) {
      try {
        this.loading = true
        const response = await userV2API.login(loginData)
        
        // 检查响应状态
        if (response.code !== 200 || !response.data) {
          ElMessage.error(response.message || '登录失败')
          return { success: false, error: { message: response.message } }
        }
        
        const { data } = response
        const user = {
          id: data.userId,
          username: data.username,
          nickname: data.nickname,
          avatar: data.userAvatar,
          phone: data.phone,
        }
        this.setToken(data.accessToken)
        this.setUserInfo(user)
        sessionStorage.setItem('zhimawang_refresh_token', data.refreshToken)
        sessionStorage.setItem('user_id', data.userId) // 保存用户ID供评论等功能使用
        // 消息提示由组件层处理
        return { success: true, data: user }
      } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error(error.message || '登录失败')
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // 注册
    async register(registerData) {
      try {
        this.loading = true
        const response = await userV2API.register(registerData)
        
        // 检查响应状态
        if (response.code !== 200 || !response.data) {
          ElMessage.error(response.message || '注册失败')
          return { success: false, error: { message: response.message } }
        }
        
        const { data } = response
        const info = data?.loginInfo || {}
        
        // 确保 loginInfo 存在
        if (!info.userId || !info.accessToken) {
          ElMessage.error('注册响应数据不完整')
          return { success: false, error: { message: '注册响应数据不完整' } }
        }
        
        const user = {
          id: info.userId,
          username: info.username,
          nickname: info.nickname,
          avatar: info.userAvatar,
          phone: info.phone,
        }
        this.setToken(info.accessToken)
        this.setUserInfo(user)
        sessionStorage.setItem('zhimawang_refresh_token', info.refreshToken)
        sessionStorage.setItem('user_id', info.userId) // 保存用户ID
        // 消息提示由组件层处理
        return { success: true, data: user, generatedPassword: data.generatedPassword }
      } catch (error) {
        console.error('注册错误:', error)
        ElMessage.error(error.message || '注册失败')
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // 登出
    async logout() {
      try {
        try { await userV2API.logout() } catch {}
        
        // 清除本地状态
        this.userInfo = null
        this.isLoggedIn = false
        this.permissions = []
        this.setToken(null)
        
        // 清除sessionStorage
        sessionStorage.removeItem('zhimawang_token')
        sessionStorage.removeItem('zhimawang_refresh_token')
        sessionStorage.removeItem('zhimawang_user')
        sessionStorage.removeItem('zhimawang_user_store')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user_id')
        
        ElMessage.success('已退出登录')
        
        console.log('登出成功，请在组件中处理页面跳转')
        
      } catch (error) {
        console.error('登出错误:', error)
      }
    },

    // 检查登录状态
    async checkAuth() {
      if (!this.token) return false
      try {
        const { data } = await userV2API.info()
        this.setUserInfo(data)
        return true
      } catch (error) {
        // accessToken 失效则尝试刷新
        const refreshToken = sessionStorage.getItem('zhimawang_refresh_token')
        if (refreshToken) {
          try {
            const res = await userV2API.refresh({ refreshToken })
            this.setToken(res.data.accessToken)
            sessionStorage.setItem('zhimawang_refresh_token', res.data.refreshToken)
            const info = await userV2API.info()
            this.setUserInfo(info.data)
            return true
          } catch {}
        }
        this.logout()
        return false
      }
    },

    // 更新用户资料
    async updateProfile(profileData) {
      try {
        this.loading = true
        const response = await authAPI.updateProfile(profileData)
        this.setUserInfo(response.data)
        ElMessage.success('资料更新成功')
        return { success: true, data: response.data }
      } catch (error) {
        ElMessage.error(error.message || '更新失败')
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // 上传头像
    async uploadAvatar(file) {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', 'avatar')
        
        const response = await authAPI.uploadAvatar(formData)
        
        // 更新用户信息中的头像
        this.userInfo.avatar = response.data.url
        
        ElMessage.success('头像上传成功')
        return { success: true, data: response.data }
      } catch (error) {
        ElMessage.error(error.message || '头像上传失败')
        return { success: false, error }
      } finally {
        this.loading = false
      }
    }
  }
})

