<script setup lang="ts">
import type { CanvasElement } from '@/types'

defineProps<{
  element: CanvasElement
}>()
</script>

<template>
  <!-- Heading -->
  <div
    v-if="element.type === 'heading'"
    class="element-renderer"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex,
      fontSize: element.fontSize + 'px',
      color: element.color,
      textAlign: element.align,
      fontWeight: 700,
      lineHeight: 1.2
    }"
  >
    {{ element.content }}
  </div>

  <!-- Text -->
  <div
    v-else-if="element.type === 'text'"
    class="element-renderer"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex,
      fontSize: element.fontSize + 'px',
      color: element.color,
      textAlign: element.align,
      lineHeight: 1.4
    }"
  >
    {{ element.content }}
  </div>

  <!-- Button -->
  <a
    v-else-if="element.type === 'button'"
    class="element-renderer"
    :href="element.href || '#'"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex,
      fontSize: element.fontSize + 'px',
      color: element.color,
      backgroundColor: element.backgroundColor,
      borderRadius: element.borderRadius + 'px',
      justifyContent: element.align === 'left' ? 'flex-start' : element.align === 'right' ? 'flex-end' : 'center',
      textDecoration: 'none'
    }"
    @click.prevent
  >
    {{ element.content }}
  </a>

  <!-- Image -->
  <div
    v-else-if="element.type === 'image'"
    class="element-renderer"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex
    }"
  >
    <img
      v-if="element.src"
      :src="element.src"
      :alt="element.alt"
      class="element-renderer__img"
    />
  </div>

  <!-- Divider -->
  <div
    v-else-if="element.type === 'divider'"
    class="element-renderer element-renderer--divider"
    :style="{
      left: element.position.x + 'px',
      top: element.position.y + 'px',
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      zIndex: element.zIndex
    }"
  >
    <div
      class="element-renderer__line"
      :style="{
        backgroundColor: element.color,
        height: element.thickness + 'px'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.element-renderer {
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-weight: 600;
  white-space: pre-wrap;
  word-break: break-word;
  text-decoration: none;
  cursor: default;

  &--divider {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__line {
    width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}

a.element-renderer {
  cursor: pointer;
}
</style>
