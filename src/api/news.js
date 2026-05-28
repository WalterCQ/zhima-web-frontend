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

// 统一将后端文章条目转换为前端展示所需结构
const mapArticleListItem = (item) => {
  const author = item.author || {}
  const firstImage = Array.isArray(item.images) && item.images.length > 0 ? (item.images[0].pictureUrl || item.images[0].url || item.images[0]) : (item.coverImage || item.cover_image)
  const plainContent = typeof item.articleContent === 'string' ? item.articleContent.replace(/<[^>]+>/g, '') : ''
  return {
    id: item.articleId ?? item.id,
    title: item.articleName ?? item.title,
    summary: item.summary ?? plainContent.slice(0, 120),
    cover_image: firstImage || null,
    author: {
      id: author.userId ?? author.id,
      nickname: author.nickname || author.displayName || author.username || '匿名',
      avatar: author.userAvatar || author.avatar || null
    },
    views: item.viewCount ?? item.views ?? 0,
    likes: item.likeCount ?? item.likes ?? 0,
    comments: item.commentCount ?? item.replyCount ?? item.comments ?? 0,
    is_liked: item.isLiked ?? false,
    created_at: item.createdAt ?? item.created_at,
    updated_at: item.updatedAt ?? item.updated_at,
    channelId: item.channelId ?? null,
    tags: Array.isArray(item.tags) ? item.tags : []
  }
}

const mapArticleDetail = (item) => {
  const base = mapArticleListItem(item)
  return {
    ...base,
    content: item.articleContent ?? item.content ?? '',
    images: Array.isArray(item.images) ? item.images.map(img => ({
      pictureId: img.pictureId ?? img.id ?? undefined,
      pictureUrl: img.pictureUrl || img.url || img
    })) : []
  }
}

const extractListAndTotal = (data) => {
  if (Array.isArray(data)) {
    return { list: data, total: data.length }
  }
  if (data && Array.isArray(data.items)) {
    return { list: data.items, total: data.total ?? data.items.length }
  }
  if (data && Array.isArray(data.articles)) {
    return { list: data.articles, total: data.total ?? data.articles.length }
  }
  if (data && Array.isArray(data.list)) {
    return { list: data.list, total: data.total ?? data.list.length }
  }
  return { list: [], total: 0 }
}

// 评论扁平化与字段映射
const mapSingleComment = (raw, parentId = null) => {
  const user = {
    id: raw.userId ?? raw.user?.userId ?? raw.user?.id,
    nickname: raw.user?.nickname || raw.user?.displayName || raw.nickname || '匿名',
    avatar: raw.userAvatar || raw.user?.userAvatar || raw.user?.avatar || null
  }
  return {
    id: raw.commentId ?? raw.id,
    parent_id: parentId ?? (raw.parentId ?? raw.parent_id ?? null),
    content: raw.comments ?? raw.content ?? '',
    created_at: raw.createdAt ?? raw.created_at,
    user
  }
}

const flattenComments = (nodes, parentId = null, acc = []) => {
  if (!Array.isArray(nodes)) return acc
  for (const node of nodes) {
    const mapped = mapSingleComment(node, parentId)
    acc.push(mapped)
    const children = node.children || node.replies || node.replyList || []
    if (Array.isArray(children) && children.length) {
      flattenComments(children, mapped.id, acc)
    }
  }
  return acc
}

// 为每个 pageId 维护一个稳定且符合 int32 的随机种子，满足随机排序在分页间一致
const toInt32Seed = (val) => {
  const mod = 0x7fffffff // 2147483647
  const n = Number(val)
  if (!Number.isFinite(n)) return Math.floor(Date.now() / 1000) % mod
  const x = Math.floor(Math.abs(n)) % mod
  return x === 0 ? (Math.floor(Date.now() / 1000) % mod) : x
}

const getOrCreateRandomSeedForPage = async (pageId) => {
  try {
    const key = `article_random_seed_page_${pageId}`
    const cached = sessionStorage.getItem(key)
    if (cached) return toInt32Seed(cached)
    const resp = await duducarAPI.article.generateRandomSeed()
    const raw = resp?.data?.randomSeed ?? Math.floor(Date.now() / 1000)
    const seed = toInt32Seed(raw)
    sessionStorage.setItem(key, String(seed))
    return seed
  } catch {
    const seed = toInt32Seed(Math.floor(Date.now() / 1000))
    try { sessionStorage.setItem(`article_random_seed_page_${pageId}`, String(seed)) } catch {}
    return seed
  }
}

export const newsAPI = {
  // 获取新闻分类 - 使用频道API
  getCategories: async () => {
    try {
      const response = await duducarAPI.article.getChannels(2) // 2=财经/新闻
      if (response.success && response.data) {
        const categories = response.data.map(channel => ({
          id: channel.channelId,
          name: channel.channelName,
          description: channel.channelDescription,
          slug: channel.channelName.toLowerCase()
        }))
        return { code: 200, message: '获取成功', data: categories }
      }
      return { code: 200, message: '获取成功', data: [] }
    } catch (error) {
      console.error('获取新闻分类失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 获取新闻列表 - 使用文章列表API
  getArticles: async (params = {}) => {
    try {
      const limit = params.limit || params.pageSize || 20
      const offset = params.offset ?? ((params.page ? (params.page - 1) : 0) * limit)
      const requestParams = {
        pageId: params.pageId || 1, // 默认 1=热门/推荐
        limit,
        offset,
        randomSeed: params.randomSeed,
        contentType: params.contentType ?? 1
      }
      // 仅当 channelId 为正数时才传给后端
      if (typeof params.channelId === 'number' && params.channelId > 0) {
        requestParams.channelId = params.channelId
      }
      if (requestParams.randomSeed === undefined || requestParams.randomSeed === null) {
        requestParams.randomSeed = await getOrCreateRandomSeedForPage(requestParams.pageId)
      } else {
        // 规范化传入的随机种子为 int32
        requestParams.randomSeed = toInt32Seed(requestParams.randomSeed)
      }
      let response
      try {
        response = await duducarAPI.article.getArticles(requestParams)
      } catch (e) {
        // 回退策略：先去掉随机种子再试一次
        try {
          const noSeedParams = { ...requestParams }
          delete noSeedParams.randomSeed
          response = await duducarAPI.article.getArticles(noSeedParams)
        } catch (e2) {
          // 再回退：若原本为pageId=1则尝试 pageId=2 且不带随机种子
          if ((requestParams.pageId === 1 || !requestParams.pageId) && requestParams.pageId !== 2) {
            const fallbackParams = { ...requestParams, pageId: 2 }
            delete fallbackParams.randomSeed
            response = await duducarAPI.article.getArticles(fallbackParams)
          } else {
            throw e2
          }
        }
      }
      const { list, total } = extractListAndTotal(response.data)
      const mapped = list.map(mapArticleListItem)
      const hasMore = total ? (offset + limit) < total : (mapped.length === limit)
      return { code: 200, message: response.message || '获取成功', data: { list: mapped, total: total || mapped.length, hasMore } }
    } catch (error) {
      console.error('获取新闻列表失败:', error)
      return { code: 200, message: '获取成功', data: { list: [], total: 0, hasMore: false } }
    }
  },

  // 获取文章详情
  getArticleDetail: async (id) => {
    try {
      const response = await duducarAPI.article.getArticleDetail(id)
      // 记录浏览量
      try {
        const userId = sessionStorage.getItem('user_id')
        const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}`
        if (!sessionStorage.getItem('session_id')) {
          sessionStorage.setItem('session_id', sessionId)
        }
        const headers = {}
        if (userId) headers['X-User-Id'] = userId
        headers['X-Session-Id'] = sessionId
        await duducarAPI.articleView.hitView(id, headers)
      } catch (viewError) {
        console.error('记录浏览量失败:', viewError)
      }
      const mapped = mapArticleDetail(response.data || {})
      return { code: 200, message: response.message || '获取成功', data: mapped }
    } catch (error) {
      console.error('获取文章详情失败:', error)
      return { code: 404, message: '文章不存在', data: null }
    }
  },

  // 获取热门文章
  getTrendingArticles: async (limit = 10) => {
    try {
      const randomSeed = await getOrCreateRandomSeedForPage(2)
      const response = await duducarAPI.article.getArticles({
        pageId: 2, // 2=财经/新闻
        limit,
        offset: 0,
        randomSeed,
        contentType: 1
      })
      const { list } = extractListAndTotal(response.data)
      const mapped = list.map(mapArticleListItem)
      return { code: 200, message: response.message || '获取成功', data: mapped }
    } catch (error) {
      console.error('获取热门文章失败:', error)
      return { code: 200, message: '获取成功', data: [] }
    }
  },

  // 文章点赞/取消点赞
  likeArticle: async (id) => {
    try {
      const response = await duducarAPI.like.toggleLike(id)
      return transformResponse(response)
    } catch (error) {
      console.error('文章点赞失败:', error)
      return { code: 500, message: '点赞失败', data: null }
    }
  },

  // 获取文章点赞数
  getLikeCount: async (id) => {
    try {
      const response = await duducarAPI.like.getLikeCount(id)
      return transformResponse(response)
    } catch (error) {
      console.error('获取点赞数失败:', error)
      return { code: 200, message: '获取成功', data: { count: 0 } }
    }
  },

  // 获取文章浏览量
  getViewCount: async (id) => {
    try {
      const response = await duducarAPI.articleView.getViewCount(id)
      return transformResponse(response)
    } catch (error) {
      console.error('获取浏览量失败:', error)
      return { code: 200, message: '获取成功', data: { count: 0 } }
    }
  },

  // 获取文章评论
  getComments: async (id, params = {}) => {
    try {
      const response = await duducarAPI.comment.getComments(id, {
        limit: params.limit || 10,
        offset: params.offset || 0
      })
      // 兼容多种返回结构：可能直接返回 items 为树，也可能为 list
      const data = response.data || {}
      let flat = []
      if (Array.isArray(data.items)) {
        flat = flattenComments(data.items)
      } else if (Array.isArray(data.list)) {
        flat = data.list.map(c => mapSingleComment(c, c.parentId ?? c.parent_id ?? null))
      } else if (Array.isArray(data.comments)) {
        flat = flattenComments(data.comments)
      } else {
        flat = []
      }
      const rootCount = flat.filter(c => !c.parent_id).length
      return {
        code: 200,
        message: response.message || '获取成功',
        data: {
          list: flat,
          total: flat.length,
          root_total: rootCount,
          total_with_children: flat.length
        }
      }
    } catch (error) {
      console.error('获取评论失败:', error)
      return { code: 200, message: '获取成功', data: { comments: [], total: 0 } }
    }
  },

  // 发表评论
  postComment: async (id, data) => {
    try {
      const userId = sessionStorage.getItem('user_id') || 1
      const text = data.content || data.text
      const parentIdVal = data.parentId ?? data.parent_id
      if (parentIdVal) {
        const response = await duducarAPI.comment.addReplyComment(
          id, 
          parseInt(userId), 
          parentIdVal, 
          text
        )
        return transformResponse(response)
      } else {
        const response = await duducarAPI.comment.addRootComment(
          id, 
          parseInt(userId), 
          text
        )
        return transformResponse(response)
      }
    } catch (error) {
      console.error('发表评论失败:', error)
      return { code: 500, message: '发表评论失败', data: null }
    }
  },

  // 发布文章
  publishArticle: async (data) => {
    try {
      const formData = new FormData()

      // 富文本优先，默认 editType=1
      formData.append('editType', data.editType ?? 1)
      formData.append('articleName', data.title || data.articleName)
      formData.append('articleContent', data.content || data.articleContent)
      formData.append('contentType', data.contentType ?? 1)

      if (data.articleWriter) {
        formData.append('articleWriter', data.articleWriter)
      }

      if (data.channelId) {
        formData.append('channelId', data.channelId)
      }

      if (Array.isArray(data.richTextImageKeys)) {
        data.richTextImageKeys.forEach((key) => formData.append('richTextImageKeys', key))
      }

      // 普通模式可选
      if (data.imageFiles && Array.isArray(data.imageFiles)) {
        data.imageFiles.forEach(file => formData.append('imageFiles', file))
      }

      if (data.coverImage) {
        formData.append('coverImage', data.coverImage)
      }

      if (typeof data.isTop === 'boolean') {
        formData.append('isTop', String(data.isTop))
      }
      if (typeof data.isAds === 'boolean') {
        formData.append('isAds', String(data.isAds))
      }
      if (data.targetUrl) {
        formData.append('targetUrl', data.targetUrl)
      }

      const response = await duducarAPI.article.publishArticle(formData)
      return transformResponse(response)
    } catch (error) {
      console.error('发布文章失败:', error)
      return { code: 500, message: '发布失败', data: null }
    }
  },

  // 更新文章
  updateArticle: async (id, data) => {
    try {
      const updateData = {
        articleName: data.title || data.articleName,
        articleContent: data.content || data.articleContent,
        imageUrlsToAdd: data.imageUrlsToAdd || [],
        imageReplacements: data.imageReplacements || []
      }
      if (data.targetUrl) {
        updateData.targetUrl = data.targetUrl
      }
      const response = await duducarAPI.article.updateArticle(id, updateData)
      return transformResponse(response)
    } catch (error) {
      console.error('更新文章失败:', error)
      return { code: 500, message: '更新失败', data: null }
    }
  },

  // 删除文章
  deleteArticle: async (id) => {
    try {
      const response = await duducarAPI.article.deleteArticle(id)
      return transformResponse(response)
    } catch (error) {
      console.error('删除文章失败:', error)
      return { code: 500, message: '删除失败', data: null }
    }
  },

  // 生成随机种子（用于随机排序）
  generateRandomSeed: async () => {
    try {
      const response = await duducarAPI.article.generateRandomSeed()
      return transformResponse(response)
    } catch (error) {
      console.error('生成随机种子失败:', error)
      return { code: 200, message: '获取成功', data: { randomSeed: Date.now() } }
    }
  },

  // 上传图片到COS
  uploadImage: async (file) => {
    try {
      const response = await duducarAPI.cos.uploadCommonImage(file)
      return transformResponse(response)
    } catch (error) {
      console.error('上传图片失败:', error)
      return { code: 500, message: '上传失败', data: null }
    }
  }
}

