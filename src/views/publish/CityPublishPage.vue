<template>
  <div class="city-publish-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <Wrench class="page-title-icon" />
          发布服务
        </h1>
        <p class="page-subtitle">提供便民服务，连接社区资源</p>
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
                  服务标题
                </label>
                <input 
                  v-model="formData.title"
                  type="text" 
                  class="form-input title-input"
                  placeholder="请输入服务标题，如 &quot;专业清洁服务&quot; 、 &quot;二手手机出售&quot; 等"
                  maxlength="100"
                />
                <div class="input-counter">{{ formData.title.length }}/100</div>
              </div>

              <!-- 内容编辑器（富文本） -->
              <div class="form-group">
                <label class="form-label">
                  <FileText class="inline-icon" />
                  服务详情
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
                  <button class="editor-tool-btn" @click="triggerEditorImage" title="插入图片">
                    <Image class="tool-icon" />
                  </button>
                </div>
                <div 
                  class="rich-editor"
                  ref="editorRef"
                  contenteditable="true"
                  :placeholder="getContentPlaceholder()"
                  @input="onEditorInput"
                  @paste.prevent="onEditorPaste"
                  @dragover.prevent
                  @drop.prevent="onEditorDrop"
                ></div>
                <input ref="editorImageInput" type="file" accept="image/*" style="display:none" @change="onEditorImageChange" />
              </div>

              <!-- 图片上传（富文本中进行） -->
              <div class="form-group">
                <label class="form-label">
                  <Image class="inline-icon" />
                  服务图片（在编辑器中粘贴/拖拽/工具按钮上传）
                </label>
              </div>

              <!-- 视频上传 -->
              <div class="form-group">
                <label class="form-label">
                  <Video class="inline-icon" />
                  服务视频
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
                  服务位置
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
                <!-- 分类选择 -->
                <div class="form-group">
                  <label class="form-label">分类</label>
                  <select v-model="formData.category" class="form-select">
                    <option value="">请选择分类</option>
                    <option 
                      v-for="category in serviceCategories" 
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </option>
                  </select>
                </div>

                <!-- 服务类型专属字段 -->
                <div class="form-group" v-if="formData.category">
                  <ServiceFields 
                    :category="formData.category" 
                    v-model:formData="formData"
                  />
                </div>

                <!-- 价格设置 -->
                <div class="form-group">
                  <label class="form-label">
                    <DollarSign class="inline-icon" />
                    价格
                  </label>
                  <div class="price-input">
                    <input 
                      v-model="formData.price"
                      type="number" 
                      class="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <span class="price-unit">RM</span>
                  </div>
                  <div class="price-options">
                    <label class="checkbox-wrapper">
                      <input 
                        v-model="formData.isPriceFree" 
                        type="checkbox" 
                        class="checkbox-input"
                      />
                      <span class="checkbox-label">免费</span>
                    </label>
                    <label class="checkbox-wrapper">
                      <input 
                        v-model="formData.isPriceNegotiable" 
                        type="checkbox" 
                        class="checkbox-input"
                      />
                      <span class="checkbox-label">价格面议</span>
                    </label>
                  </div>
                </div>

                <!-- 联系方式 -->
                <div class="form-group">
                  <label class="form-label">联系方式</label>
                  <input 
                    v-model="formData.contact"
                    type="text" 
                    class="form-input"
                    placeholder="电话号码或微信号"
                  />
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
                  <div class="preview-price" v-if="formData.price || formData.isPriceFree || formData.isPriceNegotiable">
                    <span class="price-label">价格：</span>
                    <span class="price-value">
                      <span v-if="formData.isPriceFree">免费</span>
                      <span v-else-if="formData.isPriceNegotiable">面议</span>
                      <span v-else-if="formData.price">RM {{ formData.price }}</span>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Wrench, Type, FileText, Image, Video, MapPin, Navigation, Settings, DollarSign, 
  Eye, Save, Send, Plus, X, ChevronLeft, ChevronRight, Clock, Globe, Users, Lock
} from 'lucide-vue-next'
import duducarAPI from '@/api/duducar-integration'
import { newsAPI } from '@/api/news'
import { extractImageKeysFromHtml } from '@/utils/richtext-images'
import ServiceFields from '@/components/publish/ServiceFields.vue'

const router = useRouter()

// 图标组件映射
const iconComponents = {
  Wrench, Type, FileText, Image, Video, MapPin, Navigation, Settings, DollarSign, 
  Eye, Save, Send, Plus, X, ChevronLeft, ChevronRight, Clock, Globe, Users, Lock
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Wrench
}

// 表单数据
const formData = ref({
  title: '',
  content: '',
  category: '',
  images: [],
  video: null,
  location: '',
  price: '',
  isPriceFree: false,
  isPriceNegotiable: false,
  contact: '',
  visibility: 'public',
  isScheduled: false,
  scheduledTime: ''
})

// 服务分类
const serviceCategories = ref([
  { value: 'jobs', label: '招聘' },
  { value: 'housing', label: '房屋租售' },
  { value: 'cars', label: '二手车' },
  { value: 'secondmarket', label: '二手市场' },
  { value: 'recycle', label: '二手回收' },
  { value: 'housekeeping', label: '家政服务' },
  { value: 'local', label: '本地服务' },
  { value: 'transport', label: '交通出行' },
  { value: 'food', label: '餐饮美食' },
  { value: 'shopping', label: '购物消费' },
  { value: 'health', label: '医疗健康' },
  { value: 'education', label: '教育培训' },
  { value: 'business', label: '商务服务' },
  { value: 'other', label: '其他服务' }
])

// 可见性选项
const visibilityOptions = ref([
  { value: 'public', label: '公开', icon: 'Globe' },
  { value: 'friends', label: '仅好友', icon: 'Users' },
  { value: 'private', label: '私密', icon: 'Lock' }
])

// refs
const contentEditor = ref(null)
const imageInput = ref(null)
const videoInput = ref(null)
const editorRef = ref(null)
const editorImageInput = ref(null)

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
         formData.value.category
})

// 方法
const getContentPlaceholder = () => {
  const cat = String(formData.value.category || '')
  const map = {
    jobs: '请填写招聘详情...\n\n建议包含：\n• 职位名称/类别、用工类型、薪资、福利\n• 工作地点、要求与职责\n• 联系方式',
    housing: '请填写房源详情...\n\n建议包含：\n• 租/售、方式(整租/合租/公寓)、面积、户型\n• 装修、朝向、位置/地铁\n• 看房方式与联系方式',
    cars: '请填写车辆信息...\n\n建议包含：\n• 品牌车型、上牌年份、里程\n• 车况亮点、是否包过户/可分期\n• 联系方式',
    secondmarket: '请填写物品信息...\n\n建议包含：\n• 类别/成色、数量、是否支持自提/同城\n• 使用情况亮点\n• 联系方式',
    recycle: '请填写回收信息...\n\n建议包含：\n• 回收类型、是否上门、服务范围\n• 计价方式与注意事项\n• 联系方式',
    housekeeping: '请填写家政服务信息...\n\n建议包含：\n• 服务类型、时薪/价格、服务范围\n• 服务时间与项目说明\n• 联系方式',
    local: '请填写服务信息...\n\n建议包含：\n• 服务类型、营业时间、服务范围\n• 价格与项目说明\n• 联系方式'
  }
  return map[cat] || '请描述您的服务内容...'
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

// 富文本插入与上传
const uploadImageToCOS = async (file) => {
  const resp = await duducarAPI.cos.uploadCommonImage(file)
  if (resp.success && resp.data) return resp.data
  throw new Error(resp.message || '上传失败')
}

const insertImageFileIntoEditor = async (file) => {
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) { alert('单张图片不超过5MB'); return }
  const tempUrl = URL.createObjectURL(file)
  document.execCommand('insertHTML', false, `<img src="${tempUrl}" alt="" style=\"max-width:100%;\" />`)
  try {
    const { objectKey, proxyUrl, cdnUrl } = await uploadImageToCOS(file)
    const imgs = editorRef.value?.querySelectorAll(`img[src="${tempUrl}"]`) || []
    imgs.forEach(img => {
      img.setAttribute('src', proxyUrl || cdnUrl)
      img.setAttribute('data-object-key', objectKey)
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
    reader.readAsDataURL(file)
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
      contentType: 'services',
      lastSaved: new Date().toISOString()
    }
    
    localStorage.setItem('zhimawang_service_draft', JSON.stringify(draftData))
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
    const savedDraft = localStorage.getItem('zhimawang_service_draft')
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft)
      
      const shouldRestore = confirm('检测到本地保存的草稿，是否要恢复？')
      
      if (shouldRestore) {
        Object.assign(formData.value, {
          title: draftData.title || '',
          content: draftData.content || '',
          category: draftData.category || '',
          images: draftData.images || [],
          video: draftData.video || null,
          location: draftData.location || '',
          price: draftData.price || '',
          isPriceFree: draftData.isPriceFree || false,
          isPriceNegotiable: draftData.isPriceNegotiable || false,
          contact: draftData.contact || '',
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
  localStorage.removeItem('zhimawang_service_draft')
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
  try {
    const html = editorRef.value?.innerHTML || ''
    const keys = extractImageKeysFromHtml(html)
    const resp = await newsAPI.publishArticle({
      editType: 1,
      articleName: formData.value.title,
      articleContent: html,
      contentType: 3,
      richTextImageKeys: keys
    })
    if (resp && resp.code === 200) {
      clearDraft()
      stopAutoSave()
      alert('服务发布成功！')
      router.push('/services')
    } else {
      throw new Error(resp?.message || '发布失败')
    }
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
.city-publish-page {
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

.price-input {
  position: relative;
}

.price-unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 14px;
}

.price-options {
  display: flex;
  gap: 16px;
  margin-top: 8px;
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

.preview-price {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.price-label {
  font-weight: 500;
}

.price-value {
  color: var(--primary-color);
  font-weight: 600;
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
  .city-publish-page {
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



