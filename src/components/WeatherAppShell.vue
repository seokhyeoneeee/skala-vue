<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './exercise/UnitToggler.vue'
</script>

<template>
  <div class="weather-app-shell">
    <nav class="weather-navigation" aria-label="날씨 서비스 메뉴">
      <RouterLink to="/">🌦️ 날씨 대시보드</RouterLink>
      <RouterLink to="/about">ℹ️ 서비스 소개</RouterLink>
      <UnitToggler />
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.weather-navigation {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgb(15 23 42 / 6%);
}

.weather-navigation a {
  color: #7f8c8d;
  font-weight: 700;
  text-decoration: none;
}

.weather-navigation a.router-link-active {
  color: #3498db;
}

@media (max-width: 700px) {
  .weather-navigation {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
