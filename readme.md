# ⚡ SKALA Front-End Engineering (Vue.js) 종합 프로젝트

> 본 저장소는 **SKALA Full-Stack Engineering 과정의 프론트엔드 프레임워크 (Vue 3, Composition API, Vite, Vue Router, Pinia, Axios, Element Plus)** 수업 내용에 기반한 일차별 실습 코드와 종합 과제 목적의 메인 대시보드 애플리케이션 개발 내역을 정리한 문서입니다.

---

## 🛠️ 프로젝트 실행 및 환경 설정

```bash
# 저장소 이동
cd skala-vue

# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행 (Vite HMR)
npm run dev

# 프로덕션 빌드 (dist/ 생성 및 번들 검증)
npm run build

# 코드 린트 및 서식 포맷팅
npm run lint
npm run format
```

### 🔑 환경 변수 (`.env`) 설정
RestCountries API 연동을 위해 `skala-vue/.env` 파일에 다음과 같이 API Key를 설정합니다.

```env
RESTCOUNTRIES_API='rc_live_661b276fdab1414bb557dff5e770a05c'
VITE_RESTCOUNTRIES_API='rc_live_661b276fdab1414bb557dff5e770a05c'
```

---

## 🧭 프로젝트 아키텍처 및 라우팅 안내 (URL Guide)

* **`http://localhost:5173/` (홈)**: 세계 주요 도시 날씨 & 여행지 추천 대시보드 (과제 고도화 화면)
* **`http://localhost:5173/practice` (실습 코드)**:
  * **`1일차 탭` (`/practice/day1`)**: Vue 3 반응형 기초 및 기본 디렉티브 모음
  * **`2일차 탭` (`/practice/day2`)**: 고급 디렉티브, 이벤트/폼 바인딩, 반응성 심화 (`computed`, `watch`)
  * **`3일차 탭` (`/practice/day3`)**: 컴포넌트 심화 (생명주기, Props/Emits, Slots), Pinia 스토어, Axios REST 통신, Element Plus, Modern JS
* **`http://localhost:5173/assignment` (일일 과제)**:
  * **`1일차 과제` (`/assignment/day1`)**: Mockup 날씨 대시보드 및 Composition API 기반 과제

---

## 📚 PART 1. 수업 내용 기반 일차별 실습 코드 (Hands-on Practices)

수업 과정에서 다룬 핵심 이론 및 문법을 단위 컴포넌트로 구현하여 `/practice` 경로의 탭별 서브 뷰에 집약했습니다.

### 📅 1일차: 반응형 데이터 & 기초 디렉티브 (`/practice/day1`)
* **반응형 상태 선언**:
  * `SampleOne.vue`: 일반 자바스크립트 원시 변수와 Vue `ref()` 반응형 상태의 차이점 및 화면 갱신 메커니즘 비교
  * `SampleTwo.vue`: Mustache 구문(`{{ }}`)을 활용한 텍스트 보간(Text Interpolation) 및 표현식 연산
* **기초 Vue Directives**:
  * `VueHtml.vue` & `VueHtmlXss.vue`: `v-html`을 통한 HTML 렌더링 및 악의적 스크립트 주입(XSS) 취약점 방어 학습
  * `VueText.vue`: 태그 문자열을 안전하게 이스케이프하여 출력하는 `v-text`
  * `VueBind.vue`, `VueBindClass.vue`, `VueBindStyle.vue`, `VueBindShorthand.vue`: HTML 속성 단방향 바인딩(`v-bind`, `:`), 클래스/인라인 스타일 동적 객체 바인딩
  * `VueIf.vue`, `VueShow.vue`: DOM 생성/삭제를 제어하는 `v-if` 조건문과 CSS `display`를 제어하는 `v-show` 비교
  * `VueFor.vue`: 배열 데이터를 순회 렌더링하는 `v-for`와 고유 식별자 `:key` 바인딩

---

### 📅 2일차: 고급 디렉티브 & 반응성 심화 (`/practice/day2`)
* **고급 Vue Directives**:
  * `VuePre.vue`: 컴파일 과정을 건너뛰고 원시 텍스트를 그대로 노출하는 `v-pre`
  * `VueCloak.vue`: 초기 컴파일 전 콧수염 괄호 노출을 방지하는 `v-cloak`
  * `VueOnce.vue`, `VueMemo.vue`: 1회만 렌더링 후 캐싱 유지하는 `v-once`, 특정 의존성 변경 시에만 리렌더링하는 `v-memo`
* **이벤트 & 폼 핸들링**:
  * `EventHandlerVon.vue`, `EventObject.vue`, `EventModifier.vue`: `v-on`(`@`), 네이티브 `$event` 객체 핸들링, 버블링 차단(`.stop`) 및 기본 동작 방지(`.prevent`) 수식어
  * `FormElementsHandling.vue`, `FormModifier.vue`: `v-model` 양방향 데이터 바인딩, `.lazy`, `.number`, `.trim` 수식어
  * `VueStyle.vue`: Single File Component의 `<style scoped>` 적용 원리
* **반응성 심화 (Reactivity & Watchers)**:
  * `ReactiveRef.vue`, `ReactiveExercise.vue`: `ref()` 및 `reactive()` 상태 모델링
  * `Computed.vue`: 종속된 반응형 상태를 캐싱 연산하는 계산된 속성 (`computed`)
  * `ComputedWatch.vue`, `ComputedMultiSource.vue`, `ComputedDeepWatch.vue`, `ComputedReactive.vue`: 단일 변수, 다중 변수, 객체 내부 심층(`deep: true`) 감시자 (`watch`)
  * `ComputedWatchEffect.vue`: 콜백 내부 상태를 자동 추적하여 즉시 실행되는 `watchEffect`

---

### 📅 3일차: 컴포넌트 심화, Pinia, Axios & UI 라이브러리 (`/practice/day3`)
* **컴포넌트 심화 아키텍처 (Component Deep Dive)**:
  * **라이프사이클 훅 (`LifecycleHook.vue`, `LifecycleParent.vue`)**:
    * 컴포넌트 생성(`setup`), 마운트(`onMounted`), 업데이트(`onUpdated`), 언마운트(`onUnmounted`) 생명주기 흐름 탐색
    * 타이머 리소스 정리(Memory Leak 방지) 및 컴포넌트 파괴/재마운트 토글 버튼 구현
  * **부모-자식 데이터 통신 (`PropsEmitsParent.vue`, `PropsEmitsChild.vue`, `ParentComponent.vue`, `ChildComponent.vue`)**:
    * 상위 ➡️ 하위: `defineProps`를 통한 단방향 데이터 전달
    * 하위 ➡️ 상위: `defineEmits` 및 커스텀 이벤트를 통한 이벤트 송신(Emit)
  * **슬롯 컴포넌트 (`SlotDefaultParent/Child`, `SlotNamedParent/Child`, `SlotScopedParent/Child`)**:
    * 기본 콘텐츠 주입 (Default Slot)
    * 다중 영역 이름 기반 템플릿 주입 (Named Slot - `v-slot:header`)
    * 하위 컴포넌트의 내부 데이터를 상위 템플릿으로 역전달하여 렌더링하는 범위 지정 슬롯 (Scoped Slot)
* **전역 상태 관리 (Pinia Store)**:
  * `StoreCounter.vue` & `stores/counter.js`: `defineStore`를 통해 `state`, `getters`, `actions`를 전역 중앙 저장소로 구축하고 컴포넌트 간 상태 공유
* **비동기 HTTP 통신 (Axios)**:
  * `AxiosWeather.vue`: `axios.get()` 및 `async/await`, `try-catch`를 활용한 실시간 날씨 Open API 비동기 수신
  * `AxiosJson.vue`: JSONPlaceholder 엔드포인트 기반 REST API 4대 CRUD (`GET`, `POST`, `PUT`, `DELETE`) 완전 구현
* **UI 라이브러리 & 모던 JS (Element Plus & Modern JS)**:
  * `ElementPlus.vue`: `<el-card>`, `<el-input>`, `<el-switch>`, `<el-rate>`, `<el-progress>`, `ElMessage`, `ElMessageBox` 기성 UI 및 인터랙션 피드백 구현
  * `EcmaScript.vue`: 구조 분해 할당, 스프레드 연산자(`...`), 옵셔널 체이닝(`?.`), Null 병합 연산자(`??`), 비동기 파이프라인 실무 검증

---

## 🌟 PART 2. 과제 목적 메인 페이지 수식 및 기능 고도화 (Home Dashboard)

메인 랜딩 화면([`src/views/HomeView.vue`](file:///Users/skala_yh/Documents/GitHub/skala-front/skala-vue/src/views/HomeView.vue))은 **전 세계 주요 9개 도시의 실시간 날씨 데이터와 기상 기반 100점 만점 여행지 추천 가이드**를 제공하는 완성형 대시보드로 구축 및 리팩토링되었습니다.

### 1. 여행지 카드 컴포넌트 모듈화 ([`src/components/TravelCard.vue`](file:///Users/skala_yh/Documents/GitHub/skala-front/skala-vue/src/components/TravelCard.vue))
* **컴포넌트 분리**: 메인 뷰에 인라인으로 중첩되어 있던 도시 카드 템플릿을 독립적인 Single File Component(`TravelCard.vue`)로 분리하여 재사용성과 유지보수성을 확보했습니다.
* **Props & Emits 통신**:
  * `props: { city }`: 도시명, 국가명, 기온, 기상 상태, 여행 점수, 국기 이미지 URL 수신
  * `emits: ['select', 'detail']`: 카드 선택 시 상위 뷰의 안내 상태바 동기화 및 상세보기 모달 알림창 트리거

### 2. RestCountries API 연동 & 카드 국기 배경 스타일링
* **실시간 국기 API 연동**:
  * `https://api.restcountries.com/countries/v5` 엔드포인트를 호출하여 각 국가별 공식 국기 이미지(`flag.url_png`)를 비동기 수신합니다.
  * API Key는 `.env` (`RESTCOUNTRIES_API` / `VITE_RESTCOUNTRIES_API`)로 분리하여 보안성을 확보했습니다.
* **고급스러운 국기 배경 디자인**:
  * 카드 텍스트의 가독성을 최우선으로 고려하여 은은한 반투명 그라데이션(`linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.95))`)과 국기 이미지를 합성한 배경(`background-image`)을 적용했습니다.
  * 도시명 옆에 미니 국기 썸네일 뱃지를 함께 배치하여 시각적 직관성을 향상했습니다.

### 3. Vite 개발 서버 프록시 (`server.proxy`) 구축
* **CORS Origin 이슈 해결**:
  * RestCountries API 호출 시 브라우저의 `Origin: http://localhost:5173` 검사로 인해 발생하는 `403 Forbidden (originNotAllowed)` 에러를 해결하기 위해 [`vite.config.js`](file:///Users/skala_yh/Documents/GitHub/skala-front/skala-vue/vite.config.js)에 프록시를 구성했습니다.
  ```javascript
  server: {
    proxy: {
      '/api/restcountries': {
        target: 'https://api.restcountries.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/restcountries/, ''),
      },
    },
  }
  ```
  * 개발 환경에서는 프록시(`/api/restcountries`)를 우선 호출하고, 실패 시 직접 호출 및 기본 국기 리소스로 Fallback 하도록 안정성을 강화했습니다.

### 4. 반응형 비즈니스 로직 & 사용자 인터랙션
* **실시간 복합 필터링 (`computed`)**:
  * 한글 검색어 입력(`searchQuery`)과 날씨 상태 칩 버튼(`selectedStatus`)을 동시에 반영하는 `filteredCityList` 필터링
* **100점 만점 여행 추천 지수 알고리즘**:
  * 최적 여행 기온(22°C)과의 편차 감점 및 기상 상태(맑음, 구름, 비, 눈) 가감점을 연산하여 4단계 추천 등급(강력 추천 🏆 / 추천 👍 / 보통 ⚠️ / 비추천 🌧️) 뱃지 동적 산출
* **실시간 통계 요약 카드 (`stats`)**:
  * 현재 필터링된 도시 개수, 평균 기온, 평균 여행 추천 점수를 실시간 집계하여 상단 대시보드에 표시
* **상태 변경 감시 (`watch` / `watchEffect`)**:
  * 사용자가 선택한 도시 정보의 변경 이력 및 검색 필터링 상태를 실시간 콘솔 로깅

---

## 📁 전체 프로젝트 디렉토리 구조

```plaintext
skala-front/
├── docs/                             # 강의 교재 PDF 및 3일 종합 강의 노트
├── skala-vue/                        # Vue 3 프론트엔드 프로젝트 루트
│   ├── .env                          # RestCountries API Key 환경변수
│   ├── vite.config.js                # Vite 설정 (Alias, Proxy, envPrefix)
│   ├── package.json                  # Vue, Router, Pinia, Axios, Element Plus 의존성
│   ├── src/
│   │   ├── main.js                   # Pinia, Vue Router, Element Plus 전역 주입
│   │   ├── App.vue                   # 공통 헤더 네비게이션 및 RouterView
│   │   ├── assets/                   # 공통 CSS 및 에셋
│   │   ├── stores/                   # Pinia 전역 스토어 (counter.js, configStore.js)
│   │   ├── components/
│   │   │   ├── TravelCard.vue        # [과제] 국기 배경 적용 여행지 카드 컴포넌트
│   │   │   ├── exercise/             # 과제 컴포넌트 모음
│   │   │   └── practices/            # [수업] 일차별 실습 컴포넌트
│   │   │       ├── basic/            # 1~2일차 디렉티브, 이벤트, 폼 실습 컴포넌트
│   │   │       ├── composition/      # 2일차 반응성, computed, watch 실습 컴포넌트
│   │   │       ├── component/        # 3일차 생명주기, Props/Emits, Slot 실습 컴포넌트
│   │   │       └── library/          # 3일차 Store, Axios, Element Plus, ES6 실습 컴포넌트
│   │   └── views/
│   │       ├── HomeView.vue          # [메인] 세계 도시 날씨 & 여행 추천 대시보드
│   │       ├── practice/             # [실습] 1일차/2일차/3일차 탭 레이아웃 및 뷰
│   │       │   ├── PracticeLayout.vue
│   │       │   ├── Day1PracticeView.vue
│   │       │   ├── Day2PracticeView.vue
│   │       │   └── Day3PracticeView.vue
│   │       └── assignment/           # [과제] 일일 과제 확인 뷰
│   └── dist/                         # 프로덕션 빌드 번들
└── README.md                         # 종합 프로젝트 안내 문서
```

---

## 🛠️ 기술 스택 (Tech Stack)

* **Core**: Vue 3 (`<script setup>`, Composition API), JavaScript (ES6+)
* **Build Tool**: Vite 8
* **Routing**: Vue Router 4
* **State Management**: Pinia 3
* **HTTP Client**: Axios, Fetch API (RestCountries API)
* **UI & Styling**: Element Plus, Scoped CSS, CSS Variables
* **Code Quality**: ESLint, Oxlint, Prettier
