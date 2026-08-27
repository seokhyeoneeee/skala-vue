<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ElementFavoriteFilter from '../components/library/ElementFavoriteFilter.vue'
import ElementSearchBar from '../components/library/ElementSearchBar.vue'
import ElementWeatherCard from '../components/library/ElementWeatherCard.vue'
import { fetchWeatherByCity, fetchWeatherList } from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

const weatherList = ref([])
const isLoading = ref(false)
const isSearching = ref(false)
const errorMessage = ref('')
const searchErrorMessage = ref('')
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const favoriteCityIds = ref(JSON.parse(window.localStorage.getItem('favoriteCityIds') || '[]'))
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

const searchCity = async (cityName) => {
  isSearching.value = true
  searchErrorMessage.value = ''

  try {
    const searchedCity = await fetchWeatherByCity(cityName)
    const existingIndex = weatherList.value.findIndex(
      (item) => item.apiId === searchedCity.apiId,
    )

    if (existingIndex >= 0) {
      const existingCity = weatherList.value[existingIndex]
      weatherList.value.splice(existingIndex, 1, {
        ...searchedCity,
        id: existingCity.id,
        name: existingCity.name,
      })
      selectedCityInfo.value = `${existingCity.name} 날씨를 새로 불러왔습니다.`
    } else {
      weatherList.value.unshift(searchedCity)
      selectedCityInfo.value = `${searchedCity.name} 날씨를 추가했습니다.`
    }

    configStore.markWeatherUpdated()
  } catch (error) {
    console.error('도시 검색 API 호출 실패:', error)
    searchErrorMessage.value =
      error.response?.status === 404
        ? '도시를 찾을 수 없습니다. 영문 도시 이름도 시도해 주세요.'
        : error.message || '도시 날씨를 검색하지 못했습니다.'
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  if (route.query.search) searchQuery.value = route.query.search
  await loadWeather()

  if (searchQuery.value.trim()) await searchCity(searchQuery.value)
})

watch(searchQuery, (newQuery) => {
  router.replace({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

watch(
  favoriteCityIds,
  (cityIds) => window.localStorage.setItem('favoriteCityIds', JSON.stringify(cityIds)),
  { deep: true },
)

const filteredWeatherList = computed(() => {
  let result = weatherList.value

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

const handleDetailJump = (id) => {
  const city = weatherList.value.find((item) => item.id === id)

  router.push({
    name: 'weather-detail',
    params: { cityId: id },
    query: { city: city?.query },
  })
}
</script>

<template>
  <div class="dashboard-wrapper">
    <ElementSearchBar
      :current-query="searchQuery"
      :is-searching="isSearching"
      :error-message="searchErrorMessage"
      @update-query="searchQuery = $event"
      @search-city="searchCity"
    />

    <el-card class="favorite-card" shadow="never">
      <ElementFavoriteFilter
        :show-favorites-only="showFavoritesOnly"
        :favorite-count="favoriteCount"
        @update-favorites-filter="showFavoritesOnly = $event"
      />
    </el-card>

    <el-card class="weather-section" shadow="never">
      <div class="section-heading">
        <div>
          <h3>🏙️ 지역별 날씨 현황</h3>
          <p>최근 업데이트: {{ configStore.lastUpdatedLabel }}</p>
        </div>
        <el-button type="primary" :loading="isLoading" @click="loadWeather">새로고침</el-button>
      </div>

      <el-skeleton v-if="isLoading && weatherList.length === 0" :rows="5" animated />

      <div v-else-if="errorMessage" class="error-state">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
        <el-button type="danger" plain @click="loadWeather">다시 시도</el-button>
      </div>

      <template v-else>
        <div class="weather-grid">
          <ElementWeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            :is-favorite="favoriteCityIds.includes(item.id)"
            @select-card="selectedCityInfo = $event"
            @click-detail="handleDetailJump"
            @toggle-favorite="toggleFavorite"
          />
        </div>
        <el-empty
          v-if="filteredWeatherList.length === 0"
          description="검색 결과와 일치하는 도시가 없습니다."
          :image-size="80"
        />
      </template>
    </el-card>

    <el-alert
      class="status-bar"
      :title="selectedCityInfo"
      type="success"
      :closable="false"
      show-icon
    />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: none;
}

.favorite-card,
.weather-section {
  margin-bottom: 16px;
  background: #f8f9fa;
}

.weather-section :deep(.el-card__body) {
  padding: 16px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-heading h3,
.section-heading p {
  margin: 0;
}

.section-heading p {
  margin-top: 6px;
  color: #909399;
  font-size: 13px;
}

.error-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 900px) {
  .weather-grid {
    grid-template-columns: 1fr;
  }
}
</style>
