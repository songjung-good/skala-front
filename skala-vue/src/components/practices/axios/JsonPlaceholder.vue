<script setup>
import { ref } from 'vue'
import axios from 'axios'
// 💡 1. 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'
// 💡 2. 반응형 상태 데이터
const items = ref([]) // 서버에서 받아온 데이터 배열 박스
const textInput = ref('') // 입력창과 연결된 글자 데이터 박스
// ----------------------------------------------------
// [READ] GET : 데이터 가져오기
// ----------------------------------------------------
const handleRead = async () => {
  try {
    // 공부용으로 딱 3개만 들고 옵니다.
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
  } catch (error) {
    console.error('GET 실패:', error)
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>📮 JSONPlaceholder CRUD 실습</h2>
    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
      <input
        v-model="textInput"
        type="text"
        placeholder="텍스트 입력..."
        style="padding: 0.35rem 0.6rem; border-radius: 4px; border: 1px solid #cbd5e1;"
      />
      <button @click="handleRead">GET 데이터 가져오기 (3개)</button>
    </div>
    <ul v-if="items.length > 0" style="padding-left: 1.2rem; line-height: 1.6;">
      <li v-for="item in items" :key="item.id">
        <strong>[{{ item.id }}]</strong> {{ item.title }}
      </li>
    </ul>
  </div>
</template>
