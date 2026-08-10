# 🌤️ skala-vue

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

## 📝 Day 1

### 1. 학습내용정리

1. **npx(패키지설치) vs Vite(빌드실행)**:
   - `npx`: npm 패키지 1회성 실행기 (글로벌 설치 불필요).
   - `Vite`: ESM 기반 개발 서버 & 프로덕션 번들러 (HMR).
2. **CSR vs SSR**:
   - `CSR(클라이언트사이드랜더링)`: 빈 HTML + JS 전달 → 브라우저가 렌더링.
   - `SSR(서버사이드랜더링)`: 서버가 완성된 HTML 전달 → 초기 렌더링 빠름.
3. **SPA가 SEO에 불리한 이유**:
   - 최초 응답이 빈 HTML (`<div id="app"></div>`).
   - 크롤러가 JS 실행 전 빈 껍데기만 수집해 색인 불가. (해결: Nuxt.js SSR / SSG).

### 2. 실습내용

#### 1. 반응형 데이터 확인

1. 일반 변수와 반응형 변수의 비교
   
   ```jsx
   // .src/components/practices/basic/SampleOne.vue
   <script setup>
   import { ref } from 'vue'
   
   // 1. 일반 변수 (실시간으로 바뀌지 않음)
   let normalCount = 0
   // 2. 반응형 변수 (실시간으로 바뀜)
   const vueCount = ref(0)
   
   </script>
   <template>
   <div class="practice-section">
   <h2>Hello Skala-Vue</h2>
   <h3>일반 변수 클릭: {{ normalCount }}</h3>
   <button @click="normalCount++">일반 변수 증가</button>
   <br />
   <h3>Vue 반응성 변수 클릭: {{ vueCount }}</h3>
   <button @click="vueCount++">Vue 변수 증가</button>
   </div>
   </template>
   ```

2. {{ }}를 활용해서 값을 채워넣는 방법
   
   ```jsx
   // .src/components/practices/basic/SampleTwo.vue
   <script setup>
   import { ref } from 'vue'
   
   // Text Interpolation
   const welcomeMessage = ref('Hello Skala-Vue')
   </script>
   <template>
    <div class="practice-section">
      <h2>{{ welcomeMessage }}</h2>
      <p>{{ welcomeMessage.toUpperCase() }}</p>
      <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
    </div>
   </template>
   ```

3. 위의 코드를 확인하기 위해 App.vue에 import
   
   ```jsx
   // App.vue
   <script setup>
   import SampleOne from './components/practices/basic/SampleOne.vue'
   import SampleTwo from './components/practices/basic/SampleTwo.vue'
   </script>
   
   //...
   <template>
    <div style="padding: 20px">
      <SampleOne />
      <SampleTwo />
    </div>
   </template>
   ```

4. 결과 확인

---
