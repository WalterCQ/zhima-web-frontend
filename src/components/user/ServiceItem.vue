<template>
  <div class="service-item" @click="goDetail">
    <div class="service-header">
      <div class="author-info">
        <img :src="$getImageUrl(service.author?.avatar)" :alt="`${service.author?.name}的头像`" class="author-avatar" @click="$router.push(`/user/${service.author?.id}`)" style="cursor:pointer;" />
        <div class="author-details">
          <div class="author-name" @click="$router.push(`/user/${service.author?.id}`)" style="cursor:pointer;">{{ service.author?.name }}</div>
          <div class="service-meta">
            <span class="location" v-if="service.location">
              <MapPin :size="12" />
              {{ service.location }}
            </span>
            <span class="dot">·</span>
            <span class="publish-time">{{ service.publishTime }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-content">
      <h3 class="service-title">{{ service.title }}</h3>
      <div class="service-description" v-if="service.description">{{ service.description }}</div>
      
      <div class="service-details">
        <div class="price" v-if="service.price">
          <DollarSign :size="16" />
          <span class="price-text">{{ service.price }}</span>
        </div>
        
        <div class="tags" v-if="service.tags && service.tags.length">
          <span v-for="tag in service.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      
      <div class="service-images" v-if="service.images && service.images.length">
        <img 
          v-for="(image, index) in service.images.slice(0, 3)" 
          :key="index"
          :src="image" 
          :alt="`服务图片${index + 1}`" 
          class="service-image"
        />
        <div v-if="service.images.length > 3" class="more-images">
          +{{ service.images.length - 3 }}
        </div>
      </div>
    </div>
    
    <div class="service-actions">
      <div class="action-item" @click.stop="toggleLike">
        <Heart :class="{ filled: service.isLiked }" :size="16" />
        <span>{{ service.likes || '点赞' }}</span>
      </div>
      
      <div class="action-item" @click.stop>
        <MessageCircle :size="16" />
        <span>{{ service.comments || '咨询' }}</span>
      </div>
      
      <div class="action-item" @click.stop="contactService">
        <Phone :size="16" />
        <span>联系</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, MessageCircle, Phone, MapPin, DollarSign } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

export default {
  name: 'ServiceItem',
  components: {
    Heart, MessageCircle, Phone, MapPin, DollarSign
  },
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const toggleLike = () => {
      props.service.isLiked = !props.service.isLiked
      if (props.service.isLiked) {
        props.service.likes = (props.service.likes || 0) + 1
      } else {
        props.service.likes = Math.max((props.service.likes || 0) - 1, 0)
      }
    }
    
    const contactService = () => {
      // 联系服务提供者
    }

    const detectServiceType = (title, description = '') => {
      const text = `${title || ''} ${description || ''}`
      const carReg = /(二手车|汽车|轿车|SUV|MPV|上牌|过户|验车|卖车|买车)/i
      const rentReg = /(租房|合租|整租|公寓|出租|小区|次卧|主卧|写字楼|商铺)/i
      const jobReg = /(招聘|求职|岗位|月薪|薪资|包吃|包住|五险|急招|面试|兼职)/i
      if (carReg.test(text)) return 'car'
      if (rentReg.test(text)) return 'rent'
      if (jobReg.test(text)) return 'job'
      return 'job'
    }

    const goDetail = () => {
      const id = props.service.id || props.service.serviceId || Date.now()
      const type = props.service.type || detectServiceType(props.service.title, props.service.description)
      router.push({ name: 'ServiceDetail', params: { id }, query: { type } })
    }
    
    return {
      toggleLike,
      contactService,
      goDetail
    }
  }
}
</script>

<style scoped>
.service-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
  cursor: pointer;
}

.service-header {
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.service-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  color: #d1d5db;
}

.service-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.service-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 14px;
}

.service-details {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.price {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary-color);
  font-weight: 600;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.service-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}

.service-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.more-images {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
}

.service-actions {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.action-item:hover {
  color: var(--primary-color);
}

.action-item .filled {
  color: #ef4444;
  fill: #ef4444;
}
</style>
