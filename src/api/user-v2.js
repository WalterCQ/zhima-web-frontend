import duducarAPI from './duducar-integration'

// 将 duducar API 响应格式转换为项目统一格式
const transformResponse = (result) => {
  if (result.success) {
    return {
      code: 200,
      message: result.message || 'success',
      data: result.data
    }
  } else {
    return {
      code: 400,
      message: result.message || '请求失败',
      data: null
    }
  }
}

export const userV2API = {
  async sendSms(body) {
    try {
      const result = await duducarAPI.user.sendSms(body)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '发送失败',
        data: null
      }
    }
  },
  
  async register(body) {
    try {
      const result = await duducarAPI.user.register(body)
      if (result.success) {
        // 保存 token
        const { loginInfo } = result.data
        sessionStorage.setItem('access_token', loginInfo.accessToken)
        sessionStorage.setItem('refresh_token', loginInfo.refreshToken)
      }
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '注册失败',
        data: null
      }
    }
  },
  
  async refresh(body) {
    try {
      const result = await duducarAPI.user.refreshToken(body)
      if (result.success) {
        // 更新 token
        sessionStorage.setItem('access_token', result.data.accessToken)
        sessionStorage.setItem('refresh_token', result.data.refreshToken)
      }
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '刷新失败',
        data: null
      }
    }
  },
  
  async logout() {
    try {
      const result = await duducarAPI.user.logout()
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      return transformResponse(result)
    } catch (error) {
      // 即使失败也清除本地 token
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      return {
        code: 200,
        message: '已退出',
        data: null
      }
    }
  },
  
  async logoutOthers() {
    try {
      const result = await duducarAPI.user.logoutOthers()
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '操作失败',
        data: null
      }
    }
  },
  
  async logoutAll() {
    try {
      const result = await duducarAPI.user.logoutAll()
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      return transformResponse(result)
    } catch (error) {
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      return {
        code: 200,
        message: '已退出',
        data: null
      }
    }
  },
  
  async login(body) {
    try {
      console.log('🔍 登录请求数据:', body)
      const result = await duducarAPI.user.login(body)
      console.log('✅ 登录响应:', result)
      if (result.success) {
        // 保存 token
        sessionStorage.setItem('access_token', result.data.accessToken)
        sessionStorage.setItem('refresh_token', result.data.refreshToken)
      }
      return transformResponse(result)
    } catch (error) {
      console.error('❌ 登录失败:', error)
      console.error('错误详情:', error.response?.data || error.message)
      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || error.message || '登录失败',
        data: null
      }
    }
  },
  
  async deleteAccount() {
    try {
      const result = await duducarAPI.user.deleteAccount()
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '注销失败',
        data: null
      }
    }
  },
  
  async changePassword(params) {
    try {
      const result = await duducarAPI.user.changePassword(params)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '修改失败',
        data: null
      }
    }
  },
  
  async sessions() {
    try {
      const result = await duducarAPI.user.getActiveSessions()
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取失败',
        data: null
      }
    }
  },
  
  async info() {
    try {
      const result = await duducarAPI.user.getUserInfo()
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取失败',
        data: null
      }
    }
  },
  
  async checkPhone(params) {
    try {
      const result = await duducarAPI.user.checkPhone(params.phone)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '检查失败',
        data: null
      }
    }
  }
}



