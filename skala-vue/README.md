# 🌤️ skala-vue: 실시간 글로벌 날씨 & 여행지 추천 대시보드

> Vue 3 (Composition API), Vite, Vue Router, Pinia, Open-Meteo 실시간 기상 API 연동 대시보드 프로젝트

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

* **`http://localhost:5173/` (홈)**: 세계 주요 도시 실시간 날씨 & 여행 추천 대시보드
* **`http://localhost:5173/practice` (실습 코드)**:
  * `1일차 탭`: 반응형 데이터(`ref`), `v-html`, `v-bind`, `v-if`, `v-for` 기초 실습
  * `2일차 탭`: `v-model`, `v-on`, `computed`, `watch`, `watchEffect` 실습
  * `3일차 탭`: `Lifecycle`, `Props & Emits`, `Slots(Default/Named/Scoped)` 실습
* **`http://localhost:5173/assignment` (일일 과제)**:
  * `과제 1`: 1일차 Mockup 날씨 대시보드
  * `과제 2`: 2일차 Composition 날씨 대시보드
  * `과제 3`: 3일차 Component 분리 날씨 대시보드 (`WeatherParent`, `BaseDashboardCard`, `SearchBar`, `WeatherCard`, `StatusBar`)

---

## 🚀 메인 대시보드 (`HomeView.vue`) 핵심 기능

1. **실시간 기상 관측망 연동 (`Open-Meteo API`)**
   - 글로벌 주요 9개 도시의 위/경도 기반 실제 실시간 기온 및 날씨 상태 조회
   - 네트워크 오류 시 로컬 `cities.json` 기반 무중단 Fallback 모드 전환
2. **여행 쾌적도 점수 산출 (`calculateTravelScore`)**
   - 최적 기온(22°C) 편차 감점 및 기상 상태(맑음/구름/흐림/비/눈)별 가감점 반영 (0~100점)
   - 4단계 직관적 등급 뱃지 (🏆 강력 추천, 👍 추천, ⚠️ 보통, 🌧️ 비추천)
3. **4종 다중 정렬 파이프라인 (`sortBy`)**
   - 🏆 추천 점수 높은 순 (`score-desc`)
   - 🔥 기온 높은 순 (`temp-desc`)
   - ❄️ 기온 낮은 순 (`temp-asc`)
   - 🔤 도시명 가나다순 (`name-asc`)
4. **실시간 동기화 시각 & 스피닝 아이콘 새로고침**
   - 타이틀 바에 마지막 갱신 시각 실시간 표기
   - 미니멀 `🔄` 아이콘 버튼 및 로딩 중 무한 회전(`spinning`) 애니메이션
5. **랜덤 여행지 추천 ("🎲 어디로 갈까?")**
   - 필터링된 조건의 도시 중 무작위 1개 추천 및 상태바 연동
6. **브라우저 Geolocation 기반 내 위치 날씨 ("📍 내 위치 날씨")**
   - `navigator.geolocation` Web API로 사용자 좌표를 획득하여 실시간 날씨 즉시 조회 및 목록 최상단 추가
7. **여행지 상세 정보 모달 (`TravelDetailModal.vue`)**
   - `window.alert` 대신 Teleport 기반 인터랙티브 모달 팝업 제공
   - 기온, 날씨, 쾌적도 프로그레스 게이지, 위/경도 좌표, 날씨 맞춤 옷차림/준비물 가이드 출력
   - 배경(Backdrop) 클릭 및 `ESC` 키 바인딩 닫기 지원
8. **검색 UX & 빈 상태(Empty State) 원클릭 초기화**
   - 검색창 내 원클릭 지우기(`✕`) 버튼 탑재
   - 일치하는 도시가 없을 때 직관적인 Empty UI 및 "필터 및 검색 초기화" 복구 버튼 제공
9. **컴포넌트 분리 (`Props` / `Emits` 구조화)**
   - `TravelSearchBar.vue`: 검색, 날씨 필터 칩, 정렬 드롭다운, 원클릭 지우기, 액션 툴바
   - `TravelSummary.vue`: 검색 결과 수, 평균 기온, 평균 여행 점수 요약 통계
   - `TravelCard.vue`: 국기 배경 카드, 기온, 여행 등급 뱃지, 상세보기 이벤트
   - `TravelDetailModal.vue`: 도시별 심층 예보 및 여행 팁 모달 (Teleport)
   - `weatherService.js`: API 통신 및 Geolocation 로직 분리

---

## 📖 일차별 상세 학습 보고서

* [README_1일차.md](./README_1일차.md): Vue 3 코어, 템플릿 문법, 디렉티브, 반응형 ref
* [README_2일차.md](./README_2일차.md): v-model 폼 바인딩, computed/watch, Pinia 스토어
* [README_3일차.md](./README_3일차.md): Props/Emits, 컴포넌트 생명주기, Slot, REST API 분리
