<template>
  <div class="lifestyle-page">
    <div class="container">
      <div class="page-header">
        <h1><Camera class="inline-icon" /> 生活分享</h1>
        <p>记录美好生活，分享精彩瞬间</p>
      </div>

      <div class="lifestyle-content">
        <!-- 分类筛选和发布按钮 -->
        <div class="content-header">
          <div class="category-filters">
            <el-button 
              v-for="category in categories" 
              :key="category.slug"
              :type="activeCategory === category.slug ? 'primary' : ''"
              @click="activeCategory = category.slug"
            >
              <component :is="getIconComponent(category.icon)" class="category-icon inline-icon" />
              {{ category.name }}
            </el-button>
          </div>
          
          <el-button 
            type="primary" 
            size="large" 
            icon="Plus" 
            @click="showPublishDialog = true"
          >
            发布分享
          </el-button>
        </div>

        <!-- 瀑布流布局 -->
        <div class="lifestyle-grid">
          <div 
            v-for="post in lifestylePosts" 
            :key="post.id"
            class="lifestyle-card"
            @click="goToDetail(post.id)"
          >
            <div class="card-image">
              <img :src="post.images[0]" :alt="post.content" loading="lazy">
            </div>
            <div class="card-content">
              <p class="card-text">{{ post.content }}</p>
              <div class="card-tags" v-if="post.tags && post.tags.length">
                <span 
                  v-for="tag in post.tags.slice(0, 3)" 
                  :key="tag"
                  class="tag"
                >
                  # {{ tag }}
                </span>
              </div>
              <div class="card-footer">
                <div class="user-info">
                  <img :src="$getImageUrl(post.user.avatar)" class="user-avatar">
                  <div class="user-details">
                    <span class="user-name">{{ post.user.nickname }}</span>
                    <span class="post-location" v-if="post.location"><MapPin class="inline-icon" /> {{ post.location }}</span>
                  </div>
                </div>
                <div class="card-stats">
                  <span class="stat-item" @click.stop="toggleLike(post)">
                    <el-icon :class="{ liked: post.is_liked }">
                      <component :is="post.is_liked ? 'heart-filled' : 'heart'" />
                    </el-icon>
                    {{ post.likes }}
                  </span>
                  <span class="stat-item">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="load-more">
          <el-button 
            :loading="loading" 
            @click="loadMore"
            size="large"
            style="width: 200px;"
          >
            {{ loading ? '加载中...' : '加载更多' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 发布分享对话框 -->
    <el-dialog v-model="showPublishDialog" title="发布生活分享" width="600px">
      <el-form :model="publishForm" label-width="80px">
        <el-form-item label="分类">
          <el-select v-model="publishForm.category_id" placeholder="选择分类">
            <el-option 
              v-for="category in categories.slice(1)" 
              :key="category.id"
              :label="category.name" 
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容">
          <el-input 
            v-model="publishForm.content" 
            type="textarea" 
            :rows="4"
            placeholder="分享你的生活瞬间..."
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        
        <el-form-item label="图片">
          <el-upload
            v-model:file-list="publishForm.images"
            action="/api/v1/upload/images"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            multiple
            :limit="9"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="位置">
          <el-input v-model="publishForm.location" placeholder="添加位置信息（可选）" />
        </el-form-item>
        
        <el-form-item label="标签">
          <el-input 
            v-model="publishForm.tags" 
            placeholder="添加标签，用空格分隔"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPublish">发布</el-button>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="showPreview">
      <img :src="previewImage" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script setup>
import { Book, Camera, FileText, Map, MapPin, ShoppingCart, Target, Utensils } from 'lucide-vue-next';

import { lifestyleAPI } from '@/api/lifestyle'
import { useUserStore } from '@/stores/user'
import { formatTime, formatNumber } from '@/utils'
import { Plus, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()

// 图标组件映射
const iconComponents = {
  Target,
  Camera,
  Map,
  Utensils,
  ShoppingCart,
  Book,
  FileText
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Target
}
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const activeCategory = ref('all')
const lifestylePosts = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const loading = ref(false)
const showPublishDialog = ref(false)
const showPreview = ref(false)
const previewImage = ref('')

const publishForm = ref({
  category_id: '',
  content: '',
  images: [],
  location: '',
  tags: ''
})

// 分类数据
const categories = [
  { id: 0, name: '全部', slug: 'all', icon: 'Target' },
  { id: 1, name: '摄影', slug: 'photography', icon: 'Camera' },
  { id: 2, name: '旅游', slug: 'travel', icon: 'Map' },
  { id: 3, name: '美食', slug: 'food', icon: 'Utensils' },
  { id: 4, name: '购物', slug: 'shopping', icon: 'ShoppingCart' },
  { id: 5, name: '学习', slug: 'study', icon: 'Book' },
  { id: 6, name: '日常', slug: 'daily', icon: 'FileText' }
]

// 方法
const loadLifestylePosts = async (reset = false) => {
  try {
    loading.value = true
    
    const params = {
      category: activeCategory.value === 'all' ? undefined : activeCategory.value,
      page: reset ? 1 : currentPage.value,
      pageSize: pageSize.value
    }
    
    const response = await lifestyleAPI.getPosts(params)
    
    if (reset) {
      lifestylePosts.value = response.data.list
      currentPage.value = 1
    } else {
      lifestylePosts.value.push(...response.data.list)
    }
    
    hasMore.value = response.data.list.length === pageSize.value
    
  } catch (error) {
    console.error('加载生活分享失败:', error)
    loadMockData(reset)
  } finally {
    loading.value = false
  }
}

const loadMockData = (reset = false) => {
  const mockPosts = Array.from({ length: pageSize.value }, (_, i) => {
    const index = reset ? i : lifestylePosts.value.length + i
    return {
      id: index + 1,
      content: `这是生活分享 ${index + 1}，记录在马来西亚的美好时光。今天去了一个很棒的地方，风景超级美，心情特别好！`,
      images: [`https://via.placeholder.com/300x${400 + (index % 3) * 50}/FF6A00/FFFFFF?text=生活照片`],
      tags: ['生活', '马来西亚', '美好时光'],
      location: index % 3 === 0 ? '吉隆坡' : index % 3 === 1 ? '槟城' : '新山',
      user: {
        nickname: `用户${index + 1}`,
        avatar: 'https://picsum.photos/40/40?random=97'
      },
      likes: 20 + index * 3,
      comments: 5 + index * 2,
      is_liked: index % 4 === 0,
      created_at: `2025-03-${15 - (index % 15)}T10:00:00Z`
    }
  })

  if (reset) {
    lifestylePosts.value = mockPosts
  } else {
    lifestylePosts.value.push(...mockPosts)
  }
  
  hasMore.value = lifestylePosts.value.length < 100
}

const loadMore = () => {
  currentPage.value++
  loadLifestylePosts()
}

const toggleLike = async (post) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    await lifestyleAPI.toggleLike(post.id)
    post.is_liked = !post.is_liked
    post.likes += post.is_liked ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const goToDetail = (id) => {
  router.push(`/lifestyle/${id}`)
}

const submitPublish = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!publishForm.value.content.trim()) {
    ElMessage.warning('请输入分享内容')
    return
  }
  
  try {
    const data = {
      ...publishForm.value,
      tags: publishForm.value.tags.split(' ').filter(tag => tag.trim())
    }
    
    await lifestyleAPI.publishPost(data)
    ElMessage.success('发布成功')
    showPublishDialog.value = false
    
    // 重置表单
    publishForm.value = {
      category_id: '',
      content: '',
      images: [],
      location: '',
      tags: ''
    }
    
    // 重新加载数据
    loadLifestylePosts(true)
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

const handlePreview = (file) => {
  previewImage.value = file.url
  showPreview.value = true
}

const handleRemove = (file) => {
  // 处理图片移除
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 监听分类变化
watch(activeCategory, () => {
  currentPage.value = 1
  loadLifestylePosts(true)
})

// 初始化
onMounted(() => {
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
  loadLifestylePosts(true)
})
</script>

<style scoped>
.lifestyle-page {
  padding: var(--spacing-lg) 10%;
  background: var(--bg-secondary);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-large);
  border: 1px solid #f0f0f0;
}

.page-header h1 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.lifestyle-content {
  background: white;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-light);
  padding: var(--spacing-xl);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.category-filters {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.lifestyle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.lifestyle-card {
  border-radius: var(--radius-large);
  overflow: hidden;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.lifestyle-card:hover {
  border-color: #e0e0e0;
}

.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: auto;
  display: block;
}

.card-content {
  padding: var(--spacing-md);
}

.card-text {
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  margin-bottom: var(--spacing-md);
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: var(--bg-light);
  color: var(--primary-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-xs);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-round);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.post-location {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.card-stats {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.stat-item:hover {
  color: var(--primary-color);
}

.stat-item .liked {
  color: var(--error-color);
}

.load-more {
  text-align: center;
  padding: var(--spacing-xl);
}

/* 发布对话框样式 */
:deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .category-filters {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: var(--spacing-sm);
  }
  
  .lifestyle-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .lifestyle-grid {
    grid-template-columns: 1fr;
  }
}
</style>
