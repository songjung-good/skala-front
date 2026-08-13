# 🌤️ skala-vue: Day 4 과제 & 실습 작업 내역

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

## 📝 1. GIS 기반 글로벌 날씨 포털

카드 나열식 대시보드 구조를 탈피하고, **화면 전체를 100% 채우는 인터랙티브 기상레이더(Windy Radar)와 우측 플로팅 사이드바** 중심의 최신 GIS 포털 인터페이스로 개편하였습니다.

```
┌─────────────────────────────────────────────────────────────┬───────────────────────────────┐
│ [좌상단 통합 플로팅 툴바]                                        │ [우측 플로팅 사이드바]             │
│ 🟢 LIVE RADAR: 서울 (대한민국)                                 │ 1. [상단] 활성 도시 HUD 헤더       │
│ 💨 바람  🌧️ 비/레이더  🌡️ 기온  ☁️ 구름  🌊 파도                    │    - 단위 토글 (℃/℉), 7일 예보   │
│ 🔄 새로고침  🎲 랜덤  📍 내 위치  11:30 동기화                      │    - ─── 하단 구분선 ───        │
│                                                             │ 2. [중단] 🔍 여행지 검색          │
│                                                             │    - 실시간 검색창, 필터 칩       │
│              [ Full-Canvas Windy Interactive Map ]          │    - ─── 하단 구분선 ───        │
│                                                             │ 3. [본문] 4종 컴팩트 통계 요약     │
│                                                             │ 4. [본문] 🏙️ 도시 카드 목록       │
│                                                             │    - 국기 배경, 더보기 토글       │
│                                                             │ 5. [하단] 💻 실습/과제 링크       │
│                                                             │                               │
│ [하단 타임라인 재생 바]                                          │ [ ❮ / ❯ 수직 중앙 토글 탭 ]      │
└─────────────────────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 🚀 2. 주요 구현 및 개편 상세

### 1) 풀캔버스 GIS 지도 + 좌상단 통합 툴바

* **화면 100% 뷰포트 레이더**: Windy Iframe을 `position: absolute; inset: 0;`으로 배치하여 전 세계 기상 레이더 실시간 투영.
* **타임라인 조작 공간 확보**: 지도 하단 타임라인 컨트롤 바를 가리지 않도록, 모든 액션 버튼(레이어 전환, 새로고침, 랜덤 여행지, 내 위치 탐색, 동기화 시각)을 **좌상단 단일 툴바**로 통합 배치.

### 2) 우측 플로팅 사이드바 & 일체형 정보 계층 구조

* **일체형 헤더 디자인 (박스 테두리 제거 & 하단 구분선)**:
  1. **[상단] 현재 도시 HUD**: 기온, 체감온도, 기상 수치, 복장 가이드, 단위 토글(`[ ℃ (초록) / ℉ (흰색) ]`), 7일 예보 팝업 버튼 배치.
  2. **[중단] 🔍 여행지 검색 & 필터 제어부**: 검색창 바로 아래에 카드 리스트가 연결되어 검색-결과 간 시선 이동 거리 최소화.
  3. **[본문] 통계 및 도시 카드 목록**:
     * **4종 핵심 지표 카드**(`표시 중인 도시`, `평균 기온`, `최고 기온`, `최저 기온`)
     * **스마트 노출 UX**: 기본 6개 카드만 노출하고 **`▼ 전체 도시 더보기 (+N개)`** 버튼으로 확장/접기 지원.
  4. **[접기/펼치기 탭]**: 사이드바 좌측 토글 버튼(`❮ / ❯`)을 배치하여 조작 편의성 확대

### 3) RestCountries 국기 배경 텍스처 (`WeatherLiveCard.vue`)

* **국기 워터마크 레이어**: RestCountries API 및 ISO-2 코드 CDN을 통해 수신한 각 국가의 국기 이미지를 카드 배경 텍스처로 적용 (`opacity: 0.35`, 호버 시 `scale(1.08)` 줌 효과).
* **틴트 글래스 오버레이**: 국기 위에 어두운 반투명 그라데이션을 덮어 텍스트와 기온 수치, 뱃지의 시인성을 100% 확보.



----- 

## 💻 3. Day 4 실습 코드

- **실습 페이지 경로**: `http://localhost:5173/practice/day4`
- **마운트된 컴포넌트**:
  1. **`OpenWeatherMap.vue`**: OpenWeatherMap REST API를 Axios를 통해 비동기 호출하여 광주 지역 실시간 기상 데이터를 파싱 및 렌더링.
  2. **`JsonPlaceholder.vue`**: JSONPlaceholder Mock REST API를 활용하여 Axios 비동기 `GET` 요청 및 게시글 목록 렌더링 실습.
  3. **`UserForm.vue`**: Element Plus UI 컴포넌트(`el-input`, `el-checkbox`, `el-input-number`, `el-rate`, `el-progress`) 및 인터랙티브 알림(`ElMessage`, `ElMessageBox`) 실습.

---

## 🗂️ 4. 라우팅 및 파일 구조

### 🧭 라우팅 경로 (URL Guide)

- **`http://localhost:5173/` (홈)**: 풀캔버스 GIS 실시간 날씨 & 여행 레이더 포털
- **`http://localhost:5173/practice` (실습 코드)**:
  - `1일차`: 반응형 데이터(`ref`), 디렉티브 기초 실습
  - `2일차`: 양방향 바인딩(`v-model`), `computed`, `watch` 실습
  - `3일차`: `Lifecycle`, `Props/Emits`, `Slot` 실습
  - `4일차`: **Axios 비동기 데이터 통신 실습 (`OpenWeatherMap`, `JsonPlaceholder`)**
- **`http://localhost:5173/assignment` (과제 모음)**:
  - `과제 1~5`: 일일 단계별 날씨 대시보드 및 Vue Router / Pinia 과제

---

### 📁 핵심 파일 구조

```text
skala-vue/
├── public/
│   └── data/
│       └── cities.json                  # 전 세계 18개 주요 도시 위/경도 및 기준 데이터셋
│
├── src/
│   ├── views/
│   │   ├── HomeView.vue                 # 🌟 메인 풀스크린 GIS 지도 & 플로팅 사이드바 포털
│   │   ├── practice/
│   │   │   ├── PracticeLayout.vue       # 실습 공통 레이아웃 (1~4일차 탭 내비게이션)
│   │   │   ├── Day1PracticeView.vue
│   │   │   ├── Day2PracticeView.vue
│   │   │   ├── Day3PracticeView.vue
│   │   │   └── Day4PracticeView.vue     # ✨ 4일차 Axios 실습 뷰
│   │   └── assignment/                  # 과제 모음 뷰
│   │
│   ├── components/
│   │   ├── weather/
│   │   │   ├── WeatherLiveCard.vue      # 🚩 국기 배경 텍스처 글래스모피즘 날씨 카드
│   │   │   ├── WeatherStatsSummary.vue  # 📊 4종 컴팩트 통계 요약 카드 그리드
│   │   │   ├── WeatherDetailModal.vue   # ⏱️ 7일간 시간별/일별 상세 예보 모달
│   │   │   └── WindySettingsModal.vue   # ⚙️ Windy 레이더 설정 모달
│   │   │
│   │   └── practices/axios/
│   │       ├── OpenWeatherMap.vue       # ⚡ OpenWeatherMap Axios 기상 호출 실습
│   │       └── JsonPlaceholder.vue      # 📮 JSONPlaceholder CRUD 비동기 실습
│   │
│   ├── services/
│   │   └── weatherService.js            # Open-Meteo & RestCountries API 통신 모듈
│   │
│   └── stores/
│       └── configStore.js               # Pinia 단위 변환 전역 스토어 (℃ / ℉)
│
├── .env                                 # API Key 환경변수 (REST_COUNTRIES_API_KEY)
├── vite.config.js                       # Vite 프록시 및 envPrefix 설정
└── README_4일차.md                      # 4일차 과제 및 실습 전체 종합 문서
```
