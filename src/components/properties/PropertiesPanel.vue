<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'

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
          <BaseIcon name="trash" :size="16" />
        </button>
      </div>

      <div class="properties-panel__body">
        <p class="properties-panel__hint">Properties will be editable here.</p>
      </div>
    </template>

    <div v-else class="properties-panel__empty">
      <BaseIcon name="help" :size="40" :stroke-width="1.5" />
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

    svg {
      opacity: 0.3;
    }
  }
}
</style>
