# 知马网 API 接口接入指南

## 概述

本文档详细说明了知马网项目中所有界面组件的API接口接入情况。项目已经为所有主要界面组件预留了完整的API接口，支持数据的增删改查操作。

## API 模块结构

### 核心API模块

#### 1. 认证相关 (`src/api/auth.js`)
- `login()` - 用户登录
- `register()` - 用户注册
- `getUserInfo()` - 获取用户信息
- `updateProfile()` - 更新用户资料
- `uploadAvatar()` - 上传头像
- `logout()` - 退出登录

#### 2. 用户管理 (`src/api/user-v2.js`)
- `sendSms()` - 发送短信验证码
- `register()` - 用户注册
- `refresh()` - 刷新token
- `logout()` - 退出登录
- `logoutOthers()` - 退出其他设备
- `logoutAll()` - 退出所有设备
- `login()` - 用户登录
- `deleteAccount()` - 删除账户
- `changePassword()` - 修改密码
- `sessions()` - 获取会话列表
- `info()` - 获取用户信息
- `checkPhone()` - 检查手机号

#### 3. 服务相关 (`src/api/services.js`)
- `getServices()` - 获取服务列表
- `getServiceDetail()` - 获取服务详情
- `publishService()` - 发布服务
- `updateService()` - 更新服务
- `deleteService()` - 删除服务
- `favoriteService()` - 收藏服务
- `unfavoriteService()` - 取消收藏
- `getFavoriteServices()` - 获取收藏的服务
- `getMyServices()` - 获取我发布的服务
- `contactProvider()` - 联系服务商
- `getServiceStats()` - 获取服务统计
- `reportService()` - 举报服务
- `getServiceReviews()` - 获取服务评价
- `addServiceReview()` - 添加服务评价
- `getProviderInfo()` - 获取服务商信息
- `getProviderServices()` - 获取服务商的服务
- `uploadServiceImage()` - 上传服务图片
- `getRecommendedServices()` - 获取推荐服务
- `getNearbyServices()` - 获取附近服务

#### 4. 新闻资讯 (`src/api/news.js`)
- `getCategories()` - 获取新闻分类
- `getArticles()` - 获取文章列表
- `getArticleDetail()` - 获取文章详情
- `getTrendingArticles()` - 获取热门文章
- `likeArticle()` - 文章点赞
- `getComments()` - 获取文章评论
- `postComment()` - 发表评论
- `publishArticle()` - 发布文章

#### 5. 房产相关 (`src/api/housing.js`)
- `getRentalList()` - 获取租房列表

#### 6. 生活分享 (`src/api/lifestyle.js`)
- `getCategories()` - 获取生活圈分类
- `getPosts()` - 获取生活分享列表
- `getPostDetail()` - 获取生活分享详情
- `publishPost()` - 发布生活分享
- `toggleLike()` - 点赞/取消点赞
- `getComments()` - 获取评论
- `postComment()` - 发表评论

#### 7. 通用功能 (`src/api/common.js`)
- `search()` - 全站搜索
- `getTrendingKeywords()` - 热搜关键词
- `uploadImage()` - 上传图片
- `uploadImages()` - 上传多张图片
- `getSystemConfig()` - 获取系统配置
- `reportContent()` - 举报内容
- `getNotifications()` - 获取通知
- `markNotificationRead()` - 标记通知已读
- `getHomepageStats()` - 获取首页统计数据

### 新增API模块

#### 8. 知马圈 (`src/api/circles.js`)
- `getCategories()` - 获取知马圈分类
- `getCircles()` - 获取知马圈列表
- `getCircleDetail()` - 获取知马圈详情
- `createCircle()` - 创建知马圈
- `updateCircle()` - 更新知马圈信息
- `deleteCircle()` - 删除知马圈
- `joinCircle()` - 加入知马圈
- `leaveCircle()` - 退出知马圈
- `getCircleMembers()` - 获取知马圈成员列表
- `getCirclePosts()` - 获取知马圈帖子列表
- `publishPost()` - 发布帖子到知马圈
- `getPostDetail()` - 获取帖子详情
- `likePost()` - 点赞帖子
- `unlikePost()` - 取消点赞帖子
- `getPostComments()` - 获取帖子评论
- `postComment()` - 发表评论
- `deleteComment()` - 删除评论
- `getMyCircles()` - 获取我加入的知马圈
- `getMyCreatedCircles()` - 获取我创建的知马圈
- `searchCircles()` - 搜索知马圈
- `getHotCircles()` - 获取热门知马圈
- `getRecommendedCircles()` - 推荐知马圈
- `uploadCoverImage()` - 上传知马圈封面图片
- `setAdmin()` - 设置知马圈管理员
- `removeAdmin()` - 移除知马圈管理员
- `getCircleStats()` - 获取知马圈统计信息
- `reportCircle()` - 举报知马圈
- `reportPost()` - 举报帖子

#### 9. 招聘信息 (`src/api/jobs.js`)
- `getJobsList()` - 获取招聘信息列表
- `getJobDetail()` - 获取招聘信息详情
- `publishJob()` - 发布招聘信息
- `updateJob()` - 更新招聘信息
- `deleteJob()` - 删除招聘信息
- `getJobCategories()` - 获取招聘分类
- `getJobTypes()` - 获取职位类型
- `getSalaryRanges()` - 获取薪资范围
- `getExperienceLevels()` - 获取工作经验要求
- `getEducationLevels()` - 获取教育要求
- `searchJobs()` - 搜索招聘信息
- `filterJobs()` - 筛选招聘信息
- `getHotJobs()` - 获取热门招聘
- `getRecommendedJobs()` - 获取推荐招聘
- `applyJob()` - 申请职位
- `getMyApplications()` - 获取我的申请记录
- `getMyJobs()` - 获取我发布的招聘
- `getJobApplicants()` - 获取职位申请者列表
- `handleApplication()` - 处理申请
- `favoriteJob()` - 收藏招聘信息
- `unfavoriteJob()` - 取消收藏招聘信息
- `getFavoriteJobs()` - 获取收藏的招聘信息
- `getCompanyInfo()` - 获取公司信息
- `getCompanyJobs()` - 获取公司发布的招聘
- `reportJob()` - 举报招聘信息
- `getJobStats()` - 获取招聘统计信息
- `uploadJobImage()` - 上传招聘图片
- `getNearbyJobs()` - 获取附近招聘
- `getJobTrends()` - 获取招聘趋势

#### 10. 二手车 (`src/api/cars.js`)
- `getCarsList()` - 获取二手车列表
- `getCarDetail()` - 获取二手车详情
- `publishCar()` - 发布二手车信息
- `updateCar()` - 更新二手车信息
- `deleteCar()` - 删除二手车信息
- `getCarBrands()` - 获取汽车品牌
- `getCarModels()` - 获取汽车型号
- `getCarColors()` - 获取汽车颜色
- `getFuelTypes()` - 获取燃料类型
- `getTransmissionTypes()` - 获取变速箱类型
- `getBodyTypes()` - 获取车身类型
- `searchCars()` - 搜索二手车
- `filterCars()` - 筛选二手车
- `getHotCars()` - 获取热门二手车
- `getRecommendedCars()` - 获取推荐二手车
- `getMyCars()` - 获取我发布的二手车
- `favoriteCar()` - 收藏二手车
- `unfavoriteCar()` - 取消收藏二手车
- `getFavoriteCars()` - 获取收藏的二手车
- `contactOwner()` - 联系车主
- `getCarStats()` - 获取二手车统计信息
- `reportCar()` - 举报二手车信息
- `uploadCarImage()` - 上传二手车图片
- `getNearbyCars()` - 获取附近二手车
- `getCarPriceTrends()` - 获取二手车价格趋势
- `getCarEvaluation()` - 获取二手车评估
- `compareCars()` - 获取二手车对比
- `getCarHistory()` - 获取二手车历史记录
- `getCarInsurance()` - 获取二手车保险信息
- `getCarMaintenance()` - 获取二手车维修记录

#### 11. 房产扩展 (`src/api/housing-extended.js`)
- `getHousingCategories()` - 获取房产分类
- `getHousingTypes()` - 获取房产类型
- `getOrientations()` - 获取房屋朝向
- `getDecorationLevels()` - 获取装修程度
- `getFacilities()` - 获取房屋设施
- `getSurroundingFacilities()` - 获取周边配套
- `getNewHouses()` - 获取新房列表
- `getNewHouseDetail()` - 获取新房详情
- `publishNewHouse()` - 发布新房信息
- `updateNewHouse()` - 更新新房信息
- `deleteNewHouse()` - 删除新房信息
- `getSecondhandHouses()` - 获取二手房列表
- `getSecondhandHouseDetail()` - 获取二手房详情
- `publishSecondhandHouse()` - 发布二手房信息
- `updateSecondhandHouse()` - 更新二手房信息
- `deleteSecondhandHouse()` - 删除二手房信息
- `getShops()` - 获取商铺列表
- `getShopDetail()` - 获取商铺详情
- `publishShop()` - 发布商铺信息
- `updateShop()` - 更新商铺信息
- `deleteShop()` - 删除商铺信息
- `getRentalList()` - 获取租房列表
- `getRentalDetail()` - 获取租房详情
- `publishRental()` - 发布租房信息
- `updateRental()` - 更新租房信息
- `deleteRental()` - 删除租房信息
- `searchHousing()` - 搜索房产
- `filterHousing()` - 筛选房产
- `getHotHousing()` - 获取热门房产
- `getRecommendedHousing()` - 获取推荐房产
- `getMyHousing()` - 获取我发布的房产
- `favoriteHousing()` - 收藏房产
- `unfavoriteHousing()` - 取消收藏房产
- `getFavoriteHousing()` - 获取收藏的房产
- `contactOwner()` - 联系房东/中介
- `getHousingStats()` - 获取房产统计信息
- `reportHousing()` - 举报房产信息
- `uploadHousingImage()` - 上传房产图片
- `getNearbyHousing()` - 获取附近房产
- `getHousingPriceTrends()` - 获取房产价格趋势
- `getHousingEvaluation()` - 获取房产评估
- `compareHousing()` - 获取房产对比
- `getHousingHistory()` - 获取房产历史记录
- `getLoanCalculation()` - 获取房产贷款计算
- `getTaxCalculation()` - 获取房产税费计算
- `getSurroundingInfo()` - 获取房产周边信息
- `getTransportationInfo()` - 获取房产交通信息
- `getSchoolDistrictInfo()` - 获取房产学区信息

#### 12. 用户资料 (`src/api/user-profile.js`)
- `getUserInfo()` - 获取用户基本信息
- `updateUserInfo()` - 更新用户基本信息
- `getUserProfile()` - 获取用户详细资料
- `updateUserProfile()` - 更新用户详细资料
- `uploadAvatar()` - 上传用户头像
- `uploadBackground()` - 上传用户背景图
- `getUserPosts()` - 获取用户文章列表
- `getUserServices()` - 获取用户服务列表
- `getUserCircles()` - 获取用户知马圈列表
- `getUserCollections()` - 获取用户收藏列表
- `getUserFollowing()` - 获取用户关注列表
- `getUserFollowers()` - 获取用户关注者列表
- `followUser()` - 关注用户
- `unfollowUser()` - 取消关注用户
- `checkFollowStatus()` - 检查是否已关注
- `getUserStats()` - 获取用户统计信息
- `getUserActivities()` - 获取用户动态
- `getUserPhotos()` - 获取用户相册
- `uploadPhoto()` - 上传用户照片
- `deletePhoto()` - 删除用户照片
- `getUserTags()` - 获取用户标签
- `updateUserTags()` - 更新用户标签
- `getUserPrivacySettings()` - 获取用户隐私设置
- `updateUserPrivacySettings()` - 更新用户隐私设置
- `getUserNotificationSettings()` - 获取用户通知设置
- `updateUserNotificationSettings()` - 更新用户通知设置
- `reportUser()` - 举报用户
- `blockUser()` - 屏蔽用户
- `unblockUser()` - 取消屏蔽用户
- `getBlockedUsers()` - 获取被屏蔽的用户列表
- `getUserVerification()` - 获取用户认证信息
- `submitUserVerification()` - 提交用户认证
- `getUserLevel()` - 获取用户等级信息
- `getUserPoints()` - 获取用户积分记录
- `getUserBadges()` - 获取用户勋章
- `getUserAchievements()` - 获取用户成就
- `searchUsers()` - 搜索用户
- `getRecommendedUsers()` - 获取推荐用户
- `getNearbyUsers()` - 获取附近用户
- `getUserOnlineStatus()` - 获取用户在线状态
- `setUserOnlineStatus()` - 设置用户在线状态
- `getUserLastActive()` - 获取用户最后活跃时间
- `getUserDevices()` - 获取用户设备信息
- `deleteUserDevice()` - 删除用户设备

#### 13. 帖子管理 (`src/api/posts.js`)
- `getPosts()` - 获取帖子列表
- `getPostDetail()` - 获取帖子详情
- `publishPost()` - 发布帖子
- `updatePost()` - 更新帖子
- `deletePost()` - 删除帖子
- `likePost()` - 点赞帖子
- `unlikePost()` - 取消点赞帖子
- `getPostComments()` - 获取帖子评论
- `postComment()` - 发表评论
- `deleteComment()` - 删除评论
- `favoritePost()` - 收藏帖子
- `unfavoritePost()` - 取消收藏帖子
- `sharePost()` - 分享帖子
- `reportPost()` - 举报帖子
- `getHotPosts()` - 获取热门帖子
- `getRecommendedPosts()` - 获取推荐帖子
- `searchPosts()` - 搜索帖子
- `uploadPostImage()` - 上传帖子图片
- `getPostStats()` - 获取帖子统计信息

#### 14. 搜索功能 (`src/api/search.js`)
- `globalSearch()` - 全站搜索
- `searchUsers()` - 搜索用户
- `searchPosts()` - 搜索帖子
- `searchServices()` - 搜索服务
- `searchCircles()` - 搜索知马圈
- `searchNews()` - 搜索新闻
- `searchHousing()` - 搜索房产
- `searchJobs()` - 搜索招聘
- `searchCars()` - 搜索二手车
- `getTrendingKeywords()` - 获取热搜关键词
- `getSearchSuggestions()` - 获取搜索建议
- `getSearchHistory()` - 获取搜索历史
- `clearSearchHistory()` - 清除搜索历史
- `saveSearchRecord()` - 保存搜索记录
- `getSearchStats()` - 获取搜索统计

#### 15. 静态页面 (`src/api/static-pages.js`)
- `getAboutPage()` - 获取关于我们页面内容
- `getContactPage()` - 获取联系我们页面内容
- `getAdCooperationPage()` - 获取广告合作页面内容
- `getContentSubmissionPage()` - 获取内容投稿页面内容
- `getDisclaimerPage()` - 获取免责声明页面内容
- `getPrivacyPolicyPage()` - 获取隐私政策页面内容
- `getNewbieGuidePage()` - 获取新手指南页面内容
- `getFAQPage()` - 获取常见问题页面内容
- `getOnlineSupportPage()` - 获取在线客服页面内容
- `getFeedbackPage()` - 获取意见反馈页面内容
- `getReportPage()` - 获取违规举报页面内容
- `submitFeedback()` - 提交意见反馈
- `submitReport()` - 提交举报
- `getSystemAnnouncements()` - 获取系统公告
- `getAnnouncementDetail()` - 获取系统公告详情
- `getHelpDocs()` - 获取帮助文档
- `getHelpDocDetail()` - 获取帮助文档详情
- `getSystemConfig()` - 获取系统配置
- `getWebsiteStats()` - 获取网站统计信息

#### 16. 首页功能 (`src/api/home.js`)
- `getBanners()` - 获取首页轮播图
- `getRecommendedContent()` - 获取首页推荐内容
- `getHotContent()` - 获取首页热门内容
- `getLatestContent()` - 获取首页最新内容
- `getHomepageStats()` - 获取首页统计数据
- `getCategoryNavigation()` - 获取首页分类导航
- `getQuickLinks()` - 获取首页快捷入口
- `getHomepageAnnouncements()` - 获取首页公告
- `getHomepageActivities()` - 获取首页活动
- `getRecommendedUsers()` - 获取首页推荐用户
- `getRecommendedServices()` - 获取首页推荐服务
- `getRecommendedCircles()` - 获取首页推荐知马圈
- `getRecommendedNews()` - 获取首页推荐新闻
- `getRecommendedHousing()` - 获取首页推荐房产
- `getRecommendedJobs()` - 获取首页推荐招聘
- `getRecommendedCars()` - 获取首页推荐二手车
- `getRecommendedLifestyle()` - 获取首页推荐生活分享

#### 17. 通知系统 (`src/api/notifications.js`)
- `getNotifications()` - 获取通知列表
- `getNotificationDetail()` - 获取通知详情
- `markAsRead()` - 标记通知为已读
- `markAllAsRead()` - 批量标记通知为已读
- `deleteNotification()` - 删除通知
- `deleteAllNotifications()` - 批量删除通知
- `getUnreadCount()` - 获取未读通知数量
- `getNotificationSettings()` - 获取通知设置
- `updateNotificationSettings()` - 更新通知设置
- `getSystemNotifications()` - 获取系统通知
- `getUserNotifications()` - 获取用户通知
- `getCommentNotifications()` - 获取评论通知
- `getLikeNotifications()` - 获取点赞通知
- `getFollowNotifications()` - 获取关注通知
- `getMessageNotifications()` - 获取私信通知

#### 18. 文件上传 (`src/api/upload.js`)
- `uploadImage()` - 上传单张图片
- `uploadImages()` - 上传多张图片
- `uploadAvatar()` - 上传头像
- `uploadBackground()` - 上传背景图
- `uploadFile()` - 上传文件
- `uploadVideo()` - 上传视频
- `uploadAudio()` - 上传音频
- `getUploadProgress()` - 获取上传进度
- `cancelUpload()` - 取消上传
- `deleteUploadedFile()` - 删除已上传的文件
- `getUploadedFiles()` - 获取已上传的文件列表
- `getFileInfo()` - 获取文件信息
- `compressImage()` - 压缩图片
- `generateThumbnail()` - 生成缩略图

#### 19. 企业认证 (`src/api/company-auth.js`)
- `getCompanyAuthInfo()` - 获取企业认证信息
- `submitCompanyAuth()` - 提交企业认证申请
- `updateCompanyAuth()` - 更新企业认证信息
- `getAuthStatus()` - 获取企业认证状态
- `uploadCertificate()` - 上传企业证书图片
- `deleteCertificate()` - 删除企业证书图片
- `getAuthRecords()` - 获取企业认证审核记录
- `resubmitAuth()` - 重新提交企业认证
- `getAuthGuide()` - 获取企业认证指南
- `getAuthFAQ()` - 获取企业认证常见问题
- `contactSupport()` - 联系客服
- `getAuthStats()` - 获取企业认证统计信息
- `validateCompanyInfo()` - 验证企业信息
- `getCompanyTypes()` - 获取企业类型列表
- `getRequiredMaterials()` - 获取认证所需材料清单

## 界面组件API接入情况

### 已接入API的组件

#### 1. 首页 (`src/views/home/HomePage.vue`)
- ✅ 接入 `homeAPI` - 首页数据加载
- ✅ 接入 `searchAPI` - 搜索功能
- 功能：轮播图、推荐内容、热门内容、统计数据、分类导航等

#### 2. 搜索页面 (`src/views/home/search/SearchPage.vue`)
- ✅ 接入 `searchAPI` - 全站搜索
- ✅ 接入 `newsAPI` - 新闻搜索
- ✅ 接入 `servicesAPI` - 服务搜索
- ✅ 接入 `circlesAPI` - 知马圈搜索
- ✅ 接入 `userProfileAPI` - 用户搜索
- 功能：多类型搜索、搜索建议、搜索历史等

#### 3. 知马圈页面 (`src/views/circles/CirclesPage.vue`)
- ✅ 接入 `circlesAPI` - 知马圈数据
- ✅ 接入 `postsAPI` - 帖子数据
- 功能：圈子列表、帖子展示、分类筛选等

#### 4. 用户个人资料页面 (`src/views/user/UserProfilePage.vue`)
- ✅ 接入 `userProfileAPI` - 用户资料
- ✅ 接入 `postsAPI` - 用户帖子
- ✅ 接入 `servicesAPI` - 用户服务
- ✅ 接入 `circlesAPI` - 用户知马圈
- 功能：用户信息、动态、文章、服务、知马圈、收藏等

#### 5. 企业认证页面 (`src/views/auth/CompanyAuthPage.vue`)
- ✅ 接入 `companyAuthAPI` - 企业认证
- 功能：企业信息填写、证书上传、认证状态查看、认证指南等

### 待接入API的组件

#### 1. 认证页面
- `src/views/auth/LoginPage.vue` - 登录页面
- `src/views/auth/RegisterPage.vue` - 注册页面
- 建议接入：`authAPI`, `userV2API`

#### 2. 新闻页面
- `src/views/news/NewsPage.vue` - 新闻列表
- `src/views/news/NewsDetail.vue` - 新闻详情
- 建议接入：`newsAPI`

#### 3. 服务页面
- `src/views/services/ServicesPage.vue` - 服务首页
- `src/views/services/ServicesListPage.vue` - 服务列表
- `src/views/services/ServiceDetail.vue` - 服务详情
- 建议接入：`servicesAPI`

#### 4. 房产页面
- `src/views/services/housing/HousingHomePage.vue` - 房产首页
- `src/views/services/housing/HousingNewPage.vue` - 新房页面
- `src/views/services/housing/HousingSecondhandPage.vue` - 二手房页面
- `src/views/services/housing/HousingShopsPage.vue` - 商铺页面
- `src/views/services/housing/RentListPage.vue` - 租房列表
- 建议接入：`housingAPI`, `housingExtendedAPI`

#### 5. 招聘页面
- `src/views/services/jobs/JobsListPage.vue` - 招聘列表
- `src/views/services/jobs/JobsFilterPage.vue` - 招聘筛选
- 建议接入：`jobsAPI`

#### 6. 二手车页面
- `src/views/services/cars/CarsListPage.vue` - 二手车列表
- 建议接入：`carsAPI`

#### 7. 生活分享页面
- `src/views/circles/lifestyle/LifestylePage.vue` - 生活分享
- 建议接入：`lifestyleAPI`

#### 8. 知马圈详情页面
- `src/views/circles/CirclesDetail.vue` - 知马圈详情
- 建议接入：`circlesAPI`

#### 9. 用户发布页面
- `src/views/user/CreatePostPage.vue` - 发布内容
- 建议接入：`postsAPI`, `uploadAPI`

#### 10. 静态页面
- `src/views/common/AboutPage.vue` - 关于我们
- `src/views/common/InviteJoinPage.vue` - 邀请加入
- `src/views/common/StaticPage.vue` - 静态页面
- 建议接入：`staticPagesAPI`

#### 11. 错误页面
- `src/views/error/ErrorPage.vue` - 错误页面
- 建议接入：`commonAPI`

## API使用示例

### 1. 首页数据加载
```javascript
import { homeAPI } from '@/api/home'

// 加载首页数据
const loadHomepageData = async () => {
  try {
    const [bannersRes, recommendedRes, hotRes] = await Promise.all([
      homeAPI.getBanners(),
      homeAPI.getRecommendedContent(),
      homeAPI.getHotContent()
    ])
    
    banners.value = bannersRes.data || []
    recommendedContent.value = recommendedRes.data || []
    hotContent.value = hotRes.data || []
  } catch (error) {
    console.error('加载首页数据失败:', error)
  }
}
```

### 2. 搜索功能
```javascript
import { searchAPI } from '@/api/search'

// 执行搜索
const performSearch = async (keyword) => {
  try {
    const [usersRes, postsRes, servicesRes] = await Promise.all([
      searchAPI.searchUsers({ keyword }),
      searchAPI.searchPosts({ keyword }),
      searchAPI.searchServices({ keyword })
    ])
    
    searchResults.value = {
      users: usersRes.data || [],
      posts: postsRes.data || [],
      services: servicesRes.data || []
    }
    
    // 保存搜索记录
    await searchAPI.saveSearchRecord(keyword)
  } catch (error) {
    console.error('搜索失败:', error)
  }
}
```

### 3. 用户资料加载
```javascript
import { userProfileAPI } from '@/api/user-profile'

// 加载用户数据
const loadUserData = async (userId) => {
  try {
    const [userRes, activitiesRes] = await Promise.all([
      userProfileAPI.getUserInfo(userId),
      userProfileAPI.getUserActivities(userId)
    ])
    
    userInfo.value = userRes.data
    activities.value = activitiesRes.data
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}
```

### 4. 文件上传
```javascript
import { uploadAPI } from '@/api/upload'

// 上传图片
const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await uploadAPI.uploadImage(formData)
    return response.data.url
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}
```

## 错误处理

所有API调用都包含错误处理机制：

1. **网络错误**：自动重试机制
2. **认证错误**：自动跳转登录页
3. **权限错误**：显示权限不足提示
4. **数据错误**：使用模拟数据作为后备
5. **超时错误**：显示超时提示

## 数据格式

### 统一响应格式
```javascript
{
  code: 200,           // 状态码
  message: "success",  // 消息
  data: {},           // 数据
  timestamp: 1234567890
}
```

### 分页数据格式
```javascript
{
  code: 200,
  message: "success",
  data: {
    list: [],         // 数据列表
    total: 100,      // 总数量
    page: 1,         // 当前页
    pageSize: 20,    // 每页数量
    hasMore: true    // 是否有更多
  }
}
```

## 配置说明

### 环境变量
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_UPLOAD_URL=http://localhost:3000/upload
VITE_WS_URL=ws://localhost:3000
```

### 请求拦截器配置
- 自动添加认证token
- 统一错误处理
- 请求/响应日志
- 加载状态管理

## 总结

知马网项目已经为所有主要界面组件预留了完整的API接口，包括：

1. **19个API模块**，涵盖所有业务功能
2. **5个主要组件**已接入API
3. **16个组件**待接入API
4. **统一的错误处理**机制
5. **完整的文档**说明

开发者可以根据实际需求，逐步将模拟数据替换为真实的API调用，实现完整的数据交互功能。
