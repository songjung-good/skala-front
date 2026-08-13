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
        <span class="country-name">
          <img v-if="cityItem.flagUrl" :src="cityItem.flagUrl" alt="flag" class="flag-icon-img" />
          {{ cityItem.country }}
        </span>
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
          <span class="feels-like"> 체감 {{ configStore.formatTemp(cityItem.apparentTemp) }} </span>
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
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: 12px;
  padding: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.weather-card:hover {
  background: rgba(255, 255, 255, 0.42);
  border-color: hsla(160, 100%, 42%, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.weather-card.selected {
  border-color: hsla(160, 100%, 37%, 1);
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 0 0 2px hsla(160, 100%, 37%, 0.45), 0 6px 22px rgba(0, 0, 0, 0.3);
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
  font-size: 0.75rem;
  color: #e2e8f0;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.flag-icon-img {
  width: 18px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
  vertical-align: middle;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.city-name {
  font-size: 1.22rem;
  font-weight: 800;
  color: #ffffff;
  margin: 1px 0 0;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.city-eng {
  font-size: 0.75rem;
  color: #cbd5e1;
  font-weight: 500;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.score-best.travel-score-badge { background: #10b981; }
.score-good.travel-score-badge { background: #3b82f6; }
.score-fair.travel-score-badge { background: #f59e0b; }
.score-poor.travel-score-badge { background: #ef4444; }

/* 뱃지 */
.temp-badge {
  font-size: 0.68rem;
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
  font-size: 0.74rem;
  font-weight: 600;
  color: #fef08a;
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 7px;
  border-radius: 4px;
  width: fit-content;
}

/* 중앙 */
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
}

.temp-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-icon {
  font-size: 1.85rem;
  line-height: 1;
}

.temp-numbers {
  display: flex;
  flex-direction: column;
}

.main-temp {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
}

.feels-like {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.weather-status-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
}

.status-desc {
  font-size: 0.7rem;
  color: #cbd5e1;
}

/* 하단 메트릭 */
.card-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.metric-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.35rem;
  border-radius: 6px;
  font-size: 0.72rem;
  color: #f1f2f6;
  font-weight: 600;
}

.metric-icon {
  font-size: 0.78rem;
}

/* 카드 액션 버튼 */
.card-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.15rem;
}

.btn-card {
  flex: 1;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.btn-map {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.btn-map:hover {
  background: rgba(255, 255, 255, 0.38);
  border-color: rgba(255, 255, 255, 0.6);
}

.btn-detail {
  background: hsla(160, 100%, 37%, 0.9);
  color: white;
  border-color: hsla(160, 100%, 45%, 1);
}

.btn-detail:hover {
  background: hsla(160, 100%, 32%, 1);
}
</style>
