<script setup>
import { ref } from 'vue'
const count = ref(0)

function handleClick() {
  alert('함수가 호출되었습니다!')
}
</script>

<template>
  <div class="practice-section">
    <h3>v-on 이벤트 핸들링 기초</h3>
    <h4>1) 인라인 연산 처리</h4>
    <p>현재 카운트: {{ count }}</p>
    <button @click="count++">1씩 증가</button>
    <br />
    <h4>2) 스크립트 함수 호출</h4>
    <button @click="handleClick">알림창 띄우기</button>
  </div>
</template>
