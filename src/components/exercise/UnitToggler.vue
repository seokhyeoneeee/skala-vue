<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>
      날씨단위:
      <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>
    <button type="button" class="unit-button" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  text-align: center;
}

.unit-button {
  width: auto;
  padding: 8px 12px;
  color: #ffffff;
  font-weight: 700;
  background: #536d91;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.unit-button:hover {
  background: #405a7d;
}
</style>
