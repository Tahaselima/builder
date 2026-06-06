<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import type { CanvasElement as CanvasElementType } from '@/types'

const props = defineProps<{
  element: CanvasElementType
}>()

const editor = useEditorStore()

const isSelected = computed(() => editor.selectedElementId === props.element.id)

function onClick(event: MouseEvent): void {
  event.stopPropagation()
  editor.selectElement(props.element.id)
}
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
    @mousedown.stop="onClick"
    @click.stop="onClick"
  >
    <!-- Heading -->
    <div
      v-if="element.type === 'heading'"
      class="canvas-element__heading"
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
      class="canvas-element__text"
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
      class="canvas-element__button"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        backgroundColor: element.backgroundColor,
        borderRadius: element.borderRadius + 'px'
      }"
    >
      {{ element.content }}
    </div>

    <!-- Image -->
    <div v-else-if="element.type === 'image'" class="canvas-element__image">
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
      class="canvas-element__divider"
      :style="{
        borderBottom: element.thickness + 'px solid ' + element.color
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
  transition: box-shadow 0.1s ease;

  &--selected {
    outline: 2px solid $color-selected;
    outline-offset: -1px;
    box-shadow: 0 0 0 1px rgba($color-selected, 0.2);
  }

  &:hover:not(&--selected) {
    outline: 1px dashed color.adjust($color-border, $lightness: 5%);
    outline-offset: -1px;
  }

  &__heading {
    width: 100%;
    height: 100%;
    font-weight: 700;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  &__text {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
  }

  &__button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  &__image {
    width: 100%;
    height: 100%;
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
