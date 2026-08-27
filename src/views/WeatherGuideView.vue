<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="guide-container">
    <h3>📖 날씨 대시보드 이용 안내</h3>

    <el-steps direction="vertical" :active="3" finish-status="success">
      <el-step title="도시 검색" description="검색창에 서울, 수원, 부산 또는 제주를 입력합니다." />
      <el-step title="날씨 확인" description="실시간 기온과 날씨 상태를 확인합니다." />
      <el-step title="상세 정보" description="상세보기에서 습도와 풍속을 확인합니다." />
    </el-steps>

    <el-button type="primary" @click="router.push({ name: 'weather-home' })">
      대시보드로 돌아가기
    </el-button>
  </section>
</template>

<style scoped>
.guide-container {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
}

.el-steps {
  height: 240px;
  margin: 24px 0;
}
</style>
