<script setup lang="ts">
import { BaseModal } from '@/components'

interface Shortcut {
  keys: string
  action: string
}

const shortcuts: Shortcut[] = [
  { keys: 'Delete / ⌫', action: 'Delete selected element' },
  { keys: 'Escape', action: 'Deselect element' },
  { keys: 'Arrow keys', action: 'Nudge element 1px' },
  { keys: 'Shift + Arrow', action: 'Nudge element 10px' },
  { keys: 'Ctrl/⌘ + C', action: 'Copy selected element' },
  { keys: 'Ctrl/⌘ + V', action: 'Paste copied element' },
  { keys: 'Ctrl/⌘ + D', action: 'Duplicate selected element' },
  { keys: 'G', action: 'Toggle grid snap' },
  { keys: 'Ctrl/⌘ + Z', action: 'Undo' },
  { keys: 'Ctrl/⌘ + Shift + Z', action: 'Redo' },
  { keys: 'Ctrl/⌘ + Y', action: 'Redo' }
]
</script>

<template>
  <BaseModal title="Keyboard Shortcuts" width="320px" @close="$emit('close')">
    <div v-for="(s, i) in shortcuts" :key="i" class="shortcut-row">
      <span class="shortcut-row__keys">
        <kbd v-for="key in s.keys.split(' + ')" :key="key">{{ key }}</kbd>
      </span>
      <span class="shortcut-row__action">{{ s.action }}</span>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

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
