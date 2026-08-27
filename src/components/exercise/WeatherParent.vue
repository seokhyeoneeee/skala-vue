<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import FavoriteFilter from './FavoriteFilter.vue'

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

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 선택 상태가 변경되었습니다: ${newInfo}`)
})

watch(
  favoriteCityIds,
  (cityIds) => {
    window.localStorage.setItem('favoriteCityIds', JSON.stringify(cityIds))
    console.log(`[watch] 즐겨찾기 도시 ${cityIds.length}개 저장 완료`)
  },
  { deep: true },
)

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value}`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const toggleFavorite = (cityId) => {
  favoriteCityIds.value = favoriteCityIds.value.includes(cityId)
    ? favoriteCityIds.value.filter((id) => id !== cityId)
    : [...favoriteCityIds.value, cityId]
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="searchQuery = $event" />
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
        @select-card="selectedCityInfo = $event"
        @click-detail="showDetail"
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
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.status-bar {
  padding: 10px;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  background: #e8f5e9;
  border-radius: 6px;
}

.empty-message {
  color: #e74c3c;
  text-align: center;
}
</style>
