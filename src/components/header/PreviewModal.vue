<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BaseModal from '@/components/base/BaseModal.vue'
import { DEFAULT_CANVAS } from '@/utils/elementDefaults'

const editor = useEditorStore()

defineEmits<{ close: [] }>()

const canvasStyle = computed(() => {
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
})
</script>

<template>
  <BaseModal title="Preview" width="auto" position="center" @close="$emit('close')">
    <div class="preview-canvas" :style="canvasStyle">
      <template v-for="el in editor.sortedElements" :key="el.id">
        <!-- Heading -->
        <div
          v-if="el.type === 'heading'"
          class="preview-element"
          :style="{
            left: el.position.x + 'px',
            top: el.position.y + 'px',
            width: el.size.width + 'px',
            height: el.size.height + 'px',
            zIndex: el.zIndex,
            fontSize: el.fontSize + 'px',
            color: el.color,
            textAlign: el.align,
            fontWeight: 700,
            lineHeight: 1.2,
            cursor: 'default'
          }"
        >
          {{ el.content }}
        </div>

        <!-- Text -->
        <div
          v-else-if="el.type === 'text'"
          class="preview-element"
          :style="{
            left: el.position.x + 'px',
            top: el.position.y + 'px',
            width: el.size.width + 'px',
            height: el.size.height + 'px',
            zIndex: el.zIndex,
            fontSize: el.fontSize + 'px',
            color: el.color,
            textAlign: el.align,
            lineHeight: 1.4,
            cursor: 'default'
          }"
        >
          {{ el.content }}
        </div>

        <!-- Button -->
        <a
          v-else-if="el.type === 'button'"
          class="preview-element"
          :href="el.href || '#'"
          :style="{
            left: el.position.x + 'px',
            top: el.position.y + 'px',
            width: el.size.width + 'px',
            height: el.size.height + 'px',
            zIndex: el.zIndex,
            fontSize: el.fontSize + 'px',
            color: el.color,
            backgroundColor: el.backgroundColor,
            borderRadius: el.borderRadius + 'px',
            justifyContent: el.align === 'left' ? 'flex-start' : el.align === 'right' ? 'flex-end' : 'center',
            textDecoration: 'none',
            cursor: 'pointer'
          }"
        >
          {{ el.content }}
        </a>

        <!-- Image -->
        <div
          v-else-if="el.type === 'image'"
          class="preview-element"
          :style="{
            left: el.position.x + 'px',
            top: el.position.y + 'px',
            width: el.size.width + 'px',
            height: el.size.height + 'px',
            zIndex: el.zIndex,
            cursor: 'default'
          }"
        >
          <img
            v-if="el.src"
            :src="el.src"
            :alt="el.alt"
            class="preview-element__img"
          />
        </div>

        <!-- Divider -->
        <div
          v-else-if="el.type === 'divider'"
          class="preview-element preview-element--divider"
          :style="{
            left: el.position.x + 'px',
            top: el.position.y + 'px',
            width: el.size.width + 'px',
            height: el.size.height + 'px',
            zIndex: el.zIndex
          }"
        >
          <div
            class="preview-element__line"
            :style="{
              backgroundColor: el.color,
              height: el.thickness + 'px'
            }"
          />
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preview-canvas {
  position: relative;
  overflow: hidden;
}

.preview-element {
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-weight: 600;
  white-space: pre-wrap;
  word-break: break-word;
  text-decoration: none;

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

  &--divider {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a& {
    cursor: pointer;
  }
    width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
