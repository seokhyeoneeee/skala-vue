<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '바람', feelsLike: 20 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 개인 추가 반응형 상태: 관심 도시 ID와 즐겨찾기 필터 상태를 관리합니다.
const savedFavoriteCityIds = JSON.parse(window.localStorage.getItem('favoriteCityIds') || '[]')
const favoriteCityIds = ref(savedFavoriteCityIds)
const showFavoritesOnly = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  let result = weatherList.value

  if (query) {
    result = result.filter((item) => item.name.includes(query))
  }

  if (showFavoritesOnly.value) {
    result = result.filter((item) => favoriteCityIds.value.includes(item.id))
  }

  return result
})

// 개인 추가 Computed: 즐겨찾기로 등록된 도시 수를 계산합니다.
const favoriteCount = computed(() => favoriteCityIds.value.length)

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 선택 상태가 변경되었습니다: ${newInfo}`)
})

// 개인 추가 Watcher: 즐겨찾기가 변경될 때 브라우저에 저장합니다.
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
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        @input="searchQuery = $event.target.value"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
      <label>
        <input v-model="showFavoritesOnly" type="checkbox" />
        즐겨찾기 도시만 보기
      </label>
      <p>즐겨찾기한 도시: {{ favoriteCount }}개</p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <div class="card-actions">
          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
            상세보기
          </button>
          <button class="favorite-button" @click.stop="toggleFavorite(item.id)">
            {{ favoriteCityIds.includes(item.id) ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기' }}
          </button>
        </div>
      </div>

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.search-box label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.search-box label input {
  width: auto;
}

.empty-message {
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}

.favorite-button {
  color: #b7791f;
  background: #fffaf0;
  border: 1px solid #f6ad55;
}

.list-box .weather-card {
  box-sizing: border-box;
  min-height: 120px;
  padding-right: 155px;
}

.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 130px;
}

.card-actions button {
  position: static;
  box-sizing: border-box;
  width: 100%;
  min-height: 34px;
  margin: 0;
  padding: 6px 10px;
}
</style>
