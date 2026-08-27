import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const KOREAN_CITY_ALIASES = {
  서울: 'Seoul,KR',
  부산: 'Busan,KR',
  대구: 'Daegu,KR',
  인천: 'Incheon,KR',
  광주: 'Gwangju,KR',
  대전: 'Daejeon,KR',
  울산: 'Ulsan,KR',
  세종: 'Sejong,KR',
  수원: 'Suwon,KR',
  제주: 'Jeju,KR',
  서귀포: 'Seogwipo,KR',
  춘천: 'Chuncheon,KR',
  강릉: 'Gangneung,KR',
  원주: 'Wonju,KR',
  청주: 'Cheongju,KR',
  충주: 'Chungju,KR',
  천안: 'Cheonan,KR',
  전주: 'Jeonju,KR',
  군산: 'Gunsan,KR',
  익산: 'Iksan,KR',
  목포: 'Mokpo,KR',
  여수: 'Yeosu,KR',
  순천: 'Suncheon,KR',
  포항: 'Pohang,KR',
  경주: 'Gyeongju,KR',
  구미: 'Gumi,KR',
  창원: 'Changwon,KR',
  진주: 'Jinju,KR',
  김해: 'Gimhae,KR',
  거제: 'Geoje,KR',
  성남: 'Seongnam,KR',
  고양: 'Goyang,KR',
  용인: 'Yongin,KR',
  부천: 'Bucheon,KR',
  안산: 'Ansan,KR',
  안양: 'Anyang,KR',
  평택: 'Pyeongtaek,KR',
  파주: 'Paju,KR',
  의정부: 'Uijeongbu,KR',
  도쿄: 'Tokyo,JP',
  오사카: 'Osaka,JP',
  후쿠오카: 'Fukuoka,JP',
  베이징: 'Beijing,CN',
  상하이: 'Shanghai,CN',
  타이베이: 'Taipei,TW',
  홍콩: 'Hong Kong,HK',
  방콕: 'Bangkok,TH',
  싱가포르: 'Singapore,SG',
  하노이: 'Hanoi,VN',
  런던: 'London,GB',
  파리: 'Paris,FR',
  베를린: 'Berlin,DE',
  로마: 'Rome,IT',
  마드리드: 'Madrid,ES',
  뉴욕: 'New York,US',
  로스앤젤레스: 'Los Angeles,US',
  시드니: 'Sydney,AU',
}

const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error('.env.local 파일에 VITE_OPENWEATHER_API_KEY를 설정해 주세요.')
  }
}

const getWeatherEmoji = (weather) => {
  const weatherId = weather.id
  const description = weather.description ?? ''

  if (weatherId >= 200 && weatherId < 300) return '⛈️'
  if (weatherId >= 300 && weatherId < 400) return '🌦️'
  if (weatherId >= 500 && weatherId < 600) return '🌧️'
  if (weatherId >= 600 && weatherId < 700) return '🌨️'
  if (weatherId >= 700 && weatherId < 800) return '🌫️'
  if (weatherId === 800) return weather.icon?.endsWith('n') ? '🌙' : '☀️'
  if (weatherId === 801) return '🌤️'
  if (weatherId > 801 && weatherId < 900) return '⛅️'

  if (description.includes('천둥')) return '⛈️'
  if (description.includes('비') || description.includes('소나기')) return '🌧️'
  if (description.includes('눈')) return '🌨️'
  if (description.includes('안개') || description.includes('박무')) return '🌫️'
  if (description.includes('맑')) return '☀️'
  if (description.includes('구름') || description.includes('흐림')) return '⛅️'
  if (description.includes('바람')) return '💨'
  return '🌡️'
}

const mapWeatherData = (data, city = {}) => {
  const currentWeather = data.weather[0]

  return {
    id: city.id ?? `weather_${data.id}`,
    apiId: data.id,
    name: city.name ?? data.name,
    query: city.query ?? data.name,
    temp: data.main.temp,
    status: currentWeather.description,
    weatherId: currentWeather.id,
    emoji: getWeatherEmoji(currentWeather),
    humidity: data.main.humidity,
    wind: data.wind.speed,
  }
}

// 검색창에 입력한 전 세계 도시의 현재 날씨를 조회합니다.
export const fetchWeatherByCity = async (cityName) => {
  checkApiKey()

  const originalQuery = cityName.trim()
  if (!originalQuery) throw new Error('검색할 도시 이름을 입력해 주세요.')

  const geocodingQuery = KOREAN_CITY_ALIASES[originalQuery] ?? originalQuery
  const isKoreanQuery = /[가-힣]/.test(originalQuery)
  const preferKoreanLocation = geocodingQuery.endsWith(',KR')

  const locationResponse = await axios.get(GEOCODING_URL, {
    params: {
      q: geocodingQuery,
      limit: 5,
      appid: API_KEY,
    },
  })

  const locations = locationResponse.data
  const location = preferKoreanLocation
    ? locations.find((item) => item.country === 'KR') ?? locations[0]
    : locations[0]

  if (!location) throw new Error('도시를 찾을 수 없습니다. 도시 이름을 확인해 주세요.')

  const response = await axios.get(BASE_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return mapWeatherData(response.data, {
    name: isKoreanQuery ? originalQuery : response.data.name,
    query: originalQuery,
  })
}

// 서울, 수원, 부산, 제주의 실시간 날씨를 동시에 요청합니다.
export const fetchWeatherList = async () => {
  checkApiKey()

  const [seoulRes, suwonRes, busanRes, jejuRes] = await Promise.all([
    axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
    axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
    axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
    axios.get(`${BASE_URL}?q=Jeju,KR&appid=${API_KEY}&units=metric&lang=kr`),
  ])

  // 기존 자식 컴포넌트(WeatherCard)가 요구하는 프로퍼티 규격에 맞춰 JSON을 매핑합니다.
  const weatherList = [
    mapWeatherData(seoulRes.data, { id: 'city_01', name: '서울', query: 'Seoul' }),
    mapWeatherData(suwonRes.data, { id: 'city_02', name: '수원', query: 'Suwon' }),
    mapWeatherData(busanRes.data, { id: 'city_03', name: '부산', query: 'Busan' }),
    mapWeatherData(jejuRes.data, { id: 'city_04', name: '제주', query: 'Jeju,KR' }),
  ]

  console.log('🟢 [API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList)
  return weatherList
}

// 상세 화면에서도 동일한 API 응답 형식을 재사용합니다.
export const fetchWeatherById = async (cityId) => {
  const weatherList = await fetchWeatherList()
  return weatherList.find((item) => item.id === cityId) ?? null
}
