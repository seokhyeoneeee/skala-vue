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
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      @input="$emit('update-query', $event.target.value)"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  font-size: 14px;
}
</style>
