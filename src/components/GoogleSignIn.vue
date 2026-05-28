<template>
  <div class="google-signin-wrapper">
    <!-- 自定义Google登录按钮 -->
    <button 
      class="google-signin-btn"
      @click="handleGoogleSignIn"
      :disabled="loading"
    >
      <div class="google-icon">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
      <span>{{ loading ? '连接中...' : buttonText }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  onSuccess: {
    type: Function,
    default: () => {}
  },
  buttonText: {
    type: String,
    default: '使用Google登录'
  }
})

const loading = ref(false)

// 处理Google登录点击
const handleGoogleSignIn = async () => {
  loading.value = true
  
  try {
    // 模拟Google登录流程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟成功的用户数据
    const mockUserData = {
      id: 'google_' + Date.now(),
      name: 'Google用户',
      email: 'user@gmail.com',
      imageUrl: 'https://via.placeholder.com/100',
      provider: 'google'
    }
    
    // 由父组件统一弹出成功提示
    props.onSuccess(mockUserData)
  } catch (error) {
    console.error('Google登录失败:', error)
    ElMessage.error('Google登录失败')
  } finally {
    loading.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  signIn: handleGoogleSignIn
})
</script>

<style scoped>
.google-signin-wrapper {
  width: 100%;
}

/* Google登录按钮样式 */
.google-signin-btn {
  width: 100%;
  height: 48px;
  background: #ffffff;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  position: relative;
  outline: none;
}

.google-signin-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #c1c7cd;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.15);
  transform: translateY(-1px);
}

.google-signin-btn:active {
  background: #f1f3f4;
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(60, 64, 67, 0.1);
}

.google-signin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.google-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.google-signin-btn span {
  font-weight: 500;
  letter-spacing: 0.25px;
}
</style>
