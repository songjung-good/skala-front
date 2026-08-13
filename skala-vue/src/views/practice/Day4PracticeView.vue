<script setup>
import OpenWeatherMap from '@/components/practices/axios/OpenWeatherMap.vue'
import JsonPlaceholder from '@/components/practices/axios/JsonPlaceholder.vue'

defineOptions({
  name: 'Day4PracticeView',
})
</script>

<template>
  <div class="practice-container">
    <h1>4일차 실습: Axios 비동기 데이터 통신</h1>
    <hr />
    <OpenWeatherMap />
    <hr />
    <JsonPlaceholder />
  </div>
</template>
