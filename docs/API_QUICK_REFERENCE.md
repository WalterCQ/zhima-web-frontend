# 知马网 API 快速参考

> **Base URL**: `http://duducar.cloud:8888`  
> **认证**: Bearer Token (JWT)

---

## 📌 快速导航

- [用户管理](#用户管理) - 登录、注册、权限
- [文章管理](#文章管理) - 文章CRUD、频道
- [评论管理](#评论管理) - 评论、回复
- [点赞功能](#点赞功能) - 点赞、取消
- [浏览量](#浏览量管理) - 浏览统计
- [用户关注](#用户关注) - 关注、粉丝
- [论坛主题](#论坛主题) - 帖子、置顶
- [企业认证](#企业认证) - 企业信息
- [资产信息](#资产信息) - 租房、二手车
- [页面管理](#页面管理) - 动态页面

---

## 🔐 用户管理

### POST `/api/user/send-sms` - 发送验证码
```javascript
{
  phone: "+86 15365201234",
  type: "register" | "login" | "verify"
}
```

### POST `/api/user/register` - 用户注册
```javascript
{
  phone: "+86 15365201234",
  code: "123456"
}
// 返回: { loginInfo, generatedPassword }
```

### POST `/api/user/login` - 用户登录
```javascript
{
  type: "password" | "sms",
  phone: "+86 15365201234",
  identifier: "password123"  // 密码或验证码
}
// 返回: { accessToken, refreshToken, userId, nickname... }
```

### POST `/api/user/refresh` - 刷新Token
```javascript
{ refreshToken: "xxx" }
// 返回: { accessToken, refreshToken }
```

### GET `/api/user/info` - 获取用户信息
```javascript
// 返回: { userId, username, nickname, phone, userAvatar, role }
```

### GET `/api/user/check-phone?phone=...` - 检查手机号

### POST `/api/user/change-password` - 修改密码
```javascript
?phone=...&verificationCode=...&newPassword=...
```

### GET `/api/user/sessions` - 获取活跃会话

### POST `/api/user/logout` - 退出登录
### POST `/api/user/logout-others` - 登出其他设备
### POST `/api/user/logout-all` - 登出所有设备
### POST `/api/user/delete-account` - 注销账号

### GET `/api/user/permissions/sections` - 获取用户权限
```javascript
// 返回: { userInfo, roles: [{ roleCode, roleName, roleType }] }
```

---

## 📝 文章管理

### GET `/api/articles` - 获取文章列表
```javascript
?pageId=4&channelId=1&limit=10&offset=0&randomSeed=12345
// pageId: 1=热门, 2=财经, 3=投资圈, 4=小红书, 5=留学圈
```

### GET `/api/articles/{articleId}` - 获取文章详情
```javascript
// 返回: { articleId, articleName, articleContent, images, 
//        comments, author, followStatus, viewCount, replyCount }
```

### POST `/api/articles/publish` - 发布文章（富文本）
```javascript
// FormData
editType: 1           // 1=富文本, 2=普通
articleName: "标题"
articleContent: "内容"
contentType: 1        // 1=文章, 2=论坛, 3=小红书, 4=留学圈
channelId: 1          // 可选
richTextImageKeys: ["common/xxx.jpg"]  // 重要！
isTop: false
isAds: false
```

### POST `/api/articles/publish/legacy` - 发布文章（旧版）
```javascript
{
  articleName: "标题",
  articleContent: "内容",
  channelId: 1,
  imageUrls: ["https://..."],
  isTop: false,
  isAds: false
}
```

### PUT `/api/articles/{articleId}` - 更新文章
```javascript
{
  articleName: "新标题",
  articleContent: "新内容",
  imageUrlsToAdd: ["https://..."],
  imageReplacements: [
    { imageId: 1, newImageUrl: "https://..." },
    { imageId: 2, newImageUrl: "" }  // 删除
  ]
}
```

### DELETE `/api/articles/{articleId}` - 删除文章

### GET `/api/articles/channels?pageId=5` - 获取频道列表

### GET `/api/articles/random-seed` - 生成随机种子

---

## 💬 评论管理

### GET `/api/articles/{articleId}/comments` - 获取评论
```javascript
?limit=10&offset=0
```

### POST `/api/articles/{articleId}/comments` - 添加根评论
```javascript
?userId=1&text=评论内容
```

### POST `/api/articles/{articleId}/comments/reply` - 回复评论
```javascript
?userId=1&parentId=1&text=回复内容
```

---

## 👍 点赞功能

### POST `/api/feed/like?articleId=1` - 点赞/取消点赞

### GET `/api/feed/like-count?articleId=1` - 获取点赞数

---

## 👀 浏览量管理

### POST `/api/articles/{articleId}/views/hit` - 记录浏览
```javascript
// Headers:
X-User-Id: 1         // 已登录用户
X-Session-Id: xxx    // 未登录用户
```

### GET `/api/articles/{articleId}/views` - 获取浏览量

### POST `/api/articles/{articleId}/views/init` - 设置初始值（管理员）
```javascript
?initial=1000
```

### POST `/api/articles/{articleId}/views/incr` - 调整浏览量（管理员）
```javascript
?delta=100  // 正数增加，负数减少
```

---

## 👥 用户关注

### POST `/api/users/{targetId}/follow` - 关注用户

### POST `/api/users/{targetId}/unfollow` - 取消关注

### GET `/api/users/{targetId}/is-following` - 检查关注状态

### GET `/api/users/{targetUserId}/mutual-follow-status` - 互相关注状态
```javascript
// 返回: { isFollowing, isFollowedBy, isMutualFollow }
```

### GET `/api/users/{userId}/following` - 获取关注列表
```javascript
?limit=20&cursorTime=2025-09-05 12:00:00&cursorId=123
```

### GET `/api/users/{userId}/followers` - 获取粉丝列表
```javascript
?limit=20&cursorTime=...&cursorId=...
```

### GET `/api/users/{userId}/follow-counts` - 获取关注统计
```javascript
// 返回: { followingCount, followersCount }
```

---

## 📰 论坛主题

### POST `/api/channels/{channelId}/topics` - 创建帖子
```javascript
{
  title: "标题",
  content: "内容",
  writer: "作者",
  publish: true  // true=发布, false=草稿
}
```

### POST `/api/channels/{channelId}/topics/{articleId}/pin` - 置顶

### POST `/api/channels/{channelId}/topics/{articleId}/unpin` - 取消置顶

---

## 🏢 企业认证

### GET `/api/companies` - 企业列表
```javascript
?pageNum=1&pageSize=10&verificationStatus=2&status=1
```

### POST `/api/companies` - 创建企业认证
```javascript
{
  companyName: "阿里巴巴",
  companyCode: "91330000MA28F45E2F",
  companySize: "1000+",
  companyAddress: "...",
  companyLat: 30.284085,
  companyLng: 120.033362,
  contactPerson: "张经理",
  contactPhone: "0571-12345678",
  userId: 1,
  verificationDocs: ["url1", "url2"]
}
```

### GET `/api/companies/{companyId}` - 企业详情

### GET `/api/companies/user/{userId}` - 用户的企业

### PUT `/api/companies/{companyId}` - 更新企业

### DELETE `/api/companies/{companyId}` - 删除企业

### PUT `/api/companies/{companyId}/verify` - 审核企业（管理员）
```javascript
?verificationStatus=2  // 0=待审核, 1=审核中, 2=已通过, 3=已拒绝
```

### GET `/api/companies/check-name?companyName=...` - 检查名称

### GET `/api/companies/check-code?companyCode=...` - 检查代码

---

## 🏠 资产信息

### GET `/api/properties/rental` - 获取租房列表
```javascript
?pageId=10&limit=10&offset=0&randomSeed=12345
```

---

## 📱 页面管理

### GET `/api/page/list` - 获取首页按钮
```javascript
// 返回: [{ pageId, name, type, sort }]
```

### GET `/api/page/compose?pageId=1` - 获取页面组件
```javascript
// 返回: { 
//   pageName, 
//   sections: [{ sectionName, components }],
//   filters, 
//   channelNavigation 
// }
```

---

## 🔑 权限管理（管理员）

### GET `/api/roles-manage/permissions` - 获取所有权限配置

### PUT `/api/roles-manage/permissions` - 更新权限配置
```javascript
{
  permissionId: 1,
  permissionLogic: "ANY" | "ALL" | "SINGLE",
  requiredPermissions: ["article:create", "article:manage"],
  description: "描述",
  enabled: true
}
```

### GET `/api/roles-manage/all` - 获取所有角色
```javascript
// 返回: [{ roleId, roleCode, roleName }]
```

### POST `/api/roles-manage/assign-role` - 分配角色
```javascript
{
  userId: 123,
  roleId: 5
}
```

---

## 👔 业务角色（管理员）

### GET `/api/business-roles/list` - 获取业务角色列表

### GET `/api/business-roles/{roleId}` - 角色详情

### GET `/api/business-roles/user/{userId}` - 用户的角色

### POST `/api/business-roles/create` - 创建角色
```javascript
{
  roleName: "文章管理员",
  roleCode: "ARTICLE_ADMIN",
  description: "描述",
  status: true,
  permissions: ["article:post", "article:post:edit"]
}
```

### PUT `/api/business-roles/{roleId}` - 更新角色

### DELETE `/api/business-roles/{roleId}` - 删除角色

### POST `/api/business-roles/assign` - 分配角色
```javascript
{ userId: 123, roleId: 5 }
```

### DELETE `/api/business-roles/assign` - 移除角色
```javascript
?userId=123&roleId=5
```

---

## 🖼️ 腾讯云COS

### GET `/api/cos/image/list` - 获取所有图片
```javascript
// 返回: { "common": ["key1.jpg", "key2.jpg"], ... }
```

---

## 🌐 网络信息

### GET `/api/get-ip` - 获取客户端IP

### GET `/api/network/ip-only` - 仅获取IP

---

## 🔄 OpenIM 集成

### POST `/api/auth/enhanced/openim/register` - 导入用户

### POST `/api/auth/enhanced/openim/get-users` - 获取用户列表

### POST `/api/auth/enhanced/openim/get-token` - 获取OpenIM Token

---

## 📊 常用状态码

### 业务状态
- `success` - 成功
- `fail` - 失败
- `error` - 错误

### HTTP 状态码
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未授权（需要登录）
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器错误

---

## 🎯 常用权限码

- `common:view` - 普通浏览（默认）
- `comment:post` - 评论（默认）
- `article:post` - 发布文章
- `article:post:edit` - 编辑文章
- `article:delete` - 删除文章
- `sys:admin` - 系统管理员
- `FORUM_ADMIN` - 论坛管理员
- `FORUM_MOD` - 论坛版主

---

## 🚀 快速开始

```javascript
// 1. 引入 API
import duducarAPI from '@/api/duducar-integration'

// 2. 登录
const result = await duducarAPI.user.login({
  type: 'password',
  phone: '+86 15365201234',
  identifier: 'password123'
})

// 3. 保存 Token
localStorage.setItem('access_token', result.data.accessToken)
localStorage.setItem('refresh_token', result.data.refreshToken)

// 4. 获取文章列表
const articles = await duducarAPI.article.getArticles({
  pageId: 4,
  limit: 10,
  offset: 0
})

// 5. 发布文章
const formData = new FormData()
formData.append('editType', 1)
formData.append('articleName', '标题')
formData.append('articleContent', '内容')
formData.append('contentType', 1)
await duducarAPI.article.publishArticle(formData)
```

---

## 📖 相关文档

- [完整接入指南](./DUDUCAR_API_INTEGRATION.md)
- [API 映射表](./API_MAPPING.md)
- [API 需求文档](./API需求文档.md)

---

**更新日期**: 2025-10-12  
**文档版本**: v1.0

