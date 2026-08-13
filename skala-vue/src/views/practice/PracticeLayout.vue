<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="sub-layout">
    <div class="sub-nav">
      <h3>💻 실습 코드</h3>
      <div class="tabs">
        <RouterLink to="/practice/day1" class="tab-item">1일차</RouterLink>
        <RouterLink to="/practice/day2" class="tab-item">2일차</RouterLink>
        <RouterLink to="/practice/day3" class="tab-item">3일차</RouterLink>
        <RouterLink to="/practice/day4" class="tab-item">4일차</RouterLink>
      </div>
    </div>
    <div class="sub-body">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import '@/assets/practice.css';
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
