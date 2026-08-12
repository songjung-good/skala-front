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
})

const emit = defineEmits(['update-query', 'update-status'])
</script>

<template>
  <section class="control-box">
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar input {
  flex: 1;
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
