<script setup lang="ts">
import type { ElementType } from '@/types'
import BaseIcon from '@/components/icon/BaseIcon.vue'

defineProps<{
  type: ElementType
  label: string
  iconName: string
}>()

function onDragStart(event: DragEvent, type: ElementType): void {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/element-type', type)
  event.dataTransfer.effectAllowed = 'copy'
}
</script>

<template>
  <div
    class="palette-item"
    draggable="true"
    @dragstart="onDragStart($event, type)"
  >
    <span class="palette-item__icon">
      <BaseIcon :name="iconName" />
    </span>
    <span class="palette-item__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: $color-bg;
  border: 1px solid $color-border;
  cursor: grab;
  transition: all 0.15s ease;
  user-select: none;

  &:hover {
    border-color: $color-primary;
    background: #eef2ff;
  }

  &:active {
    cursor: grabbing;
    opacity: 0.7;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: $color-primary;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: $color-text;
  }
}
</style>
