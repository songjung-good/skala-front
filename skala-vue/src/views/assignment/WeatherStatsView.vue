<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cityStats = ref([
  { name: '대구', temp: 29, status: '맑음', label: '최고 기온 🥇' },
  { name: '평창', temp: 15, status: '눈', label: '최저 기온 ❄️' },
  { name: '서울', temp: 28, status: '맑음', label: '수도권 중심' },
  { name: '부산', temp: 26, status: '구름', label: '해양 기후' },
  { name: '제주', temp: 21, status: '흐림', label: '도서 지역' },
])

const averageTemp = computed(() => {
  const total = cityStats.value.reduce((acc, cur) => acc + cur.temp, 0)
  return (total / cityStats.value.length).toFixed(1)
})
</script>

<template>
  <div class="stats-view-container">
    <h3>📈 전국 기상 분석 및 통계 리포트</h3>
    <hr />

    <div class="summary-cards">
      <div class="stat-badge">
        <span>전국 평균 기온</span>
        <strong>{{ averageTemp }}°C</strong>
      </div>
      <div class="stat-badge">
        <span>모니터링 지역</span>
        <strong>{{ cityStats.length }}개 시/군</strong>
      </div>
    </div>

    <div class="ranking-section">
      <h4>🏆 주요 도시 기상 요약</h4>
      <div v-for="item in cityStats" :key="item.name" class="stat-row">
        <span class="city-name">{{ item.name }}</span>
        <span class="status">{{ item.status }}</span>
        <span class="temp">{{ item.temp }}°C</span>
        <span class="tag">{{ item.label }}</span>
      </div>
    </div>

    <button @click="router.push('/assignment/weather')" class="home-btn">← 날씨 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.stats-view-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.summary-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.stat-badge {
  flex: 1;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-badge span {
  font-size: 12px;
  color: #666;
}
.stat-badge strong {
  font-size: 18px;
  color: #2c3e50;
}
.ranking-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #2c3e50;
}
.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
}
.city-name {
  font-weight: 600;
  color: #2c3e50;
}
.temp {
  font-weight: bold;
  color: #e74c3c;
}
.tag {
  font-size: 12px;
  background: #eef2f7;
  padding: 2px 6px;
  border-radius: 4px;
  color: #555;
}
.home-btn {
  margin-top: 15px;
  padding: 10px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
}
</style>
