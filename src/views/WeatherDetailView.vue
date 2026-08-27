<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWeatherById } from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  if (configStore.unit === 'fahrenheit') {
    return Math.round((cityData.value.temp * 9) / 5 + 32)
  }
  return Math.round(cityData.value.temp)
})

onMounted(async () => {
  isLoading.value = true

  try {
    cityData.value = await fetchWeatherById(route.params.cityId)
  } catch (error) {
    console.error('상세 날씨 API 호출 실패:', error)
    errorMessage.value =
      error.message || '상세 날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <p v-if="isLoading">실시간 상세 날씨 정보를 불러오고 있습니다.</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div v-else-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}%</p>
      <p>현재 풍속: {{ cityData.wind }}m/s</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-message {
  color: #c0392b;
}
</style>
