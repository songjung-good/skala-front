<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const receivedMessage = ref('')

const handleChildEvent = (message) => {
  console.log('자식으로부터 받은 메시지:', message)
  receivedMessage.value = message
}
</script>

<template>
  <div class="parent-box">
    <h3>Parent Component</h3>
    <p v-if="receivedMessage" class="received-text">
      📩 자식 메시지 수신: <strong>{{ receivedMessage }}</strong>
    </p>
    <ChildComponent @childEvent="handleChildEvent" />
  </div>
</template>

<style scoped>
.parent-box {
  padding: 1rem;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 8px;
  background: var(--color-background-soft, #f9f9f9);
  margin-top: 0.5rem;
}
.received-text {
  margin-bottom: 0.5rem;
  color: #42b883;
  font-weight: 600;
}
</style>
