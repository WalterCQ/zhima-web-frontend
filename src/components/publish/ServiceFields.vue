<template>
  <div class="service-fields">
    <!-- 招聘 -->
    <template v-if="category === 'jobs'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">职位类别</label>
          <select v-model="formData.jobCategory" class="form-select">
            <option value="">请选择</option>
            <option v-for="c in jobCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">用工类型</label>
          <select v-model="formData.jobType" class="form-select">
            <option value="">请选择</option>
            <option v-for="t in jobTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">薪资（RM/月）</label>
          <input v-model="formData.salary" type="number" class="form-input" placeholder="例如 3000" min="0" />
        </div>
        <div class="form-group-half">
          <label class="form-label">工作地点</label>
          <input v-model="formData.jobArea" type="text" class="form-input" placeholder="城市/区域" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">福利</label>
        <div class="chips-row">
          <button 
            class="btn btn-ghost btn-small" 
            v-for="w in jobWelfaresAll" 
            :key="w" 
            @click.prevent="toggleWelfare(w)"
            :class="{ active: formData.welfares && formData.welfares.includes(w) }"
          >
            {{ w }}
          </button>
        </div>
      </div>
    </template>

    <!-- 房屋租售 -->
    <template v-else-if="category === 'housing'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">类别</label>
          <select v-model="formData.housingRentOrSale" class="form-select">
            <option value="">请选择</option>
            <option value="租">租</option>
            <option value="售">售</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">方式/类型</label>
          <select v-model="formData.housingMode" class="form-select">
            <option value="">请选择</option>
            <option v-for="m in housingModes" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">面积（㎡）</label>
          <input v-model="formData.housingSize" type="number" min="0" class="form-input" placeholder="例如 86" />
        </div>
        <div class="form-group-half">
          <label class="form-label">户型</label>
          <select v-model="formData.huxing" class="form-select">
            <option value="">请选择</option>
            <option v-for="h in housingRooms" :key="h" :value="h">{{ h }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">装修</label>
          <select v-model="formData.decoration" class="form-select">
            <option value="">请选择</option>
            <option v-for="d in housingDecorations" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">朝向</label>
          <select v-model="formData.orientation" class="form-select">
            <option value="">请选择</option>
            <option v-for="o in housingOrientations" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>
    </template>

    <!-- 二手车 -->
    <template v-else-if="category === 'cars'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">品牌</label>
          <input v-model="formData.carBrand" type="text" class="form-input" placeholder="如 丰田/本田/大众" />
        </div>
        <div class="form-group-half">
          <label class="form-label">车型</label>
          <select v-model="formData.carBody" class="form-select">
            <option value="">请选择</option>
            <option v-for="b in carBodies" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">里程（km）</label>
          <input v-model="formData.mileageKm" type="number" min="0" class="form-input" placeholder="例如 50000" />
        </div>
        <div class="form-group-half">
          <label class="form-label">上牌年份</label>
          <input v-model="formData.carYear" type="number" min="1990" class="form-input" placeholder="例如 2018" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">其他</label>
        <div class="chips-row">
          <label class="checkbox-wrapper">
            <input type="checkbox" class="checkbox-input" v-model="formData.transferIncluded" /> 
            <span class="checkbox-label">包过户</span>
          </label>
          <label class="checkbox-wrapper">
            <input type="checkbox" class="checkbox-input" v-model="formData.canInstallment" /> 
            <span class="checkbox-label">可分期</span>
          </label>
        </div>
      </div>
    </template>

    <!-- 二手市场 -->
    <template v-else-if="category === 'secondmarket'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">成色</label>
          <select v-model="formData.itemCondition" class="form-select">
            <option value="">请选择</option>
            <option v-for="c in itemConditions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">配送/自提</label>
          <select v-model="formData.delivery" class="form-select">
            <option value="">请选择</option>
            <option v-for="d in deliveryOptions" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
      </div>
    </template>

    <!-- 二手回收 -->
    <template v-else-if="category === 'recycle'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">回收类型</label>
          <select v-model="formData.recycleType" class="form-select">
            <option value="">请选择</option>
            <option v-for="r in recycleTypes" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">服务范围</label>
          <input v-model="formData.serviceArea" class="form-input" placeholder="服务城市/区域" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">上门服务</label>
        <label class="checkbox-wrapper">
          <input type="checkbox" class="checkbox-input" v-model="formData.doorstep" /> 
          <span class="checkbox-label">支持上门回收</span>
        </label>
      </div>
    </template>

    <!-- 家政服务 -->
    <template v-else-if="category === 'housekeeping'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">服务类型</label>
          <select v-model="formData.housekeepingType" class="form-select">
            <option value="">请选择</option>
            <option v-for="t in housekeepingTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="form-group-half">
          <label class="form-label">时薪（RM/小时）</label>
          <input v-model="formData.hourlyPrice" type="number" min="0" class="form-input" placeholder="例如 30" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">服务范围</label>
        <input v-model="formData.serviceArea" class="form-input" placeholder="服务城市/区域" />
      </div>
    </template>

    <!-- 本地服务 -->
    <template v-else-if="category === 'local'">
      <div class="form-row">
        <div class="form-group-half">
          <label class="form-label">服务类型</label>
          <input v-model="formData.localServiceType" class="form-input" placeholder="如 开锁/修理/摄影" />
        </div>
        <div class="form-group-half">
          <label class="form-label">营业时间</label>
          <input v-model="formData.businessHours" class="form-input" placeholder="如 10:00-20:00" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:formData'])

const formData = defineModel('formData', { required: true })

// 选项数据
const jobCategories = ['司机/物流','客服','销售','服务员','普工/技工','餐饮','人事/行政']
const jobTypes = ['全职','兼职']
const jobWelfaresAll = ['五险一金','周末双休','包吃','包住']

const housingModes = ['整租','合租','长租公寓','个人房源','二手房','新房']
const housingRooms = ['一居','二居','三居','四居','别墅','Loft']
const housingDecorations = ['毛坯','简装','精装']
const housingOrientations = ['南北','朝南','朝北','东西']

const carBodies = ['轿车','SUV/MPV','跑车','面包车','工程车','货车']

const itemConditions = ['全新','九成新','八成新','七成新']
const deliveryOptions = ['自提','同城配送','快递']

const recycleTypes = ['手机','电脑','家电','金属','塑料','纸品','其他']
const housekeepingTypes = ['保洁','保姆','月嫂','搬家','疏通','空调清洗','家电维修']

// 方法
const toggleWelfare = (w) => {
  if (!Array.isArray(formData.value.welfares)) {
    formData.value.welfares = []
  }
  const i = formData.value.welfares.indexOf(w)
  if (i >= 0) {
    formData.value.welfares.splice(i, 1)
  } else {
    formData.value.welfares.push(w)
  }
}

// 监听分类变化，清空相关字段
watch(() => props.category, () => {
  const reserved = new Set(['title','content','category','images','video','location','price','isPriceFree','isPriceNegotiable','contact','visibility','isScheduled','scheduledTime'])
  Object.keys(formData.value).forEach(k => {
    if (!reserved.has(k)) {
      if (Array.isArray(formData.value[k])) {
        formData.value[k] = []
      } else {
        formData.value[k] = ''
      }
    }
  })
})
</script>

<style scoped>
.service-fields {
  margin-top: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.form-group-half {
  display: flex;
  flex-direction: column;
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-small.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.checkbox-input {
  accent-color: var(--primary-color);
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>



