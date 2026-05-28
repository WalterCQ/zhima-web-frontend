import { request } from './index'

export const userProfileAPI = {
  // 获取用户基本信息
  getUserInfo: (id) => request.get(`/users/${id}`),

  // 更新用户基本信息
  updateUserInfo: (id, data) => request.put(`/users/${id}`, data),

  // 获取用户详细资料
  getUserProfile: (id) => request.get(`/users/${id}/profile`),

  // 更新用户详细资料（使用 duducar API）
  updateUserProfile: async (id, data) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.user.updateProfile(data)
      
      if (result.success) {
        return {
          code: 200,
          message: '更新成功',
          data: result.data
        }
      }
      return {
        code: 400,
        message: result.message || '更新失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '更新失败',
        data: null
      }
    }
  },

  // 上传用户头像
  uploadAvatar: (id, formData) => request.upload(`/users/${id}/avatar`, formData),

  // 上传用户背景图
  uploadBackground: (id, formData) => request.upload(`/users/${id}/background`, formData),

  // 获取用户文章列表
  getUserPosts: (id, params = {}) => request.get(`/users/${id}/posts`, params),

  // 获取用户服务列表
  getUserServices: (id, params = {}) => request.get(`/users/${id}/services`, params),

  // 获取用户知马圈列表
  getUserCircles: (id, params = {}) => request.get(`/users/${id}/circles`, params),

  // 获取用户收藏列表（收藏集）
  getUserCollections: (id, params = {}) => request.get(`/users/${id}/collections`, params),

  // 获取用户收藏的所有内容
  getUserFavorites: (id, params = {}) => request.get(`/users/${id}/favorites`, params),

  // 获取用户收藏的帖子
  getUserFavoritePosts: (id, params = {}) => request.get(`/users/${id}/favorites/posts`, params),

  // 获取用户收藏的服务
  getUserFavoriteServices: (id, params = {}) => request.get(`/users/${id}/favorites/services`, params),

  // 获取用户收藏的房产
  getUserFavoriteHousing: (id, params = {}) => request.get(`/users/${id}/favorites/housing`, params),

  // 获取用户收藏的二手车
  getUserFavoriteCars: (id, params = {}) => request.get(`/users/${id}/favorites/cars`, params),

  // 获取用户收藏的招聘信息
  getUserFavoriteJobs: (id, params = {}) => request.get(`/users/${id}/favorites/jobs`, params),

  // 获取用户关注列表（使用 duducar API）
  getUserFollowing: async (id, params = {}) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.getFollowing(id, {
        limit: params.page_size || params.limit || 20,
        cursorTime: params.cursorTime,
        cursorId: params.cursorId
      })
      
      if (result.success) {
        const raw = result.data
        const list = Array.isArray(raw?.list)
          ? raw.list
          : (Array.isArray(raw?.items)
            ? raw.items
            : (Array.isArray(raw) ? raw : []))
        return {
          code: 200,
          message: 'success',
          data: {
            list,
            cursorTime: raw?.nextCursorTime || null,
            cursorId: raw?.nextCursorId || null,
            page: params.page || 1,
            page_size: params.page_size || params.limit || 20
          }
        }
      }
      return {
        code: 400,
        message: result.message || '获取失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取失败',
        data: null
      }
    }
  },

  // 获取用户关注者列表（使用 duducar API）
  getUserFollowers: async (id, params = {}) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.getFollowers(id, {
        limit: params.page_size || params.limit || 20,
        cursorTime: params.cursorTime,
        cursorId: params.cursorId
      })
      
      if (result.success) {
        const raw = result.data
        const list = Array.isArray(raw?.list)
          ? raw.list
          : (Array.isArray(raw?.items)
            ? raw.items
            : (Array.isArray(raw) ? raw : []))
        return {
          code: 200,
          message: 'success',
          data: {
            list,
            cursorTime: raw?.nextCursorTime || null,
            cursorId: raw?.nextCursorId || null,
            page: params.page || 1,
            page_size: params.page_size || params.limit || 20
          }
        }
      }
      return {
        code: 400,
        message: result.message || '获取失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取失败',
        data: null
      }
    }
  },

  // 关注用户（使用 duducar API）
  followUser: async (id) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.follow(id)
      
      if (result.success) {
        return {
          code: 200,
          message: '关注成功',
          data: result.data
        }
      }
      return {
        code: 400,
        message: result.message || '关注失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '关注失败',
        data: null
      }
    }
  },

  // 取消关注用户（使用 duducar API）
  unfollowUser: async (id) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.unfollow(id)
      
      if (result.success) {
        return {
          code: 200,
          message: '已取消关注',
          data: result.data
        }
      }
      return {
        code: 400,
        message: result.message || '操作失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '操作失败',
        data: null
      }
    }
  },

  // 检查是否已关注（使用 duducar API）
  checkFollowStatus: async (id) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.isFollowing(id)
      
      if (result.success) {
        return {
          code: 200,
          message: 'success',
          data: result.data
        }
      }
      return {
        code: 400,
        message: result.message || '查询失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '查询失败',
        data: null
      }
    }
  },

  // 获取互相关注状态（使用 duducar API）
  getMutualFollowStatus: async (id) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.getMutualFollowStatus(id)
      
      if (result.success) {
        return {
          code: 200,
          message: 'success',
          data: result.data
        }
      }
      return {
        code: 400,
        message: result.message || '查询失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '查询失败',
        data: null
      }
    }
  },

  // 获取用户统计信息（使用 duducar API）
  getUserStats: async (id) => {
    try {
      const duducarAPI = (await import('./duducar-integration')).default
      const result = await duducarAPI.follow.getFollowCounts(id)
      
      if (result.success) {
        const raw = result.data || {}
        const followers = (typeof raw.followers === 'number')
          ? raw.followers
          : (typeof raw.followersCount === 'number'
            ? raw.followersCount
            : (typeof raw.followers_count === 'number' ? raw.followers_count : 0))
        const following = (typeof raw.following === 'number')
          ? raw.following
          : (typeof raw.followingCount === 'number'
            ? raw.followingCount
            : (typeof raw.following_count === 'number' ? raw.following_count : 0))
        return {
          code: 200,
          message: 'success',
          data: {
            followers_count: followers,
            following_count: following
          }
        }
      }
      return {
        code: 400,
        message: result.message || '获取失败',
        data: null
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取失败',
        data: null
      }
    }
  },

  // 获取用户动态
  getUserActivities: (id, params = {}) => request.get(`/users/${id}/activities`, params),

  // 获取用户相册
  getUserPhotos: (id, params = {}) => request.get(`/users/${id}/photos`, params),

  // 上传用户照片
  uploadPhoto: (id, formData) => request.upload(`/users/${id}/photos`, formData),

  // 删除用户照片
  deletePhoto: (id, photoId) => request.delete(`/users/${id}/photos/${photoId}`),

  // 获取用户标签
  getUserTags: (id) => request.get(`/users/${id}/tags`),

  // 更新用户标签
  updateUserTags: (id, tags) => request.put(`/users/${id}/tags`, { tags }),

  // 获取用户隐私设置
  getUserPrivacySettings: (id) => request.get(`/users/${id}/privacy`),

  // 更新用户隐私设置
  updateUserPrivacySettings: (id, settings) => request.put(`/users/${id}/privacy`, settings),

  // 获取用户通知设置
  getUserNotificationSettings: (id) => request.get(`/users/${id}/notifications`),

  // 更新用户通知设置
  updateUserNotificationSettings: (id, settings) => request.put(`/users/${id}/notifications`, settings),

  // 举报用户
  reportUser: (id, data) => request.post(`/users/${id}/report`, data),

  // 屏蔽用户
  blockUser: (id) => request.post(`/users/${id}/block`),

  // 取消屏蔽用户
  unblockUser: (id) => request.delete(`/users/${id}/block`),

  // 获取被屏蔽的用户列表
  getBlockedUsers: (params = {}) => request.get('/users/blocked', params),

  // 获取用户认证信息
  getUserVerification: (id) => request.get(`/users/${id}/verification`),

  // 提交用户认证
  submitUserVerification: (id, data) => request.post(`/users/${id}/verification`, data),

  // 获取用户等级信息
  getUserLevel: (id) => request.get(`/users/${id}/level`),

  // 获取用户积分记录
  getUserPoints: (id, params = {}) => request.get(`/users/${id}/points`, params),

  // 获取用户勋章
  getUserBadges: (id) => request.get(`/users/${id}/badges`),

  // 获取用户成就
  getUserAchievements: (id) => request.get(`/users/${id}/achievements`),

  // 搜索用户
  searchUsers: (params = {}) => request.get('/users/search', params),

  // 获取推荐用户
  getRecommendedUsers: (params = {}) => request.get('/users/recommended', params),

  // 获取附近用户
  getNearbyUsers: (params = {}) => request.get('/users/nearby', params),

  // 获取用户在线状态
  getUserOnlineStatus: (id) => request.get(`/users/${id}/online-status`),

  // 设置用户在线状态
  setUserOnlineStatus: (id, status) => request.put(`/users/${id}/online-status`, { status }),

  // 获取用户最后活跃时间
  getUserLastActive: (id) => request.get(`/users/${id}/last-active`),

  // 获取用户设备信息
  getUserDevices: (id) => request.get(`/users/${id}/devices`),

  // 删除用户设备
  deleteUserDevice: (id, deviceId) => request.delete(`/users/${id}/devices/${deviceId}`)
}
