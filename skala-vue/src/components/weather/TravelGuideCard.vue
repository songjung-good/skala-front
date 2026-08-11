<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-forecast-modal', 'focus-map'])
const configStore = useConfigStore()
</script>

<template>
  <div class="travel-guide-card">
    <!-- 상단: 여행지 헤더 & 태그 -->
    <div class="guide-header">
      <div class="header-main">
        <div class="destination-badge">
          <span class="continent-tag">{{ destination.continent }}</span>
          <span class="country-tag">{{ destination.country }}</span>
        </div>
        <h2 class="destination-name">
          {{ destination.name }}
          <span class="eng-sub">{{ destination.engName }}</span>
        </h2>
        <p v-if="destination.tag" class="destination-tag">✨ {{ destination.tag }}</p>
      </div>

      <!-- 여행 쾌적 지수 원형/게이지 뱃지 -->
      <div class="score-container" :class="destination.travelScoreClass">
        <div class="score-circle">
          <span class="score-val">{{ destination.travelScore }}</span>
          <span class="score-max">/100</span>
        </div>
        <div class="score-info">
          <span class="score-grade">{{ destination.travelGrade }}</span>
          <span class="score-label">여행 쾌적 지수</span>
        </div>
      </div>
    </div>

    <!-- 쾌적 지수 코멘트 & 판정 -->
    <div class="verdict-banner" :class="destination.travelScoreClass">
      <span class="verdict-icon">💡</span>
      <div class="verdict-text">
        <strong>{{ destination.travelVerdict }}</strong>
        <p>{{ destination.travelAdvice }}</p>
      </div>
    </div>

    <!-- 중앙: 실시간 기상 스펙 그리드 -->
    <div class="weather-metrics-row">
      <!-- 기온 & 날씨 요약 -->
      <div class="metric-main-box">
        <span class="weather-big-icon">{{ destination.icon }}</span>
        <div class="temp-group">
          <span class="main-temperature">{{ configStore.formatTemp(destination.temp) }}</span>
          <span class="apparent-temperature">체감 {{ configStore.formatTemp(destination.apparentTemp) }}</span>
        </div>
        <div class="status-group">
          <span class="status-badge">{{ destination.status }}</span>
          <span class="temp-badge" :class="destination.tempBadgeClass">{{ destination.tempShortLabel }}</span>
        </div>
      </div>

      <!-- 4개 미니 기상 메트릭 -->
      <div class="mini-metrics-grid">
        <div class="mini-metric">
          <span class="mini-icon">💧</span>
          <span class="mini-label">습도</span>
          <span class="mini-val">{{ destination.humidity }}%</span>
        </div>
        <div class="mini-metric">
          <span class="mini-icon">💨</span>
          <span class="mini-label">풍속</span>
          <span class="mini-val">{{ destination.windSpeed }} km/h</span>
        </div>
        <div class="mini-metric">
          <span class="mini-icon">🌧️</span>
          <span class="mini-label">강수량</span>
          <span class="mini-val">{{ destination.precipitation }} mm</span>
        </div>
        <div class="mini-metric">
          <span class="mini-icon">🧭</span>
          <span class="mini-label">기압</span>
          <span class="mini-val">{{ destination.pressure }} hPa</span>
        </div>
      </div>
    </div>

    <!-- 하단: 여행 추천 옷차림 & 필수 준비물 -->
    <div class="travel-tips-grid">
      <!-- 추천 옷차림 -->
      <div class="tip-box outfit-box">
        <div class="tip-header">
          <span class="tip-icon">👕</span>
          <h4>오늘의 추천 옷차림</h4>
        </div>
        <p class="tip-desc">{{ destination.outfitText }}</p>
      </div>

      <!-- 여행 준비물 -->
      <div class="tip-box items-box">
        <div class="tip-header">
          <span class="tip-icon">🧳</span>
          <h4>여행 필수 준비물</h4>
        </div>
        <div class="items-list">
          <span
            v-for="(item, idx) in destination.essentialItems"
            :key="idx"
            class="item-chip"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- 액션 푸터 -->
    <div class="guide-footer">
      <button
        type="button"
        class="btn-footer btn-map"
        @click="emit('focus-map')"
      >
        🗺️ Windy 실시간 레이더 보기
      </button>
      <button
        type="button"
        class="btn-footer btn-forecast"
        @click="emit('open-forecast-modal', destination)"
      >
        ⏱️ 24시간 & 7일간 여행 예보 상세 ❯
      </button>
    </div>
  </div>
</template>

<style scoped>
.travel-guide-card {
  background: var(--color-background, #ffffff);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

/* 상단 */
.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.destination-badge {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.continent-tag {
  font-size: 0.72rem;
  font-weight: 700;
  background: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 37%, 1);
  padding: 2px 8px;
  border-radius: 10px;
}

.country-tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.8;
}

.destination-name {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--color-heading);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.eng-sub {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text);
  opacity: 0.6;
}

.destination-tag {
  font-size: 0.88rem;
  font-weight: 600;
  color: #e67e22;
  margin: 0;
}

/* 여행 쾌적 지수 */
.score-container {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: var(--color-background-soft, #f8f9fa);
  border: 1.5px solid var(--color-border);
  padding: 0.65rem 1rem;
  border-radius: 14px;
}

.score-circle {
  display: flex;
  align-items: baseline;
  background: #2c3e50;
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-weight: 800;
}

.score-best .score-circle { background: linear-gradient(135deg, #10b981, #059669); }
.score-good .score-circle { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.score-fair .score-circle { background: linear-gradient(135deg, #f59e0b, #d97706); }
.score-poor .score-circle { background: linear-gradient(135deg, #ef4444, #dc2626); }

.score-val {
  font-size: 1.5rem;
  line-height: 1;
}

.score-max {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 2px;
}

.score-info {
  display: flex;
  flex-direction: column;
}

.score-grade {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-heading);
}

.score-label {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

/* 판정 배너 */
.verdict-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  border-left: 4px solid;
  font-size: 0.88rem;
  line-height: 1.5;
}

.score-best.verdict-banner {
  background: #ecfdf5;
  border-color: #10b981;
  color: #065f46;
}

.score-good.verdict-banner {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.score-fair.verdict-banner {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #92400e;
}

.score-poor.verdict-banner {
  background: #fef2f2;
  border-color: #ef4444;
  color: #991b1b;
}

.verdict-icon {
  font-size: 1.2rem;
  margin-top: 1px;
}

.verdict-text strong {
  display: block;
  font-size: 0.92rem;
  margin-bottom: 2px;
}

.verdict-text p {
  margin: 0;
  opacity: 0.9;
}

/* 기상 스펙 */
.weather-metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metric-main-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.weather-big-icon {
  font-size: 3rem;
  line-height: 1;
}

.temp-group {
  display: flex;
  flex-direction: column;
}

.main-temperature {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;
}

.apparent-temperature {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 4px;
}

.status-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-badge {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-heading);
}

.temp-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  color: white;
}

.temp-badge.hot { background: #e74c3c; }
.temp-badge.warm { background: #e67e22; }
.temp-badge.cool { background: #3498db; }
.temp-badge.cold { background: #00cec9; }

.mini-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.mini-metric {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.mini-icon {
  font-size: 1rem;
}

.mini-label {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

.mini-val {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-left: auto;
}

/* 추천 팁 */
.travel-tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tip-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tip-header h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.tip-desc {
  font-size: 0.85rem;
  color: var(--color-text);
  line-height: 1.5;
  margin: 0;
}

.items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.item-chip {
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-heading);
}

/* 푸터 액션 */
.guide-footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-footer {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: 1.5px solid transparent;
}

.btn-map {
  background: var(--color-background-soft, #eee);
  border-color: var(--color-border);
  color: var(--color-heading);
}

.btn-map:hover {
  background: #e0f2fe;
  color: #0369a1;
  border-color: #7dd3fc;
}

.btn-forecast {
  background: hsla(160, 100%, 37%, 1);
  color: white;
}

.btn-forecast:hover {
  background: hsla(160, 100%, 32%, 1);
}

@media (max-width: 768px) {
  .weather-metrics-row,
  .travel-tips-grid,
  .guide-footer {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
