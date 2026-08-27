<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'search-city'])

const submitSearch = (query) => {
  const trimmedQuery = query.trim()
  if (trimmedQuery) emit('search-city', trimmedQuery)
}
</script>

<template>
  <el-card class="search-card" shadow="never">
    <h3>🔍 API 도시 검색</h3>
    <el-input
      :model-value="currentQuery"
      size="large"
      clearable
      placeholder="도시 이름 입력 (예: 대전, 도쿄, London)"
      @update:model-value="emit('update-query', $event)"
      @keyup.enter="submitSearch(currentQuery)"
    >
      <template #append>
        <el-button :loading="isSearching" @click="submitSearch(currentQuery)">검색</el-button>
      </template>
    </el-input>
    <el-alert
      v-if="errorMessage"
      class="search-error"
      :title="errorMessage"
      type="error"
      :closable="false"
      show-icon
    />
    <p>검색할 도시: <strong>{{ currentQuery }}</strong></p>
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

.search-error {
  margin-top: 12px;
}
</style>
