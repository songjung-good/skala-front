<script setup>
import { ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  selectedContinent: {
    type: String,
    default: '전체',
  },
  selectedCategory: {
    type: String,
    default: '전체',
  },
  sortBy: {
    type: String,
    default: 'score-desc',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  categoryOptions: {
    type: Array,
    default: () => ['전체', '맑음', '구름', '흐림', '비', '눈'],
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedContinent',
  'update:selectedCategory',
  'update:sortBy',
  'refresh',
  'open-settings',
])

const configStore = useConfigStore()
const searchInput = ref(props.searchQuery)

const handleInput = (e) => {
  searchInput.value = e.target.value
  emit('update:searchQuery', e.target.value)
}

const clearSearch = () => {
  searchInput.value = ''
  emit('update:searchQuery', '')
}

const continents = ['전체', '아시아', '유럽', '아메리카', '오세아니아']
</script>

<template>
  <div class="weather-controls">
    <!-- 상단: 검색 및 유틸리티 액션 버튼 -->
    <div class="search-action-row">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          :value="searchQuery"
          @input="handleInput"
          placeholder="세계 도시/국가 필터링 (예: 파리, Tokyo, 런던, 로마...)"
          class="search-input"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="btn-clear"
          type="button"
          title="검색어 지우기"
        >
          ✕
        </button>
      </div>

      <div class="action-buttons">
        <!-- 단위 토글 버튼 -->
        <button
          type="button"
          @click="configStore.toggleUnit"
          class="btn-action unit-btn"
          :title="`현재 단위: ${configStore.unit === 'celsius' ? '섭씨' : '화씨'}`"
        >
          <span class="unit-indicator">{{ configStore.unitSymbol }}</span>
          <span class="btn-text">{{ configStore.unit === 'celsius' ? '화씨(℉)로 변경' : '섭씨(℃)로 변경' }}</span>
        </button>

        <!-- 새로고침 버튼 -->
        <button
          type="button"
          @click="emit('refresh')"
          :disabled="isLoading"
          class="btn-action refresh-btn"
          title="실시간 세계 날씨 새로고침"
        >
          <span class="refresh-icon" :class="{ spinning: isLoading }">🔄</span>
          <span class="btn-text">새로고침</span>
        </button>

        <!-- Windy 설정 버튼 -->
        <button
          type="button"
          @click="emit('open-settings')"
          class="btn-action settings-btn"
          title="Windy API 설정"
        >
          <span>⚙️ Windy</span>
        </button>
      </div>
    </div>

    <!-- 하단: 대륙별 탭 & 날씨 상태 필터 & 정렬 -->
    <div class="filter-sort-row">
      <!-- 대륙 및 날씨 필터 -->
      <div class="filter-groups-wrap">
        <!-- 대륙 필터 -->
        <div class="pill-group continent-group">
          <button
            v-for="c in continents"
            :key="c"
            type="button"
            class="pill-btn continent-btn"
            :class="{ active: selectedContinent === c }"
            @click="emit('update:selectedContinent', c)"
          >
            <span v-if="c === '전체'">🌐</span>
            <span v-else-if="c === '아시아'">🌸</span>
            <span v-else-if="c === '유럽'">🥐</span>
            <span v-else-if="c === '아메리카'">🗽</span>
            <span v-else-if="c === '오세아니아'">🦘</span>
            {{ c }}
          </button>
        </div>

        <!-- 날씨 카테고리 필터 -->
        <div class="pill-group weather-cat-group">
          <button
            v-for="cat in categoryOptions"
            :key="cat"
            type="button"
            class="pill-btn"
            :class="{ active: selectedCategory === cat }"
            @click="emit('update:selectedCategory', cat)"
          >
            <span v-if="cat === '전체'">🌈</span>
            <span v-else-if="cat === '맑음'">☀️</span>
            <span v-else-if="cat === '구름'">⛅</span>
            <span v-else-if="cat === '흐림'">☁️</span>
            <span v-else-if="cat === '비'">🌧️</span>
            <span v-else-if="cat === '눈'">❄️</span>
            <span v-else-if="cat === '안개'">🌫️</span>
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- 정렬 셀렉터 -->
      <div class="sort-selector">
        <span class="sort-title">정렬:</span>
        <select
          :value="sortBy"
          @change="emit('update:sortBy', $event.target.value)"
          class="sort-dropdown"
        >
          <option value="score-desc">🌟 여행 쾌적 지수 높은 순</option>
          <option value="temp-desc">🔥 기온 높은 순</option>
          <option value="temp-asc">❄️ 기온 낮은 순</option>
          <option value="name-asc">🔤 도시명 가나다순</option>
          <option value="wind-desc">💨 풍속 빠른 순</option>
          <option value="humidity-desc">💧 습도 높은 순</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-controls {
  background: var(--color-background-soft, #f8f9fa);
  border: 1.5px solid var(--color-border);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.search-action-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  min-width: 260px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 1rem;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.2rem 0.65rem 2.4rem;
  font-size: 0.92rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.15);
}

.btn-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-action:hover:not(:disabled) {
  background: hsla(160, 100%, 37%, 0.1);
  border-color: hsla(160, 100%, 37%, 0.5);
  color: hsla(160, 100%, 37%, 1);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.unit-btn {
  background: #2c3e50;
  color: #fff;
  border-color: #2c3e50;
}

.unit-btn:hover:not(:disabled) {
  background: #34495e;
  border-color: #34495e;
  color: #fff;
}

.unit-indicator {
  font-weight: 800;
  font-size: 1rem;
  color: #2ecc71;
}

.refresh-icon.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.filter-sort-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-border);
}

.filter-groups-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pill-group {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  background: var(--color-background-mute, #eee);
}

.continent-btn.active {
  background: #6c5ce7;
  color: white;
  border-color: #6c5ce7;
  font-weight: 700;
}

.weather-cat-group .pill-btn.active {
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border-color: hsla(160, 100%, 37%, 1);
  font-weight: 700;
}

.sort-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.8;
  white-space: nowrap;
}

.sort-dropdown {
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  outline: none;
  cursor: pointer;
}

.sort-dropdown:focus {
  border-color: hsla(160, 100%, 37%, 1);
}

@media (max-width: 768px) {
  .search-action-row,
  .filter-sort-row {
    flex-direction: column;
    align-items: stretch;
  }
  .action-buttons {
    justify-content: space-between;
  }
  .btn-action {
    flex: 1;
    justify-content: center;
  }
}
</style>
