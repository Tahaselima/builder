<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragMove } from '@/composables/useDragMove'
import { useResize } from '@/composables/useResize'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import type { CanvasElement as CanvasElementType } from '@/types'

const props = defineProps<{
  element: CanvasElementType
}>()

const editor = useEditorStore()

const isSelected = computed(() => editor.selectedElementId === props.element.id)
const isEditing = ref(false)
const editRef = ref<HTMLElement | null>(null)

const { onMouseDown } = useDragMove(() => props.element.id)
const { onMouseDown: onResizeStart } = useResize(() => props.element.id)

function isTextType(): boolean {
  return props.element.type === 'heading' || props.element.type === 'text'
}

function onDoubleClick(event: MouseEvent): void {
  if (!isTextType()) return
  event.stopPropagation()
  isEditing.value = true

  nextTick(() => {
    if (editRef.value) {
      editRef.value.focus()
      // Select all text
      const range = document.createRange()
      range.selectNodeContents(editRef.value)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  })
}

function finishEditing(): void {
  if (!isEditing.value) return
  isEditing.value = false

  if (editRef.value) {
    const newContent = editRef.value.textContent?.trim() ?? ''
    if (newContent && newContent !== (props.element as { content: string }).content) {
      editor.updateElement(props.element.id, { content: newContent })
    }
  }
}
</script>

<template>
  <div
    class="canvas-element"
    :class="{
      'canvas-element--selected': isSelected,
      'canvas-element--editing': isEditing
    }"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex
    }"
    @mousedown="isEditing ? undefined : onMouseDown($event)"
    @dblclick="onDoubleClick"
  >
    <!-- Heading / Text (inline-editable) -->
    <div
      v-if="element.type === 'heading' || element.type === 'text'"
      ref="editRef"
      class="canvas-element__content"
      :class="[
        element.type === 'heading' ? 'canvas-element__heading' : 'canvas-element__text'
      ]"
      :contenteditable="isEditing"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        textAlign: element.align
      }"
      @blur="finishEditing"
      @keydown.enter.prevent="finishEditing"
    >
      {{ element.content }}
    </div>

    <!-- Button -->
    <a
      v-else-if="element.type === 'button'"
      class="canvas-element__content canvas-element__button"
      :href="element.href || '#'"
      :style="{
        fontSize: element.fontSize + 'px',
        color: element.color,
        backgroundColor: element.backgroundColor,
        borderRadius: element.borderRadius + 'px',
        '--btn-align': element.align === 'left' ? 'flex-start' : element.align === 'right' ? 'flex-end' : 'center'
      }"
      @click.prevent
    >
      {{ element.content }}
    </a>

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

    <!-- Resize Handles -->
    <template v-if="isSelected && !isEditing">
      <div class="canvas-element__actions">
        <button
          class="canvas-element__action-btn"
          title="Bring Forward"
          @mousedown.stop.prevent
          @click.stop="editor.bringToFront(element.id)"
        >
          <BaseIcon name="layerUp" :size="11" />
        </button>
        <button
          class="canvas-element__action-btn"
          title="Send Backward"
          @mousedown.stop.prevent
          @click.stop="editor.sendToBack(element.id)"
        >
          <BaseIcon name="layerDown" :size="11" />
        </button>
        <button
          class="canvas-element__action-btn canvas-element__action-btn--delete"
          title="Delete"
          @mousedown.stop.prevent
          @click.stop="editor.removeElement(element.id)"
        >
          <BaseIcon name="trash" :size="11" />
        </button>
      </div>
      <div class="resize-handle resize-handle--tl" @mousedown.stop.prevent="onResizeStart($event, 'tl')" />
      <div class="resize-handle resize-handle--tr" @mousedown.stop.prevent="onResizeStart($event, 'tr')" />
      <div class="resize-handle resize-handle--bl" @mousedown.stop.prevent="onResizeStart($event, 'bl')" />
      <div class="resize-handle resize-handle--br" @mousedown.stop.prevent="onResizeStart($event, 'br')" />
    </template>
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

  &--editing {
    outline: 2px solid $color-primary;
    outline-offset: 0px;
    cursor: text;
    user-select: text;
  }

  &:hover:not(&--selected):not(&--editing) {
    outline: 1px dashed color.adjust($color-border, $lightness: 5%);
    outline-offset: 0px;
  }

  &__content {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &--editing &__content {
    pointer-events: auto;
  }

  &__heading {
    font-weight: 700;
    overflow: hidden;
    display: block;
    line-height: 1.2;

    &:focus {
      outline: none;
    }
  }

  &__text {
    overflow: hidden;
    display: block;
    line-height: 1.4;

    &:focus {
      outline: none;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    font-weight: 600;
    justify-content: var(--btn-align, center);
    text-decoration: none;
    cursor: pointer;
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

  &__actions {
    position: absolute;
    top: -30px;
    right: -8px;
    display: flex;
    gap: 3px;
    z-index: 11;
  }

  &__action-btn {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: $color-surface;
    color: $color-text-secondary;
    cursor: pointer;
    opacity: 0.5;
    transition: $transition-default;

    &:hover {
      opacity: 1;
      color: $color-primary;
      transform: scale(1.2);
      box-shadow: 0 1px 4px $color-shadow;
    }

    &--delete:hover {
      color: $color-danger;
    }
  }
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: $color-surface;
  border: 2px solid $color-selected;
  border-radius: 2px;
  z-index: 10;

  &--tl {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }

  &--tr {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }

  &--bl {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }

  &--br {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
}
</style>
