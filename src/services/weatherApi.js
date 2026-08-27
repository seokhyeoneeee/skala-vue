import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error('.env.local 파일에 VITE_OPENWEATHER_API_KEY를 설정해 주세요.')
  }
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
    {
      id: 'city_01',
      name: '서울',
      temp: seoulRes.data.main.temp,
      status: seoulRes.data.weather[0].description,
      humidity: seoulRes.data.main.humidity,
      wind: seoulRes.data.wind.speed,
    },
    {
      id: 'city_02',
      name: '수원',
      temp: suwonRes.data.main.temp,
      status: suwonRes.data.weather[0].description,
      humidity: suwonRes.data.main.humidity,
      wind: suwonRes.data.wind.speed,
    },
    {
      id: 'city_03',
      name: '부산',
      temp: busanRes.data.main.temp,
      status: busanRes.data.weather[0].description,
      humidity: busanRes.data.main.humidity,
      wind: busanRes.data.wind.speed,
    },
    {
      id: 'city_04',
      name: '제주',
      temp: jejuRes.data.main.temp,
      status: jejuRes.data.weather[0].description,
      humidity: jejuRes.data.main.humidity,
      wind: jejuRes.data.wind.speed,
    },
  ]

  console.log('🟢 [API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList)
  return weatherList
}

// 상세 화면에서도 동일한 API 응답 형식을 재사용합니다.
export const fetchWeatherById = async (cityId) => {
  const weatherList = await fetchWeatherList()
  return weatherList.find((item) => item.id === cityId) ?? null
}
