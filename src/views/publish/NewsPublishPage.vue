<template>
  <div class="news-publish-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <Newspaper class="page-title-icon" />
          发布资讯
        </h1>
        <p class="page-subtitle">分享最新资讯，传播有价值的信息</p>
      </div>

      <!-- 编辑器主体 -->
      <div class="editor-container">
        <div class="editor-layout">
          <!-- 主编辑区域 -->
          <div class="main-editor">
            <div class="editor-card">
              <!-- 标题输入 -->
              <div class="form-group">
                <label class="form-label">
                  <Type class="inline-icon" />
                  新闻标题
                </label>
                <input 
                  v-model="formData.title"
                  type="text" 
                  class="form-input title-input"
                  placeholder="请输入新闻标题，简明扼要地概括新闻要点"
                  maxlength="100"
                />
                <div class="input-counter">{{ formData.title.length }}/100</div>
              </div>

              <!-- 内容编辑器（富文本，支持粘贴/拖拽上传图片） -->
              <div class="form-group">
                <label class="form-label">
                  <FileText class="inline-icon" />
                  新闻内容
                </label>
                <div class="editor-toolbar">
                  <button 
                    v-for="tool in editorTools" 
                    :key="tool.name"
                    :class="['editor-tool-btn', { active: activeTool === tool.name }]"
                    @click="handleToolClick(tool.name)"
                    :title="tool.title"
                  >
                    <component :is="getIconComponent(tool.icon)" class="tool-icon" />
                  </button>
                  <div class="toolbar-divider"></div>
                  <button class="editor-tool-btn" @click="insertEmoji" title="插入表情">
                    <Smile class="tool-icon" />
                  </button>
                  <button class="editor-tool-btn" @click="insertLink" title="插入链接">
                    <Link class="tool-icon" />
                  </button>
                  <button class="editor-tool-btn" @click="triggerEditorImage" title="插入图片">
                    <Image class="tool-icon" />
                  </button>
                </div>
                <div 
                  class="rich-editor"
                  ref="editorRef"
                  contenteditable="true"
                  :data-placeholder="'请输入新闻内容...\n\n写作建议：\n• 客观、准确地报道事实\n• 结构清晰，包含时间、地点、人物、事件\n• 语言简洁明了，避免主观色彩'"
                  @input="onEditorInput"
                  @paste.prevent="onEditorPaste"
                  @dragover.prevent
                  @drop.prevent="onEditorDrop"
                ></div>
                <input ref="editorImageInput" type="file" accept="image/*" style="display:none" @change="onEditorImageChange" />
              </div>

              <!-- 新闻来源 -->
              <div class="form-group">
                <label class="form-label">
                  <Globe class="inline-icon" />
                  新闻来源
                </label>
                <input 
                  v-model="formData.source"
                  type="text" 
                  class="form-input"
                  placeholder="请输入新闻来源，如：新华社、人民日报等"
                />
              </div>
            </div>
          </div>

          <!-- 右侧设置面板 -->
          <div class="settings-panel">
            <!-- 发布设置 -->
            <div class="settings-card">
              <div class="settings-header">
                <h3 class="settings-title">
                  <Settings class="inline-icon" />
                  发布设置
                </h3>
              </div>
              <div class="settings-content">
                <!-- 分类选择 -->
                <div class="form-group">
                  <label class="form-label">分类</label>
                  <select v-model="formData.category" class="form-select">
                    <option value="">请选择分类</option>
                    <option 
                      v-for="category in newsCategories" 
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </option>
                  </select>
                </div>

                <!-- 标签选择 -->
                <div class="form-group">
                  <label class="form-label">
                    标签
                    <span class="label-tip">最多5个</span>
                  </label>
                  <div class="tag-selection-area">
                    <div class="selected-tags">
                      <span 
                        v-for="tag in formData.tags" 
                        :key="tag"
                        class="selected-tag"
                      >
                        {{ tag }}
                        <X class="remove-tag-icon" @click="removeTag(tag)" />
                      </span>
                    </div>
                  </div>
                  <div class="available-tags">
                    <span class="available-tags-label">可选标签：</span>
                    <div class="tag-options">
                      <span 
                        v-for="tag in availableTags" 
                        :key="tag"
                        :class="['tag-option', { 
                          selected: formData.tags.includes(tag),
                          disabled: !formData.tags.includes(tag) && formData.tags.length >= 5
                        }]"
                        @click="toggleTag(tag)"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- 自定义标签输入 -->
                  <div class="available-tags" style="margin-top:8px;">
                    <span class="available-tags-label">自定义标签：</span>
                    <div class="custom-tag-row">
                      <input 
                        v-model="customTag" 
                        class="form-input" 
                        placeholder="输入后回车添加，最多5个"
                        @keyup.enter="addCustomTag"
                      />
                      <button 
                        class="btn btn-secondary btn-small" 
                        @click="addCustomTag"
                        :disabled="!customTag.trim() || formData.tags.length >= 5"
                      >添加</button>
                    </div>
                  </div>
                </div>

                <!-- 可见性设置 -->
                <div class="form-group">
                  <label class="form-label">可见性</label>
                  <div class="visibility-options">
                    <label 
                      v-for="option in visibilityOptions" 
                      :key="option.value"
                      class="radio-wrapper"
                    >
                      <input 
                        v-model="formData.visibility" 
                        type="radio" 
                        :value="option.value"
                        class="radio-input"
                      />
                      <span class="radio-label">
                        <component :is="getIconComponent(option.icon)" class="inline-icon" />
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- 定时发布 -->
                <div class="form-group">
                  <label class="checkbox-wrapper">
                    <input 
                      v-model="formData.isScheduled" 
                      type="checkbox" 
                      class="checkbox-input"
                    />
                    <span class="checkbox-label">定时发布</span>
                  </label>
                  <div v-if="formData.isScheduled" class="scheduled-time">
                    <input 
                      v-model="formData.scheduledTime"
                      type="datetime-local" 
                      class="form-input"
                      :min="minDateTime"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 预览 -->
            <div class="settings-card">
              <div class="settings-header">
                <h3 class="settings-title">
                  <Eye class="inline-icon" />
                  预览
                </h3>
              </div>
              <div class="preview-content">
                <div class="preview-post">
                  <div class="preview-header">
                    <img src="https://picsum.photos/40/40?random=36" alt="头像" class="preview-avatar">
                    <div class="preview-user-info">
                      <div class="preview-username">当前用户</div>
                      <div class="preview-time">刚刚</div>
                    </div>
                  </div>
                  <div class="preview-title" v-if="formData.title">{{ formData.title }}</div>
                  <div class="preview-content-text" v-if="formData.content">{{ formData.content }}</div>
                  <div class="preview-images" v-if="formData.images.length">
                    <img 
                      v-for="(image, index) in formData.images.slice(0, 3)" 
                      :key="index"
                      :src="image.url" 
                      alt="预览图片"
                      class="preview-image"
                    />
                    <div v-if="formData.images.length > 3" class="preview-more-images">
                      +{{ formData.images.length - 3 }}
                    </div>
                  </div>
                  <div class="preview-tags" v-if="formData.tags.length">
                    <span 
                      v-for="tag in formData.tags" 
                      :key="tag"
                      class="preview-tag"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                  <div class="preview-source" v-if="formData.source">
                    <span class="source-label">来源：</span>
                    <span class="source-text">{{ formData.source }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="bottom-actions">
          <div class="draft-status">
            <div class="auto-save-status">
              <span v-if="lastAutoSaveTime" class="auto-save-time">
                <Clock class="save-icon" />
                自动保存于 {{ formatSaveTime(lastAutoSaveTime) }}
              </span>
              <span v-else class="auto-save-time">
                <Clock class="save-icon" />
                暂未保存
              </span>
              <span v-if="isAutoSaving" class="saving-indicator">
                <div class="saving-spinner"></div>
                保存中...
              </span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-ghost" @click="saveDraft">
              <Save class="inline-icon" />
              保存草稿
            </button>
            <button class="btn btn-secondary" @click="preview">
              <Eye class="inline-icon" />
              预览
            </button>
            <button 
              class="btn btn-primary" 
              @click="publish"
              :disabled="!canPublish"
            >
              <Send class="inline-icon" />
              {{ formData.isScheduled ? '定时发布' : '立即发布' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { 
  Newspaper, Type, FileText, Image, Globe, Settings, Eye, Save, Send, Plus, X, 
  ChevronLeft, ChevronRight, Smile, Link, Bold, Italic, Underline, List, Quote,
  Clock
} from 'lucide-vue-next'
import duducarAPI from '@/api/duducar-integration'
import { newsAPI } from '@/api/news'
import { extractImageKeysFromHtml } from '@/utils/richtext-images'

const router = useRouter()

// 图标组件映射
const iconComponents = {
  Newspaper, Type, FileText, Image, Globe, Settings, Eye, Save, Send, Plus, X, 
  ChevronLeft, ChevronRight, Smile, Link, Bold, Italic, Underline, List, Quote,
  Clock
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Newspaper
}

// 表单数据
const formData = ref({
  title: '',
  content: '',
  category: '',
  tags: [],
  images: [],
  source: '',
  visibility: 'public',
  isScheduled: false,
  scheduledTime: ''
})

// 新闻分类（从后端加载）
const newsCategories = ref([])

// 加载新闻频道列表
const loadNewsChannels = async () => {
  try {
    const response = await duducarAPI.article.getChannels(2) // 2=财经/新闻
    if (response.success && response.data) {
      newsCategories.value = response.data.map(channel => ({
        value: channel.channelId,
        label: channel.channelName
      }))
    }
  } catch (error) {
    console.error('加载频道列表失败:', error)
    // 使用默认分类作为后备
    newsCategories.value = [
      { value: '', label: '未分类' },
      { value: 'local', label: '本地新闻' },
      { value: 'china', label: '中国热点' },
      { value: 'international', label: '国际新闻' },
      { value: 'economy', label: '经济资讯' },
      { value: 'technology', label: '科技动态' }
    ]
  }
}

// 可用标签
const availableTags = ref([
  '马来西亚', '华人社区', '政策解读', '经济发展', '文化交流', '教育资讯', 
  '投资理财', '生活服务', '旅游观光', '科技创新', '社会热点', '民生关注'
])

// 编辑器工具
const editorTools = ref([
  { name: 'bold', icon: 'Bold', title: '加粗' },
  { name: 'italic', icon: 'Italic', title: '斜体' },
  { name: 'underline', icon: 'Underline', title: '下划线' },
  { name: 'list', icon: 'List', title: '列表' },
  { name: 'quote', icon: 'Quote', title: '引用' }
])

const activeTool = ref('')

// 可见性选项
const visibilityOptions = ref([
  { value: 'public', label: '公开', icon: 'Globe' },
  { value: 'friends', label: '仅好友', icon: 'Users' },
  { value: 'private', label: '私密', icon: 'Lock' }
])

// refs
const contentEditor = ref(null)
const imageInput = ref(null)
const editorRef = ref(null)
const editorImageInput = ref(null)
const uploadCache = new Map() // editor img src (proxy) -> cdnUrl

// 自动保存相关
const lastAutoSaveTime = ref(null)
const isAutoSaving = ref(false)
const autoSaveTimer = ref(null)
const AUTO_SAVE_INTERVAL = 30000 // 30秒自动保存一次

// 计算属性
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // 最少5分钟后
  return now.toISOString().slice(0, 16)
})

const canPublish = computed(() => {
  return formData.value.title.trim() && 
         formData.value.content.trim() && 
         formData.value.category && 
         formData.value.tags.length > 0
})

// 方法
const handleToolClick = (tool) => {
  activeTool.value = activeTool.value === tool ? '' : tool
}

const insertEmoji = () => {
  const emoji = '😊'
  const textarea = contentEditor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = formData.value.content
  formData.value.content = text.substring(0, start) + emoji + text.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + emoji.length, start + emoji.length)
  })
}

const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (url) {
    document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener">链接</a>`)
  }
}

const triggerImageUpload = () => {
  imageInput.value.click()
}

// 统一上传至 COS 并返回 { objectKey, proxyUrl, cdnUrl }
const uploadImageToCOS = async (file) => {
  try {
    const response = await duducarAPI.cos.uploadCommonImage(file)
    
    if (response.success && response.data) {
      return response.data
    } else {
      throw new Error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    throw error
  }
}

const handleImageDrop = async (event) => {
  const files = Array.from(event.dataTransfer.files)
  for (const file of files) {
    await insertImageFileIntoEditor(file)
  }
}

// 富文本编辑器逻辑
const triggerEditorImage = () => editorImageInput.value.click()

const onEditorImageChange = async (e) => {
  const files = Array.from(e.target.files || [])
  for (const f of files) {
    await insertImageFileIntoEditor(f)
  }
  e.target.value = ''
}

const insertImageFileIntoEditor = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('单张图片不超过5MB')
    return
  }
  // 占位图
  const tempUrl = URL.createObjectURL(file)
  document.execCommand('insertHTML', false, `<img src="${tempUrl}" alt="" style="max-width:100%;" />`)
  try {
    const { objectKey, proxyUrl, cdnUrl } = await uploadImageToCOS(file)
    // 找到刚插入的占位img并替换
    const imgs = editorRef.value?.querySelectorAll(`img[src="${tempUrl}"]`) || []
    imgs.forEach(img => {
      img.setAttribute('src', proxyUrl || cdnUrl)
      img.setAttribute('data-object-key', objectKey)
      uploadCache.set(img.getAttribute('src'), cdnUrl || proxyUrl)
    })
  } catch (e) {
    ElMessage.error('图片上传失败')
  } finally {
    URL.revokeObjectURL(tempUrl)
  }
}

const onEditorPaste = async (e) => {
  const items = e.clipboardData?.items || []
  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile()
      await insertImageFileIntoEditor(file)
      return
    }
  }
  // 默认粘贴文本/HTML
  const text = e.clipboardData?.getData('text/plain') || ''
  if (text) document.execCommand('insertText', false, text)
}

const onEditorDrop = async (e) => {
  const files = Array.from(e.dataTransfer?.files || [])
  for (const f of files) {
    await insertImageFileIntoEditor(f)
  }
}

const onEditorInput = () => {
  formData.value.content = editorRef.value?.innerHTML || ''
}

const toggleTag = (tag) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  } else {
    if (formData.value.tags.length < 5) {
      formData.value.tags.push(tag)
    }
  }
}

const removeTag = (tag) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  }
}

// 自定义标签
const customTag = ref('')
const addCustomTag = () => {
  const t = customTag.value.trim()
  if (!t) return
  if (formData.value.tags.length >= 5) return
  if (formData.value.tags.includes(t)) {
    customTag.value = ''
    return
  }
  if (t.length > 12) {
    alert('标签不超过12个字符')
    return
  }
  formData.value.tags.push(t)
  customTag.value = ''
}

const saveDraft = async (isAuto = false) => {
  try {
    if (isAuto) {
      isAutoSaving.value = true
    }
    
    const draftData = {
      ...formData.value,
      images: formData.value.images.map(img => ({
        url: img.url,
        name: img.name
      })),
      contentType: 'news',
      lastSaved: new Date().toISOString()
    }
    
    localStorage.setItem('zhimawang_news_draft', JSON.stringify(draftData))
    lastAutoSaveTime.value = new Date()
    
    if (!isAuto) {
      alert('草稿已保存到本地')
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    if (!isAuto) {
      alert('保存草稿失败，请重试')
    }
  } finally {
    if (isAuto) {
      isAutoSaving.value = false
    }
  }
}

// 自动保存
const startAutoSave = () => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }
  
  autoSaveTimer.value = setInterval(() => {
    if (formData.value.title.trim() || formData.value.content.trim()) {
      saveDraft(true)
    }
  }, AUTO_SAVE_INTERVAL)
}

const stopAutoSave = () => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
}

// 从本地存储加载草稿
const loadDraft = () => {
  try {
    const savedDraft = localStorage.getItem('zhimawang_news_draft')
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft)
      
      const shouldRestore = confirm('检测到本地保存的草稿，是否要恢复？')
      
      if (shouldRestore) {
        Object.assign(formData.value, {
          title: draftData.title || '',
          content: draftData.content || '',
          category: draftData.category || '',
          tags: draftData.tags || [],
          images: draftData.images || [],
          source: draftData.source || '',
          visibility: draftData.visibility || 'public',
          isScheduled: draftData.isScheduled || false,
          scheduledTime: draftData.scheduledTime || ''
        })
        
        if (draftData.lastSaved) {
          lastAutoSaveTime.value = new Date(draftData.lastSaved)
        }
      }
    }
  } catch (error) {
    console.error('加载草稿失败:', error)
  }
}

const clearDraft = () => {
  localStorage.removeItem('zhimawang_news_draft')
  lastAutoSaveTime.value = null
}

const formatSaveTime = (time) => {
  if (!time) return ''
  
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  if (minutes > 0) {
    return `${minutes}分钟前`
  } else if (seconds > 0) {
    return `${seconds}秒前`
  } else {
    return '刚刚'
  }
}

const preview = () => {
  // 预览逻辑
}

const publish = async () => {
  if (!canPublish.value) {
    ElMessage.warning('请完善文章信息后再发布')
    return
  }
  
  // 富文本：从 HTML 提取 objectKey 列表
  const html = editorRef.value?.innerHTML || ''
  const keys = extractImageKeysFromHtml(html)
  
  const loading = ElLoading.service({
    lock: true,
    text: '正在发布...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 准备发布数据
    const response = await newsAPI.publishArticle({
      editType: 1,
      articleName: formData.value.title,
      articleContent: html,
      contentType: 1,
      articleWriter: formData.value.source || undefined,
      channelId: formData.value.category || undefined,
      richTextImageKeys: keys
    })
    
    if (response && response.code === 200) {
      loading.close()
      ElMessage.success('资讯发布成功！')
      
      // 清除草稿
      clearDraft()
      stopAutoSave()
      
      // 跳转到新闻页面或文章详情页
      if (response.data && response.data.articleId) {
        router.push(`/news/${response.data.articleId}`)
      } else {
        router.push('/news')
      }
    } else {
      throw new Error(response?.message || '发布失败')
    }
  } catch (error) {
    loading.close()
    console.error('发布失败:', error)
    ElMessage.error(`发布失败: ${error.message || '未知错误'}`)
  }
}

// 监听表单数据变化，触发自动保存
watch(
  () => formData.value,
  () => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
  },
  { deep: true }
)

// 初始化
onMounted(() => {
  formData.value.scheduledTime = minDateTime.value
  loadDraft()
  startAutoSave()
  loadNewsChannels() // 加载新闻频道列表
  // 初始化富文本内容（若从草稿恢复）
  nextTick(() => {
    if (editorRef.value && formData.value.content) {
      editorRef.value.innerHTML = formData.value.content
    }
  })
})

onUnmounted(() => {
  stopAutoSave()
})

// 路由离开前提示未保存更改
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (e) => {
    const hasContent = formData.value.title.trim() || formData.value.content.trim() || formData.value.images.length
    if (hasContent) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
}
</script>

<style scoped>
/* 使用global.css中的样式，只添加页面特定样式 */
.news-publish-page {
  min-height: calc(100vh - 120px);
  background: var(--bg-secondary);
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.page-title-icon {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.editor-container {
  max-width: 1200px;
  margin: 0 auto;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.main-editor {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.editor-card {
  padding: 24px;
}

.title-input {
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid var(--border-light);
  border-radius: 0;
  padding: 12px 0;
}

.title-input:focus {
  border-bottom-color: var(--primary-color);
  box-shadow: none;
}

.input-counter {
  text-align: right;
  font-size: 12px;
  color: var(--text-light);
  margin-top: 4px;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 12px;
}

.editor-tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.editor-tool-btn:hover {
  background: var(--bg-hover);
}

.editor-tool-btn.active {
  background: var(--primary-color);
  color: white;
}

.tool-icon {
  width: 16px;
  height: 16px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--border-primary);
  margin: 0 8px;
}

.content-editor {
  border: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.content-editor:focus {
  box-shadow: none;
}

.label-tip {
  font-size: 12px;
  color: var(--text-light);
  font-weight: normal;
  margin-left: 8px;
}

.image-upload-area {
  border: 2px dashed var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

.image-action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.image-action-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-action-btn.delete {
  background: rgba(220, 53, 69, 0.8);
}

.action-icon {
  width: 12px;
  height: 12px;
}

.image-upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.image-upload-trigger:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-light);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.settings-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-content {
  padding: 20px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-light);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
}

.remove-tag-icon {
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.available-tags {
  margin-top: 8px;
}

.available-tags-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 8px;
  display: block;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.custom-tag-row { 
  display: flex; 
  gap: 8px; 
  align-items: center; 
}

.custom-tag-row .form-input { 
  flex: 1; 
}

.tag-option {
  padding: 6px 12px;
  background: var(--border-light);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.tag-option:hover:not(.disabled) {
  background: var(--bg-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag-option.selected {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tag-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.visibility-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-wrapper,
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-input,
.checkbox-input {
  accent-color: var(--primary-color);
  cursor: pointer;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.scheduled-time {
  margin-top: 8px;
}

.preview-content {
  padding: 16px;
}

.preview-post {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.preview-username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.preview-time {
  font-size: 12px;
  color: var(--text-light);
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.preview-content-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.preview-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.preview-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.preview-more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  border-radius: 4px;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.preview-tag {
  color: var(--primary-color);
  font-size: 12px;
}

.preview-source {
  font-size: 12px;
  color: var(--text-light);
  border-top: 1px solid var(--border-light);
  padding-top: 8px;
}

.source-label {
  font-weight: 500;
}

.source-text {
  color: var(--text-secondary);
}

.bottom-actions {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.draft-status {
  flex: 1;
}

.auto-save-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auto-save-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-light);
}

.save-icon {
  width: 14px;
  height: 14px;
  color: var(--text-light);
}

.saving-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--primary-color);
}

.saving-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--border-light);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .settings-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .news-publish-page {
    padding: 16px 0;
  }
  
  .editor-card,
  .settings-content {
    padding: 16px;
  }
  
  .bottom-actions {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
}
</style>



