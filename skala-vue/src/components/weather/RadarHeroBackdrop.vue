<script setup>
import { useConfigStore } from '@/stores/configStore'
import TravelSearchBar from './TravelSearchBar.vue'

defineProps({
  destination: {
    type: Object,
    required: true,
  },
  isLoadingLocation: {
    type: Boolean,
    default: false,
  },
  selectedLayer: {
    type: String,
    default: 'wind',
  },
  isMapInteractive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select-destination',
  'random-destination',
  'my-location',
  'open-forecast-modal',
  'update:selectedLayer',
  'toggle-map-mode',
])

const configStore = useConfigStore()

const layers = [
  { id: 'wind', label: '💨 바람 (Wind)' },
  { id: 'rain', label: '🌧️ 비 / 레이더 (Radar)' },
  { id: 'temp', label: '🌡️ 기온 (Temp)' },
  { id: 'clouds', label: '☁️ 구름 (Clouds)' },
  { id: 'waves', label: '🌊 파도 (Waves)' },
]
</script>

<template>
  <div class="radar-hud-container">
    <!-- 1. 상단 레이더 제어 바 (레이어 전환 & 전체화면 모드 토글) -->
    <div class="radar-top-controls">
      <div class="radar-live-tag">
        <span class="live-pulse"></span>
        <span class="live-text"
          >LIVE RADAR: <strong>{{ destination?.name }}</strong> ({{
            destination?.country
          }})</span
        >
      </div>

      <div class="controls-right">
        <!-- 레이어 선택 -->
        <div class="layer-pill-group">
          <button
            v-for="ly in layers"
            :key="ly.id"
            type="button"
            class="btn-layer-pill"
            :class="{ active: selectedLayer === ly.id }"
            @click="emit('update:selectedLayer', ly.id)"
          >
            {{ ly.label }}
          </button>
        </div>

        <!-- 뷰 모드 전환 버튼 -->
        <button
          type="button"
          class="btn-mode-toggle"
          :class="{ active: isMapInteractive }"
          @click="emit('toggle-map-mode')"
        >
          {{ isMapInteractive ? '🧳 대시보드 복귀' : '🗺️ 배경 지도 직접 조작' }}
        </button>
      </div>
    </div>

    <!-- 2. 글로벌 검색바 -->
    <div class="glass-search-box">
      <TravelSearchBar
        :is-loading-location="isLoadingLocation"
        @select-destination="(dest) => emit('select-destination', dest)"
        @random-destination="() => emit('random-destination')"
        @my-location="() => emit('my-location')"
      />
    </div>

    <!-- 3. 선택된 여행지 HUD 패널 -->
    <div class="glass-guide-panel">
      <!-- 헤더: 여행지명 & 쾌적 지수 -->
      <div class="panel-header">
        <div class="dest-info">
          <span class="dest-badge">{{ destination.continent }} · {{ destination.country }}</span>
          <h2 class="dest-title">
            {{ destination.name }}
            <span class="dest-eng">{{ destination.engName }}</span>
          </h2>
          <p v-if="destination.tag" class="dest-tag">✨ {{ destination.tag }}</p>
        </div>

        <!-- 쾌적 지수 게이지 -->
        <div class="score-badge-card" :class="destination.travelScoreClass">
          <div class="score-main">
            <span class="score-number">{{ destination.travelScore }}</span>
            <span class="score-unit">/100</span>
          </div>
          <div class="score-label-wrap">
            <span class="score-grade-text">{{ destination.travelGrade }}</span>
            <span class="score-sub-label">여행 쾌적 지수</span>
          </div>
        </div>
      </div>

      <!-- 판정 및 코멘트 배너 -->
      <div class="verdict-stripe" :class="destination.travelScoreClass">
        <span class="verdict-icon">💡</span>
        <div class="verdict-body">
          <strong>{{ destination.travelVerdict }}</strong>
          <span>{{ destination.travelAdvice }}</span>
        </div>
      </div>

      <!-- 기온 및 미니 지표 요약 -->
      <div class="weather-summary-grid">
        <div class="temp-highlight-box">
          <span class="weather-big-emoji">{{ destination.icon }}</span>
          <div class="temp-text-group">
            <span class="live-temp-val">{{ configStore.formatTemp(destination.temp) }}</span>
            <span class="live-feels-val"
              >체감 {{ configStore.formatTemp(destination.apparentTemp) }} ·
              {{ destination.status }}</span
            >
          </div>
        </div>

        <div class="quick-metrics-row">
          <div class="q-metric">
            <span class="q-icon">💧</span>
            <span class="q-label">습도</span>
            <span class="q-val">{{ destination.humidity }}%</span>
          </div>
          <div class="q-metric">
            <span class="q-icon">💨</span>
            <span class="q-label">풍속</span>
            <span class="q-val">{{ destination.windSpeed }} km/h</span>
          </div>
          <div class="q-metric">
            <span class="q-icon">🌧️</span>
            <span class="q-label">강수량</span>
            <span class="q-val">{{ destination.precipitation }} mm</span>
          </div>
        </div>
      </div>

      <!-- 추천 옷차림 & 팁 -->
      <div class="tips-accordion">
        <div class="tip-inline">
          <span class="t-badge">👕 추천 옷차림:</span>
          <span class="t-text">{{ destination.outfitText }}</span>
        </div>
        <div class="tip-inline">
          <span class="t-badge">🧳 필수 준비물:</span>
          <div class="t-chips">
            <span
              v-for="(it, i) in destination.essentialItems"
              :key="i"
              class="mini-chip"
              >{{ it }}</span
            >
          </div>
        </div>
      </div>

      <!-- 푸터: 상세 예보 모달 열기 -->
      <div class="panel-footer">
        <button
          type="button"
          class="btn-open-forecast"
          @click="emit('open-forecast-modal', destination)"
        >
          ⏱️ 24시간 & 7일간 여행 예보 타임라인 보기 ❯
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radar-hud-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

/* 1. 상단 레이더 툴바 */
.radar-top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.25rem;
  background: rgba(18, 18, 18, 0.65);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  color: #fff;
  box-shadow: none;
}

.radar-live-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.live-pulse {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: pulseRed 1.8s infinite;
}

@keyframes pulseRed {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.layer-pill-group {
  display: flex;
  gap: 0.25rem;
}

.btn-layer-pill {
  padding: 0.3rem 0.6rem;
  font-size: 0.76rem;
  border-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-layer-pill:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-layer-pill.active {
  background: #ff5722;
  border-color: #ff5722;
  font-weight: 700;
}

.btn-mode-toggle {
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 0;
  background: hsla(160, 100%, 37%, 0.85);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mode-toggle:hover {
  background: hsla(160, 100%, 32%, 1);
}

.btn-mode-toggle.active {
  background: #e67e22;
}

/* 2. 글래스모피즘 검색 박스 */
.glass-search-box {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  padding: 0.85rem 1.2rem;
  box-shadow: none;
}

@media (prefers-color-scheme: dark) {
  .glass-search-box {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* 3. 여행 가이드 패널 */
.glass-guide-panel {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: none;
}

@media (prefers-color-scheme: dark) {
  .glass-guide-panel {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.dest-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dest-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6c5ce7;
}

.dest-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-heading);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.dest-eng {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.6;
}

.dest-tag {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e67e22;
  margin: 0;
}

/* 쾌적 지수 */
.score-badge-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.5rem 0.9rem;
  border-radius: 0;
  box-shadow: none;
}

@media (prefers-color-scheme: dark) {
  .score-badge-card {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.score-main {
  background: #2c3e50;
  color: #fff;
  padding: 0.35rem 0.65rem;
  border-radius: 0;
  font-weight: 800;
  display: flex;
  align-items: baseline;
}

.score-best .score-main {
  background: #10b981;
}
.score-good .score-main {
  background: #3b82f6;
}
.score-fair .score-main {
  background: #f59e0b;
}
.score-poor .score-main {
  background: #ef4444;
}

.score-number {
  font-size: 1.4rem;
  line-height: 1;
}
.score-unit {
  font-size: 0.7rem;
  opacity: 0.8;
  margin-left: 2px;
}

.score-label-wrap {
  display: flex;
  flex-direction: column;
}
.score-grade-text {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--color-heading);
}
.score-sub-label {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.7;
}

/* 판정 스트라이프 */
.verdict-stripe {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 0;
  font-size: 0.86rem;
  line-height: 1.45;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 4px solid;
  box-shadow: none;
}

.score-best.verdict-stripe {
  background: rgba(236, 253, 245, 0.6);
  border-color: #10b981;
  color: #065f46;
}
.score-good.verdict-stripe {
  background: rgba(239, 246, 255, 0.6);
  border-color: #3b82f6;
  color: #1e40af;
}
.score-fair.verdict-stripe {
  background: rgba(255, 251, 235, 0.6);
  border-color: #f59e0b;
  color: #92400e;
}
.score-poor.verdict-stripe {
  background: rgba(254, 242, 242, 0.6);
  border-color: #ef4444;
  color: #991b1b;
}

.verdict-icon {
  font-size: 1.1rem;
}
.verdict-body strong {
  display: block;
  margin-bottom: 2px;
}

/* 기상 스펙 */
.weather-summary-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
  padding: 0.85rem 1.2rem;
  box-shadow: none;
}

@media (prefers-color-scheme: dark) {
  .weather-summary-grid {
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.temp-highlight-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.weather-big-emoji {
  font-size: 2.6rem;
  line-height: 1;
}
.temp-text-group {
  display: flex;
  flex-direction: column;
}
.live-temp-val {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;
}
.live-feels-val {
  font-size: 0.78rem;
  opacity: 0.75;
  margin-top: 3px;
}

.quick-metrics-row {
  display: flex;
  gap: 1.2rem;
}

.q-metric {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
}

.q-val {
  font-weight: 700;
  color: var(--color-heading);
}

/* 팁 */
.tips-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.84rem;
}

.tip-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.t-badge {
  font-weight: 700;
  color: var(--color-heading);
}
.t-chips {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.mini-chip {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 7px;
  border-radius: 0;
  font-size: 0.76rem;
  font-weight: 600;
}

.panel-footer {
  display: flex;
  margin-top: 0.25rem;
}

.btn-open-forecast {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0;
  font-size: 0.88rem;
  font-weight: 700;
  background: hsla(160, 100%, 37%, 0.85);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-open-forecast:hover {
  background: hsla(160, 100%, 32%, 1);
}

@media (max-width: 768px) {
  .radar-top-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .controls-right {
    justify-content: space-between;
  }
  .weather-summary-grid {
    flex-direction: column;
    align-items: stretch;
  }
  .quick-metrics-row {
    justify-content: space-around;
  }
}
</style>
