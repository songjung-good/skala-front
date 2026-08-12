<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mockDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s', uv: '보통', airQuality: '좋음' },
  city_02: { name: '경기도 수원시 영통구', temp: 24, status: '비', humidity: '85%', wind: '4.1m/s', uv: '낮음', airQuality: '좋음' },
  city_03: { name: '부산광역시 해운대구', temp: 26, status: '구름', humidity: '65%', wind: '5.0m/s', uv: '보통', airQuality: '보통' },
  city_04: { name: '대전광역시 유성구', temp: 22, status: '흐림', humidity: '70%', wind: '2.1m/s', uv: '낮음', airQuality: '좋음' },
  city_05: { name: '광주광역시 서구', temp: 27, status: '맑음', humidity: '50%', wind: '1.8m/s', uv: '높음', airQuality: '좋음' },
  city_06: { name: '대구광역시 중구', temp: 29, status: '맑음', humidity: '45%', wind: '2.0m/s', uv: '매우높음', airQuality: '보통' },
  city_07: { name: '인천광역시 연수구', temp: 23, status: '비', humidity: '90%', wind: '6.2m/s', uv: '낮음', airQuality: '좋음' },
  city_08: { name: '울산광역시 남구', temp: 25, status: '구름', humidity: '60%', wind: '3.8m/s', uv: '보통', airQuality: '좋음' },
  city_09: { name: '제주특별자치도 제주시', temp: 21, status: '흐림', humidity: '75%', wind: '5.5m/s', uv: '보통', airQuality: '매우좋음' },
  city_10: { name: '강원특별자치도 평창군', temp: 15, status: '눈', humidity: '80%', wind: '4.5m/s', uv: '낮음', airQuality: '매우좋음' },
}

const cityData = ref(null)

const loadCityData = (id) => {
  const targetId = id || route.params.cityId || route.params.id || 'city_01'
  cityData.value = mockDetails[targetId] || null
}

onMounted(() => {
  loadCityData()
})

watch(() => route.params.cityId, (newId) => {
  loadCityData(newId)
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <div class="detail-grid">
        <p>실시간 기온: <strong>{{ cityData.temp }}°C</strong></p>
        <p>기상 현황: <strong>{{ cityData.status }}</strong></p>
        <p>대기 습도: {{ cityData.humidity }}</p>
        <p>현재 풍속: {{ cityData.wind }}</p>
        <p>자외선 지수: {{ cityData.uv }}</p>
        <p>미세먼지 농도: {{ cityData.airQuality }}</p>
      </div>
    </div>
    <div v-else class="empty-detail">
      <p>😭 해당 지역의 상세 데이터 장부가 존재하지 않습니다. (ID: {{ route.params.cityId || route.params.id }})</p>
    </div>

    <button @click="router.back()" class="back-btn">← 뒤로 가기</button>
    <button @click="router.push('/assignment/weather')" class="home-btn">🏠 날씨 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.info-card h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #2c3e50;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.detail-grid p {
  margin: 0;
  font-size: 14px;
}
.empty-detail {
  padding: 20px 0;
  text-align: center;
  color: #e74c3c;
}
.back-btn,
.home-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 8px;
}
.back-btn {
  background: #7f8c8d;
  color: white;
}
.home-btn {
  background: #3498db;
  color: white;
}
</style>
