<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  statusOptions: {
    type: Array,
    default: () => ['전체'],
  },
  selectedStatus: {
    type: String,
    default: '전체',
  },
  sortBy: {
    type: String,
    default: 'score-desc',
  },
  isLoadingLocation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update-query',
  'update-status',
  'update-sort',
  'random-pick',
  'my-location',
])
</script>

<template>
  <section class="control-box">
    <!-- 검색창 및 정렬/액션 툴바 -->
    <div class="top-row">
      <div class="search-bar">
        <input
          type="text"
          :value="searchQuery"
          @input="emit('update-query', $event.target.value)"
          placeholder="도시 또는 국가 검색 (예: 서울, 프랑스, 도쿄)"
        />
        <span v-if="searchQuery" class="query-preview">
          검색: <strong>{{ searchQuery }}</strong>
        </span>
      </div>

      <div class="action-tools">
        <select
          :value="sortBy"
          @change="emit('update-sort', $event.target.value)"
          class="select-sort"
        >
          <option value="score-desc">🏆 추천 점수 높은 순</option>
          <option value="temp-desc">🔥 기온 높은 순</option>
          <option value="temp-asc">❄️ 기온 낮은 순</option>
          <option value="name-asc">🔤 도시명순 (가나다)</option>
        </select>

        <button
          type="button"
          class="btn-action"
          title="랜덤으로 여행지 하나를 추천합니다"
          @click="emit('random-pick')"
        >
          🎲 어디로 갈까?
        </button>

        <button
          type="button"
          class="btn-action"
          :disabled="isLoadingLocation"
          title="현재 위치의 날씨를 확인합니다"
          @click="emit('my-location')"
        >
          {{ isLoadingLocation ? '📍 위치 확인 중...' : '📍 내 위치 날씨' }}
        </button>
      </div>
    </div>

    <div class="filter-bar">
      <span class="filter-title">날씨 필터:</span>
      <button
        v-for="status in statusOptions"
        :key="status"
        type="button"
        class="btn-filter"
        :class="{ active: selectedStatus === status }"
        @click="emit('update-status', status)"
      >
        {{ status }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.control-box {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 260px;
}

.search-bar input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  background: var(--color-background, #fff);
  color: var(--color-text);
}

.query-preview {
  font-size: 0.85rem;
  color: var(--color-text);
  white-space: nowrap;
}

.action-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.select-sort {
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  background: var(--color-background, #fff);
  color: var(--color-text);
  cursor: pointer;
}

.btn-action {
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--color-background, #fff);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-action:hover:not(:disabled) {
  border-color: hsla(160, 100%, 37%, 0.8);
  color: hsla(160, 100%, 37%, 1);
  background: hsla(160, 100%, 37%, 0.08);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.btn-filter {
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter:hover {
  border-color: hsla(160, 100%, 37%, 0.8);
}

.btn-filter.active {
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border-color: hsla(160, 100%, 37%, 1);
}
</style>
