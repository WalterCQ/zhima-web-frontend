import { request } from './index'
import duducarAPI from './duducar-integration'

// 辅助函数：转换响应格式
const transformResponse = (apiResponse) => {
  if (apiResponse.success) {
    return { code: 200, message: apiResponse.message, data: apiResponse.data }
  } else {
    return { code: 400, message: apiResponse.message, data: null }
  }
}

export const postsAPI = {
  // 获取帖子列表 - 使用文章列表API
  getPosts: async (params = {}) => {
    try {
      const response = await duducarAPI.article.getArticles({
        pageId: params.pageId || 4, // 默认使用小红书类型
        channelId: params.channelId || -1,
        limit: params.limit || 20,
        offset: params.offset || 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取帖子列表失败:', error)
      return { code: 200, message: '获取成功', data: { articles: [], total: 0 } }
    }
  },

  // 获取帖子详情
  getPostDetail: async (id) => {
    try {
      const response = await duducarAPI.article.getArticleDetail(id)
      return transformResponse(response)
    } catch (error) {
      console.error('获取帖子详情失败:', error)
      return { code: 404, message: '帖子不存在', data: null }
    }
  },

  // 发布帖子 - 使用文章发布API
  publishPost: async (data) => {
    try {
      const formData = {
        editType: data.editType || 2, // 默认普通文章
        articleName: data.title || data.articleName,
        articleContent: data.content || data.articleContent,
        contentType: data.contentType || 3, // 3=小红书流帖
        channelId: data.channelId,
        imageFiles: data.images || data.imageFiles
      }
      const response = await duducarAPI.article.publishArticle(formData)
      return transformResponse(response)
    } catch (error) {
      console.error('发布帖子失败:', error)
      return { code: 500, message: '发布失败', data: null }
    }
  },

  // 更新帖子
  updatePost: async (id, data) => {
    try {
      const updateData = {
        articleName: data.title || data.articleName,
        articleContent: data.content || data.articleContent,
        imageUrlsToAdd: data.imageUrlsToAdd || [],
        imageReplacements: data.imageReplacements || []
      }
      const response = await duducarAPI.article.updateArticle(id, updateData)
      return transformResponse(response)
    } catch (error) {
      console.error('更新帖子失败:', error)
      return { code: 500, message: '更新失败', data: null }
    }
  },

  // 删除帖子
  deletePost: async (id) => {
    try {
      const response = await duducarAPI.article.deleteArticle(id)
      return transformResponse(response)
    } catch (error) {
      console.error('删除帖子失败:', error)
      return { code: 500, message: '删除失败', data: null }
    }
  },

  // 点赞帖子
  likePost: async (id) => {
    try {
      const response = await duducarAPI.like.toggleLike(id)
      return transformResponse(response)
    } catch (error) {
      console.error('点赞帖子失败:', error)
      return { code: 500, message: '点赞失败', data: null }
    }
  },

  // 取消点赞帖子
  unlikePost: async (id) => {
    try {
      const response = await duducarAPI.like.toggleLike(id)
      return transformResponse(response)
    } catch (error) {
      console.error('取消点赞失败:', error)
      return { code: 500, message: '取消点赞失败', data: null }
    }
  },

  // 获取帖子评论
  getPostComments: async (id, params = {}) => {
    try {
      const response = await duducarAPI.comment.getComments(id, {
        limit: params.limit || 10,
        offset: params.offset || 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取评论失败:', error)
      return { code: 200, message: '获取成功', data: { comments: [], total: 0 } }
    }
  },

  // 发表评论
  postComment: async (id, data) => {
    try {
      const userId = sessionStorage.getItem('user_id') || 1 // 需要从session存储获取用户ID
      if (data.parentId) {
        // 回复评论
        const response = await duducarAPI.comment.addReplyComment(
          id,
          parseInt(userId),
          data.parentId,
          data.content || data.text
        )
        return transformResponse(response)
      } else {
        // 根评论
        const response = await duducarAPI.comment.addRootComment(
          id,
          parseInt(userId),
          data.content || data.text
        )
        return transformResponse(response)
      }
    } catch (error) {
      console.error('发表评论失败:', error)
      return { code: 500, message: '发表评论失败', data: null }
    }
  },

  // 删除评论 - 暂时保留旧实现
  deleteComment: (id, commentId) => request.delete(`/posts/${id}/comments/${commentId}`),

  // 收藏帖子 - 暂时保留旧实现
  favoritePost: (id) => request.post(`/posts/${id}/favorite`),

  // 取消收藏帖子 - 暂时保留旧实现
  unfavoritePost: (id) => request.delete(`/posts/${id}/favorite`),

  // 分享帖子 - 暂时保留旧实现
  sharePost: (id, data) => request.post(`/posts/${id}/share`, data),

  // 举报帖子 - 暂时保留旧实现
  reportPost: (id, data) => request.post(`/posts/${id}/report`, data),

  // 获取热门帖子
  getHotPosts: async (limit = 20) => {
    try {
      const response = await duducarAPI.article.getArticles({
        limit,
        offset: 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取热门帖子失败:', error)
      return { code: 200, message: '获取成功', data: { articles: [], total: 0 } }
    }
  },

  // 获取推荐帖子
  getRecommendedPosts: async (params = {}) => {
    try {
      const response = await duducarAPI.article.getArticles({
        pageId: 1, // 推荐页面
        limit: params.limit || 20,
        offset: params.offset || 0
      })
      return transformResponse(response)
    } catch (error) {
      console.error('获取推荐帖子失败:', error)
      return { code: 200, message: '获取成功', data: { articles: [], total: 0 } }
    }
  },

  // 搜索帖子 - 暂时保留旧实现
  searchPosts: (params = {}) => request.get('/posts/search', params),

  // 上传帖子图片
  uploadPostImage: async (formData) => {
    try {
      const response = await duducarAPI.cos.uploadCommonImage(formData.get('file'))
      return transformResponse(response)
    } catch (error) {
      console.error('上传图片失败:', error)
      return { code: 500, message: '上传失败', data: null }
    }
  },

  // 获取帖子统计信息 - 暂时保留旧实现
  getPostStats: (id) => request.get(`/posts/${id}/stats`)
}
