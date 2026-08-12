<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

// 날씨 상태 및 기온 기반 실시간 여행 옷차림/준비물 가이드
const travelTips = computed(() => {
  const { status, temp } = props.city
  const tips = []

  if (temp >= 28) {
    tips.push('☀️ 자외선 차단제와 선글라스를 챙기세요. 통풍이 잘되는 시원한 옷차림을 추천합니다.')
  } else if (temp >= 20) {
    tips.push('👕 활동하기 아주 쾌적한 날씨입니다. 가벼운 셔츠나 반팔 차림이 적당합니다.')
  } else if (temp >= 10) {
    tips.push('🧥 아침저녁으로 쌀쌀할 수 있으니 가벼운 외투나 가디건을 준비하세요.')
  } else {
    tips.push('🧣 기온이 낮으니 보온용 패딩, 목도리 등 따뜻한 방한 의류를 착용하세요.')
  }

  if (status === '비') {
    tips.push('☔ 갑작스러운 비에 대비해 휴대용 우산과 방수 신발을 준비하세요.')
  } else if (status === '눈') {
    tips.push('❄️ 눈길에 미끄러지지 않도록 미끄럼 방지 신발 착용을 권장합니다.')
  } else if (status === '맑음') {
    tips.push('📸 야외 사진 촬영 및 명소 관광에 최적인 날씨입니다!')
  }

  return tips
})

// ESC 키 입력 시 모달 닫기
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-card" role="dialog" aria-modal="true">
        <!-- 헤더 영역 -->
        <header class="modal-header">
          <div class="header-left">
            <img
              v-if="city.flagUrl"
              :src="city.flagUrl"
              :alt="`${city.country} 국기`"
              class="country-flag"
            />
            <div>
              <h3>{{ city.name }}</h3>
              <span class="country-text">{{ city.country }}</span>
            </div>
          </div>

          <button
            type="button"
            class="btn-close"
            @click="emit('close')"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <!-- 본문 영역 -->
        <div class="modal-body">
          <!-- 기상 개요 카드 -->
          <section class="overview-grid">
            <div class="stat-box">
              <span class="label">현재 기온</span>
              <span class="value temp-val">{{ city.temp }}°C</span>
            </div>
            <div class="stat-box">
              <span class="label">날씨 상태</span>
              <span class="value">{{ city.status }}</span>
            </div>
            <div class="stat-box">
              <span class="label">여행 쾌적도</span>
              <span class="value score-val">{{ city.score }}점</span>
            </div>
            <div class="stat-box">
              <span class="label">추천 등급</span>
              <span class="value grade-val" :class="city.badge?.class">
                {{ city.badge?.emoji }} {{ city.badge?.grade }}
              </span>
            </div>
          </section>

          <!-- 여행 쾌적 지수 게이지 -->
          <section class="score-progress-section">
            <div class="progress-info">
              <span class="progress-title">🎯 여행 지수 상세 지표</span>
              <span class="progress-percent"><strong>{{ city.score }}</strong> / 100</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${city.score}%` }"
                :class="city.badge?.class"
              ></div>
            </div>
          </section>

          <!-- 위/경도 위치 정보 -->
          <section v-if="city.lat && city.lon" class="geo-info-box">
            <span>📍 <strong>좌표</strong>: 위도 {{ city.lat.toFixed(4) }}° / 경도 {{ city.lon.toFixed(4) }}°</span>
          </section>

          <!-- 맞춤 여행 팁 -->
          <section class="tips-section">
            <h4>💡 맞춤 여행 & 복장 가이드</h4>
            <ul class="tips-list">
              <li v-for="(tip, idx) in travelTips" :key="idx">
                {{ tip }}
              </li>
            </ul>
          </section>
        </div>

        <!-- 푸터 -->
        <footer class="modal-footer">
          <button type="button" class="btn-confirm" @click="emit('close')">
            확인
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft, #f8f9fa);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.country-flag {
  width: 32px;
  height: 22px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.country-text {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.75;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.6;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.08);
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-box .label {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

.stat-box .value {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
}

.stat-box .temp-val {
  color: #e67e22;
}

.stat-box .score-val {
  color: hsla(160, 100%, 37%, 1);
}

.stat-box .grade-val {
  font-size: 0.9rem;
}

.score-progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--color-text);
}

.progress-track {
  height: 10px;
  background: var(--color-background-mute, #e5e7eb);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: hsla(160, 100%, 37%, 1);
  transition: width 0.4s ease;
}

.progress-fill.score-top {
  background: #27ae60;
}

.progress-fill.score-good {
  background: #2980b9;
}

.progress-fill.score-normal {
  background: #f39c12;
}

.progress-fill.score-bad {
  background: #c0392b;
}

.geo-info-box {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.8;
  background: var(--color-background-soft, #f8f9fa);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.tips-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tips-section h4 {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-heading);
}

.tips-list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tips-list li {
  font-size: 0.84rem;
  color: var(--color-text);
  line-height: 1.4;
}

.modal-footer {
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  background: var(--color-background-soft, #f8f9fa);
}

.btn-confirm {
  padding: 0.5rem 1.2rem;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm:hover {
  background: hsla(160, 100%, 32%, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
