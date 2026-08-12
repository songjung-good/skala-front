<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import TravelCard from '@/components/travelweather/TravelCard.vue'
import TravelSearchBar from '@/components/travelweather/TravelSearchBar.vue'
import TravelSummary from '@/components/travelweather/TravelSummary.vue'
import TravelDetailModal from '@/components/travelweather/TravelDetailModal.vue'
import {
  defaultCities,
  countryMapping,
  defaultCountryFlags,
  fetchBaseCities,
  fetchLiveCityWeather,
  fetchCountryFlagsApi,
  getCurrentUserLocation,
} from '@/services/weatherService'

// 상태 관리
const cityWeatherList = ref([...defaultCities])
const countryFlags = ref({ ...defaultCountryFlags })
const isLoading = ref(true)
const isLoadingLocation = ref(false)
const dataSource = ref('loading') // 'live' | 'fallback'
const searchQuery = ref('')
const selectedStatus = ref('전체')
const selectedContinent = ref('전체')
const sortBy = ref('score-desc') // 'score-desc' | 'temp-desc' | 'temp-asc' | 'name-asc'
const lastUpdated = ref('')
const selectedCityInfo = ref('도시 카드를 클릭하면 상세 여행 팁과 레이더가 연동됩니다.')
const detailCity = ref(null) // 상세 모달 활성 도시

// 📡 Windy 실시간 레이더 상태
const activeCity = ref(defaultCities[0])
const selectedLayer = ref('wind') // 'wind' | 'rain' | 'temp' | 'clouds'
const isRadarExpanded = ref(true)

const radarLayers = [
  { key: 'wind', label: '💨 바람' },
  { key: 'rain', label: '🌧️ 비/레이더' },
  { key: 'temp', label: '🌡️ 기온' },
  { key: 'clouds', label: '☁️ 구름' },
]

const windyEmbedUrl = computed(() => {
  const city = activeCity.value || defaultCities[0]
  return `https://embed.windy.com/embed2.html?lat=${city.lat}&lon=${city.lon}&detailLat=${city.lat}&detailLon=${city.lon}&width=650&height=350&zoom=5&level=surface&overlay=${selectedLayer.value}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`
})

// RestCountries API 키
const RESTCOUNTRIES_API_KEY =
  import.meta.env.RESTCOUNTRIES_API || import.meta.env.VITE_RESTCOUNTRIES_API

// 비동기 데이터 초기 로드 / 새로고침
const loadWeatherData = async () => {
  isLoading.value = true
  try {
    const baseCities = await fetchBaseCities()
    const weatherResult = await fetchLiveCityWeather(baseCities)
    cityWeatherList.value = weatherResult.data
    dataSource.value = weatherResult.source

    countryFlags.value = await fetchCountryFlagsApi(RESTCOUNTRIES_API_KEY)
    lastUpdated.value = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadWeatherData()
})

// 정적 휴리스틱 점수 계산식 (최적기온 22°C 기준 편차 및 기상 상태 가감점)
const calculateTravelScore = (temp, status) => {
  let score = 100

  // 1. 기온 편차 감점 (최적 22°C에서 1°C 차이당 2.5점 감점)
  const tempDiff = Math.abs(temp - 22)
  score -= Math.round(tempDiff * 2.5)

  // 2. 날씨 상태별 가감점
  const statusPenalties = {
    맑음: 0,
    구름: -5,
    흐림: -15,
    비: -25,
    눈: -20,
  }
  score += statusPenalties[status] ?? -10

  // 0~100점 범위 제한
  return Math.max(0, Math.min(100, score))
}

const getScoreBadge = (score) => {
  if (score >= 85) return { grade: '강력 추천', class: 'score-top', emoji: '🏆' }
  if (score >= 70) return { grade: '추천', class: 'score-good', emoji: '👍' }
  if (score >= 50) return { grade: '보통', class: 'score-normal', emoji: '⚠️' }
  return { grade: '비추천', class: 'score-bad', emoji: '🌧️' }
}

// 고유 날씨 필터 옵션
const statusOptions = computed(() => {
  const statuses = cityWeatherList.value.map((item) => item.status)
  return ['전체', ...new Set(statuses)]
})

// 대륙 필터 옵션
const continentOptions = computed(() => {
  const continents = cityWeatherList.value
    .map((item) => item.continent)
    .filter(Boolean)
  return ['전체', ...new Set(continents)]
})

// 가공된 도시 목록 (여행 점수 및 국기 URL 포함)
const enrichedCityList = computed(() => {
  return cityWeatherList.value.map((city) => {
    const score = calculateTravelScore(city.temp, city.status)
    const flagUrl =
      countryFlags.value[city.country] ||
      `https://flags.restcountries.com/v5/w640/${countryMapping[city.country]?.code || 'kr'}.png`

    return {
      ...city,
      score,
      badge: getScoreBadge(score),
      flagUrl,
    }
  })
})

// 검색어 + 날씨 필터 + 대륙 필터 + 정렬 적용 목록
const filteredCityList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  // 1. 필터링
  const filtered = enrichedCityList.value.filter((city) => {
    const matchesQuery =
      !query ||
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query)
    const matchesStatus = selectedStatus.value === '전체' || city.status === selectedStatus.value
    const matchesContinent =
      selectedContinent.value === '전체' || city.continent === selectedContinent.value

    return matchesQuery && matchesStatus && matchesContinent
  })

  // 2. 정렬
  switch (sortBy.value) {
    case 'score-desc':
      return [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    case 'temp-desc':
      return [...filtered].sort((a, b) => b.temp - a.temp)
    case 'temp-asc':
      return [...filtered].sort((a, b) => a.temp - b.temp)
    case 'name-asc':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    default:
      return filtered
  }
})

// 통계 데이터
const stats = computed(() => {
  const list = filteredCityList.value
  if (list.length === 0) return { count: 0, avgTemp: 0, avgScore: 0 }

  const totalTemp = list.reduce((acc, cur) => acc + cur.temp, 0)
  const totalScore = list.reduce((acc, cur) => acc + cur.score, 0)

  return {
    count: list.length,
    avgTemp: (totalTemp / list.length).toFixed(1),
    avgScore: Math.round(totalScore / list.length),
  }
})

// 감시자
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[안내 변경] "${oldVal}" ➡️ "${newVal}"`)
})

watchEffect(() => {
  console.log(
    `[검색/필터] '${searchQuery.value}' | '${selectedContinent.value}' | '${selectedStatus.value}' | '${sortBy.value}' (결과: ${filteredCityList.value.length}개)`,
  )
})

const handleSelectCity = (city) => {
  activeCity.value = city
  detailCity.value = city
  selectedCityInfo.value = `✈️ ${city.name}(${city.country}) 선택됨 - 기온 ${city.temp}°C, 추천 점수 ${city.score}점 (${city.badge?.grade})`
}

// 필터 및 검색어 초기화
const handleResetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = '전체'
  selectedContinent.value = '전체'
  sortBy.value = 'score-desc'
}

// 🎲 랜덤 여행지 추천
const handleRandomDestination = () => {
  if (filteredCityList.value.length === 0) return
  const list = filteredCityList.value
  const randomPick = list[Math.floor(Math.random() * list.length)]
  if (randomPick) {
    handleSelectCity(randomPick)
  }
}

// 📍 내 위치 날씨 탐색
const handleMyLocation = async () => {
  isLoadingLocation.value = true
  try {
    const loc = await getCurrentUserLocation()
    const weatherResult = await fetchLiveCityWeather([loc])
    if (weatherResult.success && weatherResult.data.length > 0) {
      const enrichedLoc = weatherResult.data[0]
      cityWeatherList.value = [
        enrichedLoc,
        ...cityWeatherList.value.filter((c) => c.id !== 'my_location'),
      ]
      const selected = enrichedCityList.value.find((c) => c.id === 'my_location')
      if (selected) {
        handleSelectCity(selected)
      }
    }
  } catch (err) {
    alert(err.message || '현재 위치를 가져오지 못했습니다. 위치 권한을 확인해주세요.')
  } finally {
    isLoadingLocation.value = false
  }
}
</script>

<template>
  <div class="travel-dashboard">
    <header class="hero-section">
      <p class="desc">실시간 날씨 기반 여행지 점수 및 국가별 기상 가이드</p>
      <div class="hero-title-row">
        <h2>🌍 세계 주요 여행지 날씨</h2>
      </div>
      <span v-if="dataSource === 'live'" class="status-chip live">🟢 open-meteo실시간 연동</span>
      <span v-else-if="dataSource === 'fallback'" class="status-chip fallback">🟡 비연동 모드</span>

      <!-- 동기화 시각 및 아이콘 새로고침 버튼 -->
      <div class="sync-actions">
        <span v-if="lastUpdated" class="last-sync-text">동기화: {{ lastUpdated }}</span>
        <button
          type="button"
          class="btn-refresh-icon"
          :disabled="isLoading"
          @click="loadWeatherData"
          title="날씨 데이터 새로고침"
          aria-label="날씨 데이터 새로고침"
        >
          <span class="refresh-icon" :class="{ spinning: isLoading }">🔄</span>
        </button>
      </div>
    </header>

    <!-- 검색, 정렬 및 필터 (TravelSearchBar 컴포넌트) -->
    <TravelSearchBar
      :search-query="searchQuery"
      :status-options="statusOptions"
      :selected-status="selectedStatus"
      :continent-options="continentOptions"
      :selected-continent="selectedContinent"
      :sort-by="sortBy"
      :is-loading-location="isLoadingLocation"
      @update-query="(val) => (searchQuery = val)"
      @update-status="(val) => (selectedStatus = val)"
      @update-continent="(val) => (selectedContinent = val)"
      @update-sort="(val) => (sortBy = val)"
      @random-pick="handleRandomDestination"
      @my-location="handleMyLocation"
    />

    <!-- 📡 Windy 실시간 위성/기상 레이더 (Lv 3 비주얼 임팩트) -->
    <section class="radar-section">
      <div class="radar-header">
        <div class="radar-title-box">
          <span class="radar-badge">LIVE RADAR</span>
          <h3>📡 실시간 기상 레이더</h3>
          <span class="radar-target">
            관측 도시: <strong>{{ activeCity?.name }} ({{ activeCity?.country }})</strong>
          </span>
        </div>
        <div class="radar-controls">
          <div class="layer-buttons">
            <button
              v-for="layer in radarLayers"
              :key="layer.key"
              type="button"
              class="btn-layer"
              :class="{ active: selectedLayer === layer.key }"
              @click="selectedLayer = layer.key"
            >
              {{ layer.label }}
            </button>
          </div>
          <button
            type="button"
            class="btn-toggle-radar"
            @click="isRadarExpanded = !isRadarExpanded"
          >
            {{ isRadarExpanded ? '▲ 레이더 접기' : '▼ 레이더 펼치기' }}
          </button>
        </div>
      </div>

      <div v-show="isRadarExpanded" class="radar-iframe-wrapper">
        <iframe
          :src="windyEmbedUrl"
          class="windy-frame"
          title="Windy 실시간 레이더"
          frameborder="0"
          loading="lazy"
        ></iframe>
      </div>
    </section>

    <!-- 통계 요약 (TravelSummary 컴포넌트) -->
    <TravelSummary :stats="stats" />

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading && cityWeatherList.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>실시간 날씨 데이터를 동기화하는 중입니다...</p>
    </div>

    <!-- 여행지 도시 카드 리스트 (TravelCard 컴포넌트) -->
    <section v-else class="city-grid">
      <TravelCard
        v-for="city in filteredCityList"
        :key="city.id"
        :city="city"
        @select="handleSelectCity"
      />

      <!-- 검색 결과 없을 때 빈 상태 안내 및 초기화 버튼 -->
      <div v-if="filteredCityList.length === 0" class="empty-state">
        <span class="empty-emoji">🛫</span>
        <h4>일치하는 여행지가 없습니다</h4>
        <p v-if="searchQuery">
          '<strong>{{ searchQuery }}</strong>' 조건에 맞는 도시를 찾을 수 없습니다.
        </p>
        <button type="button" class="btn-reset-filter" @click="handleResetFilters">
          필터 및 검색 초기화
        </button>
      </div>
    </section>

    <!-- 상세 정보 모달 -->
    <TravelDetailModal
      v-if="detailCity"
      :city="detailCity"
      @close="detailCity = null"
    />
  </div>
</template>

<style scoped>
.travel-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 0.5rem;
}

.hero-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.3rem;
}

.sync-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  /* background: var(--color-background-soft, #f8f9fa); */
  /* border: 1px solid var(--color-border); */
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
}

.last-sync-text {
  font-size: 0.76rem;
  color: var(--color-text);
  opacity: 0.75;
}

.btn-refresh-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-refresh-icon:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.08);
}

.btn-refresh-icon:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.refresh-icon {
  display: inline-block;
  font-size: 0.82rem;
  line-height: 1;
  transform-origin: center;
}

.refresh-icon.spinning {
  animation: spin 0.8s linear infinite;
}

.hero-section h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.status-chip {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
}

.status-chip.live {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-chip.fallback {
  background: rgba(241, 196, 15, 0.15);
  color: #d68910;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.hero-section .desc {
  color: var(--color-text);
  font-size: 0.95rem;
  opacity: 0.8;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  color: var(--color-text);
  background: var(--color-background-soft, #f8f9fa);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.1rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.empty-state h4 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-heading);
}

.empty-state p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-text);
  opacity: 0.8;
}

.btn-reset-filter {
  margin-top: 0.75rem;
  padding: 0.55rem 1.2rem;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset-filter:hover {
  background: hsla(160, 100%, 32%, 1);
}

/* 📡 실시간 레이더 섹션 스타일 */
.radar-section {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.radar-header {
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border);
}

.radar-title-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.radar-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0.15rem 0.45rem;
  background: #e74c3c;
  color: #fff;
  border-radius: 4px;
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.radar-title-box h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
}

.radar-target {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.85;
}

.radar-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.layer-buttons {
  display: flex;
  gap: 0.3rem;
}

.btn-layer {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-layer:hover {
  border-color: #3498db;
}

.btn-layer.active {
  background: #3498db;
  color: #fff;
  border-color: #3498db;
}

.btn-toggle-radar {
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-toggle-radar:hover {
  background: rgba(0, 0, 0, 0.05);
}

.radar-iframe-wrapper {
  position: relative;
  width: 100%;
  height: 360px;
  background: #000;
}

.windy-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
