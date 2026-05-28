import { request } from './index'

export const uploadAPI = {
  // 上传单张图片
  uploadImage: (formData) => request.upload('/upload/image', formData),

  // 上传多张图片
  uploadImages: (formData) => request.upload('/upload/images', formData),

  // 上传头像
  uploadAvatar: (formData) => request.upload('/upload/avatar', formData),

  // 上传背景图
  uploadBackground: (formData) => request.upload('/upload/background', formData),

  // 上传文件
  uploadFile: (formData) => request.upload('/upload/file', formData),

  // 上传视频
  uploadVideo: (formData) => request.upload('/upload/video', formData),

  // 上传音频
  uploadAudio: (formData) => request.upload('/upload/audio', formData),

  // 获取上传进度
  getUploadProgress: (uploadId) => request.get(`/upload/progress/${uploadId}`),

  // 取消上传
  cancelUpload: (uploadId) => request.delete(`/upload/${uploadId}`),

  // 删除已上传的文件
  deleteUploadedFile: (fileId) => request.delete(`/upload/files/${fileId}`),

  // 获取已上传的文件列表
  getUploadedFiles: (params = {}) => request.get('/upload/files', params),

  // 获取文件信息
  getFileInfo: (fileId) => request.get(`/upload/files/${fileId}`),

  // 压缩图片
  compressImage: (formData) => request.upload('/upload/compress-image', formData),

  // 生成缩略图
  generateThumbnail: (formData) => request.upload('/upload/thumbnail', formData)
}
