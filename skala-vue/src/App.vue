<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img alt="Vue logo" class="logo" src="@/assets/preview.png" width="46" height="30" />
      <span class="app-title">Vue Learning Lab</span>
    </div>

    <nav class="main-nav">
      <RouterLink to="/" class="nav-btn">
        <span class="nav-icon">🌍</span>
        <span class="nav-text">세계 여행지 날씨</span>
      </RouterLink>
      <RouterLink to="/practice" class="nav-btn">
        <span class="nav-icon">💻</span>
        <span class="nav-text">실습 코드</span>
      </RouterLink>
      <RouterLink to="/assignment" class="nav-btn">
        <span class="nav-icon">📝</span>
        <span class="nav-text">일일 과제</span>
      </RouterLink>
    </nav>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.5rem;
  margin: 0 -1.5rem 1.25rem -1.5rem;
  /* background: rgba(255, 255, 255, 0.85); */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  /* border-radius: 0; */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

@media (prefers-color-scheme: dark) {
  .app-header {
    background: rgba(18, 18, 22, 0.88);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.main-nav {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  .nav-btn {
    background: rgba(255, 255, 255, 0.05);
  }
}

.nav-btn:hover {
  background: rgba(0, 189, 126, 0.12);
  color: hsla(160, 100%, 37%, 1);
  border-color: hsla(160, 100%, 37%, 0.3);
}

.nav-btn.router-link-active {
  background: hsla(160, 100%, 37%, 0.18);
  color: hsla(160, 100%, 37%, 1);
  border-color: hsla(160, 100%, 37%, 0.8);
  box-shadow: 0 2px 8px rgba(0, 189, 126, 0.2);
}

.nav-icon {
  font-size: 1rem;
}

.main-content {
  flex: 1;
  padding-bottom: 3rem;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  .main-nav {
    justify-content: center;
  }
}
</style>
