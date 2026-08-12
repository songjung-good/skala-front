<script setup>
defineProps({
  statusMessage: {
    type: String,
    default: '카드를 클릭하거나 검색해 보세요.',
  },
})
</script>

<template>
  <div class="status-bar">
    {{ statusMessage }}
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
