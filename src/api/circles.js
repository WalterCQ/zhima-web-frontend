import { request } from './index'
import duducarAPI from './duducar-integration'

// 响应格式转换
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

export const circlesAPI = {
  // 获取知马圈分类（使用频道列表）
  getCategories: async () => {
    try {
      const result = await duducarAPI.article.getChannels(4) // 4=小红书
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取分类失败',
        data: null
      }
    }
  },

  // 获取知马圈列表（暂时保留原实现，可能需要后端支持）
  getCircles: (params = {}) => request.get('/circles', params),

  // 获取知马圈详情（暂时保留原实现）
  getCircleDetail: (id) => request.get(`/circles/${id}`),

  // 创建知马圈（暂时保留原实现）
  createCircle: (data) => request.post('/circles', data),

  // 更新知马圈信息（暂时保留原实现）
  updateCircle: (id, data) => request.put(`/circles/${id}`, data),

  // 删除知马圈（暂时保留原实现）
  deleteCircle: (id) => request.delete(`/circles/${id}`),

  // 加入知马圈（暂时保留原实现）
  joinCircle: (id) => request.post(`/circles/${id}/join`),

  // 退出知马圈（暂时保留原实现）
  leaveCircle: (id) => request.post(`/circles/${id}/leave`),

  // 获取知马圈成员列表（暂时保留原实现）
  getCircleMembers: (id, params = {}) => request.get(`/circles/${id}/members`, params),

  // 获取知马圈帖子列表（使用文章列表接口）
  getCirclePosts: async (id, params = {}) => {
    try {
      const result = await duducarAPI.article.getArticles({
        channelId: id, // 使用圈子ID作为频道ID
        limit: params.page_size || params.limit || 20,
        offset: params.offset || ((params.page || 1) - 1) * (params.page_size || params.limit || 20),
        randomSeed: params.randomSeed
      })
      
      if (result.success) {
        // 转换数据格式
        const data = result.data
        return {
          code: 200,
          message: 'success',
          data: {
            list: Array.isArray(data) ? data : (data.list || []),
            total: data.total,
            page: params.page || 1,
            page_size: params.page_size || params.limit || 20
          }
        }
      }
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取帖子失败',
        data: { list: [], total: 0 }
      }
    }
  },

  // 发布帖子到知马圈（使用论坛接口）
  publishPost: async (id, data) => {
    try {
      const result = await duducarAPI.forum.createTopic(id, {
        title: data.title,
        content: data.content,
        writer: data.writer || data.author,
        publish: data.publish !== false
      })
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '发布失败',
        data: null
      }
    }
  },

  // 获取帖子详情（使用文章详情接口）
  getPostDetail: async (circleId, postId) => {
    try {
      const result = await duducarAPI.article.getArticleDetail(postId)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取详情失败',
        data: null
      }
    }
  },

  // 点赞帖子（使用点赞接口）
  likePost: async (circleId, postId) => {
    try {
      const result = await duducarAPI.like.toggleLike(postId)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '点赞失败',
        data: null
      }
    }
  },

  // 取消点赞帖子（使用点赞接口）
  unlikePost: async (circleId, postId) => {
    try {
      const result = await duducarAPI.like.toggleLike(postId)
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '操作失败',
        data: null
      }
    }
  },

  // 获取帖子评论（使用评论接口）
  getPostComments: async (circleId, postId, params = {}) => {
    try {
      const result = await duducarAPI.comment.getComments(postId, {
        limit: params.page_size || params.limit || 10,
        offset: params.offset || ((params.page || 1) - 1) * (params.page_size || params.limit || 10)
      })
      
      if (result.success) {
        return {
          code: 200,
          message: 'success',
          data: {
            list: result.data.list || result.data || [],
            total: result.data.total,
            page: params.page || 1,
            page_size: params.page_size || params.limit || 10
          }
        }
      }
      return transformResponse(result)
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '获取评论失败',
        data: { list: [], total: 0 }
      }
    }
  },

  // 发表评论（使用评论接口）
  postComment: async (circleId, postId, data) => {
    try {
      const userId = data.userId || JSON.parse(sessionStorage.getItem('userInfo') || '{}').userId || 1
      
      if (data.parent_id || data.parentId) {
        // 回复评论
        const result = await duducarAPI.comment.addReplyComment(postId, {
          userId,
          parentId: data.parent_id || data.parentId,
          text: data.content || data.text
        })
        return transformResponse(result)
      } else {
        // 根评论
        const result = await duducarAPI.comment.addRootComment(postId, {
          userId,
          text: data.content || data.text
        })
        return transformResponse(result)
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        message: error.message || '评论失败',
        data: null
      }
    }
  },

  // 删除评论（暂时保留原实现）
  deleteComment: (circleId, postId, commentId) => request.delete(`/circles/${circleId}/posts/${postId}/comments/${commentId}`),

  // 获取我加入的知马圈（暂时保留原实现）
  getMyCircles: (params = {}) => request.get('/circles/my', params),

  // 获取我创建的知马圈（暂时保留原实现）
  getMyCreatedCircles: (params = {}) => request.get('/circles/created', params),

  // 搜索知马圈（暂时保留原实现）
  searchCircles: (params = {}) => request.get('/circles/search', params),

  // 获取热门知马圈（暂时保留原实现）
  getHotCircles: (limit = 20) => request.get('/circles/hot', { limit }),

  // 推荐知马圈（暂时保留原实现）
  getRecommendedCircles: (params = {}) => request.get('/circles/recommended', params),

  // 上传知马圈封面图片（暂时保留原实现）
  uploadCoverImage: (id, formData) => request.upload(`/circles/${id}/cover`, formData),

  // 设置知马圈管理员（暂时保留原实现）
  setAdmin: (id, userId) => request.post(`/circles/${id}/admins`, { userId }),

  // 移除知马圈管理员（暂时保留原实现）
  removeAdmin: (id, userId) => request.delete(`/circles/${id}/admins/${userId}`),

  // 获取知马圈统计信息（暂时保留原实现）
  getCircleStats: (id) => request.get(`/circles/${id}/stats`),

  // 举报知马圈（暂时保留原实现）
  reportCircle: (id, data) => request.post(`/circles/${id}/report`, data),

  // 举报帖子（暂时保留原实现）
  reportPost: (circleId, postId, data) => request.post(`/circles/${circleId}/posts/${postId}/report`, data)
}
