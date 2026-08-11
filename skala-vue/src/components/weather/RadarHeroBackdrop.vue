<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import TravelSearchBar from './TravelSearchBar.vue'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
  isLoadingLocation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select-destination',
  'random-destination',
  'my-location',
  'open-forecast-modal',
])

const configStore = useConfigStore()

// 레이더 오버레이 레이어
const selectedLayer = ref('wind') // wind, rain, temp, clouds, waves
const layers = [
  { id: 'wind', label: '💨 바람 (Wind)' },
  { id: 'rain', label: '🌧️ 비 / 레이더 (Radar)' },
  { id: 'temp', label: '🌡️ 기온 (Temp)' },
  { id: 'clouds', label: '☁️ 구름 (Clouds)' },
  { id: 'waves', label: '🌊 파도 (Waves)' },
]

// 뷰 모드: 'hud' (여행 카드 오버레이) vs 'fullmap' (전체 레이더 화면)
const viewMode = ref('hud')

const embedUrl = computed(() => {
  const lat = props.destination?.lat ?? 37.5665
  const lon = props.destination?.lon ?? 126.9780
  return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=6&overlay=${selectedLayer.value}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`
})
</script>

<template>
  <div class="radar-backdrop-container">
    <!-- 1. 배경: 실시간 Windy 인터랙티브 레이더 맵 -->
    <div class="radar-iframe-wrapper" :class="{ 'map-interactive': viewMode === 'fullmap' }">
      <iframe
        :key="`${destination?.lat}-${destination?.lon}-${selectedLayer}`"
        :src="embedUrl"
        class="windy-radar-iframe"
        title="Live Windy Radar Background"
        loading="lazy"
      ></iframe>
    </div>

    <!-- 2. 레이더 제어 상단 툴바 (레이어 전환 & 전체화면 모드 토글) -->
    <div class="radar-top-controls">
      <div class="radar-live-tag">
        <span class="live-pulse"></span>
        <span class="live-text">LIVE RADAR: <strong>{{ destination?.name }}</strong> ({{ destination?.country }})</span>
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
            @click="selectedLayer = ly.id"
          >
            {{ ly.label }}
          </button>
        </div>

        <!-- 뷰 모드 전환 버튼 -->
        <button
          type="button"
          class="btn-mode-toggle"
          @click="viewMode = viewMode === 'hud' ? 'fullmap' : 'hud'"
        >
          {{ viewMode === 'hud' ? '🗺️ 전체 지도 조작 모드' : '🧳 여행 가이드 카드 보기' }}
        </button>
      </div>
    </div>

    <!-- 3. 전면 오버레이 (글래스모피즘 HUD 여행 가이드) -->
    <div class="radar-glass-overlay" :class="{ 'overlay-minimized': viewMode === 'fullmap' }">
      <!-- 상단 글로벌 검색바 -->
      <div class="glass-search-box">
        <TravelSearchBar
          :is-loading-location="isLoadingLocation"
          @select-destination="(dest) => emit('select-destination', dest)"
          @random-destination="() => emit('random-destination')"
          @my-location="() => emit('my-location')"
        />
      </div>

      <!-- 여행 가이드 정보 패널 (HUD 모드일 때 표시) -->
      <div v-show="viewMode === 'hud'" class="glass-guide-panel">
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
              <span class="live-feels-val">체감 {{ configStore.formatTemp(destination.apparentTemp) }} · {{ destination.status }}</span>
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
              <span v-for="(it, i) in destination.essentialItems" :key="i" class="mini-chip">{{ it }}</span>
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
  </div>
</template>

<style scoped>
.radar-backdrop-container {
  position: relative;
  width: 100%;
  min-height: 620px;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid var(--color-border);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
}

/* 1. 배경 레이더 지도 */
.radar-iframe-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #181818;
}

.windy-radar-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none; /* HUD 모드에서는 클릭 관통 */
}

.map-interactive .windy-radar-iframe {
  pointer-events: auto; /* 전체화면 모드에서는 지도 조작 허용 */
}

/* 2. 상단 레이더 툴바 */
.radar-top-controls {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.25rem;
  background: rgba(18, 18, 18, 0.75);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
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
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-layer-pill:hover {
  background: rgba(255, 255, 255, 0.25);
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
  border-radius: 8px;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mode-toggle:hover {
  background: hsla(160, 100%, 32%, 1);
}

/* 3. 글래스모피즘 오버레이 HUD */
.radar-glass-overlay {
  position: relative;
  z-index: 5;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none; /* 부모는 관통 */
  flex: 1;
}

.overlay-minimized {
  justify-content: flex-start;
}

.glass-search-box {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 0.85rem 1.2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  .glass-search-box {
    background: rgba(26, 26, 26, 0.88);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

/* 여행 가이드 패널 */
.glass-guide-panel {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
  max-width: 820px;
  margin-top: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .glass-guide-panel {
    background: rgba(24, 24, 24, 0.9);
    border-color: rgba(255, 255, 255, 0.15);
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
  background: var(--color-background-soft, #f8f9fa);
  border: 1.5px solid var(--color-border);
  padding: 0.5rem 0.9rem;
  border-radius: 12px;
}

.score-main {
  background: #2c3e50;
  color: #fff;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-weight: 800;
  display: flex;
  align-items: baseline;
}

.score-best .score-main { background: #10b981; }
.score-good .score-main { background: #3b82f6; }
.score-fair .score-main { background: #f59e0b; }
.score-poor .score-main { background: #ef4444; }

.score-number { font-size: 1.4rem; line-height: 1; }
.score-unit { font-size: 0.7rem; opacity: 0.8; margin-left: 2px; }

.score-label-wrap { display: flex; flex-direction: column; }
.score-grade-text { font-size: 0.88rem; font-weight: 800; color: var(--color-heading); }
.score-sub-label { font-size: 0.72rem; color: var(--color-text); opacity: 0.7; }

/* 판정 스트라이프 */
.verdict-stripe {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.86rem;
  line-height: 1.45;
  border-left: 4px solid;
}

.score-best.verdict-stripe { background: #ecfdf5; border-color: #10b981; color: #065f46; }
.score-good.verdict-stripe { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
.score-fair.verdict-stripe { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
.score-poor.verdict-stripe { background: #fef2f2; border-color: #ef4444; color: #991b1b; }

.verdict-icon { font-size: 1.1rem; }
.verdict-body strong { display: block; margin-bottom: 2px; }

/* 기상 스펙 */
.weather-summary-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.85rem 1.2rem;
}

.temp-highlight-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.weather-big-emoji { font-size: 2.6rem; line-height: 1; }
.temp-text-group { display: flex; flex-direction: column; }
.live-temp-val { font-size: 1.8rem; font-weight: 800; color: var(--color-heading); line-height: 1; }
.live-feels-val { font-size: 0.78rem; opacity: 0.75; margin-top: 3px; }

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

.q-val { font-weight: 700; color: var(--color-heading); }

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

.t-badge { font-weight: 700; color: var(--color-heading); }
.t-chips { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.mini-chip {
  background: var(--color-background-soft, #eee);
  border: 1px solid var(--color-border);
  padding: 2px 7px;
  border-radius: 5px;
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
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-open-forecast:hover {
  background: hsla(160, 100%, 32%, 1);
}

@media (max-width: 768px) {
  .radar-backdrop-container {
    min-height: 520px;
  }
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
