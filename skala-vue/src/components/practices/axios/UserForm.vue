<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 1. 회원가입 폼 상태
const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}

// 2. 수량 카운터 및 별점
const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)

// 3. 다운로드 프로그레스
const downloadProgress = ref(0)
const isDownloading = ref(false)

const startDownload = () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadProgress.value = 0
  const interval = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(interval)
      isDownloading.value = false
      ElMessage.success('📥 파일 다운로드가 완료되었습니다!')
    }
  }, 300)
}

// 4. 삭제 확인 모달
const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
      ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}
</script>

<template>
  <div class="practice-section">
    <h2>🧩 Element Plus 컴포넌트 & 피드백 실습</h2>

    <!-- 1. 회원가입 폼 -->
    <div class="demo-card">
      <h3>1. 회원가입 폼 검증 (ElMessage)</h3>
      <div class="form-row">
        <el-input
          v-model="userForm.email"
          placeholder="이메일을 입력하세요 (예: user@test.com)"
          style="max-width: 320px;"
          clearable
        />
        <el-checkbox v-model="userForm.agree">이용약관 동의</el-checkbox>
        <el-button type="primary" @click="handleRegister">가입 신청</el-button>
      </div>
    </div>

    <!-- 2. 수량 및 별점 -->
    <div class="demo-card">
      <h3>2. 수량 카운터 & 별점 평가 (InputNumber / Rate)</h3>
      <div class="interactive-row">
        <div class="item-group">
          <span>구매 수량:</span>
          <el-input-number v-model="productQuantity" :min="1" :max="99" />
        </div>
        <div class="item-group">
          <span>상품 만족도:</span>
          <el-rate v-model="productRate" show-score text-color="#ff9900" />
        </div>
      </div>
    </div>

    <!-- 3. 프로그레스 바 & 다운로드 -->
    <div class="demo-card">
      <h3>3. 다운로드 진행률 (Progress)</h3>
      <div class="progress-box">
        <el-progress :percentage="downloadProgress" :status="downloadProgress === 100 ? 'success' : ''" />
        <el-button
          type="success"
          :disabled="isDownloading"
          @click="startDownload"
          style="margin-top: 0.5rem;"
        >
          {{ isDownloading ? '다운로드 중...' : '다운로드 시작' }}
        </el-button>
      </div>
    </div>

    <!-- 4. 확인 팝업 모달 -->
    <div class="demo-card">
      <h3>4. 위험 작업 확인 팝업 (ElMessageBox)</h3>
      <el-button type="danger" @click="confirmDelete">🗑️ 영구 삭제 실행</el-button>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.demo-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.form-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.interactive-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.item-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
}

.progress-box {
  max-width: 400px;
}
</style>
