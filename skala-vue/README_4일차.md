# 🌤️ skala-vue: Day 4 과제 및 GIS 날씨 포털 개편 내역

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

## 📝 1. Day 4 메인 과제: GIS 기반 글로벌 날씨 포털 개편

기존의 카드 나열식 대시보드 구조를 탈피하고, **화면 전체를 100% 채우는 인터랙티브 기상레이더(Windy Radar)와 우측 플로팅 글래스모피즘(Frosted Glass) 사이드바** 중심의 최신 GIS 포털 인터페이스로 전면 개편하였습니다.

```
┌─────────────────────────────────────────────────────────────┬──────────────────────────┐
│ [좌상단 통합 툴바]                                          │ [우측 플로팅 사이드바]   │
│ 🟢 LIVE RADAR: 서울 (대한민국)                              │ 1. 활성 도시 HUD 요약    │
│ 💨 바람  🌧️ 비/레이더  🌡️ 기온  ☁️ 구름  🌊 파도            │    (℃/℉ 토글, 7일 예보)  │
│ 🔄 새로고침  🎲 랜덤  📍 내 위치  동기화: 10:50              │ 2. 🔍 검색 & 필터 제어   │
│                                                             │ 3. 4종 요약 통계 그리드  │
│                                                             │ 4. 🏙️ 도시 카드 리스트   │
│              [ Full-Canvas Windy Interactive Map ]          │    (국기 배경, 더보기)   │
│                                                             │ 5. 💻 실습/과제 링크     │
│                                                             │                          │
│ [하단 타임라인 스크러버 및 재생 바 100% 개방]               │ [❮ / ❯ 접기/펼치기 탭]   │
└─────────────────────────────────────────────────────────────┴──────────────────────────┘
```

---

## 🚀 2. 주요 구현 및 개편 상세

### 1) 풀캔버스 GIS 지도 + 좌상단 통합 툴바

- **화면 100% 뷰포트 레이더**: Windy Iframe을 `position: absolute; inset: 0;`으로 배치하여 전체 화면에 기상 레이더 투영.
- **타임라인 조작 공간 확보**: 지도 하단 타임라인 컨트롤 바를 가리지 않도록, 모든 액션 버튼(레이어 전환, 새로고침, 랜덤 여행지, 내 위치 탐색)을 **좌상단 단일 툴바**로 통합 배치.

### 2) 우측 플로팅 사이드바 & 최적 정보 계층 구조

- **글래스모피즘 오버레이**: `rgba(15, 17, 23, 0.55)` 배경과 `backdrop-filter: blur(20px)`를 적용하여 지도가 은은하게 비치는 미려한 UI 구현.
- **스마트 검색 UX (정보 계층 재배치)**:
  1. **상단 HUD**: 지도가 가리키는 현재 도시의 기온, 쾌적 지수, 4대 기상 수치, 복장 가이드, 7일 예보 팝업 버튼.
  2. **중단 검색/필터**: 실시간 검색창, 대륙별 칩, 날씨 상태 칩, 정렬 드롭다운을 도시 목록 바로 위에 배치하여 **검색어 입력 시 10px 아래에 결과가 즉시 노출**되도록 개선.
  3. **본문 리스트**: 컴팩트 4대 통계 요약 + **기본 6개 카드 노출 & `▼ 전체 도시 더보기` 토글**로 스크롤 피로도 최소화.
  4. **사이드바 접기/펼치기**: 엣지 토글 탭(`❮ / ❯`)을 통해 원클릭으로 지도를 넓게 보거나 사이드바를 호출.

### 3) RestCountries 국기 배경 텍스처 (`WeatherLiveCard.vue`)

- **국기 워터마크 레이어**: RestCountries API를 통해 수신한 각 국가의 국기 이미지를 카드 배경 텍스처로 적용 (`opacity: 0.35`, 카드 호버 시 `scale(1.08)` 줌 효과).
- **틴트 글래스 오버레이**: 국기 위에 어두운 반투명 그라데이션을 덮어 텍스트와 기온 수치, 뱃지의 시인성을 100% 확보.

### 4) 데이터 소스 일원화 (`public/data/cities.json`)

- 추천 도시와 주요 도시를 `public/data/cities.json` 단일 소스로 통합(전 세계 18개 도시).
- Open-Meteo 실시간 기상 API 및 RestCountries API와 동적 결합.

### 5) 보안 및 환경 변수 연동

- 하드코딩된 API 키를 제거하고 `.env`의 `REST_COUNTRIES_API_KEY` 환경 변수를 사용하도록 처리.
- `vite.config.js`의 `envPrefix: ['VITE_', 'RESTCOUNTRIES_', 'REST_']` 설정.

---

## 🗂️ 3. 라우팅 및 파일 구조

### 🧭 라우팅 경로 (URL Guide)

- **`http://localhost:5173/` (홈)**: 풀캔버스 GIS 실시간 날씨 & 여행 레이더 포털
- **`http://localhost:5173/practice` (실습 코드)**:
  - `1일차`: 반응형 데이터(`ref`), 디렉티브 기초 실습
  - `2일차`: 양방향 바인딩(`v-model`), `computed`, `watch` 실습
  - `3일차`: `Lifecycle`, `Props/Emits`, `Slot` 실습
  - `4일차`: **4일차 실습 전용 페이지 (`Day4PracticeView.vue`)**
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
│   │   │   └── Day4PracticeView.vue     # ✨ 4일차 실습용 스타터 페이지
│   │   └── assignment/                  # 과제 모음 뷰
│   │
│   ├── components/weather/
│   │   ├── WeatherLiveCard.vue          # 🚩 국기 배경 텍스처 글래스모피즘 날씨 카드
│   │   ├── WeatherStatsSummary.vue      # 📊 4종 컴팩트 통계 요약 카드 그리드
│   │   ├── WeatherDetailModal.vue       # ⏱️ 7일간 시간별/일별 상세 예보 모달
│   │   └── WindySettingsModal.vue       # ⚙️ Windy 레이더 설정 모달
│   │
│   ├── services/
│   │   └── weatherService.js            # Open-Meteo & RestCountries API 통신 모듈
│   │
│   └── stores/
│       └── configStore.js               # Pinia 단위 변환 전역 스토어 (℃ / ℉)
│
├── .env                                 # API Key 환경변수 (REST_COUNTRIES_API_KEY)
├── vite.config.js                       # Vite 프록시 및 envPrefix 설정
└── README_4일차.md                      # 4일차 작업 및 아키텍처 문서
```

- axios와 fetch API의 차이
- axios를 활용한 외부 API 사용
  - weather API 를 활용하여 날씨 정보 가져오기
- UI Library
  -
