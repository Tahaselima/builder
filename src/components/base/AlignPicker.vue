<script setup lang="ts">
import type { HorizontalAlign } from '@/types'

defineProps<{
  modelValue: HorizontalAlign
}>()

defineEmits<{
  'update:modelValue': [value: HorizontalAlign]
}>()

const options: { value: HorizontalAlign; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
]
</script>

<template>
  <div class="align-picker">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="align-picker__btn"
      :class="{ 'align-picker__btn--active': modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.align-picker {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid $color-border;

  &__btn {
    flex: 1;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 500;
    background: $color-surface;
    color: $color-text-secondary;
    transition: all 0.1s ease;
    border-right: 1px solid $color-border;

    &:last-child {
      border-right: none;
    }

    &:hover {
      background: $color-bg;
    }

    &--active {
      background: $color-primary;
      color: #fff;
    }
  }
}
</style>
