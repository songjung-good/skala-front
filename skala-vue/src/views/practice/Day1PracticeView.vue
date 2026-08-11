<script setup>
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'

import VueHtml from '@/components/practices/basic/VueHtml.vue'
import VueHtmlXss from '@/components/practices/basic/VueHtmlXss.vue'
import VueText from '@/components/practices/basic/VueText.vue'

import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'

import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'

import VueFor from '@/components/practices/basic/VueFor.vue'
</script>

<template>
  <div class="practice-content">
    <h2>1일차: 반응형 데이터 및 기초 디렉티브</h2>
    <hr />
    <section>
      <h3>1. 반응형 데이터</h3>
      <div class="card">
        <h4>1-1. 일반 변수와 Vue 반응성 변수</h4>
        <SampleOne />
        <h4>1-2. Text Interpolation</h4>
        <SampleTwo />
      </div>
    </section>

    <section>
      <h3>2. Vue Directive</h3>
      <div class="card">
        <h4>2-1. v-html 디렉티브</h4>
        <VueHtml />
        <h4>2-2. v-html XSS 학습</h4>
        <VueHtmlXss />
        <h4>2-3. v-text 디렉티브</h4>
        <VueText />
      </div>

      <div class="card">
        <h4>2-4. v-bind 디렉티브</h4>
        <VueBind />
        <h4>2-5. v-bind 디렉티브 (클래스 바인딩)</h4>
        <VueBindClass />
        <h4>2-6. v-bind 디렉티브 (스타일 바인딩)</h4>
        <VueBindStyle />
        <h4>2-7. v-bind 디렉티브 (단축 문법)</h4>
        <VueBindShorthand />
      </div>

      <div class="card">
        <h4>2-8. v-if, v-else-if, v-else 디렉티브</h4>
        <VueIf />
        <h4>2-9. v-show 디렉티브</h4>
        <VueShow />
        <h4>2-10. v-for 디렉티브</h4>
        <VueFor />
      </div>
    </section>
  </div>
</template>

<style scoped>
.practice-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.card {
  background: var(--color-background-soft, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 0.75rem;
}
h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}
h4:first-of-type {
  margin-top: 0;
}
</style>
