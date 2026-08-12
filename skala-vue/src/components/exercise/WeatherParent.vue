<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
// 1. 컴포넌트 파일명 국룰 표기법(PascalCase) 매칭 수입
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import StatusBar from './StatusBar.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대전', temp: 22, status: '흐림' },
  { id: 'city_05', name: '광주', temp: 27, status: '맑음' },
  { id: 'city_06', name: '대구', temp: 29, status: '맑음' },
  { id: 'city_07', name: '인천', temp: 23, status: '비' },
  { id: 'city_08', name: '울산', temp: 25, status: '구름' },
  { id: 'city_09', name: '제주', temp: 21, status: '흐림' },
  { id: 'city_10', name: '평창', temp: 15, status: '눈' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedStatus = ref('전체')

const statusOptions = computed(() => {
  const statuses = weatherList.value.map((item) => item.status)
  return ['전체', ...new Set(statuses)]
})

// 기존 핵심 비즈니스 로직(computed, watch)의 소유권은 안전하게 부모 콘텍스트가 격리 유지
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  return weatherList.value.filter((item) => {
    const matchesQuery = !query || item.name.includes(query)
    const matchesStatus = selectedStatus.value === '전체' || item.status === selectedStatus.value
    return matchesQuery && matchesStatus
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watch(selectedStatus, (newStatus) => {
  console.log(`🎯 [watch 감지] 날씨 필터 변경됨 -> "${newStatus}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}', 필터 '${selectedStatus.value}' 기준 필터링 수행`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        :status-options="statusOptions"
        :selected-status="selectedStatus"
        @update-query="(val) => (searchQuery = val)"
        @update-status="(val) => (selectedStatus = val)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <StatusBar :status-message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}
h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
}
.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
  font-weight: 500;
}
</style>
