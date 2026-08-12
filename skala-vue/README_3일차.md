# 🌤️ skala-vue: Day 3 학습 및 과제

---

## 🛠️ 프로젝트 실행 및 빌드

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (Hot-Reload)
npm run dev

# 프로덕션 빌드 (dist/ 생성)
npm run build

# 코드 검사 및 포맷팅
npm run lint
npm run format
```

---

## 📝 1. Day 3 학습 내용 정리

### 1) `Props` & `Emits` (부모-자식 컴포넌트 통신)
* **`defineProps()` (부모 ➡️ 자식)**: 단방향 데이터 바인딩(One-way Data Flow) 원칙에 따라 부모가 자식에게 데이터를 주입. 자식은 주입받은 prop을 직접 수정할 수 없음.
* **`defineEmits()` (자식 ➡️ 부모)**: 자식 컴포넌트에서 이벤트 발생 시 부모 컴포넌트에 알림 및 인자(Payload)를 전달하는 커스텀 이벤트 발행 매크로.

### 2) `Component Slot` (컴포넌트 템플릿 주입)
* **Default Slot (`<slot />`)**: 부모가 자식의 태그 사이에 넘겨준 마크업을 자식 컴포넌트 내부에 렌더링.
* **Named Slot (`<slot name="header" />`)**: 슬롯에 이름을 부여하여 여러 개의 독립적인 UI 영역(`<template #header>`)을 분할 주입.
* **Scoped Slot (`<slot :item="data" />`)**: 자식 컴포넌트의 내부 데이터를 부모의 템플릿 슬롯 스코프로 역전달하여 부모가 렌더링 형태를 커스텀할 수 있도록 지원.

### 3) `Component Lifecycle` (컴포넌트 생명주기)
* **`onMounted()`**: DOM 트리가 생성되고 마운트된 직후 1회 실행. 비동기 API 호출, 타이머 등록, 외부 라이브러리 초기화에 사용.
* **`onUpdated()`**: 반응형 상태 변화로 인해 DOM 리렌더링이 완료된 직후 실행.
* **`onUnmounted()`**: 컴포넌트가 DOM에서 소멸(Destroy)되기 직전 실행. `setInterval`, `addEventListener` 등 메모리 누수 유발 요소를 클린업(Cleanup).

### 4) `Provide` & `Inject` (트리 의존성 주입)
* 상위 컴포넌트에서 `provide(key, value)` 선언 시, 중간 컴포넌트들을 거치지 않고(Props Drilling 방지) 하위 깊숙한 트리 어디서든 `inject(key)`로 데이터 수신.

### 5) `Pinia` (전역 상태 관리 라이브러리)
* 컴포넌트 트리 외부의 전역 스토어(`defineStore`)를 구성하여 모든 컴포넌트가 동일한 상태를 공유.
* **`state`** (`ref`): 전역 반응형 데이터
* **`getters`** (`computed`): 상태 기반 파생 연산 데이터
* **`actions`** (`function`): 상태 변경 비즈니스 로직 및 비동기 처리 함수

---

## 🗂️ 2. 실습 및 과제 프로젝트 구조

### 🧭 라우팅 경로 (URL Guide)

* **`http://localhost:5173/` (홈)**: 세계 주요 도시 실시간 날씨 & 여행 추천 대시보드
* **`http://localhost:5173/practice` (실습 코드)**:
  * `1일차 탭`: 반응형 데이터(`ref`), `v-html`, `v-bind`, `v-if`, `v-for` 기초 실습
  * `2일차 탭`: `v-model`, `v-on`, `computed`, `watch`, `watchEffect` 실습
  * `3일차 탭`: `Lifecycle`, `Props & Emits`, `Slots(Default/Named/Scoped)` 실습
* **`http://localhost:5173/assignment` (일일 과제)**:
  * `과제 1`: 1일차 Mockup 날씨 대시보드
  * `과제 2`: 2일차 Composition API 날씨 대시보드
  * `과제 3`: 3일차 Component 분리 날씨 대시보드 (`WeatherParent`, `BaseDashboardCard`, `SearchBar`, `WeatherCard`, `StatusBar`)

---

### 📁 주요 파일 디렉토리 구조

```text
skala-vue/
├── public/
│   └── data/
│       └── cities.json                  # 글로벌 도시 위/경도 및 오프라인 Fallback 데이터
│
├── src/
│   ├── components/
│   │   ├── travelweather/               # 🌍 메인 대시보드(HomeView) 전용 컴포넌트
│   │   │   ├── TravelCard.vue           # 도시별 여행 점수/국기 카드 (Props/Emits)
│   │   │   ├── TravelSearchBar.vue      # 검색 및 날씨 필터 제어바 (Props/Emits)
│   │   │   └── TravelSummary.vue        # 도시 수/평균 기온/추천점수 통계 요약 (Props)
│   │   │
│   │   ├── exercise/                    # ⛅ 일일 과제 컴포넌트 모음
│   │   │   ├── WeatherParent.vue        # 부모 컨테이너 (비즈니스 로직 및 상태 총괄)
│   │   │   ├── BaseDashboardCard.vue    # 공통 카드 레이아웃 (Default Slot)
│   │   │   ├── SearchBar.vue            # 검색 & 날씨 필터 (Props/Emits)
│   │   │   ├── WeatherCard.vue          # 날씨 카드 & 4단계 기온 뱃지 (Props/Emits)
│   │   │   └── StatusBar.vue            # 상태 안내바 (Props)
│   │   │
│   │   └── practices/component/         # 3일차 기초 컴포넌트 실습 모음
│   │
│   ├── services/
│   │   └── weatherService.js            # Open-Meteo 실시간 API & RestCountries 국기 API 서비스 모듈
│   │
│   ├── stores/
│   │   └── configStore.js               # Pinia 단위 토글 스토어 (℃ / ℉)
│   │
│   ├── views/
│   │   ├── HomeView.vue                 # 메인 글로벌 날씨 & 여행 추천 대시보드
│   │   ├── practice/                    # 실습 모음 뷰
│   │   └── assignment/                  # 과제 모음 뷰
│   │
│   └── App.vue                          # 글로벌 레이아웃 & 라우터 뷰
```

---

## 🚀 3. 메인 페이지 (`HomeView.vue`) 기능 분석

### 📌 1) 기존 기능 (기초 구현)
* **세계 9개 주요 도시 날씨 뷰어**: 서울, 도쿄, 파리, 런던, 뉴욕, 방콕, 시드니, 카이로, 로마.
* **휴리스틱 여행 추천 점수 (`calculateTravelScore`)**: 최적 기온(22°C) 편차 감점 및 날씨 상태(맑음, 구름, 흐림, 비, 눈)별 가감점을 반영하여 0~100점 산출 및 4단계 등급(🏆 강력 추천, 👍 추천, ⚠️ 보통, 🌧️ 비추천) 뱃지 부여.
* **한글 국가명 매핑 & RestCountries 국기 연동**: 국가별 공식 국기 이미지 자동 매핑.

---

### ✨ 2) 3일차 적용 신규 기능 및 리팩토링 내역

#### ① 완벽한 컴포넌트 분리 (`Props` / `Emits` 통신)
1. **`TravelSearchBar.vue`**:
   * 부모(`HomeView`)로부터 `searchQuery`, `statusOptions`, `selectedStatus`를 `props`로 주입받아 렌더링.
   * 사용자 입력 및 필터 클릭 시 `update-query`, `update-status` 이벤트를 `emits`로 상위 전달.
2. **`TravelSummary.vue`**:
   * 부모의 계산된 `stats` 객체(`count`, `avgTemp`, `avgScore`)를 `props`로 단방향 전달받아 그리드 통계 렌더링.
3. **`TravelCard.vue`**:
   * 각 도시 객체(`city`)를 `props`로 받아 국기 이미지, 기온, 추천 점수를 출력하며, 클릭 시 `select`, `detail` 이벤트를 부모에 `emits`.

#### ② 외부 API 데이터 통신 전용 서비스 모듈 분리 (`weatherService.js`)
* 뷰 컴포넌트(`HomeView.vue`) 내에 혼재되어 있던 API 엔드포인트 URL, 헤더 설정, WMO 코드 변환 로직을 `src/services/weatherService.js`로 분리.

#### ③ Open-Meteo 실시간 글로벌 날씨 API 연동 & 오프라인 Fallback 보장
* **실시간 날씨 연동**: `Open-Meteo` 공개 API를 통해 9개 도시의 위/경도 기준 실제 실시간 기온 및 WMO 기상 코드를 일괄 조회.
* **서비스 무중단 Fallback 구조**: 네트워크 장애나 API 오류 발생 시 `public/data/cities.json` 정적 데이터로 자동 전환되어 앱이 멈추지 않음.
* **데이터 상태 뱃지**: 화면 상단에 `🟢 실시간 날씨 연동 (Open-Meteo)` 또는 `🟡 로컬 데이터 모드` 안내 칩 실시간 표기.

#### ④ 비동기 로딩 상태 관리 (`isLoading`)
* `onMounted` 시점에 날씨 데이터 및 국기 리소스를 병렬 로드하며, 로딩 중에는 스피너 애니메이션을 노출하여 부드러운 사용자 경험 제공.

---

## 🎯 4. 일일 과제 (`WeatherParent.vue`) 컴포넌트 아키텍처 요약

기존 단일 컴포넌트 코드를 기능 변경 없이 5개의 역할 분리 컴포넌트로 모듈화:

| 컴포넌트명 | 역할 및 특징 | 통신 방식 |
| :--- | :--- | :--- |
| **`WeatherParent.vue`** | 반응형 데이터 원본(`ref`), `computed`, `watch`, `watchEffect` 총괄 | 최상위 컨테이너 |
| **`BaseDashboardCard.vue`** | 검색 영역과 목록 영역의 카드 UI 스타일 공통화 | `<slot></slot>` 주입 |
| **`SearchBar.vue`** | 도시 검색창 및 날씨 카테고리 필터 버튼 | `props` / `update-query`, `update-status` emits |
| **`WeatherCard.vue`** | 기온별 4단계 뱃지, 카드 클릭 및 상세보기 버튼 | `props` / `select-card`, `click-detail` emits |
| **`StatusBar.vue`** | 하단 선택 도시 안내 문구 표시 | `props` |
