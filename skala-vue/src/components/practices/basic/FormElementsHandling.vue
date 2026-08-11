<script setup>
import { ref } from 'vue'
const comment = ref('') // 댓글 입력용 변수
const isAgreed = ref(false) // 동의 체크용 변수
const favoriteFruits = ref([]) // 다중체크박스는 반드시 배열로 시작
const gender = ref('') // 라디오 버튼은 단일 값으로 시작
const selectedCar = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>모든 HTML Form 요소와 v-model 매핑</h2>
    <div>
      <h3>1) Textarea (장문 텍스트)</h3>
      <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
      <p>
        데이터 상태: <span>{{ comment }}</span>
      </p>
    </div>
    <div>
      <h3>2) 단일 Checkbox (동의 여부)</h3>
      <label> <input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다 </label>
    </div>
    <div>
      <h3>3) 다중 Checkbox (복수 선택 > 배열에 저장)</h3>
      <label> <input type="checkbox" v-model="favoriteFruits" value="사과" /> 사과 </label>
      <label> <input type="checkbox" v-model="favoriteFruits" value="바나나" /> 바나나 </label>
      <label> <input type="checkbox" v-model="favoriteFruits" value="딸기" /> 딸기 </label>
    </div>
    <p>
      데이터 상태: <span>{{ favoriteFruits }}</span>
    </p>
    <div>
      <h3>4) Radio (단일 선택)</h3>
      <label> <input type="radio" v-model="gender" value="남성" /> 남성 </label>
      <label> <input type="radio" v-model="gender" value="여성" /> 여성 </label>
    </div>
    <p>
      데이터 상태: <span>{{ gender }}</span>
    </p>
    <div>
      <h3>5) Select (단일 선택)</h3>
      <select v-model="selectedCar">
        <option value="">선택하세요</option>
        <option value="현대">현대</option>
        <option value="기아">기아</option>
        <option value="테슬라">테슬라</option>
      </select>
      <p>
        데이터 상태: <span>{{ selectedCar }}</span>
      </p>
    </div>
  </div>
</template>
