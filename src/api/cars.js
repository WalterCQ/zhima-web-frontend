import { request } from './index'

export const carsAPI = {
  // 获取二手车列表
  getCarsList: (params = {}) => request.get('/cars', params),

  // 获取二手车详情
  getCarDetail: (id) => request.get(`/cars/${id}`),

  // 发布二手车信息
  publishCar: (data) => request.post('/cars', data),

  // 更新二手车信息
  updateCar: (id, data) => request.put(`/cars/${id}`, data),

  // 删除二手车信息
  deleteCar: (id) => request.delete(`/cars/${id}`),

  // 获取汽车品牌
  getCarBrands: () => request.get('/cars/brands'),

  // 获取汽车型号
  getCarModels: (brandId) => request.get(`/cars/brands/${brandId}/models`),

  // 获取汽车颜色
  getCarColors: () => request.get('/cars/colors'),

  // 获取燃料类型
  getFuelTypes: () => request.get('/cars/fuel-types'),

  // 获取变速箱类型
  getTransmissionTypes: () => request.get('/cars/transmission-types'),

  // 获取车身类型
  getBodyTypes: () => request.get('/cars/body-types'),

  // 搜索二手车
  searchCars: (params = {}) => request.get('/cars/search', params),

  // 筛选二手车
  filterCars: (params = {}) => request.get('/cars/filter', params),

  // 获取热门二手车
  getHotCars: (limit = 20) => request.get('/cars/hot', { limit }),

  // 获取推荐二手车
  getRecommendedCars: (params = {}) => request.get('/cars/recommended', params),

  // 获取我发布的二手车
  getMyCars: (params = {}) => request.get('/cars/my', params),

  // 收藏二手车
  favoriteCar: (id) => request.post(`/cars/${id}/favorite`),

  // 取消收藏二手车
  unfavoriteCar: (id) => request.delete(`/cars/${id}/favorite`),

  // 获取收藏的二手车
  getFavoriteCars: (params = {}) => request.get('/cars/favorites', params),

  // 联系车主
  contactOwner: (id, data) => request.post(`/cars/${id}/contact`, data),

  // 获取二手车统计信息
  getCarStats: (id) => request.get(`/cars/${id}/stats`),

  // 举报二手车信息
  reportCar: (id, data) => request.post(`/cars/${id}/report`, data),

  // 上传二手车图片
  uploadCarImage: (formData) => request.upload('/cars/upload/image', formData),

  // 获取附近二手车
  getNearbyCars: (params = {}) => request.get('/cars/nearby', params),

  // 获取二手车价格趋势
  getCarPriceTrends: (params = {}) => request.get('/cars/price-trends', params),

  // 获取二手车评估
  getCarEvaluation: (data) => request.post('/cars/evaluation', data),

  // 获取二手车对比
  compareCars: (carIds) => request.get('/cars/compare', { carIds: carIds.join(',') }),

  // 获取二手车历史记录
  getCarHistory: (vin) => request.get(`/cars/history/${vin}`),

  // 获取二手车保险信息
  getCarInsurance: (id) => request.get(`/cars/${id}/insurance`),

  // 获取二手车维修记录
  getCarMaintenance: (id) => request.get(`/cars/${id}/maintenance`)
}
