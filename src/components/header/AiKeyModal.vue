<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { getApiKey, setApiKey } from '@/utils/ai'

defineEmits<{ close: [] }>()

const key = ref('')

onMounted(() => {
  key.value = getApiKey()
})

function onSave(): void {
  setApiKey(key.value.trim())
}
</script>

<template>
  <BaseModal title="AI Settings" width="380px" position="center" @close="$emit('close')">
    <div class="ai-key-settings">
      <label class="ai-key-settings__label">OpenAI API Key</label>
      <input
        v-model="key"
        type="password"
        class="form-input"
        placeholder="sk-..."
        @input="onSave"
      />
      <p class="ai-key-settings__hint">
        Your key is stored locally in your browser and never sent to our servers.
        It is used only to call OpenAI directly from your browser.
      </p>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/forms' as *;

.ai-key-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__hint {
    font-size: 11px;
    color: $color-text-secondary;
    line-height: 1.5;
  }
}
</style>
