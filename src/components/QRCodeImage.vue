<template>
  <div class="qrcode-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas ref="qrcodeCanvas" class="qrcode-canvas"></canvas>
    <div v-if="loading" class="qrcode-loading">生成中...</div>
    <div v-if="error" class="qrcode-error" @click="retry">生成失败，点击重试</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  /** 目标URL（用于生成二维码） */
  url: {
    type: String,
    required: true
  },
  /** 二维码尺寸 */
  size: {
    type: Number,
    default: 180
  },
  /** 边距 */
  margin: {
    type: Number,
    default: 1
  },
  /** 容错级别 */
  errorCorrectionLevel: {
    type: String,
    default: 'M',
    validator: (value) => ['L', 'M', 'Q', 'H'].includes(value)
  },
  /** 颜色配置 */
  color: {
    type: Object,
    default: () => ({ 
      dark: '#000000',
      light: '#FFFFFF' 
    })
  },
  /** 二维码ID（用于统计） */
  qrcodeId: {
    type: Number,
    default: null
  },
  /** 是否启用统计 */
  trackingEnabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['generated', 'error', 'scanned'])

const qrcodeCanvas = ref(null)
const loading = ref(false)
const error = ref(false)

/**
 * 生成二维码
 */
const generateQRCode = async () => {
  if (!qrcodeCanvas.value || !props.url) {
    error.value = true
    return
  }
  
  loading.value = true
  error.value = false
  
  try {
    await QRCode.toCanvas(qrcodeCanvas.value, props.url, {
      width: props.size,
      margin: props.margin,
      color: {
        dark: props.color?.dark || '#000000',
        light: props.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: props.errorCorrectionLevel
    })
    
    emit('generated', {
      url: props.url,
      size: props.size,
      timestamp: Date.now()
    })
    
  } catch (err) {
    console.error('[QRCodeImage] 生成失败:', err)
    error.value = true
    emit('error', err)
  } finally {
    loading.value = false
  }
}

/**
 * 重试生成
 */
const retry = () => {
  generateQRCode()
}

/**
 * 记录扫码（当二维码被点击时）
 */
const handleClick = () => {
  if (props.trackingEnabled && props.qrcodeId) {
    emit('scanned', {
      qrcodeId: props.qrcodeId,
      url: props.url,
      timestamp: Date.now()
    })
  }
}

// 初始化生成
onMounted(() => {
  generateQRCode()
})

// 监听URL变化，重新生成
watch(() => props.url, (newUrl, oldUrl) => {
  if (newUrl && newUrl !== oldUrl) {
    generateQRCode()
  }
})

// 监听尺寸变化，重新生成
watch(() => props.size, () => {
  generateQRCode()
})

// 监听颜色变化，重新生成
watch(() => props.color, () => {
  generateQRCode()
}, { deep: true })
</script>

<style scoped>
.qrcode-wrapper {
  position: relative;
  display: inline-block;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.qrcode-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.qrcode-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  color: #666;
}

.qrcode-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.1);
  font-size: 12px;
  color: #f56c6c;
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.qrcode-error:hover {
  background: rgba(255, 0, 0, 0.15);
}
</style>

