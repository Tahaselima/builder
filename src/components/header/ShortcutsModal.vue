<script setup lang="ts">
defineEmits<{
  close: []
}>()

interface Shortcut {
  keys: string
  action: string
}

const shortcuts: Shortcut[] = [
  { keys: 'Delete / ⌫', action: 'Delete selected element' },
  { keys: 'Escape', action: 'Deselect element' },
  { keys: 'Arrow keys', action: 'Nudge element 1px' },
  { keys: 'Shift + Arrow', action: 'Nudge element 10px' },
  { keys: 'Ctrl/⌘ + Z', action: 'Undo' },
  { keys: 'Ctrl/⌘ + Shift + Z', action: 'Redo' },
  { keys: 'Ctrl/⌘ + Y', action: 'Redo' }
]
</script>

<template>
  <div class="shortcuts-overlay" @click.self="$emit('close')">
    <div class="shortcuts-modal">
      <div class="shortcuts-modal__header">
        <h3 class="shortcuts-modal__title">Keyboard Shortcuts</h3>
        <button class="shortcuts-modal__close" @click="$emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="shortcuts-modal__body">
        <div v-for="(s, i) in shortcuts" :key="i" class="shortcut-row">
          <span class="shortcut-row__keys">
            <kbd v-for="key in s.keys.split(' + ')" :key="key">{{ key }}</kbd>
          </span>
          <span class="shortcut-row__action">{{ s.action }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.shortcuts-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  padding: 68px 24px 0 0;
  z-index: 1000;
}

.shortcuts-modal {
  background: $color-surface;
  border-radius: 12px;
  width: 320px;
  height: max-content;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $color-text;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: $color-text-secondary;
    transition: all 0.15s ease;

    &:hover {
      background: $color-bg;
      color: $color-text;
    }
  }

  &__body {
    padding: 12px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &__keys {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  &__action {
    font-size: 12px;
    color: $color-text-secondary;
    text-align: right;
  }
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  color: $color-text;
  background: $color-bg;
  border: 1px solid $color-border;
  border-radius: 4px;
  line-height: 1.4;
}
</style>
