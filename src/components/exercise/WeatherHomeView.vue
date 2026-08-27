<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from './BaseDashboardCard.vue'
import FavoriteFilter from './FavoriteFilter.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCardafterStore.vue'
import { fetchWeatherList } from '../../services/weatherApi'
import { useConfigStore } from '../../stores/configStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const savedFavoriteCityIds = JSON.parse(window.localStorage.getItem('favoriteCityIds') || '[]')
const favoriteCityIds = ref(savedFavoriteCityIds)
const showFavoritesOnly = ref(false)

const loadWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    weatherList.value = await fetchWeatherList()
    configStore.markWeatherUpdated()
  } catch (error) {
    console.error('날씨 API 호출 실패:', error)
    errorMessage.value =
      error.message || '날씨 정보를 가져오지 못했습니다. API 키와 네트워크를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
}

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원 (KeepAlive를 적용해야만 동작함)
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }

  loadWeather()
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
      <p class="updated-at">최근 업데이트: {{ configStore.lastUpdatedLabel }}</p>
      <p v-if="isLoading" class="loading-message">실시간 날씨를 불러오고 있습니다.</p>
      <div v-else-if="errorMessage" class="error-box">
        <p>{{ errorMessage }}</p>
        <button type="button" class="retry-button" @click="loadWeather">다시 시도</button>
      </div>
      <WeatherCard
        v-else
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :is-favorite="favoriteCityIds.includes(item.id)"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump(item.id)"
        @toggle-favorite="toggleFavorite"
      />
      <p
        v-if="!isLoading && !errorMessage && filteredWeatherList.length === 0"
        class="empty-message"
      >
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

.updated-at {
  color: #7f8c8d;
  font-size: 13px;
}

.loading-message {
  padding: 24px 0;
  text-align: center;
}

.error-box {
  padding: 16px;
  color: #c0392b;
  text-align: center;
  background: #fff5f5;
  border-radius: 6px;
}

.retry-button {
  width: auto;
  padding: 8px 14px;
  color: #ffffff;
  background: #c0392b;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}
</style>
