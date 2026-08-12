<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  WORLD_DESTINATIONS,
  fetchLiveWeatherData,
  getCurrentUserLocation,
  fetchBaseCities,
  fetchCountryFlagsApi,
} from '@/services/weatherService'
import RadarHeroBackdrop from '@/components/weather/RadarHeroBackdrop.vue'
import WeatherControls from '@/components/weather/WeatherControls.vue'
import WeatherLiveCard from '@/components/weather/WeatherLiveCard.vue'
import WeatherStatsSummary from '@/components/weather/WeatherStatsSummary.vue'
import WeatherDetailModal from '@/components/weather/WeatherDetailModal.vue'
import WindySettingsModal from '@/components/weather/WindySettingsModal.vue'

// ==========================================
// 1. 반응형 상태 (ref)
// ==========================================
const worldWeatherList = ref([])
const countryFlags = ref({})
const RESTCOUNTRIES_API_KEY = import.meta.env.VITE_RESTCOUNTRIES_API || ''
const isLoading = ref(true)
const isLoadingLocation = ref(false)
const fetchError = ref('')
const lastUpdated = ref('')

// 현재 탐험 중인 활성 여행지 (접속 시 랜덤 선택)
const activeDestination = ref(
  WORLD_DESTINATIONS[Math.floor(Math.random() * WORLD_DESTINATIONS.length)],
)

// 레이더 배경 레이어 및 전체 지도 조작 모드 상태
const selectedLayer = ref('wind') // wind, rain, temp, clouds, waves
const isMapInteractive = ref(false) // 전체 지도 직접 조작 모드

// 검색, 대륙, 카테고리 및 정렬 상태
const searchQuery = ref('')
const selectedContinent = ref('전체')
const selectedCategory = ref('전체')
const sortBy = ref('score-desc') // 기본: 여행 쾌적 지수 높은 순

// 상태 바 문구
const selectedCityInfo = ref('원하는 여행지를 검색하거나 카드를 클릭해 보세요.')

// 모달 상태
const detailCity = ref(null)
const showSettingsModal = ref(false)

// ==========================================
// 2. 전체 화면 Windy 레이더 iframe URL 계산
// ==========================================
const embedUrl = computed(() => {
  const lat = activeDestination.value?.lat ?? 37.5665
  const lon = activeDestination.value?.lon ?? 126.978
  return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=6&overlay=${selectedLayer.value}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`
})

// ==========================================
// 3. 실시간 데이터 로드
// ==========================================
const loadWeatherData = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    // 1. Base 도시 로드 (cities.json 우선)
    const baseList = await fetchBaseCities()

    // 2. 실시간 날씨 데이터 호출
    const data = await fetchLiveWeatherData(baseList)

    // 3. 국기 이미지 가져오기
    countryFlags.value = await fetchCountryFlagsApi(RESTCOUNTRIES_API_KEY)

    // 4. 국기 URL 바인딩
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

    // 현재 활성 여행지가 있으면 실시간 데이터로 갱신
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
// 4. Computed (필터 및 정렬)
// ==========================================
const categoryOptions = computed(() => {
  const categories = worldWeatherList.value.map((item) => item.category)
  const unique = ['전체', ...new Set(categories.filter(Boolean))]
  return unique.length > 1 ? unique : ['전체', '맑음', '구름', '흐림', '비', '눈']
})

// 검색어 + 대륙 + 날씨 카테고리 + 정렬 결합
const filteredWorldList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  // 1) 필터링
  let list = worldWeatherList.value.filter((item) => {
    // 검색어 (도시명, 영문명, 국가명, 태그)
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      (item.engName && item.engName.toLowerCase().includes(query)) ||
      (item.country && item.country.toLowerCase().includes(query)) ||
      (item.tag && item.tag.toLowerCase().includes(query))

    // 대륙 필터
    const matchesContinent =
      selectedContinent.value === '전체' || item.continent === selectedContinent.value

    // 날씨 상태 카테고리 필터
    const matchesCategory =
      selectedCategory.value === '전체' || item.category === selectedCategory.value

    return matchesQuery && matchesContinent && matchesCategory
  })

  // 2) 정렬
  switch (sortBy.value) {
    case 'score-desc': // 🌟 여행 쾌적 지수 높은 순
      return [...list].sort((a, b) => (b.travelScore ?? 0) - (a.travelScore ?? 0))
    case 'temp-desc': // 🔥 기온 높은 순
      return [...list].sort((a, b) => b.temp - a.temp)
    case 'temp-asc': // ❄️ 기온 낮은 순
      return [...list].sort((a, b) => a.temp - b.temp)
    case 'name-asc': // 🔤 도시명 가나다순
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    case 'wind-desc': // 💨 풍속 빠른 순
      return [...list].sort((a, b) => b.windSpeed - a.windSpeed)
    case 'humidity-desc': // 💧 습도 높은 순
      return [...list].sort((a, b) => b.humidity - a.humidity)
    default:
      return list
  }
})

// ==========================================
// 5. 감시자 (watch, watchEffect)
// ==========================================
watch(activeDestination, (newDest) => {
  if (newDest) {
    selectedCityInfo.value = `✈️ [${newDest.name}, ${newDest.country}] 기온 ${newDest.temp ?? ''}°C, 여행 쾌적도: ${newDest.travelScore ?? 85}점 (${newDest.travelGrade ?? '여행하기 좋음'})`
  }
})

watchEffect(() => {
  console.log(
    `🌍 [watchEffect] 여행지 검색: "${searchQuery.value}", 대륙: "${selectedContinent.value}", 정렬: "${sortBy.value}" (표시: ${filteredWorldList.value.length}개)`,
  )
})

// ==========================================
// 6. 사용자 액션 핸들러
// ==========================================

// 여행지 선택 (검색/칩/카드 클릭)
const handleSelectDestination = async (dest) => {
  const existing = worldWeatherList.value.find((c) => c.id === dest.id)
  if (existing) {
    activeDestination.value = existing
  } else {
    activeDestination.value = dest
    try {
      const [enriched] = await fetchLiveWeatherData([dest])
      if (enriched) activeDestination.value = enriched
    } catch (e) {
      console.warn('단일 날씨 보강 실패:', e)
    }
  }

  // 상단 HUD로 부드럽게 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 🎲 랜덤 여행지 선택
const handleRandomDestination = () => {
  if (worldWeatherList.value.length === 0) return
  const currentId = activeDestination.value?.id
  const candidates = worldWeatherList.value.filter((c) => c.id !== currentId)
  const randomPick = candidates[Math.floor(Math.random() * candidates.length)]
  if (randomPick) {
    activeDestination.value = randomPick
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 📍 내 위치 날씨 탐색
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    alert(err.message || '현재 위치를 가져오지 못했습니다. 위치 권한을 확인해주세요.')
  } finally {
    isLoadingLocation.value = false
  }
}

onMounted(() => {
  const randomInit = WORLD_DESTINATIONS[Math.floor(Math.random() * WORLD_DESTINATIONS.length)]
  activeDestination.value = randomInit
  loadWeatherData()
})
</script>

<template>
  <div class="travel-home-container">
    <!-- 🌟 1. 전체 화면 고정 배경: 실시간 Windy 레이더 지도 -->
    <div class="global-windy-backdrop" :class="{ 'map-interactive': isMapInteractive }">
      <iframe
        :key="`${activeDestination?.lat}-${activeDestination?.lon}-${selectedLayer}`"
        :src="embedUrl"
        class="windy-fullscreen-iframe"
        title="Live Fullscreen Windy Weather Radar"
        loading="lazy"
      ></iframe>
    </div>

    <!-- 🌟 2. Teleport to body: 최상단 z-index로 100% 가려짐 없는 전환 스위치 -->
    <Teleport to="body">
      <div class="global-floating-map-toggle">
        <div v-if="isMapInteractive" class="map-mode-indicator">
          <span class="live-pulse"></span>
          <span
            ><strong>{{ activeDestination?.name }}</strong> 레이더 직접 조작 중</span
          >
        </div>

        <button
          type="button"
          class="btn-global-view-switch"
          :class="{ 'mode-map': isMapInteractive }"
          @click="isMapInteractive = !isMapInteractive"
        >
          <span class="icon">{{ isMapInteractive ? '🧳' : '🗺️' }}</span>
          <span class="text">{{
            isMapInteractive ? '날씨 대시보드로 돌아가기' : '풀스크린 레이더 지도 보기'
          }}</span>
        </button>
      </div>
    </Teleport>

    <!-- 🌟 3. 전면 오버레이: 글래스모피즘 여행 대시보드 UI 레이어 -->
    <div v-show="!isMapInteractive" class="dashboard-glass-layer">
      <!-- 상단: 글래스모피즘 HUD 여행 가이드 -->
      <section v-if="activeDestination" class="radar-hero-stage">
        <RadarHeroBackdrop
          :destination="activeDestination"
          :is-loading-location="isLoadingLocation"
          :selected-layer="selectedLayer"
          :is-map-interactive="isMapInteractive"
          @update:selected-layer="(val) => (selectedLayer = val)"
          @toggle-map-mode="isMapInteractive = !isMapInteractive"
          @select-destination="handleSelectDestination"
          @random-destination="handleRandomDestination"
          @my-location="handleMyLocation"
          @open-forecast-modal="(dest) => (detailCity = dest)"
        />
      </section>

      <!-- 세계 주요 도시 실시간 현황 섹션 -->
      <section class="world-cities-section">
        <div class="section-title-wrap glass-card">
          <div class="title-left">
            <h2>🌍 세계 주요 여행지 실시간 기상 현황</h2>
            <p class="sub-desc">
              카드를 클릭하면 전체 배경 레이더 지도가 해당 도시 좌표로 실시간 이동합니다.
            </p>
          </div>
          <span v-if="lastUpdated" class="sync-time">최근 업데이트: {{ lastUpdated }}</span>
        </div>

        <!-- 컨트롤 툴바 (대륙 탭, 날씨 필터, 정렬, 단위변환) -->
        <WeatherControls
          :search-query="searchQuery"
          :selected-continent="selectedContinent"
          :selected-category="selectedCategory"
          :sort-by="sortBy"
          :is-loading="isLoading"
          :category-options="categoryOptions"
          @update:search-query="(val) => (searchQuery = val)"
          @update:selected-continent="(val) => (selectedContinent = val)"
          @update:selected-category="(val) => (selectedCategory = val)"
          @update:sort-by="(val) => (sortBy = val)"
          @refresh="loadWeatherData"
          @open-settings="showSettingsModal = true"
        />

        <!-- 실시간 통계 요약 & 상태 바 -->
        <WeatherStatsSummary
          :weather-list="filteredWorldList"
          :selected-city-info="selectedCityInfo"
        />

        <!-- 로딩 인디케이터 -->
        <div v-if="isLoading && worldWeatherList.length === 0" class="loading-grid-box glass-card">
          <div class="spinner"></div>
          <p>전 세계 실시간 기상 관측망을 연결하고 있습니다...</p>
        </div>

        <!-- 에러 배너 -->
        <div v-else-if="fetchError" class="error-banner glass-card">
          <span>⚠️ {{ fetchError }}</span>
          <button @click="loadWeatherData" class="btn-retry">다시 시도</button>
        </div>

        <!-- 세계 도시 카드 그리드 -->
        <div v-else class="world-grid">
          <WeatherLiveCard
            v-for="city in filteredWorldList"
            :key="city.id"
            :city-item="city"
            :is-selected="activeDestination?.id === city.id"
            @select-city="handleSelectDestination"
            @view-detail="(dest) => (detailCity = dest)"
            @view-windy-map="handleSelectDestination"
          />
        </div>

        <!-- 검색 결과 없음 -->
        <div v-if="filteredWorldList.length === 0 && !isLoading" class="empty-world-box glass-card">
          <span class="empty-emoji">🛫</span>
          <h3>일치하는 세계 여행지가 없습니다</h3>
          <p>'{{ searchQuery }}' 조건에 맞는 도시를 찾을 수 없습니다.</p>
          <button
            class="btn-reset-filter"
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
      </section>

      <!-- 하단: 실습 및 과제 아카이브 포털 -->
      <section class="portal-archive-section glass-card">
        <div class="portal-header">
          <h3>📖 Vue Learning Lab 학습 아카이브</h3>
          <p>기초 디렉티브 문법 실습부터 컴포지션 API 날씨 과제까지 언제든 확인할 수 있습니다.</p>
        </div>

        <div class="portal-grid">
          <div class="portal-card">
            <div class="portal-icon">💻</div>
            <h4>1일차 실습 코드</h4>
            <p>
              반응형 데이터(ref), v-html, v-text, v-bind, v-if, v-for 등 Vue 기초 핵심 문법 모음
            </p>
            <RouterLink to="/practice/day1" class="btn-portal">1일차 실습 보기 ❯</RouterLink>
          </div>

          <div class="portal-card">
            <div class="portal-icon">⚡</div>
            <h4>2일차 실습 코드</h4>
            <p>v-pre, v-cloak, v-once, v-memo, v-on(이벤트 수식어), v-model(폼 바인딩)</p>
            <RouterLink to="/practice/day2" class="btn-portal">2일차 실습 보기 ❯</RouterLink>
          </div>

          <div class="portal-card highlight">
            <div class="portal-icon">📝</div>
            <h4>일일 과제 확인</h4>
            <p>
              Mockup 날씨 대시보드부터 Composition API, 컴포넌트 분리, 라우터, Pinia 스토어 과제
            </p>
            <RouterLink to="/assignment/day1" class="btn-portal highlight"
              >과제 모음 보기 ❯</RouterLink
            >
          </div>
        </div>
      </section>
    </div>

    <!-- 모달 컴포넌트 -->
    <WeatherDetailModal v-if="detailCity" :city="detailCity" @close="detailCity = null" />

    <WindySettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />
  </div>
</template>

<style scoped>
.travel-home-container {
  position: relative;
  min-height: 100vh;
  padding: 0.5rem 0 3rem;
}

/* 🌟 1. 전체 화면 고정 배경 */
.global-windy-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: #121212;
  pointer-events: none; /* UI 조작 방해 방지 */
}

.global-windy-backdrop.map-interactive {
  pointer-events: auto; /* 전체 지도 모드에서는 드래그/줌 가능 */
  z-index: 10;
}

.windy-fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 🌟 2. 화면 우상단 최상위 고정: 뷰 모드 전환 스위치 (Teleport) */
.global-floating-map-toggle {
  position: fixed;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 999999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: auto;
}

.map-mode-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 0.5rem 0.9rem;
  color: #fff;
  font-size: 0.84rem;
}

.btn-global-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.btn-global-view-switch:hover {
  background: hsla(160, 100%, 37%, 0.9);
  border-color: hsla(160, 100%, 37%, 1);
  color: #fff;
}

.btn-global-view-switch.mode-map {
  background: hsla(160, 100%, 37%, 0.95);
  border-color: hsla(160, 100%, 37%, 1);
  color: #fff;
}

.btn-global-view-switch.mode-map:hover {
  background: hsla(160, 100%, 32%, 1);
}

.live-pulse {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: pulseRed 1.8s infinite;
}

@keyframes pulseRed {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 🌟 3. 전면 오버레이 글래스모피즘 레이어 */
.dashboard-glass-layer {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.radar-hero-stage {
  width: 100%;
}

/* 공통 글래스 카드 룩앤필 */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  box-shadow: none;
}

@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* 세계 도시 섹션 */
.world-cities-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.2rem 1.5rem;
}

.title-left h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-heading);
  margin: 0 0 4px;
}

.sub-desc {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.75;
  margin: 0;
}

.sync-time {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.world-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.25rem;
}

/* 로딩 및 에러 */
.loading-grid-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  gap: 1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: #6c5ce7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.error-banner {
  background: rgba(253, 232, 232, 0.85);
  color: #c81e1e;
  border: 1px solid #f8b4b4;
  padding: 0.75rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-retry {
  background: #c81e1e;
  color: white;
  border: none;
  padding: 0.35rem 0.8rem;
  border-radius: 0;
  cursor: pointer;
}

.empty-world-box {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-emoji {
  font-size: 2.8rem;
}

.btn-reset-filter {
  margin-top: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-weight: 600;
}

/* 아카이브 포털 */
.portal-archive-section {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.portal-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.3rem;
}

.portal-header p {
  font-size: 0.88rem;
  color: var(--color-text);
  opacity: 0.75;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.portal-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  box-shadow: none;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  .portal-card {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.portal-card:hover {
  border-color: hsla(160, 100%, 37%, 0.8);
}

.portal-card.highlight {
  border-color: hsla(160, 100%, 37%, 0.6);
  background: rgba(0, 184, 148, 0.12);
}

.portal-icon {
  font-size: 1.5rem;
}

.portal-card h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.portal-card p {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.75;
  line-height: 1.4;
  flex: 1;
}

.btn-portal {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-portal:hover {
  background: hsla(160, 100%, 37%, 0.25);
  color: hsla(160, 100%, 37%, 1);
}

.btn-portal.highlight {
  background: hsla(160, 100%, 37%, 0.9);
  color: #fff;
}

.btn-portal.highlight:hover {
  background: hsla(160, 100%, 32%, 1);
}

@media (max-width: 768px) {
  .world-grid {
    grid-template-columns: 1fr;
  }
}
</style>
