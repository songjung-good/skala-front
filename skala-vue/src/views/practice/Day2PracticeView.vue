<script setup>
import VuePre from '@/components/practices/basic/VuePre.vue'
import VueCloak from '@/components/practices/basic/VueCloak.vue'
import VueOnce from '@/components/practices/basic/VueOnce.vue'
import VueMemo from '@/components/practices/basic/VueMemo.vue'

import EventHandlerVon from '@/components/practices/basic/EventHandlerVon.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'

import FormElementsHandling from '@/components/practices/basic/FormElementsHandling.vue'
import FormModifier from '@/components/practices/basic/FormModifier.vue'

import VueStyle from '@/components/practices/basic/VueStyle.vue'

import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveExercise from '@/components/practices/composition/ReactiveExercise.vue'
</script>

<template>
  <div class="practice-content">
    <h2>2일차: 고급 디렉티브 & 이벤트 / 폼 바인딩</h2>
    <hr />
    <section>
      <h3>2. Vue Directive (추가)</h3>
      <div class="card">
        <h4>2-11. v-pre 디렉티브</h4>
        <VuePre />
        <h4>2-12. v-cloak 디렉티브</h4>
        <VueCloak />
        <h4>2-13. v-once 디렉티브</h4>
        <VueOnce />
        <h4>2-14. v-memo 디렉티브</h4>
        <VueMemo />
      </div>

      <div class="card">
        <h4>2-15. v-on 디렉티브 (이벤트 핸들러)</h4>
        <EventHandlerVon />
        <h4>2-16. v-on 디렉티브 (이벤트 객체)</h4>
        <EventObject />
        <h4>2-17. v-on 디렉티브 (이벤트 수정자)</h4>
        <EventModifier />
      </div>

      <div class="card">
        <h4>2-18. Form Data Binding (요소 핸들링)</h4>
        <FormElementsHandling />
        <h4>2-19. Form Data Binding (v-model 수식어)</h4>
        <FormModifier />
        <h4>2-20. Scoped 스타일 및 외부 CSS 활용</h4>
        <VueStyle />
      </div>
    </section>

    <h3>3. Reactive State</h3>
    <div class="card">
      <h4>3-1. Ref</h4>
      <ReactiveRef />
      <h4>3-2. Reactive</h4>
      <ReactiveExercise />
    </div>
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
