<script setup>
import { ref } from 'vue'

const message = ref('안녕하세요')
</script>

<template>
  <div class="practice-section">
    <h3>v-pre 디렉티브 학습</h3>
    <p>일반 출력: {{ message }}</p>
    <p v-pre>v-pre 출력: {{ message }}</p>
  </div>
</template>
