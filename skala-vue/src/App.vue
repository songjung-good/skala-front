<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img alt="Vue logo" class="logo" src="@/assets/preview.png" width="50" height="32" />
      <span class="app-title">Vue Learning Lab</span>
    </div>

    <nav class="main-nav">
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/practice">실습 코드</RouterLink>
      <RouterLink to="/assignment">일일 과제</RouterLink>
    </nav>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
/* .app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
} */

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.main-nav a {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
}

.main-nav a.router-link-active {
  background-color: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 37%, 1);
}

.main-content {
  flex: 1;
  padding-bottom: 3rem;
}
</style>
