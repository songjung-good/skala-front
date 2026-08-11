import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. state: 단위를 저장하는 변수 (초기값은 'celsius')
  // 값은 오직 'celsius' 또는 'fahrenheit' 두 가지만 가집니다.
  const unit = ref('celsius')

  // Windy API 키 저장 (옵션)
  const windyApiKey = ref(localStorage.getItem('windy_api_key') || '')

  // 2. getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 3. actions: 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 섭씨 온도를 현재 선택된 단위로 수치 변환
  function convertTemp(celsius) {
    if (celsius === undefined || celsius === null || isNaN(celsius)) return 0
    if (unit.value === 'celsius') {
      return Math.round(celsius * 10) / 10
    }
    // 섭씨 -> 화씨: (C * 9/5) + 32
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10
  }

  // 변환된 온도 + 기호 문자열 반환 (예: "24.5℃" 또는 "76.1℉")
  function formatTemp(celsius) {
    return `${convertTemp(celsius)}${unitSymbol.value}`
  }

  // Windy API 키 설정
  function setWindyApiKey(key) {
    windyApiKey.value = key
    if (key) {
      localStorage.setItem('windy_api_key', key)
    } else {
      localStorage.removeItem('windy_api_key')
    }
  }

  return {
    unit,
    windyApiKey,
    unitSymbol,
    toggleUnit,
    convertTemp,
    formatTemp,
    setWindyApiKey,
  }
})
