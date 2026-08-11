<script setup>
import { ref, watch } from 'vue'
import { searchCitiesGeocoding } from '@/services/weatherService'

defineProps({
  isLoadingLocation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-destination', 'random-destination', 'my-location'])

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showDropdown = ref(false)
let debounceTimer = null

// 인기 세계 여행지 퀵 태그
const popularDestinations = [
  {
    id: 'paris',
    name: '파리',
    engName: 'Paris',
    country: '프랑스 🇫🇷',
    icon: '🗼',
    lat: 48.8566,
    lon: 2.3522,
    tag: '에펠탑 & 루브르',
  },
  {
    id: 'tokyo',
    name: '도쿄',
    engName: 'Tokyo',
    country: '일본 🇯🇵',
    icon: '🏯',
    lat: 35.6762,
    lon: 139.6503,
    tag: '도심 & 미식',
  },
  {
    id: 'bali',
    name: '발리',
    engName: 'Bali',
    country: '인도네시아 🇮🇩',
    icon: '🏝️',
    lat: -8.4095,
    lon: 115.1889,
    tag: '서핑 & 휴양',
  },
  {
    id: 'danang',
    name: '다낭',
    engName: 'Danang',
    country: '베트남 🇻🇳',
    icon: '🏖️',
    lat: 16.0544,
    lon: 108.2022,
    tag: '리조트 & 힐링',
  },
  {
    id: 'newyork',
    name: '뉴욕',
    engName: 'New York',
    country: '미국 🇺🇸',
    icon: '🗽',
    lat: 40.7128,
    lon: -74.006,
    tag: '타임스퀘어',
  },
  {
    id: 'rome',
    name: '로마',
    engName: 'Rome',
    country: '이탈리아 🇮🇹',
    icon: '🏛️',
    lat: 41.9028,
    lon: 12.4964,
    tag: '콜로세움',
  },
  {
    id: 'london',
    name: '런던',
    engName: 'London',
    country: '영국 🇬🇧',
    icon: '🎡',
    lat: 51.5074,
    lon: -0.1278,
    tag: '빅벤',
  },
  {
    id: 'reykjavik',
    name: '아이슬란드',
    engName: 'Reykjavik',
    country: '아이슬란드 🇮🇸',
    icon: '🌌',
    lat: 64.1466,
    lon: -21.9426,
    tag: '오로라 & 온천',
  },
  {
    id: 'jeju',
    name: '제주',
    engName: 'Jeju',
    country: '대한민국 🇰🇷',
    icon: '🍊',
    lat: 33.4996,
    lon: 126.5312,
    tag: '에메랄드 바다',
  },
]

// 검색어 입력 시 디바운스 Geocoding 검색
watch(searchQuery, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = newVal.trim()
  if (trimmed.length < 2) {
    searchResults.value = []
    showDropdown.value = false
    return
  }

  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const results = await searchCitiesGeocoding(trimmed)
      searchResults.value = results
      showDropdown.value = results.length > 0
    } catch (e) {
      console.error('검색 실패:', e)
    } finally {
      isSearching.value = false
    }
  }, 350)
})

const handleSelectResult = (dest) => {
  searchQuery.value = ''
  showDropdown.value = false
  emit('select-destination', dest)
}

const handleQuickSelect = (dest) => {
  emit('select-destination', dest)
}
</script>

<template>
  <div class="travel-search-section">
    <!-- 메인 검색바 & 랜덤/내위치 버튼 -->
    <div class="search-main-row">
      <div class="input-container">
        <span class="input-icon">✈️</span>
        <input
          type="text"
          v-model="searchQuery"
          @focus="showDropdown = searchResults.length > 0"
          placeholder="여행하고 싶은 도시나 나라를 입력하세요 (예: 파리, Tokyo, 발리, 스위스, 뉴욕...)"
          class="travel-input"
        />
        <span v-if="isSearching" class="searching-indicator">⏳</span>

        <!-- 자동완성 검색 결과 드롭다운 -->
        <div v-if="showDropdown && searchResults.length > 0" class="search-dropdown">
          <div
            v-for="res in searchResults"
            :key="res.id"
            class="dropdown-item"
            @click="handleSelectResult(res)"
          >
            <span class="item-icon">📍</span>
            <div class="item-info">
              <span class="item-name"
                ><strong>{{ res.name }}</strong></span
              >
              <span class="item-country">{{ res.country || res.tag }}</span>
            </div>
            <span class="item-arrow">선택 ❯</span>
          </div>
        </div>
      </div>

      <!-- 탐험 액션 버튼들 -->
      <div class="hero-actions">
        <button
          type="button"
          @click="emit('random-destination')"
          class="btn-action btn-random"
          title="세계 다른 랜덤 여행지로 떠나기"
        >
          <span class="btn-icon">🎲</span>
          <span>랜덤 여행지 탐험</span>
        </button>

        <button
          type="button"
          @click="emit('my-location')"
          :disabled="isLoadingLocation"
          class="btn-action btn-location"
          title="내 현재 위치 날씨 및 레이더 확인"
        >
          <span class="btn-icon">📍</span>
          <span>{{ isLoadingLocation ? '위치 찾는 중...' : '내 위치' }}</span>
        </button>
      </div>
    </div>

    <!-- 인기 여행지 빠른 선택 칩 태그 -->
    <div class="quick-tags-container">
      <span class="tags-label">✨ 추천 여행지:</span>
      <div class="tags-scroll">
        <button
          v-for="dest in popularDestinations"
          :key="dest.id"
          type="button"
          class="tag-chip"
          @click="handleQuickSelect(dest)"
        >
          <span class="chip-icon">{{ dest.icon }}</span>
          <span class="chip-name">{{ dest.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.travel-search-section {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
}

.search-main-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.input-container {
  flex: 1;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 1.15rem;
  pointer-events: none;
}

.travel-input {
  width: 100%;
  padding: 0.85rem 2.5rem 0.85rem 2.8rem;
  font-size: 1.05rem;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  outline: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.travel-input:focus {
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow:
    0 0 0 4px hsla(160, 100%, 37%, 0.15),
    0 4px 14px rgba(0, 0, 0, 0.08);
}

.searching-indicator {
  position: absolute;
  right: 14px;
  font-size: 0.9rem;
}

/* 드롭다운 */
.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--color-background, #fff);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  z-index: 50;
  max-height: 280px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: hsla(160, 100%, 37%, 0.08);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.95rem;
  color: var(--color-heading);
}

.item-country {
  font-size: 0.78rem;
  color: var(--color-text);
  opacity: 0.65;
}

.item-arrow {
  font-size: 0.78rem;
  color: hsla(160, 100%, 37%, 1);
  font-weight: 600;
}

/* 액션 버튼 */
.hero-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.8rem 1.15rem;
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: 12px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-random {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
}

.btn-random:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.35);
}

.btn-location {
  background: var(--color-background-soft, #f8f9fa);
  border-color: var(--color-border);
  color: var(--color-heading);
}

.btn-location:hover:not(:disabled) {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  border-color: hsla(160, 100%, 37%, 0.5);
}

.btn-location:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 퀵 태그 */
.quick-tags-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
}

.tags-scroll {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-chip:hover {
  background: hsla(160, 100%, 37%, 0.12);
  color: hsla(160, 100%, 37%, 1);
  border-color: hsla(160, 100%, 37%, 0.5);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .search-main-row {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-actions {
    justify-content: stretch;
  }
  .btn-action {
    flex: 1;
    justify-content: center;
  }
}
</style>
