<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  lat: {
    type: Number,
    default: 37.5665,
  },
  lon: {
    type: Number,
    default: 126.9780,
  },
  cityName: {
    type: String,
    default: '서울',
  },
})

const selectedOverlay = ref('wind') // wind, rain, temp, clouds, waves
const isCollapsed = ref(false)

const embedUrl = computed(() => {
  // Windy iframe embed url
  return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=7&overlay=${selectedOverlay.value}&product=ecmwf&level=surface&lat=${props.lat}&lon=${props.lon}&detailLat=${props.lat}&detailLon=${props.lon}&marker=true&message=true`
})

const layers = [
  { id: 'wind', label: '💨 바람 (Wind)' },
  { id: 'rain', label: '🌧️ 비 / 레이더 (Radar)' },
  { id: 'temp', label: '🌡️ 기온 (Temp)' },
  { id: 'clouds', label: '☁️ 구름 (Clouds)' },
  { id: 'waves', label: '🌊 파도 (Waves)' },
]
</script>

<template>
  <div class="windy-map-section" id="windy-map-anchor">
    <div class="section-header">
      <div class="header-left">
        <span class="windy-badge">Windy LIVE</span>
        <h3 class="section-title">
          🗺️ <strong>{{ cityName }}</strong> 실시간 기상 지도 레이더
        </h3>
      </div>

      <div class="header-controls">
        <div class="layer-selector">
          <button
            v-for="layer in layers"
            :key="layer.id"
            type="button"
            class="btn-layer"
            :class="{ active: selectedOverlay === layer.id }"
            @click="selectedOverlay = layer.id"
          >
            {{ layer.label }}
          </button>
        </div>

        <button
          type="button"
          class="btn-toggle"
          @click="isCollapsed = !isCollapsed"
        >
          {{ isCollapsed ? '펼치기 ▼' : '접기 ▲' }}
        </button>
      </div>
    </div>

    <div v-show="!isCollapsed" class="map-wrapper">
      <iframe
        :key="`${lat}-${lon}-${selectedOverlay}`"
        :src="embedUrl"
        class="windy-iframe"
        title="Windy Live Weather Map"
        loading="lazy"
      ></iframe>
      <div class="map-overlay-tip">
        <span>💡 팁: 지도 내에서 드래그하여 이동하고, 스크롤하여 확대/축소할 수 있습니다. (제공: Windy.com)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.windy-map-section {
  background: var(--color-background-soft, #f8f9fa);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.section-header {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  background: var(--color-background, #fff);
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.windy-badge {
  background: #ff5722;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: 1.1rem;
  color: var(--color-heading);
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.layer-selector {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.btn-layer {
  padding: 0.35rem 0.65rem;
  font-size: 0.78rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft, #eee);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-layer.active {
  background: #ff5722;
  color: #fff;
  border-color: #ff5722;
  font-weight: 600;
}

.btn-toggle {
  padding: 0.35rem 0.65rem;
  font-size: 0.78rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 420px;
  background: #222;
}

.windy-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.map-overlay-tip {
  position: absolute;
  bottom: 8px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.72rem;
  pointer-events: none;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .map-wrapper {
    height: 320px;
  }
}
</style>
