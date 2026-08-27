<script setup>
import { ref, watch } from 'vue'
import WeatherAppShell from './components/WeatherAppShell.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'

const savedPage = window.localStorage.getItem('weatherPageMode')
const activePage = ref(savedPage === 'final' ? 'final' : 'assignments')

watch(activePage, (page) => {
  window.localStorage.setItem('weatherPageMode', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <header class="page-tab-header">
    <nav class="page-tabs" role="tablist" aria-label="페이지 보기 방식">
      <button
        type="button"
        role="tab"
        :aria-selected="activePage === 'assignments'"
        :class="['page-tab', { active: activePage === 'assignments' }]"
        @click="activePage = 'assignments'"
      >
        과제 1 ~ 과제 7
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activePage === 'final'"
        :class="['page-tab', { active: activePage === 'final' }]"
        @click="activePage = 'final'"
      >
        최종 완성본
      </button>
    </nav>
  </header>

  <main v-if="activePage === 'assignments'" class="assignment-page">
    <section class="app-container">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <hr />
      <WeatherMockup />
    </section>

    <section class="app-container">
      <h1>⛅ 과제 2: 날씨 (Composition API)</h1>
      <hr />
      <WeatherComposition />
    </section>

    <section class="app-container">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
    </section>

    <section class="app-container">
      <h1>⛅ 과제 4 ~ 과제 7: 누적 적용</h1>
      <hr />
      <div class="milestone-list" aria-label="과제 4부터 과제 7 적용 항목">
        <span>과제 4 · Vue Router</span>
        <span>과제 5 · Store</span>
        <span>과제 6 · Axios</span>
        <span>과제 7 · Element Plus</span>
      </div>
      <WeatherAppShell />
    </section>
  </main>

  <main v-else class="final-page">
    <WeatherAppShell />
  </main>
</template>

<style>
@import '@/assets/exercise.css';

.page-tab-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgb(255 255 255 / 96%);
  border-bottom: 1px solid #dcdfe6;
  backdrop-filter: blur(10px);
}

.page-tabs {
  display: flex;
  justify-content: center;
  gap: 38px;
  max-width: 1280px;
  margin: 0 auto;
}

.page-tab {
  position: relative;
  width: auto;
  padding: 20px 4px 17px;
  color: #777b82;
  font-size: 18px;
  font-weight: 700;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.page-tab::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4px;
  content: '';
  background: transparent;
}

.page-tab.active {
  color: #24262a;
}

.page-tab.active::after {
  background: #24262a;
}

.assignment-page {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
}

.assignment-page,
.final-page {
  padding-top: 24px;
}

.assignment-page > .app-container {
  min-width: 0;
  max-width: none;
  padding: 24px;
  margin: 0;
  overflow: hidden;
}

.assignment-page .dashboard-wrapper {
  width: 100%;
  max-width: 100%;
}

.final-page {
  box-sizing: border-box;
  width: calc(100% - 16px);
  max-width: 1800px;
  min-height: calc(100vh - 90px);
  padding: 18px;
  margin: 0 auto 32px;
  background: #f7f8fa;
  border-radius: 18px;
}

.final-page .weather-app-shell > .weather-navigation {
  position: static;
  box-sizing: border-box;
  width: 100%;
  padding-right: 20px;
  padding-left: 20px;
  margin: 0 0 32px;
  border-radius: 10px;
  transform: none;
}

.milestone-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.milestone-list span {
  padding: 10px;
  color: #536d91;
  font-weight: 700;
  text-align: center;
  background: #edf3fb;
  border-radius: 8px;
}

@media (max-width: 760px) {
  .page-tabs {
    gap: 22px;
  }

  .page-tab {
    font-size: 16px;
  }

  .milestone-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .assignment-page {
    grid-template-columns: 1fr;
  }

  .final-page {
    width: calc(100% - 20px);
    padding: 14px;
  }

  .final-page .weather-app-shell > .weather-navigation {
    padding-right: 16px;
    padding-left: 16px;
    margin-bottom: 24px;
  }
}

@media (min-width: 761px) and (max-width: 1200px) {
  .assignment-page {
    grid-template-columns: 1fr;
    max-width: 900px;
  }
}
</style>
