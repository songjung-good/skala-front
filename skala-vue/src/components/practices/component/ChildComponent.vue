<script setup>
const emit = defineEmits(['childEvent'])

const sendToParent = () => {
  emit('childEvent', '안녕하세요, 부모 컴포넌트! (자식에서 전송된 이벤트)')
}
</script>

<template>
  <div class="child-box">
    <h4>Child Component</h4>
    <button @click="sendToParent" class="btn-child">부모에게 메시지 보내기</button>
  </div>
</template>

<style scoped>
.child-box {
  padding: 0.75rem;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  background: var(--color-background, #fff);
  margin-top: 0.5rem;
}
.btn-child {
  padding: 6px 12px;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 0.25rem;
}
.btn-child:hover {
  opacity: 0.9;
}
</style>
