<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
  <div class="practice-section">
    <h3>v-bind 디렉티브 기본 (축약형: 콜론)</h3>
    <h4>1) 동적 링크 연결</h4>
    <a :href="dynamicUrl">여기를 클릭하면 네이버로 이동합니다</a>
    <br />

    <h4>2) 동적 이미지 연결</h4>
    <img :src="logoImgSrc" alt="Vue 로고" style="width: 100px" />
    <br />

    <h4>3) 버튼 비활성화 제어</h4>
    <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>&nbsp;
    <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
  </div>
</template>
