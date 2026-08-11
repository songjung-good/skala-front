<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="landing-page">
    <div class="hero">
      <h1>Vue Learning Lab 🚀</h1>
      <p class="subtitle">Vue 3 문법 학습 및 일자별 실습 & 과제 프로젝트</p>
    </div>

    <div class="grid-container">
      <div class="card">
        <h3>💻 실습 코드 (Practices)</h3>
        <p>일자별로 학습한 Vue 핵심 개념과 디렉티브 실습 코드 모음입니다.</p>
        <div class="links">
          <RouterLink to="/practice/day1" class="btn"
            >1일차: 반응형 데이터 & 기초 디렉티브</RouterLink
          >
          <RouterLink to="/practice/day2" class="btn">2일차: 이벤트 & 폼 데이터 바인딩</RouterLink>
        </div>
      </div>

      <div class="card">
        <h3>📝 일일 과제 (Assignments)</h3>
        <p>매일 주어지는 과제 요구사항과 구현 결과를 확인하는 공간입니다.</p>
        <div class="links">
          <RouterLink to="/assignment/day1" class="btn">1일차 과제</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}
.hero {
  text-align: center;
  padding: 2rem 1rem;
}
.hero h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}
.subtitle {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.card {
  background: var(--color-background-soft, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card h3 {
  color: var(--color-heading);
  font-size: 1.3rem;
}
.card p {
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
}
.links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}
.btn {
  display: block;
  padding: 0.6rem 1rem;
  background: var(--color-background-mute, #eee);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn:hover {
  background: hsla(160, 100%, 37%, 0.15);
  border-color: hsla(160, 100%, 37%, 1);
  color: hsla(160, 100%, 37%, 1);
}
</style>
