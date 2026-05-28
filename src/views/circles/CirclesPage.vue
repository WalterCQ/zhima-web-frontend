<!--
  知马圈 - 留学圈增强版
  
  功能特性:
  ✅ WeChat Moments风格扁平化设计（无阴影/发光/hover效果）
  ✅ Facebook风格多反应系统（6种表情：👍❤️😂😮😢😡）
  ✅ 嵌套评论线程（支持回复和多级展示）
  ✅ 话题标签系统（#话题 自动解析和点击）
  ✅ 热门话题侧边栏
  ✅ 改进的时间戳格式（刚刚/X分钟前/昨天/前天）
  ✅ 多种图片网格布局（1/2/3/4/6/9张）
  ✅ 图片懒加载和lightbox预览
  
  设计原则:
  - 简洁扁平的WeChat风格视觉
  - 丰富的Facebook式社交互动
  - 移动优先响应式设计
-->
<template>
  <div class="xiaohongshu-layout" :class="{ collapsing: isCollapsing, expanding: isExpanding }" role="main" aria-label="知马圈内容">
    <!-- 左半屏：可折叠导航 -->
    <aside class="half-nav" :class="{ collapsed: isNavCollapsed }" role="navigation" aria-label="分类导航">
      <div class="half-nav-inner">
        <button 
          class="nav-collapse-btn" 
          @click="toggleNavCollapse" 
          :title="isNavCollapsed ? '展开导航' : '收起导航'"
          :aria-label="isNavCollapsed ? '展开导航' : '收起导航'"
          :aria-expanded="!isNavCollapsed"
        >
          <ChevronLeft class="collapse-icon" :class="{ rotated: isNavCollapsed }" />
        </button>

        <div class="nav-scroll" role="list">
          <!-- 最近访问 -->
          <div class="nav-group recent-group" v-if="recentVisited.length > 0" role="group" aria-label="最近访问">
            <button 
              class="group-header" 
              @click="expandedRecent = !expandedRecent"
              :aria-expanded="expandedRecent"
              :aria-controls="'recent-list'"
            >
              <span class="group-title">最近访问</span>
              <ChevronDown class="group-arrow" :class="{ open: expandedRecent }" />
            </button>
            <div 
              class="recent-list" 
              v-show="expandedRecent"
              id="recent-list"
              role="list"
              aria-label="最近访问列表"
            >
              <div 
                v-for="item in recentVisited"
                :key="item.slug"
                class="recent-item"
                :class="{ active: activeCategory === item.slug }"
                @click="selectSubcategoryFromNav(item.parent, item.slug)"
                role="listitem"
                :aria-current="activeCategory === item.slug ? 'page' : undefined"
                tabindex="0"
                @keydown.enter="selectSubcategoryFromNav(item.parent, item.slug)"
                @keydown.space.prevent="selectSubcategoryFromNav(item.parent, item.slug)"
              >
                <span class="recent-name">{{ item.name }}</span>
              </div>
            </div>
          </div>

          <!-- 主分组：生活圈 / 留学圈 / 投资圈（默认展开，可折叠） -->
          <div 
            class="nav-group" 
            v-for="group in mainGroups" 
            :key="group.slug"
            role="group"
            :aria-label="group.name"
          >
            <button 
              class="group-header" 
              @click="toggleGroup(group.slug)"
              :aria-expanded="expandedGroups[group.slug]"
              :aria-controls="`group-${group.slug}`"
            >
              <span class="group-title">{{ group.name }}</span>
              <ChevronDown class="group-arrow" :class="{ open: expandedGroups[group.slug] }" />
            </button>
            <div 
              class="group-body" 
              v-show="expandedGroups[group.slug]"
              :id="`group-${group.slug}`"
              role="list"
              :aria-label="`${group.name}分类列表`"
            >
              <div 
                v-for="sub in groupCategories[group.slug]"
                :key="sub.slug"
                 class="recent-item"
                :class="{ active: activeCategory === sub.slug }"
                @click.stop="selectSubcategoryFromNav(group.slug, sub.slug)"
                 role="listitem"
                 :aria-current="activeCategory === sub.slug ? 'page' : undefined"
                 tabindex="0"
                 @keydown.enter="selectSubcategoryFromNav(group.slug, sub.slug)"
                 @keydown.space.prevent="selectSubcategoryFromNav(group.slug, sub.slug)"
               >
                 <img 
                   v-if="group.slug === 'study'"
                   :src="$getImageUrl(sub.image)" 
                   :alt="sub.name" 
                   class="recent-thumb" 
                   loading="lazy"
                   decoding="async"
                 />
                 <span class="recent-name">{{ sub.name }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </aside>

    <!-- 右半屏：小红书内容（导航折叠时全屏） -->
    <section class="right-content" :class="{ full: isNavCollapsed }" role="region" aria-label="内容展示区">
      <div class="content-area">
        <template v-if="!isStudyMode">
          <div class="waterfall-container" role="grid" aria-label="内容瀑布流">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id"
              class="post-card"
              :style="{ 'view-transition-name': 'post-card-' + post.id }"
              @click="openPostDetail(post)"
              role="gridcell"
              tabindex="0"
              @keydown.enter="openPostDetail(post)"
              @keydown.space.prevent="openPostDetail(post)"
              :aria-label="`查看${post.title}的详情`"
            >
              <div class="post-image">
                <img 
                  :data-src="post.cover_image" 
                  :alt="post.title" 
                  :style="{ 'view-transition-name': 'post-media-' + post.id }"
                  loading="lazy"
                  decoding="async"
                  class="lazy-image"
                >
                <div class="image-overlay" v-if="post.type === 'video'" aria-label="视频内容">
                  <Play class="play-icon" />
                </div>
              </div>
              <div class="post-content">
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-footer">
                  <div class="author-info">
                    <img 
                      :data-src="post.author.avatar" 
                      :alt="post.author.nickname" 
                      class="author-avatar lazy-image clickable"
                      loading="lazy"
                      decoding="async"
                      @click.stop="goToUser(post.author.id)"
                    >
                    <span class="author-name clickable" @click.stop="goToUser(post.author.id)">{{ post.author.nickname }}</span>
                  </div>
                  <div class="post-stats" role="group" aria-label="互动统计">
                    <span class="stat-item" aria-label="点赞数">
                      <Heart class="stat-icon" />
                      {{ post.likes_count > 0 ? formatCountCn(post.likes_count) : '点赞' }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
            
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-indicator" role="status" aria-label="正在加载更多内容">
              <div class="loading-spinner"></div>
              <span class="loading-text">加载中...</span>
            </div>
            
            <!-- 没有更多内容 -->
            <div v-if="!hasMore && filteredPosts.length > 0" class="no-more-content" role="status" aria-label="已加载全部内容">
              <span class="no-more-text">没有更多内容了</span>
            </div>
          </div>
        </template>
        <template v-else>
            <div v-if="isNavCollapsed" class="study-collapsed-layout">
            <aside class="study-left-filter">
              <div class="filter-card">
              <div class="filter-title"><ListFilter class="title-icon" /> 排序</div>
            <div class="filter-list">
              <button 
                v-for="opt in studySortOptions" 
                :key="opt.value" 
                class="filter-item" 
                :class="{ active: studySort === opt.value }" 
                @click="studySort = opt.value"
              >
                <component :is="sortIcons[opt.value]" class="filter-icon" />
                {{ opt.label }}
              </button>
            </div>
              </div>
            </aside>
            <div class="services-list moments-style wide-center">
              <!-- 话题筛选提示 -->
              <div v-if="selectedHashtag" class="hashtag-filter-banner">
                <div class="filter-info">
                  <span class="filter-icon">#</span>
                  <span class="filter-text">正在筛选话题：<strong>{{ selectedHashtag }}</strong></span>
                  <span class="filter-count">（找到 {{ sortedStudyPosts.length }} 条相关内容）</span>
                </div>
                <button class="clear-filter-btn" @click="clearHashtagFilter">
                  <X :size="16" />
                  <span>清除筛选</span>
                </button>
              </div>
              
              <div 
                v-for="service in sortedStudyPosts" 
                :key="service.id"
                class="moment-item"
                :data-post-id="service.id"
              >
              <div class="moment-header">
                <img 
                  :src="service.provider.avatar || 'https://picsum.photos/40/40?random=37'" 
                  :alt="service.provider.name"
                  class="moment-avatar clickable"
                  @click="goToUser(service.provider.id)"
                />
                <div class="moment-all-content">
                  <div class="moment-username clickable" @click="goToUser(service.provider.id)">{{ service.provider.name }}</div>
                  <div class="moment-content">
                    <div class="service-title">{{ service.title }}</div>
                    <div class="content-text" :class="{ collapsed: service.isCollapsed && isStudyContentLong(service) }">
                      <span class="service-description" v-html="parseHashtags(service.description)"></span>
                    </div>
                    <button 
                      v-if="isStudyContentLong(service)" 
                      class="expand-btn"
                      @click="toggleStudyContent(service.id)"
                    >
                      {{ service.isCollapsed ? '展开' : '收起' }}
                    </button>
                  </div>

                  <div 
                    v-if="service.images && service.images.length > 0" 
                    :class="getStudyImageGridClass(service.images.length)"
                  >
                    <div 
                      v-for="(image, index) in service.images.slice(0, 9)" 
                      :key="index"
                      class="moment-image-wrapper"
                      @click="previewImage(service.images, index)"
                    >
                      <img 
                        :src="image"
                        class="moment-image"
                        :alt="`图片${index + 1}`"
                      />
                      <div 
                        v-if="index === 8 && service.images.length > 9" 
                        class="more-images-overlay"
                      >
                        +{{ service.images.length - 9 }}
                      </div>
                    </div>
                  </div>

                  <div class="moment-location" v-if="service.location">
                    <MapPin class="location-icon" />
                    {{ service.location }}
                  </div>
                  <div class="moment-time">{{ formatPostTime(service.created_at) }}</div>

                  <div class="moment-actions">
                    <div class="reaction-wrapper">
                      <button 
                        class="action-btn like-btn"
                        :class="{ reacted: getUserReaction(service.id) }"
                        @click="toggleReactionPicker(service.id)"
                      >
                        <template v-if="getUserReaction(service.id)">
                          <span class="reaction-emoji">{{ getUserReaction(service.id).emoji }}</span>
                          <span>{{ getUserReaction(service.id).label }}</span>
                        </template>
                        <template v-else>
                          <ThumbsUp class="action-icon" />
                          <span>点赞</span>
                        </template>
                      </button>
                      
                      <!-- Reaction Picker -->
                      <div v-if="showReactionPicker[service.id]" class="reaction-picker" @click.stop>
                        <button
                          v-for="reaction in reactionTypes"
                          :key="reaction.type"
                          class="reaction-option"
                          :class="{ selected: userReactions[service.id] === reaction.type }"
                          @click="selectReaction(service.id, reaction.type)"
                          :title="reaction.label"
                        >
                          <span class="reaction-emoji-large">{{ reaction.emoji }}</span>
                        </button>
                      </div>
                      
                      <!-- Reaction Summary -->
                      <div v-if="getReactionSummary(service.id)" class="reaction-summary">
                        {{ getReactionSummary(service.id) }}
                      </div>
                    </div>
                    
                    <button class="action-btn comment-btn" @click="toggleStudyComments(service.id)">
                      <MessageCircle class="action-icon" />
                      {{ service.commentsCount || '评论' }}
                    </button>
                    <button 
                      class="action-btn favorite-btn"
                      :class="{ active: isStudyFavorited(service.id) }"
                      @click="toggleStudyFavorite(service.id)"
                    >
                      <Bookmark class="action-icon" :class="{ filled: isStudyFavorited(service.id) }" />
                      {{ isStudyFavorited(service.id) ? '已收藏' : '收藏' }}
                    </button>
                    <button class="action-btn share-btn" @click="shareStudyPost(service.id)">
                      <Share2 class="action-icon" />
                      分享
                    </button>
                  </div>

                  <!-- 评论区：展开后显示 -->
                  <div v-if="isStudyCommentsOpen(service.id)" class="moment-comments">
                    <div v-if="getStudyComments(service.id).length" class="comments-list">
                      <div 
                        v-for="(comment, cIdx) in getStudyComments(service.id)"
                        :key="cIdx"
                        class="comment-thread"
                      >
                        <div class="comment-item">
                          <span class="comment-user">{{ comment.user }}</span>
                          <span class="comment-text">: {{ comment.text }}</span>
                          <button class="reply-btn" @click="startReply(service.id, cIdx)">回复</button>
                        </div>
                        
                        <!-- 嵌套回复 -->
                        <div v-if="comment.replies && comment.replies.length" class="replies-list">
                          <div 
                            v-for="(reply, rIdx) in comment.replies"
                            :key="rIdx"
                            class="reply-item"
                          >
                            <span class="comment-user">{{ reply.user }}</span>
                            <span class="comment-text">: {{ reply.text }}</span>
                          </div>
                        </div>
                        
                        <!-- 回复输入框 -->
                        <div v-if="isReplying(service.id, cIdx)" class="reply-input-area">
                          <input 
                            v-model="studyNewReplies[`${service.id}_${cIdx}`]"
                            class="comment-input"
                            :placeholder="`回复 ${comment.user}...`"
                            @keyup.enter="addReply(service.id, cIdx)"
                          />
                          <button 
                            class="send-comment-btn"
                            @click="addReply(service.id, cIdx)"
                            :disabled="!studyNewReplies[`${service.id}_${cIdx}`]"
                          >
                            发送
                          </button>
                          <button class="cancel-reply-btn" @click="cancelReply(service.id)">
                            取消
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-comments-tip">
                      <div class="tip-icon">
                        <MessageCircle :size="24" />
                      </div>
                      <div class="tip-text">还没有评论，来说两句吧~</div>
                    </div>

                    <div class="comment-input-area">
                      <input 
                        v-model="studyNewComments[service.id]"
                        class="comment-input"
                        placeholder="写评论..."
                        @keyup.enter="addStudyComment(service.id)"
                      />
                      <button 
                        class="send-comment-btn"
                        @click="addStudyComment(service.id)"
                        :disabled="!studyNewComments[service.id]"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <aside class="study-right-hot">
              <!-- 热门话题 -->
              <div class="trending-hashtags">
                <div class="section-title">
                  <span>#</span>
                  <span>热门话题</span>
                </div>
                <div class="hashtag-list">
                  <div 
                    v-for="(item, idx) in trendingHashtags"
                    :key="idx"
                    class="hashtag-item"
                    :class="{ active: selectedHashtag === item.tag }"
                    @click="handleHashtagClick(item.tag)"
                  >
                    <span class="hashtag-name">#{{ item.tag }}</span>
                    <span class="hashtag-count">{{ item.count }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 热榜 -->
              <div class="hot-widget">
                <div class="hot-header">
                  <div class="hot-title"><Flame class="hot-icon" /> 热榜</div>
                </div>
                <div class="hot-list">
                  <div 
                    v-for="(item, idx) in studyHotPosts" 
                    :key="item.id" 
                    class="hot-item"
                    @click="scrollToStudyPost(item.id)"
                  >
                    <span class="hot-rank" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
                    <span class="hot-text">{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </aside>
            </div>
          <div v-else class="services-list moments-style">
            <div 
              v-for="service in sortedStudyPosts" 
              :key="service.id"
              class="moment-item"
              :data-post-id="service.id"
            >
              <div class="moment-header">
                <img 
                  :src="service.provider.avatar || 'https://picsum.photos/40/40?random=37'" 
                  :alt="service.provider.name"
                  class="moment-avatar clickable"
                  @click="goToUser(service.provider.id)"
                />
                <div class="moment-all-content">
                  <div class="moment-username clickable" @click="goToUser(service.provider.id)">{{ service.provider.name }}</div>
                  <div class="moment-content">
                    <div class="service-title">{{ service.title }}</div>
                    <div class="content-text" :class="{ collapsed: service.isCollapsed && isStudyContentLong(service) }">
                      <span class="service-description" v-html="parseHashtags(service.description)"></span>
                    </div>
                    <button 
                      v-if="isStudyContentLong(service)" 
                      class="expand-btn"
                      @click="toggleStudyContent(service.id)"
                    >
                      {{ service.isCollapsed ? '展开' : '收起' }}
                    </button>
                  </div>

                  <div 
                    v-if="service.images && service.images.length > 0" 
                    :class="getStudyImageGridClass(service.images.length)"
                  >
                    <div 
                      v-for="(image, index) in service.images.slice(0, 9)" 
                      :key="index"
                      class="moment-image-wrapper"
                      @click="previewImage(service.images, index)"
                    >
                      <img 
                        :src="image"
                        class="moment-image"
                        :alt="`图片${index + 1}`"
                      />
                      <div 
                        v-if="index === 8 && service.images.length > 9" 
                        class="more-images-overlay"
                      >
                        +{{ service.images.length - 9 }}
                      </div>
                    </div>
                  </div>

                  <div class="moment-location" v-if="service.location">
                    <MapPin class="location-icon" />
                    {{ service.location }}
                  </div>
                  <div class="moment-time">{{ formatPostTime(service.created_at) }}</div>

                  <div class="moment-actions">
                    <div class="reaction-wrapper">
                      <button 
                        class="action-btn like-btn"
                        :class="{ reacted: getUserReaction(service.id) }"
                        @click="toggleReactionPicker(service.id)"
                      >
                        <template v-if="getUserReaction(service.id)">
                          <span class="reaction-emoji">{{ getUserReaction(service.id).emoji }}</span>
                          <span>{{ getUserReaction(service.id).label }}</span>
                        </template>
                        <template v-else>
                          <ThumbsUp class="action-icon" />
                          <span>点赞</span>
                        </template>
                      </button>
                      
                      <!-- Reaction Picker -->
                      <div v-if="showReactionPicker[service.id]" class="reaction-picker" @click.stop>
                        <button
                          v-for="reaction in reactionTypes"
                          :key="reaction.type"
                          class="reaction-option"
                          :class="{ selected: userReactions[service.id] === reaction.type }"
                          @click="selectReaction(service.id, reaction.type)"
                          :title="reaction.label"
                        >
                          <span class="reaction-emoji-large">{{ reaction.emoji }}</span>
                        </button>
                      </div>
                      
                      <!-- Reaction Summary -->
                      <div v-if="getReactionSummary(service.id)" class="reaction-summary">
                        {{ getReactionSummary(service.id) }}
                      </div>
                    </div>
                    
                    <button class="action-btn comment-btn" @click="toggleStudyComments(service.id)">
                      <MessageCircle class="action-icon" />
                      {{ service.commentsCount || '评论' }}
                    </button>
                    <button 
                      class="action-btn favorite-btn"
                      :class="{ active: isStudyFavorited(service.id) }"
                      @click="toggleStudyFavorite(service.id)"
                    >
                      <Bookmark class="action-icon" :class="{ filled: isStudyFavorited(service.id) }" />
                      {{ isStudyFavorited(service.id) ? '已收藏' : '收藏' }}
                    </button>
                    <button class="action-btn share-btn" @click="shareStudyPost(service.id)">
                      <Share2 class="action-icon" />
                      分享
                    </button>
                  </div>

                  <!-- 评论区：展开后显示 -->
                  <div v-if="isStudyCommentsOpen(service.id)" class="moment-comments">
                    <div v-if="getStudyComments(service.id).length" class="comments-list">
                      <div 
                        v-for="(comment, cIdx) in getStudyComments(service.id)"
                        :key="cIdx"
                        class="comment-thread"
                      >
                        <div class="comment-item">
                          <span class="comment-user">{{ comment.user }}</span>
                          <span class="comment-text">: {{ comment.text }}</span>
                          <button class="reply-btn" @click="startReply(service.id, cIdx)">回复</button>
                        </div>
                        
                        <!-- 嵌套回复 -->
                        <div v-if="comment.replies && comment.replies.length" class="replies-list">
                          <div 
                            v-for="(reply, rIdx) in comment.replies"
                            :key="rIdx"
                            class="reply-item"
                          >
                            <span class="comment-user">{{ reply.user }}</span>
                            <span class="comment-text">: {{ reply.text }}</span>
                          </div>
                        </div>
                        
                        <!-- 回复输入框 -->
                        <div v-if="isReplying(service.id, cIdx)" class="reply-input-area">
                          <input 
                            v-model="studyNewReplies[`${service.id}_${cIdx}`]"
                            class="comment-input"
                            :placeholder="`回复 ${comment.user}...`"
                            @keyup.enter="addReply(service.id, cIdx)"
                          />
                          <button 
                            class="send-comment-btn"
                            @click="addReply(service.id, cIdx)"
                            :disabled="!studyNewReplies[`${service.id}_${cIdx}`]"
                          >
                            发送
                          </button>
                          <button class="cancel-reply-btn" @click="cancelReply(service.id)">
                            取消
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-comments-tip">
                      <div class="tip-icon">
                        <MessageCircle :size="24" />
                      </div>
                      <div class="tip-text">还没有评论，来说两句吧~</div>
                    </div>

                    <div class="comment-input-area">
                      <input 
                        v-model="studyNewComments[service.id]"
                        class="comment-input"
                        placeholder="写评论..."
                        @keyup.enter="addStudyComment(service.id)"
                      />
                      <button 
                        class="send-comment-btn"
                        @click="addStudyComment(service.id)"
                        :disabled="!studyNewComments[service.id]"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- 图片预览弹窗（留学圈） -->
    <div v-if="imagePreview.show" class="modal-overlay image-preview-overlay" @click="closeImagePreview">
      <div class="image-preview-modal" @click.stop>
        <button class="image-preview-close" @click="closeImagePreview">
          <Plus style="transform: rotate(45deg); width: 24px; height: 24px;" />
        </button>
        <div class="image-preview-main">
          <img 
            :src="imagePreview.images[imagePreview.currentIndex]" 
            :alt="`图片 ${imagePreview.currentIndex + 1}`"
            class="preview-image"
          />
        </div>
        <button 
          v-if="imagePreview.images.length > 1 && imagePreview.currentIndex > 0"
          class="image-nav-btn prev-btn"
          @click="prevImage"
        >
          <ChevronDown style="transform: rotate(90deg); width: 24px; height: 24px;" />
        </button>
        <button 
          v-if="imagePreview.images.length > 1 && imagePreview.currentIndex < imagePreview.images.length - 1"
          class="image-nav-btn next-btn"
          @click="nextImage"
        >
          <ChevronDown style="transform: rotate(-90deg); width: 24px; height: 24px;" />
        </button>
        <div v-if="imagePreview.images.length > 1" class="image-preview-thumbs">
          <div 
            v-for="(image, index) in imagePreview.images" 
            :key="index"
            class="thumb-item"
            :class="{ active: index === imagePreview.currentIndex }"
            @click="goToImage(index)"
          >
            <img :src="image" :alt="`缩略图 ${index + 1}`" />
          </div>
        </div>
      </div>
    </div>

    <!-- 折叠态：悬浮胶囊按钮（毛玻璃） -->
    <button 
      v-if="isNavCollapsed" 
      class="floating-capsule-btn" 
      ref="capsuleBtnRef"
      @mouseenter="onCapsuleEnter"
      @mouseleave="onCapsuleLeave"
      title="展开导航"
    >
      <span class="capsule-icon-wrap" @click.stop="openHalfNav">
        <Menu class="capsule-icon" />
      </span>
      <div class="capsule-extra" :class="{ show: capsuleHover }" @click.stop="toggleCapsuleDropdown">
        <img :src="currentEntryImage" alt="当前栏目" class="capsule-thumb" />
        <span class="capsule-label">{{ currentEntryName }}</span>
        <ChevronDown class="capsule-caret" :size="18" :class="{ open: showCapsuleDropdown }" />
      </div>
    </button>

    <!-- 胶囊下拉：当前分组所有子栏目 -->
    <div 
      v-if="showCapsuleDropdown && isNavCollapsed" 
      class="capsule-dropdown" 
      :style="capsuleDropdownStyle"
      @mouseenter="capsuleHover = true" 
      @mouseleave="closeCapsuleDropdown"
    >
      <div class="capsule-dropdown-header">{{ currentGroupTitle }} - 全部栏目</div>
      <div class="capsule-dropdown-list">
        <div 
          v-for="sub in currentGroupCategories" 
          :key="sub.slug" 
          class="capsule-dropdown-item" 
          :class="{ active: activeCategory === sub.slug }"
          @click="selectSubcategoryFromNav(currentGroupType, sub.slug); closeCapsuleDropdown()"
        >
          <img v-if="currentGroupType === 'study'" :src="$getImageUrl(sub.image)" :alt="sub.name" />
          <span>{{ sub.name }}</span>
        </div>
      </div>
    </div>

    <!-- 发布对话框 -->
    <el-dialog 
      v-model="showPublishDialog" 
      title="发布笔记" 
      width="600px"
      :before-close="handleClosePublish"
    >
      <div class="publish-form">
        <div class="image-upload-area">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            multiple
            :limit="9"
            :file-list="uploadedImages"
            :on-change="handleImageUpload"
            accept="image/*"
          >
            <Upload class="upload-icon" />
            <div class="upload-text">
              <div class="upload-title">点击或拖拽上传图片</div>
              <div class="upload-subtitle">最多上传9张图片</div>
            </div>
          </el-upload>
        </div>
        
        <div class="form-fields">
          <el-input
            v-model="publishForm.title"
            placeholder="分享一个好物/好地方..."
            maxlength="20"
            show-word-limit
            class="title-input"
          />
          
          <el-input
            v-model="publishForm.content"
            type="textarea"
            placeholder="分享你的生活瞬间..."
            :rows="4"
            maxlength="1000"
            show-word-limit
            class="content-input"
          />
          
          <div class="form-row">
            <el-select v-model="publishForm.category" placeholder="选择分类" class="category-select">
              <el-option 
                v-for="category in categories.filter(c => c.slug !== 'recommend')" 
                :key="category.slug"
                :label="category.name" 
                :value="category.slug"
              />
            </el-select>
            
            <el-input
              v-model="publishForm.location"
              placeholder="添加位置"
              class="location-input"
            >
              <template #prefix>
                <MapPin class="location-icon" />
              </template>
            </el-input>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPublish" :loading="publishing" class="ripple-effect glow-on-hover">
            {{ publishing ? '发布中...' : '发布' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 小红书风格详情弹窗 -->
    <el-dialog 
      v-model="showPostDetail" 
      width="70%"
      :show-close="false"
      :modal="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="xiaohongshu-dialog"
      @close="closePostDetail"
    >
      <!-- 外部关闭按钮 -->
      <button v-if="showPostDetail" class="close-btn-outside" @click="closePostDetail">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="xiaohongshu-content" v-if="selectedPost">
        <!-- 左侧媒体区域 (60%) -->
        <div class="media-section">
          <div class="media-container">
            <img 
              :src="selectedPost.cover_image" 
              :alt="selectedPost.title"
              class="media-item"
            >
            <div class="media-nav" v-if="selectedPost.images && selectedPost.images.length > 1">
              <button class="nav-btn prev-btn">‹</button>
              <button class="nav-btn next-btn">›</button>
            </div>
            <div class="media-indicator" v-if="selectedPost.images && selectedPost.images.length > 1">
              1/{{ selectedPost.images.length }}
            </div>
          </div>
        </div>

        <!-- 右侧信息区域 (40%) -->
        <div class="info-section">
          <!-- 顶部用户信息 -->
          <div class="user-header">
            <div class="user-info">
              <img :src="$getImageUrl(selectedPost.author.avatar)" :alt="selectedPost.author.nickname" class="user-avatar clickable" @click="goToUser(selectedPost.author.id)">
              <span class="user-name clickable" @click="goToUser(selectedPost.author.id)">{{ selectedPost.author.nickname }}</span>
            </div>
            <button class="follow-btn">关注</button>
          </div>

          <!-- 内容主体 -->
          <div class="content-body">
            <!-- 标题和内容 -->
            <div class="text-content">
              <h3 class="post-title">{{ selectedPost.title }}</h3>
              <p class="post-description">
                这是一个精彩的内容描述，介绍了这篇笔记的详细信息。包含了作者的心得体会、使用技巧和推荐理由等等内容。
              </p>
            </div>

            <!-- 标签 -->
            <div class="tags-section">
              <span class="content-tag">#{{ selectedPost.category }}</span>
              <span class="content-tag">#生活分享</span>
              <span class="content-tag">#推荐</span>
            </div>

            <!-- 时间地点 -->
            <div class="meta-info">
              <span class="publish-time">{{ formatPostTime(selectedPost.created_at) }}</span>
              <span class="location">📍 马来西亚</span>
            </div>

            <!-- 互动数据 -->
            <div class="engagement-stats">
              <div class="stat-group">
                <Heart class="stat-icon" :class="{ liked: selectedPost.is_liked }" />
                <span class="stat-count">{{ selectedPost.likes_count }}</span>
              </div>
              <div class="stat-group">
                <span class="stat-count">{{ Math.floor(Math.random() * 1000) }} 浏览</span>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-area">
            <div class="xhs-action-bar">
              <button class="xhs-action">
                <Heart class="xhs-icon" />
                <span>赞</span>
              </button>
              <button class="xhs-action">
                <MessageCircle class="xhs-icon" />
                <span>评论</span>
              </button>
              <button class="xhs-action">
                <Bookmark class="xhs-icon" />
                <span>收藏</span>
              </button>
              <button class="xhs-action">
                <Share2 class="xhs-icon" />
                <span>分享</span>
              </button>
            </div>

            <div class="comments-header">
              <span class="comments-title">共 {{ Math.floor(Math.random() * 50) }} 条评论</span>
            </div>
            
            <div class="comments-list">
              <div v-for="i in 2" :key="i" class="comment-item">
                <img :src="`https://api.dicebear.com/7.x/avatars/svg?seed=comment${i}`" :alt="`用户${i}`" class="comment-avatar">
                <div class="comment-body">
                  <div class="comment-meta">
                    <span class="comment-author">柯基吃烤鱼</span>
                    <span class="comment-time">08-21 广东</span>
                  </div>
                  <p class="comment-text">{{ i === 1 ? '上衣链接😘😘' : '龙脸' }}</p>
                  <div class="comment-actions">
                    <button class="comment-action">
                      <Heart class="action-icon" />
                      <span>赞</span>
                    </button>
                    <button class="comment-action">回复</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论输入 -->
            <div class="comment-composer">
              <span class="login-prompt">登录后评论</span>
              <div class="comment-tools">
                <button class="tool-btn">
                  <Heart class="tool-icon" />
                  <span>1千+</span>
                </button>
                <button class="tool-btn">
                  <svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>1千+</span>
                </button>
                <button class="tool-btn">
                  <span>10+</span>
                </button>
                <button class="tool-btn">
                  <svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 发布按钮 - 独立于导航栏，始终可见 -->
    <PublishButton 
      :show-text="true"
      @click="goToGlobalPublish"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Search, Heart, Play, Upload, MapPin, Plus,
  Palette, Camera, ShoppingBag, Car, Dumbbell, Music,
  Bookmark, MessageCircle, Share2, ChevronDown, X,
  Menu, ChevronLeft, Clock, Star, ListFilter, Flame, ThumbsUp
} from 'lucide-vue-next'
import PublishButton from '@/components/PublishButton.vue'
import { ElMessage } from 'element-plus'
import { formatNumber } from '@/utils'
import { circlesAPI } from '@/api/circles'
import { postsAPI } from '@/api/posts'

const router = useRouter()
const route = useRoute()

// 响应式数据
const activeCategory = ref('recommend')

function syncGroupFromRoute() {
  const group = route?.query?.group
  if (group === 'study') {
    activeCategory.value = 'study'
  }
}

onMounted(syncGroupFromRoute)
watch(() => route.query.group, syncGroupFromRoute)
const searchKeyword = ref('')
const showPublishDialog = ref(false)
const publishing = ref(false)
const uploadedImages = ref([])
const allPosts = ref([])

// 无限滚动相关
const isLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPosts = ref(0)

// 左半屏导航/折叠
const isNavCollapsed = ref(false)
const isCollapsing = ref(false)
const isExpanding = ref(false)
const expandedGroups = ref({ lifestyle: true, study: true, investment: true })
const capsuleHover = ref(false)
const showCapsuleDropdown = ref(false)
const capsuleBtnRef = ref(null)
const capsuleDropdownStyle = computed(() => {
  const btn = capsuleBtnRef.value
  if (!btn) return {}
  try {
    const rect = btn.getBoundingClientRect()
    const top = rect.bottom + 8
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - 332))
    return { top: `${top}px`, left: `${left}px`, position: 'fixed' }
  } catch { return {} }
})
const expandedRecent = ref(true)

function onCapsuleEnter() { capsuleHover.value = true }
function onCapsuleLeave() { capsuleHover.value = false }

const categoriesContainer = ref(null)
const categoryLine = ref(null)
const categoryRefs = ref([])
const lineStyle = ref({ transform: 'translateX(0px)', width: '0px', opacity: 0 })
const activeIndex = ref(0)
const showDropdown = ref(false)
const activeDropdownType = ref('')
const persistentDropdown = ref(false)
let dropdownTimeout = null
let removeDocClick = null

// 发布表单
const publishForm = ref({
  title: '',
  content: '',
  category: '',
  location: '',
  images: []
})

// 分类配置（主分组 + 子分类）
const categories = [
  { name: '推荐', slug: 'recommend' },
  { name: '生活圈', slug: 'lifestyle', hasDropdown: true },
  { name: '留学圈', slug: 'study', hasDropdown: true },
  { name: '投资圈', slug: 'investment', hasDropdown: true }
]
const mainGroups = [
  { name: '生活圈', slug: 'lifestyle' },
  { name: '留学圈', slug: 'study' },
  { name: '投资圈', slug: 'investment' }
]

// 生活圈子分类配置
const lifestyleCategories = [
  { name: '生活分享', slug: 'life', image: 'https://picsum.photos/200/200?random=38' },
  { name: '文化艺术', slug: 'culture', image: 'https://picsum.photos/200/200?random=39' },
  { name: '时尚美妆', slug: 'fashion', image: 'https://picsum.photos/200/200?random=40' },
  { name: '日常生活', slug: 'daily', image: 'https://picsum.photos/200/200?random=41' },
  { name: '美食推荐', slug: 'food', image: 'https://picsum.photos/200/200?random=42' },
  { name: '运动健身', slug: 'fitness', image: 'https://picsum.photos/200/200?random=43' },
  { name: '情感心理', slug: 'emotion', image: 'https://picsum.photos/200/200?random=44' },
  { name: '旅行游记', slug: 'travel', image: 'https://picsum.photos/200/200?random=45' },
  { name: '科技数码', slug: 'tech', image: 'https://picsum.photos/200/200?random=46' }
]

// 留学圈子分类配置
const studyCategories = [
  { name: 'UM', slug: 'um', image: 'https://picsum.photos/200/200?random=47' },
  { name: 'XMUM', slug: 'xmum', image: 'https://picsum.photos/200/200?random=48' },
  { name: 'USM', slug: 'usm', image: 'https://picsum.photos/200/200?random=49' },
  { name: 'UKM', slug: 'ukm', image: 'https://picsum.photos/200/200?random=50' },
  { name: 'UPM', slug: 'upm', image: 'https://picsum.photos/200/200?random=51' },
  { name: 'UTM', slug: 'utm', image: 'https://picsum.photos/200/200?random=52' },
  { name: 'UTP', slug: 'utp', image: 'https://picsum.photos/200/200?random=53' },
  { name: 'MMU', slug: 'mmu', image: 'https://picsum.photos/200/200?random=54' },
  { name: 'TAYLOR', slug: 'taylor', image: 'https://picsum.photos/200/200?random=55' },
  { name: 'SUNWAY', slug: 'sunway', image: 'https://picsum.photos/200/200?random=56' },
  { name: 'UTAR', slug: 'utar', image: 'https://picsum.photos/200/200?random=57' },
  { name: 'INTI', slug: 'inti', image: 'https://picsum.photos/200/200?random=58' },
  { name: 'HELP', slug: 'help', image: 'https://picsum.photos/200/200?random=59' },
  { name: 'APU', slug: 'apu', image: 'https://picsum.photos/200/200?random=60' },
  { name: 'LKW', slug: 'limkokwing', image: 'https://picsum.photos/200/200?random=61' },
  { name: 'CURTIN', slug: 'curtin', image: 'https://picsum.photos/200/200?random=62' },
  { name: 'MONASH', slug: 'monash', image: 'https://picsum.photos/200/200?random=63' },
  { name: 'UNM', slug: 'nottingham', image: 'https://picsum.photos/200/200?random=64' },
  { name: 'HWU', slug: 'heriot', image: 'https://picsum.photos/200/200?random=65' },
  { name: 'SEGI', slug: 'segi', image: 'https://picsum.photos/200/200?random=66' },
  { name: 'KDU', slug: 'kdu', image: 'https://picsum.photos/200/200?random=67' }
]

// 投资圈子分类配置
const investmentCategories = [
  { name: '股票投资', slug: 'stocks', image: 'https://picsum.photos/200/200?random=68' },
  { name: '加密货币', slug: 'crypto', image: 'https://picsum.photos/200/200?random=69' },
  { name: '房产投资', slug: 'property', image: 'https://picsum.photos/200/200?random=70' },
  { name: '外汇交易', slug: 'forex', image: 'https://picsum.photos/200/200?random=71' },
  { name: '基金理财', slug: 'fund', image: 'https://picsum.photos/200/200?random=72' },
  { name: '黄金投资', slug: 'gold', image: 'https://picsum.photos/200/200?random=73' },
  { name: '债券投资', slug: 'bond', image: 'https://picsum.photos/200/200?random=74' },
  { name: '创业投资', slug: 'startup', image: 'https://picsum.photos/200/200?random=75' },
  { name: 'ETF基金', slug: 'etf', image: 'https://picsum.photos/200/200?random=76' }
]

// 左侧导航使用的分组→子分类映射
const groupCategories = {
  lifestyle: lifestyleCategories,
  study: studyCategories,
  investment: investmentCategories
}

// 最近访问（本地持久化）
const RECENT_KEY = 'circles:recentVisited'
const recentVisited = ref([]) // { name, slug, image, parent }

// 计算属性
const filteredPosts = computed(() => {
  if (activeCategory.value === 'recommend') {
    return allPosts.value
  }
  if (activeCategory.value === 'lifestyle') {
    const lifestyleSlugs = lifestyleCategories.map(cat => cat.slug)
    return allPosts.value.filter(post => lifestyleSlugs.includes(post.category))
  }
  if (activeCategory.value === 'study') {
    const studySlugs = studyCategories.map(cat => cat.slug)
    return allPosts.value.filter(post => studySlugs.includes(post.category))
  }
  if (activeCategory.value === 'investment') {
    const investmentSlugs = investmentCategories.map(cat => cat.slug)
    return allPosts.value.filter(post => investmentSlugs.includes(post.category))
  }
  return allPosts.value.filter(post => post.category === activeCategory.value)
})

// 获取当前活动的圈子分类（用于胶囊下拉）
const getCurrentCategories = computed(() => {
  switch (activeDropdownType.value) {
    case 'lifestyle':
      return lifestyleCategories
    case 'study':
      return studyCategories
    case 'investment':
      return investmentCategories
    default:
      return []
  }
})

// 当前子分类所在分组
const currentGroupType = computed(() => {
  if (['lifestyle', 'study', 'investment'].includes(activeCategory.value)) return activeCategory.value
  const slug = activeCategory.value
  if (lifestyleCategories.some(c => c.slug === slug)) return 'lifestyle'
  if (studyCategories.some(c => c.slug === slug)) return 'study'
  if (investmentCategories.some(c => c.slug === slug)) return 'investment'
  return 'lifestyle'
})

const currentGroupTitle = computed(() => {
  const map = { lifestyle: '生活圈', study: '留学圈', investment: '投资圈' }
  return map[currentGroupType.value]
})

const currentGroupCategories = computed(() => groupCategories[currentGroupType.value] || [])

const currentEntry = computed(() => {
  // 胶囊展示当前栏目（若为大类，取第一个子栏目；若为子栏目，取自身）
  const group = currentGroupType.value
  const list = groupCategories[group] || []
  if (['lifestyle', 'study', 'investment'].includes(activeCategory.value)) {
    return list[0] || { name: currentGroupTitle.value, image: 'https://picsum.photos/200/200?random=77' }
  }
  const found = list.find(i => i.slug === activeCategory.value)
  return found || { name: currentGroupTitle.value, image: 'https://picsum.photos/200/200?random=78' }
})

const currentEntryName = computed(() => currentEntry.value?.name || '栏目')
const currentEntryImage = computed(() => currentEntry.value?.image || 'https://picsum.photos/200/200?random=79')

// 方法
// 中文计数显示：10+ / 1千+ / 1万+
const formatCountCn = (num) => {
  const n = Number(num || 0)
  if (n <= 0) return ''
  if (n >= 10000) return Math.floor(n / 10000) + '万+'
  if (n >= 1000) return Math.floor(n / 1000) + '千+'
  return n + '+'
}

// 加载更多数据
const loadMorePosts = async () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  try {
    const nextPage = currentPage.value + 1
    const newPosts = await generateMockPosts(pageSize.value, nextPage)
    
    if (newPosts.length === 0) {
      hasMore.value = false
    } else {
      allPosts.value.push(...newPosts)
      currentPage.value = nextPage
    }
  } catch (error) {
    console.error('加载更多数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 重置分页状态
const resetPagination = () => {
  currentPage.value = 1
  hasMore.value = true
  allPosts.value = []
}

// 无限滚动监听
const setupInfiniteScroll = () => {
  let ticking = false
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        
        // 当滚动到距离底部100px时触发加载
        if (scrollTop + windowHeight >= documentHeight - 100) {
          loadMorePosts()
        }
        ticking = false
      })
      ticking = true
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 返回清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

// 图片懒加载优化
const setupImageLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            img.classList.add('loaded')
            observer.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })
    
    // 观察所有懒加载图片
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))
    
    return () => imageObserver.disconnect()
  }
  return () => {}
}

const generateMockPosts = (count = 20, page = 1) => {
  const templates = [
    { title: '吉隆坡网红咖啡店探店', category: 'food' },
    { title: '槟城小吃地图 | 必吃清单', category: 'food' },
    { title: '海边日落拍摄技巧', category: 'travel' },
    { title: '简约风元气穿搭', category: 'fashion' },
    { title: '日常通勤妆容记录', category: 'fashion' },
    { title: '马来西亚工作求职经验', category: 'life' },
    { title: '异国恋的长久之道', category: 'emotion' },
    { title: 'UM校园生活分享', category: 'um' },
    { title: 'XMUM学习心得', category: 'xmum' },
    { title: 'USM研究生申请攻略', category: 'usm' },
    { title: 'UKM交换生体验', category: 'ukm' },
    { title: 'UPM博士生活记录', category: 'upm' },
    { title: 'UTM工程专业介绍', category: 'utm' },
    { title: 'UTP石油工程学习', category: 'utp' },
    { title: 'MMU计算机科学', category: 'mmu' },
    { title: 'TAYLOR商科经验', category: 'taylor' },
    { title: 'SUNWAY艺术设计', category: 'sunway' },
    { title: 'UTAR中文系学习', category: 'utar' },
    { title: 'INTI国际学生生活', category: 'inti' },
    { title: 'HELP心理学专业', category: 'help' },
    { title: 'APU计算机科学', category: 'apu' },
    { title: 'LKW创意设计', category: 'limkokwing' },
    { title: 'CURTIN澳洲分校', category: 'curtin' },
    { title: 'MONASH马来西亚分校', category: 'monash' },
    { title: 'UNM诺丁汉分校', category: 'nottingham' },
    { title: 'HWU赫瑞瓦特大学', category: 'heriot' },
    { title: 'SEGI世纪大学', category: 'segi' },
    { title: 'KDU伯乐大学', category: 'kdu' },
    { title: '马来西亚股票投资心得', category: 'stocks' },
    { title: '加密货币投资策略', category: 'crypto' },
    { title: '房产投资经验分享', category: 'property' },
    { title: '外汇交易入门指南', category: 'forex' },
    { title: '基金理财配置建议', category: 'fund' },
    { title: '黄金投资时机分析', category: 'gold' },
    { title: '债券投资风险评估', category: 'bond' },
    { title: '创业投资机会分析', category: 'startup' },
    { title: 'ETF基金投资组合', category: 'etf' }
  ]
  
  const posts = []
  const startIndex = (page - 1) * count
  
  for (let i = 0; i < count; i++) {
    const templateIndex = (startIndex + i) % templates.length
    const template = templates[templateIndex]
    const postId = startIndex + i + 1
    
    posts.push({
      id: postId,
      title: `${template.title} ${postId}`,
      cover_image: `https://picsum.photos/400/600?random=${postId}`,
      category: template.category,
      type: Math.random() > 0.8 ? 'video' : 'image',
      likes_count: Math.floor(Math.random() * 1000),
      author: {
        id: postId,
        nickname: `用户${postId}`,
        avatar: `https://picsum.photos/40/40?random=${postId + 1000}`
      },
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return posts
}

// 分类切换时重置分页
const selectCategory = (category) => {
  activeCategory.value = category
  resetPagination()
  loadInitialPosts()
}

// 修改原有的selectCategory方法调用
const selectCategoryFromNav = (category) => {
  selectCategory(category)
}

// 加载初始数据
const loadInitialPosts = async () => {
  isLoading.value = true
  try {
    const posts = await generateMockPosts(pageSize.value, 1)
    allPosts.value = posts
    currentPage.value = 1
    hasMore.value = posts.length === pageSize.value
  } catch (error) {
    console.error('加载初始数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 留学圈模拟贴文（以 studyCategories 为来源）
const generateMockStudyPosts = (startId = 1000) => {
  const universityDisplayMap = {
    um: '马来亚大学 UM',
    xmum: '厦门大学马来西亚分校 XMUM',
    usm: '理科大学 USM',
    ukm: '国大 UKM',
    upm: '博大 UPM',
    utm: '工大 UTM',
    utp: '科技大学 UTP',
    mmu: '多媒大 MMU',
    taylor: '泰莱大学 Taylor',
    sunway: '双威大学 Sunway',
    utar: '拉曼大学 UTAR',
    inti: '英迪大学 INTI',
    help: '精英大学 HELP',
    apu: '亚太大学 APU',
    limkokwing: '创意科技大学 LKW',
    curtin: '科廷大学 Curtin',
    monash: '蒙纳士大学 Monash',
    nottingham: '诺丁汉大学 UNM',
    heriot: '赫瑞-瓦特大学 HWU',
    segi: '世纪大学 SEGi',
    kdu: 'KDU 大学'
  }

  const authors = Array.from({ length: 36 }, (_, i) => ({
    id: i + 1,
    nickname: `学长学姐${i + 1}`,
    avatar: `https://picsum.photos/80/80?random=study_${i + 1}`
  }))

  const titleTemplates = [
    (u) => `${u} 新生报到流程与时间线`,
    (u) => `${u} 宿舍选择与申请攻略`,
    (u) => `${u} 选课指南｜避坑与优选老师`,
    (u) => `${u} 校园美食地图（食堂/周边）`,
    (u) => `${u} 学费与奖学金申请经验`,
    (u) => `${u} 交通出行：公交/轻轨/Grab`,
    (u) => `${u} 留学生签证与续签流程`,
    (u) => `${u} 兼职/实习机会与简历建议`,
    (u) => `${u} 社团与活动推荐`,
    (u) => `${u} 学习资料与图书馆使用技巧`,
    (u) => `${u} 第一学期经验总结`,
    (u) => `${u} 留学生省钱攻略`,
    (u) => `${u} 考试周复习方法分享`,
    (u) => `${u} 周边旅游景点推荐`,
    (u) => `${u} 校外租房避坑指南`,
    (u) => `${u} 英语/马来语学习经验`,
    (u) => `${u} 选专业/转专业心得`,
    (u) => `${u} 校园健身运动指南`,
    (u) => `${u} 医疗就医完整攻略`,
    (u) => `${u} 文化节精彩回顾`
  ]

  const contentTemplates = [
    (u) => `刚来${u}的时候真的超级迷茫😅 现在已经是大二学长了，整理了一份超详细的新生报到指南！包括注册流程、体检、选课系统使用、宿舍入住等等。记得提前准备好护照、录取通知书、体检报告哦~ #留学生活 #新生攻略`,
    (u) => `${u}宿舍申请攻略来啦！🏠 校内宿舍vs校外租房，各有优劣。校内方便但要抢，校外自由但要找靠谱房东。我住过KK1和校外公寓，给大家详细对比一下价格、设施、交通...强烈建议新生第一年住校内！`,
    (u) => `选课血泪史分享💔 在${u}选课真的要慎重！有些老师给分超严，有些课workload爆炸...我整理了各学院热门课程和老师评价，还有选课时间表和技巧。记得要提前plan好，不然好课都被抢光了！`,
    (u) => `${u}美食地图更新啦🍜 作为资深吃货，把学校食堂和周边餐厅都吃遍了！推荐：食堂的椰浆饭RM5超值、对面的印度餐厅咖喱鸡必点、走10分钟有家华人茶餐室超正宗！附上价格和营业时间~`,
    (u) => `${u}奖学金申请经验分享💰 我拿到了50%学费减免！分享一下申请流程、材料准备、面试技巧。其实没有想象中那么难，关键是要突出自己的优势。还有PTPTN贷款、校外奖学金等资助渠道...`,
    (u) => `${u}交通出行指南🚇 学校到市区怎么去最方便？LRT、Grab、巴士全攻略！办Touch'n Go卡、下载Grab、了解巴士路线...我还整理了各种交通方式的价格对比，帮你省钱！周末去哪玩也有推荐哦~`,
    (u) => `留学生签证续签流程详解📝 在${u}读书，签证快到期了怎么办？需要准备什么材料？去哪里办理？要多久？我刚续签完，把整个流程记录下来了。记得要提前2-3个月开始准备，别等到最后才慌！`,
    (u) => `${u}兼职实习机会分享💼 留学生可以合法打工啦！校内tutor、餐厅服务员、便利店收银...我做过3份兼职，分享一下时薪、工作内容、如何找到靠谱的。还有实习申请技巧和简历模板！`,
    (u) => `${u}社团活动推荐🎉 大学生活不能只有学习！我加入了中华文化社和羽毛球社，认识了好多朋友。每个学期都有迎新晚会、文化节、运动会...分享一下各个社团的特色和如何选择适合自己的~`,
    (u) => `${u}图书馆学习攻略📚 期末复习必看！图书馆哪个位置最好？如何预约study room？电子资源怎么用？我还整理了各科past year paper的获取方法。考试周图书馆要早去占位，晚了就没座位啦！`,
    (u) => `在${u}的第一学期总结✨ 从刚开学的不适应到现在慢慢习惯，分享一些心得体会。语言环境、学习压力、生活习惯...都需要时间适应。给学弟学妹们的建议：多参加活动、主动交朋友、合理规划时间！`,
    (u) => `${u}省钱攻略大公开💸 留学花费不小，教你如何省钱！超市购物技巧、学生折扣、二手书购买、合租省房租...我一个月生活费控制在RM1500以内，分享我的经验！#省钱技巧`,
    (u) => `${u}考试周生存指南📖 Final快到了，分享一下我的复习方法。如何制定复习计划？怎么找学习资料？小组学习还是自己复习？还有考试技巧和时间管理...祝大家都能考出好成绩！`,
    (u) => `${u}周边游玩推荐🌴 在马来西亚不只是学习！周末可以去哪玩？云顶、马六甲、槟城...我都去过了，分享交通方式、费用预算、景点推荐。还有一些小众但超美的地方！`,
    (u) => `${u}租房避坑指南🏡 校外租房一定要注意这些！如何找靠谱房东？签合约要注意什么？押金、水电费、网络...我踩过的坑就不要再踩了。附上租房checklist和靠谱中介推荐~`,
    (u) => `${u}语言学习经验💬 刚来的时候英语/马来语不好怎么办？分享我的语言提升方法。课堂、日常交流、language exchange...现在已经能流利交流了！语言是融入的第一步~`,
    (u) => `${u}选专业/转专业经验🎓 如何选择适合自己的专业？我从工程转到商科的经历分享。转专业流程、学分转换、课程对接...做决定前一定要深思熟虑！`,
    (u) => `${u}健身运动指南💪 学校有健身房吗？怎么办理？还有什么运动设施？我坚持健身一年了，分享健身计划和校内运动资源。保持健康的身体才能更好地学习！`,
    (u) => `${u}医疗就医指南🏥 在马来西亚生病了怎么办？校医院、私人诊所、大医院...就医流程和费用说明。还有保险理赔的注意事项。健康很重要，收藏备用！`,
    (u) => `${u}文化节活动回顾🎊 上周的文化节太精彩了！各国美食、表演、游戏摊位...分享一些精彩瞬间和照片。在这里能体验到不同文化的魅力，真的很棒！#校园活动`,
    (u) => `${u}实习面试经验📋 刚拿到心仪公司的offer！分享面试准备、常见问题、着装建议。还有如何写出让HR眼前一亮的简历，以及networking的重要性。学弟学妹们加油！`,
    (u) => `${u}毕业生就业指导🎓 快毕业了，关于找工作的一些建议。工作签证办理、薪资谈判、职业规划...还有是留在马来西亚还是回国的思考。希望对大家有帮助！`,
    (u) => `${u}研究生申请攻略📖 想继续深造的看过来！申请材料、推荐信、研究计划书...我成功申请到了master，分享整个流程和注意事项。提前准备很重要！`,
    (u) => `${u}校园网络和IT服务💻 Wifi密码怎么获取？学校邮箱如何使用？VPN设置、打印服务、软件授权...所有IT相关问题都在这里了。新生必看！`,
    (u) => `${u}银行开户理财指南💳 刚来马来西亚要开银行账户吗？推荐哪家银行？如何汇款最省钱？还有信用卡申请、理财产品介绍。管好钱包很重要！`,
    (u) => `${u}手机通讯套餐推荐📱 哪家电信公司最划算？如何选择合适的套餐？上网流量、通话时长、国际长途...我用过3家运营商，给大家详细对比！`,
    (u) => `${u}购物血拼指南🛍️ 马来西亚有哪些shopping mall？什么时候有折扣？淘宝能寄到这里吗？分享我的购物心得和省钱技巧！`,
    (u) => `${u}学习小组组建经验👥 如何找到合适的study buddy？小组学习的好处和技巧。我们小组GPA都提升了，分享协作学习的方法！`,
    (u) => `${u}课外活动与竞赛🏆 学校有哪些比赛可以参加？如何准备商业案例竞赛？我参加过hackathon和商赛，分享参赛经验和收获！`,
    (u) => `${u}心理健康与压力管理🌈 留学生活压力大怎么办？学校有心理咨询服务吗？分享我的减压方法和心态调整技巧。记住，心理健康同样重要！`,
    (u) => `${u}毕业典礼攻略🎓 毕业典礼流程是怎样的？如何预约拍毕业照？学士服租借、家长邀请函...刚参加完毕业典礼，给大家分享完整攻略！`,
    (u) => `${u}新学期书籍购买指南📚 课本太贵怎么办？二手书市场在哪？电子书资源如何获取？我整理了省钱买书的所有方法，能省好几千块！`,
    (u) => `${u}雨季生活指南☔ 马来西亚雨季要注意什么？如何防止宿舍进水？出行必备物品有哪些？分享雨季生活小技巧，让你轻松应对！`,
    (u) => `${u}传统节日体验🎆 在马来西亚过开斋节、屠妖节、春节是什么体验？多元文化的魅力在这里！分享我参加各种节日庆祝的经历~`,
    (u) => `${u}运动队/社团招新啦🏃 各种运动队和兴趣社团开始招新！篮球、足球、舞蹈、音乐...有没有感兴趣的？加入社团认识新朋友，丰富大学生活！`,
    (u) => `${u}校友网络与人脉🤝 如何建立校友人脉？LinkedIn怎么用？networking活动参加心得。人脉是一笔宝贵的财富，早建立早受益！`
  ]

  const campusCities = ['吉隆坡', '雪兰莪', '槟城', '新山', '马六甲', '霹雳']
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const studySlugs = studyCategories.map((c) => c.slug)

  return Array.from({ length: 36 }, (_, i) => {
    const slug = pick(studySlugs)
    const uniName = universityDisplayMap[slug] || slug.toUpperCase()
    const makeTitle = pick(titleTemplates)
    const makeContent = pick(contentTemplates)
    const title = makeTitle(uniName)
    const content = makeContent(uniName)
    const author = pick(authors)
    const isVideo = Math.random() < 0.12
    const numImages = isVideo ? 1 : Math.ceil(Math.random() * 6)
    const images = Array.from({ length: numImages }, (_, j) => {
      const w = 320 + Math.floor(Math.random() * 100)
      const h = 260 + Math.floor(Math.random() * 200)
      return `https://picsum.photos/${w}/${h}?grayscale&random=${i * 7 + j + 1}`
    })

    return {
      id: startId + i,
      title,
      content,
      category: slug,
      cover_image: images[0],
      images,
      type: isVideo ? 'video' : 'image',
      video_url: isVideo ? `https://www.w3schools.com/html/mov_bbb.mp4#t=${i}` : undefined,
      author,
      tags: ['留学圈', '校园生活'],
      location: `${pick(campusCities)} · ${uniName.split(' ')[0]}`,
      likes_count: Math.floor(Math.random() * 4000) + 30,
      comments_count: Math.floor(Math.random() * 200),
      is_liked: Math.random() > 0.7,
      created_at: new Date(Date.now() - Math.random() * 12 * 24 * 60 * 60 * 1000)
    }
  })
}

// 左侧导航相关方法
function toggleNavCollapse() {
  const goingToCollapse = !isNavCollapsed.value === false ? false : !isNavCollapsed.value
  if (!isNavCollapsed.value) {
    // 将要折叠
    isCollapsing.value = true
    isExpanding.value = false
  } else {
    // 将要展开
    isExpanding.value = true
    isCollapsing.value = false
  }
  requestAnimationFrame(() => {
    isNavCollapsed.value = !isNavCollapsed.value
    setTimeout(() => { isCollapsing.value = false; isExpanding.value = false }, 300)
  })
}

function openHalfNav() {
  isExpanding.value = true
  isCollapsing.value = false
  requestAnimationFrame(() => {
    isNavCollapsed.value = false
    setTimeout(() => { isExpanding.value = false }, 300)
  })
  showCapsuleDropdown.value = false
}

function toggleGroup(groupSlug) {
  expandedGroups.value[groupSlug] = !expandedGroups.value[groupSlug]
}

function addToRecent(parent, slug) {
  const list = groupCategories[parent] || []
  const item = list.find(i => i.slug === slug)
  if (!item) return
  const newEntry = { name: item.name, slug: item.slug, image: item.image, parent }
  const filtered = recentVisited.value.filter(r => r.slug !== slug)
  recentVisited.value = [newEntry, ...filtered].slice(0, 8)
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(recentVisited.value)) } catch (e) {}
}

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (raw) {
      const recentData = JSON.parse(raw) || []
      // 确保每个项目都有图片，如果没有则从对应分类中获取
      recentVisited.value = recentData.map(item => {
        if (!item.image) {
          const list = groupCategories[item.parent] || []
          const categoryItem = list.find(cat => cat.slug === item.slug)
          if (categoryItem) {
            item.image = categoryItem.image
          } else {
            // 默认图片
            item.image = 'https://picsum.photos/200/200?random=999'
          }
        }
        return item
      })
    }
  } catch (e) { recentVisited.value = [] }
}

function selectSubcategoryFromNav(parent, slug) {
  activeCategory.value = slug
  addToRecent(parent, slug)
}

function toggleCapsuleDropdown() {
  showCapsuleDropdown.value = !showCapsuleDropdown.value
}

function closeCapsuleDropdown() {
  showCapsuleDropdown.value = false
  capsuleHover.value = false
}

// 持久化/恢复贴文，防止打开详情返回后重置
const POSTS_CACHE_KEY = 'circles:allPosts'
const POSTS_CACHE_VERSION = 'v4' // 更新版本：36个内容模板+初始评论
function persistPosts() {
  try { 
    const data = { version: POSTS_CACHE_VERSION, posts: allPosts.value }
    localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(data)) 
  } catch (e) {}
}
function restorePosts() {
  try {
    const raw = localStorage.getItem(POSTS_CACHE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    // 检查版本，如果版本不匹配则清除旧缓存
    if (data.version !== POSTS_CACHE_VERSION) {
      localStorage.removeItem(POSTS_CACHE_KEY)
      return false
    }
    const posts = data.posts || data // 兼容旧格式
    if (Array.isArray(posts) && posts.length) {
      allPosts.value = posts
      return true
    }
  } catch (e) {}
  return false
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    // 跳转到搜索页面的圈子选项
    router.push({
      // 统一搜索已停用
      query: {
        q: searchKeyword.value,
        type: 'circles' // 默认搜索圈子内容
      }
    })
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}

// 分类横线动画处理函数
const updateLinePosition = (index) => {
  const targetElement = categoryRefs.value[index]
  if (targetElement && categoriesContainer.value) {
    const containerRect = categoriesContainer.value.getBoundingClientRect()

    // 检查是否包含箭头图标
    const hasArrow = targetElement.querySelector('.dropdown-arrow')
    
    if (hasArrow) {
      // 对于有箭头的元素，只计算文字部分的宽度
      const textNodes = Array.from(targetElement.childNodes).filter(node => node.nodeType === Node.TEXT_NODE)
      if (textNodes.length > 0) {
        const range = document.createRange()
        range.setStart(textNodes[0], 0)
        range.setEnd(textNodes[textNodes.length - 1], textNodes[textNodes.length - 1].textContent.length)
        const textRect = range.getBoundingClientRect()
        
        const offsetLeft = textRect.left - containerRect.left
        const width = textRect.width

        lineStyle.value = {
          transform: `translateX(${Math.round(offsetLeft)}px)`,
          width: `${Math.round(width)}px`,
          opacity: 1
        }
        return
      }
    }

    // 原有逻辑：优先使用 Range 直接获取文字整体外接矩形，单行/多行都准确
    let textRect = null
    try {
      const range = document.createRange()
      range.selectNodeContents(targetElement)
      const rect = range.getBoundingClientRect()
      if (rect && rect.width) {
        textRect = rect
      }
    } catch (_) {}

    // 回退方案：使用元素内容区域（去除左右 padding）
    const elementStyle = window.getComputedStyle(targetElement)
    const paddingLeft = parseFloat(elementStyle.paddingLeft) || 0
    const paddingRight = parseFloat(elementStyle.paddingRight) || 0
    const elementRect = targetElement.getBoundingClientRect()

    const offsetLeft = textRect
      ? (textRect.left - containerRect.left)
      : (elementRect.left - containerRect.left + paddingLeft)

    const width = textRect
      ? textRect.width
      : (elementRect.width - paddingLeft - paddingRight)

    lineStyle.value = {
      transform: `translateX(${Math.round(offsetLeft)}px)`,
      width: `${Math.round(width)}px`,
      opacity: 1
    }
  }
}

const handleCategoryClick = (slug, index) => {
  if (['lifestyle', 'study', 'investment'].includes(slug)) {
    // 圈子类别点击后持久显示下拉菜单
    if (activeDropdownType.value === slug && persistentDropdown.value) {
      // 如果已经是持久显示状态，则关闭
      persistentDropdown.value = false
      showDropdown.value = false
      activeDropdownType.value = ''
    } else {
      // 设置为持久显示
      activeDropdownType.value = slug
      showDropdown.value = true
      persistentDropdown.value = true
    }
    activeCategory.value = slug
    activeIndex.value = index
    updateLinePosition(index)
    return
  }
  // 非圈子分类，清除持久状态
  persistentDropdown.value = false
  showDropdown.value = false
  activeDropdownType.value = ''
  activeCategory.value = slug
  activeIndex.value = index
  updateLinePosition(index)
}

// 圈子下拉菜单处理
const handleCircleHover = (circleType) => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
  activeDropdownType.value = circleType
  showDropdown.value = true
  
  // 同时更新横线位置 - 找到对应的索引
  const index = categories.findIndex(cat => cat.slug === circleType)
  if (index !== -1) {
    requestAnimationFrame(() => {
      updateLinePosition(index)
    })
  }
}

const handleCircleLeave = () => {
  // 如果是持久状态，不隐藏下拉菜单
  if (persistentDropdown.value) return
  
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
    activeDropdownType.value = ''
    // 恢复到当前活跃分类的横线位置
    requestAnimationFrame(() => {
      updateLinePosition(activeIndex.value)
    })
  }, 200)
}

const handleDropdownHover = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
}

const handleDropdownLeave = () => {
  // 如果是持久状态，不隐藏下拉菜单
  if (persistentDropdown.value) return
  
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
    activeDropdownType.value = ''
    // 恢复到当前活跃分类的横线位置
    requestAnimationFrame(() => {
      updateLinePosition(activeIndex.value)
    })
  }, 200)
}

const selectCircleCategory = (categorySlug) => {
  selectCategory(categorySlug)
  showDropdown.value = false
  activeDropdownType.value = ''
  // 记录最近访问（推断父分组）
  if (lifestyleCategories.some(c => c.slug === categorySlug)) addToRecent('lifestyle', categorySlug)
  else if (studyCategories.some(c => c.slug === categorySlug)) addToRecent('study', categorySlug)
  else if (investmentCategories.some(c => c.slug === categorySlug)) addToRecent('investment', categorySlug)
}


let hoverTimeout = null
const handleCategoryHover = (index) => {
  // 清除之前的延时，减少频繁更新
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  
  // 使用requestAnimationFrame优化性能
  requestAnimationFrame(() => {
    updateLinePosition(index)
  })
}

const handleCategoryLeave = () => {
  // 添加轻微延时，避免快速移动时的闪烁
  hoverTimeout = setTimeout(() => {
    requestAnimationFrame(() => {
      updateLinePosition(activeIndex.value)
    })
  }, 50)
}

// 弹窗状态管理
const showPostDetail = ref(false)
const selectedPost = ref(null)

const openPostDetail = (post) => {
  try {
    sessionStorage.setItem('circles:selectedPost', JSON.stringify(post))
  } catch (e) {}

  const to = { name: 'CirclesDetail', params: { id: post.id } }
  // 切换前持久化当前贴文列表，返回时不重新加载
  persistPosts()
  const startTransition = document.startViewTransition?.bind(document)
  if (startTransition) {
    startTransition(async () => {
      await router.push(to)
    })
  } else {
    router.push(to)
  }
}

const closePostDetail = () => {
  showPostDetail.value = false
  setTimeout(() => {
    selectedPost.value = null
  }, 300) // 等待动画完成后清空数据
}

// 跳转到知马圈专属发布页
const goToGlobalPublish = () => {
  router.push('/publish/circles')
}

const formatPostTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days === 2) return '前天'
  if (days < 7) return `${days}天前`
  
  // 超过7天显示具体日期
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const currentYear = now.getFullYear()
  
  if (year === currentYear) {
    return `${month}月${day}日`
  }
  return `${year}年${month}月${day}日`
}

const handleImageUpload = (file) => {
  uploadedImages.value.push(file)
}

const handleClosePublish = () => {
  // 重置表单
  publishForm.value = {
    title: '',
    content: '',
    category: '',
    location: '',
    images: []
  }
  uploadedImages.value = []
  showPublishDialog.value = false
}

const submitPublish = async () => {
  if (!publishForm.value.title.trim()) {
    ElMessage.error('请输入标题')
    return
  }
  
  publishing.value = true
  try {
    // 模拟发布
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success('发布成功！')
    handleClosePublish()
    // 重新加载数据
    allPosts.value = generateMockPosts()
  } catch (error) {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

// 窗口尺寸变化处理
const handleResize = () => {
  if (activeIndex.value !== -1) {
    requestAnimationFrame(() => {
      updateLinePosition(activeIndex.value)
    })
  }
}

// API数据加载
const loadCirclesData = async () => {
  try {
    const [circlesRes, postsRes] = await Promise.all([
      circlesAPI.getCircles(),
      postsAPI.getPosts()
    ])
    
    // 更新圈子数据
    if (circlesRes.data) {
      // 处理圈子数据，转换为组件需要的格式
      const circlesData = circlesRes.data.map(circle => ({
        id: circle.id,
        name: circle.name,
        slug: circle.slug || circle.name.toLowerCase(),
        image: circle.cover_image || circle.image,
        description: circle.description,
        member_count: circle.member_count || 0,
        post_count: circle.post_count || 0,
        is_joined: circle.is_joined || false
      }))
      
      // 更新分类数据
      updateCategoriesFromAPI(circlesData)
    }
    
    // 更新分类数据的辅助函数
    const updateCategoriesFromAPI = (circlesData) => {
      // 根据API数据更新分类
      // 这里可以根据实际需要更新分类结构
      console.log('更新分类数据:', circlesData)
    }
    
    // 更新帖子数据
    if (postsRes.data) {
      const postsData = postsRes.data.map(post => ({
        id: post.id,
        title: post.title,
        cover_image: post.cover_image || post.image,
        type: post.type || 'image',
        author: {
          id: post.author?.id || post.author?.user_id,
          nickname: post.author?.nickname || post.author?.name,
          avatar: post.author?.avatar || post.author?.profile_image
        },
        likes_count: post.likes_count || post.like_count || 0,
        comments_count: post.comments_count || post.comment_count || 0,
        category: post.category || 'recommend',
        created_at: post.created_at || post.publish_time
      }))
      
      allPosts.value = postsData
      persistPosts()
    }
    
  } catch (error) {
    console.error('加载知马圈数据失败:', error)
    // 如果API失败，使用模拟数据作为后备
    const restored = restorePosts()
    if (!restored) {
      const life = generateMockPosts()
      const study = generateMockStudyPosts(1000)
      allPosts.value = [...life, ...study]
      
      // 为部分帖子添加初始评论
      initializeMockComments()
      
      persistPosts()
    }
  }
}

// 为帖子添加模拟评论
function initializeMockComments() {
  const commentTemplates = [
    '太有用了！感谢分享👍',
    '正好需要这个信息，收藏了',
    '学长太厉害了，请问可以私信请教吗？',
    '这个攻略太详细了，必须点赞',
    '我也是这样过来的，说的很对',
    '有没有更多细节可以分享？',
    '太实用了，转发给室友',
    '感谢学长学姐的经验分享',
    '这个真的很重要，新生必看',
    '请问还有其他建议吗？',
    '说得好！我当时就是这样做的',
    '马上就要用到了，感谢！',
    '能加个联系方式吗？想详细了解',
    '这个帖子必须顶起来',
    '学弟表示收获很大',
    '已经按照这个方法试了，很有效',
    '同学推荐我来看的，果然有用',
    '能不能出个更详细的版本？',
    '感谢分享，已关注',
    '写得很好，期待更多分享'
  ]
  
  const userNames = ['学长', '学姐', '新生', '同学', '室友', '学弟', '学妹', '前辈', '老生', '同届生']
  
  // 为前20个帖子添加1-3条评论
  allPosts.value.slice(0, 20).forEach(post => {
    const numComments = Math.floor(Math.random() * 3) + 1
    const comments = []
    
    for (let i = 0; i < numComments; i++) {
      comments.push({
        user: userNames[Math.floor(Math.random() * userNames.length)] + (Math.floor(Math.random() * 20) + 1),
        text: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
        replies: [],
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        reactions: {}
      })
    }
    
    studyComments.value[post.id] = comments
  })
}

// 初始化
onMounted(async () => {
  await loadCirclesData()
  loadRecent()
  
  // 设置无限滚动监听
  const cleanupScroll = setupInfiniteScroll()
  
  // 设置图片懒加载
  const cleanupImages = setupImageLazyLoading()
  
  // 设置话题标签点击事件委托
  document.addEventListener('click', (e) => {
    const target = e.target
    if (target && target.classList && target.classList.contains('hashtag')) {
      const tag = target.getAttribute('data-tag')
      if (tag) {
        handleHashtagClick(tag)
      }
    }
  })
  
  // 等待DOM完全渲染后初始化横线位置
  await nextTick()
  
  // 使用requestAnimationFrame确保所有布局计算完成
  requestAnimationFrame(() => {
    const activeIdx = categories.findIndex(cat => cat.slug === activeCategory.value)
    if (activeIdx !== -1) {
      activeIndex.value = activeIdx
      
      // 延迟一帧再设置，确保所有CSS都已应用
      requestAnimationFrame(() => {
        updateLinePosition(activeIdx)
      })
    }
  })
  
  // 监听窗口尺寸变化
  window.addEventListener('resize', handleResize)
  
  // 组件卸载时清理
  onUnmounted(() => {
    cleanupScroll()
    cleanupImages()
    window.removeEventListener('resize', handleResize)
  })
const onDocClick = (e) => {
    const capsule = document.querySelector('.floating-capsule-btn')
    const dropdown = document.querySelector('.capsule-dropdown')
    if (showCapsuleDropdown.value) {
      const target = e.target
      if (capsule && capsule.contains(target)) return
      if (dropdown && dropdown.contains(target)) return
      showCapsuleDropdown.value = false
    }
  }
  document.addEventListener('click', onDocClick)
  removeDocClick = () => document.removeEventListener('click', onDocClick)
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  if (typeof removeDocClick === 'function') {
    try { removeDocClick() } catch (e) {}
  }
})

// 是否处于留学圈模式（本页展示同城样式）
const isStudyMode = computed(() => {
  if (activeCategory.value === 'study') return true
  return studyCategories.some(c => c.slug === activeCategory.value)
})

// 留学圈“朋友圈样式”使用统一的圈子数据源（allPosts），仅改变渲染方式
const studyCollapseState = ref({}) // { [postId]: boolean }

const filteredStudyPosts = computed(() => {
  if (!isStudyMode.value) return []

  const studySlugSet = new Set(studyCategories.map(c => c.slug))
  const all = Array.isArray(allPosts.value) ? allPosts.value : []

  let base = []
  if (activeCategory.value === 'study') {
    base = all.filter(p => studySlugSet.has(p.category))
    if (base.length === 0) base = all // 数据尚未接入时的回退
  } else {
    base = all.filter(p => p.category === activeCategory.value)
    if (base.length === 0) base = all.filter(p => studySlugSet.has(p.category))
    if (base.length === 0) base = all
  }

  // 如果选中了话题标签，进行筛选
  if (selectedHashtag.value) {
    base = base.filter(p => {
      const content = p.content || ''
      const title = p.title || ''
      const searchText = `${title} ${content}`.toLowerCase()
      return searchText.includes(selectedHashtag.value.toLowerCase()) || 
             searchText.includes(`#${selectedHashtag.value.toLowerCase()}`)
    })
  }

  // 映射为朋友圈视图所需字段，但不改变原数据
  return base.map(p => ({
    id: p.id,
    title: p.title,
    description: p.content,
    images: p.images,
    location: p.location,
    created_at: p.created_at,
    likesCount: p.likes_count,
    commentsCount: p.comments_count,
    isCollapsed: studyCollapseState.value[p.id] ?? true,
    provider: { id: p?.author?.id, name: p?.author?.nickname || '匿名', avatar: p?.author?.avatar || 'https://picsum.photos/40/40?random=80' }
  }))
})

const isStudyContentLong = (item) => {
  return (item?.description?.length || item?.content?.length || 0) > 160
}

const toggleStudyContent = (id) => {
  studyCollapseState.value[id] = !studyCollapseState.value[id]
}

const getStudyImageGridClass = (imageCount) => {
  if (imageCount === 1) return 'moment-images single-image'
  if (imageCount === 2) return 'moment-images grid-1x2'
  if (imageCount === 3) return 'moment-images grid-1x3'
  if (imageCount === 4) return 'moment-images grid-2x2'
  if (imageCount === 5 || imageCount === 6) return 'moment-images grid-2x3'
  return 'moment-images grid-3x3'
}

// 收藏 / 分享 / 评论展开 与 新评论输入
const studyFavorites = ref(new Set())
const studyCommentsOpen = ref(new Set())
const studyComments = ref({}) // { [id]: Array<{user,text,replies,timestamp}> }
const studyNewComments = ref({}) // { [id]: string }
const replyingTo = ref({}) // { [postId]: commentIndex } - 正在回复哪条评论
const studyNewReplies = ref({}) // { [postId_commentIdx]: string }

// Facebook风格多反应系统
const reactionTypes = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😡', label: 'Angry' }
]
const postReactions = ref({}) // { [postId]: { [reactionType]: count } }
const userReactions = ref({}) // { [postId]: reactionType }
const showReactionPicker = ref({}) // { [postId]: boolean }

function isStudyFavorited(id) {
  return studyFavorites.value.has(id)
}
function toggleStudyFavorite(id) {
  if (studyFavorites.value.has(id)) studyFavorites.value.delete(id)
  else studyFavorites.value.add(id)
  studyFavorites.value = new Set(studyFavorites.value)
}

function shareStudyPost(id) {
  const item = (filteredStudyPosts.value || []).find(p => p.id === id)
  const shareData = {
    title: item?.title || '知马圈',
    text: item?.description || '分享来自知马圈的内容',
    url: window.location.origin + '/circles/' + id
  }
  navigator.share?.(shareData) || navigator.clipboard?.writeText(shareData.url)
}

function toggleStudyComments(id) {
  if (studyCommentsOpen.value.has(id)) studyCommentsOpen.value.delete(id)
  else studyCommentsOpen.value.add(id)
  studyCommentsOpen.value = new Set(studyCommentsOpen.value)
}
function isStudyCommentsOpen(id) { return studyCommentsOpen.value.has(id) }
function getStudyComments(id) { return studyComments.value[id] || [] }
function addStudyComment(id) {
  const text = (studyNewComments.value[id] || '').trim()
  if (!text) return
  const list = studyComments.value[id] || []
  list.push({ 
    user: '我', 
    text, 
    replies: [],
    timestamp: new Date().toISOString(),
    reactions: {}
  })
  studyComments.value = { ...studyComments.value, [id]: list }
  studyNewComments.value = { ...studyNewComments.value, [id]: '' }
}

function startReply(postId, commentIdx) {
  replyingTo.value = { ...replyingTo.value, [postId]: commentIdx }
}

function cancelReply(postId) {
  const key = `${postId}`
  delete replyingTo.value[key]
  replyingTo.value = { ...replyingTo.value }
}

function addReply(postId, commentIdx) {
  const replyKey = `${postId}_${commentIdx}`
  const text = (studyNewReplies.value[replyKey] || '').trim()
  if (!text) return
  
  const comments = studyComments.value[postId] || []
  if (comments[commentIdx]) {
    if (!comments[commentIdx].replies) {
      comments[commentIdx].replies = []
    }
    comments[commentIdx].replies.push({
      user: '我',
      text,
      timestamp: new Date().toISOString()
    })
    studyComments.value = { ...studyComments.value, [postId]: [...comments] }
    studyNewReplies.value = { ...studyNewReplies.value, [replyKey]: '' }
    cancelReply(postId)
  }
}

function isReplying(postId, commentIdx) {
  return replyingTo.value[postId] === commentIdx
}

// 反应系统函数
function toggleReactionPicker(postId) {
  showReactionPicker.value = { ...showReactionPicker.value, [postId]: !showReactionPicker.value[postId] }
}

function selectReaction(postId, reactionType) {
  const currentReaction = userReactions.value[postId]
  
  // 初始化反应计数
  if (!postReactions.value[postId]) {
    postReactions.value[postId] = {}
  }
  
  // 移除旧反应
  if (currentReaction) {
    postReactions.value[postId][currentReaction] = Math.max(0, (postReactions.value[postId][currentReaction] || 0) - 1)
  }
  
  // 如果点击相同反应，则取消
  if (currentReaction === reactionType) {
    delete userReactions.value[postId]
  } else {
    // 添加新反应
    userReactions.value[postId] = reactionType
    postReactions.value[postId][reactionType] = (postReactions.value[postId][reactionType] || 0) + 1
  }
  
  // 更新响应式
  postReactions.value = { ...postReactions.value }
  userReactions.value = { ...userReactions.value }
  showReactionPicker.value[postId] = false
}

function getReactionSummary(postId) {
  const reactions = postReactions.value[postId]
  if (!reactions) return ''
  
  const summary = []
  let total = 0
  
  for (const [type, count] of Object.entries(reactions)) {
    if (count > 0) {
      const reaction = reactionTypes.find(r => r.type === type)
      if (reaction) {
        summary.push(reaction.emoji)
        total += count
      }
    }
  }
  
  if (total === 0) return ''
  return summary.join(' ') + ` ${total}`
}

function getUserReaction(postId) {
  const reactionType = userReactions.value[postId]
  if (!reactionType) return null
  return reactionTypes.find(r => r.type === reactionType)
}

// 话题标签系统
const selectedHashtag = ref(null)
const trendingHashtags = ref([
  { tag: '留学生活', count: 1234 },
  { tag: '校园日常', count: 892 },
  { tag: 'UM', count: 756 },
  { tag: '美食分享', count: 645 },
  { tag: '租房', count: 523 }
])

function parseHashtags(text) {
  if (!text) return text
  // 匹配 #话题 格式
  return text.replace(/#([\u4e00-\u9fa5a-zA-Z0-9_]+)/g, '<span class="hashtag" data-tag="$1">#$1</span>')
}

function handleHashtagClick(tag) {
  selectedHashtag.value = tag
  ElMessage.success(`已筛选话题: #${tag}`)
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearHashtagFilter() {
  selectedHashtag.value = null
  ElMessage.info('已清除话题筛选')
}

// 排序与热榜
const studySortOptions = [
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'newest' },
  { label: '评论最多', value: 'most_comments' },
  { label: '点赞最多', value: 'most_likes' }
]
const studySort = ref('recommend')

// 排序图标映射
const sortIcons = {
  recommend: Star,
  newest: Clock,
  most_comments: MessageCircle,
  most_likes: Heart
}

const sortedStudyPosts = computed(() => {
  const list = [...filteredStudyPosts.value]
  switch (studySort.value) {
    case 'newest':
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'most_comments':
      return list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
    case 'most_likes':
      return list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    default:
      return list
  }
})

const studyHotPosts = computed(() => {
  const base = [...filteredStudyPosts.value]
  // 简单热榜：按点赞+评论综合排序，取前10
  return base
    .map(p => ({ ...p, score: (p.likesCount || 0) * 2 + (p.commentsCount || 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
})

function scrollToStudyPost(id) {
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-post-id="${id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('highlight-service')
      setTimeout(() => el.classList.remove('highlight-service'), 1600)
    }
  })
}

// 图片预览（复用同城实现）
const imagePreview = ref({ show: false, images: [], currentIndex: 0 })
function previewImage(images, index) { imagePreview.value = { show: true, images, currentIndex: index } }
function closeImagePreview() { imagePreview.value.show = false }
function nextImage() { if (imagePreview.value.currentIndex < imagePreview.value.images.length - 1) imagePreview.value.currentIndex++ }
function prevImage() { if (imagePreview.value.currentIndex > 0) imagePreview.value.currentIndex-- }
function goToImage(index) { imagePreview.value.currentIndex = index }

// 跳转到用户主页
function goToUser(userId) {
  if (!userId) {
    console.warn('用户ID为空，无法跳转')
    return
  }
  console.log('跳转到用户主页:', userId)
  try {
    router.push(`/user/${userId}`)
  } catch (e) {
    console.error('跳转失败:', e)
  }
}
</script>

<style scoped>
/* 小红书风格布局 */
.xiaohongshu-layout {
  display: flex;
  min-height: 100vh;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  /* 确保页面有足够的高度，避免fixed定位元素位置异常 */
  height: 100vh;
  overflow-x: hidden;
  padding-left: 10%;
  padding-right: 10%;
  box-sizing: border-box;
}

.xiaohongshu-layout.expanding .half-nav { transform-origin: left center; }
.xiaohongshu-layout.collapsing .half-nav { transform-origin: right center; }

.xiaohongshu-layout.expanding .right-content { transform-origin: left center; }
.xiaohongshu-layout.collapsing .right-content { transform-origin: right center; }

/* 左半屏导航 - 液态玻璃效果 */
.half-nav {
  position: fixed;
  top: 60px; /* 降低顶部高度，为折叠按钮留出空间 */
  left: 0;
  width: 25%;
  max-width: 25%;
  height: calc(100vh - 60px); /* 减去顶部空间 */
  border-right: none;
  z-index: 100;
  /* 液态玻璃效果：灰白色渐变 + 动态模糊 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.25) 0%,
      rgba(241, 245, 249, 0.15) 25%,
      rgba(226, 232, 240, 0.1) 50%,
      rgba(248, 250, 252, 0.2) 75%,
      rgba(255, 255, 255, 0.3) 100%
    ),
    radial-gradient(ellipse at top left, 
      rgba(241, 245, 249, 0.2) 0%,
      rgba(248, 250, 252, 0.1) 30%,
      transparent 70%
    ),
    linear-gradient(45deg, 
      rgba(255, 255, 255, 0.15) 0%,
      transparent 50%,
      rgba(241, 245, 249, 0.08) 100%
    );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  /* 参考 capsule-dropdown 的描边效果 - 边框和背景分离 */
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-right: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 0 0 3px rgba(255, 255, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transform: translate3d(0, 0, 0);
  transform-origin: left center;
  transition: 
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease,
    backdrop-filter 0.2s ease;
  will-change: transform, width;
  /* 确保导航栏默认状态始终可见 */
  visibility: visible;
  opacity: 1;
}

.half-nav.collapsed { 
  width: 0 !important; 
  max-width: 0 !important; 
  min-width: 0 !important; 
  padding: 0 !important; 
  opacity: 0; 
  overflow: hidden; 
  border-right: none; 
  transform: translate3d(-100%, 0, 0);
  pointer-events: none; /* 折叠时禁用交互 */
}

.half-nav-inner {
  position: sticky;
  top: 0;
  height: calc(100vh - 60px); /* 减去顶部空间 */
  padding: 0;
  display: flex;
  flex-direction: column;
}

.nav-collapse-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* 参考 capsule-dropdown 的描边效果 */
  border: 2px solid rgba(255, 255, 255, 0.45);
  /* 液态玻璃按钮效果 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.4) 0%,
      rgba(241, 245, 249, 0.25) 50%,
      rgba(226, 232, 240, 0.15) 100%
    );
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 玻璃描边效果 - 边框和背景分离 */
  box-shadow: 
    0 0 0 3px rgba(255, 255, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  z-index: 1300;
  transition: 
    transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.15s ease,
    backdrop-filter 0.15s ease;
  /* 确保按钮始终可见 */
  visibility: visible !important;
  opacity: 1 !important;
}

.nav-collapse-btn:hover { 
  transform: translate3d(0, -2px, 0) scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.5) 0%,
      rgba(241, 245, 249, 0.35) 50%,
      rgba(226, 232, 240, 0.25) 100%
    );
  box-shadow: 
    0 0 0 3px rgba(255, 255, 255, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.nav-collapse-btn:active {
  transform: translate3d(0, 0, 0) scale(0.98);
  transition: transform 0.1s ease;
}

.collapse-icon { 
  width: 18px; 
  height: 18px; 
  color: #333; 
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

.nav-scroll { 
  margin-top: 64px; 
  overflow-y: auto; 
  padding: 0 8px; 
  flex: 1; 
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.nav-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.nav-group { margin-bottom: 16px; }
.group-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  cursor: pointer; 
  padding: 14px 16px; 
  border-radius: 18px; 
  /* 明显的浅灰白色边框 */
  border: 2px solid rgba(203, 213, 225, 0.5); 
  /* 液态玻璃分组标题效果 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.3) 0%,
      rgba(241, 245, 249, 0.2) 50%,
      rgba(226, 232, 240, 0.1) 100%
    );
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: 
    all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    backdrop-filter 0.3s ease,
    border-color 0.3s ease;
  width: 100%;
  text-align: left;
  font-size: inherit;
  color: inherit;
}
.group-header:hover { 
  /* 液态玻璃悬停效果 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.4) 0%,
      rgba(241, 245, 249, 0.3) 50%,
      rgba(226, 232, 240, 0.2) 100%
    );
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-color: rgba(203, 213, 225, 0.7);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: scale(1.01);
}

.group-header:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
.group-title { 
  font-size: 16px; 
  font-weight: 700; 
  color: #2d3748; 
  letter-spacing: -0.01em;
}
.group-arrow { transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); color: #666; }
.group-arrow.open { transform: rotate(180deg); }

.group-body { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; padding: 8px 2px 0; }
.subcat-item { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 12px 14px; 
  /* 明显的浅灰白色边框 */
  border: 2px solid rgba(203, 213, 225, 0.5); 
  border-radius: 16px; 
  cursor: pointer; 
  background: rgba(255,255,255,0.4); 
  backdrop-filter: blur(12px); 
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.6); 
  position: relative;
  overflow: hidden;
}
.subcat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 106, 0, 0.1), transparent);
  transition: left 0.5s ease;
}
.subcat-item:hover { 
  border-color: rgba(203, 213, 225, 0.7); 
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.7); 
  transform: scale(1.02); 
  background: rgba(255,255,255,0.6); 
}
.subcat-item:hover::before {
  left: 100%;
}
.subcat-item.active { 
  border-color: rgba(203, 213, 225, 0.7); 
  background: linear-gradient(135deg, rgba(255,106,0,0.15) 0%, rgba(255,106,0,0.08) 100%); 
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.7); 
}
.subcat-thumb { 
  width: 28px; 
  height: 28px; 
  border-radius: 8px; 
  object-fit: cover; 
  background: #f5f5f5; 
  /* 参考 capsule-dropdown-item img 的样式 */
  border: 1px solid #eee;
}
.subcat-name { font-size: 14px; color: #333; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 最近访问 - 美化版本 */
.recent-group { 
  margin-bottom: 16px; 
  position: relative;
}

.recent-group::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 106, 0, 0.2), transparent);
}

.recent-list { 
  display: grid; 
  grid-template-columns: repeat(4, minmax(0,1fr)); 
  gap: 10px; 
  padding: 12px 0 8px; 
}

.recent-item { 
  display: flex; 
  flex-direction: column;
  align-items: center; 
  gap: 8px; 
  padding: 12px 8px; 
  /* 稍微白一点的描边效果 - 浅灰白色边框 */
  border: 2px solid rgba(203, 213, 225, 0.5); 
  border-radius: 18px; 
  /* 液态玻璃背景效果 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.4) 0%,
      rgba(241, 245, 249, 0.25) 30%,
      rgba(226, 232, 240, 0.15) 70%,
      rgba(255, 255, 255, 0.3) 100%
    ),
    radial-gradient(ellipse at center, 
      rgba(241, 245, 249, 0.15) 0%,
      transparent 70%
    );
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%); 
  cursor: pointer; 
  /* 玻璃描边效果 - 边框和背景分离 */
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: 
    all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    backdrop-filter 0.3s ease,
    border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.recent-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.1), transparent);
  transition: left 0.5s ease;
}

.recent-item:hover { 
  border-color: rgba(203, 213, 225, 0.7); 
  /* 液态玻璃悬停效果 */
  background:
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.5) 0%,
      rgba(241, 245, 249, 0.35) 30%,
      rgba(226, 232, 240, 0.25) 70%,
      rgba(255, 255, 255, 0.4) 100%
    ),
    radial-gradient(ellipse at center, 
      rgba(148, 163, 184, 0.1) 0%,
      transparent 70%
    );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: scale(1.03);
}

.recent-item:focus,
.subcat-item:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.recent-item:hover::before {
  left: 100%;
}

.recent-item.active { 
  border-color: rgba(203, 213, 225, 0.7); 
  /* 液态玻璃激活状态 */
  background:
    linear-gradient(135deg, 
      rgba(148, 163, 184, 0.25) 0%,
      rgba(148, 163, 184, 0.15) 30%,
      rgba(241, 245, 249, 0.2) 70%,
      rgba(226, 232, 240, 0.1) 100%
    ),
    radial-gradient(ellipse at center, 
      rgba(148, 163, 184, 0.12) 0%,
      transparent 70%
    );
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: scale(1.01);
}

.recent-thumb { 
  width: 48px; 
  height: 48px; 
  border-radius: 14px; 
  object-fit: cover; 
  background: #f5f5f5; 
  /* 参考 capsule-dropdown-item img 的样式 */
  border: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.recent-item:hover .recent-thumb {
  transform: scale(1.1);
}

.recent-thumb::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recent-item:hover .recent-thumb::after {
  opacity: 1;
}

.recent-name { 
  font-size: 12px; 
  font-weight: 600; 
  color: #1a1a1a; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  text-align: center;
  transition: color 0.3s ease;
  letter-spacing: -0.01em;
}

.recent-item:hover .recent-name {
  color: #333;
}

/* 最近访问标题美化 */
.recent-group .group-header {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(148, 163, 184, 0.03) 100%);
  border-color: rgba(148, 163, 184, 0.15);
  margin-top: 8px;
}

.recent-group .group-header:active {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(148, 163, 184, 0.06) 100%);
  border-color: rgba(148, 163, 184, 0.2);
  transform: scale(0.98);
}

.recent-group .group-title {
  color: #1a1a1a;
  font-weight: 700;
}

/* 发布按钮样式已迁移到 PublishButton 组件 */

/* 发布按钮相关样式已迁移到 PublishButton 组件 */

/* 脉冲动画已迁移到 PublishButton 组件 */

/* 响应式设计 */
@media (max-width: 768px) {
  /* 移动端导航栏改为全宽 */
  .half-nav {
    width: 100%;
    max-width: 100%;
  }
  
  .right-content {
    width: 100%;
    margin-left: 0;
  }
  
  .right-content.full {
    width: 100%;
    margin-left: 0;
  }
  
  .nav-collapse-btn {
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
    /* 移动端确保折叠按钮始终可见 */
    position: fixed !important;
    z-index: 1300 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .collapse-icon {
    width: 16px;
    height: 16px;
  }
  
  /* 发布按钮响应式样式已迁移到 PublishButton 组件 */
}

@media (max-width: 480px) {
  .nav-collapse-btn {
    top: 10px;
    left: 10px;
    width: 36px;
    height: 36px;
    /* 小屏幕确保折叠按钮始终可见 */
    position: fixed !important;
    z-index: 1300 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .collapse-icon {
    width: 14px;
    height: 14px;
  }
  
  /* 发布按钮小屏幕响应式样式已迁移到 PublishButton 组件 */
}

/* 右半屏内容区域 */
.right-content { 
  width: 75%; 
  background: #fff; 
  min-height: 100vh; 
  margin-left: 25%; /* 为固定导航栏预留空间 */
  transition: 
    width 0.4s cubic-bezier(.16,.84,.24,1) .02s,
    margin-left 0.4s cubic-bezier(.16,.84,.24,1) .02s,
    padding 0.4s cubic-bezier(.16,.84,.24,1) .02s,
    opacity 0.3s ease;
  will-change: width, margin-left, padding;
}
.right-content.full { 
  width: 100%; 
  margin-left: 0; /* 折叠时移除左边距 */
}

/* 移除原统一头部栏样式（左半屏导航替代） */

/* 左侧分类区域 */
.categories-section {
  display: flex;
  gap: 24px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative; /* 使横线以该容器为参照 */
  align-items: center; /* 垂直居中文本 */
}

.categories-section::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex-shrink: 0;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.category-item:hover {
  color: white;
}

.category-item.active {
  color: white;
  font-weight: 600;
}

/* 带下拉菜单的分类项 */
.category-item.has-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.category-item.has-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-arrow.arrow-up {
  transform: rotate(180deg);
}

/* 移除横向圈子条（已迁移到左侧导航/胶囊下拉） */

.circles-items-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
  max-width: none;
  margin: 0;
  padding: 0 24px 12px 24px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  white-space: nowrap;
  /* 自定义原生滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.05) transparent;
  transition: scrollbar-color 0.3s ease;
}

/* WebKit浏览器滚动条样式 */
.circles-items-container::-webkit-scrollbar {
  height: 6px;
}

.circles-items-container::-webkit-scrollbar-track {
  background: transparent;
}

.circles-items-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.circles-items-container:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 106, 0, 0.25);
}

.circles-items-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 106, 0, 0.3);
}

/* Firefox浏览器滚动条hover状态 */
.circles-items-container:hover {
  scrollbar-color: rgba(255, 106, 0, 0.25) transparent;
}

.circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  min-width: 80px;
  width: 80px;
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
  animation: itemDropIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes itemDropIn {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.circle-item:hover {
  transform: scale(1.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circle-item:hover .circle-image {
  transform: rotate(3deg) scale(1.1);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.circle-item:hover .circle-text {
  color: var(--primary-color, #ff6b35);
  transform: scale(1.05);
}

.circle-item.active .circle-image {
  border: 3px solid var(--primary-color, #ff6b35);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.circle-item.active .circle-text {
  color: var(--primary-color, #ff6b35);
  font-weight: 600;
}

.circle-image {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.circle-text {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 动态横线 */
.category-line {
  position: absolute;
  bottom: 4px;
  left: 0;
  height: 3px;
  background: white;
  border-radius: 1.5px;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  opacity: 0;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
  will-change: transform, width;
}

/* 右侧搜索区域（不再显示） */

.search-container {
  display: flex;
  gap: 8px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: #e9ecef;
  color: #333;
}

.search-btn {
  padding: 10px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: #e55a2b;
}

.search-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 折叠态悬浮胶囊按钮 */
.floating-capsule-btn {
  position: fixed;
  top: 90px;
  left: 16px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.18);
  color: rgba(0,0,0,0.8);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 8px 26px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4);
  cursor: pointer;
  overflow: hidden;
  transition: width 0.25s ease;
  z-index: 1100;
}

.floating-capsule-btn:hover { width: 220px; }
.capsule-icon-wrap { display: inline-flex; align-items: center; justify-content: center; }
.capsule-icon { width: 20px; height: 20px; color: #333; }
.capsule-extra { display: inline-flex; align-items: center; gap: 8px; opacity: 0; transform: translateX(-8px); transition: all 0.25s ease; margin-left: auto; }
.floating-capsule-btn:hover .capsule-extra { opacity: 1; transform: translateX(0); }
.capsule-thumb { width: 24px; height: 24px; border-radius: 6px; object-fit: cover; background: #f5f5f5; border: 1px solid rgba(255,255,255,0.6); }
.capsule-label { font-size: 13px; font-weight: 600; color: #222; white-space: nowrap; }
.capsule-caret { width: 18px; height: 18px; color: #202020; transition: transform 0.2s ease, opacity 0.2s ease; opacity: .9; }
.capsule-caret.open { transform: rotate(180deg); }

.capsule-dropdown {
  position: fixed;
  top: 144px;
  left: 16px;
  width: 320px;
  background: rgba(255, 255, 255, 0.28);
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 0 rgba(255,255,255,0.5);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  z-index: 1250;
  overflow: hidden;
}
.capsule-dropdown-header { padding: 10px 12px; font-weight: 700; color: #222; border-bottom: 1.5px solid rgba(255,255,255,0.45); background: rgba(255,255,255,0.22); }
.capsule-dropdown-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 10px; }
.capsule-dropdown-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 4px 0; border: none; border-radius: 0; cursor: pointer; background: transparent; transition: color 0.2s ease, transform 0.2s ease; box-shadow: none; }
.capsule-dropdown-item:hover { color: var(--primary-color); }
.capsule-dropdown-item.active { color: var(--primary-color); }
.capsule-dropdown-item img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; background: #f5f5f5; border: 1px solid #eee; }
.capsule-dropdown-item span { font-size: 12px; color: #333; font-weight: 600; text-align: center; }

.floating-publish-btn:hover {
  transform: scale(1.05);
  box-shadow: 
    0 16px 48px rgba(255, 106, 0, 0.35),
    0 4px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary-dark) 100%);
}

.floating-publish-btn:active {
  transform: scale(1.02);
  transition-duration: 0.1s;
}

.floating-publish-btn .publish-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.floating-publish-btn .publish-text {
  font-weight: 600;
  white-space: nowrap;
}

/* 内容区域 */
.content-area {
  padding: 32px;
}

/* ===== 自适应列数（优先级覆盖） ===== */
/* 基础：窄屏 1 列 */
@media (max-width: 480px) {
  .right-content .waterfall-container,
  .right-content.full .waterfall-container { columns: 1; }
  .group-body { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .capsule-dropdown-list { grid-template-columns: repeat(2, 1fr); }
}

/* 小屏：≥480px → 2 列 */
@media (min-width: 480px) and (max-width: 767.98px) {
  .right-content .waterfall-container,
  .right-content.full .waterfall-container { columns: 2; }
  .group-body { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .capsule-dropdown-list { grid-template-columns: repeat(2, 1fr); }
}

/* 中屏：侧导航25%时 2 列，全屏时 3 列 */
@media (min-width: 768px) and (max-width: 1199.98px) {
  .right-content .waterfall-container { columns: 2; }
  .right-content.full .waterfall-container { columns: 3; }
  .group-body { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .capsule-dropdown-list { grid-template-columns: repeat(4, 1fr); }
}

/* 大屏：侧导航25%时 3 列，全屏时 4 列 */
@media (min-width: 1200px) and (max-width: 1599.98px) {
  .right-content .waterfall-container { columns: 3; }
  .right-content.full .waterfall-container { columns: 4; }
  .group-body { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .capsule-dropdown-list { grid-template-columns: repeat(4, 1fr); }
}

/* 超大屏：侧导航25%时 4 列，全屏时 5 列 */
@media (min-width: 1600px) {
  .right-content .waterfall-container { columns: 4; }
  .right-content.full .waterfall-container { columns: 5; }
  .group-body { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .capsule-dropdown-list { grid-template-columns: repeat(4, 1fr); }
}

/* 瀑布流容器 */
.waterfall-container {
  columns: 3;
  column-gap: 20px;
  column-fill: balance;
}

/* 加载状态样式 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  grid-column: 1 / -1;
  column-span: all;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.no-more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  grid-column: 1 / -1;
  column-span: all;
}

.no-more-text {
  color: #999;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 懒加载图片样式 */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

.lazy-image[src] {
  opacity: 1;
}

/* 后续在文件末尾追加更高优先级的自适应列数覆盖样式 */

.post-card {
  display: inline-block;
  width: 100%;
  margin-bottom: 20px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  break-inside: avoid;
  position: relative;
  border: 1px solid #f0f0f0;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.02) 0%, rgba(255, 106, 0, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.post-card:hover {
  border-color: #e0e0e0;
}

.post-card:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 4px;
}

.post-card:hover::before {
  opacity: 1;
}

.post-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: brightness(1) contrast(1.05) saturate(1.1);
}

.post-card:hover .post-image img {
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
}

/* 移除重复的hover效果 */

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.post-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
}

.post-title {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 12px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  position: relative;
  z-index: 10;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 106, 0, 0.1);
  transition: all 0.3s ease;
}

.author-avatar.clickable:hover {
  border-color: var(--primary-color);
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.3);
}

.post-card:hover .author-avatar {
  border-color: rgba(255, 106, 0, 0.3);
  transform: scale(1.1);
}

.author-name {
  font-size: 13px;
  color: #4a5568;
  font-weight: 600;
  transition: all 0.3s ease;
}

.author-name.clickable:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.post-card:hover .author-name {
  color: var(--primary-color);
}

.post-stats {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(255, 106, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  background: rgba(255, 106, 0, 0.1);
  color: var(--primary-color);
}

.stat-icon {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

/* 统一空心爱心，不填充 */

/* 发布对话框样式 */
.publish-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-upload-area {
  border: 2px dashed #e5e5e5;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
}

.image-upload-area:hover {
  border-color: #fe2c55;
  background: #fff5f5;
}

.upload-demo {
  width: 100%;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #999;
  margin-bottom: 16px;
}

.upload-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.upload-subtitle {
  font-size: 14px;
  color: #999;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title-input,
.content-input {
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.title-input:focus-within,
.content-input:focus-within {
  border-color: #fe2c55;
}

.form-row {
  display: flex;
  gap: 16px;
}

.category-select,
.location-input {
  flex: 1;
  border-radius: 8px;
}

.location-icon {
  width: 16px;
  height: 16px;
  color: #999;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1600px) {
  .waterfall-container {
    columns: 4;
  }
}

@media (max-width: 1200px) {
  .waterfall-container {
    columns: 3;
  }
}

@media (max-width: 992px) {
  .waterfall-container {
    columns: 2;
  }
}

@media (max-width: 768px) {
  .unified-header {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  }

  .categories-section {
    gap: 12px;
    padding-bottom: 8px;
  }

  .category-item {
    font-size: 14px;
    padding: 6px 12px;
    color: rgba(255, 255, 255, 0.8);
  }

  .category-item:hover {
    color: white;
  }

  .category-item.active {
    color: white;
    font-weight: 600;
  }

  .category-line {
    height: 2px;
    bottom: 3px;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .search-container {
    width: 200px;
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .floating-publish-btn {
    bottom: 24px;
    left: 24px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 24px;
  }

  .floating-publish-btn .publish-icon {
    width: 16px;
    height: 16px;
  }

  .waterfall-container {
    columns: 2;
    column-gap: 16px;
  }
  
  .content-area {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .unified-header {
    padding: 10px 12px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  }

  .categories-section {
    gap: 8px;
  }

  .category-item {
    font-size: 13px;
    padding: 5px 10px;
    color: rgba(255, 255, 255, 0.8);
  }

  .category-item:hover {
    color: white;
  }

  .category-item.active {
    color: white;
    font-weight: 600;
  }

  .category-line {
    height: 2px;
    bottom: 3px;
  }

  .search-container {
    width: 150px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .floating-publish-btn {
    bottom: 20px;
    left: 20px;
    padding: 10px 16px;
    font-size: 13px;
    border-radius: 20px;
  }

  .floating-publish-btn .publish-text {
    display: none;
  }

  .floating-publish-btn .publish-icon {
    width: 18px;
    height: 18px;
  }

  .waterfall-container {
    columns: 1;
  }
  
  .content-area {
    padding: 16px;
  }
}

/* ==================== 小红书风格详情弹窗 ==================== */
.xiaohongshu-dialog {
  --el-dialog-border-radius: 80px; /* 超大R角（参考 iPhone 屏幕） */
  --xhs-overlay: rgba(0, 0, 0, 0.5); /* 与遮罩层颜色保持一致 */
}

.xiaohongshu-dialog .el-dialog {
  margin: 8vh auto;
  max-width: 720px; /* 窄幅，突出圆角 */
  height: 72vh;
  border-radius: 80px;
  overflow: hidden;
  animation: dialogFadeIn 0.28s ease-out;
  position: relative;
  border: none !important;
  background: transparent !important; /* 外层透明，边缘直接是背景 */
  /* 外部遮罩环：用 box-shadow 画 2px 同色外圈，吃掉白边 */
  box-shadow: 0 0 0 2px var(--xhs-overlay) !important;
}

/* 覆盖 body 容器可能的默认背景 */
.xiaohongshu-dialog .el-dialog__body {
  padding: 0;
  height: 100%;
  background: transparent !important;
}

/* 小红书内容容器高度同步：改为透明，避免外层出现白色块感 */
.xiaohongshu-content {
  display: flex;
  height: 72vh;
  background: transparent;
  border-radius: 0;
  overflow: hidden;
}

/* 左侧媒体区域 (60%) */
.media-section {
  flex: 3;
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.media-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.media-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.media-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1;
}

/* 右侧信息区域 (40%) */
.info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  background: transparent; /* 移除白底，避免白边 */
  overflow: hidden;
}

/* 顶部用户信息 */
.user-header {
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.user-avatar.clickable:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.3);
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

.user-name.clickable:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.follow-btn {
  padding: 6px 16px;
  background: #ff2442;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.follow-btn:hover {
  background: #e61d3a;
}

/* 内容主体 */
.content-body {
  flex: 1;
  padding: 16px 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.text-content {
  margin-bottom: 16px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 8px;
}

.post-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 标签 */
.tags-section {
  margin-bottom: 16px;
}

.content-tag {
  display: inline-block;
  background: #f0f8ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 4px;
}

/* 时间地点 */
.meta-info {
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
}

.publish-time, .location {
  font-size: 12px;
  color: #999;
}

/* 互动数据 */
.engagement-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #666;
}

.stat-icon.liked {
  color: #ff2442;
  fill: #ff2442;
}

.stat-count {
  font-size: 13px;
  color: #666;
}

/* 评论区 */
.comments-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.comments-header {
  padding: 0 0 12px;
}

.comments-title {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.comments-list {
  flex: 1;
  min-height: 0;
  margin-bottom: 16px;
  overflow-y: hidden;
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  margin: 0 0 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-action {
  background: none;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
}

.comment-action:hover {
  color: #666;
}

.action-icon {
  width: 14px;
  height: 14px;
}

/* 评论输入区 */
.comment-composer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 0;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  margin-top: auto;
}

.login-prompt {
  font-size: 13px;
  color: #999;
}

.comment-tools {
  display: flex;
  gap: 16px;
}

.tool-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.tool-btn:hover {
  color: #333;
}

.tool-icon {
  width: 16px;
  height: 16px;
}

/* 小红书式底部操作栏 */
.xhs-action-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 0 12px;
  border-bottom: 1px solid #f0f0f0;
}

.xhs-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #eee;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.xhs-action:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.xhs-icon { width: 16px; height: 16px; }

/* 外部关闭按钮 - 毛玻璃半透明风格 */
.close-btn-outside {
  position: fixed;
  top: calc(6vh + 36px);
  right: calc((100vw - 70vw) / 2 - 50px);
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  z-index: 10001;
}

.close-btn-outside:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: scale(1.1);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.close-btn-outside:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

/* 微妙的呼吸效果 */
.close-btn-outside::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: breathe 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}



/* 小红书弹窗响应式设计 */
@media (max-width: 768px) {
  .xiaohongshu-dialog .el-dialog {
    margin: 3vh auto;
    width: 92% !important;
    height: 82vh;
    border-radius: 48px;
    max-width: none;
    background: transparent !important;
    box-shadow: 0 0 0 2px var(--xhs-overlay) !important;
    border: none !important;
  }

  .xiaohongshu-content {
    flex-direction: column;
    height: 82vh;
    background: transparent;
    border-radius: 0;
  }

  .media-section {
    flex: 1;
    min-height: 50vh;
  }

  .info-section {
    flex: 1;
    min-height: 40vh;
  }

  .user-header {
    padding: 16px 16px 12px;
  }

  .content-body {
    padding: 12px 16px;
  }

  .close-btn-outside {
    top: calc(2vh + 20px);
    right: calc((100vw - 95vw) / 2 - 40px);
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .xiaohongshu-dialog .el-dialog {
    margin: 2vh auto;
    width: 96% !important;
    height: 90vh;
    border-radius: 36px;
    background: transparent !important;
    box-shadow: 0 0 0 2px var(--xhs-overlay) !important;
    border: none !important;
  }

  .xiaohongshu-content {
    height: 90vh;
    background: transparent;
    border-radius: 0;
  }

  .media-section {
    min-height: 45vh;
  }

  .info-section {
    min-height: 50vh;
  }

  .user-header {
    padding: 12px 12px 8px;
  }

  .user-avatar {
    width: 28px !important;
    height: 28px !important;
  }

  .user-name {
    font-size: 13px !important;
  }

  .follow-btn {
    padding: 4px 12px !important;
    font-size: 12px !important;
  }

  .content-body {
    padding: 8px 12px;
  }

  .post-title {
    font-size: 14px !important;
  }

  .post-description {
    font-size: 13px !important;
  }

  .comment-avatar {
    width: 24px !important;
    height: 24px !important;
  }

  .close-btn-outside {
    top: calc(1vh + 15px);
    right: calc((100vw - 98vw) / 2 - 35px);
    width: 36px;
    height: 36px;
  }
}

/* ===== 留学圈朋友圈样式（WeChat Moments风格 - 扁平化设计） ===== */
.services-list.moments-style {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
}

.moment-item { 
  background: #fff; 
  border-radius: 0; 
  position: relative; 
  box-shadow: none;
  transition: none;
  overflow: visible;
  border-bottom: 1px solid #e7e7e7;
  padding: 16px 0;
}
.moment-header { 
  display: flex; 
  align-items: flex-start; 
  gap: 12px; 
  margin-bottom: 8px; 
  padding: 0 16px; 
}
.moment-avatar { 
  width: 48px; 
  height: 48px; 
  border-radius: 6px; 
  object-fit: cover; 
  flex-shrink: 0; 
  border: none;
  transition: none;
}

.moment-all-content { 
  flex: 1; 
  min-width: 0; 
  padding-right: 16px;
}
.moment-username { 
  font-size: 16px; 
  font-weight: 600; 
  color: #576b95; 
  letter-spacing: 0;
  transition: none;
  margin-bottom: 4px;
}
.moment-username:hover { 
  color: #576b95; 
  text-decoration: none; 
}
.clickable { 
  cursor: pointer; 
  position: relative;
  z-index: 10;
}
.clickable:hover {
  opacity: 0.8;
}
.moment-content { 
  line-height: 1.6; 
  margin: 0 0 8px 0; 
  padding: 0 16px 0 0;
}
.service-title { font-weight: 600; color: #000; font-size: 16px; line-height: 1.5; margin: 0 0 4px 0; }
.service-description { margin: 0; }
.content-text { color: #000; font-size: 15px; line-height: 1.6; word-wrap: break-word; }
.content-text.collapsed { display: -webkit-box; -webkit-line-clamp: 6; line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
.expand-btn { color: #576b95; background: none; border: none; font-size: 14px; cursor: pointer; margin-top: 4px; padding: 0; }
.expand-btn:hover { color: #576b95; }

.moment-location { display: flex; align-items: center; gap: 4px; color: #999; font-size: 13px; margin-bottom: 8px; }
.location-icon { width: 12px; height: 12px; color: #999; }
.moment-time { color: #999; font-size: 13px; margin-bottom: 8px; }

.moment-actions { 
  display: flex; 
  align-items: center; 
  gap: 24px; 
  margin-bottom: 0; 
  justify-content: flex-start; 
  padding: 8px 16px 0 0; 
  margin-left: 0; 
}
.action-btn { 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  background: transparent; 
  border: none; 
  color: #999; 
  font-size: 14px; 
  cursor: pointer; 
  padding: 4px 0; 
  border-radius: 0;
  transition: none;
  font-weight: 400;
}
.action-btn:hover { 
  color: #666; 
  background: transparent;
  transform: none;
}
.action-icon { 
  width: 16px; 
  height: 16px; 
  transition: none;
}

/* 图片网格 - WeChat风格（支持多种布局） */
.moment-images { display: grid; gap: 4px; margin-bottom: 8px; }
.moment-images.single-image { grid-template-columns: 1fr; max-width: 200px; }
.moment-images.grid-1x2 { grid-template-columns: 1fr 1fr; max-width: 200px; }
.moment-images.grid-1x3 { grid-template-columns: 1fr 1fr 1fr; max-width: 200px; }
.moment-images.grid-2x2 { grid-template-columns: 1fr 1fr; max-width: 200px; }
.moment-images.grid-2x3 { grid-template-columns: 1fr 1fr 1fr; max-width: 200px; }
.moment-images.grid-3x3 { grid-template-columns: 1fr 1fr 1fr; max-width: 200px; }
.moment-image-wrapper { position: relative; overflow: hidden; border-radius: 4px; background: #f0f0f0; cursor: pointer; }
.moment-images.single-image .moment-image-wrapper { aspect-ratio: auto; max-height: 200px; }
.moment-images.grid-1x2 .moment-image-wrapper,
.moment-images.grid-1x3 .moment-image-wrapper,
.moment-images.grid-2x2 .moment-image-wrapper,
.moment-images.grid-2x3 .moment-image-wrapper,
.moment-images.grid-3x3 .moment-image-wrapper { aspect-ratio: 1; }
.moment-image { width: 100%; height: 100%; object-fit: cover; transition: none; opacity: 1; }
.moment-image.loading { opacity: 0.5; }
.moment-image-wrapper:hover .moment-image { opacity: 1; }
.more-images-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 400; }

/* 折叠态布局：左筛选 + 中部内容 + 右热榜 */
.study-collapsed-layout { display: grid; grid-template-columns: 220px minmax(0, 600px) 260px; gap: 12px; justify-content: center; }
.study-collapsed-layout .services-list.moments-style { margin: 0 auto; }
.study-collapsed-layout .wide-center { width: 100%; max-width: 600px; }
.study-left-filter { position: sticky; top: 72px; align-self: start; }
.study-left-filter .filter-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 12px; box-shadow: none; }
.filter-title { font-weight: 600; margin-bottom: 8px; color: #000; display: flex; align-items: center; gap: 8px; font-size: 15px; }
.title-icon { width: 16px; height: 16px; color: #999; }
.filter-list { display: grid; gap: 6px; }
.filter-item { text-align: left; background: #f7f7f7; border: none; border-radius: 6px; padding: 8px 10px; cursor: pointer; color: #000; display: flex; align-items: center; gap: 8px; font-size: 14px; }
.filter-item .filter-icon { width: 14px; height: 14px; color: #666; }
.filter-item.active .filter-icon, .filter-item:hover .filter-icon { color: #576b95; }
.filter-item.active, .filter-item:hover { border: none; color: #576b95; background: #e8eaf0; }
.moments-style.wide-center { max-width: 760px; }

.study-right-hot { position: sticky; top: 72px; align-self: start; }
.study-right-hot .hot-widget { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; box-shadow: none; display: flex; flex-direction: column; max-height: calc(100vh - 88px); }
.hot-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #fafafa; border-bottom: 1px solid #e5e5e5; }
.hot-title { font-weight: 600; color: #000; display: inline-flex; align-items: center; gap: 6px; font-size: 15px; }
.hot-title .hot-icon { width: 16px; height: 16px; color: #ff6b35; }
.hot-list { padding: 8px; overflow: auto; }
.hot-item { display: flex; align-items: center; gap: 8px; padding: 8px 6px; border-radius: 6px; cursor: pointer; transition: none; }
.hot-item:hover { background: #f7f7f7; transform: none; }
.hot-rank { width: 20px; height: 20px; line-height: 20px; text-align: center; color: #999; font-weight: 600; border-radius: 4px; background: #f0f0f0; font-size: 12px; }
.hot-rank.top { color: #fff; background: #ff6b35; }
.hot-text { color: #000; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.highlight-service { animation: none; }

/* 图片预览弹窗（复用同城风格） */
.image-preview-overlay { z-index: 2200; background: rgba(0,0,0,0.6); position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
.image-preview-modal { position: relative; width: min(92vw, 980px); background: #000; border-radius: 12px; padding: 16px; }
.image-preview-close { position: absolute; top: 8px; right: 8px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.image-preview-main { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
.preview-image { max-width: 100%; max-height: 76vh; object-fit: contain; }
.image-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.image-nav-btn.prev-btn { left: 10px; }
.image-nav-btn.next-btn { right: 10px; }
.image-preview-thumbs { display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; }
.thumb-item { width: 56px; height: 56px; border-radius: 6px; overflow: hidden; border: 2px solid transparent; cursor: pointer; }
.thumb-item.active { border-color: #ff6b35; }
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }

/* 提升锚点滚动体验：预留顶部固定头部高度 */
.moment-item { scroll-margin-top: 84px; }

/* ===== 朋友圈评论区美化（WeChat风格 + 嵌套回复） ===== */
.moments-style .moment-comments { background: #f7f7f7; border: none; border-radius: 4px; padding: 8px 12px; box-shadow: none; margin: 8px 16px 0 0; }
.moments-style .moment-comments .comments-list { margin-bottom: 8px; }
.moments-style .moment-comments .comment-thread { margin-bottom: 8px; }
.moments-style .moment-comments .comment-item { display: flex; align-items: flex-start; gap: 0; padding: 4px 0; border-bottom: none; position: relative; }
.moments-style .moment-comments .comment-item:last-child { border-bottom: none; }
.moments-style .moment-comments .comment-user { font-weight: 400; color: #576b95; font-size: 14px; }
.moments-style .moment-comments .comment-text { color: #000; line-height: 1.5; font-size: 14px; flex: 1; }
.moments-style .moment-comments .reply-btn { background: transparent; border: none; color: #999; font-size: 12px; cursor: pointer; padding: 0 4px; margin-left: 8px; }
.moments-style .moment-comments .reply-btn:hover { color: #576b95; }
.moments-style .moment-comments .replies-list { margin-left: 16px; margin-top: 4px; padding-left: 12px; border-left: 2px solid #e5e5e5; }
.moments-style .moment-comments .reply-item { display: flex; align-items: flex-start; gap: 0; padding: 4px 0; font-size: 13px; }
.moments-style .moment-comments .reply-input-area { display: flex; gap: 6px; align-items: center; margin-top: 6px; margin-left: 16px; }
.moments-style .moment-comments .cancel-reply-btn { background: transparent; border: 1px solid #d9d9d9; color: #666; border-radius: 4px; padding: 6px 12px; font-size: 13px; cursor: pointer; }
.moments-style .moment-comments .cancel-reply-btn:hover { border-color: #999; color: #000; }
.moments-style .moment-comments .no-comments-tip { display: flex; align-items: center; gap: 8px; padding: 4px; color: #999; justify-content: center; }
.moments-style .moment-comments .tip-icon { color: #ccc; }
.moments-style .moment-comments .tip-text { font-size: 13px; }
.moments-style .moment-comments .comment-input-area { display: flex; gap: 8px; align-items: center; padding-top: 8px; border-top: 1px solid #e5e5e5; margin-top: 8px; }
.moments-style .moment-comments .comment-input { flex: 1; border: 1px solid #d9d9d9; border-radius: 4px; padding: 6px 10px; outline: none; font-size: 14px; background: #fff; }
.moments-style .moment-comments .comment-input:focus { border-color: #576b95; box-shadow: none; }
.moments-style .moment-comments .send-comment-btn { background: #576b95; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; font-size: 13px; cursor: pointer; }
.moments-style .moment-comments .send-comment-btn:disabled { background: #d9d9d9; color: #999; cursor: not-allowed; }

/* 响应式：中小屏优化两侧栏表现 */
@media (max-width: 1199.98px) {
  .study-collapsed-layout { grid-template-columns: 1fr; }
  .study-right-hot { display: none; }
  .study-left-filter { position: static; }
}

@media (max-width: 991.98px) {
  .study-left-filter { display: none; }
}

/* ===== Facebook风格反应系统 ===== */
.reaction-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn.like-btn.reacted {
  color: #576b95;
}

.reaction-emoji {
  font-size: 16px;
  line-height: 1;
}

.reaction-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  padding: 8px 12px;
  display: flex;
  gap: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 100;
}

.reaction-option {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reaction-option:hover {
  transform: scale(1.3);
}

.reaction-option.selected {
  background: #f0f0f0;
}

.reaction-emoji-large {
  font-size: 24px;
  line-height: 1;
}

.reaction-summary {
  font-size: 13px;
  color: #999;
  padding: 4px 8px;
  background: #f7f7f7;
  border-radius: 12px;
  white-space: nowrap;
}

/* ===== 话题标签系统 ===== */
.hashtag {
  color: #576b95;
  cursor: pointer;
  font-weight: 500;
}

.hashtag:hover {
  text-decoration: underline;
}

/* 话题筛选横幅 */
.hashtag-filter-banner {
  background: #f0f4ff;
  border: 1px solid #d0e0ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: #576b95;
  font-size: 14px;
}

.filter-icon {
  font-size: 18px;
  font-weight: 700;
  color: #576b95;
}

.filter-text {
  color: #333;
}

.filter-text strong {
  color: #576b95;
  font-weight: 600;
}

.filter-count {
  color: #999;
  font-size: 13px;
}

.clear-filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #d0e0ff;
  border-radius: 6px;
  padding: 6px 12px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filter-btn:hover {
  background: #fff;
  border-color: #576b95;
  color: #576b95;
}

.trending-hashtags {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.trending-hashtags .section-title {
  font-weight: 600;
  color: #000;
  font-size: 15px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hashtag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hashtag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.hashtag-item:hover {
  background: #f7f7f7;
}

.hashtag-item.active {
  background: #f0f4ff;
  border-color: #d0e0ff;
}

.hashtag-item.active .hashtag-name {
  color: #576b95;
  font-weight: 600;
}

.hashtag-name {
  color: #576b95;
  font-size: 14px;
  font-weight: 500;
}

.hashtag-count {
  color: #999;
  font-size: 12px;
}
</style>
