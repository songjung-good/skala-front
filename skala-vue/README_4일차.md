# 🌤️ skala-vue: Day 4 과제 & 실습 작업 내역

---

## 프로젝트 주소

> ### github: <https://github.com/songjung-good/skala-front>

> ### vercel배포: <http://skala-front-pi.vercel.app/>

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
│                                                             │ 2. [검색] 🔍 여행지 검색          │
│                                                             │    - 실시간 검색창, 필터 칩       │
│              [ Full-Canvas Windy Interactive Map ]          │    - ─── 하단 구분선 ───        │
│                                                             │ 3. [목록] 4종 컴팩트 통계 요약     │
│                                                             │ 4. [목록] 🏙️ 도시 카드 목록       │
│                                                             │    - 국기 배경, 더보기 토글       │
│                                                             │ 5. [하단] 💻 실습/과제 링크       │
│                                                             │                               │
│ [하단 타임라인 재생 바]                                          │ [ ❮ / ❯ 수직 중앙 토글 탭 ]      │
└─────────────────────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 🚀 2. 주요 구현 및 개편 상세

### 1) 풀캔버스 GIS 지도 + 통합 툴바

- **화면 100% 뷰포트 레이더**: Windy Iframe을 `position: absolute; inset: 0;`으로 배치하여 세계 기상 레이더 실시간 투영.
- **타임라인 조작 공간 확보**: 지도 하단 타임라인 컨트롤 바를 가리지 않도록, 액션 버튼(레이어 전환, 새로고침, 랜덤 여행지, 내 위치 탐색, 동기화 시각)을 **좌상단**으로 배치.

### 2) 우측 사이드바 & 여행지 정보

- **일체형 헤더 디자인 (박스 테두리 제거 & 하단 구분선)**:
  1. **[상단] 현재 도시 HUD**: 기온, 체감온도, 기상 수치, 복장 가이드, 단위 토글(`[ ℃ (초록) / ℉ (흰색) ]`), 7일 예보 팝업 버튼 배치.
  2. **[검색] 🔍 여행지 검색 & 필터 제어부**: 검색창 바로 아래에 카드 리스트가 연결되어 검색-결과 간 시선 이동 거리 최소화.
  3. **[목록] 통계 및 도시 카드 목록**:
     - **4종 핵심 지표 카드**(`표시 중인 도시`, `평균 기온`, `최고 기온`, `최저 기온`)
     - **스마트 노출 UX**: 기본 6개 카드만 노출하고 **`▼ 전체 도시 더보기 (+N개)`** 버튼으로 확장/접기 지원.
  4. **[접기/펼치기 탭]**: 사이드바 좌측 토글 버튼(`❮ / ❯`)을 배치하여 조작 편의성 확대

### 3) RestCountries 국기 배경 (`WeatherLiveCard.vue`)

- **국기 워터마크 레이어**: RestCountries API 통해 수신한 각 국기 이미지를 카드 배경 텍스처로 적용 (`opacity: 0.35`, 호버 시 `scale(1.08)` 줌 효과).
- **오버레이**: 국기 위에 어두운 반투명 그라데이션을 덮어 텍스트와 기온 수치, 뱃지의 시인성 확보.

### 4) API 장애 대비 Fallback & 사용자 API 키 설정

- **안정적 Fallback 메커니즘**: 외부 날씨/지도 API(Open-Meteo, Windy 등) 장애, 호출 한도 초과, 키 누락 시 앱 중단을 방지하기 위해 `public/data/cities.json` 로컬 데이터셋으로 자동 대체(Fallback) 처리.
- **API 키 관리/추가 모달**: 사용자가 직접 본인의 API 키를 입력/수정할 수 있는 설정 버튼(`WindySettingsModal.vue`)을 제공하여 키 만료 시에도 즉시 대응 가능.

### 5) 날씨 기반 여행 추천 점수 산출

- **스마트 쾌적 지수 알고리즘**: 기온, 습도, 강수량, 풍속 등의 실시간 기상 수치를 종합 연산하여 0~100점 척도의 여행 추천 점수 산출.
- **시각화 & 가이드 연동**: 점수 구간별 컬러 뱃지 및 실시간 복장/여행 팁(반팔, 겉옷, 우산 지참 등) 제공.

### 6) 일주일 상세 기상 정보

- **주간 예보 제공**: 도시 카드 또는 상세 버튼 클릭 시 해당 지역의 7일간 일별 최저/최고 기온 및 기상 추이 제공.
- **시간대별 심층 데이터**: 24시간 시간별 기온 변화, 체감온도, 강수 확률, 자외선 지수 등 여행 계획에 필요한 상세 기상 정보 통합 렌더링.

---

## 💻 3. Day 4 실습 코드

- **실습 페이지 경로**: `http://localhost:5173/practice/day4`
- **마운트된 컴포넌트**:
  1. **`OpenWeatherMap.vue`**: OpenWeatherMap REST API를 Axios를 통해 비동기 호출하여 지역 실시간 기상 데이터를 파싱 및 렌더링.
  2. **`JsonPlaceholder.vue`**: JSONPlaceholder Mock REST API를 활용하여 Axios 비동기 `GET` 요청 및 게시글 목록 렌더링 실습.
  3. **`UserForm.vue`**: Element Plus UI 컴포넌트(`el-input`, `el-checkbox`, `el-input-number`, `el-rate`, `el-progress`) 및 인터랙티브 알림(`ElMessage`, `ElMessageBox`) 실습.

---

## 🗂️ 4. 라우팅 및 파일 구조

### 🧭 라우팅 경로 (URL Guide)

- **`http://localhost:5173/` (홈)**: GIS 실시간 날씨 & 여행지 정보 포털
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

---

## 💡 5. 학습 내용 및 실습 시행착오 (Troubleshooting & Key Takeaways)

### 1) Vue 핵심 개념 및 문법 정리

1. **Vue 프레임워크 특징**
   - Angular, React와 함께 현대 웹 프론트엔드를 이끄는 핵심 도구
   - **반응형(Reactivity)**, **SPA(Single Page Application)**, **컴포넌트 기반 아키텍처**를 통한 높은 재사용성 및 유지보수성 제공
2. **핵심 디렉티브 문법**
   - `v-bind` (`:`): HTML 속성값(`id`, `class`, `src`, `style` 등)을 자바스크립트 반응형 데이터와 연결
   - `v-model`: 폼 입력 요소(`input`, `select`, `checkbox` 등)와 스크립트 데이터 간 양방향 바인딩
   - `v-on` (`@`): 클릭, 키 입력 등 사용자 이벤트를 감지하여 핸들러 함수 실행
   - `v-if` / `v-show`: 조건식의 참/거짓 여부에 따른 조건부 렌더링 (DOM 제거 vs `display: none`)
   - `v-for`: 배열/객체 데이터를 순회하여 동적으로 반복 렌더링 (`:key` 필수 지정)
3. **Vue 생태계 및 보조 도구**
   - **Pinia**: Vue 3 공식 표준 상태 관리 라이브러리로, 복잡한 상태를 전역 저장소(Store)에서 직관적으로 관리
   - **Element Plus**: 완성도 높은 UI 컴포넌트 라이브러리 (버튼, 모달, 폼, 메시지 알림 등 신속 구현)
   - **Vue Router**: SPA 환경에서 URL 경로에 맞춰 페이지 뷰를 매핑하고 전환하는 공식 라우터
   - **Vite**: esbuild 기반의 초고속 HMR(Hot Module Replacement)과 빌드 환경을 제공하는 차세대 빌드 툴

---

### 2) Vercel 배포 프로세스

1. **GitHub 레포지토리 연동**: Vercel은 GitHub 저장소의 변경사항(Push)을 감지하여 자동 빌드/배포(CI/CD) 수행
2. **회원가입 및 소셜 로그인**: GitHub 계정으로 간편하게 연동 및 가입
3. **New Project 생성**: 배포 대상 저장소(Repository) Import
4. **Root Directory 설정**: 모노레포나 하위 디렉터리 구조인 경우 실제 소스가 위치한 빌드 폴더(`skala-vue`)를 Root Directory로 지정
5. **Environment Variables 등록**: API Key 등 배포 환경에 필요한 환경변수를 Vercel 대시보드에 안전하게 등록

---

### 3) 실습 중 겪은 시행착오 및 핵심 배운 점

#### ① `npm install` / 실행 경로 오류 ➡️ 프로젝트 루트 디렉터리 확인

- **시행착오**: 상위 폴더(`skala-front/`)에서 `npm i`나 `npm run dev`를 실행했을 때 `package.json`을 찾을 수 없거나 의존성 설치가 정상적으로 이루어지지 않는 에러 발생.
- **해결 및 배운 점**: `package.json`이 위치한 하위 작업 폴더(`skala-vue/`)로 이동(`cd skala-vue`)한 후 명령어를 실행해야 함을 확인.

#### ② DOM ID 및 동적 CSS 클래스 바인딩을 통한 스타일·데이터 제어

- **배운 점**: 단순한 정적 CSS 적용을 넘어, `:id="`city-${item.id}`"`, `:class`, `:style` 등의 속성 바인딩을 활용하여 컴포넌트의 상태(기온, 날씨 상태, 선택 여부 등)에 따라 동적인 스타일링을 구현
- **활용**: 고유 DOM ID 기반의 스크롤/포커스 제어 및 도시별 기상 조건(맑음/비/눈 등)에 따른 배경 텍스처와 효과를 실시간 전환 구현.

#### ③ 데이터 전달 방식의 진화: `Props/Emit` ➡️ `Pinia` 전역 상태 관리

- **시행착오 & 한계**: 컴포넌트 계층이 깊어질수록 부모-자식 간 `Props`와 `Emit`으로 데이터를 주고받는 방식은 코드의 복잡도를 높이고 유지보수를 어렵게 함.
- **해결 및 배운 점**: **Pinia**를 도입하여 온도 단위(`℃` / `℉`), 활성 도시 상태 등 애플리케이션에서 공유되는 데이터를 중앙 집중식 스토어(`configStore.js`)로 이관.

#### ④ Vue 명명 규칙 및 코드 컨벤션 학습 (`*View.vue`, 카멜케이스, 파스칼케이스)

- **배운 점**:
  - **View 컴포넌트 명명**: 라우터와 1:1로 매핑되는 최상위 페이지 컴포넌트는 `*View.vue`(예: `HomeView.vue`, `Day4PracticeView.vue`)로 명명하여 재사용 목적의 일반 컴포넌트(`WeatherLiveCard.vue`)와 명확히 구분.
  - **식별자 표기법(Naming Convention)**: 컴포넌트 파일 및 템플릿 태그는 **PascalCase**(`WeatherDetailModal`), JavaScript 변수/함수/반응형 상태(`ref`, `reactive`)는 **camelCase**(`selectedCity`, `fetchWeatherData`), HTML 속성 및 이벤트 바인딩은 **kebab-case**를 적용하는 표준 컨벤션 준수.

#### ⑤ API Key 및 환경변수(`.env`) 보안 분리 관리

- **시행착오 & 보안 중요성**: OpenWeatherMap이나 RestCountries와 같은 외부 API Key를 소스 코드 내에 하드코딩하면, GitHub 등 공개 저장소에 푸시되었을 때 키 유출 및 보안 사고가 발생할 위험이 있음.
- **해결 및 배운 점**:
  - 민감한 설정값은 `.env` 파일로 분리하고 `.gitignore`에 등록하여 Git 추적에서 제외.
  - Vite의 환경변수 접두사 규칙(`VITE_`)을 이해하고, 소스 코드에서는 `import.meta.env.VITE_...` 형태로 안전하게 불러와 사용.
  - 프로덕션 배포 시에는 소스에 포함시키지 않고 호스팅 플랫폼(Vercel)의 환경변수 관리 탭에 직접 등록
