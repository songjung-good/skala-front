<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
  message.value = inputValue.value
}
</script>

<template>
  <div class="practice-section">
    <h3>v-html XSS 학습</h3>
    <input v-model="inputValue" placeholder="내용를 입력하세요" />
    <button @click="showMessage">확인</button>
    <div v-html="message"></div>
  </div>
</template>
