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

* **`defineProps()` (부모 ➡️ 자식)**: 단방향 데이터 바인딩 원칙에 따라 부모가 자식에게 데이터를 주입. 자식은 주입받은 prop을 직접 수정할 수 없음.
* **`defineEmits()` (자식 ➡️ 부모)**: 자식 컴포넌트에서 이벤트 발생 시 부모 컴포넌트에 알림 및 인자를 전달하는 커스텀 이벤트 발행 매크로.
* 상위 컴포넌트에서 `provide(key, value)` 선언 시, 중간 컴포넌트들을 거치지 않고 하위 컴포넌트 어디서든 `inject(key)`로 데이터 수신

### 2) `Component Lifecycle` (컴포넌트 생명주기)

* **`onMounted()`**: DOM 트리가 생성되고 마운트된 직후 1회 실행. 비동기 API 호출, 타이머 등록, 외부 라이브러리 초기화에 사용.
* **`onUpdated()`**: 반응형 상태 변화로 인해 DOM 리렌더링이 완료된 직후 실행.
* **`onUnmounted()`**: 컴포넌트가 DOM에서 소멸(Destroy)되기 직전 실행. `setInterval`, `addEventListener` 등 메모리 누수 유발 요소를 클린업(Cleanup).

### 3) `Pinia` (전역 상태 관리 라이브러리)

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
  * `과제 2`: 2일차 Composition 날씨 대시보드
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
│   │   ├── travelweather/               # 메인 대시보드(HomeView) 전용 컴포넌트
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
* **여행 추천 점수 (`calculateTravelScore`)**: 최적 기온(22°C) 편차 감점 및 날씨 상태(맑음, 구름, 흐림, 비, 눈)별 가감점을 반영하여 0~100점 산출 및 4단계 등급(🏆 강력 추천, 👍 추천, ⚠️ 보통, 🌧️ 비추천) 뱃지 부여.
* **한글 국가명 매핑 & RestCountries 국기 연동**: 국가별 공식 국기 이미지 자동 매핑.

---

### ✨ 2) 신규 기능 및 리팩토링

#### ① 컴포넌트 분리 (`Props` / `Emits` 통신)

1. **`TravelSearchBar.vue`**:
   * 부모(`HomeView`)로부터 `searchQuery`, `statusOptions`, `selectedStatus`, `sortBy`, `isLoadingLocation`을 `props`로 주입받아 렌더링.
   * 사용자 입력, 필터, 정렬 변경, 랜덤 뽑기, 위치 요청 시 `update-query`, `update-status`, `update-sort`, `random-pick`, `my-location` 이벤트를 `emits`로 상위 전달.
2. **`TravelSummary.vue`**:
   * 부모의 계산된 `stats` 객체(`count`, `avgTemp`, `avgScore`)를 `props`로 단방향 전달받아 그리드 통계 렌더링.
3. **`TravelCard.vue`**:
   * 각 도시 객체(`city`)를 `props`로 받아 국기 이미지, 기온, 추천 점수를 출력하며, 클릭 시 `select`, `detail` 이벤트를 부모에 `emits`.

#### ② 외부 API 데이터 통신 모듈 분리 (`weatherService.js`)

* 뷰 컴포넌트(`HomeView.vue`) 내에 혼재되어 있던 API 엔드포인트 URL, 헤더 설정, WMO 코드 변환 로직 및 `getCurrentUserLocation()`(Geolocation Web API)을 `src/services/weatherService.js`로 분리.

#### ③ Open-Meteo 실시간 날씨 API 연동

* **실시간 날씨 연동**: `Open-Meteo` 공개 API를 통해 9개 도시의 위/경도 기준 실제 실시간 기온 및 WMO 기상 코드를 일괄 조회.
* **서비스 무중단 Fallback 구조**: 네트워크 장애나 API 오류 발생 시 `public/data/cities.json` 정적 데이터로 전환.
* **데이터 상태 뱃지**: 화면 상단에 `🟢 실시간 날씨 연동 (Open-Meteo)` 또는 `🟡 로컬 데이터 모드` 안내 칩 실시간 표기.

#### ④ 비동기 로딩 상태 관리 (`isLoading`)

* `onMounted` 시점에 날씨 데이터 및 국기 리소스를 병렬 로드하며, 로딩 중에는 스피너 애니메이션을 노출하여 부드러운 사용자 경험 제공.

#### ⑤ 다중 정렬(Sort) 파이프라인 (`sortBy`)

* `filteredCityList` computed 내에 검색어 필터링과 결합된 4단계 정렬 엔진 탑재:
  * 🏆 **추천 점수 높은 순 (`score-desc`)**: 최적 여행 적합도 내림차순
  * 🔥 **기온 높은 순 (`temp-desc`)**: 온도가 따뜻한 순서
  * ❄️ **기온 낮은 순 (`temp-asc`)**: 온도가 시원한 순서
  * 🔤 **도시명순 (`name-asc`)**: 한글 가나다 오름차순 (`localeCompare`)

#### ⑥ 실시간 동기화 시각 & 스피닝 아이콘 새로고침

* 메인 타이틀 영역(`hero-title-row`)에 최근 데이터 동기화 시각(`lastUpdated`)을 실시간 표기.
* 텍스트 없는 미니멀 아이콘 버튼(`🔄`) 적용 및 데이터 Fetching(`isLoading: true`) 중 `animation: spin` 무한 회전 효과 제공.

#### ⑦ 랜덤 여행지 뽑기 ("🎲 어디로 갈까?")

* 현재 검색 및 날씨 필터 조건에 부합하는 도시 목록 중 `Math.random()`으로 1개 도시를 무작위 선택하여 하단 상태바 및 포커스 동기화.

#### ⑧ 브라우저 Geolocation 기반 내 위치 날씨 탐색 ("📍 내 위치 날씨")

* HTML5 표준 `navigator.geolocation` API를 통해 현재 사용자 좌표(`lat`, `lon`) 획득.
* Open-Meteo 실시간 기상 API로 내 위치 기온/상태를 조회하여 도시 카드 목록 최상단에 추가 및 자동 선택.

#### ⑨ 여행지 상세 정보 모달 (`TravelDetailModal.vue`)

* 브라우저 기본 `window.alert()` 팝업을 전면 교체하여 Vue `<Teleport to="body">` 기반 인터랙티브 모달 컴포넌트로 구축.
* 기상 수치, 여행 쾌적 지수 프로그레스 바, 위/경도 좌표, 날씨 상태 및 기온별 옷차림/준비물 맞춤 가이드 동적 제공.
* 배경 클릭 시 닫기 및 키보드 `ESC` 키 이벤트 리스너 연동.

#### ⑩ 검색 UX 강화 & 빈 상태 (Empty State) 원클릭 복구

* `TravelSearchBar.vue` 입력창 내 텍스트 즉시 삭제 버튼(`✕`) 추가.
* 검색 결과가 존재하지 않을 때 Empty UI 출력 및 `필터 및 검색 초기화` 버튼을 통해 1클릭으로 기본 상태 복귀.
