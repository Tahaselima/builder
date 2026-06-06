<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores'
import CanvasElement from './CanvasElement.vue'
import { ELEMENT_DEFAULT_SIZE, clampPosition, snapPosition } from '@/utils'
import { useCanvasStyle } from '@/composables'
import type { ElementType } from '@/types'

const editor = useEditorStore()
const canvasRef = ref<HTMLElement | null>(null)
const { canvasStyle } = useCanvasStyle(() => editor.canvas)

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  if (!event.dataTransfer || !canvasRef.value) return

  const type = event.dataTransfer.getData('application/element-type') as ElementType
  if (!type) return

  const rect = canvasRef.value.getBoundingClientRect()
  const elSize = ELEMENT_DEFAULT_SIZE[type] ?? { width: 100, height: 40 }

  // Center element on cursor, then clamp within canvas bounds
  let rawX = event.clientX - rect.left - elSize.width / 2
  let rawY = event.clientY - rect.top - elSize.height / 2

  if (editor.gridEnabled) {
    const snapped = snapPosition({ x: rawX, y: rawY }, editor.gridSize)
    rawX = snapped.x
    rawY = snapped.y
  }

  const position = clampPosition({ x: rawX, y: rawY }, elSize, editor.canvas)

  editor.addElement(type, position)
}

function onCanvasClick(): void {
  editor.selectElement(null)
}
</script>

<template>
  <main class="canvas-area" @click.self="onCanvasClick">
    <div
      ref="canvasRef"
      class="canvas-area__canvas"
      :style="canvasStyle"
      @dragover="onDragOver"
      @drop="onDrop"
      @click.self="onCanvasClick"
    >
      <CanvasElement
        v-for="el in editor.sortedElements"
        :key="el.id"
        :element="el"
      />
      <div
        v-if="editor.gridEnabled"
        class="canvas-area__grid-overlay"
        :style="{
          backgroundSize: editor.gridSize + 'px ' + editor.gridSize + 'px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)'
        }"
      />
      <p v-if="editor.elements.length === 0" class="canvas-area__placeholder">
        Drag elements here
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/variables' as *;

.canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color.adjust($color-bg, $lightness: -2%);
  overflow: auto;
  padding: 24px;

  &__canvas {
    position: relative;
    border: 2px dashed $color-border;
    flex-shrink: 0;
    transition: border-color 0.15s ease, border-radius 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      border-color: color.adjust($color-primary, $lightness: 30%);
    }
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-text-secondary;
    font-size: 14px;
    pointer-events: none;
    opacity: 0.6;
  }

  &__grid-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    border-radius: inherit;
  }
}
</style>
