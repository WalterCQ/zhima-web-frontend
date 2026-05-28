<template>
  <div class="auth-page" data-page="register">
    <!-- 返回主页按钮 -->
    <div class="back-to-home">
      <router-link to="/" class="back-button">
        <ArrowLeft :size="20" />
        <span>返回主页</span>
      </router-link>
    </div>

    <div class="auth-container">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <img src="/logo.png" alt="知马网" class="logo-image" />
          <span class="logo-text">知马网</span>
        </router-link>
      </div>

      <div class="auth-card">
        <div class="auth-form-header">
          <h1 class="auth-title">创建账户</h1>
          <p class="auth-subtitle">加入知马网，开启马来西亚华人社区之旅</p>
        </div>

        <!-- 注册方式提示（仅短信验证码注册） -->
        <div class="segmented" style="display:none"></div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <!-- 第一行：用户名 + 手机号 -->
          <div class="form-row">
            <div class="form-group">
              <label for="username" class="form-label">用户名</label>
              <input
                id="username"
                v-model="registerForm.username"
                type="text"
                class="form-input"
                placeholder="输入您的用户名"
                :class="{ 'error': errors.username }"
                @blur="validateField('username')"
              />
              <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">手机号</label>
              <input
                id="phone"
                v-model="sms.phone"
                type="text"
                class="form-input"
                placeholder="请输入手机号（+86 或 +60）"
              />
            </div>
          </div>

          <!-- 手机号验证（仅验证码输入，手机号在上方已填写） -->
          <div class="form-row single-column">
            <div class="form-group">
              <label class="form-label">手机号验证</label>
              <div class="row">
                <button type="button" class="sms-btn" :disabled="sms.sending" @click="sendSms">{{ sms.sending ? '发送中...' : '发送验证码' }}</button>
                <input v-model="sms.code" class="form-input" placeholder="短信验证码" />
              </div>
            </div>
          </div>

          <!-- 密码 + 确认密码（最后一排） -->
          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="输入您的密码"
                  :class="{ 'error': errors.password }"
                  @blur="validateField('password')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="再次输入密码"
                  :class="{ 'error': errors.confirmPassword }"
                  @blur="validateField('confirmPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
            </div>
          </div>

          <!-- 协议和注册按钮 -->
          <div class="form-actions">
            <label class="checkbox-wrapper">
              <input
                v-model="registerForm.agreement"
                type="checkbox"
                class="checkbox-input"
                @change="validateField('agreement')"
              />
              <span class="checkbox-label">
                我已阅读并同意 <a href="/terms" target="_blank" class="agreement-link">《用户协议》</a> 和 <a href="/privacy" target="_blank" class="agreement-link">《隐私政策》</a>
              </span>
            </label>
            <span v-if="errors.agreement" class="form-error">{{ errors.agreement }}</span>

            <button
              type="submit"
              class="auth-button"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '注册中...' : '创建账户' }}
            </button>
          </div>
        </form>

        <div class="auth-divider">
          <span>或</span>
        </div>

        <div class="social-auth">
          <WeChatLogin 
            :on-success="handleWeChatSuccess"
            button-text="使用微信注册"
          />
          <GoogleSignIn 
            :on-success="handleGoogleSuccess"
            button-text="使用Google注册"
          />
        </div>

        <div class="auth-footer">
          <span>已有账户？</span>
          <router-link to="/auth/login" class="auth-link">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import WeChatLogin from '@/components/WeChatLogin.vue'
import GoogleSignIn from '@/components/GoogleSignIn.vue'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const sms = ref({ phone: '', code: '', sending: false })

// 不再需要城市选项数组

// 验证方法
const validateField = (field) => {
  const value = registerForm.value[field]
  
  switch (field) {
    case 'username':
      if (!value.trim()) {
        errors.value.username = '请输入用户名'
      } else if (value.length < 3 || value.length > 20) {
        errors.value.username = '用户名长度为3-20个字符'
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        errors.value.username = '用户名只能包含字母、数字和下划线'
      } else {
        delete errors.value.username
      }
      break
    case 'email':
      if (!value.trim()) {
        errors.value.email = '请输入邮箱地址'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.value.email = '请输入有效的邮箱地址'
      } else {
        delete errors.value.email
      }
      break
    case 'password':
      if (!value) {
        errors.value.password = '请输入密码'
      } else if (value.length < 3) {
        errors.value.password = '密码至少3个字符'
      } else {
        delete errors.value.password
      }
      break
    case 'confirmPassword':
      if (!value) {
        errors.value.confirmPassword = '请确认密码'
      } else if (value !== registerForm.value.password) {
        errors.value.confirmPassword = '两次输入的密码不一致'
      } else {
        delete errors.value.confirmPassword
      }
      break
    case 'agreement':
      if (!value) {
        errors.value.agreement = '请阅读并同意用户协议和隐私政策'
      } else {
        delete errors.value.agreement
      }
      break
  }
}

const validateForm = () => {
  Object.keys(registerForm.value).forEach(field => {
    validateField(field)
  })
  return Object.keys(errors.value).length === 0
}

// 注册处理
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const result = await userStore.register({ phone: sms.value.phone, code: sms.value.code })
    
    if (result.success) {
      ElMessage.success('注册成功！欢迎加入知马网！')
      router.push('/')
    } else {
      ElMessage.error(result.error?.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

async function sendSms() {
  if (!sms.value.phone && !registerForm.value?.phone && !document.getElementById('phone')) {
    ElMessage.error('请输入手机号');
    return
  }
  // 优先使用上方手机号输入框（sms.phone 或表单同名）
  if (!sms.value.phone) sms.value.phone = registerForm.value?.phone || sms.value.phone
  sms.value.sending = true
  try {
    await (await import('@/api/user-v2')).userV2API.sendSms({ phone: sms.value.phone, type: 'register' })
    ElMessage.success('验证码已发送')
  } catch { ElMessage.error('发送失败') } finally { sms.value.sending = false }
}

// 微信登录成功处理
const handleWeChatSuccess = async (wechatUserData) => {
  try {
    loading.value = true
    
    // 调用后端API进行微信注册
    const result = await userStore.registerWithWeChat(wechatUserData)
    
    if (result.success) {
      ElMessage.success('微信注册成功！欢迎加入知马网！')
      router.push('/')
    } else {
      ElMessage.error(result.error?.message || '微信注册失败')
    }
  } catch (error) {
    ElMessage.error('微信注册失败，请稍后重试')
    console.error('微信注册错误:', error)
  } finally {
    loading.value = false
  }
}

// Google登录成功处理
const handleGoogleSuccess = async (googleUserData) => {
  try {
    loading.value = true
    
    // 调用后端API进行Google注册
    const result = await userStore.registerWithGoogle(googleUserData)
    
    if (result.success) {
      ElMessage.success('Google注册成功！欢迎加入知马网！')
      router.push('/')
    } else {
      ElMessage.error(result.error?.message || 'Google注册失败')
    }
  } catch (error) {
    ElMessage.error('Google注册失败，请稍后重试')
    console.error('Google注册错误:', error)
  } finally {
    loading.value = false
  }
}

// 页面标题
onMounted(() => {
  document.title = '注册 - 知马网'
})
</script>

<!-- OpenAI风格认证页面样式已移至global.css文件 -->

<style scoped>
.agreement-link {
  color: #FF6A00;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.agreement-link:hover {
  opacity: 0.8;
}
.segmented { display: grid; grid-auto-flow: column; gap: 8px; margin: 8px 0 16px; }
.seg-btn { border: 1px solid #e5e7eb; background: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.seg-btn.active { background: var(--primary-color,#FF6A00); color: #fff; border-color: transparent; }
.row { display: grid; grid-template-columns: auto 1fr; gap: 8px; }
.sms-btn { border: none; background: #f3f4f6; padding: 0 12px; border-radius: 8px; cursor: pointer; }
</style>

