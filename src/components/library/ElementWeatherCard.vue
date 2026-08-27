<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
const configStore = useConfigStore()

const displayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.cityItem.temp * 9) / 5 + 32)
  }
  return Math.round(props.cityItem.temp)
})
</script>

<template>
  <el-card
    class="weather-card"
    shadow="hover"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <div class="card-content">
      <div>
        <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
        <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <el-tag v-if="cityItem.temp >= 25" type="danger" size="large" effect="dark">
          🔥 더움
        </el-tag>
        <el-tag v-else type="primary" size="large" effect="dark">❄️ 선선함</el-tag>
      </div>

      <div class="card-actions">
        <el-button plain @click.stop="emit('click-detail', cityItem.id)">상세보기</el-button>
        <el-button type="warning" plain @click.stop="emit('toggle-favorite', cityItem.id)">
          {{ isFavorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기' }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin-bottom: 12px;
  cursor: pointer;
}

.card-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  min-height: 120px;
}

h4 {
  margin: 0 0 8px;
}

p {
  margin: 0 0 10px;
}

.card-actions {
  display: flex;
  flex: 0 0 140px;
  flex-direction: column;
  gap: 8px;
}

.card-actions :deep(.el-button) {
  width: 100%;
  min-height: 40px;
  margin: 0;
}
</style>
