/**
 * 날씨 데이터 및 Windy API 연동 서비스 모듈
 */

// 대한민국 주요 도시 기본 목록 (기존 호환용)
export const DEFAULT_CITIES = [
  {
    id: 'seoul',
    name: '서울',
    engName: 'Seoul',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.5665,
    lon: 126.978,
    tag: '남산타워 & 한강',
  },
  {
    id: 'suwon',
    name: '수원',
    engName: 'Suwon',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.2636,
    lon: 127.0286,
    tag: '화성행궁',
  },
  {
    id: 'incheon',
    name: '인천',
    engName: 'Incheon',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.4563,
    lon: 126.7052,
    tag: '송도 센트럴파크',
  },
  {
    id: 'busan',
    name: '부산',
    engName: 'Busan',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.1796,
    lon: 129.0756,
    tag: '해운대 & 광안리',
  },
  {
    id: 'daegu',
    name: '대구',
    engName: 'Daegu',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.8714,
    lon: 128.6014,
    tag: '동성로 & 앞산',
  },
  {
    id: 'daejeon',
    name: '대전',
    engName: 'Daejeon',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 36.3504,
    lon: 127.3845,
    tag: '엑스포 과학공원',
  },
  {
    id: 'gwangju',
    name: '광주',
    engName: 'Gwangju',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.1595,
    lon: 126.8526,
    tag: '무등산 국립공원',
  },
  {
    id: 'ulsan',
    name: '울산',
    engName: 'Ulsan',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.5384,
    lon: 129.3114,
    tag: '대왕암 공원',
  },
  {
    id: 'jeju',
    name: '제주',
    engName: 'Jeju',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 33.4996,
    lon: 126.5312,
    tag: '에메랄드 바다',
  },
  {
    id: 'gangneung',
    name: '강릉',
    engName: 'Gangneung',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.7519,
    lon: 128.8761,
    tag: '안목해변 커피거리',
  },
  {
    id: 'chuncheon',
    name: '춘천',
    engName: 'Chuncheon',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.8854,
    lon: 127.7298,
    tag: '소양강 스카이워크',
  },
  {
    id: 'jeonju',
    name: '전주',
    engName: 'Jeonju',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.8242,
    lon: 127.148,
    tag: '한옥마을',
  },
  {
    id: 'pohang',
    name: '포항',
    engName: 'Pohang',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 36.019,
    lon: 129.3435,
    tag: '호미곶 일출',
  },
  {
    id: 'changwon',
    name: '창원',
    engName: 'Changwon',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 35.228,
    lon: 128.6811,
    tag: '진해 군항제',
  },
  {
    id: 'pyeongchang',
    name: '평창',
    engName: 'Pyeongchang',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.3705,
    lon: 128.3902,
    tag: '대관령 양떼목장',
  },
]

// 전 세계 주요 여행지 데이터셋
export const WORLD_DESTINATIONS = [
  // 아시아
  {
    id: 'seoul',
    name: '서울',
    engName: 'Seoul',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 37.5665,
    lon: 126.978,
    tag: '남산타워 & 한강',
  },
  {
    id: 'jeju',
    name: '제주',
    engName: 'Jeju',
    country: '대한민국 🇰🇷',
    continent: '아시아',
    lat: 33.4996,
    lon: 126.5312,
    tag: '에메랄드 바다 & 한라산',
  },
  {
    id: 'tokyo',
    name: '도쿄',
    engName: 'Tokyo',
    country: '일본 🇯🇵',
    continent: '아시아',
    lat: 35.6762,
    lon: 139.6503,
    tag: '신주쿠 & 시부야',
  },
  {
    id: 'osaka',
    name: '오사카',
    engName: 'Osaka',
    country: '일본 🇯🇵',
    continent: '아시아',
    lat: 34.6937,
    lon: 135.5023,
    tag: '도톤보리 & 미식 탐방',
  },
  {
    id: 'danang',
    name: '다낭',
    engName: 'Danang',
    country: '베트남 🇻🇳',
    continent: '아시아',
    lat: 16.0544,
    lon: 108.2022,
    tag: '미케비치 & 바나힐',
  },
  {
    id: 'bangkok',
    name: '방콕',
    engName: 'Bangkok',
    country: '태국 🇹🇭',
    continent: '아시아',
    lat: 13.7563,
    lon: 100.5018,
    tag: '카오산로드 & 야시장',
  },
  {
    id: 'bali',
    name: '발리',
    engName: 'Bali',
    country: '인도네시아 🇮🇩',
    continent: '아시아',
    lat: -8.4095,
    lon: 115.1889,
    tag: '서핑 & 우붓 힐링',
  },
  {
    id: 'singapore',
    name: '싱가포르',
    engName: 'Singapore',
    country: '싱가포르 🇸🇬',
    continent: '아시아',
    lat: 1.3521,
    lon: 103.8198,
    tag: '마리나베이 & 가든스',
  },
  {
    id: 'taipei',
    name: '타이베이',
    engName: 'Taipei',
    country: '대만 🇹🇼',
    continent: '아시아',
    lat: 25.033,
    lon: 121.5654,
    tag: '야시장 & 지우펀',
  },

  // 유럽
  {
    id: 'paris',
    name: '파리',
    engName: 'Paris',
    country: '프랑스 🇫🇷',
    continent: '유럽',
    lat: 48.8566,
    lon: 2.3522,
    tag: '에펠탑 & 루브르 박물관',
  },
  {
    id: 'london',
    name: '런던',
    engName: 'London',
    country: '영국 🇬🇧',
    continent: '유럽',
    lat: 51.5074,
    lon: -0.1278,
    tag: '빅벤 & 타워브릿지',
  },
  {
    id: 'rome',
    name: '로마',
    engName: 'Rome',
    country: '이탈리아 🇮🇹',
    continent: '유럽',
    lat: 41.9028,
    lon: 12.4964,
    tag: '콜로세움 & 바티칸',
  },
  {
    id: 'barcelona',
    name: '바르셀로나',
    engName: 'Barcelona',
    country: '스페인 🇪🇸',
    continent: '유럽',
    lat: 41.3879,
    lon: 2.1699,
    tag: '사그라다 파밀리아',
  },
  {
    id: 'interlaken',
    name: '인터라켄',
    engName: 'Interlaken',
    country: '스위스 🇨🇭',
    continent: '유럽',
    lat: 46.6863,
    lon: 7.8632,
    tag: '융프라우 & 알프스 설경',
  },
  {
    id: 'prague',
    name: '프라하',
    engName: 'Prague',
    country: '체코 🇨🇿',
    continent: '유럽',
    lat: 50.0755,
    lon: 14.4378,
    tag: '카를교 & 구시가지',
  },
  {
    id: 'reykjavik',
    name: '레이캬비크',
    engName: 'Reykjavik',
    country: '아이슬란드 🇮🇸',
    continent: '유럽',
    lat: 64.1466,
    lon: -21.9426,
    tag: '오로라 & 온천',
  },

  // 아메리카
  {
    id: 'newyork',
    name: '뉴욕',
    engName: 'New York',
    country: '미국 🇺🇸',
    continent: '아메리카',
    lat: 40.7128,
    lon: -74.006,
    tag: '타임스퀘어 & 센트럴파크',
  },
  {
    id: 'losangeles',
    name: '로스앤젤레스',
    engName: 'Los Angeles',
    country: '미국 🇺🇸',
    continent: '아메리카',
    lat: 34.0522,
    lon: -118.2437,
    tag: '할리우드 & 산타모니카',
  },
  {
    id: 'honolulu',
    name: '하와이(호놀룰루)',
    engName: 'Honolulu',
    country: '미국 🇺🇸',
    continent: '아메리카',
    lat: 21.3069,
    lon: -157.8583,
    tag: '와이키키 비치 & 휴양',
  },
  {
    id: 'vancouver',
    name: '밴쿠버',
    engName: 'Vancouver',
    country: '캐나다 🇨🇦',
    continent: '아메리카',
    lat: 49.2827,
    lon: -123.1207,
    tag: '스탠리파크 & 항구',
  },
  {
    id: 'cancun',
    name: '칸쿤',
    engName: 'Cancun',
    country: '멕시코 🇲🇽',
    continent: '아메리카',
    lat: 21.1619,
    lon: -86.8515,
    tag: '카리브해 올인클루시브',
  },

  // 오세아니아
  {
    id: 'sydney',
    name: '시드니',
    engName: 'Sydney',
    country: '호주 🇦🇺',
    continent: '오세아니아',
    lat: -33.8688,
    lon: 151.2093,
    tag: '오페라하우스 & 비치',
  },
  {
    id: 'melbourne',
    name: '멜버른',
    engName: 'Melbourne',
    country: '호주 🇦🇺',
    continent: '오세아니아',
    lat: -37.8136,
    lon: 144.9631,
    tag: '그레이트오션로드',
  },
  {
    id: 'auckland',
    name: '오클랜드',
    engName: 'Auckland',
    country: '뉴질랜드 🇳🇿',
    continent: '오세아니아',
    lat: -36.8485,
    lon: 174.7633,
    tag: '와이헤케 아일랜드',
  },
  {
    id: 'guam',
    name: '괌',
    engName: 'Guam',
    country: '미국령 🇬🇺',
    continent: '오세아니아',
    lat: 13.4443,
    lon: 144.7937,
    tag: '투몬비치 & 쇼핑 천국',
  },
]

/**
 * WMO Weather Code를 한글 상태명, 아이콘 및 카테고리로 변환
 */
export function parseWeatherCode(code) {
  switch (code) {
    case 0:
      return { status: '맑음', icon: '☀️', category: '맑음', description: '화창한 맑은 날씨' }
    case 1:
      return {
        status: '대체로 맑음',
        icon: '🌤️',
        category: '맑음',
        description: '구름 조금 있는 맑은 날씨',
      }
    case 2:
      return {
        status: '구름 조금',
        icon: '⛅',
        category: '구름',
        description: '구름이 조금 낀 날씨',
      }
    case 3:
      return { status: '흐림', icon: '☁️', category: '흐림', description: '구름이 많은 흐린 날씨' }
    case 45:
    case 48:
      return { status: '안개', icon: '🌫️', category: '안개', description: '시야가 제한되는 안개' }
    case 51:
    case 53:
    case 55:
      return { status: '이슬비', icon: '🌦️', category: '비', description: '약한 이슬비' }
    case 61:
    case 63:
    case 65:
      return { status: '비', icon: '🌧️', category: '비', description: '비 내리는 날씨' }
    case 66:
    case 67:
      return { status: '진눈깨비', icon: '🌨️', category: '눈', description: '눈과 비가 섞여 내림' }
    case 71:
    case 73:
    case 75:
    case 77:
      return { status: '눈', icon: '❄️', category: '눈', description: '하얀 눈이 내리는 날씨' }
    case 80:
    case 81:
    case 82:
      return { status: '소나기', icon: '🌧️', category: '비', description: '갑작스러운 소나기' }
    case 85:
    case 86:
      return { status: '소나기눈', icon: '🌨️', category: '눈', description: '강한 눈발' }
    case 95:
    case 96:
    case 99:
      return {
        status: '뇌우',
        icon: '⛈️',
        category: '뇌우',
        description: '천둥 번개를 동반한 폭풍우',
      }
    default:
      return { status: '구름', icon: '⛅', category: '구름', description: '구름 낀 날씨' }
  }
}

/**
 * 기온에 따른 라벨링 (더움 / 따뜻함 / 선선함 / 추움) 계산
 */
export function getTemperatureLabel(tempCelsius) {
  if (tempCelsius >= 27) {
    return {
      label: '🔥 더움 (27도 이상)',
      shortLabel: '🔥 더움',
      badgeClass: 'hot',
      level: 'hot',
    }
  } else if (tempCelsius >= 23) {
    return {
      label: '☀️ 따뜻함 (23~26도)',
      shortLabel: '☀️ 따뜻함',
      badgeClass: 'warm',
      level: 'warm',
    }
  } else if (tempCelsius >= 19) {
    return {
      label: '🌤️ 선선함 (19~22도)',
      shortLabel: '🌤️ 선선함',
      badgeClass: 'cool',
      level: 'cool',
    }
  } else {
    return {
      label: '🥶 추움 (19도 미만)',
      shortLabel: '🥶 추움',
      badgeClass: 'cold',
      level: 'cold',
    }
  }
}

/**
 * 여행 쾌적 지수(0~100점), 등급 및 여행 가이드 코멘트 계산
 */
export function calculateTravelScore({
  temp = 20,
  weatherCode = 0,
  humidity = 50,
  windSpeed = 10,
  precipitation = 0,
}) {
  let score = 95

  // 1. 기온 적정성 (20~25도가 최적)
  if (temp >= 20 && temp <= 25) {
    // 쾌적 온도
  } else if ((temp >= 16 && temp < 20) || (temp > 25 && temp <= 28)) {
    score -= 5
  } else if ((temp >= 10 && temp < 16) || (temp > 28 && temp <= 32)) {
    score -= 15
  } else if ((temp >= 0 && temp < 10) || (temp > 32 && temp <= 36)) {
    score -= 25
  } else {
    score -= 40
  }

  // 2. 날씨 상태 코드
  if ([0, 1].includes(weatherCode)) {
    score += 3 // 맑음 보너스
  } else if ([2, 3].includes(weatherCode)) {
    score -= 5 // 구름/흐림
  } else if ([45, 48].includes(weatherCode)) {
    score -= 15 // 안개
  } else if ([51, 53, 55].includes(weatherCode)) {
    score -= 20 // 이슬비
  } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    score -= 30 // 비, 소나기
  } else if ([71, 73, 75, 77, 85, 86, 66, 67].includes(weatherCode)) {
    score -= 25 // 눈, 진눈깨비
  } else if ([95, 96, 99].includes(weatherCode)) {
    score -= 45 // 뇌우
  }

  // 3. 강수량 감점
  if (precipitation > 10) {
    score -= 20
  } else if (precipitation > 1) {
    score -= 10
  }

  // 4. 습도 감점
  if (humidity > 80 || humidity < 25) {
    score -= 10
  } else if (humidity > 70) {
    score -= 5
  }

  // 5. 풍속 감점 (km/h)
  if (windSpeed > 35) {
    score -= 20
  } else if (windSpeed > 20) {
    score -= 8
  }

  // 점수 범위 15 ~ 99점으로 보정
  score = Math.max(15, Math.min(99, Math.round(score)))

  let travelGrade
  let travelScoreClass
  let travelVerdict
  let travelAdvice

  if (score >= 88) {
    travelGrade = '여행 최적'
    travelScoreClass = 'score-best'
    travelVerdict = '최상의 날씨 컨디션! 야외 투어와 사진 촬영에 완벽합니다.'
    travelAdvice = '화창한 날씨를 만끽하며 야외 명소를 중심으로 일정을 계획해 보세요.'
  } else if (score >= 72) {
    travelGrade = '여행하기 좋음'
    travelScoreClass = 'score-good'
    travelVerdict = '쾌적한 기상 상태로 여행 일정을 소화하기에 좋습니다.'
    travelAdvice = '자외선 및 기온 변화에 맞춘 가벼운 겉옷을 준비하세요.'
  } else if (score >= 50) {
    travelGrade = '보통 / 무난'
    travelScoreClass = 'score-fair'
    travelVerdict = '날씨 변덕이나 기온 차이에 유의가 필요한 날씨입니다.'
    travelAdvice = '실내와 실외 일정을 유연하게 섞어서 배치하는 것을 추천합니다.'
  } else {
    travelGrade = '주의 필요'
    travelScoreClass = 'score-poor'
    travelVerdict = '비바람이나 악천후로 야외 활동 시 불편할 수 있습니다.'
    travelAdvice = '실내 미술관, 박물관, 쇼핑몰 위주의 안락한 일정을 추천합니다.'
  }

  return {
    travelScore: score,
    travelGrade,
    travelScoreClass,
    travelVerdict,
    travelAdvice,
  }
}

/**
 * 기온 및 날씨 기반 추천 옷차림 및 필수 준비물 생성
 */
export function getOutfitAndItems({
  temp = 20,
  weatherCode = 0,
  precipitation = 0,
  windSpeed = 10,
}) {
  let outfitText
  const essentialItems = ['보조배터리', '상비약']

  if (temp >= 28) {
    outfitText = '민소매, 반팔 티셔츠, 린넨 셔츠, 숏팬츠, 통풍이 잘 되는 옷'
    essentialItems.unshift('선글라스', '자외선차단제', '휴대용 선풍기')
  } else if (temp >= 23) {
    outfitText = '반팔 티셔츠, 얇은 셔츠, 반바지 또는 얇은 면바지'
    essentialItems.unshift('선글라스', '자외선차단제')
  } else if (temp >= 19) {
    outfitText = '긴팔 티셔츠, 얇은 가디건, 슬랙스, 청바지'
    essentialItems.unshift('가벼운 겉옷', '선글라스')
  } else if (temp >= 14) {
    outfitText = '자켓, 가디건, 니트, 맨투맨, 청바지'
    essentialItems.unshift('바람막이 / 가디건')
  } else if (temp >= 9) {
    outfitText = '트렌치코트, 야상, 간절기 점퍼, 도톰한 니트'
    essentialItems.unshift('머플러', '도톰한 외투')
  } else if (temp >= 4) {
    outfitText = '겨울 코트, 가죽 자켓, 히트텍, 기모 바지'
    essentialItems.unshift('핫팩', '목도리')
  } else {
    outfitText = '롱패딩, 두꺼운 다운점퍼, 기모 내의, 방한 부츠'
    essentialItems.unshift('핫팩', '목도리/장갑', '방한모자')
  }

  // 비/눈 관련 준비물
  const isRain =
    [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode) || precipitation > 0
  const isSnow = [71, 73, 75, 77, 85, 86, 66, 67].includes(weatherCode)

  if (isRain) {
    essentialItems.unshift('접이식 우산', '방수 파우치')
  } else if (isSnow) {
    essentialItems.unshift('접이식 우산', '방한 방수화')
  }

  if (windSpeed >= 25) {
    essentialItems.push('바람막이 외투')
  }

  const uniqueItems = [...new Set(essentialItems)].slice(0, 5)

  return {
    outfitText,
    essentialItems: uniqueItems,
  }
}

/**
 * 실시간 전체 도시 날씨 데이터 조회 (Open-Meteo 멀티 쿼리)
 */
/**
 * 도시별 기본/모의 기상 데이터를 생성하는 안전 Fallback 생성기
 */
export function generateFallbackWeatherData(cities = WORLD_DESTINATIONS) {
  const fallbackPresets = {
    seoul: { temp: 22, apparentTemp: 22, humidity: 55, windSpeed: 10, weatherCode: 0 },
    suwon: { temp: 21, apparentTemp: 21, humidity: 58, windSpeed: 11, weatherCode: 0 },
    incheon: { temp: 20, apparentTemp: 19, humidity: 65, windSpeed: 16, weatherCode: 1 },
    busan: { temp: 24, apparentTemp: 24, humidity: 60, windSpeed: 15, weatherCode: 1 },
    daegu: { temp: 26, apparentTemp: 26, humidity: 45, windSpeed: 9, weatherCode: 0 },
    daejeon: { temp: 22, apparentTemp: 22, humidity: 52, windSpeed: 10, weatherCode: 0 },
    gwangju: { temp: 23, apparentTemp: 23, humidity: 56, windSpeed: 11, weatherCode: 0 },
    ulsan: { temp: 23, apparentTemp: 23, humidity: 55, windSpeed: 14, weatherCode: 1 },
    jeju: { temp: 25, apparentTemp: 26, humidity: 68, windSpeed: 18, weatherCode: 2 },
    gangneung: { temp: 21, apparentTemp: 20, humidity: 50, windSpeed: 13, weatherCode: 0 },
    tokyo: { temp: 20, apparentTemp: 20, humidity: 60, windSpeed: 12, weatherCode: 1 },
    osaka: { temp: 22, apparentTemp: 22, humidity: 55, windSpeed: 11, weatherCode: 0 },
    fukuoka: { temp: 23, apparentTemp: 23, humidity: 58, windSpeed: 13, weatherCode: 0 },
    paris: { temp: 18, apparentTemp: 17, humidity: 65, windSpeed: 14, weatherCode: 2 },
    london: { temp: 15, apparentTemp: 14, humidity: 75, windSpeed: 18, weatherCode: 61 },
    newyork: { temp: 23, apparentTemp: 24, humidity: 50, windSpeed: 15, weatherCode: 0 },
    bangkok: { temp: 32, apparentTemp: 37, humidity: 75, windSpeed: 8, weatherCode: 80 },
    sydney: { temp: 19, apparentTemp: 19, humidity: 58, windSpeed: 20, weatherCode: 0 },
    cairo: { temp: 31, apparentTemp: 30, humidity: 35, windSpeed: 16, weatherCode: 0 },
    rome: { temp: 24, apparentTemp: 25, humidity: 48, windSpeed: 11, weatherCode: 0 },
    barcelona: { temp: 23, apparentTemp: 23, humidity: 55, windSpeed: 12, weatherCode: 0 },
    danang: { temp: 30, apparentTemp: 34, humidity: 72, windSpeed: 10, weatherCode: 2 },
    singapore: { temp: 31, apparentTemp: 36, humidity: 78, windSpeed: 9, weatherCode: 80 },
    taipei: { temp: 27, apparentTemp: 29, humidity: 68, windSpeed: 12, weatherCode: 1 },
    interlaken: { temp: 14, apparentTemp: 13, humidity: 60, windSpeed: 8, weatherCode: 2 },
    vladivostok: { temp: 8, apparentTemp: 5, humidity: 70, windSpeed: 22, weatherCode: 3 },
  }

  return cities.map((city, index) => {
    const preset = fallbackPresets[city.id] || {
      temp: (city.temp ?? 20) + (index % 3),
      apparentTemp: city.temp ?? 20,
      humidity: 50 + ((index * 5) % 30),
      windSpeed: 10 + ((index * 2) % 15),
      weatherCode: index % 4 === 0 ? 0 : index % 4 === 1 ? 1 : index % 4 === 2 ? 2 : 61,
    }

    const weatherInfo = parseWeatherCode(preset.weatherCode)
    const temp = preset.temp
    const apparentTemp = preset.apparentTemp
    const humidity = preset.humidity
    const windSpeed = preset.windSpeed
    const windDirection = 180
    const pressure = 1013
    const precipitation = preset.weatherCode === 61 ? 2.5 : 0
    const weatherCode = preset.weatherCode
    const tempLabel = getTemperatureLabel(temp)

    const scoreInfo = calculateTravelScore({
      temp,
      weatherCode,
      humidity,
      windSpeed,
      precipitation,
    })

    const tipsInfo = getOutfitAndItems({
      temp,
      weatherCode,
      precipitation,
      windSpeed,
    })

    return {
      id: city.id,
      name: city.name,
      engName: city.engName,
      country: city.country || '',
      continent: city.continent || '',
      tag: city.tag || '',
      lat: city.lat,
      lon: city.lon,
      temp,
      apparentTemp,
      humidity,
      windSpeed,
      windDirection,
      pressure,
      precipitation,
      isDay: true,
      weatherCode,
      status: weatherInfo.status,
      icon: weatherInfo.icon,
      category: weatherInfo.category,
      description: weatherInfo.description,
      tempLabel: tempLabel.label,
      tempShortLabel: tempLabel.shortLabel,
      tempBadgeClass: tempLabel.badgeClass,
      travelScore: scoreInfo.travelScore,
      travelGrade: scoreInfo.travelGrade,
      travelScoreClass: scoreInfo.travelScoreClass,
      travelVerdict: scoreInfo.travelVerdict,
      travelAdvice: scoreInfo.travelAdvice,
      outfitText: tipsInfo.outfitText,
      essentialItems: tipsInfo.essentialItems,
      isFallback: true,
      updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  })
}

/**
 * 실시간 전체 도시 날씨 데이터 조회 (Open-Meteo 멀티 쿼리 + 안전 Fallback)
 */
export async function fetchLiveWeatherData(cities = WORLD_DESTINATIONS) {
  if (!cities || cities.length === 0) return []

  try {
    const lats = cities.map((c) => c.lat).join(',')
    const lons = cities.map((c) => c.lon).join(',')

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day&timezone=auto`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`날씨 API 응답 오류: ${response.status}`)
    }

    const data = await response.json()
    const results = Array.isArray(data) ? data : [data]

    return cities.map((city, index) => {
      const weatherData = results[index]?.current
      if (!weatherData) {
        return generateFallbackWeatherData([city])[0]
      }

      const weatherInfo = parseWeatherCode(weatherData.weather_code ?? 0)
      const temp = weatherData.temperature_2m ?? 20
      const apparentTemp = weatherData.apparent_temperature ?? temp
      const humidity = weatherData.relative_humidity_2m ?? 50
      const windSpeed = weatherData.wind_speed_10m ?? 0
      const windDirection = weatherData.wind_direction_10m ?? 0
      const pressure = weatherData.surface_pressure ?? 1013
      const precipitation = weatherData.precipitation ?? 0
      const weatherCode = weatherData.weather_code ?? 0
      const tempLabel = getTemperatureLabel(temp)

      const scoreInfo = calculateTravelScore({
        temp,
        weatherCode,
        humidity,
        windSpeed,
        precipitation,
      })

      const tipsInfo = getOutfitAndItems({
        temp,
        weatherCode,
        precipitation,
        windSpeed,
      })

      return {
        id: city.id,
        name: city.name,
        engName: city.engName,
        country: city.country || '',
        continent: city.continent || '',
        tag: city.tag || '',
        lat: city.lat,
        lon: city.lon,
        temp,
        apparentTemp,
        humidity,
        windSpeed,
        windDirection,
        pressure,
        precipitation,
        isDay: weatherData.is_day === 1,
        weatherCode,
        status: weatherInfo.status,
        icon: weatherInfo.icon,
        category: weatherInfo.category,
        description: weatherInfo.description,
        tempLabel: tempLabel.label,
        tempShortLabel: tempLabel.shortLabel,
        tempBadgeClass: tempLabel.badgeClass,
        travelScore: scoreInfo.travelScore,
        travelGrade: scoreInfo.travelGrade,
        travelScoreClass: scoreInfo.travelScoreClass,
        travelVerdict: scoreInfo.travelVerdict,
        travelAdvice: scoreInfo.travelAdvice,
        outfitText: tipsInfo.outfitText,
        essentialItems: tipsInfo.essentialItems,
        isFallback: false,
        updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }
    })
  } catch (err) {
    console.warn('⚠️ Open-Meteo API 통신 지연/오류 발생 -> 안전 Fallback 모의 데이터로 자동 복구합니다:', err)
    return generateFallbackWeatherData(cities)
  }
}

/**
 * 특정 도시의 상세 기상 예보 Fallback 생성기
 */
export function generateFallbackCityDetails(city) {
  const fallback = generateFallbackWeatherData([city])[0]
  const hours = []
  const currentHour = new Date().getHours()

  for (let i = 0; i < 24; i++) {
    const h = (currentHour + i) % 24
    const hourStr = `${String(h).padStart(2, '0')}:00`
    const tempOffset = Math.sin((i / 24) * Math.PI * 2) * 4
    hours.push({
      time: hourStr,
      fullTime: `2026-08-12T${hourStr}:00`,
      temp: Math.round(fallback.temp + tempOffset),
      humidity: Math.max(30, Math.min(90, Math.round(fallback.humidity - tempOffset * 2))),
      precipProb: fallback.weatherCode === 61 ? 70 : 10,
      windSpeed: fallback.windSpeed,
      weatherCode: fallback.weatherCode,
      icon: fallback.icon,
      status: fallback.status,
    })
  }

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  const dailyList = []
  const today = new Date()

  for (let d = 0; d < 7; d++) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + d)
    const month = targetDate.getMonth() + 1
    const date = targetDate.getDate()
    const dayName = daysOfWeek[targetDate.getDay()]
    const dateStr = targetDate.toISOString().slice(0, 10)

    dailyList.push({
      date: dateStr,
      displayDate: d === 0 ? `오늘 ${month}.${date} (${dayName})` : `${month}.${date} (${dayName})`,
      weatherCode: fallback.weatherCode,
      status: fallback.status,
      icon: fallback.icon,
      maxTemp: fallback.temp + 2 + (d % 2),
      minTemp: fallback.temp - 4 - (d % 2),
      precipProb: fallback.weatherCode === 61 ? 60 : 15,
    })
  }

  return {
    ...fallback,
    hourlyList: hours,
    dailyList,
  }
}

/**
 * 특정 도시의 상세 기상 예보 (24시간 시간별 + 7일간 일별 + 여행 지수 + 옷차림) 조회
 */
export async function fetchCityFullDetails(city) {
  const lat = city.lat
  const lon = city.lon

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`상세 예보 API 오류: ${response.statusText}`)
    }

    const data = await response.json()
    const current = data.current || {}
    const hourly = data.hourly || {}
    const daily = data.daily || {}

    const weatherInfo = parseWeatherCode(current.weather_code ?? 0)
    const temp = current.temperature_2m ?? 20
    const apparentTemp = current.apparent_temperature ?? temp
    const humidity = current.relative_humidity_2m ?? 50
    const windSpeed = current.wind_speed_10m ?? 0
    const windDirection = current.wind_direction_10m ?? 0
    const precipitation = current.precipitation ?? 0
    const pressure = current.surface_pressure ?? 1013
    const weatherCode = current.weather_code ?? 0

    const travelScoreInfo = calculateTravelScore({
      temp,
      weatherCode,
      humidity,
      windSpeed,
      precipitation,
    })

    const tipsInfo = getOutfitAndItems({
      temp,
      weatherCode,
      precipitation,
      windSpeed,
    })

    // 24시간 시간별 예보
    const nowISO = new Date().toISOString().slice(0, 13)
    let startIndex = (hourly.time || []).findIndex((t) => t.startsWith(nowISO))
    if (startIndex === -1) startIndex = 0
    const sliceEnd = startIndex + 24

    const hourlyList = (hourly.time || []).slice(startIndex, sliceEnd).map((t, idx) => {
      const rawIdx = startIndex + idx
      const code = (hourly.weather_code || [])[rawIdx] ?? 0
      const info = parseWeatherCode(code)
      const hourStr = t.split('T')[1]?.slice(0, 5) || t

      return {
        time: hourStr,
        fullTime: t,
        temp: (hourly.temperature_2m || [])[rawIdx] ?? 0,
        humidity: (hourly.relative_humidity_2m || [])[rawIdx] ?? 0,
        precipProb: (hourly.precipitation_probability || [])[rawIdx] ?? 0,
        windSpeed: (hourly.wind_speed_10m || [])[rawIdx] ?? 0,
        weatherCode: code,
        icon: info.icon,
        status: info.status,
      }
    })

    // 7일간 일별 예보
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
    const todayStr = new Date().toISOString().slice(0, 10)

    const dailyList = (daily.time || []).map((dateStr, idx) => {
      const code = (daily.weather_code || [])[idx] ?? 0
      const info = parseWeatherCode(code)
      const maxTemp = (daily.temperature_2m_max || [])[idx] ?? 0
      const minTemp = (daily.temperature_2m_min || [])[idx] ?? 0
      const precipProb = (daily.precipitation_probability_max || [])[idx] ?? 0

      const dateObj = new Date(dateStr)
      const month = dateObj.getMonth() + 1
      const date = dateObj.getDate()
      const dayName = daysOfWeek[dateObj.getDay()]

      let displayDate = `${month}.${date} (${dayName})`
      if (dateStr === todayStr) {
        displayDate = `오늘 ${month}.${date} (${dayName})`
      }

      return {
        date: dateStr,
        displayDate,
        weatherCode: code,
        status: info.status,
        icon: info.icon,
        maxTemp,
        minTemp,
        precipProb,
      }
    })

    return {
      id: city.id,
      name: city.name,
      engName: city.engName,
      country: city.country || '',
      continent: city.continent || '',
      tag: city.tag || '',
      lat,
      lon,
      temp,
      apparentTemp,
      humidity,
      windSpeed,
      windDirection,
      pressure,
      precipitation,
      isDay: current.is_day === 1,
      weatherCode,
      status: weatherInfo.status,
      icon: weatherInfo.icon,
      category: weatherInfo.category,
      description: weatherInfo.description,
      travelScore: travelScoreInfo.travelScore,
      travelGrade: travelScoreInfo.travelGrade,
      travelScoreClass: travelScoreInfo.travelScoreClass,
      travelVerdict: travelScoreInfo.travelVerdict,
      travelAdvice: travelScoreInfo.travelAdvice,
      outfitText: tipsInfo.outfitText,
      essentialItems: tipsInfo.essentialItems,
      hourlyList,
      dailyList,
      isFallback: false,
    }
  } catch (err) {
    console.warn(`⚠️ [${city.name}] 상세 기상 API 실패 -> Fallback 데이터 생성:`, err)
    return generateFallbackCityDetails(city)
  }
}

/**
 * 특정 도시의 24시간 시간별 상세 예보 데이터 조회
 */
export async function fetchHourlyForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=2&timezone=auto`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`상세 예보 API 오류: ${response.statusText}`)
  }

  const data = await response.json()
  const hourly = data.hourly || {}

  const nowISO = new Date().toISOString().slice(0, 13)
  let startIndex = (hourly.time || []).findIndex((t) => t.startsWith(nowISO))
  if (startIndex === -1) startIndex = 0

  const sliceEnd = startIndex + 24
  const times = (hourly.time || []).slice(startIndex, sliceEnd)
  const temps = (hourly.temperature_2m || []).slice(startIndex, sliceEnd)
  const humidities = (hourly.relative_humidity_2m || []).slice(startIndex, sliceEnd)
  const precipProbabilities = (hourly.precipitation_probability || []).slice(startIndex, sliceEnd)
  const weatherCodes = (hourly.weather_code || []).slice(startIndex, sliceEnd)
  const windSpeeds = (hourly.wind_speed_10m || []).slice(startIndex, sliceEnd)

  return times.map((t, idx) => {
    const code = weatherCodes[idx] ?? 0
    const info = parseWeatherCode(code)
    const hourStr = t.split('T')[1]?.slice(0, 5) || t

    return {
      time: hourStr,
      fullTime: t,
      temp: temps[idx] ?? 0,
      humidity: humidities[idx] ?? 0,
      precipProb: precipProbabilities[idx] ?? 0,
      windSpeed: windSpeeds[idx] ?? 0,
      weatherCode: code,
      icon: info.icon,
      status: info.status,
    }
  })
}

/**
 * 사용자의 현재 GPS 위치 좌표 가져오기
 */
export function getCurrentUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('현재 브라우저에서 위치 서비스를 지원하지 않습니다.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          id: 'my_location',
          name: '내 현재 위치',
          engName: 'Current Location',
          country: '대한민국 🇰🇷',
          continent: '아시아',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          tag: 'GPS 기반 실시간',
        })
      },
      (error) => {
        let msg = '위치 정보를 가져오는데 실패했습니다.'
        if (error.code === error.PERMISSION_DENIED) {
          msg = '위치 정보 권한이 거부되었습니다. 브라우저 위치 권한을 허용해 주세요.'
        }
        reject(new Error(msg))
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  })
}

/**
 * Windy Point Forecast API 연동 (사용자 API 키가 있을 경우)
 */
export async function fetchWindyPointForecast(lat, lon, apiKey) {
  if (!apiKey) {
    throw new Error('Windy API 키가 제공되지 않았습니다.')
  }

  const response = await fetch('https://api.windy.com/api/point-forecast/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lat,
      lon,
      model: 'gfs',
      parameters: ['temp', 'wind', 'precip', 'rh'],
      levels: ['surface'],
      key: apiKey,
    }),
  })

  if (!response.ok) {
    throw new Error(`Windy API 통신 오류: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * 전세계/국내 도시 검색 (Geocoding API)
 */
export async function searchCitiesGeocoding(query) {
  if (!query || query.trim().length < 2) return []

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=ko&format=json`
  const response = await fetch(url)
  if (!response.ok) return []

  const data = await response.json()
  if (!data.results) return []

  return data.results.map((r) => ({
    id: `geo_${r.id}`,
    name: r.name,
    engName: r.country ? `${r.name}, ${r.country}` : r.name,
    country: r.country || '',
    continent: '전체',
    lat: r.latitude,
    lon: r.longitude,
    tag: `${r.admin1 ? r.admin1 + ', ' : ''}${r.country || ''}`,
  }))
}

// --- src/services/weatherService.js 하단에 추가 ---

export const countryMapping = {
  대한민국: { en: 'South Korea', code: 'kr' },
  일본: { en: 'Japan', code: 'jp' },
  프랑스: { en: 'France', code: 'fr' },
  영국: { en: 'United Kingdom', code: 'gb' },
  미국: { en: 'United States', code: 'us' },
  태국: { en: 'Thailand', code: 'th' },
  호주: { en: 'Australia', code: 'au' },
  이집트: { en: 'Egypt', code: 'eg' },
  이탈리아: { en: 'Italy', code: 'it' },
  스페인: { en: 'Spain', code: 'es' },
  스위스: { en: 'Switzerland', code: 'ch' },
  베트남: { en: 'Vietnam', code: 'vn' },
  싱가포르: { en: 'Singapore', code: 'sg' },
  대만: { en: 'Taiwan', code: 'tw' },
}

export const defaultCountryFlags = {
  대한민국: 'https://flags.restcountries.com/v5/w640/kr.png',
  일본: 'https://flags.restcountries.com/v5/w640/jp.png',
  프랑스: 'https://flags.restcountries.com/v5/w640/fr.png',
  미국: 'https://flags.restcountries.com/v5/w640/us.png',
}

// 1. cities.json 동적 로드 (없으면 WORLD_DESTINATIONS 사용)
export const fetchBaseCities = async () => {
  try {
    const res = await fetch('/data/cities.json')
    if (res.ok) return await res.json()
  } catch (err) {
    console.warn('로컬 cities.json 없음, 기본 리스트 사용:', err)
  }
  return WORLD_DESTINATIONS
}

// 2. RestCountries 국기 API 조회
export const fetchCountryFlagsApi = async (apiKey) => {
  const flags = { ...defaultCountryFlags }
  if (!apiKey) return flags
  try {
    const res = await fetch(
      'https://api.restcountries.com/countries/v5?response_fields=names.common,flag.url_png&limit=100',
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    )
    if (!res.ok) throw new Error('API Fail')
    const json = await res.json()
    const objects = json?.data?.objects || []
    const dict = {}
    objects.forEach((item) => {
      if (item?.names?.common && item?.flag?.url_png)
        dict[item.names.common.toLowerCase()] = item.flag.url_png
    })
    Object.entries(countryMapping).forEach(([kr, meta]) => {
      if (dict[meta.en.toLowerCase()]) flags[kr] = dict[meta.en.toLowerCase()]
    })
  } catch (e) {
    console.warn('국기 API fallback 유지:', e)
  }
  return flags
}
