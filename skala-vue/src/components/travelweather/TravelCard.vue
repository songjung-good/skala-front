<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select', 'detail'])

const cardStyle = computed(() => {
  if (!props.city.flagUrl) return {}
  return {
    backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.95) 100%), url('${props.city.flagUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})

const handleCardClick = () => {
  emit('select', props.city)
}

const handleDetailClick = (event) => {
  event.stopPropagation()
  emit('detail', props.city)
}
</script>

<template>
  <div class="city-card" :style="cardStyle" @click="handleCardClick">
    <div class="card-header">
      <div class="city-title">
        <div class="title-row">
          <img
            v-if="city.flagUrl"
            :src="city.flagUrl"
            :alt="`${city.country} 국기`"
            class="country-flag-icon"
            loading="lazy"
          />
          <h4>{{ city.name }}</h4>
        </div>
        <span class="country-name">{{ city.country }}</span>
      </div>
      <span class="score-badge" :class="city.badge?.class">
        {{ city.badge?.emoji }} {{ city.score }}점
      </span>
    </div>

    <div class="weather-info">
      <p class="temp">{{ city.temp }}°C</p>
      <p class="status">{{ city.status }}</p>
    </div>

    <div class="card-footer">
      <span class="grade-text">{{ city.badge?.grade }}</span>
      <button type="button" class="btn-detail" @click="handleDetailClick">상세보기</button>
    </div>
  </div>
</template>

<style scoped>
.city-card {
  position: relative;
  background-color: var(--color-background-soft, #fff);
  border-radius: 12px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease;
}

.city-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: hsla(160, 100%, 37%, 0.5);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.city-title {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.country-flag-icon {
  width: 22px;
  height: 15px;
  object-fit: cover;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.city-title h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.country-name {
  font-size: 0.78rem;
  color: var(--color-text);
  opacity: 0.75;
  font-weight: 500;
}

.score-badge {
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  white-space: nowrap;
}

.score-top {
  background: rgba(46, 204, 113, 0.18);
  color: #1e824c;
}

.score-good {
  background: rgba(52, 152, 219, 0.18);
  color: #1f618d;
}

.score-normal {
  background: rgba(241, 196, 15, 0.22);
  color: #b9770e;
}

.score-bad {
  background: rgba(231, 76, 60, 0.18);
  color: #922b21;
}

.weather-info {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin: 0.2rem 0;
}

.temp {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-heading);
  line-height: 1;
}

.status {
  font-size: 0.95rem;
  margin: 0;
  color: var(--color-text);
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed var(--color-border);
  padding-top: 0.65rem;
  margin-top: auto;
}

.grade-text {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.85;
}

.btn-detail {
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: var(--color-background, #fff);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail:hover {
  background: hsla(160, 100%, 37%, 0.15);
  border-color: hsla(160, 100%, 37%, 1);
  color: hsla(160, 100%, 37%, 1);
}

/* Dark mode adjustment for card background overlay */
@media (prefers-color-scheme: dark) {
  .city-card {
    background-color: var(--color-background-soft, rgba(30, 30, 30, 0.9));
  }
}
</style>
