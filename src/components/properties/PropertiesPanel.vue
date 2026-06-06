<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import PropertiesEditor from './PropertiesEditor.vue'
import type { CanvasElement } from '@/types'

const editor = useEditorStore()

const typeLabels: Record<string, string> = {
  heading: 'Heading',
  text: 'Text',
  button: 'Button',
  image: 'Image',
  divider: 'Divider'
}

function onUpdate(payload: Partial<CanvasElement>): void {
  if (!editor.selectedElement) return

  // Divider: thickness değişirse size.height da güncelle
  if ('thickness' in payload && editor.selectedElement.type === 'divider') {
    const thickness = (payload as Record<string, unknown>).thickness as number
    payload.size = {
      width: editor.selectedElement.size.width,
      height: thickness + 8 // padding for selection outline
    }
  }

  editor.updateElement(editor.selectedElement.id, payload)
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
        <!-- Z-Index Controls -->
        <div class="properties-panel__layer">
          <span class="properties-panel__layer-label">Layer</span>
          <div class="properties-panel__layer-actions">
            <button
              class="layer-btn"
              title="Bring Forward"
              @click="editor.bringToFront(editor.selectedElement!.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
              Forward
            </button>
            <button
              class="layer-btn"
              title="Send Backward"
              @click="editor.sendToBack(editor.selectedElement!.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>
              Backward
            </button>
          </div>
        </div>

        <div class="properties-panel__divider" />

        <!-- Dynamic Property Fields -->
        <PropertiesEditor
          :element="editor.selectedElement"
          @update="onUpdate"
        />
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
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__layer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__layer-label {
    font-size: 11px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__layer-actions {
    display: flex;
    gap: 4px;
  }

  &__divider {
    height: 1px;
    background: $color-border;
    margin: 2px 0;
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

.layer-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: $color-text-secondary;
  border: 1px solid $color-border;
  transition: all 0.15s ease;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: #eef2ff;
  }
}
</style>
