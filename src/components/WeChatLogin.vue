<template>
  <div class="wechat-login-wrapper">
    <!-- 微信登录按钮 -->
    <button 
      class="wechat-login-btn"
      @click="startWeChatLogin"
      :disabled="loading"
    >
      <div class="wechat-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.327-1.932 6.446-1.383-.98-3.671-4.742-6.293-8.289-6.293zm-2.439 5.441a1.13 1.13 0 1 1 0-2.261 1.13 1.13 0 0 1 0 2.261zm4.878 0a1.13 1.13 0 1 1 0-2.261 1.13 1.13 0 0 1 0 2.261z"/>
          <path d="M23.293 14.093c0-3.015-3.016-5.478-6.749-5.478s-6.749 2.463-6.749 5.478 3.016 5.479 6.749 5.479c.69 0 1.39-.069 2.061-.199a.61.61 0 0 1 .503.069l1.339.783a.244.244 0 0 0 .118.039.218.218 0 0 0 .213-.216c0-.053-.025-.118-.039-.157l-.275-1.047a.438.438 0 0 1 .157-.492c1.37-1.112 2.273-2.746 2.273-4.659zm-8.299-1.13a.849.849 0 1 1 0-1.698.849.849 0 0 1 0 1.698zm3.555 0a.849.849 0 1 1 0-1.698.849.849 0 0 1 0 1.698z"/>
        </svg>
      </div>
      <span>{{ loading ? '连接中...' : buttonText }}</span>
    </button>
    
    <!-- 微信扫码弹窗 -->
    <div v-if="showQRCode" class="wechat-modal" @click="closeModal">
      <div class="wechat-modal-content" @click.stop>
        <div class="modal-header">
          <h3>微信登录</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="qr-code-container">
          <div id="wechat_qr_code" class="qr-code"></div>
          <p class="qr-tip">请使用微信扫描二维码登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  onSuccess: {
    type: Function,
    default: () => {}
  },
  buttonText: {
    type: String,
    default: '使用微信登录'
  }
})

const loading = ref(false)
const showQRCode = ref(false)

// 微信登录配置
const wechatConfig = {
  appid: 'YOUR_WECHAT_APPID', // 需要替换为实际的微信AppID
  redirect_uri: encodeURIComponent(window.location.origin + '/auth/wechat/callback'),
  response_type: 'code',
  scope: 'snsapi_login',
  state: 'STATE' // 可以是随机字符串，用于防止CSRF攻击
}

// 开始微信登录流程
const startWeChatLogin = () => {
  loading.value = true
  showQRCode.value = true
  
  // 构建微信OAuth2.0授权URL
  const wechatLoginUrl = `https://open.weixin.qq.com/connect/qrconnect?` +
    `appid=${wechatConfig.appid}&` +
    `redirect_uri=${wechatConfig.redirect_uri}&` +
    `response_type=${wechatConfig.response_type}&` +
    `scope=${wechatConfig.scope}&` +
    `state=${wechatConfig.state}#wechat_redirect`
  
  try {
    // 加载微信登录二维码
    loadWeChatQR(wechatLoginUrl)
  } catch (error) {
    console.error('微信登录初始化失败:', error)
    ElMessage.error('微信登录初始化失败')
    loading.value = false
    showQRCode.value = false
  }
}

// 加载微信二维码
const loadWeChatQR = (loginUrl) => {
  // 创建内嵌二维码
  const qrContainer = document.getElementById('wechat_qr_code')
  if (qrContainer) {
    // 清空容器
    qrContainer.innerHTML = ''
    
    // 使用微信官方JS SDK生成二维码
    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
    script.onload = () => {
      if (window.WxLogin) {
        new window.WxLogin({
          self_redirect: false,
          id: 'wechat_qr_code',
          appid: wechatConfig.appid,
          scope: wechatConfig.scope,
          redirect_uri: wechatConfig.redirect_uri,
          state: wechatConfig.state,
          style: 'black', // 黑色主题
          href: '', // 自定义样式
          stylelite: 1 // 使用新UI
        })
        loading.value = false
      }
    }
    script.onerror = () => {
      ElMessage.error('微信登录脚本加载失败')
      loading.value = false
      showQRCode.value = false
    }
    document.head.appendChild(script)
  }
}

// 关闭弹窗
const closeModal = () => {
  showQRCode.value = false
  loading.value = false
}

// 监听微信登录回调
const handleWeChatCallback = (event) => {
  // 这里需要根据实际的回调处理逻辑
  if (event.data && event.data.type === 'wechat_login_success') {
    const { code, state } = event.data
    if (state === wechatConfig.state) {
      // 处理微信登录成功
      handleWeChatSuccess(code)
    }
  }
}

// 处理微信登录成功
const handleWeChatSuccess = async (code) => {
  try {
    // 这里需要调用后端API，用code换取access_token和用户信息
    const response = await fetch('/api/auth/wechat/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })
    
    const userData = await response.json()
    
    if (userData.success) {
      // 由父组件统一弹出成功提示
      props.onSuccess(userData.data)
      closeModal()
    } else {
      throw new Error(userData.message || '微信登录失败')
    }
  } catch (error) {
    console.error('微信登录失败:', error)
    ElMessage.error('微信登录失败: ' + error.message)
  }
}

onMounted(() => {
  // 监听来自微信登录页面的消息
  window.addEventListener('message', handleWeChatCallback)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleWeChatCallback)
})

// 暴露方法给父组件
defineExpose({
  startWeChatLogin
})
</script>

<style scoped>
.wechat-login-wrapper {
  width: 100%;
}

/* 微信登录按钮 */
.wechat-login-btn {
  width: 100%;
  height: 48px;
  background: #1AAD19;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.wechat-login-btn:hover:not(:disabled) {
  background: #179B16;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 173, 25, 0.3);
}

.wechat-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wechat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 微信扫码弹窗 */
.wechat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.wechat-modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.qr-code-container {
  text-align: center;
}

.qr-code {
  margin: 0 auto 16px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}

.qr-tip {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .wechat-modal-content {
    width: 95%;
    padding: 20px;
  }
  
  .qr-code {
    min-height: 200px;
  }
}
</style>
