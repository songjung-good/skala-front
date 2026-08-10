<script setup>
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'

import VueHtml from './components/practices/basic/VueHtml.vue'
import VueHtmlXss from './components/practices/basic/VueHtmlXss.vue'
import VueText from './components/practices/basic/VueText.vue'

import VueBind from './components/practices/basic/VueBind.vue'
import VueBindClass from './components/practices/basic/VueBindClass.vue'
import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'

import VueIf from './components/practices/basic/VueIf.vue'
import VueShow from './components/practices/basic/VueShow.vue'

import VueFor from './components/practices/basic/VueFor.vue'
</script>

<template>
  <div class="wrapper">
    <h1>1. 반응형 데이터</h1>
    <hr />
    <div style="padding: 20px">
      <h2>1-1. 일반 변수와 Vue 반응성 변수</h2>
      <SampleOne />
      <br />
      <h2>1-2. Text Interpolation</h2>
      <SampleTwo />
    </div>

    <h1>2. Vue Directive</h1>
    <hr />
    <div style="padding: 20px">
      <h2>2-1. v-html 디렉티브</h2>
      <VueHtml />
      <br />
      <h2>2-2. v-html XSS 학습</h2>
      <VueHtmlXss />
      <br />
      <h2>2-3. v-text 디렉티브</h2>
      <VueText />
      <br />
    </div>
    <div style="padding: 20px">
      <h2>2-4. v-bind 디렉티브</h2>
      <VueBind />
      <br />
      <h2>2-5. v-bind 디렉티브 (클래스 바인딩)</h2>
      <VueBindClass />
      <br />
      <h2>2-6. v-bind 디렉티브 (스타일 바인딩)</h2>
      <VueBindStyle />
      <br />
      <h2>2-7. v-bind 디렉티브 (단축 문법)</h2>
      <VueBindShorthand />
      <br />
    </div>
    <div style="padding: 20px">
      <h2>2-8. v-if, v-else-if, v-else 디렉티브</h2>
      <VueIf />
      <br />
      <h2>2-9. v-show 디렉티브</h2>
      <VueShow />
      <br />
      <h2>2-10. v-for 디렉티브</h2>
      <VueFor />
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
