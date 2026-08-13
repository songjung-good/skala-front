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
    <!-- 🚩 배경 국기 레이어 (배경 텍스처로 국기 표시) -->
    <div
      v-if="cityItem.flagUrl"
      class="card-flag-backdrop"
      :style="{ backgroundImage: `url('${cityItem.flagUrl}')` }"
      aria-hidden="true"
    ></div>

    <!-- 🌌 틴트 & 블러 글래스 오버레이 (글자 가독성 보장) -->
    <div class="card-glass-tint" aria-hidden="true"></div>

    <!-- 📋 카드 콘텐츠 레이어 -->
    <div class="card-content-inner">
      <!-- 상단: 도시명, 국가 및 여행 쾌적 지수 뱃지 -->
      <div class="card-header">
        <div class="city-titles">
          <span class="country-name">
            <img
              v-if="cityItem.flagUrl"
              :src="cityItem.flagUrl"
              alt="flag"
              class="flag-icon-img"
            />
            {{ cityItem.country }}
          </span>
          <h3 class="city-name">{{ cityItem.name }}</h3>
          <span class="city-eng">{{ cityItem.engName }}</span>
        </div>

        <div class="score-badge-wrap">
          <!-- 여행 쾌적 지수 뱃지 -->
          <span
            class="travel-score-badge"
            :class="cityItem.travelScoreClass"
            title="여행 쾌적 지수"
          >
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
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(18, 22, 30, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.weather-card:hover {
  border-color: hsla(160, 100%, 45%, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.weather-card.selected {
  border-color: hsla(160, 100%, 42%, 1);
  box-shadow: 0 0 0 2px hsla(160, 100%, 40%, 0.6), 0 8px 24px rgba(0, 189, 126, 0.25);
}

/* 🚩 1. 배경 국기 워터마크 레이어 */
.card-flag-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.35;
  filter: saturate(1.25) contrast(1.1);
  transition: transform 0.35s ease, opacity 0.35s ease;
  z-index: 1;
}

.weather-card:hover .card-flag-backdrop {
  transform: scale(1.08);
  opacity: 0.5;
}

/* 🌌 2. 틴트 글래스 오버레이 (가독성 100% 보장) */
.card-glass-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(14, 18, 26, 0.72) 0%,
    rgba(14, 18, 26, 0.55) 50%,
    rgba(14, 18, 26, 0.78) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.weather-card.selected .card-glass-tint {
  background: linear-gradient(
    135deg,
    rgba(6, 32, 22, 0.78) 0%,
    rgba(6, 32, 22, 0.55) 100%
  );
}

/* 📋 3. 실제 카드 내용 */
.card-content-inner {
  position: relative;
  z-index: 3;
  padding: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
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
  gap: 5px;
}

.flag-icon-img {
  width: 18px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
  vertical-align: middle;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.city-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin: 1px 0 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
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
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 7px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* 중앙 */
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.32);
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
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.btn-map:hover {
  background: rgba(255, 255, 255, 0.35);
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
