<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const techStack = [
  { name: 'Vue 3', desc: 'Composition API (<script setup>) 기반 반응형 웹 구현', tag: 'Core' },
  { name: 'Pinia', desc: '온도 단위(℃/℉) 및 전역 상태 중앙 집중 관리', tag: 'State' },
  { name: 'Vue Router 4', desc: 'SPA 클라이언트 사이드 라우팅 및 쿼리 파라미터 동기화', tag: 'Routing' },
  { name: 'Axios & Open-Meteo', desc: '비동기 기상 데이터 통신 & RestCountries 국기 API 연동', tag: 'API' },
  { name: 'Vite & Element Plus', desc: '초고속 번들링 & 모던 UI 컴포넌트 라이브러리', tag: 'Tooling' },
]

const coreFeatures = [
  {
    icon: '🗺️',
    title: '풀스크린 GIS 인터랙티브 레이더',
    desc: 'Windy Radar API 기반 실시간 전 세계 바람, 강수, 구름 레이더 캔버스 시각화',
  },
  {
    icon: '📊',
    title: '스마트 여행 추천 점수 산출',
    desc: '기온·풍속·습도·강수 확률을 종합 연산하여 0~100점 쾌적 지수 및 맞춤 복장 가이드 제공',
  },
  {
    icon: '📅',
    title: '7일간(일주일) 상세 기상 예보',
    desc: '도시별 24시간 시간별 기온 추이 및 7일간 일별 최고/최저 기온 심층 데이터 조회',
  },
  {
    icon: '🛡️',
    title: 'API 장애 대응 Fallback 시스템',
    desc: '외부 API 제한/오류 시 cities.json 로컬 데이터 자동 전환 & 사용자 커스텀 API Key 설정 지원',
  },
]

const projectStructure = [
  { path: 'src/views/', desc: 'HomeView(메인 포털), assignment/(과제 모음), practice/(일일 실습)' },
  { path: 'src/components/weather/', desc: 'WeatherLiveCard, WeatherDetailModal, WeatherStatsSummary, WindySettingsModal' },
  { path: 'src/stores/configStore.js', desc: 'Pinia 전역 스토어 (단위 변환, 전역 설정 관리)' },
  { path: 'src/services/weatherService.js', desc: 'Open-Meteo & RestCountries API 비동기 통신 및 Fallback 처리' },
  { path: 'public/data/cities.json', desc: '전 세계 18개 주요 도시 위/경도 및 기준 기상 데이터셋' },
]
</script>

<template>
  <div class="about-container">
    <div class="about-header">
      <span class="badge">Architecture & Service Info</span>
      <h2>🌤️ Skala Weather & GIS Portal</h2>
      <p class="subtitle">
        Vue 3 생태계(Composition API, Pinia, Vue Router)를 기반으로 구축된 글로벌 실시간 기상 관측 및 스마트 여행 추천 플랫폼입니다.
      </p>
    </div>

    <!-- 1. 핵심 서비스 기능 -->
    <section class="info-section">
      <h3 class="section-title">✨ 주요 서비스 및 핵심 기능</h3>
      <div class="feature-grid">
        <div v-for="item in coreFeatures" :key="item.title" class="feature-card">
          <div class="feature-icon">{{ item.icon }}</div>
          <div class="feature-content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 프로젝트 아키텍처 및 파일 구조 -->
    <section class="info-section">
      <h3 class="section-title">🗂️ 프로젝트 아키텍처 & 디렉터리 구조</h3>
      <div class="structure-card">
        <ul class="structure-list">
          <li v-for="item in projectStructure" :key="item.path" class="structure-item">
            <code class="path-badge">{{ item.path }}</code>
            <span class="path-desc">{{ item.desc }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 3. 기술 스택 -->
    <section class="info-section">
      <h3 class="section-title">🛠️ 핵심 기술 스택</h3>
      <div class="tech-grid">
        <div v-for="tech in techStack" :key="tech.name" class="tech-card">
          <div class="tech-top">
            <strong class="tech-name">{{ tech.name }}</strong>
            <span class="tech-tag">{{ tech.tag }}</span>
          </div>
          <p class="tech-desc">{{ tech.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 액션 버튼 -->
    <div class="action-buttons">
      <button @click="router.push('/assignment/weather')" class="btn primary-btn">
        🌦️ 날씨 대시보드로 이동
      </button>
      <button @click="router.push('/')" class="btn secondary-btn">
        🌍 풀스크린 GIS 포털 홈으로 이동
      </button>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.about-header {
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #edf2f7;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.about-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.info-section {
  margin-bottom: 1.75rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  margin: 0 0 0.85rem 0;
}

/* 기능 그리드 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 0.85rem;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.feature-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.feature-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.feature-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

/* 프로젝트 구조 */
.structure-card {
  background: #0f172a;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  color: #f8fafc;
}

.structure-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.structure-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.path-badge {
  background: #1e293b;
  color: #38bdf8;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.82rem;
  border: 1px solid #334155;
}

.path-desc {
  color: #cbd5e1;
}

/* 기술 스택 그리드 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.tech-card {
  padding: 0.85rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.tech-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.tech-name {
  font-size: 0.9rem;
  color: #0f172a;
}

.tech-tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 5px;
  border-radius: 3px;
}

.tech-desc {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.35;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #edf2f7;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s ease;
}

.btn:hover {
  opacity: 0.9;
}

.primary-btn {
  background: #059669;
  color: #ffffff;
}

.secondary-btn {
  background: #334155;
  color: #ffffff;
}

@media (max-width: 640px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .action-buttons {
    flex-direction: column;
  }
}
</style>
