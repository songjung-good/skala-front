<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// ponytail: 정적 9개 세계 주요 도시 데이터. 향후 국기(Flag Emoji / SVG) 및 날씨 API 연결 예정
const cityWeatherList = ref([
  { id: 'city_01', name: '서울', country: '대한민국', temp: 23, status: '맑음' },
  { id: 'city_02', name: '도쿄', country: '일본', temp: 21, status: '맑음' },
  { id: 'city_03', name: '파리', country: '프랑스', temp: 20, status: '구름' },
  { id: 'city_04', name: '런던', country: '영국', temp: 15, status: '비' },
  { id: 'city_05', name: '뉴욕', country: '미국', temp: 25, status: '맑음' },
  { id: 'city_06', name: '방콕', country: '태국', temp: 34, status: '비' },
  { id: 'city_07', name: '시드니', country: '호주', temp: 18, status: '맑음' },
  { id: 'city_08', name: '카이로', country: '이집트', temp: 36, status: '맑음' },
  { id: 'city_09', name: '로마', country: '이탈리아', temp: 26, status: '맑음' },
])

// 검색어 및 필터 상태
const searchQuery = ref('')
const selectedStatus = ref('전체')
const selectedCityInfo = ref('도시 카드를 클릭하면 상세 여행 팁을 확인합니다.')

// ponytail: 정적 휴리스틱 점수 계산식 (최적기온 22°C 기준 편차 및 기상 상태 가감점). 실무 시 습도/강수확률 계수 추가
const calculateTravelScore = (temp, status) => {
  let score = 100

  // 1. 기온 편차 감점 (최적 22°C에서 1°C 차이당 2.5점 감점)
  const tempDiff = Math.abs(temp - 22)
  score -= Math.round(tempDiff * 2.5)

  // 2. 날씨 상태별 가감점
  const statusPenalties = {
    '맑음': 0,
    '구름': -5,
    '흐림': -15,
    '비': -25,
    '눈': -20,
  }
  score += (statusPenalties[status] ?? -10)

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

// 가공된 도시 목록 (여행 점수 포함)
const enrichedCityList = computed(() => {
  return cityWeatherList.value.map((city) => {
    const score = calculateTravelScore(city.temp, city.status)
    return {
      ...city,
      score,
      badge: getScoreBadge(score),
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
    const matchesStatus =
      selectedStatus.value === '전체' || city.status === selectedStatus.value

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
  console.log(`[검색/필터] '${searchQuery.value}' | '${selectedStatus.value}' (결과: ${filteredCityList.value.length}개)`)
})

const showDetail = (city) => {
  window.alert(
    `[${city.name}, ${city.country}]\n` +
    `현재 날씨: ${city.status} (${city.temp}°C)\n` +
    `여행 추천 점수: ${city.score}점 (${city.badge.grade})`
  )
}
</script>

<template>
  <div class="travel-dashboard">
    <header class="hero-section">
      <h2>🌍 세계 주요 도시 날씨 & 여행 추천 가이드</h2>
      <p class="desc">실시간 날씨 기반 100점 만점 여행 추천 지수</p>
    </header>

    <!-- 검색 및 필터 -->
    <section class="control-box">
      <div class="search-bar">
        <input
          type="text"
          :value="searchQuery"
          @input="(e) => (searchQuery = e.target.value)"
          placeholder="도시 또는 국가 검색 (예: 서울, 프랑스, 도쿄)"
        />
        <span v-if="searchQuery" class="query-preview">
          검색: <strong>{{ searchQuery }}</strong>
        </span>
      </div>

      <div class="filter-bar">
        <span class="filter-title">날씨 필터:</span>
        <button
          v-for="status in statusOptions"
          :key="status"
          type="button"
          class="btn-filter"
          :class="{ active: selectedStatus === status }"
          @click="selectedStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </section>

    <!-- 통계 요약 -->
    <div v-if="filteredCityList.length > 0" class="summary-card">
      <div class="stat-item">
        <span class="stat-label">조회 도시</span>
        <strong>{{ stats.count }}개</strong>
      </div>
      <div class="stat-item">
        <span class="stat-label">평균 기온</span>
        <strong>{{ stats.avgTemp }}°C</strong>
      </div>
      <div class="stat-item">
        <span class="stat-label">평균 여행 점수</span>
        <strong>{{ stats.avgScore }}점</strong>
      </div>
    </div>

    <!-- 도시 리스트 -->
    <section class="city-grid">
      <div
        v-for="city in filteredCityList"
        :key="city.id"
        class="city-card"
        @click="selectedCityInfo = `${city.name}(${city.country}) 선택됨 - 추천 점수 ${city.score}점`"
      >
        <div class="card-header">
          <div class="city-title">
            <h4>{{ city.name }}</h4>
            <span class="country-name">{{ city.country }}</span>
          </div>
          <span class="score-badge" :class="city.badge.class">
            {{ city.badge.emoji }} {{ city.score }}점
          </span>
        </div>

        <div class="weather-info">
          <p class="temp">{{ city.temp }}°C</p>
          <p class="status">{{ city.status }}</p>
        </div>

        <div class="card-footer">
          <span class="grade-text">{{ city.badge.grade }}</span>
          <button class="btn-detail" @click.stop="showDetail(city)">상세보기</button>
        </div>
      </div>

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

.hero-section h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.3rem;
}

.hero-section .desc {
  color: var(--color-text);
  font-size: 0.95rem;
  opacity: 0.8;
}

.control-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  background: var(--color-background, #fff);
  color: var(--color-text);
}

.query-preview {
  font-size: 0.85rem;
  color: var(--color-text);
  white-space: nowrap;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.btn-filter {
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter:hover {
  border-color: hsla(160, 100%, 37%, 0.8);
}

.btn-filter.active {
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border-color: hsla(160, 100%, 37%, 1);
}

.summary-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.75;
}

.stat-item strong {
  font-size: 1.1rem;
  color: var(--color-heading);
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.city-card {
  background: var(--color-background-soft, #fff);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.city-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.city-title h4 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--color-heading);
}

.country-name {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

.score-badge {
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.score-top {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.score-good {
  background: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.score-normal {
  background: rgba(241, 196, 15, 0.15);
  color: #d68910;
}

.score-bad {
  background: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.weather-info {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.temp {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-heading);
}

.status {
  font-size: 0.95rem;
  margin: 0;
  color: var(--color-text);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed var(--color-border);
  padding-top: 0.6rem;
}

.grade-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.85;
}

.btn-detail {
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
}

.btn-detail:hover {
  background: hsla(160, 100%, 37%, 0.15);
  border-color: hsla(160, 100%, 37%, 1);
  color: hsla(160, 100%, 37%, 1);
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
