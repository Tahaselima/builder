<script setup lang="ts">
import type { DividerElement } from '@/types'
import PropertyField from '@/components/base/PropertyField.vue'

const props = defineProps<{
  element: DividerElement
}>()

const emit = defineEmits<{
  update: [payload: Partial<DividerElement>]
}>()

function onInput(field: keyof DividerElement, value: string | number): void {
  emit('update', { [field]: value })
}
</script>

<template>
  <div class="divider-properties">
    <PropertyField label="Color">
      <div class="color-row">
        <input
          type="color"
          class="input--color"
          :value="element.color"
          @input="onInput('color', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="text"
          class="input input--small"
          :value="element.color"
          @input="onInput('color', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </PropertyField>

    <PropertyField label="Thickness">
      <input
        type="number"
        class="input"
        :value="element.thickness"
        min="1"
        max="20"
        @input="onInput('thickness', Number(($event.target as HTMLInputElement).value))"
      />
    </PropertyField>
  </div>
</template>

<style scoped lang="scss">
.divider-properties {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.color-row {
  display: flex;
  gap: 6px;
  width: 100%;
}

.input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #4f46e5;
  }

  &--small {
    flex: 1;
    font-family: monospace;
    font-size: 12px;
  }

  &--color {
    width: 32px;
    height: 32px;
    padding: 2px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    background: none;
  }
}
</style>
