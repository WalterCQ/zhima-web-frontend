import { request } from './index'

export const housingExtendedAPI = {
  // 获取房产分类
  getHousingCategories: () => request.get('/housing/categories'),

  // 获取房产类型
  getHousingTypes: () => request.get('/housing/types'),

  // 获取房屋朝向
  getOrientations: () => request.get('/housing/orientations'),

  // 获取装修程度
  getDecorationLevels: () => request.get('/housing/decoration-levels'),

  // 获取房屋设施
  getFacilities: () => request.get('/housing/facilities'),

  // 获取周边配套
  getSurroundingFacilities: () => request.get('/housing/surrounding-facilities'),

  // 获取新房列表
  getNewHouses: (params = {}) => request.get('/housing/new', params),

  // 获取新房详情
  getNewHouseDetail: (id) => request.get(`/housing/new/${id}`),

  // 发布新房信息
  publishNewHouse: (data) => request.post('/housing/new', data),

  // 更新新房信息
  updateNewHouse: (id, data) => request.put(`/housing/new/${id}`, data),

  // 删除新房信息
  deleteNewHouse: (id) => request.delete(`/housing/new/${id}`),

  // 获取二手房列表
  getSecondhandHouses: (params = {}) => request.get('/housing/secondhand', params),

  // 获取二手房详情
  getSecondhandHouseDetail: (id) => request.get(`/housing/secondhand/${id}`),

  // 发布二手房信息
  publishSecondhandHouse: (data) => request.post('/housing/secondhand', data),

  // 更新二手房信息
  updateSecondhandHouse: (id, data) => request.put(`/housing/secondhand/${id}`, data),

  // 删除二手房信息
  deleteSecondhandHouse: (id) => request.delete(`/housing/secondhand/${id}`),

  // 获取商铺列表
  getShops: (params = {}) => request.get('/housing/shops', params),

  // 获取商铺详情
  getShopDetail: (id) => request.get(`/housing/shops/${id}`),

  // 发布商铺信息
  publishShop: (data) => request.post('/housing/shops', data),

  // 更新商铺信息
  updateShop: (id, data) => request.put(`/housing/shops/${id}`, data),

  // 删除商铺信息
  deleteShop: (id) => request.delete(`/housing/shops/${id}`),

  // 获取租房列表
  getRentalList: (params = {}) => request.get('/housing/rental', params),

  // 获取租房详情
  getRentalDetail: (id) => request.get(`/housing/rental/${id}`),

  // 发布租房信息
  publishRental: (data) => request.post('/housing/rental', data),

  // 更新租房信息
  updateRental: (id, data) => request.put(`/housing/rental/${id}`, data),

  // 删除租房信息
  deleteRental: (id) => request.delete(`/housing/rental/${id}`),

  // 搜索房产
  searchHousing: (params = {}) => request.get('/housing/search', params),

  // 筛选房产
  filterHousing: (params = {}) => request.get('/housing/filter', params),

  // 获取热门房产
  getHotHousing: (limit = 20) => request.get('/housing/hot', { limit }),

  // 获取推荐房产
  getRecommendedHousing: (params = {}) => request.get('/housing/recommended', params),

  // 获取我发布的房产
  getMyHousing: (params = {}) => request.get('/housing/my', params),

  // 收藏房产
  favoriteHousing: (id) => request.post(`/housing/${id}/favorite`),

  // 取消收藏房产
  unfavoriteHousing: (id) => request.delete(`/housing/${id}/favorite`),

  // 获取收藏的房产
  getFavoriteHousing: (params = {}) => request.get('/housing/favorites', params),

  // 联系房东/中介
  contactOwner: (id, data) => request.post(`/housing/${id}/contact`, data),

  // 获取房产统计信息
  getHousingStats: (id) => request.get(`/housing/${id}/stats`),

  // 举报房产信息
  reportHousing: (id, data) => request.post(`/housing/${id}/report`, data),

  // 上传房产图片
  uploadHousingImage: (formData) => request.upload('/housing/upload/image', formData),

  // 获取附近房产
  getNearbyHousing: (params = {}) => request.get('/housing/nearby', params),

  // 获取房产价格趋势
  getHousingPriceTrends: (params = {}) => request.get('/housing/price-trends', params),

  // 获取房产评估
  getHousingEvaluation: (data) => request.post('/housing/evaluation', data),

  // 获取房产对比
  compareHousing: (housingIds) => request.get('/housing/compare', { housingIds: housingIds.join(',') }),

  // 获取房产历史记录
  getHousingHistory: (id) => request.get(`/housing/${id}/history`),

  // 获取房产贷款计算
  getLoanCalculation: (data) => request.post('/housing/loan-calculation', data),

  // 获取房产税费计算
  getTaxCalculation: (data) => request.post('/housing/tax-calculation', data),

  // 获取房产周边信息
  getSurroundingInfo: (id) => request.get(`/housing/${id}/surrounding`),

  // 获取房产交通信息
  getTransportationInfo: (id) => request.get(`/housing/${id}/transportation`),

  // 获取房产学区信息
  getSchoolDistrictInfo: (id) => request.get(`/housing/${id}/school-district`)
}
