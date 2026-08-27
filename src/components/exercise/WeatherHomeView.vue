<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from './BaseDashboardCard.vue'
import FavoriteFilter from './FavoriteFilter.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCardafterStore.vue'

const router = useRouter()
const route = useRoute()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '바람', feelsLike: 20 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const savedFavoriteCityIds = JSON.parse(window.localStorage.getItem('favoriteCityIds') || '[]')
const favoriteCityIds = ref(savedFavoriteCityIds)
const showFavoritesOnly = ref(false)

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원 (KeepAlive를 적용해야만 동작함)
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편 (현재 큰 의미없음)
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

watch(
  favoriteCityIds,
  (cityIds) => {
    window.localStorage.setItem('favoriteCityIds', JSON.stringify(cityIds))
  },
  { deep: true },
)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  let result = weatherList.value

  if (query) result = result.filter((item) => item.name.includes(query))
  if (showFavoritesOnly.value) {
    result = result.filter((item) => favoriteCityIds.value.includes(item.id))
  }

  return result
})

const favoriteCount = computed(() => favoriteCityIds.value.length)

const toggleFavorite = (cityId) => {
  favoriteCityIds.value = favoriteCityIds.value.includes(cityId)
    ? favoriteCityIds.value.filter((id) => id !== cityId)
    : [...favoriteCityIds.value, cityId]
}

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
      <FavoriteFilter
        :show-favorites-only="showFavoritesOnly"
        :favorite-count="favoriteCount"
        @update-favorites-filter="showFavoritesOnly = $event"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :is-favorite="favoriteCityIds.includes(item.id)"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump(item.id)"
        @toggle-favorite="toggleFavorite"
      />
      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}

.empty-message {
  color: #e74c3c;
  text-align: center;
}
</style>
