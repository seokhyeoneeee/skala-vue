<script setup>
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
    <hr />
    <WeatherMockup />
  </div>
  <div class="app-container">
    <h1>⛅ 과제 2: 날씨 (Composition API)</h1>
    <hr />
    <WeatherComposition />
  </div>
  <div class="app-container">
    <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
    <hr />
    <WeatherParent />
  </div>
  <div class="app-container">
    <h1>⛅ 과제 5: 스토어적용</h1>
    <hr />

  <nav class="weather-navigation">
    <RouterLink to="/">🌦️ 날씨 대시보드</RouterLink>
    <RouterLink to="/about">ℹ️ 서비스 소개</RouterLink>
    <UnitToggler />
  </nav>

    <RouterView />
  </div>
</template>

<style>
@import '@/assets/exercise.css';
.weather-navigation {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
}

.weather-navigation a {
  color: #7f8c8d;
  font-weight: bold;
  text-decoration: none;
}

.weather-navigation a.router-link-active {
  color: #3498db;
}
</style>
