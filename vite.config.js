import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus']
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [
            ['default', 'axios'],
          ]
        }
      ],
      dts: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/assets': resolve(__dirname, 'src/assets'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/views': resolve(__dirname, 'src/views'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/api': resolve(__dirname, 'src/api'),
      '@/stores': resolve(__dirname, 'src/stores'),
      '@/router': resolve(__dirname, 'src/router')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.css";`
      }
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    // 启用 HTTP2
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'disk',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将第三方库分离到 vendor chunk
          if (id.includes('node_modules')) {
            // Element Plus 单独分块
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            // Lucide 图标单独分块
            if (id.includes('lucide-vue-next')) {
              return 'lucide-icons'
            }
            // Vue 生态系统
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            // 其他第三方库
            return 'vendor'
          }
          // 将较大的组件页面分离
          if (id.includes('/views/')) {
            return 'pages'
          }
          // 将 API 相关代码分离
          if (id.includes('/api/')) {
            return 'api'
          }
        },
        // 文件名使用 hash 以便缓存
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`
          }
          if (ext === 'css') {
            return `css/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    // 压缩选项
    minify: 'esbuild', // 使用 esbuild 替代 terser，更快
    target: 'es2015', // 支持现代浏览器
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    // 启用 gzip 压缩
    reportCompressedSize: true
  }
})

