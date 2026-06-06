<script setup lang="ts">
import type { ButtonElement } from '@/types'
import PropertyField from '@/components/base/PropertyField.vue'
import AlignPicker from '@/components/base/AlignPicker.vue'

const props = defineProps<{
  element: ButtonElement
}>()

const emit = defineEmits<{
  update: [payload: Partial<ButtonElement>]
}>()

function onInput(field: keyof ButtonElement, value: string | number): void {
  emit('update', { [field]: value })
}
</script>

<template>
  <div class="button-properties">
    <PropertyField label="Text">
      <input
        type="text"
        class="input"
        :value="element.content"
        @input="onInput('content', ($event.target as HTMLInputElement).value)"
      />
    </PropertyField>

    <PropertyField label="Font Size">
      <input
        type="number"
        class="input"
        :value="element.fontSize"
        min="10"
        max="72"
        @input="onInput('fontSize', Number(($event.target as HTMLInputElement).value))"
      />
    </PropertyField>

    <PropertyField label="Text Color">
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

    <PropertyField label="Background">
      <div class="color-row">
        <input
          type="color"
          class="input--color"
          :value="element.backgroundColor"
          @input="onInput('backgroundColor', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="text"
          class="input input--small"
          :value="element.backgroundColor"
          @input="onInput('backgroundColor', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </PropertyField>

    <PropertyField label="Border Radius">
      <input
        type="number"
        class="input"
        :value="element.borderRadius"
        min="0"
        max="50"
        @input="onInput('borderRadius', Number(($event.target as HTMLInputElement).value))"
      />
    </PropertyField>

    <PropertyField label="Align">
      <AlignPicker
        :model-value="element.align"
        @update:model-value="onInput('align', $event)"
      />
    </PropertyField>
  </div>
</template>

<style scoped lang="scss">
.button-properties {
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
