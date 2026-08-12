/**
 * 세계 주요 도시 기본 메타데이터 및 날씨/국기 API 서비스
 */

export const defaultCities = [
  { id: 'city_01', name: '서울', country: '대한민국', lat: 37.5665, lon: 126.9780, temp: 23, status: '맑음' },
  { id: 'city_02', name: '도쿄', country: '일본', lat: 35.6762, lon: 139.6503, temp: 21, status: '맑음' },
  { id: 'city_03', name: '파리', country: '프랑스', lat: 48.8566, lon: 2.3522, temp: 20, status: '구름' },
  { id: 'city_04', name: '런던', country: '영국', lat: 51.5074, lon: -0.1278, temp: 15, status: '비' },
  { id: 'city_05', name: '뉴욕', country: '미국', lat: 40.7128, lon: -74.0060, temp: 25, status: '맑음' },
  { id: 'city_06', name: '방콕', country: '태국', lat: 13.7563, lon: 100.5018, temp: 34, status: '비' },
  { id: 'city_07', name: '시드니', country: '호주', lat: -33.8688, lon: 151.2093, temp: 18, status: '맑음' },
  { id: 'city_08', name: '카이로', country: '이집트', lat: 30.0444, lon: 31.2357, temp: 36, status: '맑음' },
  { id: 'city_09', name: '로마', country: '이탈리아', lat: 41.9028, lon: 12.4964, temp: 26, status: '맑음' },
]

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
}

export const defaultCountryFlags = {
  대한민국: 'https://flags.restcountries.com/v5/w640/kr.png',
  일본: 'https://flags.restcountries.com/v5/w640/jp.png',
  프랑스: 'https://flags.restcountries.com/v5/w640/fr.png',
  영국: 'https://flags.restcountries.com/v5/w640/gb.png',
  미국: 'https://flags.restcountries.com/v5/w640/us.png',
  태국: 'https://flags.restcountries.com/v5/w640/th.png',
  호주: 'https://flags.restcountries.com/v5/w640/au.png',
  이집트: 'https://flags.restcountries.com/v5/w640/eg.png',
  이탈리아: 'https://flags.restcountries.com/v5/w640/it.png',
}

/**
 * WMO 기상 코드 -> 한글 날씨 상태 문자열 매핑
 */
export const mapWmoToStatus = (code) => {
  if (code === 0) return '맑음'
  if ([1, 2, 3].includes(code)) return '구름'
  if ([45, 48].includes(code)) return '흐림'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return '비'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '눈'
  return '맑음'
}

/**
 * public/data/cities.json 로드 (실패 시 defaultCities 반환)
 */
export const fetchBaseCities = async () => {
  try {
    const res = await fetch('/data/cities.json')
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('로컬 cities.json 로드 실패, 기본 번들 사용:', err)
  }
  return defaultCities
}

/**
 * Open-Meteo API를 통한 실시간 도시 날씨 데이터 조회
 */
export const fetchLiveCityWeather = async (baseCities = defaultCities) => {
  try {
    const lats = baseCities.map((c) => c.lat).join(',')
    const lons = baseCities.map((c) => c.lon).join(',')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Open-Meteo API 오류: ${response.status}`)
    }

    const data = await response.json()
    const weatherArray = Array.isArray(data) ? data : [data]

    const list = baseCities.map((city, idx) => {
      const current = weatherArray[idx]?.current
      if (current) {
        return {
          ...city,
          temp: Math.round(current.temperature_2m),
          status: mapWmoToStatus(current.weather_code),
        }
      }
      return city
    })

    return { success: true, data: list, source: 'live' }
  } catch (error) {
    console.warn('⚠️ 실시간 날씨 API 호출 실패, fallback 데이터 적용:', error)
    return { success: false, data: baseCities, source: 'fallback' }
  }
}

/**
 * RestCountries API를 통한 국가별 국기 이미지 URL 조회
 */
export const fetchCountryFlagsApi = async (apiKey) => {
  const flags = { ...defaultCountryFlags }
  try {
    let url = '/api/restcountries/countries/v5?response_fields=names.common,flag.url_png&limit=100'
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      url = 'https://api.restcountries.com/countries/v5?response_fields=names.common,flag.url_png&limit=100'
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
    }

    if (!response.ok) {
      throw new Error(`국기 API 응답 실패: ${response.status}`)
    }

    const json = await response.json()
    const countryObjects = json?.data?.objects || []

    const apiFlagDict = {}
    countryObjects.forEach((item) => {
      if (item?.names?.common && item?.flag?.url_png) {
        apiFlagDict[item.names.common.toLowerCase()] = item.flag.url_png
      }
    })

    Object.entries(countryMapping).forEach(([krName, meta]) => {
      const matchedFlag = apiFlagDict[meta.en.toLowerCase()]
      if (matchedFlag) {
        flags[krName] = matchedFlag
      }
    })
    console.log('✅ RestCountries 국기 API 연동 성공')
  } catch (error) {
    console.warn('⚠️ 국기 API 호출 중 오류 발생, 기본 국기 리소스를 유지합니다:', error)
  }
  return flags
}
