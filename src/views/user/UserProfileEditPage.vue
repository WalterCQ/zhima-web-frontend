<template>
  <div class="edit-profile-page">
    <div class="edit-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <ArrowLeft :size="20" />
          <span>返回</span>
        </button>
        <h1 class="page-title">编辑个人资料</h1>
        <button class="save-btn" @click="saveProfile" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>

      <!-- 封面图片编辑 -->
      <div class="cover-section">
        <div class="cover-preview">
          <img :src="$getImageUrl(form.cover || coverFallback)" alt="封面图片" />
          <div class="cover-overlay">
            <button class="upload-btn" @click="triggerCoverUpload">
              <Camera :size="20" />
              <span>更换封面</span>
            </button>
          </div>
        </div>
        <input 
          ref="coverInput" 
          type="file" 
          accept="image/*" 
          style="display: none" 
          @change="handleCoverUpload"
        />
      </div>

      <!-- 头像编辑 -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img :src="$getImageUrl(form.avatar)" alt="头像" class="avatar-img" />
          <div class="avatar-overlay">
            <button class="upload-btn" @click="triggerAvatarUpload">
              <Camera :size="16" />
            </button>
          </div>
        </div>
        <input 
          ref="avatarInput" 
          type="file" 
          accept="image/*" 
          style="display: none" 
          @change="handleAvatarUpload"
        />
      </div>

      <!-- 表单区域 -->
      <div class="form-section">
        <!-- 用户名 -->
        <div class="form-group">
          <label class="form-label">
            <User :size="16" />
            <span>用户名</span>
          </label>
          <input 
            v-model="form.username" 
            type="text" 
            class="form-input" 
            placeholder="请输入用户名"
            maxlength="20"
          />
          <div class="form-hint">{{ form.username.length }}/20</div>
        </div>

        <!-- 个人简介 -->
        <div class="form-group">
          <label class="form-label">
            <FileText :size="16" />
            <span>个人简介</span>
          </label>
          <textarea 
            v-model="form.bio" 
            class="form-textarea" 
            placeholder="介绍一下你自己吧..."
            maxlength="200"
            rows="4"
          ></textarea>
          <div class="form-hint">{{ form.bio.length }}/200</div>
        </div>

        <!-- 性别 -->
        <div class="form-group">
          <label class="form-label">
            <Users :size="16" />
            <span>性别</span>
          </label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="form.gender" value="male" />
              <span>男</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="form.gender" value="female" />
              <span>女</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="form.gender" value="other" />
              <span>保密</span>
            </label>
          </div>
        </div>

        <!-- 生日 -->
        <div class="form-group">
          <label class="form-label">
            <Calendar :size="16" />
            <span>生日</span>
          </label>
          <input 
            v-model="form.birthday" 
            type="date" 
            class="form-input"
          />
        </div>

        <!-- 所在地 -->
        <div class="form-group">
          <label class="form-label">
            <MapPin :size="16" />
            <span>所在地</span>
          </label>
          <input 
            v-model="form.location" 
            type="text" 
            class="form-input" 
            placeholder="例如：吉隆坡"
          />
        </div>

        <!-- 职业 -->
        <div class="form-group">
          <label class="form-label">
            <Briefcase :size="16" />
            <span>职业</span>
          </label>
          <input 
            v-model="form.occupation" 
            type="text" 
            class="form-input" 
            placeholder="例如：软件工程师"
          />
        </div>

        <!-- 个人网站 -->
        <div class="form-group">
          <label class="form-label">
            <Link2 :size="16" />
            <span>个人网站</span>
          </label>
          <input 
            v-model="form.website" 
            type="url" 
            class="form-input" 
            placeholder="https://"
          />
        </div>

        <!-- 社交媒体 -->
        <div class="form-group">
          <label class="form-label">
            <Share2 :size="16" />
            <span>社交媒体</span>
          </label>
          <div class="social-inputs">
            <div class="social-item">
              <span class="social-label">微信</span>
              <input 
                v-model="form.social.wechat" 
                type="text" 
                class="form-input" 
                placeholder="微信号"
              />
            </div>
            <div class="social-item">
              <span class="social-label">WhatsApp</span>
              <input 
                v-model="form.social.whatsapp" 
                type="text" 
                class="form-input" 
                placeholder="电话号码"
              />
            </div>
            <div class="social-item">
              <span class="social-label">Facebook</span>
              <input 
                v-model="form.social.facebook" 
                type="text" 
                class="form-input" 
                placeholder="Facebook 用户名"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="actions">
        <button class="btn-cancel" @click="goBack">取消</button>
        <button class="btn-save" @click="saveProfile" :disabled="saving">
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  ArrowLeft, Camera, User, FileText, Users, Calendar, 
  MapPin, Briefcase, Link2, Share2 
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { uploadAPI } from '@/api/upload'
import { userProfileAPI } from '@/api/user-profile'

export default {
  name: 'UserProfileEditPage',
  components: {
    ArrowLeft, Camera, User, FileText, Users, Calendar,
    MapPin, Briefcase, Link2, Share2
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const saving = ref(false)
    const coverInput = ref(null)
    const avatarInput = ref(null)

    // 表单数据
    const form = reactive({
      username: '',
      avatar: '',
      cover: '',
      bio: '',
      gender: 'other',
      birthday: '',
      location: '',
      occupation: '',
      website: '',
      social: {
        wechat: '',
        whatsapp: '',
        facebook: ''
      }
    })

    // 封面占位图
    const coverFallback = 'https://picsum.photos/1200/300?random=cover'

    // 初始化表单数据
    const initForm = () => {
      if (userStore.userInfo) {
        form.username = userStore.userInfo.username || userStore.userInfo.nickname || ''
        form.avatar = userStore.userInfo.avatar || '/avatar-placeholder.svg'
        form.cover = userStore.userInfo.cover || ''
        form.bio = userStore.userInfo.bio || ''
        form.gender = userStore.userInfo.gender || 'other'
        form.birthday = userStore.userInfo.birthday || ''
        form.location = userStore.userInfo.location || ''
        form.occupation = userStore.userInfo.occupation || ''
        form.website = userStore.userInfo.website || ''
        
        // 社交媒体
        if (userStore.userInfo.social) {
          form.social.wechat = userStore.userInfo.social.wechat || ''
          form.social.whatsapp = userStore.userInfo.social.whatsapp || ''
          form.social.facebook = userStore.userInfo.social.facebook || ''
        }
      }
    }

    // 触发封面上传
    const triggerCoverUpload = () => {
      coverInput.value?.click()
    }

    // 处理封面上传
    const handleCoverUpload = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return
      }

      // 验证文件大小 (限制 5MB)
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过 5MB')
        return
      }

      try {
        ElMessage.info('上传中...')
        const response = await uploadAPI.uploadImage(file)
        
        if (response.code === 200 && response.data?.url) {
          form.cover = response.data.url
          ElMessage.success('封面上传成功')
        } else {
          ElMessage.error('封面上传失败')
        }
      } catch (error) {
        console.error('封面上传失败:', error)
        ElMessage.error('封面上传失败，请重试')
      }
    }

    // 触发头像上传
    const triggerAvatarUpload = () => {
      avatarInput.value?.click()
    }

    // 处理头像上传
    const handleAvatarUpload = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return
      }

      // 验证文件大小 (限制 2MB)
      if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('头像大小不能超过 2MB')
        return
      }

      try {
        ElMessage.info('上传中...')
        const response = await uploadAPI.uploadImage(file)
        
        if (response.code === 200 && response.data?.url) {
          form.avatar = response.data.url
          ElMessage.success('头像上传成功')
        } else {
          ElMessage.error('头像上传失败')
        }
      } catch (error) {
        console.error('头像上传失败:', error)
        ElMessage.error('头像上传失败，请重试')
      }
    }

    // 保存资料
    const saveProfile = async () => {
      // 验证必填项
      if (!form.username.trim()) {
        ElMessage.error('请输入用户名')
        return
      }

      saving.value = true

      try {
        // 准备提交数据
        const profileData = {
          username: form.username.trim(),
          avatar: form.avatar,
          cover: form.cover,
          bio: form.bio.trim(),
          gender: form.gender,
          birthday: form.birthday,
          location: form.location.trim(),
          occupation: form.occupation.trim(),
          website: form.website.trim(),
          social: {
            wechat: form.social.wechat.trim(),
            whatsapp: form.social.whatsapp.trim(),
            facebook: form.social.facebook.trim()
          }
        }

        // 调用更新接口
        const userId = userStore.userInfo.id
        const response = await userProfileAPI.updateUserProfile(userId, profileData)
        
        if (response.code === 200) {
          // 更新 store 中的用户信息
          await userStore.fetchUserInfo()
          
          ElMessage.success('保存成功')
          
          // 返回个人主页
          setTimeout(() => {
            router.push(`/user/${userStore.userInfo.id}`)
          }, 500)
        } else {
          ElMessage.error(response.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请重试')
      } finally {
        saving.value = false
      }
    }

    // 返回
    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      // 检查登录状态
      if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/auth/login')
        return
      }

      initForm()
    })

    return {
      form,
      saving,
      coverInput,
      avatarInput,
      coverFallback,
      triggerCoverUpload,
      handleCoverUpload,
      triggerAvatarUpload,
      handleAvatarUpload,
      saveProfile,
      goBack
    }
  }
}
</script>

<style scoped>
.edit-profile-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding: 20px;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(26,26,26,0.1);
  overflow: hidden;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #fafbfc;
  border-color: #b2bac2;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.save-btn {
  padding: 8px 20px;
  background: #FF6A00;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background: #ff8533;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 封面区域 */
.cover-section {
  position: relative;
  width: 100%;
  height: 200px;
  background: #f0f0f0;
  overflow: hidden;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay .upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.cover-overlay .upload-btn:hover {
  background: #fff;
}

/* 头像区域 */
.avatar-section {
  position: relative;
  width: 120px;
  height: 120px;
  margin: -60px auto 24px;
  z-index: 10;
}

.avatar-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  background: #fff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay .upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.avatar-overlay .upload-btn:hover {
  background: #fff;
}

/* 表单区域 */
.form-section {
  padding: 0 24px 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF6A00;
  box-shadow: 0 0 0 2px rgba(255, 106, 0, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #8590a6;
  text-align: right;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
}

.radio-item input[type="radio"] {
  cursor: pointer;
}

/* 社交媒体输入 */
.social-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 12px;
}

.social-label {
  font-size: 14px;
  color: #8590a6;
}

/* 底部操作按钮 */
.actions {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafbfc;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #fff;
  color: #1a1a1a;
  border: 1px solid #d9d9d9;
}

.btn-cancel:hover {
  background: #fafbfc;
  border-color: #b2bac2;
}

.btn-save {
  background: #FF6A00;
  color: #fff;
  border: none;
}

.btn-save:hover:not(:disabled) {
  background: #ff8533;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-profile-page {
    padding: 0;
  }

  .edit-container {
    border-radius: 0;
  }

  .page-header {
    padding: 16px;
  }

  .page-title {
    font-size: 18px;
  }

  .cover-section {
    height: 140px;
  }

  .avatar-section {
    width: 100px;
    height: 100px;
    margin: -50px auto 20px;
  }

  .form-section {
    padding: 0 16px 16px;
  }

  .social-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .actions {
    padding: 16px;
  }
}
</style>

