import { request } from './index'

// 房产/租赁 相关 API
export const housingAPI = {
  // 获取二手房租赁信息列表（公开接口）
  // 文档参考：/api/properties/rental
  getRentalList(params = {}) {
    // 直接请求完整地址，绕过本地 baseURL
    return request.get('http://duducar.cloud:8888/api/properties/rental', params, { loading: false })
  }
}

export default housingAPI



