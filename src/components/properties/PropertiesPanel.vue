<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import PropertiesEditor from './PropertiesEditor.vue'
import { ELEMENT_TYPE_LABELS } from '@/utils/elementDefaults'
import type { ElementUpdate } from '@/types'

const editor = useEditorStore()

function onUpdate(payload: ElementUpdate): void {
  if (!editor.selectedElement) return
  editor.updateElement(editor.selectedElement.id, payload)
}
</script>

<template>
  <aside class="properties-panel">
    <template v-if="editor.selectedElement">
      <div class="properties-panel__header">
        <h2 class="properties-panel__title">
          {{ ELEMENT_TYPE_LABELS[editor.selectedElement.type] || editor.selectedElement.type }} Properties
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
        <div class="properties-panel__layer">
          <span class="properties-panel__layer-label">Layer</span>
          <div class="properties-panel__layer-actions">
            <button
              class="layer-btn"
              title="Bring Forward"
              @click="editor.bringToFront(editor.selectedElement!.id)"
            >
              <BaseIcon name="layerUp" :size="14" />
              Forward
            </button>
            <button
              class="layer-btn"
              title="Send Backward"
              @click="editor.sendToBack(editor.selectedElement!.id)"
            >
              <BaseIcon name="layerDown" :size="14" />
              Backward
            </button>
          </div>
        </div>

        <div class="properties-panel__divider" />

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
@use '@/styles/buttons' as *;
@use '@/styles/panels' as *;

.properties-panel {
  @include panel-left;
  width: $panel-width;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-panel $padding-panel 12px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: $color-text;
  }

  &__delete {
    @extend .btn-icon--md;
    @extend .btn-icon--danger;
  }

  &__body {
    padding: $padding-panel;
    display: flex;
    flex-direction: column;
    gap: $gap-form;
  }

  &__layer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__layer-label {
    @include section-heading;
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
</style>
