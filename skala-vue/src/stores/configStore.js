import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. state: 단위를 저장하는 변수 (초기값은 'celsius')
  // 값은 오직 'celsius' 또는 'fahrenheit' 두 가지만 가집니다.
  const unit = ref('celsius')

  // 2. getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  const isCelsius = computed(() => unit.value === 'celsius')

  // 3. actions: 단위 토글 및 온도 변환 헬퍼 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function convertTemp(temp) {
    if (temp === undefined || temp === null) return 0
    if (unit.value === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32)
    }
    return temp
  }

  function formatTemp(temp) {
    return `${convertTemp(temp)}${unitSymbol.value}`
  }

  return {
    unit,
    unitSymbol,
    isCelsius,
    toggleUnit,
    convertTemp,
    formatTemp,
  }
})
