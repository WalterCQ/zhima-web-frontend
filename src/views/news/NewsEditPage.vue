<template>
  <div class="news-edit-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">编辑资讯</h1>
      </div>
      <div class="editor-card">
        <div class="form-group">
          <label class="form-label">标题</label>
          <input v-model="title" type="text" class="form-input" placeholder="请输入标题" />
        </div>

        <div class="form-group">
          <label class="form-label">内容</label>
          <div class="editor-toolbar">
            <button class="editor-tool-btn" @click="triggerEditorImage" title="插入/替换图片">
              插入图片
            </button>
          </div>
          <div class="rich-editor" ref="editorRef" contenteditable="true" @input="syncHtml" @drop.prevent="onDrop" @dragover.prevent></div>
          <input ref="editorImageInput" type="file" accept="image/*" style="display:none" @change="onEditorImageChange" />
        </div>

        <div class="actions">
          <button class="btn btn-primary" @click="save" :disabled="saving">保存</button>
          <button class="btn" @click="cancel" :disabled="saving">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import duducarAPI from '@/api/duducar-integration'
import { newsAPI } from '@/api/news'
import { collectInitialImagesFromDetail, computePutDiff } from '@/utils/richtext-images'

const route = useRoute()
const router = useRouter()

const editorRef = ref(null)
const editorImageInput = ref(null)

const articleId = ref(Number(route.params.articleId))
const title = ref('')
const html = ref('')
const initialImages = ref([]) // [{ pictureId, pictureUrl }]
const replacementMap = new Map() // imageId -> newCdnUrl
const uploadCache = new Map() // img.src -> cdnUrl
const saving = ref(false)

const loadDetail = async () => {
  try {
    const resp = await newsAPI.getArticleDetail(articleId.value)
    if (!resp.success || !resp.data) throw new Error('加载失败')
    title.value = resp.data.articleName || ''
    // 服务端内容为 HTML，渲染时为旧图打上 data-picture-id 以便追踪
    const contentHtml = (resp.data.articleContent || '')
    const images = Array.isArray(resp.data.images) ? resp.data.images : []
    initialImages.value = collectInitialImagesFromDetail(resp.data)
    // 将返回的图片 URL 在文中对应处加上 data-picture-id（简单匹配）
    let enriched = contentHtml
    for (const img of images) {
      if (img.pictureUrl) {
        const escaped = img.pictureUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(`<img([^>]*?)src=["']${escaped}["']`, 'g')
        enriched = enriched.replace(re, `<img$1src="${img.pictureUrl}" data-picture-id="${img.pictureId}"`)
      }
    }
    html.value = enriched
    if (editorRef.value) editorRef.value.innerHTML = html.value
  } catch (e) {
    ElMessage.error('加载文章失败')
  }
}

const triggerEditorImage = () => editorImageInput.value?.click()

const onEditorImageChange = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  await insertOrReplaceImage(file)
  e.target.value = ''
}

const onDrop = async (e) => {
  const file = e.dataTransfer?.files?.[0]
  if (file) await insertOrReplaceImage(file)
}

const insertOrReplaceImage = async (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  const sel = window.getSelection()
  let targetImg = null
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0)
    const node = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer
    if (node && node.closest) targetImg = node.closest('img')
  }

  const loading = ElLoading.service({ text: '上传中...' })
  try {
    const resp = await duducarAPI.cos.uploadCommonImage(file)
    if (!resp.success || !resp.data) throw new Error('上传失败')
    const { cdnUrl, proxyUrl, objectKey } = resp.data
    const url = cdnUrl || proxyUrl
    if (!url) throw new Error('无有效图片地址')

    if (targetImg && targetImg.getAttribute('data-picture-id')) {
      // 替换旧图
      const imageId = Number(targetImg.getAttribute('data-picture-id'))
      replacementMap.set(imageId, url)
      targetImg.setAttribute('src', url)
    } else {
      // 新增插入
      const temp = `<img src="${url}" alt="" style="max-width:100%;" />`
      document.execCommand('insertHTML', false, temp)
      uploadCache.set(url, url)
    }
  } catch (e) {
    ElMessage.error(e.message || '上传失败')
  } finally {
    loading.close()
    syncHtml()
  }
}

const syncHtml = () => {
  html.value = editorRef.value?.innerHTML || ''
}

const save = async () => {
  if (!title.value.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  saving.value = true
  const loading = ElLoading.service({ text: '保存中...' })
  try {
    const { imageUrlsToAdd, imageReplacements } = computePutDiff({
      initialImages: initialImages.value,
      currentHtml: html.value,
      replacementMap,
      uploadCache,
    })
    const resp = await newsAPI.updateArticle(articleId.value, {
      articleName: title.value,
      articleContent: html.value,
      imageUrlsToAdd,
      imageReplacements,
    })
    if (!resp.success) throw new Error(resp.message || '保存失败')
    ElMessage.success('保存成功')
    router.push(`/news/${articleId.value}`)
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    loading.close()
    saving.value = false
  }
}

const cancel = () => {
  router.back()
}

onMounted(loadDetail)
</script>

<style scoped>
.news-edit-page { padding: 16px 0; }
.page-title { font-size: 20px; margin: 0 0 12px; }
.editor-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: var(--shadow-light); }
.form-group { margin-bottom: 16px; }
.form-label { display:block; font-weight:600; margin-bottom:6px; }
.rich-editor { min-height: 320px; border: 1px solid var(--border-light); border-radius: 8px; padding: 12px; }
.editor-toolbar { margin-bottom: 8px; }
.editor-tool-btn { padding: 6px 10px; border: 1px solid var(--border-light); background: var(--bg-secondary); border-radius: 6px; cursor: pointer; }
.actions { display:flex; gap: 12px; }
</style>


