<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import TravelCard from '@/components/travelweather/TravelCard.vue'
import TravelSearchBar from '@/components/travelweather/TravelSearchBar.vue'
import TravelSummary from '@/components/travelweather/TravelSummary.vue'

// 9개 세계 주요 도시 정적 데이터
const cityWeatherList = ref([
  { id: 'city_01', name: '서울', country: '대한민국', temp: 23, status: '맑음' },
  { id: 'city_02', name: '도쿄', country: '일본', temp: 21, status: '맑음' },
  { id: 'city_03', name: '파리', country: '프랑스', temp: 20, status: '구름' },
  { id: 'city_04', name: '런던', country: '영국', temp: 15, status: '비' },
  { id: 'city_05', name: '뉴욕', country: '미국', temp: 25, status: '맑음' },
  { id: 'city_06', name: '방콕', country: '태국', temp: 34, status: '비' },
  { id: 'city_07', name: '시드니', country: '호주', temp: 18, status: '맑음' },
  { id: 'city_08', name: '카이로', country: '이집트', temp: 36, status: '맑음' },
  { id: 'city_09', name: '로마', country: '이탈리아', temp: 26, status: '맑음' },
])

// 검색어 및 필터 상태
const searchQuery = ref('')
const selectedStatus = ref('전체')
const selectedCityInfo = ref('도시 카드를 클릭하면 상세 여행 팁을 확인합니다.')

// RestCountries API 연동 및 국기 이미지 매핑
const RESTCOUNTRIES_API_KEY =
  import.meta.env.RESTCOUNTRIES_API || import.meta.env.VITE_RESTCOUNTRIES_API

// 한글 국가명과 RestCountries 영문 국가명 및 기본 국기 코드 매핑
const countryMapping = {
  대한민국: { en: 'South Korea', code: 'kr' },
  일본: { en: 'Japan', code: 'jp' },
  프랑스: { en: 'France', code: 'fr' },
  영국: { en: 'United Kingdom', code: 'gb' },
  미국: { en: 'United States', code: 'us' },
  태국: { en: 'Thailand', code: 'th' },
  호주: { en: 'Australia', code: 'au' },
  이집트: { en: 'Egypt', code: 'eg' },
  이탈리아: { en: 'Italy', code: 'it' },
}

// 국가별 국기 URL 상태 (초기 기본값 제공)
const countryFlags = ref({
  대한민국: 'https://flags.restcountries.com/v5/w640/kr.png',
  일본: 'https://flags.restcountries.com/v5/w640/jp.png',
  프랑스: 'https://flags.restcountries.com/v5/w640/fr.png',
  영국: 'https://flags.restcountries.com/v5/w640/gb.png',
  미국: 'https://flags.restcountries.com/v5/w640/us.png',
  태국: 'https://flags.restcountries.com/v5/w640/th.png',
  호주: 'https://flags.restcountries.com/v5/w640/au.png',
  이집트: 'https://flags.restcountries.com/v5/w640/eg.png',
  이탈리아: 'https://flags.restcountries.com/v5/w640/it.png',
})

// RestCountries API 호출 (Vite 프록시 우선 시도 및 폴백 지원)
const fetchCountryFlags = async () => {
  try {
    // 1. Vite 개발 프록시 경로 우선 시도 (Origin 헤더에 의한 403 Forbidden 우회)
    let url = '/api/restcountries/countries/v5?response_fields=names.common,flag.url_png&limit=100'
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${RESTCOUNTRIES_API_KEY}`,
      },
    })

    // 2. 프록시 응답 실패 시 (배포 환경 등) 직접 엔드포인트 시도
    if (!response.ok) {
      url = 'https://api.restcountries.com/countries/v5?response_fields=names.common,flag.url_png&limit=100'
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${RESTCOUNTRIES_API_KEY}`,
        },
      })
    }

    if (!response.ok) {
      throw new Error(`국기 API 응답 실패 (상태 코드: ${response.status})`)
    }

    const json = await response.json()
    const countryObjects = json?.data?.objects || []

    // 수신된 API 데이터 매핑
    const apiFlagDict = {}
    countryObjects.forEach((item) => {
      if (item?.names?.common && item?.flag?.url_png) {
        apiFlagDict[item.names.common.toLowerCase()] = item.flag.url_png
      }
    })

    // 등록된 도시에 국기 이미지 반영
    Object.entries(countryMapping).forEach(([krName, meta]) => {
      const matchedFlag = apiFlagDict[meta.en.toLowerCase()]
      if (matchedFlag) {
        countryFlags.value[krName] = matchedFlag
      }
    })
    console.log('✅ RestCountries 국기 API 연동 성공')
  } catch (error) {
    console.warn('⚠️ 국기 API 호출 중 오류 발생, 기본 국기 리소스를 유지합니다:', error)
  }
}

onMounted(() => {
  fetchCountryFlags()
})

// 정적 휴리스틱 점수 계산식 (최적기온 22°C 기준 편차 및 기상 상태 가감점)
const calculateTravelScore = (temp, status) => {
  let score = 100

  // 1. 기온 편차 감점 (최적 22°C에서 1°C 차이당 2.5점 감점)
  const tempDiff = Math.abs(temp - 22)
  score -= Math.round(tempDiff * 2.5)

  // 2. 날씨 상태별 가감점
  const statusPenalties = {
    맑음: 0,
    구름: -5,
    흐림: -15,
    비: -25,
    눈: -20,
  }
  score += statusPenalties[status] ?? -10

  // 0~100점 범위 제한
  return Math.max(0, Math.min(100, score))
}

const getScoreBadge = (score) => {
  if (score >= 85) return { grade: '강력 추천', class: 'score-top', emoji: '🏆' }
  if (score >= 70) return { grade: '추천', class: 'score-good', emoji: '👍' }
  if (score >= 50) return { grade: '보통', class: 'score-normal', emoji: '⚠️' }
  return { grade: '비추천', class: 'score-bad', emoji: '🌧️' }
}

// 고유 날씨 필터 옵션
const statusOptions = computed(() => {
  const statuses = cityWeatherList.value.map((item) => item.status)
  return ['전체', ...new Set(statuses)]
})

// 가공된 도시 목록 (여행 점수 및 국기 URL 포함)
const enrichedCityList = computed(() => {
  return cityWeatherList.value.map((city) => {
    const score = calculateTravelScore(city.temp, city.status)
    const flagUrl =
      countryFlags.value[city.country] ||
      `https://flags.restcountries.com/v5/w640/${countryMapping[city.country]?.code || 'kr'}.png`

    return {
      ...city,
      score,
      badge: getScoreBadge(score),
      flagUrl,
    }
  })
})

// 검색어 및 날씨 필터 적용 목록
const filteredCityList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return enrichedCityList.value.filter((city) => {
    const matchesQuery =
      !query ||
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query)
    const matchesStatus = selectedStatus.value === '전체' || city.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
})

// 통계 데이터
const stats = computed(() => {
  const list = filteredCityList.value
  if (list.length === 0) return { count: 0, avgTemp: 0, avgScore: 0 }

  const totalTemp = list.reduce((acc, cur) => acc + cur.temp, 0)
  const totalScore = list.reduce((acc, cur) => acc + cur.score, 0)

  return {
    count: list.length,
    avgTemp: (totalTemp / list.length).toFixed(1),
    avgScore: Math.round(totalScore / list.length),
  }
})

// 감시자
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[안내 변경] "${oldVal}" ➡️ "${newVal}"`)
})

watchEffect(() => {
  console.log(
    `[검색/필터] '${searchQuery.value}' | '${selectedStatus.value}' (결과: ${filteredCityList.value.length}개)`,
  )
})

const handleSelectCity = (city) => {
  selectedCityInfo.value = `${city.name}(${city.country}) 선택됨 - 추천 점수 ${city.score}점`
}

const showDetail = (city) => {
  window.alert(
    `[${city.name}, ${city.country}]\n` +
      `현재 날씨: ${city.status} (${city.temp}°C)\n` +
      `여행 추천 점수: ${city.score}점 (${city.badge.grade})`,
  )
}
</script>

<template>
  <div class="travel-dashboard">
    <header class="hero-section">
      <h2>🌍 세계 주요 도시 날씨 & 여행지 추천</h2>
      <p class="desc">실시간 날씨 기반 여행지 점수 및 국가별 기상 가이드</p>
    </header>

    <!-- 검색 및 필터 (TravelSearchBar 컴포넌트) -->
    <TravelSearchBar
      :search-query="searchQuery"
      :status-options="statusOptions"
      :selected-status="selectedStatus"
      @update-query="(val) => (searchQuery = val)"
      @update-status="(val) => (selectedStatus = val)"
    />

    <!-- 통계 요약 (TravelSummary 컴포넌트) -->
    <TravelSummary :stats="stats" />

    <!-- 여행지 도시 카드 리스트 (TravelCard 컴포넌트 분리) -->
    <section class="city-grid">
      <TravelCard
        v-for="city in filteredCityList"
        :key="city.id"
        :city="city"
        @select="handleSelectCity"
        @detail="showDetail"
      />

      <p v-if="filteredCityList.length === 0" class="empty-state">
        검색 결과와 일치하는 여행지가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.travel-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 0.5rem;
}

.hero-section h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.3rem;
}

.hero-section .desc {
  color: var(--color-text);
  font-size: 0.95rem;
  opacity: 0.8;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.1rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  font-weight: 600;
}

.status-bar {
  padding: 0.6rem 1rem;
  background: var(--color-background-mute, #eee);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text);
  text-align: center;
}
</style>
