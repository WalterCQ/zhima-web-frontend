import { request } from './index'
import duducarAPI from './duducar-integration'

export const authAPI = {
  // 用户登录
  login: async (data) => {
    try {
      // 转换参数格式以适配 duducar API
      const loginData = {
        type: data.loginType === 'sms' ? 'sms' : 'password',
        phone: data.username || data.phone,
        identifier: data.password || data.code
      }
      
      const result = await duducarAPI.user.login(loginData)
      
      if (result.success) {
        // 保存 token
        sessionStorage.setItem('access_token', result.data.accessToken)
        sessionStorage.setItem('refresh_token', result.data.refreshToken)
        
        // 转换为前端期望的格式
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            userId: result.data.userId,
            username: result.data.username,
            nickname: result.data.nickname,
            userAvatar: result.data.userAvatar,
            role: result.data.role
          }
        }
      }
    } catch (error) {
      return {
        code: 400,
        message: error.message || '登录失败',
        data: null
      }
    }
  },

  // 用户注册
  register: async (data) => {
    try {
      // 如果需要发送验证码
      if (data.needVerifyCode && !data.codeSent) {
        await duducarAPI.user.sendSms({
          phone: data.phone,
          type: 'register'
        })
        return {
          code: 200,
          message: '验证码已发送',
          data: { codeSent: true }
        }
      }
      
      // 注册用户
      const result = await duducarAPI.user.register({
        phone: data.phone,
        code: data.code
      })
      
      if (result.success) {
        const { loginInfo, generatedPassword } = result.data
        
        // 保存 token
        sessionStorage.setItem('access_token', loginInfo.accessToken)
        sessionStorage.setItem('refresh_token', loginInfo.refreshToken)
        
        return {
          code: 200,
          message: '注册成功',
          data: {
            token: loginInfo.accessToken,
            userId: loginInfo.userId,
            username: loginInfo.username,
            nickname: loginInfo.nickname,
            generatedPassword // 返回生成的密码
          }
        }
      }
    } catch (error) {
      return {
        code: 400,
        message: error.message || '注册失败',
        data: null
      }
    }
  },

  // 获取用户信息
  getUserInfo: async () => {
    try {
      const result = await duducarAPI.user.getUserInfo()
      
      if (result.success) {
        return {
          code: 200,
          message: 'success',
          data: result.data
        }
      }
    } catch (error) {
      // 如果 token 过期，尝试刷新
      if (error.response?.status === 401) {
        const refreshToken = sessionStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            const refreshResult = await duducarAPI.user.refreshToken({ refreshToken })
            if (refreshResult.success) {
              sessionStorage.setItem('access_token', refreshResult.data.accessToken)
              sessionStorage.setItem('refresh_token', refreshResult.data.refreshToken)
              
              // 重试获取用户信息
              const retryResult = await duducarAPI.user.getUserInfo()
              if (retryResult.success) {
                return {
                  code: 200,
                  message: 'success',
                  data: retryResult.data
                }
              }
            }
          } catch (refreshError) {
            // 刷新失败，跳转登录
            sessionStorage.removeItem('access_token')
            sessionStorage.removeItem('refresh_token')
            window.location.href = '/login'
          }
        }
      }
      
      return {
        code: error.response?.status || 500,
        message: error.message || '获取用户信息失败',
        data: null
      }
    }
  },

  // 更新用户资料（暂时保留原实现，后续可根据需要接入）
  updateProfile: (data) => request.put('/user/profile', data),

  // 上传头像（暂时保留原实现）
  uploadAvatar: (formData) => request.upload('/user/avatar', formData),

  // 退出登录
  logout: async () => {
    try {
      await duducarAPI.user.logout()
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      
      return {
        code: 200,
        message: '退出成功',
        data: null
      }
    } catch (error) {
      // 即使请求失败也清除本地 token
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      
      return {
        code: 200,
        message: '退出成功',
        data: null
      }
    }
  }
}

