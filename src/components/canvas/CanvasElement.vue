<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragMove } from '@/composables/useDragMove'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import type { CanvasElement as CanvasElementType } from '@/types'

const props = defineProps<{
  element: CanvasElementType
}>()

const editor = useEditorStore()

const isSelected = computed(() => editor.selectedElementId === props.element.id)

const { onMouseDown } = useDragMove(() => props.element.id)
</script>

<template>
  <div
    class="canvas-element"
    :class="{ 'canvas-element--selected': isSelected }"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex
    }"
    @mousedown="onMouseDown"
  >
    <!-- Heading -->
    <div
      v-if="element.type === 'heading'"
      class="canvas-element__content canvas-element__heading"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        textAlign: element.align
      }"
    >
      {{ element.content }}
    </div>

    <!-- Text -->
    <div
      v-else-if="element.type === 'text'"
      class="canvas-element__content canvas-element__text"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        textAlign: element.align
      }"
    >
      {{ element.content }}
    </div>

    <!-- Button -->
    <div
      v-else-if="element.type === 'button'"
      class="canvas-element__content canvas-element__button"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        backgroundColor: element.backgroundColor,
        borderRadius: element.borderRadius + 'px',
        textAlign: element.align
      }"
    >
      {{ element.content }}
    </div>

    <!-- Image -->
    <div v-else-if="element.type === 'image'" class="canvas-element__content canvas-element__image">
      <img
        v-if="element.src"
        :src="element.src"
        :alt="element.alt"
        class="canvas-element__img"
      />
      <div v-else class="canvas-element__image-placeholder">
        <BaseIcon name="image" :size="24" :stroke-width="1.5" />
      </div>
    </div>

    <!-- Divider -->
    <div
      v-else-if="element.type === 'divider'"
      class="canvas-element__content canvas-element__divider"
      :style="{
        backgroundColor: element.color,
        height: element.thickness + 'px'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/variables' as *;

.canvas-element {
  position: absolute;
  cursor: move;
  user-select: none;

  &--selected {
    outline: 2px solid $color-selected;
    outline-offset: 0px;
  }

  &:hover:not(&--selected) {
    outline: 1px dashed color.adjust($color-border, $lightness: 5%);
    outline-offset: 0px;
  }

  &__content {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__heading {
    font-weight: 700;
    overflow: hidden;
    display: block;
    line-height: 1.2;
  }

  &__text {
    overflow: hidden;
    display: block;
    line-height: 1.4;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  &__image {
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg;
    border: 1px dashed $color-border;
    border-radius: 4px;
    color: $color-text-secondary;
    opacity: 0.6;
  }

  &__divider {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
