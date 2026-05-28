<template>
  <div class="circles-publish-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <Heart class="page-title-icon" />
          发布动态
        </h1>
        <p class="page-subtitle">分享生活动态，记录精彩瞬间</p>
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
                  动态标题
                </label>
                <input 
                  v-model="formData.title"
                  type="text" 
                  class="form-input title-input"
                  placeholder="请输入动态标题，分享你的心情或见闻"
                  maxlength="100"
                />
                <div class="input-counter">{{ formData.title.length }}/100</div>
              </div>

              <!-- 内容编辑器 -->
              <div class="form-group">
                <label class="form-label">
                  <FileText class="inline-icon" />
                  动态内容
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
                </div>
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
                  :data-placeholder="'分享你的想法和感受...\n\n写作建议：\n• 真实表达个人观点和感受\n• 可以分享生活中的有趣经历\n• 互动交流，建立社区连接'"
                  @input="onEditorInput"
                  @paste.prevent="onEditorPaste"
                  @dragover.prevent
                  @drop.prevent="onEditorDrop"
                ></div>
                <input ref="editorImageInput" type="file" accept="image/*" style="display:none" @change="onEditorImageChange" />
              </div>

              <!-- 图片上传（整合到富文本中，保留占位工具按钮） -->
              <div class="form-group">
                <label class="form-label">
                  <Image class="inline-icon" />
                  动态图片（在编辑器中粘贴/拖拽/工具按钮上传）
                </label>
              </div>

              <!-- 视频上传 -->
              <div class="form-group">
                <label class="form-label">
                  <Video class="inline-icon" />
                  动态视频
                  <span class="label-tip">可选，最大100MB</span>
                </label>
                <div class="video-upload-area">
                  <div class="video-preview" v-if="formData.video">
                    <video :src="formData.video.url" controls></video>
                    <button class="video-remove-btn" @click="removeVideo">
                      <X class="action-icon" />
                    </button>
                  </div>
                  <div 
                    class="video-upload-trigger"
                    @click="triggerVideoUpload"
                    v-else
                  >
                    <Video class="upload-icon" />
                    <div class="upload-text">点击上传视频</div>
                    <div class="upload-tip">支持 MP4、MOV、AVI 格式</div>
                  </div>
                  <input 
                    ref="videoInput" 
                    type="file" 
                    accept="video/*" 
                    style="display: none"
                    @change="handleVideoUpload"
                  />
                </div>
              </div>

              <!-- 位置信息 -->
              <div class="form-group">
                <label class="form-label">
                  <MapPin class="inline-icon" />
                  位置
                  <span class="label-tip">可选</span>
                </label>
                <div class="location-input">
                  <input 
                    v-model="formData.location"
                    type="text" 
                    class="form-input"
                    placeholder="添加位置信息"
                  />
                  <button class="location-btn" @click="getCurrentLocation">
                    <Navigation class="inline-icon" />
                    获取当前位置
                  </button>
                </div>
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

                <!-- 心情状态 -->
                <div class="form-group">
                  <label class="form-label">心情状态</label>
                  <div class="mood-options">
                    <button 
                      v-for="mood in moodOptions" 
                      :key="mood.value"
                      :class="['mood-btn', { active: formData.mood === mood.value }]"
                      @click="formData.mood = mood.value"
                    >
                      <span class="mood-emoji">{{ mood.emoji }}</span>
                      <span class="mood-text">{{ mood.label }}</span>
                    </button>
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
                    <div class="preview-mood" v-if="formData.mood">
                      <span class="mood-emoji">{{ getMoodEmoji(formData.mood) }}</span>
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
                  <div class="preview-location" v-if="formData.location">
                    <span class="location-label">位置：</span>
                    <span class="location-text">{{ formData.location }}</span>
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
import { 
  Heart, Type, FileText, Image, Video, MapPin, Navigation, Settings, Eye, Save, Send, Plus, X, 
  ChevronLeft, ChevronRight, Smile, Link, Bold, Italic, Underline, List, Quote, Clock, Globe, Users, Lock
} from 'lucide-vue-next'
import duducarAPI from '@/api/duducar-integration'
import { newsAPI } from '@/api/news'
import { extractImageKeysFromHtml } from '@/utils/richtext-images'

const router = useRouter()

// 图标组件映射
const iconComponents = {
  Heart, Type, FileText, Image, Video, MapPin, Navigation, Settings, Eye, Save, Send, Plus, X, 
  ChevronLeft, ChevronRight, Smile, Link, Bold, Italic, Underline, List, Quote, Clock, Globe, Users, Lock
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Heart
}

// 表单数据
const formData = ref({
  title: '',
  content: '',
  tags: [],
  images: [],
  video: null,
  location: '',
  mood: '',
  visibility: 'public',
  isScheduled: false,
  scheduledTime: ''
})

// 可用标签
const availableTags = ref([
  '生活分享','文化艺术','时尚美妆','日常生活','美食推荐','运动健身','情感心理','旅行游记','科技数码'
])

// 心情选项
const moodOptions = ref([
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'peaceful', label: '平静', emoji: '😌' },
  { value: 'thoughtful', label: '思考', emoji: '🤔' },
  { value: 'grateful', label: '感恩', emoji: '🙏' },
  { value: 'loved', label: '被爱', emoji: '💕' },
  { value: 'proud', label: '自豪', emoji: '💪' },
  { value: 'creative', label: '创意', emoji: '🎨' },
  { value: 'adventurous', label: '冒险', emoji: '🏔️' },
  { value: 'nostalgic', label: '怀旧', emoji: '📸' }
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
const uploadCache = new Map()
const videoInput = ref(null)

// 自动保存相关
const lastAutoSaveTime = ref(null)
const isAutoSaving = ref(false)
const autoSaveTimer = ref(null)
const AUTO_SAVE_INTERVAL = 30000

// 计算属性
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  return now.toISOString().slice(0, 16)
})

const canPublish = computed(() => {
  return formData.value.title.trim() && 
         formData.value.content.trim() && 
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

const triggerImageUpload = () => { imageInput.value.click() }
const triggerEditorImage = () => { editorImageInput.value.click() }

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  for (const f of files) await insertImageFileIntoEditor(f)
  event.target.value = ''
}

const handleImageDrop = async (event) => {
  const files = Array.from(event.dataTransfer.files)
  for (const f of files) await insertImageFileIntoEditor(f)
}

const removeImage = (index) => {
  formData.value.images.splice(index, 1)
}

const moveImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < formData.value.images.length) {
    const [item] = formData.value.images.splice(index, 1)
    formData.value.images.splice(newIndex, 0, item)
  }
}

// 富文本上传/插入
const uploadImageToCOS = async (file) => {
  const resp = await duducarAPI.cos.uploadCommonImage(file)
  if (resp.success && resp.data) return resp.data
  throw new Error(resp.message || '上传失败')
}

const insertImageFileIntoEditor = async (file) => {
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) { alert('单张图片不超过5MB'); return }
  const tempUrl = URL.createObjectURL(file)
  document.execCommand('insertHTML', false, `<img src="${tempUrl}" alt="" style="max-width:100%;" />`)
  try {
    const { objectKey, proxyUrl, cdnUrl } = await uploadImageToCOS(file)
    const imgs = editorRef.value?.querySelectorAll(`img[src="${tempUrl}"]`) || []
    imgs.forEach(img => {
      img.setAttribute('src', proxyUrl || cdnUrl)
      img.setAttribute('data-object-key', objectKey)
      uploadCache.set(img.getAttribute('src'), cdnUrl || proxyUrl)
    })
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
  const text = e.clipboardData?.getData('text/plain') || ''
  if (text) document.execCommand('insertText', false, text)
}

const onEditorDrop = async (e) => {
  const files = Array.from(e.dataTransfer?.files || [])
  for (const f of files) await insertImageFileIntoEditor(f)
}

const onEditorImageChange = async (e) => {
  const files = Array.from(e.target.files || [])
  for (const f of files) await insertImageFileIntoEditor(f)
  e.target.value = ''
}

const onEditorInput = () => {
  formData.value.content = editorRef.value?.innerHTML || ''
}

const triggerVideoUpload = () => {
  videoInput.value.click()
}

const handleVideoUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.video = {
        file,
        url: e.target.result,
        name: file.name
      }
    }
   (item)
  }
  event.target.value = ''
}

const removeVideo = () => {
  formData.value.video = null
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formData.value.location = `纬度: ${position.coords.latitude.toFixed(6)}, 经度: ${position.coords.longitude.toFixed(6)}`
      },
      (error) => {
        console.error('获取位置失败:', error)
        alert('获取位置失败，请检查浏览器权限设置')
      }
    )
  } else {
    alert('浏览器不支持地理定位')
  }
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

const getMoodEmoji = (mood) => {
  const moodOption = moodOptions.value.find(m => m.value === mood)
  return moodOption ? moodOption.emoji : ''
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
      video: formData.value.video ? {
        url: formData.value.video.url,
        name: formData.value.video.name
      } : null,
      contentType: 'lifestyle',
      lastSaved: new Date().toISOString()
    }
    
    localStorage.setItem('zhimawang_lifestyle_draft', JSON.stringify(draftData))
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

const loadDraft = () => {
  try {
    const savedDraft = localStorage.getItem('zhimawang_lifestyle_draft')
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft)
      
      const shouldRestore = confirm('检测到本地保存的草稿，是否要恢复？')
      
      if (shouldRestore) {
        Object.assign(formData.value, {
          title: draftData.title || '',
          content: draftData.content || '',
          tags: draftData.tags || [],
          images: draftData.images || [],
          video: draftData.video || null,
          location: draftData.location || '',
          mood: draftData.mood || '',
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
  localStorage.removeItem('zhimawang_lifestyle_draft')
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
  if (!canPublish.value) return
  // 取富文本 HTML 与对象键
  const html = editorRef.value?.innerHTML || ''
  const keys = extractImageKeysFromHtml(html)
  try {
    const resp = await newsAPI.publishArticle({
      editType: 1,
      articleName: formData.value.title,
      articleContent: html,
      contentType: 4, // 留学圈/知马圈
      richTextImageKeys: keys
    })
    if (resp && resp.code === 200) {
      clearDraft()
      stopAutoSave()
      alert('动态发布成功！')
      router.push('/circles')
    } else {
      throw new Error(resp?.message || '发布失败')
    }
    clearDraft()
    stopAutoSave()
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
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
    const hasContent = (
      formData.value.title.trim() ||
      formData.value.content.trim() ||
      formData.value.images.length ||
      !!formData.value.video
    )
    if (hasContent) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
}
</script>

<style scoped>
/* 使用global.css中的样式，只添加页面特定样式 */
.circles-publish-page {
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

.video-upload-area {
  border: 2px dashed var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
}

.video-preview {
  position: relative;
  padding: 16px;
}

.video-preview video {
  width: 100%;
  border-radius: 8px;
}

.video-remove-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.video-remove-btn:hover {
  background: rgba(220, 53, 69, 1);
}

.video-upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.video-upload-trigger:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
}

.location-input {
  display: flex;
  gap: 12px;
}

.location-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.location-btn:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
  color: var(--primary-color);
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

.mood-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-btn:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
}

.mood-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.mood-emoji {
  font-size: 20px;
}

.mood-text {
  font-size: 12px;
  font-weight: 500;
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

.preview-user-info {
  flex: 1;
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

.preview-mood {
  font-size: 20px;
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

.preview-location {
  font-size: 12px;
  color: var(--text-light);
  border-top: 1px solid var(--border-light);
  padding-top: 8px;
}

.location-label {
  font-weight: 500;
}

.location-text {
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
  .circles-publish-page {
    padding: 16px 0;
  }
  
  .mood-options {
    grid-template-columns: repeat(3, 1fr);
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



