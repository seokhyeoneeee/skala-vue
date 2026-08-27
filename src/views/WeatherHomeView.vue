<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { fetchWeatherList } from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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

// 초기 마운트 시 검색어를 복원하고 실시간 날씨 데이터를 조회합니다.
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

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>
      <p class="updated-at">최근 업데이트: {{ configStore.lastUpdatedLabel }}</p>
      <el-skeleton
        v-if="isLoading && weatherList.length === 0"
        class="loading-skeleton"
        :rows="5"
        animated
      />
      <div v-else-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
        <el-button type="danger" plain @click="loadWeather">다시 시도</el-button>
      </div>
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump(item.id)"
      />
      <el-empty
        v-if="!isLoading && !errorMessage && filteredWeatherList.length === 0"
        description="검색 결과와 일치하는 도시가 없습니다."
        :image-size="80"
      />
    </BaseDashboardCard>
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
.loading-skeleton {
  padding: 12px 0;
}

.updated-at {
  margin-top: -4px;
  color: #909399;
  font-size: 12px;
}

.error-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
