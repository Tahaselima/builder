<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'

const editor = useEditorStore()

const typeLabels: Record<string, string> = {
  heading: 'Heading',
  text: 'Text',
  button: 'Button',
  image: 'Image',
  divider: 'Divider'
}
</script>

<template>
  <aside class="properties-panel">
    <template v-if="editor.selectedElement">
      <div class="properties-panel__header">
        <h2 class="properties-panel__title">
          {{ typeLabels[editor.selectedElement.type] || editor.selectedElement.type }} Properties
        </h2>
        <button
          class="properties-panel__delete"
          title="Delete element"
          @click="editor.removeElement(editor.selectedElement!.id)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div class="properties-panel__body">
        <p class="properties-panel__hint">Properties will be editable here.</p>
      </div>
    </template>

    <div v-else class="properties-panel__empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <p>Select an element on the canvas to edit its properties.</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.properties-panel {
  width: $panel-width;
  background: $color-surface;
  border-left: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 12px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: $color-text;
  }

  &__delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: $color-text-secondary;
    transition: all 0.15s ease;

    &:hover {
      background: #fef2f2;
      color: $color-danger;
    }
  }

  &__body {
    padding: 16px;
  }

  &__hint {
    font-size: 13px;
    color: $color-text-secondary;
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px 20px;
    text-align: center;

    p {
      font-size: 13px;
      color: $color-text-secondary;
      line-height: 1.5;
    }
  }
}
</style>
