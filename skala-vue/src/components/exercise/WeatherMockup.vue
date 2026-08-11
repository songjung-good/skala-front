<script setup>
import { ref } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
// 1. id 바인딩한 데이터
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

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <!-- 3. :value, @input을 통해 입력한 글자 출력 -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 1. 데이터를 반복구문을 통해 출력 -->
      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <!-- 2. 기온을 기준으로 라벨링 -->
        <span v-if="item.temp >= 27" class="badge hot">🔥 더움 (27도 이상)</span>
        <span v-else-if="item.temp >= 23" class="badge warm">☀️ 따뜻함 (23도 이상)</span>
        <span v-else-if="item.temp >= 19" class="badge cool">❄️ 선선함 (19도 이상)</span>
        <span v-else class="badge cold">🥶 추움 (19도 미만)</span>

        <!-- 4. 버블링 막기 위해 @click.stop 사용 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
