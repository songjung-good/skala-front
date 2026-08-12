<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found-container">
    <h2>404</h2>
    <p>요청하신 페이지를 찾을 수 없습니다.</p>
    <button @click="router.push('/')" class="btn-home">메인 화면으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found-container {
  text-align: center;
  padding: 80px 20px;
}
h2 {
  font-size: 4rem;
  font-weight: 800;
  color: #e74c3c;
  margin: 0;
}
p {
  font-size: 1.1rem;
  color: #666;
  margin: 15px 0 25px;
}
.btn-home {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>
