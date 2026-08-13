<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
  selectedCityInfo: {
    type: String,
    default: '카드를 클릭하거나 도시를 검색해 보세요.',
  },
})

const configStore = useConfigStore()

const totalCities = computed(() => props.weatherList.length)

const avgTemp = computed(() => {
  if (props.weatherList.length === 0) return 0
  const sum = props.weatherList.reduce((acc, curr) => acc + curr.temp, 0)
  return Math.round((sum / props.weatherList.length) * 10) / 10
})

const hottestCity = computed(() => {
  if (props.weatherList.length === 0) return null
  return [...props.weatherList].sort((a, b) => b.temp - a.temp)[0]
})

const coldestCity = computed(() => {
  if (props.weatherList.length === 0) return null
  return [...props.weatherList].sort((a, b) => a.temp - b.temp)[0]
})

const rainyCities = computed(() => {
  return props.weatherList.filter((c) => c.category === '비' || c.precipitation > 0)
})
</script>

<template>
  <div class="stats-container">
    <!-- 실시간 요약 통계 그리드 -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">🏙️ 표시 중인 도시</span>
        <span class="stat-value"><strong>{{ totalCities }}</strong>개</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">🌡️ 평균 기온</span>
        <span class="stat-value highlight">
          <strong>{{ configStore.formatTemp(avgTemp) }}</strong>
        </span>
      </div>

      <div v-if="hottestCity" class="stat-card">
        <span class="stat-label">🔥 최고 기온</span>
        <span class="stat-value hot">
          <strong>{{ hottestCity.name }}</strong> ({{ configStore.formatTemp(hottestCity.temp) }})
        </span>
      </div>

      <div v-if="coldestCity" class="stat-card">
        <span class="stat-label">❄️ 최저 기온</span>
        <span class="stat-value cold">
          <strong>{{ coldestCity.name }}</strong> ({{ configStore.formatTemp(coldestCity.temp) }})
        </span>
      </div>
    </div>

    <!-- 비/눈 소식 알림 바 (조건부 렌더링) -->
    <div v-if="rainyCities.length > 0" class="rain-alert">
      <span class="alert-icon">🌧️</span>
      <span class="alert-text">
        <strong>강수 관측:</strong>
        {{ rainyCities.map((c) => c.name).join(', ') }}
      </span>
    </div>

    <!-- 하단 상태 바 -->
    <div class="status-bar">
      <span class="status-icon">💬</span>
      <span class="status-text">{{ selectedCityInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.45rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.stat-label {
  font-size: 0.72rem;
  color: #cbd5e1;
  font-weight: 600;
}

.stat-value {
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 700;
}

.stat-value.highlight strong {
  color: #2ecc71;
}

.stat-value.hot strong {
  color: #f87171;
}

.stat-value.cold strong {
  color: #60a5fa;
}

.rain-alert {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-size: 0.76rem;
  color: #e0f2fe;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.status-bar {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #86efac;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
