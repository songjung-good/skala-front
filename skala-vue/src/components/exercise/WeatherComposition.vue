<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

/**
 * =========================================================================
 * [과제 요구사항 1] 반응형 상태 관리 (ref)
 * =========================================================================
 */

// 지역별 날씨 원본 데이터 배열 (반응형 상태로 관리)
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

// 사용자 검색어 입력 상태
const searchQuery = ref('')

// 선택된 도시 안내 문구 상태
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

/**
 * =========================================================================
 * [과제 요구사항 5 - 나만의 반응형 상태] 날씨 필터링 상태 추가
 * =========================================================================
 */
// 선택된 날씨 상태 필터 ('전체', '맑음', '비', '구름', '흐림', '눈')
const selectedStatus = ref('전체')

/**
 * =========================================================================
 * [과제 요구사항 2 & 5] Computed 활용
 * =========================================================================
 */

// [나만의 Computed] 날씨 데이터에서 고유한 날씨 상태 목록을 추출하여 필터 버튼 목록 생성
const statusOptions = computed(() => {
  const statuses = weatherList.value.map((item) => item.status)
  return ['전체', ...new Set(statuses)]
})

// [과제 요구사항 2]
// 검색어(searchQuery) 및 선택된 날씨 상태(selectedStatus)에 따라 실시간 필터링된 배열 반환
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  return weatherList.value.filter((item) => {
    // 1) 도시 이름 검색어 포함 여부 확인 (검색어 비어있으면 항상 true)
    const matchesQuery = !query || item.name.includes(query)
    // 2) 날씨 상태 필터 일치 여부 확인 ('전체'면 항상 true)
    const matchesStatus = selectedStatus.value === '전체' || item.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
})

// [나만의 Computed] 현재 필터링되어 화면에 표시 중인 도시들의 평균 기온 계산
const averageTemp = computed(() => {
  if (filteredWeatherList.value.length === 0) return 0
  const total = filteredWeatherList.value.reduce((sum, item) => sum + item.temp, 0)
  return (total / filteredWeatherList.value.length).toFixed(1)
})

/**
 * =========================================================================
 * [과제 요구사항 3 & 5] Watcher (watch, watchEffect)
 * =========================================================================
 */

// [요구사항 3]
// 상태바 문구가 바뀔 때마다 console.log에 나타내기
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 업데이트: "${oldInfo}" ➡️ "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 검색어 '${searchQuery.value}' 기준 필터링 수행 (결과: ${filteredWeatherList.value.length}건)`,
  )
})

// [나만의 Watcher] selectedStatus 감시 (watch)
// 사용자가 날씨 카테고리 필터를 변경할 때 안내 콘솔 출력
watch(selectedStatus, (newStatus) => {
  console.log(`🎯 [나만의 watch 감지] 날씨 필터 변경됨: [${newStatus}]`)
})

// 상세보기 알림 함수 (이벤트 버블링 차단 @click.stop 사용 대상)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 검색 영역 -->
    <section class="search-box">
      <h3>🔍 도시 검색 및 필터</h3>

      <!-- 한글 입력을 고려한 :value 및 @input 양방향 바인딩 처리 -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
      </p>

      <!-- [나만의 기능] 날씨 상태별 필터 버튼 목록  -->
      <div class="filter-group">
        <span class="filter-label">날씨 필터:</span>
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

    <!-- [나만의 기능] 실시간 통계 -->
    <div v-if="filteredWeatherList.length > 0" class="summary-box">
      <span
        >📊 현재 표시 도시: <strong>{{ filteredWeatherList.length }}</strong
        >개</span
      >
      <span
        >🌡️ 평균 기온: <strong>{{ averageTemp }}°C</strong></span
      >
    </div>

    <!-- 지역별 날씨 목록 영역 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 27" class="badge hot">🔥 더움 (27도 이상)</span>
        <span v-else-if="item.temp >= 23" class="badge warm">☀️ 따뜻함 (23도 이상)</span>
        <span v-else-if="item.temp >= 19" class="badge cool">❄️ 선선함 (19도 이상)</span>
        <span v-else class="badge cold">🥶 추움 (19도 미만)</span>

        <!-- 이벤트 버블링 차단 (.stop 수식어) -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
/* [나만의 기능 스타일] 필터 버튼 & 통계 박스 */
.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}
.btn-filter {
  padding: 4px 10px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  background: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-filter:hover {
  background: #e9ecef;
}
.btn-filter.active {
  background: #2c3e50;
  color: #ffffff;
  border-color: #2c3e50;
}
.summary-box {
  display: flex;
  justify-content: space-between;
  background: #eef2f7;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #34495e;
}
.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 20px 0;
  font-weight: 600;
}
</style>
