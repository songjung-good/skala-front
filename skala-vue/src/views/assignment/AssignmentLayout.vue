<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="sub-layout">
    <div class="sub-nav">
      <h3>📝 일일 과제</h3>
      <div class="tabs">
        <RouterLink to="/assignment/day1" class="tab-item">과제 1~5 통합</RouterLink>
        <RouterLink to="/assignment/weather" class="tab-item">🌦️ 날씨 대시보드</RouterLink>
        <RouterLink to="/assignment/weather/city_01" class="tab-item">🔍 상세 정보</RouterLink>
        <RouterLink to="/assignment/about" class="tab-item">ℹ️ 서비스 소개</RouterLink>
        <RouterLink to="/assignment/stats" class="tab-item">📊 통계 분석</RouterLink>
      </div>
    </div>
    <div class="sub-body">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>

<style scoped>
.sub-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sub-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}
.tabs {
  display: flex;
  gap: 0.5rem;
}
.tab-item {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft, #f9f9f9);
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
}
.tab-item.router-link-active {
  background: hsla(160, 100%, 37%, 0.2);
  border-color: hsla(160, 100%, 37%, 1);
  color: hsla(160, 100%, 37%, 1);
}
.sub-body {
  margin-top: 0.5rem;
}
</style>
