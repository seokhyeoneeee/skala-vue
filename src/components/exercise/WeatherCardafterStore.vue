<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
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

// 2. 상위로 송신할 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()
// 🔥 [핵심 미션] 스토어의 상태값이 'fahrenheit'일 때만 화씨 공식 적용 연산
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

</script>

<template>
  <article
    class="weather-card"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <div class="card-actions">
      <button
        class="detail-button"
        @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
      >
        상세보기
      </button>
      <button class="favorite-button" @click.stop="emit('toggle-favorite', cityItem.id)">
        {{ isFavorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  min-height: 120px;
  padding: 12px 155px 12px 12px;
  margin-bottom: 10px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  color: #fff;
  border-radius: 4px;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
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
  box-sizing: border-box;
  width: 100%;
  min-height: 34px;
  margin: 0;
  padding: 6px 10px;
}

.favorite-button {
  color: #b7791f;
  background: #fffaf0;
  border: 1px solid #f6ad55;
}

.card-actions button {
  cursor: pointer;
}
</style>
