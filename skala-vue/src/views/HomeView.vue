<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import TravelCard from '@/components/travelweather/TravelCard.vue'
import TravelSearchBar from '@/components/travelweather/TravelSearchBar.vue'
import TravelSummary from '@/components/travelweather/TravelSummary.vue'
import {
  defaultCities,
  countryMapping,
  defaultCountryFlags,
  fetchBaseCities,
  fetchLiveCityWeather,
  fetchCountryFlagsApi,
} from '@/services/weatherService'

// 상태 관리
const cityWeatherList = ref([...defaultCities])
const countryFlags = ref({ ...defaultCountryFlags })
const isLoading = ref(true)
const dataSource = ref('loading') // 'live' | 'fallback'
const searchQuery = ref('')
const selectedStatus = ref('전체')
const selectedCityInfo = ref('도시 카드를 클릭하면 상세 여행 팁을 확인합니다.')

// RestCountries API 키
const RESTCOUNTRIES_API_KEY =
  import.meta.env.RESTCOUNTRIES_API || import.meta.env.VITE_RESTCOUNTRIES_API

// 비동기 데이터 초기 로드
const loadWeatherData = async () => {
  isLoading.value = true
  try {
    const baseCities = await fetchBaseCities()
    const weatherResult = await fetchLiveCityWeather(baseCities)
    cityWeatherList.value = weatherResult.data
    dataSource.value = weatherResult.source

    countryFlags.value = await fetchCountryFlagsApi(RESTCOUNTRIES_API_KEY)
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

// 검색어 및 날씨 필터 적용 목록
const filteredCityList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return enrichedCityList.value.filter((city) => {
    const matchesQuery =
      !query ||
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query)
    const matchesStatus = selectedStatus.value === '전체' || city.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
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
    `[검색/필터] '${searchQuery.value}' | '${selectedStatus.value}' (결과: ${filteredCityList.value.length}개)`,
  )
})

const handleSelectCity = (city) => {
  selectedCityInfo.value = `${city.name}(${city.country}) 선택됨 - 추천 점수 ${city.score}점`
}

const showDetail = (city) => {
  window.alert(
    `[${city.name}, ${city.country}]\n` +
      `현재 날씨: ${city.status} (${city.temp}°C)\n` +
      `여행 추천 점수: ${city.score}점 (${city.badge.grade})`,
  )
}
</script>

<template>
  <div class="travel-dashboard">
    <header class="hero-section">
      <div class="hero-title-row">
        <h2>🌍 세계 주요 도시 날씨 & 여행지 추천</h2>
        <span v-if="dataSource === 'live'" class="status-chip live">🟢 실시간 날씨 연동 (Open-Meteo)</span>
        <span v-else-if="dataSource === 'fallback'" class="status-chip fallback">🟡 로컬 데이터 모드</span>
      </div>
      <p class="desc">실시간 날씨 기반 여행지 점수 및 국가별 기상 가이드</p>
    </header>

    <!-- 검색 및 필터 (TravelSearchBar 컴포넌트) -->
    <TravelSearchBar
      :search-query="searchQuery"
      :status-options="statusOptions"
      :selected-status="selectedStatus"
      @update-query="(val) => (searchQuery = val)"
      @update-status="(val) => (selectedStatus = val)"
    />

    <!-- 통계 요약 (TravelSummary 컴포넌트) -->
    <TravelSummary :stats="stats" />

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>실시간 날씨 데이터를 동기화하는 중입니다...</p>
    </div>

    <!-- 여행지 도시 카드 리스트 (TravelCard 컴포넌트 분리) -->
    <section v-else class="city-grid">
      <TravelCard
        v-for="city in filteredCityList"
        :key="city.id"
        :city="city"
        @select="handleSelectCity"
        @detail="showDetail"
      />

      <p v-if="filteredCityList.length === 0" class="empty-state">
        검색 결과와 일치하는 여행지가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
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
  padding: 2rem;
  color: #e74c3c;
  font-weight: 600;
}

.status-bar {
  padding: 0.6rem 1rem;
  background: var(--color-background-mute, #eee);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text);
  text-align: center;
}
</style>
