<template>
  <div class="list-page">
    <div class="container">
      <!-- 顶部频道标签 -->
      <div class="tabs" v-if="false">
        <button v-for="s in segments" :key="s" class="tab" :class="{ active: segment===s }" @click="setSegment(s)">{{ s }}</button>
      </div>

      <!-- 筛选栏（58 同城风格） -->
      <div class="filters">
        <!-- 工程/商用 机型分类 -->
        <div class="filter-row">
          <span class="filter-label">机型：</span>
          <button class="filter-chip" :class="{active: !engCategory}" @click="setEng('')">不限</button>
          <button class="filter-chip" v-for="t in engCategories" :key="t" :class="{active: engCategory===t}" @click="setEng(t)">{{ t }}</button>
        </div>
        <!-- 品牌：字母索引 + 热门 -->
        <div class="filter-row letter-row" v-if="!isEngMode">
          <span class="filter-label">品牌：</span>
          <button class="filter-chip letter-chip" :class="{active: brandLetter==='热门'}" @click="setBrandLetter('热门')" @mouseenter="setBrandLetterHover('热门')">热门</button>
          <button v-for="ltr in letters" :key="ltr" class="filter-chip letter-chip" :class="{active: brandLetter===ltr}" @click="setBrandLetter(ltr)" @mouseenter="setBrandLetterHover(ltr)">{{ ltr }}</button>
        </div>
        <div class="brand-grid" v-if="!isEngMode">
          <button class="brand-chip" :class="{active: brand===b.name}" v-for="b in displayBrands" :key="b.name" @click="setBrand(b.name)">
            <span class="logo">
              <img v-if="!brandLogoFailed[b.name] && brandLogoUrl(b.name)" :src="brandLogoUrl(b.name)" @error="onBrandLogoError($event, b.name)" alt="" />
              <span v-else class="logo-fallback-text">{{ b.name.charAt(0) }}</span>
            </span>
            <span class="bn">{{ b.name }}</span>
          </button>
        </div>

        <!-- 车系（根据品牌） -->
        <div class="filter-row" v-if="!isEngMode">
          <span class="filter-label">车系：</span>
          <button class="filter-chip" :class="{active: !series}" @click="setSeries('')">不限</button>
          <button class="filter-chip" v-for="m in shownSeries" :key="m" :class="{active: series===m}" @click="setSeries(m)">{{ m }}</button>
          <button v-if="(seriesList.length>maxSeriesShow)" class="filter-more" @click="toggleSeries()"><span class="label">{{ seriesFolded ? '更多' : '收起' }}</span><span class="chev" :class="{up: !seriesFolded}">⌄</span></button>
        </div>

        <!-- 价格区间 -->
        <div class="filter-row">
          <span class="filter-label">价格：</span>
          <button class="filter-chip" v-for="p in prices" :key="p" :class="{active: price===p}" @click="setPrice(p)">{{ p }}</button>
          <div class="price-inline">
            <input class="price-input" v-model.trim="customMin" placeholder="" />
            <span class="dash">-</span>
            <input class="price-input" v-model.trim="customMax" placeholder="" />
            <span class="unit">万</span>
            <button class="btn-mini" @click="applyCustomPrice">确定</button>
          </div>
        </div>

        <!-- 更多条件 -->
        <div class="filter-row more-row">
          <button class="filter-toggle" @click="moreOpen = !moreOpen">
            <span class="label">{{ moreOpen ? '收起' : '展开更多' }}</span>
            <span class="chev" :class="{up: moreOpen}">⌄</span>
          </button>
          <div class="more-cols" v-show="moreOpen">
            <div class="more-col">
              <span class="more-label">来源</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: source===s}" v-for="s in sources" :key="s" @click="setSource(s)">{{ s }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">类型</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: body===b}" v-for="b in bodies" :key="b" @click="setBody(b)">{{ b }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">车龄</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: age===a}" v-for="a in ages" :key="a" @click="setAge(a)">{{ a }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">排量</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: displacement===d}" v-for="d in displacements" :key="d" @click="setDisplacement(d)">{{ d }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">里程</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: mileageRange===m}" v-for="m in mileages" :key="m" @click="setMileage(m)">{{ m }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">变速箱</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: gearbox===g}" v-for="g in gearboxes" :key="g" @click="setGearbox(g)">{{ g }}</button>
              </div>
            </div>
            <div class="more-col">
              <span class="more-label">颜色</span>
              <div class="chips">
                <button class="filter-chip" :class="{active: color===c}" v-for="c in colors" :key="c" @click="setColor(c)">{{ c }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前筛选 + 结果数 + 功能勾选 -->
        <div class="active-bar">
          <div class="left">
            <span class="cur-label">当前筛选</span>
            <template v-for="chip in activeChips" :key="chip.key">
              <span class="cur-chip" @click="removeChip(chip.key)">{{ chip.label }} ×</span>
            </template>
            <button class="link-reset" @click="resetFilters">重新选择</button>
          </div>
          <div class="right">
            <span class="count">全部车源（{{ totalCount }}辆）</span>
            <label class="chk"><input type="checkbox" v-model="onlyVerified" /> 检测保障</label>
            <label class="chk"><input type="checkbox" v-model="onlyVideo" /> 视频车源</label>
            <label class="chk"><input type="checkbox" v-model="onlyNewEnergy" /> 新能源</label>
            <label class="chk"><input type="checkbox" v-model="onlyPersonal" /> 个人车源</label>
            <div class="view-toggle">
              <button class="view-btn" :class="{active: viewMode==='grid'}" @click="viewMode='grid'" aria-label="网格视图" :aria-pressed="viewMode==='grid'" title="网格视图">
                <svg class="ico-svg ico-grid" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </button>
              <button class="view-btn" :class="{active: viewMode==='list'}" @click="viewMode='list'" aria-label="列表视图" :aria-pressed="viewMode==='list'" title="列表视图">
                <svg class="ico-svg ico-list" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="5" cy="6" r="1.5"></circle>
                  <rect x="9" y="5" width="10" height="2" rx="1"></rect>
                  <circle cx="5" cy="12" r="1.5"></circle>
                  <rect x="9" y="11" width="10" height="2" rx="1"></rect>
                  <circle cx="5" cy="18" r="1.5"></circle>
                  <rect x="9" y="17" width="10" height="2" rx="1"></rect>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表（卡片式） -->
      <div>
        <div v-if="displayed.length === 0" class="empty-state">
          <div class="empty-title">暂无车源</div>
          <div class="empty-desc">调整筛选或重置再试试</div>
          <div class="empty-actions">
            <button class="btn" @click="resetFilters">重置筛选</button>
          </div>
        </div>
        <div v-else class="car-grid" :class="{ list: viewMode==='list' }">
          <div v-for="car in displayed" :key="car.id" class="car-card" @click="goDetail(car)" :class="{ list: viewMode==='list' }">
            <img :src="car.cover" class="car-thumb" @error="onImgError" />
            <div class="car-body">
              <div class="car-title">{{ car.title }}</div>
              <div class="car-tags">
                <span class="tag" v-for="t in car.tags" :key="t">{{ t }}</span>
              </div>
              <div class="car-meta">{{ car.year }}年上牌 · {{ car.mileage }}万公里</div>
              <div class="car-price">{{ car.price }}</div>
            </div>
          </div>

          <div class="pagination">
            <button class="page-btn" :disabled="page<=1" @click="prevPage">上一页</button>
            <div class="page-info">
              <span>第 {{ page }} 页</span>
            </div>
            <button class="page-btn" :disabled="!hasMore" @click="nextPage">下一页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 已移除顶部频道切换

const prices = ['不限','0-3万','3-5万','5-10万','10-15万','15-20万','20-30万','30万以上']
const bodies = ['不限','轿车','SUV/MPV','跑车','面包车','工程车','货车']
const engCategories = ['挂车','载货车','自卸车','牵引车','客车','工程车','搅拌车','洒水车','挖掘机']
const engCategory = ref(String(route.query.eng || ''))
const isEngMode = computed(()=> !!engCategory.value)

// 品牌索引（A-Z 每个字母均保证有品牌）
const letters = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',')
const brandLetter = ref(String(route.query.letter || '热门'))
const brand = ref(String(route.query.brand || ''))

// 马来西亚常见 + 完整 A-Z 覆盖
const allBrands = [
  { name: 'Audi', letter: 'A' },
  { name: 'BMW', letter: 'B' },
  { name: 'Chevrolet', letter: 'C' }, { name: 'Chery', letter: 'C' },
  { name: 'Daihatsu', letter: 'D' },
  { name: 'Exeed', letter: 'E' },
  { name: 'Ford', letter: 'F' },
  { name: 'Geely', letter: 'G' }, { name: 'GWM', letter: 'G' },
  { name: 'Honda', letter: 'H' }, { name: 'Hyundai', letter: 'H' },
  { name: 'Isuzu', letter: 'I' },
  { name: 'Jaguar', letter: 'J' }, { name: 'Jeep', letter: 'J' },
  { name: 'Kia', letter: 'K' },
  { name: 'Lexus', letter: 'L' }, { name: 'Land Rover', letter: 'L' },
  { name: 'Mazda', letter: 'M' }, { name: 'Mitsubishi', letter: 'M' }, { name: 'Mercedes-Benz', letter: 'M' }, { name: 'MINI', letter: 'M' },
  { name: 'Nissan', letter: 'N' },
  { name: 'Opel', letter: 'O' }, { name: 'ORA', letter: 'O' },
  { name: 'Perodua', letter: 'P' }, { name: 'Proton', letter: 'P' }, { name: 'Peugeot', letter: 'P' },
  { name: 'Qoros', letter: 'Q' },
  { name: 'Renault', letter: 'R' },
  { name: 'Subaru', letter: 'S' }, { name: 'Suzuki', letter: 'S' },
  { name: 'Toyota', letter: 'T' },
  { name: 'UAZ', letter: 'U' },
  { name: 'Volvo', letter: 'V' }, { name: 'Volkswagen', letter: 'V' },
  { name: 'Wuling', letter: 'W' },
  { name: 'XPeng', letter: 'X' },
  { name: 'Yutong', letter: 'Y' },
  { name: 'ZEEKR', letter: 'Z' }
]
const hotBrandSet = new Set(['Perodua','Proton','Toyota','Honda','Nissan','Mazda','Mercedes-Benz','BMW','Volvo','Volkswagen'])
const hotBrands = computed(()=> allBrands.filter(b=>hotBrandSet.has(b.name)))
const displayBrands = computed(()=> brandLetter.value==='热门' ? hotBrands.value : allBrands.filter(b=>b.letter===brandLetter.value))

// 车系列表（按品牌，确保每品牌至少一个车系）
const seriesByBrand = {
  'Audi': ['A3','A4','Q3','Q5'],
  'BMW': ['3 Series','5 Series','X1','X3'],
  'Chevrolet': ['Cruze','Malibu','Captiva'], 'Chery': ['Tiggo 8','Arrizo 5'],
  'Daihatsu': ['Sirion','Terios'],
  'Exeed': ['TXL','LX'],
  'Ford': ['Fiesta','Focus','Ranger'],
  'Geely': ['Boyue','Binyue'], 'GWM': ['Haval H6','ORA Good Cat'],
  'Honda': ['City','Civic','HR-V','CR-V','Jazz'], 'Hyundai': ['i10','Elantra','Tucson'],
  'Isuzu': ['D-Max','MU-X'],
  'Jaguar': ['XE','XF'], 'Jeep': ['Compass','Cherokee'],
  'Kia': ['Picanto','Rio','Cerato','Sportage'],
  'Lexus': ['ES','IS','NX','RX'], 'Land Rover': ['Range Rover Evoque','Discovery Sport'],
  'Mazda': ['Mazda2','Mazda3','CX-3','CX-5','CX-30'], 'Mitsubishi': ['Triton','ASX','Outlander'], 'Mercedes-Benz': ['C-Class','E-Class','GLA','GLC'], 'MINI': ['Cooper','Clubman','Countryman'],
  'Nissan': ['Almera','Teana','X-Trail','Serena','Navara'],
  'Opel': ['Astra','Insignia'], 'ORA': ['Good Cat'],
  'Perodua': ['Myvi','Axia','Bezza','Alza','Aruz'], 'Proton': ['Saga','Persona','Iriz','X50','X70'], 'Peugeot': ['208','308','408','3008'],
  'Qoros': ['3','5'],
  'Renault': ['Captur','Megane','Koleos'],
  'Subaru': ['XV','Forester','Outback'], 'Suzuki': ['Swift','Vitara'],
  'Toyota': ['Vios','Yaris','Corolla','Camry','Hilux'],
  'UAZ': ['Patriot'],
  'Volvo': ['S60','XC60'], 'Volkswagen': ['Polo','Golf','Passat','Tiguan'],
  'Wuling': ['Almaz','Cortez'],
  'XPeng': ['P7','G9'],
  'Yutong': ['ZK6807'],
  'ZEEKR': ['001']
}
const series = ref(String(route.query.series || ''))
const seriesList = computed(()=> seriesByBrand[brand.value] || [])
const maxSeriesShow = 10
const seriesFolded = ref(true)
const shownSeries = computed(()=> seriesFolded.value ? seriesList.value.slice(0, maxSeriesShow) : seriesList.value)
const toggleSeries = ()=>{ seriesFolded.value = !seriesFolded.value }

// 更多筛选
const moreOpen = ref(false)
const sources = ['不限','商家','个人']
const ages = ['不限','1年内','1-3年','3-5年','5-8年','8年以上']
const displacements = ['不限','1.0L以下','1.0-1.6L','1.6-2.0L','2.0-3.0L','3.0L以上']
const mileages = ['不限','3万公里内','3-6万公里','6-10万公里','10万公里以上']
const gearboxes = ['不限','手动','自动']
const colors = ['不限','黑','白','银','灰','红','蓝']

// 恢复筛选状态（此前被误删，导致运行时未定义）
const source = ref(String(route.query.source || '不限'))
const price = ref(String(route.query.price || '不限'))
const body = ref(String(route.query.body || '不限'))
const age = ref(String(route.query.age || '不限'))
const displacement = ref(String(route.query.disp || '不限'))
const mileageRange = ref(String(route.query.mileage || '不限'))
const gearbox = ref(String(route.query.gearbox || '不限'))
const color = ref(String(route.query.color || '不限'))
const onlyVerified = ref(route.query.verified === '1')
const onlyVideo = ref(route.query.video === '1')
const onlyNewEnergy = ref(route.query.ne === '1')
const onlyPersonal = ref(route.query.personal === '1')

// 自定义价格
const customMin = ref('')
const customMax = ref('')
const applyCustomPrice = ()=>{
  if (!customMin.value && !customMax.value) return
  const min = Number(customMin.value || 0)
  const max = Number(customMax.value || 0)
  if (min && max) price.value = `${min}-${max}万`
  else if (min && !max) price.value = `${min}万以上`
  else if (!min && max) price.value = `0-${max}万`
  pushQuery()
}

const list = ref([])
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 12)
// Mock 车图使用 picsum 且提供降级
const carPhoto = (i)=> `https://picsum.photos/seed/used-car-${i}/600/450`
const onImgError = (e)=>{ e.target.onerror = null; e.target.src = 'https://placehold.co/600x450?text=Car' }
// 品牌Logo映射与加载
const brandSlugMap = {
  'Audi': 'audi',
  'BMW': 'bmw',
  'Chevrolet': 'chevrolet',
  'Daihatsu': 'daihatsu',
  'Ford': 'ford',
  'Geely': 'geely',
  'Honda': 'honda',
  'Hyundai': 'hyundai',
  'Isuzu': 'isuzu',
  'Jaguar': 'jaguar',
  'Jeep': 'jeep',
  'Kia': 'kia',
  'Lexus': 'lexus',
  'Land Rover': 'landrover',
  'Mazda': 'mazda',
  'Mitsubishi': 'mitsubishi',
  'Mercedes-Benz': 'mercedes',
  'MINI': 'mini',
  'Nissan': 'nissan',
  'Opel': 'opel',
  'Peugeot': 'peugeot',
  'Proton': 'proton',
  'Renault': 'renault',
  'Subaru': 'subaru',
  'Suzuki': 'suzuki',
  'Toyota': 'toyota',
  'Volvo': 'volvo',
  'Volkswagen': 'volkswagen'
}
const simpleIconUrl = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${slug}.svg`
const brandLogoUrl = (name) => {
  const slug = brandSlugMap[name]
  return slug ? simpleIconUrl(slug) : ''
}
const brandLogoFailed = ref({})
const onBrandLogoError = (e, name)=>{
  e.target.onerror = null
  e.target.style.display = 'none'
  brandLogoFailed.value = { ...brandLogoFailed.value, [name]: true }
}
const generateMock = () => {
  const isEng = !!engCategory.value || body.value==='工程车' || body.value==='货车'
  const allBrandNames = allBrands.map(b=>b.name)
  list.value = Array.from({length: 90}).map((_,i)=>{
    if (isEng) {
      const eng = engCategory.value || engCategories[i % engCategories.length]
      const priceWan = [1,1.2,1.66,2,2.8,3.5,5.8,8.8,12.8,16.8][i%10]
      const title = `${eng}·本地${[3,5,8,12,20][i%5]}方${eng==='洒水车'?'洒水车':eng}急售`
      return {
        id: i+1,
        title,
        priceWan,
        price: `${priceWan}万`,
        mileage: (2 + (i%6)),
        year: 2018 + (i%6),
        gearbox: ['手动','自动'][i%2],
        energy: '油',
        ownerType: i%3===0 ? '个人' : '商家',
        hasVideo: i%4===0,
        verified: i%2===0,
        body: '工程车',
        brand: (brand.value || allBrandNames[i % allBrandNames.length]),
        series: eng,
        color: ['白','黄','绿','蓝'][i%4],
        cover: `https://picsum.photos/seed/eng-${i}/600/450`,
        tags: ['急售','精品','本地车源','可分期'].slice(0, 1 + (i%3)),
        eng
      }
    } else {
      const titleBrand = brand.value || allBrandNames[i % allBrandNames.length]
      const pool = seriesByBrand[titleBrand] || ['City','Vios','Civic','Myvi','Golf','Saga','X70']
      const seriesName = (series.value || pool[i % pool.length])
      const priceWan = [2.1,2.25,1.6,3.8,5.6,8.2,12.5,15.8,22.6,28.0][i%10]
      return {
        id: i+1,
        title: `${titleBrand} ${seriesName} ${2010 + (i%12)}款`,
        priceWan,
        price: `${priceWan}万`,
        mileage: (5 + (i%12)),
        year: 2010 + (i%12),
        gearbox: ['手动','自动'][i%2],
        energy: ['油','电'][i%5===0?1:0],
        ownerType: i%4===0 ? '个人' : '商家',
        hasVideo: i%3===0,
        verified: i%2===0,
        body: ['轿车','SUV/MPV','面包车'][i%3],
        brand: titleBrand,
        series: seriesName,
        color: ['黑','白','银','灰','红','蓝'][i%6],
        cover: carPhoto(i+1),
        tags: ['验真','0次过户','新上架','一手车源','可过户'].slice(0, 1 + (i%3))
      }
    }
  })
}

onMounted(generateMock)

// 监听路由参数变化
watch(() => route.query, (q) => {
  const prevBrand = brand.value
  brandLetter.value = String(q.letter || brandLetter.value)
  brand.value = String(q.brand || '')
  series.value = String(q.series || '')
  price.value = String(q.price || '不限')
  body.value = String(q.body || '不限')
  engCategory.value = String(q.eng || '')
  source.value = String(q.source || '不限')
  age.value = String(q.age || '不限')
  displacement.value = String(q.disp || '不限')
  mileageRange.value = String(q.mileage || '不限')
  gearbox.value = String(q.gearbox || '不限')
  color.value = String(q.color || '不限')
  onlyVerified.value = q.verified === '1'
  onlyVideo.value = q.video === '1'
  onlyNewEnergy.value = q.ne === '1'
  onlyPersonal.value = q.personal === '1'
  page.value = Number(q.page) || 1
  pageSize.value = Number(q.pageSize) || 12
  if (brand.value !== prevBrand) generateMock()
})

// const setSegment = (s)=>{ segment.value=s; page.value=1; pushQuery() }
const setBrandLetter = (ltr)=>{ brandLetter.value=ltr; pushQuery() }
const setBrandLetterHover = (ltr)=>{ brandLetter.value = ltr }
const setBrand = (b)=>{ brand.value=b; page.value=1; pushQuery(); generateMock() }
const setSeries = (m)=>{ series.value=m || ''; page.value=1; pushQuery() }
const setPrice = (p)=>{ price.value=p; page.value=1; pushQuery() }
const setBody = (b)=>{ body.value=b; page.value=1; pushQuery(); generateMock() }
const setEng = (t)=>{ engCategory.value=t || ''; page.value=1; pushQuery(); generateMock() }
const setSource = (s)=>{ source.value=s; page.value=1; pushQuery() }
const setAge = (a)=>{ age.value=a; page.value=1; pushQuery() }
const setDisplacement = (d)=>{ displacement.value=d; page.value=1; pushQuery() }
const setMileage = (m)=>{ mileageRange.value=m; page.value=1; pushQuery() }
const setGearbox = (g)=>{ gearbox.value=g; page.value=1; pushQuery() }
const setColor = (c)=>{ color.value=c; page.value=1; pushQuery() }

const withinPrice = (wan, range)=>{
  if (!range || range==='不限') return true
  if (range.endsWith('以上')) {
    const v = Number(range.replace('万以上',''))
    return wan >= v
  }
  if (/^\d+-\d+万$/.test(range)) {
    const [a,b] = range.replace('万','').split('-').map(Number)
    return wan >= a && wan <= b
  }
  // ranges like '0-3万','3-5万','5-10万', etc.
  if (range.includes('万')) {
    const [a,b] = range.replace('万','').split('-').map(v=> v? Number(v):0)
    if (b) return wan >= a && wan < b
  }
  return true
}

const filtered = computed(()=> list.value.filter(v=>{
  if (brand.value && v.brand !== brand.value) return false
  if (series.value && v.series !== series.value) return false
  if (!withinPrice(v.priceWan, price.value)) return false
  if (body.value !== '不限' && v.body !== body.value) return false
  if (source.value !== '不限' && v.ownerType !== source.value) return false
  if (gearbox.value !== '不限' && v.gearbox !== gearbox.value) return false
  if (color.value !== '不限' && v.color !== color.value) return false
  if (onlyVerified.value && !v.verified) return false
  if (onlyVideo.value && !v.hasVideo) return false
  if (onlyNewEnergy.value && v.energy !== '电') return false
  if (onlyPersonal.value && v.ownerType !== '个人') return false
  return true
}))

const displayed = computed(()=> filtered.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))
const hasMore = computed(()=> filtered.value.length > page.value * pageSize.value)

const pushQuery = ()=>{
  router.replace({ name: 'CarsList', query: {
    letter: brandLetter.value !== '热门' ? brandLetter.value : undefined,
    brand: brand.value || undefined,
    series: series.value || undefined,
    price: price.value !== '不限' ? price.value : undefined,
    body: body.value !== '不限' ? body.value : undefined,
    eng: engCategory.value || undefined,
    source: source.value !== '不限' ? source.value : undefined,
    age: age.value !== '不限' ? age.value : undefined,
    disp: displacement.value !== '不限' ? displacement.value : undefined,
    mileage: mileageRange.value !== '不限' ? mileageRange.value : undefined,
    gearbox: gearbox.value !== '不限' ? gearbox.value : undefined,
    color: color.value !== '不限' ? color.value : undefined,
    verified: onlyVerified.value ? '1' : undefined,
    video: onlyVideo.value ? '1' : undefined,
    ne: onlyNewEnergy.value ? '1' : undefined,
    personal: onlyPersonal.value ? '1' : undefined,
    page: page.value, pageSize: pageSize.value
  } })
}

const goDetail = (car)=>{
  router.push({ name: 'ServiceDetail', params: { id: car.id }, query: { type: 'car' } })
}

const resetFilters = ()=>{
  brandLetter.value = '热门'
  brand.value = ''
  series.value = ''
  price.value = '不限'
  body.value = '不限'
  source.value = '不限'
  age.value = '不限'
  displacement.value = '不限'
  mileageRange.value = '不限'
  gearbox.value = '不限'
  color.value = '不限'
  onlyVerified.value = false
  onlyVideo.value = false
  onlyNewEnergy.value = false
  onlyPersonal.value = false
  page.value=1; generateMock(); pushQuery()
}
const prevPage = ()=>{ if (page.value>1) { page.value -= 1; pushQuery() } }
const nextPage = ()=>{ if (hasMore.value) { page.value += 1; pushQuery() } }

// 当前筛选 chips
const activeChips = computed(()=>{
  const arr = []
  if (brand.value) arr.push({ key: 'brand', label: brand.value })
  if (series.value) arr.push({ key: 'series', label: series.value })
  if (price.value !== '不限') arr.push({ key: 'price', label: price.value })
  if (body.value !== '不限') arr.push({ key: 'body', label: body.value })
  if (engCategory.value) arr.push({ key: 'eng', label: engCategory.value })
  if (source.value !== '不限') arr.push({ key: 'source', label: source.value })
  if (gearbox.value !== '不限') arr.push({ key: 'gearbox', label: gearbox.value })
  if (color.value !== '不限') arr.push({ key: 'color', label: color.value })
  if (onlyVerified.value) arr.push({ key: 'verified', label: '检测保障' })
  if (onlyVideo.value) arr.push({ key: 'video', label: '视频车源' })
  if (onlyNewEnergy.value) arr.push({ key: 'ne', label: '新能源' })
  if (onlyPersonal.value) arr.push({ key: 'personal', label: '个人车源' })
  return arr
})
const removeChip = (key)=>{
  switch(key){
    case 'brand': brand.value=''; break
    case 'series': series.value=''; break
    case 'price': price.value='不限'; break
    case 'body': body.value='不限'; break
    case 'eng': engCategory.value=''; break
    case 'source': source.value='不限'; break
    case 'gearbox': gearbox.value='不限'; break
    case 'color': color.value='不限'; break
    case 'verified': onlyVerified.value=false; break
    case 'video': onlyVideo.value=false; break
    case 'ne': onlyNewEnergy.value=false; break
    case 'personal': onlyPersonal.value=false; break
  }
  page.value=1; pushQuery()
}

const totalCount = computed(()=> filtered.value.length)

// 视图模式：grid 或 list
const viewMode = ref('grid')
</script>

<style scoped>
.list-page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }

.tabs { display: flex; gap: 12px; margin-bottom: 10px; }
.tab { padding: 8px 12px; border: 1px solid #eee; background: #fff; border-radius: 8px; cursor: pointer; color: #333; }
.tab.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.filter-label { color: #666; width: auto; flex: 0 0 auto; white-space: nowrap; margin-right: 6px; }
.filter-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.filter-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
.filter-more { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: none; background: transparent; cursor: pointer; font-size: 13px; color: #ff6a00; }
.filter-more .chev { display: inline-block; transform: rotate(0deg); transition: transform .2s ease; font-size: 12px; color: #ff6a00; }
.filter-more .chev.up { transform: rotate(180deg); }
.letter-row { border-bottom: 1px dashed #f1f3f5; padding-bottom: 8px; margin-bottom: 8px; }
.letter-chip { font-weight: 600; border-radius: 6px; }
.letter-chip:hover { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

/* 美化筛选容器 */
.filters { box-shadow: 0 4px 16px rgba(0,0,0,.04); }

.brand-grid { display: grid; grid-template-columns: repeat(10, minmax(80px, 1fr)); gap: 8px; padding: 6px 0 8px; }
.brand-chip { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e9ecef; border-radius: 6px; padding: 6px 10px; cursor: pointer; background: #fff; transition: box-shadow .2s ease, transform .2s ease; }
.brand-chip:hover { box-shadow: 0 6px 18px rgba(0,0,0,.06); transform: translateY(-1px); }
.brand-chip.active { border-color: #ffd5bf; background: #fff7f1; color: #ff6a00; }
.brand-chip .logo { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #f6f7f9; border: 1px solid #e9ecef; overflow: hidden; }
.brand-chip .logo img { width: 70%; height: 70%; object-fit: contain; display: block; }
.brand-chip .logo-fallback-text { font-size: 12px; color: #666; font-weight: 700; line-height: 1; }
.brand-chip .bn { font-size: 13px; }

.price-inline { display: inline-flex; align-items: center; gap: 6px; margin-left: 8px; }
.price-input { width: 60px; padding: 6px 8px; border: 1px solid #e9ecef; border-radius: 6px; }
.btn-mini { padding: 6px 10px; border: 1px solid #ffd5bf; background: #fff7f1; color: #ff6a00; border-radius: 6px; cursor: pointer; font-size: 12px; }
.dash { color: #999; }
.unit { color: #999; }

.more-row { align-items: flex-start; }
.more-cols { display: grid; grid-template-columns: 1fr; gap: 8px; width: 100%; }
.more-col { display: flex; gap: 8px; align-items: flex-start; width: 100%; padding: 4px 0; }
.more-label { color: #888; width: 40px; flex-shrink: 0; text-align: right; padding-top: 6px; }
.more-col .chips { display: flex; flex-wrap: wrap; gap: 8px; }

/* 更多折叠开关 */
.filter-toggle { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid #ffd5bf; background: #fff; color: #ff6a00; border-radius: 16px; cursor: pointer; font-size: 13px; }
.filter-toggle .chev { display: inline-block; transform: rotate(0deg); transition: transform .2s ease; font-size: 12px; color: #ff6a00; }
.filter-toggle .chev.up { transform: rotate(180deg); }

.active-bar { display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px dashed #f1f3f5; margin-top: 8px; gap: 8px; }
.cur-label { color: #999; margin-right: 4px; }
.cur-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 12px; background: #f6f7f9; color: #555; border: 1px solid #eee; cursor: pointer; margin-right: 6px; font-size: 12px; }
.link-reset { background: transparent; border: none; color: #ff6a00; cursor: pointer; }
.right { display: flex; align-items: center; gap: 12px; }
.right .count { color: #333; font-weight: 600; }
.chk { color: #666; font-size: 13px; }

/* 视图切换按钮（对齐 58 同城右侧两个小图标） */
.view-toggle { display: inline-flex; align-items: center; gap: 4px; margin-left: 6px; background: #f6f7f9; border: 1px solid #e9ecef; border-radius: 999px; padding: 2px; }
.view-btn { width: 36px; height: 30px; border: none; background: transparent; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #9aa0a6; transition: background .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease; }
.view-btn:hover { background: #fff; color: #ff6a00; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.view-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px #ffd5bf; }
.view-btn.active { background: #ff6a00; color: #fff; box-shadow: 0 2px 6px rgba(255,106,0,.25); transform: translateY(-1px); }
.ico-svg { width: 16px; height: 16px; display: inline-block; fill: currentColor; }
.ico-grid rect, .ico-list rect, .ico-list circle { fill: currentColor; }

/* 卡片式列表 */
.car-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 12px; }
.car-grid.list { grid-template-columns: 1fr; }
.car-card { background: #fff; border: 1px solid #f1f3f5; border-radius: 10px; overflow: hidden; cursor: pointer; transition: box-shadow .2s ease; }
.car-card.list { display: grid; grid-template-columns: 240px 1fr; gap: 0; align-items: stretch; }
.car-card:hover { box-shadow: 0 8px 26px rgba(0,0,0,.06); }
.car-thumb { width: 100%; aspect-ratio: 4 / 3; height: auto; object-fit: cover; display: block; }
.car-card.list .car-thumb { height: 100%; width: 100%; object-fit: cover; }
.car-body { padding: 10px; }
.car-title { font-size: 15px; color: #333; font-weight: 600; line-height: 1.35; margin-bottom: 6px; }
.car-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
.tag { background: #f6f7f9; color: #666; border: 1px solid #eee; border-radius: 10px; padding: 2px 8px; font-size: 12px; }
.car-meta { color: #9aa0a6; font-size: 12px; margin-bottom: 8px; }
.car-price { color: #e55a00; font-weight: 800; font-size: 20px; }

.empty-state { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; color: #667085; background: #fafafa; }
.empty-title { font-size: 16px; color: #333; font-weight: 600; }
.empty-desc { font-size: 13px; margin-top: 6px; }
.empty-actions { margin-top: 12px; }
.btn { padding: 8px 14px; background: #ff6b35; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.pagination { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 0; }
.page-btn { padding: 8px 12px; border: 1px solid #f1f3f5; background: #fff; border-radius: 8px; cursor: pointer; }
.page-btn:disabled { color: #999; cursor: not-allowed; }
.page-info { color: #777; font-size: 13px; }

@media (max-width: 1024px) {
  .brand-grid { grid-template-columns: repeat(6, minmax(80px, 1fr)); }
  .car-grid { grid-template-columns: repeat(2, 1fr); }
  .car-grid.list .car-card { grid-template-columns: 200px 1fr; }
}
@media (max-width: 640px) {
  .brand-grid { grid-template-columns: repeat(3, minmax(80px, 1fr)); }
  .more-cols { grid-template-columns: 1fr; }
  .car-grid { grid-template-columns: 1fr; }
  .car-grid.list .car-card { grid-template-columns: 1fr; }
}
</style>


