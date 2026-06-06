<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import ShortcutsModal from './ShortcutsModal.vue'

const editor = useEditorStore()
const showShortcuts = ref(false)
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

      <button
        class="btn btn--icon"
        title="Keyboard Shortcuts"
        @click="showShortcuts = true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/>
          <path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/>
          <path d="M7 16h10"/>
        </svg>
      </button>
    </div>
  </header>

  <ShortcutsModal
    v-if="showShortcuts"
    @close="showShortcuts = false"
  />
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
