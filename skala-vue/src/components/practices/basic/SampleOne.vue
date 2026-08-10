<script setup>
import { ref } from 'vue'

// 1. 일반 변수 (실시간으로 바뀌지 않음)
let normalCount = 0
// 2. 반응형 변수 (실시간으로 바뀜)
const vueCount = ref(0)
</script>
<template>
  <div class="practice-section">
    <h3>Hello Skala-Vue</h3>
    <h4>일반 변수 클릭: {{ normalCount }}</h4>
    <button @click="normalCount++">일반 변수 증가</button>
    <br />
    <h4>Vue 반응성 변수 클릭: {{ vueCount }}</h4>
    <button @click="vueCount++">Vue 변수 증가</button>
  </div>
</template>
