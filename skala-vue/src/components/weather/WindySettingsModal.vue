<script setup>
import { ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const emit = defineEmits(['close'])
const configStore = useConfigStore()

const apiKeyInput = ref(configStore.windyApiKey || '')
const saveMessage = ref('')

const handleSave = () => {
  configStore.setWindyApiKey(apiKeyInput.value.trim())
  saveMessage.value = 'Windy API 키 설정이 저장되었습니다.'
  setTimeout(() => {
    saveMessage.value = ''
    emit('close')
  }, 1000)
}

const handleClear = () => {
  apiKeyInput.value = ''
  configStore.setWindyApiKey('')
  saveMessage.value = 'API 키가 삭제되었습니다. 기본 Open-Meteo 실시간 데이터로 동작합니다.'
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-wrap">
          <span class="windy-logo">Windy</span>
          <h3>Windy API & 기상 엔진 설정</h3>
        </div>
        <button class="btn-close" @click="emit('close')" type="button">✕</button>
      </div>

      <div class="modal-body">
        <div class="info-banner">
          <p>
            현재 대시보드는 <strong>Windy 인터랙티브 레이더 맵</strong> 및 <strong>실시간 전세계 기상 API</strong>를 연동하여 동작하고 있습니다.
          </p>
        </div>

        <div class="form-group">
          <label for="apiKey">Windy Point Forecast API Key (선택 사항)</label>
          <input
            id="apiKey"
            type="password"
            v-model="apiKeyInput"
            placeholder="Windy API 키를 입력하세요 (예: api_...)"
            class="input-key"
          />
          <span class="help-text">
            * <a href="https://api.windy.com" target="_blank" rel="noopener">api.windy.com</a>에서 발급받은 키를 등록할 수 있습니다. 키가 없어도 실시간 무료 글로벌 기상 관측망을 통해 모든 날씨 및 지도가 100% 정상 작동합니다.
          </span>
        </div>

        <div v-if="saveMessage" class="save-toast">
          {{ saveMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="handleClear">키 초기화</button>
        <div class="footer-right">
          <button class="btn-cancel" @click="emit('close')">닫기</button>
          <button class="btn-save" @click="handleSave">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--color-background, #ffffff);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: popIn 0.2s ease-out;
  overflow: hidden;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.windy-logo {
  background: #ff5722;
  color: #fff;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 3px 6px;
  border-radius: 4px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.6;
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-banner {
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.85rem;
  color: var(--color-text);
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-heading);
}

.input-key {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background, #fff);
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
}

.input-key:focus {
  border-color: #ff5722;
}

.help-text {
  font-size: 0.76rem;
  color: var(--color-text);
  opacity: 0.7;
  line-height: 1.4;
}

.help-text a {
  color: #ff5722;
  text-decoration: underline;
}

.save-toast {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft, #f8f9fa);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-right {
  display: flex;
  gap: 0.5rem;
}

.btn-secondary {
  background: none;
  border: 1px solid var(--color-border);
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  color: #e74c3c;
  cursor: pointer;
}

.btn-cancel {
  background: none;
  border: 1px solid var(--color-border);
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  color: var(--color-text);
  cursor: pointer;
}

.btn-save {
  background: #ff5722;
  color: #fff;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:hover {
  background: #e64a19;
}
</style>
