<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  save: [name: string]
  close: []
}>()

const name = ref('')

function onSubmit(): void {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('save', trimmed)
  emit('close')
}
</script>

<template>
  <div class="save-overlay" @click.self="$emit('close')">
    <div class="save-dialog">
      <h3 class="save-dialog__title">Save Template</h3>
      <input
        ref="inputRef"
        v-model="name"
        type="text"
        class="save-dialog__input"
        placeholder="Template name..."
        autofocus
        @keyup.enter="onSubmit"
        @keyup.escape="$emit('close')"
      />
      <div class="save-dialog__actions">
        <button class="dialog-btn dialog-btn--cancel" @click="$emit('close')">Cancel</button>
        <button class="dialog-btn dialog-btn--save" :disabled="!name.trim()" @click="onSubmit">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.save-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.save-dialog {
  background: $color-surface;
  border-radius: 12px;
  padding: 24px;
  width: 340px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: $color-text;
    margin-bottom: 16px;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid $color-border;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease;

    &:focus {
      border-color: $color-primary;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;

  &--cancel {
    color: $color-text-secondary;
    border: 1px solid $color-border;

    &:hover {
      background: $color-bg;
    }
  }

  &--save {
    background: $color-primary;
    color: #fff;
    border: none;

    &:hover:not(:disabled) {
      background: $color-primary-hover;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
