<script setup lang="ts">
import { useEditorStore } from '@/stores'
import { BaseModal, ElementRenderer } from '@/components'
import { useCanvasStyle } from '@/composables'

const editor = useEditorStore()

defineEmits<{ close: [] }>()

const { canvasStyle } = useCanvasStyle(() => editor.canvas)
</script>

<template>
  <BaseModal title="Preview" width="auto" position="center" @close="$emit('close')">
    <div class="preview-canvas" :style="canvasStyle">
      <ElementRenderer
        v-for="el in editor.sortedElements"
        :key="el.id"
        :element="el"
      />
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.preview-canvas {
  position: relative;
  overflow: hidden;
}
</style>
