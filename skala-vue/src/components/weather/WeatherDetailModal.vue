<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchCityFullDetails } from '@/services/weatherService'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])
const configStore = useConfigStore()

const fullDetails = ref(null)
const isLoading = ref(false)
const errorMsg = ref('')

const loadDetails = async () => {
  if (!props.city) return
  isLoading.value = true
  errorMsg.value = ''
  try {
    const data = await fetchCityFullDetails(props.city)
    // 메인 카드 점수와 100% 일치하도록 보장
    fullDetails.value = {
      ...data,
      travelScore: props.city.travelScore ?? data.travelScore,
      travelGrade: props.city.travelGrade ?? data.travelGrade,
      travelScoreClass: props.city.travelScoreClass ?? data.travelScoreClass,
      travelVerdict: props.city.travelVerdict ?? data.travelVerdict,
      travelAdvice: props.city.travelAdvice ?? data.travelAdvice,
    }
  } catch (err) {
    console.error('Failed to load full forecast:', err)
    errorMsg.value = '상세 예보 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDetails()
})

watch(
  () => props.city?.id,
  () => {
    loadDetails()
  },
)
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <!-- 헤더 -->
      <div class="modal-header">
        <div class="header-city">
          <span class="country-badge">{{ city.country }}</span>
          <h2>
            {{ city.name }} <span class="eng-text">{{ city.engName }}</span>
          </h2>
        </div>
        <button class="btn-close" @click="emit('close')" type="button">✕</button>
      </div>

      <!-- 본문 -->
      <div class="modal-body">
        <div v-if="isLoading" class="loading-box">
          <div class="spinner"></div>
          <p>7일간 여행 기상 예보를 불러오는 중입니다...</p>
        </div>

        <div v-else-if="errorMsg" class="error-box">
          <span>⚠️ {{ errorMsg }}</span>
          <button @click="loadDetails" class="btn-retry">다시 시도</button>
        </div>

        <div v-else-if="fullDetails" class="details-content">
          <!-- 상단: 쾌적 지수 및 기상 브리핑 -->
          <div class="hero-briefing" :class="fullDetails.travelScoreClass">
            <div class="briefing-left">
              <span class="big-weather-icon">{{ fullDetails.icon }}</span>
              <div class="temp-wrap">
                <span class="current-temp">{{ configStore.formatTemp(fullDetails.temp) }}</span>
                <span class="feels-temp">
                  체감 {{ configStore.formatTemp(fullDetails.apparentTemp) }} ·
                  {{ fullDetails.status }}
                </span>
              </div>
            </div>

            <div class="score-badge-box">
              <span class="score-number">{{ fullDetails.travelScore }}점</span>
              <span class="score-text">{{ fullDetails.travelGrade }}</span>
            </div>
          </div>

          <!-- 여행 가이드 코멘트 -->
          <div class="guide-comment-box">
            <strong>✈️ 여행 가이드:</strong> {{ fullDetails.travelVerdict }}
            {{ fullDetails.travelAdvice }}
          </div>

          <!-- 추천 옷차림 & 짐 싸기 팁 -->
          <div class="tips-row">
            <div class="tip-col">
              <span class="tip-label">👕 추천 옷차림:</span>
              <span class="tip-text">{{ fullDetails.outfitText }}</span>
            </div>
            <div class="tip-col">
              <span class="tip-label">🧳 필수 준비물:</span>
              <div class="pack-items">
                <span v-for="(it, i) in fullDetails.essentialItems" :key="i" class="pack-chip">
                  {{ it }}
                </span>
              </div>
            </div>
          </div>

          <!-- 4개 상세 기상 지표 -->
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-icon">💧</span>
              <span class="m-label">습도</span>
              <span class="m-val">{{ fullDetails.humidity }}%</span>
            </div>
            <div class="metric-box">
              <span class="m-icon">💨</span>
              <span class="m-label">풍속 / 풍향</span>
              <span class="m-val"
                >{{ fullDetails.windSpeed }} km/h ({{ fullDetails.windDirection }}°)</span
              >
            </div>
            <div class="metric-box">
              <span class="m-icon">🌧️</span>
              <span class="m-label">강수량</span>
              <span class="m-val">{{ fullDetails.precipitation }} mm</span>
            </div>
            <div class="metric-box">
              <span class="m-icon">🧭</span>
              <span class="m-label">기압</span>
              <span class="m-val">{{ fullDetails.pressure }} hPa</span>
            </div>
          </div>

          <!-- 24시간 시간별 예보 타임라인 -->
          <div class="section-block">
            <h3>⏱️ 24시간 시간별 기온 & 강수 확률</h3>
            <div class="hourly-scroll">
              <div
                v-for="(hour, idx) in fullDetails.hourlyList"
                :key="idx"
                class="hourly-card"
              >
                <span class="h-time">{{ hour.time }}</span>
                <span class="h-icon">{{ hour.icon }}</span>
                <span class="h-temp"
                  ><strong>{{ configStore.formatTemp(hour.temp) }}</strong></span
                >
                <span v-if="hour.precipProb > 0" class="h-rain">🌧️ {{ hour.precipProb }}%</span>
                <span v-else class="h-wind">💨 {{ hour.windSpeed }}km</span>
              </div>
            </div>
          </div>

          <!-- 7일간 주간 여행 예보 -->
          <div class="section-block">
            <h3>📅 7일간 주간 여행 날씨</h3>
            <div class="daily-list">
              <div
                v-for="(day, idx) in fullDetails.dailyList"
                :key="idx"
                class="daily-row"
              >
                <span class="d-date">{{ day.displayDate }}</span>
                <div class="d-status">
                  <span class="d-icon">{{ day.icon }}</span>
                  <span class="d-name">{{ day.status }}</span>
                </div>
                <span v-if="day.precipProb > 0" class="d-rain">🌧️ {{ day.precipProb }}%</span>
                <span v-else class="d-rain-none">☀️ 맑음</span>
                <div class="d-temps">
                  <span class="max-temp">{{ configStore.formatTemp(day.maxTemp) }}</span>
                  <span class="temp-slash">/</span>
                  <span class="min-temp">{{ configStore.formatTemp(day.minTemp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="modal-footer">
        <span class="coord-text"
          >📍 위도: {{ city.lat.toFixed(4) }}, 경도: {{ city.lon.toFixed(4) }}</span
        >
        <button class="btn-confirm" @click="emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.header-city {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.country-badge {
  font-size: 0.75rem;
  background: var(--color-background-soft, #f1f2f6);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--color-text);
  font-weight: 600;
}

.header-city h2 {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-heading);
}

.eng-text {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.6;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.6;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  gap: 1rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: hsla(160, 100%, 37%, 1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* 상단 브리핑 */
.hero-briefing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-radius: 14px;
  background: var(--color-background-soft, #f8f9fa);
  border: 1.5px solid var(--color-border);
}

.hero-briefing.score-best {
  border-color: rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
}
.hero-briefing.score-good {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%);
}
.hero-briefing.score-fair {
  border-color: rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%);
}
.hero-briefing.score-poor {
  border-color: rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%);
}

.briefing-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.big-weather-icon {
  font-size: 3rem;
  line-height: 1;
}

.temp-wrap {
  display: flex;
  flex-direction: column;
}

.current-temp {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;
}

.feels-temp {
  font-size: 0.82rem;
  color: var(--color-text);
  opacity: 0.75;
  margin-top: 4px;
}

.score-badge-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.score-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: #10b981;
}

.score-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-heading);
}

.guide-comment-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.86rem;
  line-height: 1.5;
}

/* 옷차림 팁 */
.tips-row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: var(--color-background-soft, #f8f9fa);
  padding: 0.9rem 1.1rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.tip-col {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-size: 0.84rem;
}

.tip-label {
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
}

.tip-text {
  color: var(--color-text);
}

.pack-items {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.pack-chip {
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border);
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 0.76rem;
  font-weight: 600;
}

/* 4개 지표 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.metric-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-icon {
  font-size: 1rem;
}
.m-label {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.7;
}
.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-heading);
}

/* 시간별 스크롤 */
.section-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-block h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.hourly-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.4rem 0.1rem;
}

.hourly-card {
  flex: 0 0 68px;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
}

.h-time {
  font-size: 0.72rem;
  opacity: 0.7;
}
.h-icon {
  font-size: 1.3rem;
}
.h-temp {
  font-size: 0.85rem;
  color: var(--color-heading);
}
.h-rain {
  font-size: 0.68rem;
  color: #0284c7;
  font-weight: 600;
}
.h-wind {
  font-size: 0.65rem;
  opacity: 0.6;
}

/* 7일 예보 */
.daily-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.daily-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
}

.d-date {
  font-weight: 600;
  width: 100px;
}
.d-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 120px;
}
.d-rain {
  color: #0284c7;
  font-weight: 600;
  width: 80px;
  text-align: center;
}
.d-rain-none {
  opacity: 0.6;
  width: 80px;
  text-align: center;
}
.d-temps {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: auto;
}
.max-temp {
  font-weight: 700;
  color: #e74c3c;
}
.min-temp {
  font-weight: 600;
  color: #0284c7;
}
.temp-slash {
  opacity: 0.4;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-background-soft, #f8f9fa);
}

.coord-text {
  font-size: 0.78rem;
  opacity: 0.6;
}

.btn-confirm {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 600px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
