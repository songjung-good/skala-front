<script setup>
import { ref } from 'vue'

// v-midel Modifiers 실습용 reactive 변수 선언
const lazytText = ref('') // lazy modifier 실습용 변수
const age = ref('') // number modifier 실습용 변수
const userEmail = ref('') // trim modifier 실습용 변수
const price = ref('') // trim modifier 실습용 변수
</script>

<template>
  <div class="practice-section">
    <h3>v-model 수식어 (Modifiers) 활용</h3>
    <!-- 1) .lazy 수식어 실습-->
    <section style="margin-bottom: 20px">
      <h4>1) .lazy 수식어 (change 이벤트 시점 반영)</h4>
      <input type="text" v-model.lazy="lazytText" placeholder="입력 후 Enter 또는 외부 클릭" />
      <p>
        실시간이 아닌 확정된 값: <strong>{{ lazytText }}</strong>
      </p>
    </section>
    <!-- 2) .number 수식어 실습-->
    <section style="margin-bottom: 20px">
      <h4>2) .number 수식어 (Number 타입 자동 형변환)</h4>
      <input type="text" v-model.number="age" placeholder="나이를 입력하세요" />
      <p>
        입력된 값: <strong>{{ age }}</strong>
      </p>
      <p>
        데이터 타입: <strong>{{ typeof age }}</strong>
      </p>
    </section>
    <!-- 3) .trim 수식어 실습-->
    <section style="margin-bottom: 20px">
      <h4>3) .trim 수식어 (문자열 양쪽 공백 제거)</h4>
      <input type="text" v-model.trim="userEmail" placeholder="앞뒤 공백을 포함해서 입력해보세요" />
      <p>
        공백 제거된 값: <span>{{ userEmail }}</span>
      </p>
      <p>
        문자열 길이: <span>{{ userEmail.length }}</span>
      </p>
    </section>
    <!-- 4) 수식어 체이닝 (Chaining) 실습-->
    <section style="margin-bottom: 20px">
      <h4>4) Chaining (수식어 체이닝: .trim.number)</h4>
      <input
        type="text"
        v-model.trim.number="price"
        placeholder="공백과 숫자를 섞어 입력해 보세요"
      />
      <p>
        처리된 값: <strong>{{ price }}</strong>
      </p>
      <p>
        데이터 타입: <strong>{{ typeof price }}</strong>
      </p>
    </section>
  </div>
</template>
