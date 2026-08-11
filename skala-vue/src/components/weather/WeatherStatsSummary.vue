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
        <span class="stat-label">🔥 최고 기온 도시</span>
        <span class="stat-value hot">
          <strong>{{ hottestCity.name }}</strong> ({{ configStore.formatTemp(hottestCity.temp) }})
        </span>
      </div>

      <div v-if="coldestCity" class="stat-card">
        <span class="stat-label">❄️ 최저 기온 도시</span>
        <span class="stat-value cold">
          <strong>{{ coldestCity.name }}</strong> ({{ configStore.formatTemp(coldestCity.temp) }})
        </span>
      </div>
    </div>

    <!-- 비/눈 소식 알림 바 (조건부 렌더링) -->
    <div v-if="rainyCities.length > 0" class="rain-alert">
      <span class="alert-icon">🌧️</span>
      <span class="alert-text">
        <strong>비/강수 소식:</strong>
        {{ rainyCities.map((c) => c.name).join(', ') }} 지역에 강수가 관측되고 있습니다.
      </span>
    </div>

    <!-- 하단 상태 바 (과제 요구사항 연동) -->
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
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.stat-card {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--color-text);
  opacity: 0.75;
  font-weight: 500;
}

.stat-value {
  font-size: 1.05rem;
  color: var(--color-heading);
}

.stat-value.highlight strong {
  color: hsla(160, 100%, 37%, 1);
}

.stat-value.hot strong {
  color: #e74c3c;
}

.stat-value.cold strong {
  color: #0984e3;
}

.rain-alert {
  background: #e1f0fa;
  border: 1px solid #bce0fd;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  color: #0c5460;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-bar {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .status-bar {
    background: rgba(46, 125, 50, 0.2);
    border-color: rgba(46, 125, 50, 0.4);
    color: #81c784;
  }
  .rain-alert {
    background: rgba(12, 84, 96, 0.25);
    border-color: rgba(12, 84, 96, 0.5);
    color: #80deea;
  }
}
</style>
