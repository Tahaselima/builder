<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseIcon } from '@/components'
import AiKeyModal from './AiKeyModal.vue'
import { useEditorStore, useTemplatesStore } from '@/stores'
import { generateTemplate, hasApiKey, getApiKey } from '@/utils'

const editor = useEditorStore()
const templates = useTemplatesStore()

const emit = defineEmits<{
  close: []
}>()

const importInput = ref<HTMLInputElement | null>(null)
const importError = ref<string | null>(null)
const aiPrompt = ref('')
const aiError = ref<string | null>(null)
const aiLoading = ref(false)
const showAiKeyModal = ref(false)
const showAiForm = ref(false)

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

function onAIClick(): void {
  if (!hasApiKey()) {
    showAiKeyModal.value = true
    return
  }
  showAiForm.value = true
}

async function onAIGenerate(): Promise<void> {
  if (!aiPrompt.value.trim()) return
  aiError.value = null
  aiLoading.value = true

  try {
    const template = await generateTemplate({
      prompt: aiPrompt.value.trim(),
      apiKey: getApiKey()
    })
    editor.loadElements([...template.elements], { ...template.canvas })
    emit('close')
  } catch (e) {
    aiError.value = e instanceof Error ? e.message : 'AI generation failed'
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <BaseModal title="New Template" width="340px" position="center" @close="$emit('close')">
    <!-- Default options view -->
    <template v-if="!showAiForm">
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

        <button class="new-option" @click="onAIClick">
          <div class="new-option__icon new-option__icon--ai">
            <BaseIcon name="settings" :size="24" />
          </div>
          <div class="new-option__info">
            <span class="new-option__title">AI Generate</span>
            <span class="new-option__desc">Describe your template</span>
          </div>
        </button>
      </div>

      <p v-if="importError" class="new-options__error">{{ importError }}</p>
    </template>

    <!-- AI prompt form -->
    <template v-else>
      <div class="ai-form">
        <textarea
          v-model="aiPrompt"
          class="form-input form-input--textarea"
          placeholder="Describe the template you want... e.g. 'A pricing card with 3 tiers'"
          rows="3"
          autofocus
          @keydown.ctrl.enter="onAIGenerate"
          @keydown.meta.enter="onAIGenerate"
        />
        <div class="ai-form__actions">
          <button class="btn-secondary" @click="showAiForm = false">Back</button>
          <button
            class="btn-primary"
            :disabled="!aiPrompt.trim() || aiLoading"
            @click="onAIGenerate"
          >
            {{ aiLoading ? 'Generating...' : 'Generate' }}
          </button>
        </div>
        <p v-if="aiError" class="new-options__error">{{ aiError }}</p>
      </div>
    </template>

    <input
      ref="importInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onImport"
    />
  </BaseModal>

  <AiKeyModal
    v-if="showAiKeyModal"
    @close="showAiKeyModal = false"
  />
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/forms' as *;

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
      background: linear-gradient(135deg, $color-primary, $color-accent-purple);
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

.ai-form {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
