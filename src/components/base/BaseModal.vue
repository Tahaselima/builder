<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue'

withDefaults(defineProps<{
  title: string
  width?: string
  position?: 'center' | 'right'
}>(), {
  width: '320px',
  position: 'right'
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    class="base-modal-overlay"
    :class="{ 'base-modal-overlay--center': position === 'center' }"
    @click.self="$emit('close')"
  >
    <div class="base-modal" :style="{ width }">
      <div class="base-modal__header">
        <h3 class="base-modal__title">{{ title }}</h3>
        <button class="base-modal__close" @click="$emit('close')">
          <BaseIcon name="close" :size="16" />
        </button>
      </div>
      <div class="base-modal__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.base-modal-overlay {
  position: fixed;
  inset: 0;
  background: $color-overlay;
  display: flex;
  justify-content: flex-end;
  padding: 68px 24px 0 0;
  z-index: 1000;

  &--center {
    align-items: center;
    justify-content: center;
    padding: 0;
  }
}

.base-modal {
  background: $color-surface;
  border-radius: 12px;
  height: max-content;
  box-shadow: 0 8px 32px $color-shadow;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $color-text;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: $color-text-secondary;
    transition: $transition-default;

    &:hover {
      background: $color-bg;
      color: $color-text;
    }
  }

  &__body {
    padding: $padding-panel 20px;
    display: flex;
    flex-direction: column;
    gap: $gap-form;
  }
}
</style>
