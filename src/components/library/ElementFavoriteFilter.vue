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
    <el-checkbox
      :model-value="showFavoritesOnly"
      size="large"
      @update:model-value="$emit('update-favorites-filter', $event)"
    >
      즐겨찾기 도시만 보기
    </el-checkbox>
    <span>즐겨찾기한 도시: {{ favoriteCount }}개</span>
  </div>
</template>

<style scoped>
.favorite-filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
}
</style>
