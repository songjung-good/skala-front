<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-city', 'view-detail', 'view-windy-map'])
const configStore = useConfigStore()
</script>

<template>
  <div
    class="weather-card"
    :class="{ selected: isSelected, [cityItem.tempBadgeClass]: true }"
    @click="emit('select-city', cityItem)"
  >
    <!-- 상단: 도시명, 국가 및 여행 쾌적 지수 뱃지 -->
    <div class="card-header">
      <div class="city-titles">
        <span class="country-name">{{ cityItem.country }}</span>
        <h3 class="city-name">{{ cityItem.name }}</h3>
        <span class="city-eng">{{ cityItem.engName }}</span>
      </div>

      <div class="score-badge-wrap">
        <!-- 여행 쾌적 지수 뱃지 -->
        <span class="travel-score-badge" :class="cityItem.travelScoreClass" title="여행 쾌적 지수">
          🌟 {{ cityItem.travelScore }}점
        </span>
        <!-- 기온 등급 뱃지 -->
        <span class="temp-badge" :class="cityItem.tempBadgeClass">
          {{ cityItem.tempShortLabel }}
        </span>
      </div>
    </div>

    <!-- 태그 -->
    <div v-if="cityItem.tag" class="city-tag-row">
      <span class="city-tag">✨ {{ cityItem.tag }}</span>
    </div>

    <!-- 중앙: 대형 기온 및 날씨 상태 아이콘 -->
    <div class="card-body">
      <div class="temp-display">
        <span class="weather-icon">{{ cityItem.icon }}</span>
        <div class="temp-numbers">
          <span class="main-temp">{{ configStore.formatTemp(cityItem.temp) }}</span>
          <span class="feels-like">
            체감 {{ configStore.formatTemp(cityItem.apparentTemp) }}
          </span>
        </div>
      </div>
      <div class="weather-status-text">
        <span class="status-name">{{ cityItem.status }}</span>
        <span class="status-desc">{{ cityItem.description }}</span>
      </div>
    </div>

    <!-- 하단: 세부 정보 (습도, 풍속, 강수량) -->
    <div class="card-metrics">
      <div class="metric-item" title="습도">
        <span class="metric-icon">💧</span>
        <span class="metric-val">{{ cityItem.humidity }}%</span>
      </div>
      <div class="metric-item" title="풍속">
        <span class="metric-icon">💨</span>
        <span class="metric-val">{{ cityItem.windSpeed }} km/h</span>
      </div>
      <div class="metric-item" title="강수량">
        <span class="metric-icon">🌧️</span>
        <span class="metric-val">{{ cityItem.precipitation }} mm</span>
      </div>
    </div>

    <!-- 카드 푸터: 버튼 액션 (이벤트 버블링 차단 .stop 적용) -->
    <div class="card-actions">
      <button
        type="button"
        class="btn-card btn-map"
        @click.stop="emit('view-windy-map', cityItem)"
        title="이 도시로 레이더 지도 이동"
      >
        🗺️ 레이더 이동
      </button>
      <button
        type="button"
        class="btn-card btn-detail"
        @click.stop="emit('view-detail', cityItem)"
        title="7일간 예보 및 상세정보"
      >
        상세보기 ❯
      </button>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: var(--color-background, #ffffff);
  border: 1.5px solid var(--color-border);
  border-radius: 14px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border-color: hsla(160, 100%, 37%, 0.6);
}

.weather-card.selected {
  border-color: hsla(160, 100%, 37%, 1);
  background: var(--color-background-soft, #f4fbf7);
  box-shadow: 0 0 0 2px hsla(160, 100%, 37%, 0.35), 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* 상단 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.city-titles {
  display: flex;
  flex-direction: column;
}

.country-name {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.65;
  font-weight: 500;
}

.city-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 1px 0 0;
  line-height: 1.2;
}

.city-eng {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.6;
}

.score-badge-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.travel-score-badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  color: white;
  white-space: nowrap;
}

.score-best.travel-score-badge { background: #10b981; }
.score-good.travel-score-badge { background: #3b82f6; }
.score-fair.travel-score-badge { background: #f59e0b; }
.score-poor.travel-score-badge { background: #ef4444; }

/* 뱃지 */
.temp-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  white-space: nowrap;
}

.temp-badge.hot { background: #e74c3c; }
.temp-badge.warm { background: #e67e22; }
.temp-badge.cool { background: #3498db; }
.temp-badge.cold { background: #00cec9; }

/* 태그 */
.city-tag-row {
  margin-top: -2px;
}

.city-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #e67e22;
}

/* 본문 */
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 0;
}

.temp-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-icon {
  font-size: 2rem;
  line-height: 1;
}

.temp-numbers {
  display: flex;
  flex-direction: column;
}

.main-temp {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;
}

.feels-like {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 3px;
}

.weather-status-text {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.status-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-heading);
}

.status-desc {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 1px;
}

/* 메트릭 */
.card-metrics {
  display: flex;
  justify-content: space-around;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.45rem 0.5rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  color: var(--color-text);
}

.metric-icon {
  font-size: 0.8rem;
}

.metric-val {
  font-weight: 600;
}

/* 액션 버튼 */
.card-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: auto;
}

.btn-card {
  flex: 1;
  padding: 0.45rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  background: var(--color-background, #fff);
  color: var(--color-text);
}

.btn-map:hover {
  background: #e0f2fe;
  color: #0288d1;
  border-color: #81d4fa;
}

.btn-detail {
  background: #2c3e50;
  color: #ffffff;
  border-color: #2c3e50;
}

.btn-detail:hover {
  background: #34495e;
  border-color: #34495e;
}
</style>
