<script setup>
defineProps({
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
</script>

<template>
  <article
    class="weather-card"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ cityItem.temp }}°C</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

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
  color: #ffffff;
  border-radius: 4px;
}

.hot {
  background: #ff7675;
}

.cool {
  background: #74b9ff;
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
</style>
