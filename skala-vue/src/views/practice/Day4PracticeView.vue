<script setup>
import OpenWeatherMap from '@/components/practices/axios/OpenWeatherMap.vue'
import JsonPlaceholder from '@/components/practices/axios/JsonPlaceholder.vue'
import UserForm from '@/components/practices/axios/UserForm.vue'

defineOptions({
  name: 'Day4PracticeView',
})
</script>

<template>
  <div class="practice-container">
    <h1>4일차 실습: Axios 비동기 통신 & Element Plus</h1>
    <hr />
    <OpenWeatherMap />
    <hr />
    <JsonPlaceholder />
    <hr />
    <UserForm />
  </div>
</template>
