<script setup>
import WeatherMockup from '@/components/exercise/WeatherMockup.vue'
import WeatherComposition from '@/components/exercise/WeatherComposition.vue'
import WeatherParent from '@/components/exercise/WeatherParent.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="practice-container">
    <div class="app-container">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <hr />
      <WeatherMockup />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
      <hr />
      <WeatherComposition />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 4: 라우터적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <nav class="navigation-bar">
          <RouterLink to="/weather" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        </nav>
        <main>
          <WeatherParent />
        </main>
      </div>
    </div>
    <div class="app-container">
      <h1>⛅ 과제 5: 스토어적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <nav class="navigation-bar">
          <RouterLink to="/assignment" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
          <UnitToggler />
        </nav>
        <main>
          <WeatherParent />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice-container {
  max-width: 1200px;
  width: 950px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2c3e50;
  line-height: 1.6;
}
</style>
