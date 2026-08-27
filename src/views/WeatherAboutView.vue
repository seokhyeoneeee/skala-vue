<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <h3>ℹ️ 서비스 소개</h3>
    <hr />

    <div class="description-box">
      <p>
        본 서비스는 <strong>OpenWeather API</strong>를 활용해 국내외 도시의 현재 날씨를
        실시간으로 조회하는 날씨 대시보드입니다.
      </p>
      <ul>
        <li>서울·수원·부산·제주의 현재 날씨를 Axios 병렬 요청으로 한 번에 조회</li>
        <li>한글 또는 영문 도시명을 검색해 새로운 국내외 도시 날씨 카드 추가</li>
        <li>Geocoding API를 이용해 검색한 도시의 좌표와 정확한 관측 지역 확인</li>
        <li>현재 기온, 날씨 상태, 습도, 풍속 등 실시간 상세 정보 제공</li>
        <li>섭씨·화씨 단위 변경과 관심 도시 즐겨찾기 기능 제공</li>
      </ul>
    </div>

    <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.description-box {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 14px;
}

ul {
  padding-left: 20px;
  margin: 8px 0 0 0;
}

li {
  margin-bottom: 6px;
  color: #555;
}

code {
  background-color: #ffeaa7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #d63031;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
