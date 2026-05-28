<template>
  <div class="auth-page">
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
          <h1 class="auth-title">欢迎回来</h1>
          <p class="auth-subtitle">登录您的知马网账户</p>
        </div>

        <!-- 登录方式切换 -->
        <div class="segmented">
          <button type="button" :class="['seg-btn', mode==='password' && 'active']" @click="mode='password'">账号密码</button>
          <button type="button" :class="['seg-btn', mode==='sms' && 'active']" @click="mode='sms'">短信验证码</button>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <template v-if="mode==='password'">
          <div class="form-group">
            <label for="username" class="form-label">手机号</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="请输入手机号（如：13812345678）"
              :class="{ 'error': errors.username }"
              @blur="validateField('username')"
            />
            <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="loginForm.password"
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
          </template>

          <div class="form-options" v-if="mode==='password'">
            <label class="checkbox-wrapper">
              <input
                v-model="loginForm.remember"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-label">记住我</span>
            </label>
            <router-link to="/auth/forgot-password" class="forgot-link">
              忘记密码？
            </router-link>
          </div>

          <div class="sms-login" v-if="mode==='sms'">
            <div class="form-group">
              <label class="form-label">手机号</label>
              <input v-model="sms.phone" class="form-input" placeholder="请输入手机号（如：13812345678）" />
            </div>
            <div class="form-group">
              <label class="form-label">短信验证码</label>
              <div class="row">
                <button type="button" class="sms-btn" :disabled="sms.sending" @click="sendSms">{{ sms.sending ? '发送中...' : '发送验证码' }}</button>
                <input v-model="sms.code" class="form-input" placeholder="短信验证码" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="auth-button"
            :disabled="loading"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '登录中...' : (mode==='sms' ? '短信登录' : '密码登录') }}
          </button>
        </form>

        <div class="auth-divider">
          <span>或</span>
        </div>

        <div class="social-auth">
          <WeChatLogin 
            :on-success="handleWeChatSuccess"
            button-text="使用微信登录"
          />
          <GoogleSignIn 
            :on-success="handleGoogleSuccess"
            button-text="使用Google登录"
          />
        </div>

        <div class="auth-footer">
          <span>还没有账户？</span>
          <router-link to="/auth/register" class="auth-link">立即注册</router-link>
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
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const showPassword = ref(false)
const errors = ref({})
const mode = ref('password')

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const sms = ref({ phone: '', code: '', sending: false })

// 验证方法
const validateField = (field) => {
  const value = loginForm.value[field]
  
  switch (field) {
    case 'username':
      if (!value.trim()) {
        errors.value.username = '请输入手机号'
      } else {
        // 临时禁用前端验证，让后端返回详细错误
        delete errors.value.username
      }
      // 注释掉前端的手机号格式验证，方便调试
      // else if (!/^(\+?86)?1[3-9]\d{9}$|^\+?60\d{9,10}$/.test(value.replace(/\s/g, ''))) {
      //   errors.value.username = '请输入有效的手机号（如：13812345678 或 +60123456789）'
      // }
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
  }
}

const validateForm = () => {
  if (mode.value === 'password') {
    validateField('username')
    validateField('password')
    return Object.keys(errors.value).length === 0
  } else {
    return Boolean(sms.value.phone && sms.value.code)
  }
}

// 格式化手机号 - 自动添加国家代码
const formatPhone = (phone) => {
  // 移除所有空格
  const cleaned = phone.replace(/\s/g, '')
  
  // 如果已经有 + 开头，直接返回
  if (cleaned.startsWith('+')) {
    return cleaned
  }
  
  // 中国手机号：1开头的11位数字
  if (/^1[3-9]\d{9}$/.test(cleaned)) {
    return `+86 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`
  }
  
  // 马来西亚手机号：0开头
  if (/^0\d{9,10}$/.test(cleaned)) {
    return `+60 ${cleaned.substring(1)}`
  }
  
  // 其他情况直接返回
  return cleaned
}

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    let payload
    if (mode.value === 'password') {
      const formattedPhone = formatPhone(loginForm.value.username)
      console.log('📱 原始输入:', loginForm.value.username)
      console.log('📱 格式化后:', formattedPhone)
      payload = { type: 'password', phone: formattedPhone, identifier: loginForm.value.password }
    } else {
      const formattedPhone = formatPhone(sms.value.phone)
      console.log('📱 原始输入:', sms.value.phone)
      console.log('📱 格式化后:', formattedPhone)
      payload = { type: 'sms', phone: formattedPhone, identifier: sms.value.code }
    }
    const result = await userStore.login(payload)
    if (result.success) {
      ElMessage.success('登录成功！')
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.error?.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

async function sendSms() {
  if (!sms.value.phone) { ElMessage.error('请输入手机号'); return }
  sms.value.sending = true
  try {
    await (await import('@/api/user-v2')).userV2API.sendSms({ phone: sms.value.phone, type: 'login' })
    ElMessage.success('验证码已发送')
  } catch (e) { ElMessage.error('发送失败') } finally { sms.value.sending = false }
}

// 短信登录整合到 handleLogin

// 微信登录成功处理
const handleWeChatSuccess = async (wechatUserData) => {
  try {
    loading.value = true
    
    // 调用后端API进行微信登录
    const result = await userStore.loginWithWeChat(wechatUserData)
    
    if (result.success) {
      ElMessage.success('微信登录成功！')
      
      // 重定向到原来要访问的页面，或者首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.error?.message || '微信登录失败')
    }
  } catch (error) {
    ElMessage.error('微信登录失败，请稍后重试')
    console.error('微信登录错误:', error)
  } finally {
    loading.value = false
  }
}

// Google登录成功处理
const handleGoogleSuccess = async (googleUserData) => {
  try {
    loading.value = true
    
    // 调用后端API进行Google登录
    const result = await userStore.loginWithGoogle(googleUserData)
    
    if (result.success) {
      ElMessage.success('Google登录成功！')
      
      // 重定向到原来要访问的页面，或者首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.error?.message || 'Google登录失败')
    }
  } catch (error) {
    ElMessage.error('Google登录失败，请稍后重试')
    console.error('Google登录错误:', error)
  } finally {
    loading.value = false
  }
}

// 页面标题
onMounted(() => {
  document.title = '登录 - 知马网'
})
</script>

<!-- OpenAI风格认证页面样式已移至global.css文件 -->
<style scoped>
</style>

