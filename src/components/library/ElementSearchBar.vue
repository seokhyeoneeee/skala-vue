<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <el-card class="search-card" shadow="never">
    <h3>🔍 도시 검색</h3>
    <el-input
      :model-value="currentQuery"
      size="large"
      clearable
      placeholder="검색할 도시 이름 입력"
      @update:model-value="$emit('update-query', $event)"
    />
    <p>검색 중인 도시: <strong>{{ currentQuery }}</strong></p>
  </el-card>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
  background: #f8f9fa;
}

h3 {
  margin-top: 0;
}

p {
  margin-bottom: 0;
}
</style>
