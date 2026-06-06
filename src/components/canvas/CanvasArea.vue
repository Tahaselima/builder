<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import CanvasElement from '@/components/canvas/CanvasElement.vue'
import { ELEMENT_DEFAULT_SIZE, DEFAULT_CANVAS } from '@/utils/elementDefaults'
import { clampPosition } from '@/utils/canvas'
import type { ElementType } from '@/types'

const editor = useEditorStore()
const canvasRef = ref<HTMLElement | null>(null)

function canvasStyle() {
  const c = editor.canvas
  const shadow: number = c.boxShadow ?? DEFAULT_CANVAS.boxShadow!
  const shadowOpacity: number = c.boxShadowOpacity ?? DEFAULT_CANVAS.boxShadowOpacity!
  const radius: number = c.borderRadius ?? DEFAULT_CANVAS.borderRadius!
  return {
    width: c.width + 'px',
    height: c.height + 'px',
    backgroundColor: c.backgroundColor,
    borderRadius: radius + 'px',
    boxShadow: `0 ${shadow}px ${shadow * 6}px rgba(0, 0, 0, ${shadowOpacity})`
  }
}

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
  const rawX = event.clientX - rect.left - elSize.width / 2
  const rawY = event.clientY - rect.top - elSize.height / 2

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
      :style="canvasStyle()"
      @dragover="onDragOver"
      @drop="onDrop"
      @click.self="onCanvasClick"
    >
      <CanvasElement
        v-for="el in editor.sortedElements"
        :key="el.id"
        :element="el"
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
}
</style>
