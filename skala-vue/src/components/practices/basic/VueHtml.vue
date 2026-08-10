<script setup>
const rawHtmlData = `이 글자는 <span style="color: red; font-weight: bold;">빨간색 굵은 글자</span>이다.`
</script>
<template>
  <div class="practice-section">
    <h3>v-html 디렉티브 학습</h3>
    <h4>일반 보간법 {{}} 사용 결과:</h4>
    <p>{{ rawHtmlData }}</p>
    <br />
    <h4>v-html 디렉티브 사용 결과:</h4>
    <p v-html="rawHtmlData"></p>
  </div>
</template>
