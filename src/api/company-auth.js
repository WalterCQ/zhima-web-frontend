import { request } from './index'

/**
 * 企业认证相关API
 */
export const companyAuthAPI = {
  /**
   * 获取企业认证信息
   */
  getCompanyAuthInfo: () => {
    return request.get('/company-auth/info')
  },

  /**
   * 提交企业认证申请
   * @param {Object} data - 认证数据
   * @param {string} data.companyName - 企业名称
   * @param {string} data.legalPerson - 法人姓名
   * @param {string} data.creditCode - 统一社会信用代码
   * @param {string} data.businessLicense - 营业执照号
   * @param {string} data.contactName - 联系人姓名
   * @param {string} data.contactPhone - 联系人电话
   * @param {string} data.contactEmail - 联系人邮箱
   * @param {string} data.companyAddress - 企业地址
   * @param {string} data.businessScope - 经营范围
   * @param {string} data.companyType - 企业类型
   * @param {string} data.registeredCapital - 注册资本
   * @param {string} data.establishmentDate - 成立日期
   * @param {Array} data.certificateImages - 证书图片URLs
   * @param {string} data.description - 企业描述
   */
  submitCompanyAuth: (data) => {
    return request.post('/company-auth/submit', data)
  },

  /**
   * 更新企业认证信息
   * @param {Object} data - 更新的认证数据
   */
  updateCompanyAuth: (data) => {
    return request.put('/company-auth/update', data)
  },

  /**
   * 获取企业认证状态
   */
  getAuthStatus: () => {
    return request.get('/company-auth/status')
  },

  /**
   * 上传企业证书图片
   * @param {FormData} formData - 包含图片文件的FormData
   */
  uploadCertificate: (formData) => {
    return request.upload('/company-auth/upload-certificate', formData)
  },

  /**
   * 删除企业证书图片
   * @param {string} imageId - 图片ID
   */
  deleteCertificate: (imageId) => {
    return request.delete('/company-auth/certificate', { imageId })
  },

  /**
   * 获取企业认证审核记录
   */
  getAuthRecords: () => {
    return request.get('/company-auth/records')
  },

  /**
   * 重新提交企业认证
   * @param {Object} data - 重新提交的数据
   */
  resubmitAuth: (data) => {
    return request.post('/company-auth/resubmit', data)
  },

  /**
   * 获取企业认证指南
   */
  getAuthGuide: () => {
    return request.get('/company-auth/guide')
  },

  /**
   * 获取企业认证常见问题
   */
  getAuthFAQ: () => {
    return request.get('/company-auth/faq')
  },

  /**
   * 联系客服
   * @param {Object} data - 联系信息
   * @param {string} data.subject - 主题
   * @param {string} data.message - 消息内容
   * @param {string} data.contactPhone - 联系电话
   */
  contactSupport: (data) => {
    return request.post('/company-auth/contact-support', data)
  },

  /**
   * 获取企业认证统计信息
   */
  getAuthStats: () => {
    return request.get('/company-auth/stats')
  },

  /**
   * 验证企业信息
   * @param {Object} data - 企业信息
   * @param {string} data.creditCode - 统一社会信用代码
   * @param {string} data.companyName - 企业名称
   */
  validateCompanyInfo: (data) => {
    return request.post('/company-auth/validate', data)
  },

  /**
   * 获取企业类型列表
   */
  getCompanyTypes: () => {
    return request.get('/company-auth/company-types')
  },

  /**
   * 获取认证所需材料清单
   */
  getRequiredMaterials: () => {
    return request.get('/company-auth/required-materials')
  }
}

export default companyAuthAPI
