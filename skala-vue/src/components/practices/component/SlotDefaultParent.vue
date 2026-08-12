<script setup>
import SlotDefaultChild from '@/components/practices/component/SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>
    <!-- Slot 사이에 데이터가 있음 -->
    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>
    <SlotDefaultChild>
      <h2 style="color: #e74c3c">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>
    <!-- Slot 사이에 데이터가 없음, Child에서 넘어온 값으로 적용 -->
    <SlotDefaultChild> </SlotDefaultChild>
  </div>
</template>
