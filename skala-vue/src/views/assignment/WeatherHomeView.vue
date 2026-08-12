<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import StatusBar from '@/components/exercise/StatusBar.vue'

const router = useRouter()
const route = useRoute()

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
const selectedStatus = ref('전체')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const statusOptions = computed(() => {
  const statuses = weatherList.value.map((item) => item.status)
  return ['전체', ...new Set(statuses)]
})

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 검색어 입력 시 주소창 쿼리 스트링 동기화
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { ...route.query, search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  return weatherList.value.filter((item) => {
    const matchesQuery = !query || item.name.includes(query)
    const matchesStatus = selectedStatus.value === '전체' || item.status === selectedStatus.value
    return matchesQuery && matchesStatus
  })
})

// 상세보기 클릭 시 동적 라우팅 프로그래밍 방식 점프
const handleDetailJump = (id) => {
  router.push(`/assignment/weather/${id}`)
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
        @click-detail="handleDetailJump(item.id)"
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
  width: 100%;
  max-width: 600px;
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
