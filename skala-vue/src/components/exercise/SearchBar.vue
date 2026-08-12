<script setup>
// 상위로 전달할 커스텀 이벤트 등록
const emit = defineEmits(['update-query', 'update-status'])

// 상위로부터 현재 검색어 및 날씨 필터 데이터 수신
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  statusOptions: {
    type: Array,
    default: () => ['전체', '맑음', '비', '구름', '흐림', '눈'],
  },
  selectedStatus: {
    type: String,
    default: '전체',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색 및 필터</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery || '전체' }}</strong>
    </p>

    <!-- 날씨 상태별 필터 버튼 목록 -->
    <div class="filter-group">
      <span class="filter-label">날씨 필터:</span>
      <button
        v-for="status in statusOptions"
        :key="status"
        type="button"
        class="btn-filter"
        :class="{ active: selectedStatus === status }"
        @click="emit('update-status', status)"
      >
        {{ status }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-inner h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
}
input {
  padding: 8px 12px;
  width: 90%;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
}
input:focus {
  border-color: #3498db;
}
p {
  margin-top: 8px;
  margin-bottom: 0;
  font-size: 14px;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}
.btn-filter {
  padding: 4px 10px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  background: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-filter:hover {
  background: #e9ecef;
}
.btn-filter.active {
  background: #2c3e50;
  color: #ffffff;
  border-color: #2c3e50;
}
</style>
