# 🌤️ skala-vue: Day 2 학습 및 과제

---

## 🛠️ 프로젝트 실행 및 빌드

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (Hot-Reload)
npm run dev

# 프로덕션 빌드 (dist/ 생성)
npm run build
```

---

## 📝 1. Day 2 학습내용정리

### 1) `ref()`

* 기본형(Primitive) 및 객체 데이터를 반응형 상태로 선언.
* `<script setup>` 내에서는 `.value`로 접근/수정, `<template>`에서는 자동으로 unwrap되어 `.value` 생략.
* `reactive`도 있지만, `ref()`를 실무환경에서 더 많이 사용

### 2) `computed()` (계산된 속성)

* 반응형 상태를 기반으로 파생된 데이터를 계산하여 반환.
* **캐싱(Caching)** 지원: 종속된 반응형 상태가 변경되지 않으면, 이전 계산 결과 재사용.
* 연산, 목록 필터링(`filter`), 통계 계산 등에 사용.

### 3) `watch(source, callback)` (명시적 감시자)

* 특정 반응형 상태(ref, getter 함수 등)를 지정하여 값 변화를 감시.
* **이전 값(`oldValue`)과 현재 값(`newValue`)**을 모두 전달받아 비교 가능.

### 4) `watchEffect(callback)` (자동 의존성 감시자)

* 콜백 함수 내에서 참조되는 모든 반응형 상태를 **자동으로 감지 및 추적**.
* 컴포넌트 마운트 시 즉시 한 번 실행된 후, 내부 반응형 변수가 변경될 때마다 자동 재호출.

---

## 🗂️ 2. 실습 및 과제 프로젝트 구조

글로벌 내비게이션과 탭 레이아웃을 통해 실습 및 과제 결과를 확인할 수 있도록 구성했습니다.

### 🧭 라우팅 경로 (URL Guide)

* **`http://localhost:5173/` (홈)**: 전체 학습 목차 및 바로가기 대시보드
* **`http://localhost:5173/practice` (실습 코드)**:
  * `1일차 탭`: 반응형 데이터(`ref`), `v-html`, `v-text`, `v-bind`, `v-if`, `v-for` 기초 실습
  * `2일차 탭`: `v-pre`, `v-cloak`, `v-once`, `v-memo`, `v-on`(이벤트 수정자), `v-model`(폼 바인딩) 실습
* **`http://localhost:5173/assignment` (일일 과제)**:
  * `과제 1`: 1일차 Mockup 날씨 대시보드

---

### 📁 주요 파일 디렉토리 구조

```text
skala-vue/
├── src/
│   ├── components/
│   │   ├── exercise/
│   │   │   ├── WeatherMockup.vue        # 1일차 과제: 기본 템플릿 & 디렉티브 Mockup
│   │   │   ├── WeatherComposition.vue   # 2일차 과제: ref, computed, watch, watchEffect 적용
│   │   │   └── ...
│   │   └── practices/basic/             # 일자별 기초 실습 단위 컴포넌트 모음
│   │
│   ├── views/
│   │   ├── HomeView.vue                 # 랜딩/홈 뷰
│   │   ├── practice/
│   │   │   ├── PracticeLayout.vue       # 실습 공통 레이아웃 (일차별 탭)
│   │   │   ├── Day1PracticeView.vue     # 1일차 실습 모음
│   │   │   └── Day2PracticeView.vue     # 2일차 실습 모음
│   │   └── assignment/
│   │       ├── AssignmentLayout.vue     # 과제 공통 레이아웃
│   │       └── Day1AssignmentView.vue   # 일일 과제 확인 뷰 (WeatherComposition 등 렌더링)
│   │
│   ├── router/
│   │   └── index.js                     # 라우팅 설정
│   └── App.vue                          # 최상단 글로벌 헤더 & RouterView
```

---

## 🎯 3. 2일차 과제 (`WeatherComposition.vue`) 주요 구현 내용

1. **반응형 상태 관리 (`ref`)**:
   * `weatherList`: 지역별 날씨 데이터 원본 배열
   * `searchQuery`: 도시 검색어
   * `selectedCityInfo`: 카드 클릭 시 상태바 안내 문구
   * `selectedStatus`: **(나만의 상태)** 선택된 날씨 카테고리 필터
2. **속성 (`computed`)**:
   * `statusOptions`: **(나만의 Computed)** 고유한 날씨 상태 목록 동적 추출
   * `filteredWeatherList`: 검색어(`searchQuery`)와 날씨 필터(`selectedStatus`)를 동시 적용한 실시간 필터링
   * `averageTemp`: **(나만의 Computed)** 현재 화면에 표시된 도시들의 평균 기온 실시간 연산
3. **감시자 (`watch` / `watchEffect`)**:
   * `watch(selectedCityInfo)`: 상태바 문구 업데이트 전/후 값 콘솔 로깅
   * `watchEffect()`: `searchQuery` 변경 시 자동 감지하여 필터링 수행 로그 출력
   * `watch(selectedStatus)`: **(나만의 Watcher)** 날씨 필터 변경 감시 로그
4. **템플릿 분기 및 뱃지**:
   * 4단계 기온 뱃지 (`27도 이상 더움` / `23도 이상 따뜻함` / `19도 이상 선선함` / `그 외 추움`)
   * `@click.stop` 이벤트 버블링 방지 상세보기 알림창
   * 필터 결과 0건 시 예외 안내 문구 노출
