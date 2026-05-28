<template>
  <div class="create-post-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <Edit class="page-title-icon" />
          创建内容
        </h1>
        <p class="page-subtitle">分享您的精彩内容到知马网社区</p>
      </div>

      <!-- 内容类型选择 -->
      <div class="content-type-tabs">
        <div class="type-tabs-header">
          <div 
            v-for="type in contentTypes" 
            :key="type.value"
            :class="['type-tab', { active: selectedType === type.value }]"
            @click="selectedType = type.value"
          >
            <component :is="getIconComponent(type.icon)" class="type-tab-icon" />
            <div class="type-tab-content">
              <div class="type-tab-title">{{ type.title }}</div>
              <div class="type-tab-desc">{{ type.description }}</div>
            </div>
          </div>
        </div>
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
                  {{ getTitleLabel() }}
                </label>
                <input 
                  v-model="formData.title"
                  type="text" 
                  class="form-input title-input"
                  :placeholder="getTitlePlaceholder()"
                  maxlength="100"
                />
                <div class="input-counter">{{ formData.title.length }}/100</div>
              </div>

              <!-- 内容编辑器 -->
              <div class="form-group">
                <label class="form-label">
                  <FileText class="inline-icon" />
                  内容
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
                <textarea 
                  v-model="formData.content"
                  class="form-textarea content-editor"
                  :placeholder="getContentPlaceholder()"
                  rows="12"
                  ref="contentEditor"
                ></textarea>
                <div class="input-counter">{{ formData.content.length }}/5000</div>
              </div>

              <!-- 图片上传 -->
              <div class="form-group">
                <label class="form-label">
                  <Image class="inline-icon" />
                  图片
                  <span class="label-tip">最多上传9张图片</span>
                </label>
                <div class="image-upload-area">
                  <div class="uploaded-images" v-if="formData.images.length">
                    <div 
                      v-for="(image, index) in formData.images" 
                      :key="index"
                      class="image-preview"
                    >
                      <img :src="image.url" :alt="`图片 ${index + 1}`" />
                      <div class="image-actions">
                        <button class="image-action-btn" @click="moveImage(index, -1)" v-if="index > 0">
                          <ChevronLeft class="action-icon" />
                        </button>
                        <button class="image-action-btn" @click="moveImage(index, 1)" v-if="index < formData.images.length - 1">
                          <ChevronRight class="action-icon" />
                        </button>
                        <button class="image-action-btn delete" @click="removeImage(index)">
                          <X class="action-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div 
                    class="image-upload-trigger"
                    @click="triggerImageUpload"
                    @dragover.prevent
                    @drop.prevent="handleImageDrop"
                    v-if="formData.images.length < 9"
                  >
                    <Plus class="upload-icon" />
                    <div class="upload-text">点击上传图片</div>
                    <div class="upload-tip">支持 JPG、PNG、GIF 格式，单张图片不超过5MB</div>
                  </div>
                  <input 
                    ref="imageInput" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    style="display: none"
                    @change="handleImageUpload"
                  />
                </div>
              </div>

              <!-- 视频上传（仅便民服务和知马圈） -->
              <div class="form-group" v-if="selectedType !== 'news'">
                <label class="form-label">
                  <Video class="inline-icon" />
                  视频
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

              <!-- 位置信息（便民服务和知马圈） -->
              <div class="form-group" v-if="selectedType !== 'news'">
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
                <!-- 分类选择 - 资讯新闻和便民服务显示 -->
                <div class="form-group" v-if="selectedType === 'news' || selectedType === 'services'">
                  <label class="form-label">分类</label>
                  <select v-model="formData.category" class="form-select">
                    <option value="">请选择分类</option>
                    <option 
                      v-for="category in (selectedType==='services' ? topServiceCategories : getCategories())" 
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </option>
                  </select>
                </div>

                <!-- 服务类型：分类专属字段 -->
                <div class="form-group" v-if="selectedType === 'services' && formData.category">
                  <!-- 招聘 -->
                  <template v-if="formData.category==='jobs'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">职位类别</label>
                        <select v-model="formData.jobCategory" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="c in jobCategories" :key="c" :value="c">{{ c }}</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">用工类型</label>
                        <select v-model="formData.jobType" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="t in jobTypes" :key="t" :value="t">{{ t }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">薪资（RM/月）</label>
                        <input v-model="formData.salary" type="number" class="form-input" placeholder="例如 3000" min="0" />
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">工作地点</label>
                        <input v-model="formData.jobArea" type="text" class="form-input" placeholder="城市/区域" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">福利</label>
                      <div class="chips-row">
                        <button class="btn btn-ghost btn-small" v-for="w in jobWelfaresAll" :key="w" @click.prevent="toggleWelfare(w)">{{ w }}</button>
                      </div>
                    </div>
                  </template>

                  <!-- 房屋租售 -->
                  <template v-else-if="formData.category==='housing'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">类别</label>
                        <select v-model="formData.housingRentOrSale" class="form-select">
                          <option value="">请选择</option>
                          <option value="租">租</option>
                          <option value="售">售</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">方式/类型</label>
                        <select v-model="formData.housingMode" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="m in housingModes" :key="m" :value="m">{{ m }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">面积（㎡）</label>
                        <input v-model="formData.housingSize" type="number" min="0" class="form-input" placeholder="例如 86" />
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">户型</label>
                        <select v-model="formData.huxing" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="h in housingRooms" :key="h" :value="h">{{ h }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">装修</label>
                        <select v-model="formData.decoration" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="d in housingDecorations" :key="d" :value="d">{{ d }}</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">朝向</label>
                        <select v-model="formData.orientation" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="o in housingOrientations" :key="o" :value="o">{{ o }}</option>
                        </select>
                      </div>
                    </div>
                  </template>

                  <!-- 二手车 -->
                  <template v-else-if="formData.category==='cars'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">品牌</label>
                        <input v-model="formData.carBrand" type="text" class="form-input" placeholder="如 丰田/本田/大众" />
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">车型</label>
                        <select v-model="formData.carBody" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="b in carBodies" :key="b" :value="b">{{ b }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">里程（km）</label>
                        <input v-model="formData.mileageKm" type="number" min="0" class="form-input" placeholder="例如 50000" />
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">上牌年份</label>
                        <input v-model="formData.carYear" type="number" min="1990" class="form-input" placeholder="例如 2018" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">其他</label>
                      <div class="chips-row">
                        <label class="checkbox-wrapper"><input type="checkbox" class="checkbox-input" v-model="formData.transferIncluded" /> <span class="checkbox-label">包过户</span></label>
                        <label class="checkbox-wrapper"><input type="checkbox" class="checkbox-input" v-model="formData.canInstallment" /> <span class="checkbox-label">可分期</span></label>
                      </div>
                    </div>
                  </template>

                  <!-- 二手市场 -->
                  <template v-else-if="formData.category==='secondmarket'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">成色</label>
                        <select v-model="formData.itemCondition" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="c in itemConditions" :key="c" :value="c">{{ c }}</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">配送/自提</label>
                        <select v-model="formData.delivery" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="d in deliveryOptions" :key="d" :value="d">{{ d }}</option>
                        </select>
                      </div>
                    </div>
                  </template>

                  <!-- 二手回收 -->
                  <template v-else-if="formData.category==='recycle'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">回收类型</label>
                        <select v-model="formData.recycleType" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="r in recycleTypes" :key="r" :value="r">{{ r }}</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">服务范围</label>
                        <input v-model="formData.serviceArea" class="form-input" placeholder="服务城市/区域" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">上门服务</label>
                      <label class="checkbox-wrapper"><input type="checkbox" class="checkbox-input" v-model="formData.doorstep" /> <span class="checkbox-label">支持上门回收</span></label>
                    </div>
                  </template>

                  <!-- 家政服务 -->
                  <template v-else-if="formData.category==='housekeeping'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">服务类型</label>
                        <select v-model="formData.housekeepingType" class="form-select">
                          <option value="">请选择</option>
                          <option v-for="t in housekeepingTypes" :key="t" :value="t">{{ t }}</option>
                        </select>
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">时薪（RM/小时）</label>
                        <input v-model="formData.hourlyPrice" type="number" min="0" class="form-input" placeholder="例如 30" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">服务范围</label>
                      <input v-model="formData.serviceArea" class="form-input" placeholder="服务城市/区域" />
                    </div>
                  </template>

                  <!-- 本地服务 -->
                  <template v-else-if="formData.category==='local'">
                    <div class="form-row">
                      <div class="form-group-half">
                        <label class="form-label">服务类型</label>
                        <input v-model="formData.localServiceType" class="form-input" placeholder="如 开锁/修理/摄影" />
                      </div>
                      <div class="form-group-half">
                        <label class="form-label">营业时间</label>
                        <input v-model="formData.businessHours" class="form-input" placeholder="如 10:00-20:00" />
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 标签选择 - 资讯新闻/知马圈/便民服务显示（便民服务按分类推荐） -->
                <div class="form-group" v-if="selectedType === 'news' || selectedType === 'lifestyle' || selectedType === 'services'">
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

                <!-- 价格设置（仅便民服务） -->
                <div class="form-group" v-if="selectedType === 'services'">
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

                <!-- 联系方式（便民服务） -->
                <div class="form-group" v-if="selectedType === 'services'">
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
                  <div class="preview-tags" v-if="formData.tags.length">
                    <span 
                      v-for="tag in formData.tags" 
                      :key="tag"
                      class="preview-tag"
                    >
                      #{{ tag }}
                    </span>
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
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, Edit, Type, FileText, Image, Video, MapPin, Navigation,
  Settings, DollarSign, Eye, Save, Send, Plus, X, ChevronLeft, ChevronRight,
  Smile, Link, Bold, Italic, Underline, List, Hash, Quote,
  Globe, Users, Lock, Clock, Newspaper, Wrench, Heart
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 图标组件映射
const iconComponents = {
  ArrowLeft, Edit, Type, FileText, Image, Video, MapPin, Navigation,
  Settings, DollarSign, Eye, Save, Send, Plus, X, ChevronLeft, ChevronRight,
  Smile, Link, Bold, Italic, Underline, List, Hash, Quote,
  Globe, Users, Lock, Clock, Newspaper, Wrench, Heart
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Edit
}

// 内容类型
const contentTypes = ref([
  {
    value: 'news',
    title: '资讯新闻',
    description: '分享新闻资讯、政策解读、社会热点',
    icon: 'Newspaper'
  },
  {
    value: 'services',
    title: '便民服务',
    description: '提供生活服务、商品交易、求助信息',
    icon: 'Wrench'
  },
  {
    value: 'lifestyle',
    title: '知马圈',
    description: '分享生活动态、心情感悟、精彩瞬间',
    icon: 'Heart'
  }
])

// 选中的内容类型
const selectedType = ref('news')

// 监听内容类型变化，清空相关字段
watch(selectedType, (newType, oldType) => {
  if (newType !== oldType) {
    // 根据新类型清空不相关的字段
    if (newType === 'services') {
      // 便民服务不需要标签
      formData.value.tags = []
    } else if (newType === 'lifestyle') {
      // 知马圈不需要分类
      formData.value.category = ''
    }
  }
})

// 表单数据
const formData = ref({
  title: '',
  content: '',
  category: '',
  tags: [],
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

// 可用标签（根据内容类型与便民服务分类动态变化）
const availableTags = computed(() => {
  if (selectedType.value === 'services') {
    const serviceTagsByCategory = {
      jobs: ['全职','兼职','五险一金','周末双休','包吃','包住','司机','客服','销售','普工/技工','临时工','短期工'],
      housing: ['整租','合租','长租公寓','个人房源','二手房','新房','近地铁','精装修','押一付一','南北通透','看房','户型'],
      cars: ['SUV','轿车','工程车','货车','低里程','一手车','包过户','可分期','年检新'],
      secondmarket: ['家具','家电','数码','自提','同城','二手求购','九成新','包邮'],
      recycle: ['手机回收','电脑回收','上门回收','废旧金属','价格面议','环保'],
      housekeeping: ['保洁','保姆','月嫂','小时工','搬家','疏通','空调清洗','家电维修'],
      local: ['开锁','修理','摄影','打印复印','网络服务','美容装饰','洗衣到家']
    }
    const cat = String(formData.value.category || '')
    return serviceTagsByCategory[cat] || []
  }
  const tagsByType = {
    news: ['马来西亚', '华人社区', '政策解读', '经济发展', '文化交流', '教育资讯', '投资理财', '生活服务', '旅游观光', '科技创新'],
    lifestyle: ['生活分享','文化艺术','时尚美妆','日常生活','美食推荐','运动健身','情感心理','旅行游记','科技数码']
  }
  return tagsByType[selectedType.value] || []
})

// refs
const contentEditor = ref(null)
const imageInput = ref(null)
const videoInput = ref(null)

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
  const hasBasicContent = formData.value.title.trim() && formData.value.content.trim()
  
  // 根据内容类型检查必填字段
  if (selectedType.value === 'news') {
    // 资讯新闻需要分类和标签
    return hasBasicContent && formData.value.category && formData.value.tags.length > 0
  } else if (selectedType.value === 'services') {
    // 便民服务只需要分类
    return hasBasicContent && formData.value.category
  } else if (selectedType.value === 'lifestyle') {
    // 知马圈只需要标签
    return hasBasicContent && formData.value.tags.length > 0
  }
  
  return hasBasicContent
})

// 方法

const getTitleLabel = () => {
  const labels = {
    news: '新闻标题',
    services: '服务标题',
    lifestyle: '动态标题'
  }
  return labels[selectedType.value] || '标题'
}

const getTitlePlaceholder = () => {
  const placeholders = {
    news: '请输入新闻标题，简明扼要地概括新闻要点',
    services: '请输入服务标题，如"专业清洁服务"、"二手手机出售"等',
    lifestyle: '请输入动态标题，分享你的心情或见闻'
  }
  return placeholders[selectedType.value] || '请输入标题'
}

const getContentPlaceholder = () => {
  if (selectedType.value === 'services') {
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
  const placeholders = {
    news: '请输入新闻内容...\n\n写作建议：\n• 客观、准确地报道事实\n• 结构清晰，包含时间、地点、人物、事件\n• 语言简洁明了，避免主观色彩',
    lifestyle: '分享你的想法和感受...\n\n写作建议：\n• 真实表达个人观点和感受\n• 可以分享生活中的有趣经历\n• 互动交流，建立社区连接'
  }
  return placeholders[selectedType.value] || '请输入内容'
}

const getCategories = () => {
  const categories = {
    news: [
      { value: 'local', label: '本地新闻' },
      { value: 'china', label: '中国热点' }
    ],
    services: [
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
    ]
    // lifestyle 不需要分类
  }
  return categories[selectedType.value] || []
}

// 服务 - 一级分类（下拉）
const topServiceCategories = [
  { value: 'jobs', label: '招聘' },
  { value: 'housing', label: '房产' },
  { value: 'cars', label: '二手车' },
  { value: 'secondmarket', label: '二手市场' },
  { value: 'recycle', label: '二手回收' },
  { value: 'housekeeping', label: '家政服务' },
  { value: 'local', label: '本地服务' }
]

const setServiceCategory = (val) => {
  if (selectedType.value !== 'services') return
  formData.value.category = val
}

// 服务类 - 选项集合
const jobCategories = ['司机/物流','客服','销售','服务员','普工/技工','餐饮','人事/行政']
const jobTypes = ['全职','兼职']
const jobWelfaresAll = ['五险一金','周末双休','包吃','包住']

const housingModes = ['整租','合租','长租公寓','个人房源','二手房','新房']
const housingRooms = ['一居','二居','三居','四居','别墅','Loft']
const housingDecorations = ['毛坯','简装','精装']
const housingOrientations = ['南北','朝南','朝北','东西']

const carBodies = ['轿车','SUV/MPV','跑车','面包车','工程车','货车']

const itemConditions = ['全新','九成新','八成新','七成新']
const deliveryOptions = ['自提','同城配送','快递']

const recycleTypes = ['手机','电脑','家电','金属','塑料','纸品','其他']
const housekeepingTypes = ['保洁','保姆','月嫂','搬家','疏通','空调清洗','家电维修']

const handleToolClick = (tool) => {
  activeTool.value = activeTool.value === tool ? '' : tool
}

const insertEmoji = () => {
  // 实现表情插入
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
    const linkText = `[链接](${url})`
    const textarea = contentEditor.value
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.value.content
    formData.value.content = text.substring(0, start) + linkText + text.substring(end)
    
    nextTick(() => {
      textarea.focus()
      textarea.setSelectionRange(start + linkText.length, start + linkText.length)
    })
  }
}

const triggerImageUpload = () => {
  imageInput.value.click()
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.images.push({
          file,
          url: e.target.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  })
  event.target.value = ''
}

const handleImageDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  files.forEach(file => {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.images.push({
          file,
          url: e.target.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  })
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

const toggleTag = (tag) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    // 如果已选中，则移除
    formData.value.tags.splice(index, 1)
  } else {
    // 如果未选中且未达到上限，则添加
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
  // 简单校验：长度与字符
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
    
    // 准备保存数据（排除文件对象，只保存基本信息）
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
      contentType: selectedType.value,
      lastSaved: new Date().toISOString()
    }
    
    // 保存到本地存储
    localStorage.setItem('zhimawang_draft', JSON.stringify(draftData))
    
    // 更新保存时间
    lastAutoSaveTime.value = new Date()
    
    if (!isAuto) {
      // 手动保存提示
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
  // 清除之前的定时器
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }
  
  // 设置新的定时器
  autoSaveTimer.value = setInterval(() => {
    // 只有当内容不为空时才自动保存
    if (formData.value.title.trim() || formData.value.content.trim()) {
      saveDraft(true)
    }
  }, AUTO_SAVE_INTERVAL)
}

// 停止自动保存
const stopAutoSave = () => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
}

// 从本地存储加载草稿
const loadDraft = () => {
  try {
    const savedDraft = localStorage.getItem('zhimawang_draft')
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft)
      
      // 询问用户是否要恢复草稿
      const shouldRestore = confirm('检测到本地保存的草稿，是否要恢复？')
      
      if (shouldRestore) {
        // 恢复表单数据
        Object.assign(formData.value, {
          title: draftData.title || '',
          content: draftData.content || '',
          category: draftData.category || '',
          tags: draftData.tags || [],
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
        
        // 恢复内容类型
        if (draftData.contentType) {
          selectedType.value = draftData.contentType
        }
        
        // 设置最后保存时间
        if (draftData.lastSaved) {
          lastAutoSaveTime.value = new Date(draftData.lastSaved)
        }
        
      }
    }
  } catch (error) {
    console.error('加载草稿失败:', error)
  }
}

// 清除草稿
const clearDraft = () => {
  localStorage.removeItem('zhimawang_draft')
  lastAutoSaveTime.value = null
}

// 格式化保存时间
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
    // 发布逻辑
    
    // 发布成功后清除草稿
    clearDraft()
    stopAutoSave()
    
    alert('发布成功！')
    router.push('/')
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  }
}

// 监听表单数据变化，触发自动保存
watch(
  () => formData.value,
  () => {
    // 防抖：用户停止输入后1秒触发保存检查
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
  },
  { deep: true }
)

// 初始化
onMounted(() => {
  // 设置默认定时发布时间
  formData.value.scheduledTime = minDateTime.value
  
  // 加载本地草稿
  loadDraft()
  
  // 开始自动保存
  startAutoSave()
  // 根据路由参数初始化类型（支持 service 别名）
  const tRaw = String(route.query.type || '').toLowerCase()
  const t = tRaw === 'service' ? 'services' : tRaw
  if (['news','services','lifestyle'].includes(t)) {
    selectedType.value = t
  }
  // 预选分类（如从“我要卖房”进入）
  const catParam = String(route.query.category || '')
  if (selectedType.value === 'services' && catParam) {
    // 将自定义分类映射到已定义的分类值
    const mapping = {
      housing: 'housing',
      房屋租售: 'housing'
    }
    const mapped = mapping[catParam] || catParam
    const valid = getCategories().some(c => c.value === mapped)
    if (valid) {
      formData.value.category = mapped
    }
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stopAutoSave()
})

// 监听路由参数变化以切换编辑类型
watch(
  () => route.query.type,
  (val) => {
    const tRaw = String(val || '').toLowerCase()
    const t = tRaw === 'service' ? 'services' : tRaw
    if (['news','services','lifestyle'].includes(t)) {
      selectedType.value = t
    }
  }
)

// 分类切换：重置服务类专属字段
watch(() => formData.value.category, () => {
  if (selectedType.value !== 'services') return
  const reserved = new Set(['category','title','content','tags','images','video','location','price','isPriceFree','isPriceNegotiable','contact','visibility','isScheduled','scheduledTime'])
  Object.keys(formData.value).forEach(k => {
    if (!reserved.has(k)) {
      if (Array.isArray(formData.value[k])) formData.value[k] = []
      else formData.value[k] = ''
    }
  })
})

// 招聘福利切换
const toggleWelfare = (w) => {
  if (!Array.isArray(formData.value.welfares)) formData.value.welfares = []
  const i = formData.value.welfares.indexOf(w)
  if (i >= 0) formData.value.welfares.splice(i, 1)
  else formData.value.welfares.push(w)
}
</script>

<style scoped>
/* 使用global.css中的样式，只添加页面特定样式 */
.create-post-page {
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

.content-type-tabs {
  margin-bottom: 32px;
}

.type-tabs-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.type-tab {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-tab:hover {
  border-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.type-tab.active {
  border-color: var(--primary-color);
  background: var(--bg-light);
}

.type-tab-icon {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.type-tab-content {
  flex: 1;
}

.type-tab-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.type-tab-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
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

.tag-input-area {
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 8px;
  background: #fff;
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

.custom-tag-row { display: flex; gap: 8px; align-items: center; }
.custom-tag-row .form-input { flex: 1; }

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

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preview-tag {
  color: var(--primary-color);
  font-size: 12px;
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
  .create-post-page {
    padding: 16px 0;
  }
  
  .type-tabs-header {
    grid-template-columns: 1fr;
  }
  
  .type-tab {
    padding: 16px;
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
