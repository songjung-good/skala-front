<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div v-if="stats.count > 0" class="summary-card">
    <div class="stat-item">
      <span class="stat-label">조회 도시</span>
      <strong>{{ stats.count }}개</strong>
    </div>
    <div class="stat-item">
      <span class="stat-label">평균 기온</span>
      <strong>{{ stats.avgTemp }}°C</strong>
    </div>
    <div class="stat-item">
      <span class="stat-label">평균 여행 점수</span>
      <strong>{{ stats.avgScore }}점</strong>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.75;
}

.stat-item strong {
  font-size: 1.1rem;
  color: var(--color-heading);
}
</style>
