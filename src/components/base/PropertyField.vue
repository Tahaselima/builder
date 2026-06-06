<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="field">
    <label class="field__label">{{ label }}</label>
    <div class="field__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
