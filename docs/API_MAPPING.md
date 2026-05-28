# API 接口映射表

本文档说明如何将现有的模拟 API 替换为 duducar.cloud 真实 API

---

## 📋 映射规则

| 现有模块 | 现有接口 | duducar API | 状态 | 备注 |
|---------|---------|-------------|------|------|
| **用户认证** | | | | |
| `auth.js` | `login()` | `duducarAPI.user.login()` | ✅ 可替换 | 需要调整参数格式 |
| `auth.js` | `register()` | `duducarAPI.user.register()` | ✅ 可替换 | 需要先发送验证码 |
| `auth.js` | `getUserInfo()` | `duducarAPI.user.getUserInfo()` | ✅ 可替换 | 响应格式一致 |
| `auth.js` | `logout()` | `duducarAPI.user.logout()` | ✅ 可替换 | |
| `user-v2.js` | `sendSms()` | `duducarAPI.user.sendSms()` | ✅ 可替换 | |
| `user-v2.js` | `refresh()` | `duducarAPI.user.refreshToken()` | ✅ 可替换 | |
| `user-v2.js` | `checkPhone()` | `duducarAPI.user.checkPhone()` | ✅ 可替换 | |
| `user-v2.js` | `changePassword()` | `duducarAPI.user.changePassword()` | ✅ 可替换 | |
| `user-v2.js` | `deleteAccount()` | `duducarAPI.user.deleteAccount()` | ✅ 可替换 | |
| `user-v2.js` | `sessions()` | `duducarAPI.user.getActiveSessions()` | ✅ 可替换 | |
| `user-v2.js` | `logoutOthers()` | `duducarAPI.user.logoutOthers()` | ✅ 可替换 | |
| `user-v2.js` | `logoutAll()` | `duducarAPI.user.logoutAll()` | ✅ 可替换 | |
| **用户资料** | | | | |
| `user-profile.js` | `getUserInfo()` | `duducarAPI.user.getUserInfo()` | ✅ 可替换 | |
| `user-profile.js` | `getUserPermissions()` | `duducarAPI.user.getUserPermissions()` | ✅ 可替换 | |
| `user-profile.js` | `followUser()` | `duducarAPI.follow.follow()` | ✅ 可替换 | |
| `user-profile.js` | `unfollowUser()` | `duducarAPI.follow.unfollow()` | ✅ 可替换 | |
| `user-profile.js` | `checkFollowStatus()` | `duducarAPI.follow.isFollowing()` | ✅ 可替换 | |
| `user-profile.js` | `getUserFollowing()` | `duducarAPI.follow.getFollowing()` | ✅ 可替换 | 改用游标分页 |
| `user-profile.js` | `getUserFollowers()` | `duducarAPI.follow.getFollowers()` | ✅ 可替换 | 改用游标分页 |
| **新闻/文章** | | | | |
| `news.js` | `getArticles()` | `duducarAPI.article.getArticles()` | ✅ 可替换 | |
| `news.js` | `getArticleDetail()` | `duducarAPI.article.getArticleDetail()` | ✅ 可替换 | |
| `news.js` | `publishArticle()` | `duducarAPI.article.publishArticle()` | ✅ 可替换 | 需要使用 FormData |
| `news.js` | `likeArticle()` | `duducarAPI.like.toggleLike()` | ✅ 可替换 | |
| `news.js` | `getComments()` | `duducarAPI.comment.getComments()` | ✅ 可替换 | |
| `news.js` | `postComment()` | `duducarAPI.comment.addRootComment()` | ✅ 可替换 | |
| **知马圈** | | | | |
| `circles.js` | `getPosts()` | `duducarAPI.article.getArticles()` | ✅ 可替换 | 使用 channelId 参数 |
| `circles.js` | `getPostDetail()` | `duducarAPI.article.getArticleDetail()` | ✅ 可替换 | |
| `circles.js` | `publishPost()` | `duducarAPI.article.publishArticle()` | ✅ 可替换 | |
| `circles.js` | `likePost()` | `duducarAPI.like.toggleLike()` | ✅ 可替换 | |
| `circles.js` | `unlikePost()` | `duducarAPI.like.toggleLike()` | ✅ 可替换 | 同一个接口 |
| `circles.js` | `getCategories()` | `duducarAPI.article.getChannels()` | ✅ 可替换 | |
| **帖子管理** | | | | |
| `posts.js` | `getPosts()` | `duducarAPI.article.getArticles()` | ✅ 可替换 | |
| `posts.js` | `getPostDetail()` | `duducarAPI.article.getArticleDetail()` | ✅ 可替换 | |
| `posts.js` | `publishPost()` | `duducarAPI.forum.createTopic()` | ✅ 可替换 | 论坛帖子用这个 |
| `posts.js` | `updatePost()` | `duducarAPI.article.updateArticle()` | ✅ 可替换 | |
| `posts.js` | `deletePost()` | `duducarAPI.article.deleteArticle()` | ✅ 可替换 | |
| `posts.js` | `likePost()` | `duducarAPI.like.toggleLike()` | ✅ 可替换 | |
| `posts.js` | `getPostComments()` | `duducarAPI.comment.getComments()` | ✅ 可替换 | |
| `posts.js` | `postComment()` | `duducarAPI.comment.addRootComment()` | ✅ 可替换 | |
| **企业认证** | | | | |
| `company-auth.js` | `getCompanyAuthInfo()` | `duducarAPI.company.getCompanyByUserId()` | ✅ 可替换 | |
| `company-auth.js` | `submitCompanyAuth()` | `duducarAPI.company.createCompany()` | ✅ 可替换 | |
| `company-auth.js` | `updateCompanyAuth()` | `duducarAPI.company.updateCompany()` | ✅ 可替换 | |
| `company-auth.js` | `checkCompanyName()` | `duducarAPI.company.checkCompanyName()` | ✅ 可替换 | |
| `company-auth.js` | `checkCompanyCode()` | `duducarAPI.company.checkCompanyCode()` | ✅ 可替换 | |
| **房产租售** | | | | |
| `housing.js` | `getRentalList()` | `duducarAPI.property.getRentalPropertyList()` | ✅ 可替换 | |
| **首页** | | | | |
| `home.js` | `getBanners()` | `duducarAPI.page.composePage()` | ⚠️ 部分替换 | 从页面组件中提取 |
| `home.js` | `getRecommendedContent()` | `duducarAPI.article.getArticles()` | ✅ 可替换 | 使用随机种子 |
| `home.js` | `getHomepageStats()` | ❌ 无对应接口 | - | 保留现有 |
| `home.js` | `getCategoryNavigation()` | `duducarAPI.page.getAllPages()` | ✅ 可替换 | |
| **通用功能** | | | | |
| `common.js` | `uploadImage()` | ❌ 无对应接口 | - | 需要使用腾讯云COS |
| `common.js` | `getSystemConfig()` | `duducarAPI.page.composePage()` | ⚠️ 部分替换 | |
| **其他模块** | | | | |
| `services.js` | 所有接口 | ❌ 无对应接口 | - | 保留现有模拟数据 |
| `jobs.js` | 所有接口 | ❌ 无对应接口 | - | 保留现有模拟数据 |
| `cars.js` | 所有接口 | ❌ 无对应接口 | - | 保留现有模拟数据 |
| `lifestyle.js` | 所有接口 | `duducarAPI.article.getArticles()` | ✅ 可替换 | 使用特定 pageId |

---

## 🔧 具体替换方案

### 1. 用户认证模块（优先级：⭐⭐⭐⭐⭐）

**替换文件**: `src/api/auth.js`

```javascript
// 原有代码
export const authAPI = {
  login: (data) => request.post('/auth/login', data),
  register: (data) => request.post('/auth/register', data),
  // ...
}

// 替换为
import duducarAPI from './duducar-integration'

export const authAPI = {
  // 登录
  login: async (data) => {
    // 转换参数格式
    const loginData = {
      type: data.loginType || 'password',  // password | sms
      phone: data.username,                 // 使用手机号
      identifier: data.password             // 密码或验证码
    }
    return duducarAPI.user.login(loginData)
  },
  
  // 注册
  register: async (data) => {
    // 第一步：发送验证码
    await duducarAPI.user.sendSms({
      phone: data.phone,
      type: 'register'
    })
    
    // 第二步：注册
    return duducarAPI.user.register({
      phone: data.phone,
      code: data.code
    })
  },
  
  // 获取用户信息
  getUserInfo: () => duducarAPI.user.getUserInfo(),
  
  // 退出登录
  logout: () => duducarAPI.user.logout()
}
```

### 2. 文章管理模块（优先级：⭐⭐⭐⭐⭐）

**替换文件**: `src/api/news.js`

```javascript
// 原有代码
export const newsAPI = {
  getArticles: (params) => request.get('/news/articles', params),
  getArticleDetail: (id) => request.get(`/news/articles/${id}`),
  // ...
}

// 替换为
import duducarAPI from './duducar-integration'

export const newsAPI = {
  // 获取文章列表
  getArticles: (params) => {
    // 转换参数
    const duducarParams = {
      pageId: params.pageId || 1,
      channelId: params.category ? getCategoryChannelId(params.category) : undefined,
      limit: params.page_size || 20,
      offset: ((params.page || 1) - 1) * (params.page_size || 20),
      randomSeed: params.randomSeed
    }
    return duducarAPI.article.getArticles(duducarParams)
  },
  
  // 获取文章详情
  getArticleDetail: (articleId) => duducarAPI.article.getArticleDetail(articleId),
  
  // 发布文章
  publishArticle: (data) => {
    const formData = new FormData()
    formData.append('editType', 1)
    formData.append('articleName', data.title)
    formData.append('articleContent', data.content)
    formData.append('contentType', 1)
    if (data.imageKeys) {
      formData.append('richTextImageKeys', JSON.stringify(data.imageKeys))
    }
    return duducarAPI.article.publishArticle(formData)
  },
  
  // 点赞文章
  likeArticle: (articleId) => duducarAPI.like.toggleLike(articleId),
  
  // 获取评论
  getComments: (articleId, params) => duducarAPI.comment.getComments(articleId, {
    limit: params.page_size || 10,
    offset: ((params.page || 1) - 1) * (params.page_size || 10)
  }),
  
  // 发表评论
  postComment: (articleId, data) => {
    if (data.parent_id) {
      return duducarAPI.comment.addReplyComment(articleId, {
        userId: data.userId,
        parentId: data.parent_id,
        text: data.content
      })
    } else {
      return duducarAPI.comment.addRootComment(articleId, {
        userId: data.userId,
        text: data.content
      })
    }
  }
}

// 辅助函数：分类ID到频道ID的映射
function getCategoryChannelId(category) {
  const mapping = {
    'local': 1,
    'china': 2,
    'official': 3,
    // ... 根据实际情况配置
  }
  return mapping[category]
}
```

### 3. 用户关注模块（优先级：⭐⭐⭐⭐）

**替换文件**: `src/api/user-profile.js`

```javascript
// 原有代码
export const userProfileAPI = {
  followUser: (userId) => request.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => request.delete(`/users/${userId}/follow`),
  // ...
}

// 替换为
import duducarAPI from './duducar-integration'

export const userProfileAPI = {
  // 关注用户
  followUser: (userId) => duducarAPI.follow.follow(userId),
  
  // 取消关注
  unfollowUser: (userId) => duducarAPI.follow.unfollow(userId),
  
  // 检查关注状态
  checkFollowStatus: (userId) => duducarAPI.follow.isFollowing(userId),
  
  // 获取关注列表（改用游标分页）
  getUserFollowing: async (userId, params) => {
    const result = await duducarAPI.follow.getFollowing(userId, {
      limit: params.page_size || 20,
      cursorTime: params.cursorTime,
      cursorId: params.cursorId
    })
    
    // 转换为原有格式
    return {
      success: result.success,
      data: {
        list: result.data,
        // 游标分页不返回 total
      }
    }
  },
  
  // 获取粉丝列表
  getUserFollowers: async (userId, params) => {
    const result = await duducarAPI.follow.getFollowers(userId, {
      limit: params.page_size || 20,
      cursorTime: params.cursorTime,
      cursorId: params.cursorId
    })
    
    return {
      success: result.success,
      data: {
        list: result.data
      }
    }
  },
  
  // 获取关注统计
  getUserStats: async (userId) => {
    const counts = await duducarAPI.follow.getFollowCounts(userId)
    return {
      success: counts.success,
      data: {
        followers_count: counts.data.followersCount,
        following_count: counts.data.followingCount
      }
    }
  }
}
```

### 4. 企业认证模块（优先级：⭐⭐⭐⭐）

**替换文件**: `src/api/company-auth.js`

```javascript
// 原有代码
export const companyAuthAPI = {
  getCompanyAuthInfo: () => request.get('/company/auth'),
  submitCompanyAuth: (data) => request.post('/company/auth', data),
  // ...
}

// 替换为
import duducarAPI from './duducar-integration'

export const companyAuthAPI = {
  // 获取企业认证信息
  getCompanyAuthInfo: async () => {
    const userInfo = await duducarAPI.user.getUserInfo()
    return duducarAPI.company.getCompanyByUserId(userInfo.data.userId)
  },
  
  // 提交企业认证
  submitCompanyAuth: (data) => duducarAPI.company.createCompany(data),
  
  // 更新企业认证
  updateCompanyAuth: (companyId, data) => duducarAPI.company.updateCompany(companyId, data),
  
  // 检查企业名称
  validateCompanyInfo: async (data) => {
    const nameExists = await duducarAPI.company.checkCompanyName(data.companyName)
    const codeExists = await duducarAPI.company.checkCompanyCode(data.companyCode)
    
    return {
      success: true,
      data: {
        nameAvailable: !nameExists.data,
        codeAvailable: !codeExists.data
      }
    }
  }
}
```

### 5. 首页模块（优先级：⭐⭐⭐）

**替换文件**: `src/api/home.js`

```javascript
// 原有代码
export const homeAPI = {
  getBanners: () => request.get('/home/banners'),
  getRecommendedContent: () => request.get('/home/recommended'),
  // ...
}

// 替换为
import duducarAPI from './duducar-integration'

export const homeAPI = {
  // 获取首页轮播图
  getBanners: async () => {
    const pageData = await duducarAPI.page.composePage(1)  // 假设首页 pageId = 1
    
    // 从页面组件中提取轮播图
    const banners = pageData.data.sections
      .find(s => s.sectionName === 'banners')
      ?.components || []
    
    return {
      success: true,
      data: banners
    }
  },
  
  // 获取推荐内容
  getRecommendedContent: async () => {
    const randomSeed = Date.now()  // 使用时间戳作为随机种子
    return duducarAPI.article.getArticles({
      pageId: 1,
      limit: 20,
      offset: 0,
      randomSeed
    })
  },
  
  // 获取分类导航
  getCategoryNavigation: () => duducarAPI.page.getAllPages()
}
```

---

## ⚙️ 统一的请求封装

为了更好地管理 API 调用，建议创建一个统一的适配器：

**新建文件**: `src/api/adapter.js`

```javascript
import duducarAPI from './duducar-integration'

/**
 * API 适配器
 * 将 duducar API 的响应格式转换为项目统一格式
 */
export class APIAdapter {
  /**
   * 转换响应格式
   * @param {Promise} apiCall - API 调用
   */
  static async transform(apiCall) {
    try {
      const result = await apiCall
      
      // duducar API 返回格式: { success, data, message }
      // 项目统一格式: { code: 200, data, message }
      return {
        code: result.success ? 200 : 400,
        data: result.data,
        message: result.message || 'success'
      }
    } catch (error) {
      return {
        code: error.response?.status || 500,
        data: null,
        message: error.message || '请求失败'
      }
    }
  }
  
  /**
   * 转换分页参数
   * 项目格式: { page, page_size }
   * duducar格式: { limit, offset }
   */
  static transformPagination(params) {
    const page = params.page || 1
    const pageSize = params.page_size || params.pageSize || 20
    
    return {
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  }
  
  /**
   * 转换分页响应
   * duducar格式: { list: [] }
   * 项目格式: { list: [], total, page, page_size }
   */
  static transformPaginationResponse(response, params) {
    return {
      list: response.data,
      total: response.total || response.data.length,
      page: params.page || 1,
      page_size: params.page_size || 20,
      hasMore: response.hasMore !== undefined ? response.hasMore : true
    }
  }
}

// 使用示例
export const adaptedAPI = {
  // 文章列表
  getArticles: async (params) => {
    const duducarParams = {
      pageId: params.pageId,
      ...APIAdapter.transformPagination(params)
    }
    
    const result = await APIAdapter.transform(
      duducarAPI.article.getArticles(duducarParams)
    )
    
    if (result.code === 200) {
      result.data = APIAdapter.transformPaginationResponse(result, params)
    }
    
    return result
  }
}
```

---

## 📊 替换优先级

### 第一阶段（立即替换）⭐⭐⭐⭐⭐
- ✅ 用户认证模块 (`auth.js`, `user-v2.js`)
- ✅ 用户关注模块 (`user-profile.js` 的关注功能)
- ✅ 评论模块 (`news.js`, `circles.js` 的评论功能)
- ✅ 点赞模块 (`news.js`, `circles.js`, `posts.js` 的点赞功能)

### 第二阶段（逐步替换）⭐⭐⭐⭐
- ✅ 文章管理模块 (`news.js`, `circles.js`, `posts.js`)
- ✅ 企业认证模块 (`company-auth.js`)
- ✅ 首页模块 (`home.js`)
- ✅ 房产租售模块 (`housing.js`)

### 第三阶段（根据需求替换）⭐⭐⭐
- ⚠️ 页面动态化 (`page.js`)
- ⚠️ 角色权限管理（管理后台）

### 暂不替换 ⚠️
- ❌ 服务模块 (`services.js`) - API 无对应接口
- ❌ 招聘模块 (`jobs.js`) - API 无对应接口
- ❌ 二手车模块 (`cars.js`) - API 无对应接口
- ❌ 生活分享模块 (`lifestyle.js`) - 可用文章接口替代

---

## 🧪 测试策略

### 1. 单元测试

```javascript
// test/api/duducar.test.js
import { describe, it, expect } from 'vitest'
import duducarAPI from '@/api/duducar-integration'

describe('用户 API 测试', () => {
  it('应该能发送短信验证码', async () => {
    const result = await duducarAPI.user.sendSms({
      phone: '+86 15365201234',
      type: 'register'
    })
    
    expect(result.success).toBe(true)
  })
  
  it('应该能用户登录', async () => {
    const result = await duducarAPI.user.login({
      type: 'password',
      phone: '+86 15365201234',
      identifier: 'password123'
    })
    
    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('accessToken')
  })
})
```

### 2. 集成测试

创建一个测试页面来验证 API 是否正常工作：

```vue
<template>
  <div class="api-test-page">
    <h1>API 测试页面</h1>
    
    <section>
      <h2>用户认证</h2>
      <button @click="testLogin">测试登录</button>
      <button @click="testGetUserInfo">获取用户信息</button>
    </section>
    
    <section>
      <h2>文章管理</h2>
      <button @click="testGetArticles">获取文章列表</button>
      <button @click="testPublishArticle">发布文章</button>
    </section>
    
    <pre>{{ testResult }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import duducarAPI from '@/api/duducar-integration'

const testResult = ref({})

const testLogin = async () => {
  const result = await duducarAPI.user.login({
    type: 'password',
    phone: '+86 15365201234',
    identifier: 'test123'
  })
  testResult.value = result
}

// 其他测试函数...
</script>
```

---

## ✅ 替换检查清单

- [ ] 用户认证模块已替换
- [ ] Token 管理机制已实现
- [ ] 文章列表接口已替换
- [ ] 文章详情接口已替换
- [ ] 评论功能已替换
- [ ] 点赞功能已替换
- [ ] 关注功能已替换
- [ ] 企业认证已替换
- [ ] 所有接口已测试通过
- [ ] 错误处理已完善
- [ ] 旧代码已清理

---

## 📝 注意事项

1. **渐进式替换**：不要一次性替换所有接口，逐个模块测试后再替换下一个
2. **保留备份**：替换前备份原有代码，以便出现问题时回滚
3. **数据格式转换**：注意 duducar API 和现有 API 的响应格式差异
4. **错误处理**：统一错误处理机制，确保用户体验一致
5. **Token 管理**：实现 Token 自动刷新和过期处理
6. **兼容性**：保持前端接口调用方式不变，只改变底层实现

---

## 🎯 总结

通过这个映射表，你可以：

1. 清楚地知道哪些接口可以替换
2. 了解如何转换参数和响应格式
3. 制定合理的替换计划
4. 保持项目的稳定性和可维护性

**建议**：从用户认证模块开始，逐步替换其他模块，每个模块替换后都要充分测试！

