<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import {
  fetchLiveWeatherData,
  getCurrentUserLocation,
  fetchBaseCities,
  fetchCountryFlagsApi,
  searchCitiesGeocoding,
} from '@/services/weatherService'
import WeatherLiveCard from '@/components/weather/WeatherLiveCard.vue'
import WeatherStatsSummary from '@/components/weather/WeatherStatsSummary.vue'
import WeatherDetailModal from '@/components/weather/WeatherDetailModal.vue'
import WindySettingsModal from '@/components/weather/WindySettingsModal.vue'

// ==========================================
// 1. 상태 관리 (State)
// ==========================================
const configStore = useConfigStore()

const worldWeatherList = ref([])
const countryFlags = ref({})
const RESTCOUNTRIES_API_KEY =
  import.meta.env.REST_COUNTRIES_API_KEY || import.meta.env.VITE_RESTCOUNTRIES_API || ''
const isLoading = ref(true)
const isLoadingLocation = ref(false)
const fetchError = ref('')
const lastUpdated = ref('')

// 사이드바 열림/닫힘 상태
const isSidebarOpen = ref(true)

// 현재 활성 여행지 (지도 중심 및 HUD 기준 기본값 세팅)
const activeDestination = ref({
  id: 'city_01',
  name: '서울',
  engName: 'Seoul',
  country: '대한민국',
  temp: 23,
  apparentTemp: 22,
  status: '맑음',
  icon: '☀️',
  humidity: 50,
  windSpeed: 10,
  precipitation: 0,
  pressure: 1013,
  travelScore: 92,
  travelGrade: '최적',
  travelScoreClass: 'score-best',
  travelVerdict: '여행하기 완벽한 날씨입니다!',
  flagUrl: 'https://flags.restcountries.com/v5/w640/kr.png',
  lat: 37.5665,
  lon: 126.978,
})

// Windy 레이더 레이어 상태
const selectedLayer = ref('wind') // wind, rain, temp, clouds, waves
const layers = [
  { id: 'wind', label: '💨 바람', desc: 'Wind' },
  { id: 'rain', label: '🌧️ 비/레이더', desc: 'Radar' },
  { id: 'temp', label: '🌡️ 기온', desc: 'Temp' },
  { id: 'clouds', label: '☁️ 구름', desc: 'Clouds' },
  { id: 'waves', label: '🌊 파도', desc: 'Waves' },
]

// 검색, 필터, 정렬 상태
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showSearchDropdown = ref(false)
let debounceTimer = null

const selectedContinent = ref('전체')
const continents = ['전체', '아시아', '유럽', '아메리카', '오세아니아']

const selectedCategory = ref('전체')
const sortBy = ref('score-desc')

// 모달 상태
const detailCity = ref(null)
const showSettingsModal = ref(false)

// ==========================================
// 2. Windy 레이더 지도 URL (Computed)
// ==========================================
const embedUrl = computed(() => {
  const lat = activeDestination.value?.lat ?? 37.5665
  const lon = activeDestination.value?.lon ?? 126.978
  return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=6&overlay=${selectedLayer.value}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`
})

// ==========================================
// 3. 실시간 기상 데이터 호출
// ==========================================
const loadWeatherData = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const baseList = await fetchBaseCities()
    const data = await fetchLiveWeatherData(baseList)
    try {
      countryFlags.value = await fetchCountryFlagsApi(RESTCOUNTRIES_API_KEY)
    } catch (flagErr) {
      console.error('❌ [HomeView] RestCountries 국기 데이터 조회 중 에러 발생:', flagErr)
    }

    worldWeatherList.value = data.map((city) => ({
      ...city,
      flagUrl:
        countryFlags.value[
          city.country?.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, '').trim()
        ] || '',
    }))

    lastUpdated.value = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    if (activeDestination.value) {
      const match = worldWeatherList.value.find((c) => c.id === activeDestination.value.id)
      if (match) activeDestination.value = match
    }
  } catch (err) {
    console.error('날씨 데이터 로드 실패:', err)
    fetchError.value = '실시간 세계 기상 데이터를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// ==========================================
// 4. 필터 및 정렬 (Computed)
// ==========================================
const categoryOptions = computed(() => {
  const categories = worldWeatherList.value.map((item) => item.category)
  const unique = ['전체', ...new Set(categories.filter(Boolean))]
  return unique.length > 1 ? unique : ['전체', '맑음', '구름', '흐림', '비', '눈']
})

const filteredWorldList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  let list = worldWeatherList.value.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      (item.engName && item.engName.toLowerCase().includes(query)) ||
      (item.country && item.country.toLowerCase().includes(query)) ||
      (item.tag && item.tag.toLowerCase().includes(query))

    const matchesContinent =
      selectedContinent.value === '전체' || item.continent === selectedContinent.value

    const matchesCategory =
      selectedCategory.value === '전체' || item.category === selectedCategory.value

    return matchesQuery && matchesContinent && matchesCategory
  })

  switch (sortBy.value) {
    case 'score-desc':
      return [...list].sort((a, b) => (b.travelScore ?? 0) - (a.travelScore ?? 0))
    case 'temp-desc':
      return [...list].sort((a, b) => b.temp - a.temp)
    case 'temp-asc':
      return [...list].sort((a, b) => a.temp - b.temp)
    case 'name-asc':
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    case 'wind-desc':
      return [...list].sort((a, b) => b.windSpeed - a.windSpeed)
    case 'humidity-desc':
      return [...list].sort((a, b) => b.humidity - a.humidity)
    default:
      return list
  }
})

// 목록 접기/더보기 상태 (기본 6개 노출)
const isListExpanded = ref(false)
const displayLimit = 6

const displayedWorldList = computed(() => {
  if (
    searchQuery.value.trim() ||
    selectedContinent.value !== '전체' ||
    selectedCategory.value !== '전체' ||
    isListExpanded.value
  ) {
    return filteredWorldList.value
  }
  return filteredWorldList.value.slice(0, displayLimit)
})

// ==========================================
// 5. 검색어 지오코딩 자동완성 Watcher
// ==========================================
watch(searchQuery, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = newVal.trim()
  if (trimmed.length < 2) {
    searchResults.value = []
    showSearchDropdown.value = false
    return
  }

  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const results = await searchCitiesGeocoding(trimmed)
      searchResults.value = results
      showSearchDropdown.value = results.length > 0
    } catch (e) {
      console.error('검색 실패:', e)
    } finally {
      isSearching.value = false
    }
  }, 300)
})

// ==========================================
// 6. 사용자 액션 핸들러
// ==========================================
const handleSelectDestination = async (dest) => {
  showSearchDropdown.value = false
  const existing = worldWeatherList.value.find(
    (c) => c.id === dest.id || (c.name && c.name === dest.name),
  )
  if (existing) {
    activeDestination.value = existing
  } else {
    activeDestination.value = dest
    try {
      const [enriched] = await fetchLiveWeatherData([dest])
      if (enriched) {
        activeDestination.value = enriched
        if (!worldWeatherList.value.some((c) => c.id === enriched.id)) {
          worldWeatherList.value = [enriched, ...worldWeatherList.value]
        }
      }
    } catch (e) {
      console.warn('단일 날씨 보강 실패:', e)
    }
  }
}

const handleRandomDestination = () => {
  if (worldWeatherList.value.length === 0) return
  const currentId = activeDestination.value?.id
  const candidates = worldWeatherList.value.filter((c) => c.id !== currentId)
  const randomPick = candidates[Math.floor(Math.random() * candidates.length)]
  if (randomPick) {
    activeDestination.value = randomPick
  }
}

const handleMyLocation = async () => {
  isLoadingLocation.value = true
  try {
    const loc = await getCurrentUserLocation()
    const [enriched] = await fetchLiveWeatherData([loc])
    if (enriched) {
      worldWeatherList.value = [
        enriched,
        ...worldWeatherList.value.filter((c) => c.id !== 'my_location'),
      ]
      activeDestination.value = enriched
    }
  } catch (err) {
    alert(err.message || '현재 위치를 가져오지 못했습니다. 위치 권한을 확인해주세요.')
  } finally {
    isLoadingLocation.value = false
  }
}

onMounted(async () => {
  await loadWeatherData()
  if (!activeDestination.value && worldWeatherList.value.length > 0) {
    activeDestination.value =
      worldWeatherList.value[Math.floor(Math.random() * worldWeatherList.value.length)]
  }
})
</script>

<template>
  <div class="gis-container">
    <!-- ========================================== -->
    <!-- 🗺️ 1. 메인 뷰: 화면 100% 채우는 인터랙티브 Windy 지도 -->
    <!-- ========================================== -->
    <div class="gis-map-viewport">
      <iframe
        :key="`${activeDestination?.lat}-${activeDestination?.lon}-${selectedLayer}`"
        :src="embedUrl"
        class="windy-gis-iframe"
        title="Live Interactive Windy Weather Radar"
        loading="lazy"
      ></iframe>

      <!-- 지도 좌상단: 통합 플로팅 툴바 (상태 태그 + 레이어 스위처 + 퀵 액션) -->
      <div class="map-floating-top">
        <!-- 1) 실시간 레이더 상태 뱃지 -->
        <div class="radar-status-badge">
          <span class="live-dot"></span>
          <span class="radar-text">
            LIVE RADAR: <strong>{{ activeDestination?.name }}</strong> ({{
              activeDestination?.country
            }})
          </span>
        </div>

        <!-- 2) 기상 레이어 선택 버튼 (바람, 비, 기온, 구름, 파도) -->
        <div class="floating-layer-pills">
          <button
            v-for="ly in layers"
            :key="ly.id"
            type="button"
            class="btn-floating-pill"
            :class="{ active: selectedLayer === ly.id }"
            @click="selectedLayer = ly.id"
            :title="`${ly.label} (${ly.desc}) 레이어로 전환`"
          >
            {{ ly.label }}
          </button>
        </div>

        <!-- 3) 퀵 액션 버튼 (새로고침, 랜덤, 내위치, 동기화) -->
        <div class="floating-quick-actions">
          <button
            type="button"
            class="btn-floating-action"
            :disabled="isLoading"
            @click="loadWeatherData"
            title="실시간 날씨 새로고침"
          >
            <span class="action-icon" :class="{ spin: isLoading }">🔄</span>
            <span class="action-text">새로고침</span>
          </button>

          <button
            type="button"
            class="btn-floating-action"
            @click="handleRandomDestination"
            title="세계 다른 여행지로 즉시 이동"
          >
            <span class="action-icon">🎲</span>
            <span class="action-text">랜덤 여행지</span>
          </button>

          <button
            type="button"
            class="btn-floating-action"
            :disabled="isLoadingLocation"
            @click="handleMyLocation"
            title="내 현재 위치 날씨 및 레이더 탐색"
          >
            <span class="action-icon">📍</span>
            <span class="action-text">{{ isLoadingLocation ? '위치 탐색중...' : '내 위치' }}</span>
          </button>

          <span v-if="lastUpdated" class="floating-sync-text"> {{ lastUpdated }} 동기화 </span>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 🧳 2. 우측 사이드바: 지도 위 플로팅 글래스모피즘 패널 -->
    <!-- ========================================== -->
    <aside class="gis-sidebar" :class="{ collapsed: !isSidebarOpen }">
      <!-- 사이드바 접기/펼치기 토글 탭 -->
      <button
        type="button"
        class="btn-sidebar-toggle"
        @click="isSidebarOpen = !isSidebarOpen"
        :title="isSidebarOpen ? '사이드바 접기 (지도 넓게 보기)' : '사이드바 열기 (목록 보기)'"
        :aria-label="isSidebarOpen ? '사이드바 접기' : '사이드바 열기'"
      >
        <span class="toggle-icon">{{ isSidebarOpen ? '❯' : '❮' }}</span>
        <span class="toggle-text">{{ isSidebarOpen ? '접기' : '목록' }}</span>
      </button>

      <!-- 사이드바 내부 스크롤 컨테이너 -->
      <div class="sidebar-scroll-content">
        <!-- 1) [상단] 현재 탐험 중인 도시 HUD 카드 & 글로벌 툴 -->
        <div v-if="activeDestination" class="active-hud-card">
          <!-- 상단 브랜드 & 툴바 -->
          <div class="hud-top-bar">
            <div class="brand-group">
              <span class="brand-emoji">🌍</span>
              <h1 class="brand-title">세계 여행 날씨</h1>
            </div>

            <div class="header-tools">
              <!-- 단위 토글 (선택: 초록색 / 미선택: 흰색) -->
              <button
                type="button"
                class="tool-btn unit-toggle-btn"
                @click="configStore.toggleUnit"
                :title="`기온 단위 변경 (현재: ${configStore.unit === 'celsius' ? '섭씨 ℃' : '화씨 ℉'})`"
              >
                <span class="unit-opt" :class="{ active: configStore.unit === 'celsius' }">℃</span>
                <span class="unit-divider">/</span>
                <span class="unit-opt" :class="{ active: configStore.unit === 'fahrenheit' }"
                  >℉</span
                >
              </button>

              <!-- Windy 설정 모달 버튼 -->
              <button
                type="button"
                class="tool-btn settings-btn"
                @click="showSettingsModal = true"
                title="Windy 레이더 설정"
              >
                ⚙️
              </button>
            </div>
          </div>

          <!-- 활성 도시 기본 정보 & 쾌적도 -->
          <div class="hud-top">
            <div class="hud-dest-titles">
              <div class="hud-country-tag">
                <img
                  v-if="activeDestination.flagUrl"
                  :src="activeDestination.flagUrl"
                  alt="flag"
                  class="mini-flag-img"
                />
                <span>{{ activeDestination.country }}</span>
              </div>
              <h2 class="hud-dest-name">
                {{ activeDestination.name }}
                <span class="hud-eng">{{ activeDestination.engName }}</span>
              </h2>
            </div>

            <!-- 여행 쾌적 지수 뱃지 -->
            <div class="hud-score-badge" :class="activeDestination.travelScoreClass">
              <span class="score-num">{{ activeDestination.travelScore }}</span>
              <span class="score-label">{{ activeDestination.travelGrade }}</span>
            </div>
          </div>

          <!-- 기온 & 체감온도 & 상태 -->
          <div class="hud-weather-row">
            <div class="hud-temp-block">
              <span class="hud-weather-icon">{{ activeDestination.icon }}</span>
              <div class="hud-temp-texts">
                <span class="hud-current-temp">{{
                  configStore.formatTemp(activeDestination.temp)
                }}</span>
                <span class="hud-feels-temp">
                  체감 {{ configStore.formatTemp(activeDestination.apparentTemp) }} ·
                  {{ activeDestination.status }}
                </span>
              </div>
            </div>

            <div class="hud-mini-metrics">
              <div class="hud-m-item" title="습도">
                <span class="m-ico">💧</span>
                <span class="m-val">{{ activeDestination.humidity }}%</span>
              </div>
              <div class="hud-m-item" title="풍속">
                <span class="m-ico">💨</span>
                <span class="m-val">{{ activeDestination.windSpeed }}km/h</span>
              </div>
              <div class="hud-m-item" title="강수량">
                <span class="m-ico">🌧️</span>
                <span class="m-val">{{ activeDestination.precipitation }}mm</span>
              </div>
              <div class="hud-m-item" title="기압">
                <span class="m-ico">🧭</span>
                <span class="m-val">{{ activeDestination.pressure }}hPa</span>
              </div>
            </div>
          </div>

          <!-- 팁 코멘트 & 상세 모달 버튼 -->
          <div class="hud-footer-row">
            <div class="hud-advice-strip" v-if="activeDestination.travelVerdict">
              <span class="advice-ico">💡</span>
              <span class="advice-txt">{{ activeDestination.travelVerdict }}</span>
            </div>

            <button type="button" class="btn-open-forecast" @click="detailCity = activeDestination">
              ⏱️ 7일간 상세 예보 보기 ❯
            </button>
          </div>
        </div>

        <!-- 2) [중단] 도시 검색 및 필터 제어 카드 (도시 목록 바로 위) -->
        <div class="sidebar-header-card">
          <!-- 검색 영역 타이틀 -->
          <div class="search-section-header">
            <span class="search-section-title">🔍 여행지 검색</span>
            <span class="search-section-sub">도시명 또는 국가로 탐색</span>
          </div>

          <!-- 실시간 검색창 -->
          <div class="sidebar-search-box">
            <span class="search-ico">🔍</span>
            <input
              type="text"
              v-model="searchQuery"
              @focus="showSearchDropdown = searchResults.length > 0"
              placeholder="도시·국가·관광지 검색..."
              class="sidebar-search-input"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="btn-search-clear"
              @click="searchQuery = ''"
            >
              ✕
            </button>

            <!-- 자동완성 검색 결과 드롭다운 -->
            <div v-if="showSearchDropdown && searchResults.length > 0" class="search-drop-panel">
              <div
                v-for="res in searchResults"
                :key="res.id"
                class="search-drop-item"
                @click="handleSelectDestination(res)"
              >
                <span class="drop-icon">📍</span>
                <div class="drop-info">
                  <span class="drop-name"
                    ><strong>{{ res.name }}</strong></span
                  >
                  <span class="drop-country">{{ res.country || res.tag }}</span>
                </div>
                <span class="drop-arrow">이동 ❯</span>
              </div>
            </div>
          </div>

          <!-- 대륙 필터 칩 -->
          <div class="filter-chip-row continent-chips">
            <button
              v-for="c in continents"
              :key="c"
              type="button"
              class="filter-chip"
              :class="{ active: selectedContinent === c }"
              @click="selectedContinent = c"
            >
              {{ c }}
            </button>
          </div>

          <!-- 날씨 상태 및 정렬 바 -->
          <div class="filter-bottom-bar">
            <div class="weather-category-chips">
              <button
                v-for="cat in categoryOptions"
                :key="cat"
                type="button"
                class="weather-chip"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </button>
            </div>

            <select v-model="sortBy" class="sidebar-sort-select">
              <option value="score-desc">🌟 쾌적순</option>
              <option value="temp-desc">🔥 고온순</option>
              <option value="temp-asc">❄️ 저온순</option>
              <option value="name-asc">🔤 가나다순</option>
              <option value="wind-desc">💨 바람순</option>
              <option value="humidity-desc">💧 습도순</option>
            </select>
          </div>
        </div>

        <!-- 3) [본문] 통계 요약 & 도시 카드 리스트 (검색창 바로 밑에 연결) -->
        <div class="sidebar-cards-section">
          <!-- 4종 컴팩트 통계 그리드 -->
          <WeatherStatsSummary :weather-list="filteredWorldList" />

          <div class="section-badge-row">
            <span class="list-heading"
              >🌍 세계 주요 도시 목록 ({{ filteredWorldList.length }})</span
            >
            <span class="list-tip">클릭 시 지도 이동</span>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="isLoading && worldWeatherList.length === 0" class="sidebar-loading-box">
            <div class="spinner"></div>
            <p>실시간 세계 기상 관측망 로드 중...</p>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="fetchError" class="sidebar-error-box">
            <span>⚠️ {{ fetchError }}</span>
            <button @click="loadWeatherData" class="btn-retry">재시도</button>
          </div>

          <!-- 빈 목록 상태 -->
          <div v-else-if="filteredWorldList.length === 0 && !isLoading" class="sidebar-empty-box">
            <span>🛫</span>
            <p>일치하는 여행지가 없습니다.</p>
            <button
              type="button"
              class="btn-reset-filters"
              @click="
                () => {
                  searchQuery = ''
                  selectedContinent = '전체'
                  selectedCategory = '전체'
                  sortBy = 'score-desc'
                }
              "
            >
              필터 초기화
            </button>
          </div>

          <!-- 카드 리스트 -->
          <div v-else class="sidebar-cards-list">
            <WeatherLiveCard
              v-for="city in displayedWorldList"
              :key="city.id"
              :city-item="city"
              :is-selected="activeDestination?.name === city.name"
              @select-city="handleSelectDestination"
              @view-detail="(dest) => (detailCity = dest)"
              @view-windy-map="handleSelectDestination"
            />

            <!-- 일부 노출 시 더보기 버튼 -->
            <button
              v-if="
                filteredWorldList.length > displayLimit &&
                !searchQuery.trim() &&
                selectedContinent === '전체' &&
                selectedCategory === '전체'
              "
              type="button"
              class="btn-expand-list"
              @click="isListExpanded = !isListExpanded"
            >
              <span>{{
                isListExpanded
                  ? '▲ 주요 도시 접기'
                  : `▼ 전체 도시 더보기 (+${filteredWorldList.length - displayLimit}개)`
              }}</span>
            </button>
          </div>
        </div>

        <!-- 4) [하단] 아카이브 링크 포털 -->
        <div class="sidebar-portal-footer">
          <div class="portal-link-group">
            <RouterLink to="/practice" class="portal-sub-link">
              <span>💻 실습 코드 ❯</span>
            </RouterLink>
            <RouterLink to="/assignment" class="portal-sub-link highlight">
              <span>📝 일일 과제 모음 ❯</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </aside>

    <!-- 모달 컴포넌트 -->
    <WeatherDetailModal v-if="detailCity" :city="detailCity" @close="detailCity = null" />
    <WindySettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />
  </div>
</template>

<style scoped>
/* ========================================================= */
/* 🌟 GIS 메인 컨테이너 (Full Screen Canvas) */
/* ========================================================= */
.gis-container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 58px);
  overflow: hidden;
  background: #0d0f12;
}

/* ========================================================= */
/* 🗺️ 메인 영역: 화면 100% 채우는 Windy 레이더 지도 */
/* ========================================================= */
.gis-map-viewport {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #111317;
  overflow: hidden;
}

.windy-gis-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 지도 좌상단 플로팅 컨트롤 */
.map-floating-top {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: auto;
}

.radar-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-size: 0.82rem;
  color: #ffffff;
  width: fit-content;
}

.live-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 10px #2ecc71;
  animation: pulse-dot 1.8s infinite;
}

@keyframes pulse-dot {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

.floating-layer-pills {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding: 0.35rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: fit-content;
}

.btn-floating-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-floating-pill:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.btn-floating-pill.active {
  background: hsla(160, 100%, 37%, 0.95);
  color: #fff;
  border-color: hsla(160, 100%, 45%, 1);
  box-shadow: 0 2px 8px rgba(0, 189, 126, 0.4);
}

.floating-quick-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 0.35rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  width: fit-content;
}

.btn-floating-action {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.25);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-floating-action:hover:not(:disabled) {
  background: rgba(0, 189, 126, 0.4);
  color: #fff;
  border-color: hsla(160, 100%, 37%, 0.8);
}

.btn-floating-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.floating-sync-text {
  font-size: 0.72rem;
  font-weight: 600;
  color: #f1f2f6;
  padding: 0 0.35rem;
  white-space: nowrap;
}

/* ========================================================= */
/* 🧳 우측 사이드바: 지도 위 플로팅 글래스모피즘 패널 */
/* ========================================================= */
.gis-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  height: 100%;
  z-index: 30;
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 36px rgba(0, 0, 0, 0.5);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.gis-sidebar.collapsed {
  transform: translateX(100%);
}

/* 사이드바 접기/펼치기 버튼 (상하 중앙 배치) */
.btn-sidebar-toggle {
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 80px;
  border-radius: 12px 0 0 12px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-right: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-shadow: -4px 4px 16px rgba(0, 0, 0, 0.35);
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s ease;
  z-index: 40;
}

.btn-sidebar-toggle:hover {
  background: rgba(0, 189, 126, 0.5);
  color: #fff;
  transform: translateY(-50%) translateX(-2px);
}

.toggle-icon {
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
}

.toggle-text {
  font-size: 0.65rem;
  font-weight: 700;
  writing-mode: horizontal-tb;
}

/* 사이드바 내부 스크롤 컨테이너 */
.sidebar-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-scroll-content::-webkit-scrollbar {
  width: 6px;
}
.sidebar-scroll-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.sidebar-scroll-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.sidebar-scroll-content::-webkit-scrollbar-thumb:hover {
  background: hsla(160, 100%, 37%, 0.8);
}

/* 2) 도시 검색 및 필터 제어 영역 (사이드바 일체형 구조, 하단 구분선 적용) */
.sidebar-header-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.22);
  border-radius: 0;
  padding: 0.25rem 0.25rem 1.15rem 0.25rem;
  box-shadow: none;
}

.search-section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 0.1rem;
}

.search-section-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.search-section-sub {
  font-size: 0.7rem;
  color: #cbd5e1;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.brand-emoji {
  font-size: 1.25rem;
}

.brand-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.header-tools {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.25);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.unit-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0.25rem 0.55rem;
  user-select: none;
}

.unit-opt {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  opacity: 0.65;
  transition: all 0.2s ease;
}

.unit-opt.active {
  color: #2ecc71;
  font-weight: 800;
  opacity: 1;
  text-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
}

.unit-divider {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 400;
}

/* 검색창 */
.sidebar-search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-ico {
  position: absolute;
  left: 10px;
  font-size: 0.85rem;
  opacity: 0.8;
  pointer-events: none;
}

.sidebar-search-input {
  width: 100%;
  padding: 0.55rem 2rem 0.55rem 2.2rem;
  font-size: 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.sidebar-search-input:focus {
  border-color: hsla(160, 100%, 37%, 1);
}

.btn-search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 4px;
}

.search-drop-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgba(26, 29, 36, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.search-drop-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s;
}

.search-drop-item:hover {
  background: hsla(160, 100%, 37%, 0.3);
}

.drop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.drop-name {
  font-size: 0.85rem;
  color: #fff;
}

.drop-country {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.drop-arrow {
  font-size: 0.72rem;
  color: hsla(160, 100%, 37%, 1);
  font-weight: 700;
}

/* 필터 칩 */
.filter-chip-row {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.2);
  color: #f1f2f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
}

.filter-chip.active {
  background: #6c5ce7;
  color: #fff;
  border-color: #a29bfe;
  font-weight: 800;
}

.filter-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.weather-category-chips {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  flex: 1;
}

.weather-chip {
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  cursor: pointer;
}

.weather-chip.active {
  background: hsla(160, 100%, 37%, 0.95);
  color: #fff;
  border-color: hsla(160, 100%, 45%, 1);
  font-weight: 800;
}

.sidebar-sort-select {
  padding: 0.25rem 0.5rem;
  font-size: 0.74rem;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(20, 24, 32, 0.85);
  color: #ffffff;
  outline: none;
  cursor: pointer;
}

/* 1) 활성 여행지 HUD (사이드바 상단 일체형 헤더 구조, 하단 구분선 적용) */
.active-hud-card {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.22);
  border-radius: 0;
  padding: 0.25rem 0.25rem 1.15rem 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: none;
}

.hud-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.15rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}

.hud-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hud-dest-titles {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.hud-country-tag {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #e2e8f0;
  font-weight: 600;
}

.mini-flag-img {
  width: 18px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.hud-dest-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.hud-eng {
  font-size: 0.8rem;
  font-weight: 500;
  color: #cbd5e1;
}

.hud-score-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  background: #2c3e50;
  color: #fff;
  min-width: 54px;
}

.hud-score-badge.score-best {
  background: linear-gradient(135deg, #10b981, #059669);
}
.hud-score-badge.score-good {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}
.hud-score-badge.score-fair {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}
.hud-score-badge.score-poor {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.score-num {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
}

.score-label {
  font-size: 0.62rem;
  font-weight: 700;
  opacity: 0.9;
}

.hud-weather-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  gap: 0.6rem;
}

.hud-temp-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hud-weather-icon {
  font-size: 2rem;
  line-height: 1;
}

.hud-temp-texts {
  display: flex;
  flex-direction: column;
}

.hud-current-temp {
  font-size: 1.45rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}

.hud-feels-temp {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.hud-mini-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.35rem 0.6rem;
}

.hud-m-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  color: #f1f2f6;
  font-weight: 600;
}

.hud-footer-row {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.hud-advice-strip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #86efac;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
}

.btn-open-forecast {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  border: none;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: center;
}

.btn-open-forecast:hover {
  background: hsla(160, 100%, 32%, 1);
}

/* 3) 통계 바 */
.sidebar-stats-row {
  width: 100%;
}

/* 4) 도시 카드 섹션 */
.sidebar-cards-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.section-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
}

.list-heading {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.list-tip {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.sidebar-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.btn-expand-list {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-expand-list:hover {
  background: rgba(0, 189, 126, 0.35);
  border-color: hsla(160, 100%, 45%, 1);
  color: #fff;
}

.sidebar-loading-box,
.sidebar-error-box,
.sidebar-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.85rem;
  text-align: center;
}

.spinner {
  width: 26px;
  height: 26px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: hsla(160, 100%, 37%, 1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-retry,
.btn-reset-filters {
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  cursor: pointer;
}

/* 5) 푸터 아카이브 링크 */
.sidebar-portal-footer {
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.portal-link-group {
  display: flex;
  gap: 0.5rem;
}

.portal-sub-link {
  flex: 1;
  text-align: center;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.portal-sub-link:hover {
  background: rgba(0, 189, 126, 0.4);
  color: #fff;
  border-color: hsla(160, 100%, 45%, 1);
}

.portal-sub-link.highlight {
  border-color: rgba(108, 92, 231, 0.6);
  color: #f1f2f6;
  background: rgba(108, 92, 231, 0.35);
}

.portal-sub-link.highlight:hover {
  background: rgba(108, 92, 231, 0.55);
  color: #fff;
}

/* ========================================================= */
/* 📱 반응형 (모바일 & 태블릿) */
/* ========================================================= */
@media (max-width: 900px) {
  .gis-container {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 58px);
  }

  .gis-map-viewport {
    position: relative;
    height: 50vh;
    min-height: 350px;
  }

  .gis-sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    transform: none !important;
  }

  .btn-sidebar-toggle {
    display: none;
  }
}
</style>
