<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'

const editor = useEditorStore()
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <h1 class="app-header__title">Template Builder</h1>
    </div>

    <div class="app-header__right">
      <div class="app-header__history">
        <button
          class="btn btn--icon"
          :disabled="!editor.canUndo"
          title="Undo (Ctrl+Z)"
          @click="editor.undo()"
        >
          <BaseIcon name="undo" />
        </button>
        <button
          class="btn btn--icon"
          :disabled="!editor.canRedo"
          title="Redo (Ctrl+Y)"
          @click="editor.redo()"
        >
          <BaseIcon name="redo" />
        </button>
      </div>

      <div class="app-header__canvas-color">
        <label class="app-header__color-label" for="canvas-bg">Canvas BG</label>
        <input
          id="canvas-bg"
          type="color"
          :value="editor.canvas.backgroundColor"
          @input="editor.canvas.backgroundColor = ($event.target as HTMLInputElement).value"
        />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 20px;
  background: $color-surface;
  border-bottom: 1px solid $color-border;
  flex-shrink: 0;

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $color-text;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__history {
    display: flex;
    gap: 4px;
  }

  &__canvas-color {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__color-label {
    font-size: 12px;
    color: $color-text-secondary;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: $color-text-secondary;
  transition: all 0.15s ease;

  &--icon {
    width: 32px;
    height: 32px;
    padding: 6px;

    &:hover:not(:disabled) {
      background: $color-bg;
      color: $color-text;
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }
}
</style>
