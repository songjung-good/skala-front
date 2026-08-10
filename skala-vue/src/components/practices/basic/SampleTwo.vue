<script setup>
import { ref } from 'vue'

// Text Interpolation
const welcomeMessage = ref('Hello Skala-Vue')
</script>
<template>
  <div class="practice-section">
    <h3>{{ welcomeMessage }}</h3>
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
  </div>
</template>
