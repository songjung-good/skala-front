/**
 * 날씨 데이터 및 Windy API 연동 서비스 모듈
 */

// 대한민국 주요 도시 기본 목록 (기본 위경도 좌표)
export const DEFAULT_CITIES = [
  { id: 'seoul', name: '서울', engName: 'Seoul', lat: 37.5665, lon: 126.978 },
  { id: 'suwon', name: '수원', engName: 'Suwon', lat: 37.2636, lon: 127.0286 },
  { id: 'incheon', name: '인천', engName: 'Incheon', lat: 37.4563, lon: 126.7052 },
  { id: 'busan', name: '부산', engName: 'Busan', lat: 35.1796, lon: 129.0756 },
  { id: 'daegu', name: '대구', engName: 'Daegu', lat: 35.8714, lon: 128.6014 },
  { id: 'daejeon', name: '대전', engName: 'Daejeon', lat: 36.3504, lon: 127.3845 },
  { id: 'gwangju', name: '광주', engName: 'Gwangju', lat: 35.1595, lon: 126.8526 },
  { id: 'ulsan', name: '울산', engName: 'Ulsan', lat: 35.5384, lon: 129.3114 },
  { id: 'jeju', name: '제주', engName: 'Jeju', lat: 33.4996, lon: 126.5312 },
  { id: 'gangneung', name: '강릉', engName: 'Gangneung', lat: 37.7519, lon: 128.8761 },
  { id: 'chuncheon', name: '춘천', engName: 'Chuncheon', lat: 37.8854, lon: 127.7298 },
  { id: 'jeonju', name: '전주', engName: 'Jeonju', lat: 35.8242, lon: 127.148 },
  { id: 'pohang', name: '포항', engName: 'Pohang', lat: 36.019, lon: 129.3435 },
  { id: 'changwon', name: '창원', engName: 'Changwon', lat: 35.228, lon: 128.6811 },
  { id: 'pyeongchang', name: '평창', engName: 'Pyeongchang', lat: 37.3705, lon: 128.3902 },
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
 * 실시간 전체 도시 날씨 데이터 조회 (Open-Meteo 멀티 쿼리)
 */
export async function fetchLiveWeatherData(cities = DEFAULT_CITIES) {
  const lats = cities.map((c) => c.lat).join(',')
  const lons = cities.map((c) => c.lon).join(',')

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day&timezone=Asia%2FSeoul`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`날씨 API 응답 오류: ${response.statusText}`)
  }

  const data = await response.json()
  // 1개 도시인 경우 단일 객체, 여러 도시인 경우 배열 반환
  const results = Array.isArray(data) ? data : [data]

  return cities.map((city, index) => {
    const weatherData = results[index]?.current || {}
    const weatherInfo = parseWeatherCode(weatherData.weather_code ?? 0)
    const temp = weatherData.temperature_2m ?? 20
    const tempLabel = getTemperatureLabel(temp)

    return {
      id: city.id,
      name: city.name,
      engName: city.engName,
      lat: city.lat,
      lon: city.lon,
      temp: temp,
      apparentTemp: weatherData.apparent_temperature ?? temp,
      humidity: weatherData.relative_humidity_2m ?? 50,
      windSpeed: weatherData.wind_speed_10m ?? 0,
      windDirection: weatherData.wind_direction_10m ?? 0,
      pressure: weatherData.surface_pressure ?? 1013,
      precipitation: weatherData.precipitation ?? 0,
      isDay: weatherData.is_day === 1,
      weatherCode: weatherData.weather_code ?? 0,
      status: weatherInfo.status,
      icon: weatherInfo.icon,
      category: weatherInfo.category,
      description: weatherInfo.description,
      tempLabel: tempLabel.label,
      tempShortLabel: tempLabel.shortLabel,
      tempBadgeClass: tempLabel.badgeClass,
      updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  })
}

/**
 * 특정 도시의 24시간 시간별 상세 예보 데이터 조회
 */
export async function fetchHourlyForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=2&timezone=Asia%2FSeoul`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`상세 예보 API 오류: ${response.statusText}`)
  }

  const data = await response.json()
  const hourly = data.hourly || {}

  // 현재 시간 이후 24개 데이터 추출
  const nowISO = new Date().toISOString().slice(0, 13) // YYYY-MM-DDTHH
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

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=ko&format=json`
  const response = await fetch(url)
  if (!response.ok) return []

  const data = await response.json()
  if (!data.results) return []

  return data.results.map((r) => ({
    id: `geo_${r.id}`,
    name: r.name,
    engName: r.country ? `${r.name}, ${r.country}` : r.name,
    country: r.country || '',
    lat: r.latitude,
    lon: r.longitude,
  }))
}
