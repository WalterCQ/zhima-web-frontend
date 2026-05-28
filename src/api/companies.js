import duducarAPI from './duducar-integration'

// 企业认证管理 API（对接 duducar 后端）
export const companiesAPI = {
  // 分页查询企业列表
  list: async (params = {}) => {
    try {
      const result = await duducarAPI.company.getCompanyList({
        pageNum: params.pageNum || params.page || 1,
        pageSize: params.pageSize || params.page_size || params.limit || 10,
        verificationStatus: params.verificationStatus,
        status: params.status
      })
      return { code: 200, message: 'success', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '获取企业列表失败', data: null }
    }
  },

  // 创建企业认证
  createCompany: async (data) => {
    try {
      const result = await duducarAPI.company.createCompany(data)
      return { code: 200, message: '创建成功', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '创建失败', data: null }
    }
  },

  // 获取企业详情
  getCompanyById: async (companyId) => {
    try {
      const result = await duducarAPI.company.getCompanyById(companyId)
      return { code: 200, message: 'success', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '获取企业详情失败', data: null }
    }
  },

  // 根据用户ID获取企业信息
  getCompanyByUserId: async (userId) => {
    try {
      const result = await duducarAPI.company.getCompanyByUserId(userId)
      return { code: 200, message: 'success', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '获取用户企业信息失败', data: null }
    }
  },

  // 更新企业信息
  updateCompany: async (companyId, data) => {
    try {
      const result = await duducarAPI.company.updateCompany(companyId, data)
      return { code: 200, message: '更新成功', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '更新失败', data: null }
    }
  },

  // 删除企业
  deleteCompany: async (companyId) => {
    try {
      await duducarAPI.company.deleteCompany(companyId)
      return { code: 200, message: '删除成功', data: true }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '删除失败', data: null }
    }
  },

  // 企业认证审核（管理员）
  verifyCompany: async (companyId, verificationStatus) => {
    try {
      await duducarAPI.company.verifyCompany(companyId, verificationStatus)
      return { code: 200, message: '审核成功', data: true }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '审核失败', data: null }
    }
  },

  // 检查企业名称是否存在
  checkCompanyName: async (companyName, excludeId) => {
    try {
      const result = await duducarAPI.company.checkCompanyName(companyName, excludeId)
      return { code: 200, message: 'success', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '校验失败', data: null }
    }
  },

  // 检查统一社会信用代码是否存在
  checkCompanyCode: async (companyCode, excludeId) => {
    try {
      const result = await duducarAPI.company.checkCompanyCode(companyCode, excludeId)
      return { code: 200, message: 'success', data: result.data }
    } catch (error) {
      return { code: error.response?.status || 500, message: error.message || '校验失败', data: null }
    }
  }
}

export default companiesAPI


