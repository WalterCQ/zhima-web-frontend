<template>
  <div class="company-auth-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-grid">
          <div class="header-content">
            <h1 class="page-title">
              <el-icon><OfficeBuilding /></el-icon>
              企业认证
            </h1>
            <p class="page-description">
              完成企业认证，获得更多发布权限和专属标识
            </p>
            <div class="header-actions">
              <el-button type="text" class="why-btn" @click="showWhyDrawer = true">为何需要认证？</el-button>
            </div>
          </div>

          <div class="status-summary">
            <div class="summary-card">
              <div class="summary-icon status-icon" :class="getStatusClass(authInfo?.status || 'none')">
                <el-icon v-if="authInfo?.status === 'approved'"><Check /></el-icon>
                <el-icon v-else-if="authInfo?.status === 'pending'"><Clock /></el-icon>
                <el-icon v-else-if="authInfo?.status === 'rejected'"><Close /></el-icon>
                <el-icon v-else><Document /></el-icon>
              </div>
              <div class="summary-text">
                <h3>{{ getStatusText(authInfo?.status || 'none') }}</h3>
                <p>{{ getStatusDescription(authInfo?.status || 'none') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 为何需要认证 抽屉 -->
    <el-drawer
      v-model="showWhyDrawer"
      title="为何需要认证？"
      direction="rtl"
      size="360px"
    >
      <div class="why-content">
        <p>完成企业认证可获得以下好处：</p>
        <ul class="why-list">
          <li>解锁更多发布权限与企业专属标识，提升品牌可信度</li>
          <li>更高的内容曝光与平台资源扶持</li>
          <li>专属客服与更快的审核通道</li>
        </ul>
        <p class="why-sub">我们仅在合规范围内使用您的信息，数据将严格保密。</p>
        <div class="why-requirements">
          <h4>准备材料</h4>
          <p>SSM 证照（如 Certificate of Incorporation / Business Registration Certificate），以及基本联系信息。</p>
          <h4>审核时效</h4>
          <p>一般 1-3 个工作日内完成。</p>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="showWhyDrawer = false">稍后再说</el-button>
          <el-button type="primary" @click="goStartAuth">立即开始认证</el-button>
        </div>
      </template>
    </el-drawer>

    <div class="container">
      <div class="auth-content">
        <!-- 顶部已包含状态摘要卡，因此移除下方重复状态卡片 -->

        <!-- 认证表单 -->
        <div class="auth-form-card">
          <div class="form-header">
            <h2>企业信息</h2>
            <p>请填写真实的企业信息，我们将进行审核</p>
          </div>
          <el-alert
            class="info-alert"
            title="仅用于企业实名认证，所有资料严格保密"
            type="success"
            :closable="false"
            show-icon
            description="支持 SSM 证照；SSM 注册号与马来西亚手机号将自动校验。"
          />

          <el-form
            ref="authFormRef"
            :model="authForm"
            :rules="authRules"
            label-width="auto"
            class="auth-form"
            label-position="top"
          >
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="企业名称" prop="companyName">
                    <el-input
                      v-model="authForm.companyName"
                      placeholder="请输入企业名称（与 SSM 登记一致）"
                      clearable
                      maxlength="100"
                      show-word-limit
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item prop="legalPerson">
                    <template #label>
                      <span class="form-label">董事/负责人姓名</span>
                    </template>
                    <el-input
                      v-model="authForm.legalPerson"
                      placeholder="请输入董事/负责人姓名"
                      clearable
                      maxlength="50"
                      show-word-limit
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item prop="creditCode">
                    <template #label>
                      <span class="form-label">SSM 注册号 <span class="label-sub">(SSM Registration No.)</span></span>
                    </template>
                    <el-input
                      v-model="authForm.creditCode"
                      placeholder="请输入 SSM 注册号"
                      clearable
                      maxlength="30"
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item prop="businessLicense">
                    <template #label>
                      <span class="form-label">证照编号 <span class="label-optional">(可选)</span></span>
                    </template>
                    <el-input
                      v-model="authForm.businessLicense"
                      placeholder="请输入证照编号（可选）"
                      clearable
                      maxlength="50"
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="企业类型" prop="companyType">
                    <el-select
                      v-model="authForm.companyType"
                      placeholder="请选择企业类型"
                      :disabled="authInfo?.status === 'approved'"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="type in companyTypes"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="注册资本" prop="registeredCapital">
                    <el-input
                      v-model="authForm.registeredCapital"
                      placeholder="请输入注册资本"
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="成立日期" prop="establishmentDate">
                    <el-date-picker
                      v-model="authForm.establishmentDate"
                      type="date"
                      placeholder="请选择成立日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      :disabled="authInfo?.status === 'approved'"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="企业地址" prop="companyAddress">
                    <el-input
                      v-model="authForm.companyAddress"
                      placeholder="请输入企业地址"
                      clearable
                      maxlength="120"
                      show-word-limit
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="经营范围" prop="businessScope">
                <el-input
                  v-model="authForm.businessScope"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入经营范围"
                  maxlength="500"
                  show-word-limit
                  :disabled="authInfo?.status === 'approved'"
                />
              </el-form-item>

              <el-form-item label="企业描述" prop="description">
                <el-input
                  v-model="authForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请简要描述企业情况"
                  maxlength="500"
                  show-word-limit
                  :disabled="authInfo?.status === 'approved'"
                />
              </el-form-item>
            </div>

            <!-- 联系信息 -->
            <div class="form-section">
              <h3 class="section-title">联系信息</h3>
              
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="联系人姓名" prop="contactName">
                    <el-input
                      v-model="authForm.contactName"
                      placeholder="请输入联系人姓名"
                      clearable
                      maxlength="50"
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :span="12">
                  <el-form-item label="联系人电话" prop="contactPhone">
                    <el-input
                      v-model="authForm.contactPhone"
                      placeholder="例如 0123456789 或 +60123456789"
                      clearable
                      maxlength="15"
                      :disabled="authInfo?.status === 'approved'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="联系人邮箱" prop="contactEmail">
                <el-input
                  v-model="authForm.contactEmail"
                  placeholder="请输入联系人邮箱"
                  clearable
                  maxlength="100"
                  :disabled="authInfo?.status === 'approved'"
                />
              </el-form-item>
            </div>

            <!-- 证书上传 -->
            <div class="form-section">
              <h3 class="section-title">认证材料（SSM 证照）</h3>
              <p class="section-description">
                请上传 SSM 证照照片，如 Certificate of Incorporation / Business Registration Certificate 等
              </p>
              
              <el-form-item label="证书图片" prop="certificateImages">
                <div class="upload-section">
                  <el-upload
                    v-model:file-list="certificateFiles"
                    :http-request="handleCustomUpload"
                    :headers="uploadHeaders"
                    :on-error="handleUploadError"
                    :before-upload="beforeUpload"
                    :on-remove="handleRemove"
                    list-type="picture-card"
                    :limit="5"
                    :disabled="authInfo?.status === 'approved'"
                    accept="image/*"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                  <div class="upload-tips">
                    <p>支持 JPG、PNG，单个文件不超过 5MB</p>
                    <p>请确保证照完整清晰，包含公司名称与注册号，便于审核</p>
                  </div>
                </div>
              </el-form-item>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions" v-if="authInfo?.status !== 'approved'">
              <el-button
                type="primary"
                size="large"
                :loading="submitting"
                @click="submitAuth"
              >
                {{ authInfo?.status === 'rejected' ? '重新提交' : '提交认证' }}
              </el-button>
              <el-button size="large" @click="resetForm">
                重置
              </el-button>
            </div>
          </el-form>
        </div>

        <!-- 认证指南 -->
        <div class="guide-card">
          <div class="guide-header">
            <h3>认证指南</h3>
            <el-button type="text" @click="showGuide = !showGuide">
              {{ showGuide ? '收起' : '展开' }}
            </el-button>
          </div>
          
          <div class="guide-content" v-show="showGuide">
            <div class="guide-item" v-for="(item, index) in authGuide" :key="index">
              <div class="guide-step">
                <span class="step-number">{{ index + 1 }}</span>
                <div class="step-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div class="faq-card">
          <div class="faq-header">
            <h3>常见问题</h3>
            <el-button type="text" @click="showFAQ = !showFAQ">
              {{ showFAQ ? '收起' : '展开' }}
            </el-button>
          </div>
          
          <div class="faq-content" v-show="showFAQ">
            <el-collapse v-model="activeFAQ">
              <el-collapse-item
                v-for="(item, index) in authFAQ"
                :key="index"
                :title="item.question"
                :name="index"
              >
                <div class="faq-answer">{{ item.answer }}</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  OfficeBuilding, 
  Check, 
  Clock, 
  Close, 
  Document, 
  Plus 
} from '@element-plus/icons-vue'
import { companiesAPI } from '@/api/companies'
import duducarAPI from '@/api/duducar-integration'
import { MY_SSM_REGEX, MY_MOBILE_REGEX } from '@/utils/validators'

// 响应式数据
const authFormRef = ref()
const authInfo = ref(null)
const companyTypes = ref([])
const authGuide = ref([])
const authFAQ = ref([])
const certificateFiles = ref([])
const submitting = ref(false)
const showGuide = ref(false)
const showFAQ = ref(false)
const activeFAQ = ref([])
const showWhyDrawer = ref(false)

// 表单数据
const authForm = reactive({
  companyName: '',
  legalPerson: '',
  creditCode: '',
  businessLicense: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  companyAddress: '',
  businessScope: '',
  companyType: '',
  registeredCapital: '',
  establishmentDate: '',
  description: '',
  certificateImages: []
})

// 表单验证规则
const authRules = {
  companyName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' }
  ],
  legalPerson: [
    { required: true, message: '请输入法人姓名', trigger: 'blur' }
  ],
  creditCode: [
    { required: true, message: '请输入SSM注册号', trigger: 'blur' },
    { pattern: MY_SSM_REGEX, message: '请输入有效的马来西亚SSM注册号', trigger: 'blur' }
  ],
  businessLicense: [
    // 可选：不强制填写
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系人电话', trigger: 'blur' },
    { pattern: MY_MOBILE_REGEX, message: '请输入有效的马来西亚手机号', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入联系人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  companyAddress: [
    { required: true, message: '请输入企业地址', trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '请输入经营范围', trigger: 'blur' }
  ],
  companyType: [
    { required: true, message: '请选择企业类型', trigger: 'change' }
  ],
  registeredCapital: [
    { required: true, message: '请输入注册资本', trigger: 'blur' }
  ],
  establishmentDate: [
    { required: true, message: '请选择成立日期', trigger: 'change' }
  ],
  certificateImages: [
    { required: true, message: '请上传认证材料', trigger: 'change' }
  ]
}

const uploadHeaders = computed(() => {
  const token = sessionStorage.getItem('zhimawang_token')
  const access = sessionStorage.getItem('access_token')
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (access) headers.Authorization = `Bearer ${access}`
  return headers
})

// 方法
const getStatusClass = (status) => {
  const statusMap = {
    'approved': 'status-approved',
    'pending': 'status-pending',
    'rejected': 'status-rejected',
    'none': 'status-none'
  }
  return statusMap[status] || 'status-none'
}

const getStatusText = (status) => {
  const statusMap = {
    'approved': '认证通过',
    'pending': '审核中',
    'rejected': '认证失败',
    'none': '未认证'
  }
  return statusMap[status] || '未认证'
}

const getStatusDescription = (status) => {
  const statusMap = {
    'approved': '您的企业认证已通过，可以发布企业内容',
    'pending': '您的认证申请正在审核中，请耐心等待',
    'rejected': '您的认证申请未通过，请查看原因并重新提交',
    'none': '您还未进行企业认证，请填写信息并提交认证'
  }
  return statusMap[status] || '您还未进行企业认证，请填写信息并提交认证'
}

const mapVerificationStatus = (statusNumber) => {
  // 约定：0=未认证/草稿，1=审核中，2=已通过，-1/3=拒绝（视后端定义而定）
  if (statusNumber === 2) return 'approved'
  if (statusNumber === 1) return 'pending'
  if (statusNumber === -1 || statusNumber === 3) return 'rejected'
  return 'none'
}

const loadAuthInfo = async () => {
  try {
    const userId = Number(sessionStorage.getItem('user_id'))
    if (!userId) {
      authInfo.value = { status: 'none' }
      return
    }
    const response = await companiesAPI.getCompanyByUserId(userId)
    const company = response.data
    if (!company) {
      authInfo.value = { status: 'none' }
      return
    }

    authInfo.value = {
      status: mapVerificationStatus(company.verificationStatus),
      companyId: company.companyId
    }

    // 填充表单
    authForm.companyName = company.companyName || ''
    authForm.legalPerson = ''
    authForm.creditCode = company.companyCode || ''
    authForm.businessLicense = ''
    authForm.contactName = company.contactPerson || ''
    authForm.contactPhone = company.contactPhone || ''
    authForm.contactEmail = company.contactEmail || ''
    authForm.companyAddress = company.companyAddress || ''
    authForm.businessScope = ''
    authForm.companyType = ''
    authForm.registeredCapital = ''
    authForm.establishmentDate = ''
    authForm.description = company.companyDescription || ''
    authForm.certificateImages = Array.isArray(company.verificationDocs) ? company.verificationDocs : []

    certificateFiles.value = authForm.certificateImages.map((url, idx) => ({ name: `证书${idx+1}`, url }))
  } catch (error) {
    console.error('加载认证信息失败:', error)
  }
}

const loadCompanyTypes = async () => {
  // 使用默认企业类型（后端暂无字典）
  companyTypes.value = [
    { value: 'sdn-bhd', label: 'Sendirian Berhad (Sdn Bhd)' },
    { value: 'bhd', label: 'Berhad (Bhd)' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'sole', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'foreign', label: 'Foreign Company' },
    { value: 'ngo', label: 'Non-Profit / NGO' },
    { value: 'other', label: '其他' }
  ]
}

const loadAuthGuide = async () => {
  authGuide.value = [
    { title: '准备材料', description: '准备好 SSM 证照（如 Certificate of Incorporation / Business Registration Certificate）' },
    { title: '填写信息', description: '如实填写企业基本信息、联系方式和经营范围' },
    { title: '上传证照', description: '上传清晰可读的证照照片，确保包含公司名称与注册号' },
    { title: '提交审核', description: '确认信息无误后提交，等待审核结果' }
  ]
}

const loadAuthFAQ = async () => {
  authFAQ.value = [
    { question: '企业认证需要多长时间？', answer: '一般 1-3 个工作日内完成审核。' },
    { question: '认证失败后可以重新申请吗？', answer: '可以。修改相关信息后重新提交即可。' },
    { question: '上传的证照照片有什么要求？', answer: '需清晰可读，包含公司名称与注册号，JPG/PNG 格式，单个不超过 5MB。' },
    { question: '认证通过后有什么好处？', answer: '可发布企业内容，获得企业标识，提升信任度。' }
  ]
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleCustomUpload = async (options) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await duducarAPI.cos.uploadCommonImage(file)
    if (res.success) {
      const url = res.data?.cdnUrl || res.data?.proxyUrl || res.data?.objectKey
      authForm.certificateImages.push(url)
      certificateFiles.value.push({ name: file.name, url })
      onSuccess({ code: 200, data: { url }, message: 'success' }, file)
      ElMessage.success('上传成功')
    } else {
      throw new Error(res.message || '上传失败')
    }
  } catch (error) {
    onError(error)
    ElMessage.error(error.message || '上传失败，请重试')
  }
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error('上传失败，请重试')
}

const handleRemove = (file) => {
  const url = file.url || file.response?.data?.url
  const index = authForm.certificateImages.findIndex(item => item === url)
  if (index > -1) authForm.certificateImages.splice(index, 1)
}

const submitAuth = async () => {
  if (!authFormRef.value) return
  
  try {
    await authFormRef.value.validate()
    
    submitting.value = true
    
    // 映射为后端所需字段
    const payload = {
      companyName: authForm.companyName,
      companyCode: authForm.creditCode,
      companySize: authForm.companySize,
      companyAddress: authForm.companyAddress,
      companyDescription: authForm.description || authForm.businessScope,
      contactPerson: authForm.contactName,
      contactPhone: authForm.contactPhone,
      contactEmail: authForm.contactEmail,
      country: 'MY',
      registrationAuthority: 'SSM',
      verificationDocs: authForm.certificateImages
    }

    if (authInfo.value?.companyId) {
      await companiesAPI.updateCompany(authInfo.value.companyId, payload)
    } else {
      const userId = Number(sessionStorage.getItem('user_id'))
      if (userId) payload.userId = userId
      await companiesAPI.createCompany(payload)
    }

    ElMessage.success('提交成功，请等待审核')
    await loadAuthInfo()
    
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('提交失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  if (authFormRef.value) {
    authFormRef.value.resetFields()
  }
  certificateFiles.value = []
  authForm.certificateImages = []
}

const goStartAuth = () => {
  showWhyDrawer.value = false
  // 滚动到表单卡片
  const formCard = document.querySelector('.auth-form-card')
  if (formCard && typeof formCard.scrollIntoView === 'function') {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    loadAuthInfo(),
    loadCompanyTypes(),
    loadAuthGuide(),
    loadAuthFAQ()
  ])
})
</script>

<style scoped>
.company-auth-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  /* 覆盖 Element Plus 主题主色为橙色 */
  --el-color-primary: var(--primary-color);
}

.page-header {
  padding: 48px 0 16px;
  color: var(--text-primary);
  text-align: left;
}

.header-content {
  max-width: 100%;
  margin: 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.page-title :deep(.el-icon) {
  color: var(--primary-color);
}

.page-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  color: #666;
}

.header-actions {
  margin-top: 12px;
}

.why-btn {
  color: var(--primary-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.auth-content {
  padding: 24px 0;
}

/* 头部左右两栏布局 */
.header-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}

.status-summary .summary-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* .summary-icon 仅作为标识类，不覆盖 .status-icon 尺寸与颜色，保持一致外观 */
.summary-icon { font-size: 24px; }

.summary-text h3 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.summary-text p {
  margin: 0;
  color: #666;
}

.auth-status-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.status-icon.status-approved {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.status-icon.status-pending {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.status-icon.status-rejected {
  background: linear-gradient(135deg, #F44336, #D32F2F);
}

.status-icon.status-none {
  background: linear-gradient(135deg, #9E9E9E, #757575);
}

.status-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.status-info p {
  color: #666;
  margin: 0;
}

.auth-form-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.form-header p {
  color: #666;
  margin: 0;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.section-description {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 0.9rem;
}

.auth-form {
  max-width: 900px;
  margin: 0 auto;
}

.info-alert {
  margin-bottom: 24px;
  border: 2px solid #67c23a;
  background: linear-gradient(135deg, #f0f9ff, #e8f5e8);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.info-alert :deep(.el-alert__title) {
  font-weight: 600;
  font-size: 1.1em;
  color: #2d5016;
}

.info-alert :deep(.el-alert__description) {
  font-weight: 500;
  color: #4a7c59;
  margin-top: 8px;
}

.info-alert :deep(.el-alert__icon) {
  color: #67c23a;
  font-size: 1.2em;
}

/* 表单标签样式 */
.form-label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.label-sub {
  font-size: 0.85em;
  color: #999;
  font-weight: 400;
  margin-left: 4px;
}

.label-optional {
  font-size: 0.85em;
  color: #999;
  font-weight: 400;
  margin-left: 4px;
}

/* 优化表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  overflow: visible;
}

/* 让必填星号与文字同一行对齐 */
:deep(.el-form-item__label .is-required) {
  display: inline-flex;
  align-items: center;
}
:deep(.el-form-item.is-required .el-form-item__label::before) {
  position: static;
  margin-right: 4px; /* 星号与文字间距 */
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e0e0e0 inset;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c0c0 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e0e0e0 inset;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c0c0 inset;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

.upload-section {
  width: 100%;
}

.upload-tips {
  margin-top: 12px;
  color: #666;
  font-size: 0.9rem;
}

.upload-tips p {
  margin: 4px 0;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #f0f0f0;
}

.form-actions .el-button {
  margin: 0 8px;
  min-width: 120px;
}

/* Element Plus 按钮橙色主题（仅在本页作用域） */
:deep(.el-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-button--primary:hover),
:deep(.el-button--primary:focus) {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

/* 文本按钮使用橙色 */
:deep(.el-button--text),
:deep(.el-button.is-text) {
  color: var(--primary-color);
}

:deep(.el-button--text:hover),
:deep(.el-button.is-text:hover) {
  color: var(--primary-hover);
  background: var(--bg-light);
}

.guide-card,
.faq-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.guide-header,
.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.guide-header h3,
.faq-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.guide-content {
  margin-top: 20px;
}

.guide-item {
  margin-bottom: 24px;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.step-content p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.faq-content {
  margin-top: 20px;
}

.faq-answer {
  color: #666;
  line-height: 1.6;
  padding: 16px 0;
}

/* 抽屉内容样式 */
.why-content {
  padding: 0 8px;
  color: #333;
  line-height: 1.8;
}

.why-content p {
  margin-bottom: 12px;
}

.why-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.why-list li {
  padding: 12px 16px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff5f0, #fff);
  border-left: 3px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.1);
  transition: all 0.3s ease;
}

.why-list li:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.15);
}

.why-sub {
  font-size: 0.9em;
  color: #666;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 16px 0;
}

.why-requirements {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.why-requirements h4 {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px 0;
}

.why-requirements p {
  color: #666;
  margin-bottom: 12px;
}

.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  .header-grid {
    grid-template-columns: 1fr;
  }
  
  .auth-status-card,
  .auth-form-card,
  .guide-card,
  .faq-card {
    padding: 20px;
    margin-bottom: 16px;
  }
  .auth-form :deep(.el-col) {
    padding-bottom: 8px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 0.9em;
  }
  
  .status-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .form-actions .el-button {
    width: 100%;
    margin: 8px 0;
  }
  
  .drawer-footer {
    flex-direction: column;
  }
  
  .drawer-footer .el-button {
    width: 100%;
  }
}
</style>
