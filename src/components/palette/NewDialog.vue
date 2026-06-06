<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import { useEditorStore } from '@/stores/editor'
import { useTemplatesStore } from '@/stores/templates'

const editor = useEditorStore()
const templates = useTemplatesStore()

const emit = defineEmits<{
  close: []
}>()

const importInput = ref<HTMLInputElement | null>(null)
const importError = ref<string | null>(null)

function onBlank(): void {
  editor.clearCanvas()
  emit('close')
}

function triggerImport(): void {
  importInput.value?.click()
}

async function onImport(): Promise<void> {
  if (!importInput.value?.files?.length) return
  const file = importInput.value.files[0]
  if (!file.name.endsWith('.json')) {
    importError.value = 'Please select a .json file'
    return
  }
  const result = await templates.importFromJson(file)
  if (result.success) {
    importError.value = null
    emit('close')
  } else {
    importError.value = result.error ?? 'Import failed'
  }
  if (importInput.value) importInput.value.value = ''
}

function onAI(): void {
  // TODO: AI-powered template generation
  alert('AI template generation coming soon!')
}
</script>

<template>
  <BaseModal title="New Template" width="340px" position="center" @close="$emit('close')">
    <div class="new-options">
      <button class="new-option" @click="onBlank">
        <div class="new-option__icon">
          <BaseIcon name="button" :size="24" />
        </div>
        <div class="new-option__info">
          <span class="new-option__title">Blank Canvas</span>
          <span class="new-option__desc">Start from scratch</span>
        </div>
      </button>

      <button class="new-option" @click="triggerImport">
        <div class="new-option__icon">
          <BaseIcon name="upload" :size="24" />
        </div>
        <div class="new-option__info">
          <span class="new-option__title">Import JSON</span>
          <span class="new-option__desc">Load from a file</span>
        </div>
      </button>

      <button class="new-option" @click="onAI">
        <div class="new-option__icon new-option__icon--ai">
          <BaseIcon name="settings" :size="24" />
        </div>
        <div class="new-option__info">
          <span class="new-option__title">AI Generate</span>
          <span class="new-option__desc">Coming soon</span>
        </div>
      </button>
    </div>

    <p v-if="importError" class="new-options__error">{{ importError }}</p>

    <input
      ref="importInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onImport"
    />
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.new-options {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__error {
    font-size: 11px;
    color: $color-danger;
    margin-top: 4px;
  }
}

.new-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid $color-border;
  background: $color-surface;
  cursor: pointer;
  text-align: left;
  transition: $transition-default;

  &:hover {
    border-color: $color-primary;
    background: $color-primary-light;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: $color-bg;
    color: $color-primary;
    flex-shrink: 0;

    &--ai {
      background: linear-gradient(135deg, $color-primary, #a855f7);
      color: $color-surface;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $color-text;
  }

  &__desc {
    font-size: 12px;
    color: $color-text-secondary;
  }
}
</style>
