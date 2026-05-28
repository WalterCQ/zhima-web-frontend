<template>
  <div class="api-test-page">
    <div class="header">
      <h1>📡 知马网 API 测试页面</h1>
      <p class="subtitle">测试 duducar.cloud:8888 API 接口</p>
    </div>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>🔐 认证信息</span>
          <el-tag v-if="isLoggedIn" type="success">已登录</el-tag>
          <el-tag v-else type="info">未登录</el-tag>
        </div>
      </template>
      <div v-if="isLoggedIn" class="user-info">
        <p><strong>用户ID:</strong> {{ userInfo?.userId }}</p>
        <p><strong>用户名:</strong> {{ userInfo?.username }}</p>
        <p><strong>昵称:</strong> {{ userInfo?.nickname }}</p>
        <p><strong>角色:</strong> {{ userInfo?.role }}</p>
      </div>
      <div v-else class="login-prompt">
        <p>请先登录以测试需要认证的接口</p>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="user">
        <div class="test-section">
          <h3>📝 用户注册与登录</h3>
          
          <!-- 发送验证码 -->
          <el-card class="api-card">
            <h4>1. 发送短信验证码</h4>
            <el-form :inline="true">
              <el-form-item label="手机号">
                <el-input v-model="smsForm.phone" placeholder="+86 15365201234" style="width: 200px" />
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="smsForm.type" style="width: 120px">
                  <el-option label="注册" value="register" />
                  <el-option label="登录" value="login" />
                  <el-option label="验证" value="verify" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testSendSms" :loading="loading.sms">
                  发送验证码
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 用户登录 -->
          <el-card class="api-card">
            <h4>2. 用户登录</h4>
            <el-form :inline="true">
              <el-form-item label="登录方式">
                <el-select v-model="loginForm.type" style="width: 120px">
                  <el-option label="密码" value="password" />
                  <el-option label="验证码" value="sms" />
                </el-select>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="loginForm.phone" placeholder="+86 15365201234" style="width: 200px" />
              </el-form-item>
              <el-form-item :label="loginForm.type === 'password' ? '密码' : '验证码'">
                <el-input 
                  v-model="loginForm.identifier" 
                  :type="loginForm.type === 'password' ? 'password' : 'text'"
                  :placeholder="loginForm.type === 'password' ? '密码' : '验证码'"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testLogin" :loading="loading.login">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 获取用户信息 -->
          <el-card class="api-card">
            <h4>3. 获取用户信息</h4>
            <el-button type="primary" @click="testGetUserInfo" :loading="loading.userInfo">
              获取用户信息
            </el-button>
            <el-button @click="testGetPermissions" :loading="loading.permissions">
              获取权限信息
            </el-button>
          </el-card>

          <!-- 登出 -->
          <el-card class="api-card">
            <h4>4. 登出</h4>
            <el-button type="danger" @click="testLogout">登出</el-button>
            <el-button type="warning" @click="testLogoutOthers">登出其他设备</el-button>
            <el-button type="warning" @click="testLogoutAll">登出所有设备</el-button>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 文章管理 -->
      <el-tab-pane label="文章管理" name="article">
        <div class="test-section">
          <h3>📰 文章管理</h3>
          
          <!-- 获取文章列表 -->
          <el-card class="api-card">
            <h4>1. 获取文章列表</h4>
            <el-form :inline="true">
              <el-form-item label="页面类型">
                <el-select v-model="articleForm.pageId" style="width: 150px">
                  <el-option label="热门" :value="1" />
                  <el-option label="财经" :value="2" />
                  <el-option label="投资圈" :value="3" />
                  <el-option label="小红书" :value="4" />
                  <el-option label="留学圈" :value="5" />
                </el-select>
              </el-form-item>
              <el-form-item label="数量">
                <el-input-number v-model="articleForm.limit" :min="1" :max="50" style="width: 120px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testGetArticles" :loading="loading.articles">
                  获取文章
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 发布文章 -->
          <el-card class="api-card">
            <h4>2. 发布文章（测试）</h4>
            <el-form label-width="100px">
              <el-form-item label="文章标题">
                <el-input v-model="publishForm.title" placeholder="输入文章标题" />
              </el-form-item>
              <el-form-item label="文章内容">
                <el-input 
                  v-model="publishForm.content" 
                  type="textarea" 
                  :rows="4"
                  placeholder="输入文章内容"
                />
              </el-form-item>
              <el-form-item label="内容类型">
                <el-select v-model="publishForm.contentType">
                  <el-option label="文章" :value="1" />
                  <el-option label="论坛帖" :value="2" />
                  <el-option label="小红书" :value="3" />
                  <el-option label="留学圈" :value="4" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testPublishArticle" :loading="loading.publish">
                  发布文章
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 文章列表展示 -->
          <el-card v-if="articles.length > 0" class="api-card">
            <h4>📋 文章列表 ({{ articles.length }} 篇)</h4>
            <el-table :data="articles" style="width: 100%" max-height="400">
              <el-table-column prop="articleId" label="ID" width="80" />
              <el-table-column prop="articleName" label="标题" />
              <el-table-column prop="author.nickname" label="作者" width="120" />
              <el-table-column prop="viewCount" label="浏览量" width="100" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="small" @click="testGetArticleDetail(scope.row.articleId)">
                    查看详情
                  </el-button>
                  <el-button size="small" type="success" @click="testLikeArticle(scope.row.articleId)">
                    点赞
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 社交功能 -->
      <el-tab-pane label="社交功能" name="social">
        <div class="test-section">
          <h3>👥 社交功能</h3>
          
          <!-- 关注功能 -->
          <el-card class="api-card">
            <h4>1. 用户关注</h4>
            <el-form :inline="true">
              <el-form-item label="目标用户ID">
                <el-input-number v-model="followForm.targetId" :min="1" style="width: 150px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testFollow">关注</el-button>
                <el-button @click="testUnfollow">取消关注</el-button>
                <el-button @click="testCheckFollow">检查状态</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 评论功能 -->
          <el-card class="api-card">
            <h4>2. 文章评论</h4>
            <el-form :inline="true">
              <el-form-item label="文章ID">
                <el-input-number v-model="commentForm.articleId" :min="1" style="width: 150px" />
              </el-form-item>
              <el-form-item label="评论内容">
                <el-input v-model="commentForm.text" placeholder="输入评论" style="width: 300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testAddComment">发表评论</el-button>
                <el-button @click="testGetComments">获取评论</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 企业认证 -->
      <el-tab-pane label="企业认证" name="company">
        <div class="test-section">
          <h3>🏢 企业认证</h3>
          
          <el-card class="api-card">
            <h4>获取企业列表</h4>
            <el-button type="primary" @click="testGetCompanies" :loading="loading.companies">
              获取企业列表
            </el-button>
          </el-card>

          <el-card v-if="companies.length > 0" class="api-card">
            <h4>📋 企业列表 ({{ companies.length }} 家)</h4>
            <el-table :data="companies" style="width: 100%">
              <el-table-column prop="companyId" label="ID" width="80" />
              <el-table-column prop="companyName" label="企业名称" />
              <el-table-column prop="companySize" label="规模" width="100" />
              <el-table-column label="认证状态" width="120">
                <template #default="scope">
                  <el-tag v-if="scope.row.verificationStatus === 2" type="success">已认证</el-tag>
                  <el-tag v-else-if="scope.row.verificationStatus === 1" type="warning">审核中</el-tag>
                  <el-tag v-else type="info">待审核</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 响应结果 -->
      <el-tab-pane label="响应结果" name="response">
        <div class="test-section">
          <h3>📊 最近的 API 响应</h3>
          <el-card class="api-card">
            <el-button @click="clearResponse">清空</el-button>
            <pre class="response-code">{{ formattedResponse }}</pre>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import duducarAPI from '@/api/duducar-integration'

// 状态管理
const activeTab = ref('user')
const userInfo = ref(null)
const articles = ref([])
const companies = ref([])
const lastResponse = ref(null)

// 表单数据
const smsForm = ref({
  phone: '+86 15365201234',
  type: 'register'
})

const loginForm = ref({
  type: 'password',
  phone: '+86 15365201234',
  identifier: ''
})

const articleForm = ref({
  pageId: 4,
  limit: 10
})

const publishForm = ref({
  title: '',
  content: '',
  contentType: 1
})

const followForm = ref({
  targetId: 1
})

const commentForm = ref({
  articleId: 1,
  text: ''
})

// 加载状态
const loading = ref({
  sms: false,
  login: false,
  userInfo: false,
  permissions: false,
  articles: false,
  publish: false,
  companies: false
})

// 计算属性
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('access_token')
})

const formattedResponse = computed(() => {
  return lastResponse.value ? JSON.stringify(lastResponse.value, null, 2) : '暂无响应数据'
})

// API 测试方法
const testSendSms = async () => {
  loading.value.sms = true
  try {
    const result = await duducarAPI.user.sendSms(smsForm.value)
    lastResponse.value = result
    ElMessage.success('验证码发送成功！')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('发送失败：' + error.message)
  } finally {
    loading.value.sms = false
  }
}

const testLogin = async () => {
  loading.value.login = true
  try {
    const result = await duducarAPI.user.login(loginForm.value)
    lastResponse.value = result
    
    if (result.success) {
      localStorage.setItem('access_token', result.data.accessToken)
      localStorage.setItem('refresh_token', result.data.refreshToken)
      userInfo.value = result.data
      ElMessage.success('登录成功！')
    }
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('登录失败：' + error.message)
  } finally {
    loading.value.login = false
  }
}

const testGetUserInfo = async () => {
  loading.value.userInfo = true
  try {
    const result = await duducarAPI.user.getUserInfo()
    lastResponse.value = result
    
    if (result.success) {
      userInfo.value = result.data
      ElMessage.success('获取成功！')
    }
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  } finally {
    loading.value.userInfo = false
  }
}

const testGetPermissions = async () => {
  loading.value.permissions = true
  try {
    const result = await duducarAPI.user.getUserPermissions()
    lastResponse.value = result
    ElMessage.success('获取权限成功！')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  } finally {
    loading.value.permissions = false
  }
}

const testLogout = async () => {
  try {
    await duducarAPI.user.logout()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    userInfo.value = null
    ElMessage.success('已登出')
  } catch (error) {
    ElMessage.error('登出失败：' + error.message)
  }
}

const testLogoutOthers = async () => {
  try {
    await duducarAPI.user.logoutOthers()
    ElMessage.success('已登出其他设备')
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

const testLogoutAll = async () => {
  try {
    await duducarAPI.user.logoutAll()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    userInfo.value = null
    ElMessage.success('已登出所有设备')
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

const testGetArticles = async () => {
  loading.value.articles = true
  try {
    const result = await duducarAPI.article.getArticles({
      pageId: articleForm.value.pageId,
      limit: articleForm.value.limit,
      offset: 0
    })
    lastResponse.value = result
    
    if (result.success && result.data) {
      articles.value = result.data.list || result.data || []
      ElMessage.success(`获取到 ${articles.value.length} 篇文章`)
    }
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  } finally {
    loading.value.articles = false
  }
}

const testPublishArticle = async () => {
  if (!publishForm.value.title || !publishForm.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  
  loading.value.publish = true
  try {
    const formData = new FormData()
    formData.append('editType', 1)
    formData.append('articleName', publishForm.value.title)
    formData.append('articleContent', publishForm.value.content)
    formData.append('contentType', publishForm.value.contentType)
    formData.append('richTextImageKeys', JSON.stringify([]))
    
    const result = await duducarAPI.article.publishArticle(formData)
    lastResponse.value = result
    
    if (result.success) {
      ElMessage.success('文章发布成功！')
      publishForm.value.title = ''
      publishForm.value.content = ''
    }
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('发布失败：' + error.message)
  } finally {
    loading.value.publish = false
  }
}

const testGetArticleDetail = async (articleId) => {
  try {
    const result = await duducarAPI.article.getArticleDetail(articleId)
    lastResponse.value = result
    ElMessage.success('获取文章详情成功')
    activeTab.value = 'response'
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  }
}

const testLikeArticle = async (articleId) => {
  try {
    const result = await duducarAPI.like.toggleLike(articleId)
    lastResponse.value = result
    ElMessage.success('点赞成功')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('操作失败：' + error.message)
  }
}

const testFollow = async () => {
  try {
    const result = await duducarAPI.follow.follow(followForm.value.targetId)
    lastResponse.value = result
    ElMessage.success('关注成功')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('操作失败：' + error.message)
  }
}

const testUnfollow = async () => {
  try {
    const result = await duducarAPI.follow.unfollow(followForm.value.targetId)
    lastResponse.value = result
    ElMessage.success('已取消关注')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('操作失败：' + error.message)
  }
}

const testCheckFollow = async () => {
  try {
    const result = await duducarAPI.follow.isFollowing(followForm.value.targetId)
    lastResponse.value = result
    ElMessage.success('查询成功')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('查询失败：' + error.message)
  }
}

const testAddComment = async () => {
  if (!commentForm.value.text) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    const userId = userInfo.value?.userId || 1
    const result = await duducarAPI.comment.addRootComment(
      commentForm.value.articleId,
      { userId, text: commentForm.value.text }
    )
    lastResponse.value = result
    ElMessage.success('评论成功')
    commentForm.value.text = ''
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('评论失败：' + error.message)
  }
}

const testGetComments = async () => {
  try {
    const result = await duducarAPI.comment.getComments(
      commentForm.value.articleId,
      { limit: 10, offset: 0 }
    )
    lastResponse.value = result
    ElMessage.success('获取评论成功')
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  }
}

const testGetCompanies = async () => {
  loading.value.companies = true
  try {
    const result = await duducarAPI.company.getCompanyList({
      pageNum: 1,
      pageSize: 10
    })
    lastResponse.value = result
    
    if (result.success && result.data) {
      companies.value = result.data.list || []
      ElMessage.success(`获取到 ${companies.value.length} 家企业`)
    }
  } catch (error) {
    lastResponse.value = error
    ElMessage.error('获取失败：' + error.message)
  } finally {
    loading.value.companies = false
  }
}

const clearResponse = () => {
  lastResponse.value = null
}
</script>

<style scoped>
.api-test-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info p {
  margin: 8px 0;
  color: #606266;
}

.login-prompt {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.test-section {
  padding: 20px;
}

.api-card {
  margin-bottom: 20px;
}

.api-card h4 {
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #EBEEF5;
}

.response-code {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.6;
  max-height: 500px;
  overflow-y: auto;
}

.el-tabs {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>

