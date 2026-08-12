<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ configStore.formatTemp(cityItem.temp) }}</p>

    <!-- 기온별 4단계 뱃지 라벨링 복원 -->
    <span v-if="cityItem.temp >= 27" class="badge hot">🔥 더움 (27도 이상)</span>
    <span v-else-if="cityItem.temp >= 23" class="badge warm">☀️ 따뜻함 (23도 이상)</span>
    <span v-else-if="cityItem.temp >= 19" class="badge cool">❄️ 선선함 (19도 이상)</span>
    <span v-else class="badge cold">🥶 추움 (19도 미만)</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
h4 {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: #2c3e50;
}
p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #555;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
}
.hot {
  background-color: #ff7675;
}
.warm {
  background-color: #f39c12;
}
.cool {
  background-color: #74b9ff;
}
.cold {
  background-color: #0984e3;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #f8f9fa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-detail:hover {
  background-color: #e9ecef;
}
</style>
