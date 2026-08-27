<script setup>
defineProps({
  showFavoritesOnly: {
    type: Boolean,
    default: false,
  },
  favoriteCount: {
    type: Number,
    required: true,
  },
})

defineEmits(['update-favorites-filter'])
</script>

<template>
  <div class="favorite-filter">
    <label>
      <input
        type="checkbox"
        :checked="showFavoritesOnly"
        @change="$emit('update-favorites-filter', $event.target.checked)"
      />
      즐겨찾기 도시만 보기
    </label>
    <p>즐겨찾기한 도시: {{ favoriteCount }}개</p>
  </div>
</template>

<style scoped>
label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.favorite-filter {
  margin-top: 12px;
}

label input {
  width: auto;
  margin: 0;
}

p {
  margin: 12px 0 0;
}
</style>
