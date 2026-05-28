<template>
  <div class="circles-detail">
    <button class="detail-close-btn" @click="handleClose" aria-label="关闭">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="detail-card">
      <!-- 左侧媒体区 -->
      <div class="detail-media" :style="{ 'view-transition-name': 'post-card-' + post.id }">
        <img v-if="primaryMediaType === 'image'" :src="post.cover_image" :alt="post.title" :style="{ 'view-transition-name': 'post-media-' + post.id }" />
        <video v-else controls :src="post.video_url" />
      </div>

      <!-- 右侧信息区 -->
      <div class="detail-info">
        <!-- 顶部：作者 与 关注 -->
        <div class="author-row">
          <div class="author-left">
            <img class="avatar" src="https://picsum.photos/40/40?random=98" :alt="post.author?.nickname || '作者'" @click="goToUser(post.author?.id)" style="cursor:pointer;" />
            <span class="name" @click="goToUser(post.author?.id)" style="cursor:pointer;">{{ post.author?.nickname || '匿名用户' }}</span>
          </div>
          <button class="follow-btn" @click="toggleFollow">关注</button>
        </div>

        <!-- 标题 -->
        <h1 class="title">{{ post.title }}</h1>

        <!-- 详情内容 -->
        <div class="content">{{ post.content || defaultContent }}</div>

        <!-- 标签 -->
        <div class="tags">
          <span v-for="tag in tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>

        <!-- 发布时间、地点 -->
        <div class="meta">
          <span class="location">{{ post.location || '未知地点' }}</span>
          <span class="time">{{ formatPostTime(post.created_at) }}</span>
        </div>

        <!-- 统计信息 -->
        <div class="stats">
          <span class="stats-text">共 {{ totalComments }} 条评论</span>
        </div>

        <!-- 评论区 -->
        <div class="comments">
          <div class="comment-item" v-for="(c, i) in mockComments" :key="i" :class="{ 'top-comment': c.isTopComment }">
            <img class="comment-avatar" src="https://picsum.photos/40/40?random=99" :alt="c.author" />
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ c.author }}</span>
                <span class="comment-role" v-if="c.role">{{ c.role }}</span>
                <span class="top-comment-badge" v-if="c.isTopComment">置顶评论</span>
              </div>
              <div class="comment-text">{{ c.text }}</div>
              <div class="comment-footer">
                <div class="comment-meta">
                  <span class="comment-time">{{ c.time }}</span>
                  <span class="comment-location" v-if="c.location">{{ c.location }}</span>
                </div>
                <div class="comment-actions">
                  <button class="comment-action-btn compact" @click="toggleCommentLike(i)">
                    <Heart :size="12" :fill="c.isLiked ? 'currentColor' : 'none'" />
                    <span>{{ c.likes > 0 ? formatCountCn(c.likes) : '点赞' }}</span>
                  </button>
                  <button class="comment-action-btn compact" @click="startReplyTo(i)">
                    <MessageCircle :size="12" />
                    <span>{{ (c.replies && c.replies.length) > 0 ? formatCountCn(c.replies.length) : '回复' }}</span>
                  </button>
                </div>
              </div>

              <!-- 二级回复列表 -->
              <div class="reply-list" v-if="c.replies && c.replies.length">
                <div class="reply-item" v-for="(r, ri) in getVisibleReplies(i)" :key="ri">
                  <img class="reply-avatar" src="https://picsum.photos/40/40?random=100" :alt="r.author" />
                  <div class="reply-body">
                    <div class="reply-header">
                      <span class="reply-author">{{ r.author }}</span>
                      <span class="reply-to" v-if="r.replyTo">回复 @{{ r.replyTo }}</span>
                    </div>
                    <div class="reply-text">{{ r.text }}</div>
                    <div class="reply-footer">
                      <div class="reply-meta">
                        <span class="reply-time">{{ r.time }}</span>
                        <span class="reply-location" v-if="r.location">{{ r.location }}</span>
                      </div>
                      <div class="reply-actions">
                        <button class="comment-action-btn compact" @click="toggleReplyLike(i, ri)">
                          <Heart :size="12" :fill="r.isLiked ? 'currentColor' : 'none'" />
                          <span>{{ r.likes > 0 ? formatCountCn(r.likes) : '点赞' }}</span>
                        </button>
                        <button class="comment-action-btn compact" @click="startReplyTo(i, ri)">
                          <MessageCircle :size="12" />
                          <span>回复</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="toggle-replies-btn" v-if="c.replies.length > 2" @click="toggleRepliesExpand(i)">
                  {{ isExpanded(i) ? '收起回复' : `展开 ${c.replies.length - 2} 条回复` }}
                </button>
              </div>

              <!-- 二级回复输入框 -->
              <div class="reply-input-row" v-if="replyingTo && replyingTo.cIdx === i">
                <div class="reply-input-container">
                  <input 
                    v-model="newReplyText"
                    type="text"
                    class="reply-input"
                    :placeholder="`回复 @${replyingTo.targetName}：`"
                    @keyup.enter="submitReply"
                  />
                  <button class="reply-send-btn" v-if="newReplyText.trim()" @click="submitReply">发送</button>
                  <button class="reply-cancel-btn" @click="cancelReply">取消</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 底部互动栏 -->
        <div class="interaction-bar">
          <div class="comment-input-area">
            <!-- 胶囊输入框（内含头像/图标） -->
            <div class="comment-input-container">
              <div class="avatar-placeholder"><User :size="12" /></div>
              <input 
                v-model="commentText"
                type="text" 
                placeholder="发表你的看法"
                class="comment-input"
                @keyup.enter="submitComment"
                @focus="handleCommentFocus"
                @blur="handleCommentBlur"
              />
              <button 
                v-if="commentText.trim()" 
                @click="submitComment" 
                class="send-btn"
              >
                发送
              </button>
            </div>
          </div>
          <div class="interaction-buttons">
            <button class="interaction-btn like-btn" @click="toggleLike">
              <Heart :size="16" :fill="isLiked ? 'currentColor' : 'none'" />
              <span>{{ likeCount }}+</span>
            </button>
            <button class="interaction-btn star-btn" @click="toggleStar">
              <Star :size="16" :fill="isStarred ? 'currentColor' : 'none'" />
              <span>{{ starCount }}+</span>
            </button>
            <button class="interaction-btn comment-btn">
              <MessageCircle :size="16" />
              <span>{{ totalComments }}</span>
            </button>
            <button class="interaction-btn share-btn" @click="handleShare">
              <Share2 :size="16" />
            </button>
          </div>
        </div>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { placeholders } from '@/utils/placeholder'
import { Heart, Star, MessageCircle, Share2, User, Plus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const id = route.params.id

// 登录状态
const isLoggedIn = ref(false) // 模拟登录状态，实际应该从用户store获取
const showLoginModal = ref(false)

// 分类定义
const categories = [
  '生活分享', '文化艺术', '时尚美妆', '日常生活', '美食推荐',
  '运动健身', '情感心理', '旅行游记', '科技数码'
]

// 从 sessionStorage 恢复卡片数据
const post = ref(retrievePostFromStorage(id))

function retrievePostFromStorage(postId) {
  try {
    const raw = sessionStorage.getItem('circles:selectedPost')
    if (!raw) return getFallback()
    const data = JSON.parse(raw)
    if (data && String(data.id) === String(postId)) return data
    return data || getFallback()
  } catch (e) {
    return getFallback()
  }
}

function getFallback() {
  // 随机选择一个分类
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  
  return {
    id: id,
    title: '内容已加载',
    content: '',
    cover_image: `https://via.placeholder.com/800x1000/EEEEEE/999999?text=Media`,
    images: [],
    type: 'image',
    category: randomCategory,
    author: {
      nickname: '匿名用户'
    },
    created_at: new Date().toISOString(),
    location: '未知地点'
  }
}

const primaryMediaType = computed(() => post.value?.type === 'video' ? 'video' : 'image')

// 标签只允许以下9个，按需过滤/回退为分类名称
const allowedTags = [
  '生活分享','文化艺术','时尚美妆','日常生活','美食推荐','运动健身','情感心理','旅行游记','科技数码'
]

// 英文分类到中文标签映射
const categoryToTag = {
  life: '生活分享',
  culture: '文化艺术',
  fashion: '时尚美妆',
  daily: '日常生活',
  food: '美食推荐',
  fitness: '运动健身',
  emotion: '情感心理',
  travel: '旅行游记',
  tech: '科技数码'
}

const tags = computed(() => {
  const raw = Array.isArray(post.value?.tags) ? post.value.tags : []
  const filtered = raw.filter(t => allowedTags.includes(t))
  if (filtered.length) return filtered
  const cat = post.value?.category
  // 如果category本身就是中文允许标签，直接返回；若为英文slug则映射
  if (allowedTags.includes(cat)) return [cat]
  const mapped = categoryToTag[cat]
  return [mapped || '生活分享']
})

const defaultContent = '这一条来自知马圈的分享详细内容区域。'

// 随机化工具
function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
// 中文计数格式化：10+ / 1千+ / 1万+
function formatCountCn(num) {
  const n = Number(num || 0)
  if (n <= 0) return ''
  if (n >= 10000) return Math.floor(n / 10000) + '万+'
  if (n >= 1000) return Math.floor(n / 1000) + '千+'
  return n + '+'
}

// 生成更丰富的模拟评论（含二级回复）
function generateMockComments() {
  const names = ['狗冠小辞包','时击','Carol','珈朵宝贝','糖醋排骨','南城旧梦','阿椰是我','今天也要开心','晚风写意','阿元','钉钉猫','丸子','小王不秃','咕噜灵波','打工人','一只小柚','弦上月','阿右','七月与安生']
  const places = ['吉隆坡','槟城','马六甲','新山','沙巴','砂拉越','霹雳','雪兰莪','彭亨','森美兰','玻璃市','吉打','登嘉楼','吉兰丹']
  const sentences = [
    '太会拍了，这个构图爱了','求同款链接','光线好绝','这也太美了8','颜色搭配很高级','收藏了准备周末去','氛围感拿捏','请问是在{{place}}吗','镜头感很强','安利成功','看起来好治愈','居家也能这样拍','想学调色','这家店好出片','也太像杂志了','强烈推荐','冲了冲了','拍摄参数能分享下吗','哈哈哈笑死我了'
  ]
  const makeAvatar = (seed) => `https://api.dicebear.com/7.x/adventurer/svg?seed=cm_${seed}`

  const topCount = randInt(6, 10)
  const topComments = Array.from({ length: topCount }, (_, i) => {
    const author = randPick(names)
    const location = randPick(places)
    const textTpl = randPick(sentences)
    const text = textTpl.replace('{{place}}', randPick(places))
    const replyCount = Math.random() > 0.5 ? randInt(1, 5) : 0
    const replies = Array.from({ length: replyCount }, (_, ri) => {
      const rAuthor = randPick(names)
      return {
        author: rAuthor,
        avatar: makeAvatar(`${i}_${ri}`),
        replyTo: Math.random() > 0.5 ? author : '',
        text: randPick(sentences).replace('{{place}}', randPick(places)),
        time: `${randInt(1, 72)}小时前`,
        location: randPick(places),
        likes: randInt(0, 20),
        isLiked: false
      }
    })
    return {
      author,
      avatar: makeAvatar(`top_${i}`),
      role: Math.random() > 0.9 ? '作者' : '',
      text,
      time: `${randInt(1, 7)}天前`,
      location,
      likes: randInt(0, 99),
      isLiked: false,
      isTopComment: i === 0 && Math.random() > 0.5,
      replies
    }
  })
  return topComments
}

const mockComments = ref(generateMockComments())

// 评论输入相关
const commentText = ref('')
const isCommentFocused = ref(false)

// 互动状态
const isLiked = ref(false)
const isStarred = ref(false)
const likeCount = ref(Math.floor(Math.random() * 1000))
const starCount = ref(Math.floor(Math.random() * 100))
// 总评论数（含二级回复）
const totalComments = computed(() => {
  try {
    return mockComments.value.reduce((sum, c) => sum + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0)
  } catch { return mockComments.value.length }
})

// 二级评论展开控制与回复输入状态
const expandedSet = ref(new Set())
const replyingTo = ref(null) // { cIdx, rIdx?, targetName }
const newReplyText = ref('')

function formatPostTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

onMounted(() => {
  // 可在此处请求后端详情接口以刷新更准确信息
})

function handleClose() {
  try { sessionStorage.removeItem('circles:selectedPost') } catch (e) {}
  const startTransition = document.startViewTransition?.bind(document)
  const to = { name: 'Circles' }
  if (startTransition) {
    startTransition(async () => {
      await router.push(to)
    })
  } else {
    router.push(to)
  }
}

function goToUser(userId) {
  if (!userId) return
  try { router.push(`/user/${userId}`) } catch (e) {}
}

// 评论相关方法
function handleCommentFocus() {
  isCommentFocused.value = true
}

function handleCommentBlur() {
  isCommentFocused.value = false
}

function submitComment() {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  if (!commentText.value.trim()) return
  
  // 添加新评论到评论列表
  mockComments.value.unshift({
    author: '我',
    avatar: 'https://picsum.photos/40/40?random=101',
    time: '刚刚',
    text: commentText.value.trim(),
    location: '',
    likes: 0,
    isLiked: false,
    replies: []
  })
  
  // 清空输入框
  commentText.value = ''
}

// 互动方法
function toggleLike() {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

function toggleStar() {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  isStarred.value = !isStarred.value
  starCount.value += isStarred.value ? 1 : -1
}

function toggleFollow() {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
}

function handleShare() {
  // 分享功能
  navigator.share?.({
    title: post.value.title,
    text: post.value.content || defaultContent,
    url: window.location.href
  }).catch(() => {
    // 如果不支持 Web Share API，可以复制链接
    navigator.clipboard?.writeText(window.location.href)
  })
}

// 评论交互方法（顶层/二级）
function toggleCommentLike(cIdx) {
  const c = mockComments.value[cIdx]
  if (!c) return
  c.isLiked = !c.isLiked
  c.likes += c.isLiked ? 1 : -1
}

function toggleReplyLike(cIdx, rIdx) {
  const r = mockComments.value[cIdx]?.replies?.[rIdx]
  if (!r) return
  r.isLiked = !r.isLiked
  r.likes += r.isLiked ? 1 : -1
}

function isExpanded(cIdx) { return expandedSet.value.has(cIdx) }
function toggleRepliesExpand(cIdx) {
  if (expandedSet.value.has(cIdx)) {
    expandedSet.value.delete(cIdx)
  } else {
    expandedSet.value.add(cIdx)
  }
  // 触发视图更新
  expandedSet.value = new Set(expandedSet.value)
}

function getVisibleReplies(cIdx) {
  const replies = mockComments.value[cIdx]?.replies || []
  if (replies.length <= 2) return replies
  return isExpanded(cIdx) ? replies : replies.slice(0, 2)
}

function startReplyTo(cIdx, rIdx) {
  const c = mockComments.value[cIdx]
  if (!c) return
  if (typeof rIdx === 'number') {
    const r = c.replies?.[rIdx]
    replyingTo.value = { cIdx, rIdx, targetName: r?.author || c.author }
  } else {
    replyingTo.value = { cIdx, targetName: c.author }
  }
  newReplyText.value = ''
}

function cancelReply() { replyingTo.value = null; newReplyText.value = '' }

function goToLogin() {
  showLoginModal.value = false
  router.push('/auth/login')
}

function submitReply() {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  if (!replyingTo.value || !newReplyText.value.trim()) return
  const { cIdx, rIdx, targetName } = replyingTo.value
  const c = mockComments.value[cIdx]
  if (!c) return
  if (!Array.isArray(c.replies)) c.replies = []
  c.replies.push({
    author: '我',
    avatar: 'https://picsum.photos/40/40?random=101',
    replyTo: targetName || '',
    text: newReplyText.value.trim(),
    time: '刚刚',
    location: '',
    likes: 0,
    isLiked: false
  })
  // 展开该评论的回复区域
  expandedSet.value.add(cIdx)
  expandedSet.value = new Set(expandedSet.value)
  // 重置输入状态
  cancelReply()
}
</script>

<style scoped>
.circles-detail {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 24px 10%;
  box-sizing: border-box;
}

.detail-close-btn {
  position: fixed;
  top: 54px;
  right: 144px;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.4);
  cursor: pointer;
  color: rgba(255,255,255,0.9);
  z-index: 3100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-close-btn:hover {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.4);
  box-shadow: 
    0 12px 40px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.5);
  transform: scale(1.05);
}

.detail-close-btn:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

/* 响应式：在小屏上收紧位置与尺寸，避免遮挡 */
@media (max-width: 1024px) {
  .detail-close-btn {
    top: 20px;
    right: 28px;
  }
}

@media (max-width: 768px) {
  .detail-close-btn {
    width: 44px;
    height: 44px;
    top: 16px;
    right: 16px;
  }
  .detail-close-btn svg { width: 16px; height: 16px; }
}

@media (max-width: 480px) {
  .detail-close-btn {
    width: 40px;
    height: 40px;
    top: max(12px, env(safe-area-inset-top));
    right: max(12px, env(safe-area-inset-right));
  }
}

.detail-card {
  width: min(1080px);
  height: min(720px);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: var(--bg-primary);
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.detail-media {
  background: #000;
  position: relative;
}
.detail-media img,
.detail-media video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持原比例，可能出现黑边 */
  object-position: center center;
  background: #000;
}

.detail-info {
  padding: 20px 24px 0;
  overflow-y: auto;
  background: var(--bg-primary);
  position: relative;
  display: flex;
  flex-direction: column;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.detail-info::-webkit-scrollbar {
  width: 0;
  display: none;
}

.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.author-left { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.avatar { 
  width: 32px; 
  height: 32px; 
  border-radius: 50%; 
  object-fit: cover;
}

.name { 
  font-weight: 600; 
  font-size: 14px;
  color: var(--text-primary);
}

.follow-btn { 
  border: none; 
  background: var(--primary-color);
  color: #fff; 
  padding: 6px 16px; 
  border-radius: 16px; 
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
}

.follow-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.title { 
  font-size: var(--font-size-md); 
  line-height: var(--line-height-normal); 
  margin: 0 0 var(--spacing-sm); 
  font-weight: 700;
  color: #111;
}

.content { 
  color: var(--text-primary); 
  line-height: var(--line-height-relaxed); 
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.tags { 
  margin: 12px 0; 
  display: flex; 
  flex-wrap: wrap; 
  gap: 6px; 
}

.tag { 
  background: none;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tag:hover {
  color: var(--primary-hover);
}

.meta { 
  color: var(--text-light); 
  display: flex; 
  align-items: center; 
  gap: var(--spacing-sm); 
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xs);
}

.location {
  color: var(--text-primary);
}

.time {
  color: var(--text-light);
}

/* 已移除模拟登录按钮样式 */

.stats {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.stats-text {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.comments { 
  margin-top: 0;
}

.comment-item { 
  display: flex; 
  gap: 10px; 
  padding: 12px 0; 
  border-bottom: 1px solid #f8f9fa;
}

.comment-avatar { 
  width: 32px; 
  height: 32px; 
  border-radius: 50%; 
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.comment-author { 
  color: var(--text-primary); 
  font-size: 13px;
  font-weight: 500;
}

.comment-role {
  background: #ff2442;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  line-height: 1;
}

.comment-text { 
  color: var(--text-primary);
  line-height: 1.4;
  font-size: 14px;
  margin-bottom: 6px;
  word-wrap: break-word;
}

.comment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: nowrap;
  font-size: 12px;
  color: var(--text-light);
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.comment-time {
  color: var(--text-light);
}

.comment-location {
  color: var(--text-light);
}

.top-comment {
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  margin: 0 -12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 106, 0, 0.1);
}

.top-comment-badge {
  background: var(--primary-color);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: auto;
}

.comment-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  white-space: nowrap;
}

.comment-action-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.comment-action-btn:hover {
  color: var(--primary-color);
}

.comment-action-btn.compact span { font-size: 12px; }

/* 二级回复样式 */
.reply-list {
  margin-top: 8px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reply-item {
  display: flex;
  gap: 8px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-body { flex: 1; min-width: 0; }
.reply-header { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.reply-author { color: var(--text-primary); font-size: 12px; font-weight: 500; }
.reply-to { color: var(--text-light); font-size: 12px; }
.reply-text { color: var(--text-primary); font-size: 13px; line-height: 1.4; margin-bottom: 4px; }

.reply-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: nowrap; font-size: 12px; color: var(--text-light); }
.reply-meta { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.reply-actions { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; white-space: nowrap; }
.reply-time, .reply-location { color: var(--text-light); }

.toggle-replies-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 12px;
  padding: 0 4px;
}

.reply-input-row { margin-top: 8px; margin-left: 40px; }
.reply-input-container { display: flex; align-items: center; gap: 8px; background: #f7f7f8; border: 1px solid #eee; border-radius: 16px; padding: 6px 10px; }
.reply-input-container.disabled { opacity: 0.6; cursor: not-allowed; }
.reply-input { flex: 1; border: none; background: none; outline: none; font-size: 13px; color: var(--text-primary); }
.reply-send-btn { background: var(--primary-color); color: #fff; border: none; border-radius: 12px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
.reply-cancel-btn { background: none; border: none; color: var(--text-light); font-size: 12px; cursor: pointer; }

.interaction-bar {
  position: sticky;
  bottom: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
  margin-top: auto;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
  /* 抵消 detail-info 左右 24px 内边距，使互动栏满宽 */
  margin-left: -24px;
  margin-right: -24px;
}

.comment-input-area {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1 1 auto;
  min-width: 0;
}

.avatar-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  flex-shrink: 0;
  border: 1px solid #eee;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-input-container {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  background: #f7f7f8;
  border-radius: 22px;
  padding: 10px 14px;
  border: 1px solid #eee;
  transition: all 0.2s ease;
}

.comment-input-container:focus-within {
  border-color: var(--primary-color);
  background: #fff;
}

.comment-input-container.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comment-input-container.disabled .comment-input {
  cursor: not-allowed;
}

.comment-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
  padding: 0 8px;
}

.comment-input::placeholder {
  color: var(--text-light);
}

.send-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background: var(--primary-hover);
}

.interaction-buttons { display: flex; gap: 10px; align-items: center; flex-shrink: 0; margin-left: 8px; }

.interaction-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border-radius: 16px;
  transition: all 0.2s ease;
  min-width: auto;
  white-space: nowrap;
}

.interaction-btn:hover {
  background: rgba(0,0,0,0.04);
}

.like-btn:hover {
  color: var(--primary-color);
  background: rgba(255, 106, 0, 0.08);
}

.star-btn:hover {
  color: var(--warning-color);
  background: rgba(250, 173, 20, 0.08);
}

.comment-btn:hover {
  color: var(--info-color);
  background: rgba(24, 144, 255, 0.08);
}

.share-btn:hover {
  color: var(--success-color);
  background: rgba(82, 196, 26, 0.08);
}

.share-btn {
  padding: 6px;
}

@media (max-width: 960px) {
  .detail-card { grid-template-columns: 1fr; height: auto; max-height: none; }
  .detail-media { height: 56vw; }
}

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

