# 🌤️ skala-vue: Weather Dashboard

Vue 3 + Vite 기반 실시간 날씨 대시보드 프로젝트.

---

## 🛠️ 프로젝트 실행 및 빌드

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (Hot-Reload)
npm run dev

# 프로덕션 빌드 (dist/ 생성)
npm run build

# 코드 린트 및 포맷팅
npm run lint
npm run format
```

---

## 📝 Day 1 학습 내용 요약

### 1. 웹 아키텍처 & 도구 핵심 개념

#### 📌 추가된 핵심 내용

1. **npx vs Vite**:
   - `npx`: npm 패키지 1회성 실행기 (글로벌 설치 불필요).
   - `Vite`: ESM 기반 개발 서버 & 프로덕션 번들러 (HMR).
2. **CSR vs SSR**:
   - `CSR`: 빈 HTML + JS 전달 → 브라우저가 렌더링.
   - `SSR`: 서버가 완성된 HTML 전달 → 초기 렌더링 빠름.
3. **SPA가 SEO에 불리한 이유**:
   - 최초 응답이 빈 HTML (`<div id="app"></div>`).
   - 크롤러가 JS 실행 전 빈 껍데기만 수집해 색인 불가. (해결: Nuxt.js SSR / SSG).

### 2. Vue.js & Vite 기초

- **Composition API**: `<script setup>` 기반. 로직 응집도 및 재사용성 향상.
- **SFC (Single File Component)**: `<template>`, `<script setup>`, `<style scoped>` 구조.
- **가상 DOM (Virtual DOM)**: 변경점만 Diffing 렌더링하여 고성능 유지.

### 3. Vue 템플릿 문법 & 디렉티브

- **보간법**: `{{ state }}`
- **속성 바인딩**: `v-bind:attr` (`:attr`)
- **이벤트 바인딩 & 수식어**: `v-on:event` (`@event`), 버블링 방지 (`@click.stop`), 기본 동작 방지 (`@submit.prevent`)
- **조건부 렌더링**: `v-if` / `v-else-if` / `v-else` (DOM 생성/삭제) vs `v-show` (`display: none`)
- **리스트 렌더링**: `v-for="item in list" :key="item.id"` (고유 key 필수)
- **한글(IME) 양방향 바인딩 이슈**:
  - `v-model`은 한글 조합 중 반영 지연 발생.
  - **해결**: `:value="query"` + `@input="query = $event.target.value"`

---
