# 🌤️ 실시간 글로벌 날씨 & 여행지 추천 대시보드

> github: <https://github.com/songjung-good/skala-front>
>
> vercel배포: <http://skala-front-pi.vercel.app/>

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

## 🧭 라우팅 경로 (URL Guide)

- **`http://localhost:5173/` (홈)**: GIS 풀캔버스 실시간 날씨 레이더 & 스마트 여행 추천 포털
- **`http://localhost:5173/practice` (실습 코드)**:
  - `1일차`: 반응형 데이터(`ref`), `v-bind`, `v-if`, `v-for` 기초 실습
  - `2일차`: `v-model`, `v-on`, `computed`, `watch`, `watchEffect` 실습
  - `3일차`: `Lifecycle`, `Props & Emits`, `Slots(Default/Named/Scoped)` 실습
  - `4일차`: `Axios 비동기 통신 (OpenWeatherMap, JSONPlaceholder)`, `Element Plus UI` 실습
- **`http://localhost:5173/assignment` (일일 과제)**:
  - `과제 1~5 통합`: Mockup부터 Vue Router, Pinia 스토어까지 단계별 과제 모음
  - `🌦️ 날씨 대시보드`: 컴포넌트 기반 반응형 날씨 대시보드
  - `🔍 상세 정보`: 도시별 상세 기상 정보 뷰 (`/assignment/weather/:id`)
  - `ℹ️ 서비스 소개`: 프로젝트 아키텍처 및 서비스 안내 뷰 (`/assignment/about`)
  - `📊 통계 분석`: 전국 기상 분석 및 랭킹 리포트 (`/assignment/stats`)

---

## 🚀 메인 기능 정리

### 1. 풀캔버스 GIS 인터랙티브 기상 레이더 (`Windy Radar`)
- **100% 뷰포트 레이더 캔버스**: 세계 기상 레이더를 화면 전체에 투영 (`position: absolute; inset: 0`).
- **5종 레이더 레이어 실시간 전환**: 💨 바람, 🌧️ 비/번개, 🌡️ 기온, ☁️ 구름, 🌊 파도 레이어 원클릭 토글.
- **좌상단 통합 플로팅 툴바**: 하단 타임라인 재생 바를 가리지 않도록 액션 컨트롤(레이어 변경, 새로고침, 랜덤 여행지, 내 위치 탐색, 동기화 시각) 배치.

### 2. 우측 플로팅 스마트 사이드바 & 여행 정보 포털
- **현재 활성 도시 HUD**: 현재 선택된 도시의 실시간 기온, 체감온도, 복장 가이드, 단위 토글(`℃`/`℉`), 7일 예보 팝업 트리거.
- **실시간 여행지 검색 & 날씨 필터 칩**: 한글/영문 검색어 및 맑음/흐림/비/눈 필터링 즉시 반영.
- **4종 컴팩트 통계 요약 그리드**: 표시 중인 도시 수, 평균 기온, 최고 기온, 최저 기온 실시간 집계.
- **스마트 카드 리스트 UX**: 기본 6개 카드만 노출 후 `▼ 전체 도시 더보기 (+N개)` 버튼으로 확장/접기 지원.
- **사이드바 접기/펼치기 탭**: 좌측 수직 중앙 토글 버튼(`❮ / ❯`)을 통한 레이더 맵 전체 화면 모드 지원.

### 3. RestCountries 국기 배경 텍스처 & 글래스모피즘 (`WeatherLiveCard.vue`)
- **국기 워터마크 레이어**: RestCountries API를 통해 수신한 각 국가 국기 이미지를 카드 배경으로 활용 (`opacity: 0.35`, 마우스 호버 시 `scale(1.08)` 줌 인터랙션).
- **시인성 오버레이**: 텍스트, 기온 수치, 뱃지가 돋보이도록 어두운 반투명 그라데이션 적용.

### 4. 실시간 기상 기반 스마트 여행 추천 점수 알고리즘
- **쾌적 지수 연산 (0~100점)**: 최적 기온(22°C) 편차 감점 및 실시간 기상 상태(맑음/구름/비/눈), 풍속, 습도를 종합 가감 연산.
- **4단계 컬러 뱃지**: 🏆 강력 추천 (90점 이상), 👍 추천 (75~89점), ⚠️ 보통 (60~74점), 🌧️ 비추천 (60점 미만).
- **맞춤 복장 및 행동 가이드**: 기온 및 날씨에 최적화된 옷차림/준비물 가이드 자동 생성.

### 5. 7일간(일주일) 상세 기상 예보 모달 (`WeatherDetailModal.vue`)
- **주간 일별 예보**: 7일간 일별 최저/최고 기온 및 기상 추이 시각화.
- **24시간 시간별 심층 예보**: 시간대별 기온 추이, 강수 확률, 체감온도, 습도, 풍속 상세 정보 렌더링.
- **키보드 & 백드롭 제어**: `ESC` 키 바인딩 및 모달 배경 클릭 시 닫기 지원.

### 6. 브라우저 Geolocation & 랜덤 여행지 탐색
- **내 위치 날씨 조회 ("📍 내 위치")**: `navigator.geolocation` Web API로 사용자 현재 좌표를 파악하여 실시간 기상 조회 및 카드 추가.
- **랜덤 여행지 추천 ("🎲 랜덤")**: 전체 도시 중 1곳을 무작위 추천하고 해당 위치로 지도 및 HUD 즉시 동기화.

### 7. API 장애 대응 Fallback & 사용자 API 키 설정 모달
- **안정적 Fallback 메커니즘**: Open-Meteo, RestCountries 등 외부 API 호출 실패나 네트워크 장애 시 `public/data/cities.json` 18개 도시 데이터로 무중단 자동 전환.
- **API Key 커스텀 설정 (`WindySettingsModal.vue`)**: 사용자가 직접 본인의 API Key를 등록/수정하여 키 만료나 한도 초과에 유연하게 대응.

### 8. Pinia 전역 상태 관리 (`configStore.js`)
- **온도 단위 원클릭 전환**: 섭씨(`℃`) ↔ 화씨(`℉`) 전환 시 홈 포털, 카드, 모달, 통계, 과제 뷰 등 앱 전역의 모든 기온 표기가 즉시 동기화.
- **전역 설정 중앙 집중화**: Props Drilling 없이 어느 컴포넌트에서든 전역 포맷터(`formatTemp`) 및 액션 손쉽게 호출.

---

## 📖 일차별 상세 학습 보고서

- [README_1일차.md](./README_1일차.md): Vue 3 코어, 템플릿 문법, 디렉티브, 반응형 ref
- [README_2일차.md](./README_2일차.md): v-model 폼 바인딩, computed/watch, Pinia 스토어
- [README_3일차.md](./README_3일차.md): Props/Emits, 컴포넌트 생명주기, Slot, REST API 분리
- [README_4일차.md](./README_4일차.md): axios를 통한 통신, Vue UI tool 학습
