<template>
  <div class="news-detail-page">
    <div class="container">
      <div class="detail-layout">
        <!-- 主内容 -->
        <main class="article-main">
          <div class="article-header">
            <div class="breadcrumb">
              <router-link to="/">首页</router-link>
              <span class="separator">/</span>
              <router-link to="/news">资讯新闻</router-link>
              <span class="separator">/</span>
              <span>正文</span>
            </div>
            
            <h1 class="article-title">{{ article.title }}</h1>
            
            <div class="article-meta">
              <div class="author-info">
                <img :src="article.author?.avatar || 'https://picsum.photos/40/40?random=102'" class="author-avatar" @click="goToUser(article.author?.id)" style="cursor:pointer;">
                <div class="author-details">
                  <span class="author-name" @click="goToUser(article.author?.id)" style="cursor:pointer;">{{ article.author?.nickname }}</span>
                </div>
              </div>
              
              <div class="article-stats">
                <span class="stat-item"><Clock class="inline-icon" /> {{ formatTime.format(article.created_at) }}</span>
                <span class="stat-item"><Eye class="inline-icon" /> {{ formatNumber.compact(article.views) }} 浏览</span>
                <span class="stat-item"><MessageCircle class="inline-icon" /> {{ commentsCount || article.comments || 0 }} 评论</span>
                <span class="stat-item"><Heart class="inline-icon" /> {{ article.likes }} 点赞</span>
              </div>
            </div>
          </div>

          <div class="article-content">
            <div v-if="article.cover_image" class="article-cover">
              <img 
                :src="article.cover_image" 
                :alt="article.title"
                loading="eager"
                decoding="async"
                @error="handleImageError"
              >
            </div>
            
            <div class="article-body" v-html="article.content"></div>
            
            <div class="article-tags" v-if="articleDisplayedTags.length">
              <span class="tag-label">标签：</span>
              <el-tag 
                v-for="tag in articleDisplayedTags" 
                :key="tag"
                class="article-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="article-actions">
            <el-button 
              type="primary" 
              @click="toggleLike"
            >
              <Heart class="inline-icon" /> {{ article.is_liked ? '已点赞' : '点赞' }} ({{ article.likes }})
            </el-button>
            <el-button><Share2 class="inline-icon" /> 分享</el-button>
            <el-button @click="toggleBookmark"><Bookmark class="inline-icon" /> {{ article.is_bookmarked ? '已收藏' : '收藏' }}</el-button>
          </div>

          <!-- 评论区域 -->
          <div class="comments-section">
            <!-- 顶部发表评论 -->
            <div class="comment-form" v-if="userStore.isLoggedIn">
              <div class="comment-editor">
                <img :src="userStore.userAvatar || 'https://picsum.photos/40/40?random=103'" class="comment-editor-avatar" alt="avatar">
                <div class="comment-editor-main">
                  <el-input
                    v-model="newComment"
                    type="textarea"
                    :rows="3"
                    placeholder="发表你的看法..."
                    class="comment-input"
                  />
                  <div class="comment-actions">
                    <el-button type="primary" @click="submitComment">发布评论</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="comment-form" v-else>
              <div class="comment-editor">
                <img src="https://picsum.photos/40/40?random=104" class="comment-editor-avatar" alt="avatar">
                <div class="comment-editor-main">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请先登录后发表评论"
                    class="comment-input"
                    disabled
                  />
                  <div class="comment-actions">
                    <el-button type="primary" @click="goLogin">登录</el-button>
                  </div>
                </div>
              </div>
            </div>

            <h3 class="comments-title">评论 ({{ commentsCount }})</h3>
            
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="comment-item"
              >
                <img :src="comment.user?.avatar || 'https://picsum.photos/40/40?random=105'" class="comment-avatar">
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.user?.nickname }}</span>
                    <span class="comment-time">{{ formatTime.friendly(comment.created_at) }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-footer">
                    <button class="btn btn-text reply-toggle" @click="toggleReply(comment)"><MessageCircle class="action-icon" /> 回复</button>
                  </div>

                  <!-- 回复编辑器（仅针对一级评论，保证二级为最大层级） -->
                  <div v-if="replyingToId === comment.id" class="reply-editor">
                    <el-input
                      v-model="replyContent"
                      type="textarea"
                      :rows="3"
                      :placeholder="replyPlaceholder"
                      class="reply-input"
                    />
                    <div class="reply-actions">
                      <el-button size="small" type="primary" @click="submitReply">发布回复</el-button>
                      <el-button size="small" @click="cancelReply">取消</el-button>
                    </div>
                  </div>

                  <!-- 二级评论列表 -->
                  <div v-if="comment.children && comment.children.length" class="comment-children">
                    <div 
                      v-for="child in getVisibleChildren(comment)" 
                      :key="child.id"
                      class="reply-item"
                    >
                      <img :src="child.user?.avatar || 'https://picsum.photos/40/40?random=106'" class="comment-avatar child-avatar">
                      <div class="reply-content">
                        <div class="comment-header reply-header">
                          <span class="comment-author reply-author">{{ child.user?.nickname }}</span>
                          <span class="comment-time reply-time">{{ formatTime.friendly(child.created_at) }}</span>
                        </div>
                        <div class="reply-text">
                          <template v-if="child.reply_to_nickname">
                            <span class="text-secondary">回复 </span><span class="comment-author">@{{ child.reply_to_nickname }}</span><span class="text-secondary">：</span>
                          </template>
                          {{ child.content }}
                        </div>
                        <div class="reply-actions-row">
                          <button class="btn btn-text reply-toggle" @click="toggleReply(child, comment.id)"><MessageCircle class="action-icon" /> 回复</button>
                        </div>
                      </div>
                    </div>
                    <div v-if="comment.children.length > defaultChildVisibleCount" class="reply-toggle-row">
                      <button class="btn btn-text" @click="toggleChildren(comment)">
                        {{ isExpanded(comment) ? '收起回复' : `展开更多回复(${comment.children.length - defaultChildVisibleCount})` }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论分页 -->
            <div class="comments-pagination" v-if="commentsRootTotal > commentsPageSize">
              <el-pagination
                v-model:current-page="commentsPage"
                :page-size="commentsPageSize"
                :total="commentsRootTotal"
                layout="total, prev, pager, next, jumper"
                @current-change="handleCommentsPageChange"
              />
            </div>
          </div>
        </main>

        <!-- 侧边栏 -->
        <aside class="article-sidebar cambodia-sidebar">
          <h3 class="sidebar-title">相关推荐</h3>
          <div class="related-articles">
            <div 
              v-for="item in relatedArticles" 
              :key="item.id"
              class="related-item"
              @click="goToArticle(item.id)"
            >
              <img :src="item.cover_image || 'https://picsum.photos/300/200?random=107'" class="related-image">
              <div class="related-content">
                <h5 class="related-title">{{ item.title }}</h5>
                <span class="related-time">{{ formatTime.friendly(item.created_at) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- 登录提示弹窗 -->
  <div v-if="showLoginModal" class="modal-overlay login-modal-overlay" @click="showLoginModal = false">
    <div class="login-modal" @click.stop>
      <button class="login-modal-close" @click="showLoginModal = false">
        <Plus style="transform: rotate(45deg); width: 16px; height: 16px;" />
      </button>
      <div class="login-modal-content">
        <div class="login-modal-icon">🔐</div>
        <h3 class="login-modal-title">请先登录才能进行此操作</h3>
        <p class="login-modal-desc">登录后即可使用点赞、收藏、评论等功能</p>
        <div class="login-modal-actions">
          <button class="login-btn" @click="goToLogin">
            <User :size="16" />
            立即登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsAPI } from '@/api/news'
import { useUserStore } from '@/stores/user'
import { formatTime, formatNumber } from '@/utils'
import { Eye, MessageCircle, Heart, Share2, Bookmark, Clock, Plus, User } from 'lucide-vue-next'

// SEO结构化数据
const addArticleStructuredData = (article) => {
  // 移除已存在的结构化数据
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => {
    if (script.textContent.includes('NewsArticle')) {
      script.remove()
    }
  })

  // 添加NewsArticle结构化数据
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title || '',
    "description": article.summary || '',
    "image": article.cover_image || '',
    "datePublished": article.created_at || '',
    "dateModified": article.updated_at || article.created_at || '',
    "author": {
      "@type": "Person",
      "name": article.author?.nickname || '匿名'
    },
    "publisher": {
      "@type": "Organization",
      "name": "知马网",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zhimawang.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://zhimawang.com/news/${article.id}`
    }
  }

  // 动态添加结构化数据
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(articleSchema)
  document.head.appendChild(script)
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const article = ref({})
// comments 保存为树结构；commentsCount 统计总条目数
const comments = ref([]) // 当前页的根评论（含其子回复）
const commentsCount = ref(0) // 所有评论总数（含子回复）
const commentsRootTotal = ref(0) // 根评论总数
const commentsPage = ref(1)
const commentsPageSize = ref(10)
const relatedArticles = ref([])
const newComment = ref('')
const loading = ref(false)
const showLoginModal = ref(false)

function goToUser(userId) {
  if (!userId) return
  try { router.push(`/user/${userId}`) } catch (e) {}
}

// 回复编辑器状态（支持对二级回复继续回复：在UI上仍展示为二级，并带@提示）
const replyingToId = ref(null) // 当前展开回复编辑器所在的根评论ID
const replyContent = ref('')
const replyTargetId = ref(null) // 实际提交的parent_id（可能是一级或二级）
const replyTargetNickname = ref('')
const replyPlaceholder = computed(() => replyTargetNickname.value ? `回复 @${replyTargetNickname.value}...` : '回复...')

// 二级回复折叠/展开
const defaultChildVisibleCount = 2
const expandedCommentIds = ref(new Set())
const isExpanded = (comment) => expandedCommentIds.value.has(comment.id)
const toggleChildren = (comment) => {
  const set = new Set(expandedCommentIds.value)
  if (set.has(comment.id)) set.delete(comment.id)
  else set.add(comment.id)
  expandedCommentIds.value = set
}
const getVisibleChildren = (comment) => {
  if (!comment.children) return []
  return isExpanded(comment) ? comment.children : comment.children.slice(0, defaultChildVisibleCount)
}

// 限定允许的文章标签集合
const allowedTags = new Set(['马来西亚','华人社区','政策解读','经济发展','文化交流','教育资讯','投资理财','生活服务','旅游观光','科技创新'])
const articleDisplayedTags = computed(() => {
  const raw = Array.isArray(article.value?.tags) ? article.value.tags : []
  return raw.filter(t => allowedTags.has(t))
})

// 将扁平评论列表构建为“根评论 + 二级回复”的树结构。
// 对二级回复继续回复时：仍归并为根评论的二级，并标注 reply_to_nickname 用于 @ 展示。
const buildCommentTree = (flatList) => {
  const rawMap = new Map()
  flatList.forEach((item) => rawMap.set(item.id, item))
  const nodeMap = new Map()
  flatList.forEach((item) => nodeMap.set(item.id, { ...item, children: [], reply_to_nickname: null }))
  const roots = []
  // 先收集所有根评论
  flatList.forEach((item) => {
    if (!item.parent_id) roots.push(nodeMap.get(item.id))
  })
  // 将所有非根评论挂在其根评论下
  flatList.forEach((item) => {
    if (!item.parent_id) return
    const node = nodeMap.get(item.id)
    let parent = nodeMap.get(item.parent_id)
    if (!parent) {
      // 找不到父节点，降级为根
      roots.push(node)
      return
    }
    // 找到根祖先
    let rootAncestor = parent
    while (rawMap.get(rootAncestor.id)?.parent_id) {
      const nextParentId = rawMap.get(rootAncestor.id).parent_id
      const nextParent = nodeMap.get(nextParentId)
      if (!nextParent) break
      rootAncestor = nextParent
    }
    // 如果直接父不是根，则设置 @ 对象为父的昵称
    if (rawMap.get(parent.id)?.parent_id) {
      node.reply_to_nickname = parent.user?.nickname || ''
    }
    rootAncestor.children.push(node)
  })
  return roots
}

// 方法
const loadArticle = async () => {
  try {
    loading.value = true
    const id = route.params.id
    const response = await newsAPI.getArticleDetail(id)
    article.value = response.data
    // 添加SEO结构化数据
    addArticleStructuredData(article.value)
    // 刷新浏览量（与后端hit防刷机制配合）
    try {
      const vc = await newsAPI.getViewCount(id)
      const cnt = vc?.data?.count ?? vc?.data?.total ?? vc?.data?.views ?? 0
      if (Number.isFinite(cnt)) {
        article.value.views = cnt
      }
    } catch {}
    // 刷新点赞数
    try {
      const lc = await newsAPI.getLikeCount(id)
      const likeNum = lc?.data?.count ?? 0
      if (Number.isFinite(likeNum)) {
        article.value.likes = likeNum
      }
    } catch {}
  } catch (error) {
    console.error('加载文章失败:', error)
    // 使用模拟数据
    loadMockArticle()
    // 添加SEO结构化数据
    addArticleStructuredData(article.value)
  } finally {
    loading.value = false
  }
}

const loadMockArticle = () => {
  article.value = {
    id: route.params.id,
    title: '马来西亚2025年度预算案重点解读 - 数字经济发展与绿色能源转型',
    content: `
      <p>2025年马来西亚预算案已于近日公布，这份预算案对于在马来西亚的华人群体具有重要意义。本文将为大家详细解读预算案中的重点内容。</p>
      
      <h2>一、数字经济发展重点</h2>
      <p>政府将大力推动数字经济发展，预计投入50亿令吉用于：</p>
      <ul>
        <li>5G网络基础设施建设</li>
        <li>数字技能培训项目</li>
        <li>中小企业数字化转型支持</li>
      </ul>
      
      <h2>二、绿色能源转型计划</h2>
      <p>为应对气候变化挑战，政府提出了雄心勃勃的绿色能源计划：</p>
      <p>到2030年，可再生能源占比将达到31%，这将为相关行业带来巨大机遇。</p>
      
      <h2>三、中小企业扶持政策</h2>
      <p>针对中小企业，政府推出了一系列扶持措施，包括税收减免、贷款优惠等。</p>
      
      <p>总的来说，这份预算案体现了马来西亚政府对于经济转型和可持续发展的决心，为华人企业家和投资者提供了新的机遇。</p>
    `,
    cover_image: 'https://picsum.photos/800/400?random=108',
    author: {
      nickname: '政策分析师',
      avatar: 'https://picsum.photos/40/40?random=109'
    },
    views: 2300,
    comments: 45,
    likes: 128,
    is_liked: false,
    is_bookmarked: false,
    tags: ['政策', '预算案', '经济', '数字化'],
    created_at: '2025-03-15T10:00:00Z'
  }
}

const loadComments = async () => {
  try {
    const id = route.params.id
    const response = await newsAPI.getComments(id, { page: commentsPage.value, pageSize: commentsPageSize.value })
    const list = response.data.list || []
    const rootPage = buildCommentTree(list)
    comments.value = rootPage
    // 接口若能返回根评论总数与全量总数最好；做兼容
    commentsRootTotal.value = response.data.root_total ?? response.data.total ?? rootPage.length
    commentsCount.value = response.data.total_with_children ?? response.data.total ?? list.length
  } catch (error) {
    // 使用模拟数据
    const flat = []
    for (let i = 0; i < 5; i++) {
      const id = i + 1
      flat.push({
        id,
        content: `这是第 ${id} 条评论，用户对文章内容的看法和建议...`,
        user: { nickname: `用户${id}`, avatar: 'https://picsum.photos/40/40?random=110' },
        created_at: `2025-03-${15 - i}T${10 + i}:00:00Z`,
        parent_id: null
      })
      // 为前两条添加二级回复
      if (i < 2) {
        for (let j = 0; j < 2; j++) {
          const childId = id * 10 + j + 1
          flat.push({
            id: childId,
            content: `回复 ${id}-${j + 1}：这是对评论 ${id} 的补充观点...`,
            user: { nickname: `用户${id}-${j + 1}`, avatar: 'https://picsum.photos/40/40?random=111' },
            created_at: `2025-03-${15 - i}T${11 + j}:30:00Z`,
            parent_id: id
          })
        }
      }
    }
    const tree = buildCommentTree(flat)
    // 模拟分页
    commentsRootTotal.value = tree.length
    const start = (commentsPage.value - 1) * commentsPageSize.value
    const end = start + commentsPageSize.value
    comments.value = tree.slice(start, end)
    commentsCount.value = flat.length
  }
}

const handleCommentsPageChange = (page) => {
  commentsPage.value = page
  loadComments()
  // 平滑滚动到评论标题
  try {
    const el = document.querySelector('.comments-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch {}
}

const loadRelatedArticles = async () => {
  try {
    const response = await newsAPI.getArticles({ pageSize: 5 })
    relatedArticles.value = response.data.list.filter(item => item.id != route.params.id)
  } catch (error) {
    // 使用模拟数据
    relatedArticles.value = Array.from({ length: 5 }, (_, i) => ({
      id: 100 + i,
      title: `相关文章标题 ${i + 1}`,
      cover_image: 'https://picsum.photos/800/400?random=108',
      created_at: `2025-03-${14 - i}T10:00:00Z`
    }))
  }
}

const toggleLike = async () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  try {
    await newsAPI.likeArticle(article.value.id)
    article.value.is_liked = !article.value.is_liked
    article.value.likes += article.value.is_liked ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const toggleBookmark = async () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  try {
    article.value.is_bookmarked = !article.value.is_bookmarked
    ElMessage.success(article.value.is_bookmarked ? '收藏成功' : '取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const submitComment = async () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    await newsAPI.postComment(article.value.id, {
      content: newComment.value
    })
    
    // 重新加载评论
    loadComments()
    newComment.value = ''
    ElMessage.success('评论发布成功')
  } catch (error) {
    ElMessage.error('评论发布失败')
  }
}

const toggleReply = (target, rootId) => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  const currentRootId = rootId || target.id
  if (replyingToId.value === currentRootId) {
    replyingToId.value = null
    replyContent.value = ''
    replyTargetId.value = null
    replyTargetNickname.value = ''
    return
  }
  replyingToId.value = currentRootId
  replyContent.value = ''
  replyTargetId.value = target.id
  replyTargetNickname.value = target.user?.nickname || ''
}

const cancelReply = () => {
  replyingToId.value = null
  replyContent.value = ''
  replyTargetId.value = null
  replyTargetNickname.value = ''
}

const submitReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  try {
    await newsAPI.postComment(article.value.id, {
      content: replyContent.value,
      parent_id: replyTargetId.value
    })
    await loadComments()
    replyingToId.value = null
    replyContent.value = ''
    replyTargetId.value = null
    replyTargetNickname.value = ''
    ElMessage.success('回复发布成功')
  } catch (error) {
    ElMessage.error('回复发布失败')
  }
}

const goToArticle = (id) => {
  router.push(`/news/${id}`)
}

const goLogin = () => {
  router.push('/auth/login')
}

const goToLogin = () => {
  showLoginModal.value = false
  router.push('/auth/login')
}

// 图片错误处理
const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/800/400?random=999'
}

// 初始化
onMounted(() => {
  loadArticle()
  loadComments()
  loadRelatedArticles()
})

// 监听路由变化
watch(() => route.params.id, () => {
  if (route.name === 'NewsDetail') {
    loadArticle()
    loadComments()
  }
})
</script>

<style scoped>
/* 登录提示模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal-overlay {
  z-index: 2200;
  background: rgba(0, 0, 0, 0.5);
}

.login-modal {
  width: 420px;
  max-width: 90vw;
  background: #fff;
  border-radius: 16px;
  padding: 0;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.login-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  z-index: 1;
}

.login-modal-close:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #333;
}

.login-modal-content {
  padding: 48px 32px 32px;
  text-align: center;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.login-modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.login-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.login-modal-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.4;
}

.login-modal-actions {
  display: flex;
  justify-content: center;
}

.login-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .login-modal {
    width: 90vw;
    margin: 20px;
  }
  
  .login-modal-content {
    padding: 24px 20px 20px;
  }
  
  .login-modal-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .login-btn {
    padding: 10px 28px;
    font-size: 15px;
  }
}
</style>

<!-- 样式已迁移至全局样式表 src/styles/global.css 中的"资讯详情页"段落 -->

