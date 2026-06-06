<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasElement, ElementUpdate, HorizontalAlign, Size } from '@/types'
import { AlignPicker, propertyConfigs, type PropertyFieldConfig } from './'
import { inputValue, inputNumber } from '@/utils'
import { PropertyField } from '@/components'

const props = defineProps<{
  element: CanvasElement
}>()

const emit = defineEmits<{
  update: [payload: ElementUpdate]
}>()

const fields = computed(() => propertyConfigs[props.element.type] ?? [])

function getFieldValue(field: PropertyFieldConfig): string | number {
  const el = props.element
  // Size is handled separately via onSizeUpdate
  if (field.key === 'size') return 0

  // Dynamic property access on discriminated union — all property keys are valid strings
  const record = el as unknown as Record<string, unknown>
  const value = record[field.key]
  return (value as string | number) ?? ''
}

function onUpdate(field: PropertyFieldConfig, value: string | number): void {
  emit('update', { [field.key]: value })
}

function onSizeUpdate(dimension: 'width' | 'height', value: number): void {
  const size: Size = { ...props.element.size }
  size[dimension] = value
  emit('update', { size })
}
</script>

<template>
  <div class="properties-editor">
    <template v-for="field in fields" :key="field.key">
      <PropertyField :label="field.label">
        <!-- Size (Width x Height) -->
        <div v-if="field.type === 'size'" class="size-row">
          <div class="size-field">
            <span class="size-field__label">W</span>
            <input
              type="number"
              class="form-input"
              :value="element.size.width"
              min="20"
              @input="onSizeUpdate('width', inputNumber($event))"
            />
          </div>
          <div class="size-field">
            <span class="size-field__label">H</span>
            <input
              type="number"
              class="form-input"
              :value="element.size.height"
              min="20"
              @input="onSizeUpdate('height', inputNumber($event))"
            />
          </div>
        </div>

        <!-- Range Slider -->
        <div v-else-if="field.type === 'range'" class="form-range-row">
          <input
            type="range"
            class="form-range-slider"
            :value="getFieldValue(field)"
            :min="field.min"
            :max="field.max"
            @input="onUpdate(field, inputNumber($event))"
          />
          <span class="form-range-value">{{ getFieldValue(field) }}</span>
        </div>

        <!-- Text -->
        <input
          v-else-if="field.type === 'text'"
          type="text"
          class="form-input"
          :value="getFieldValue(field)"
          :placeholder="field.placeholder"
          @input="onUpdate(field, inputValue($event))"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          class="form-input form-input--textarea"
          :value="getFieldValue(field)"
          rows="2"
          @input="onUpdate(field, inputValue($event))"
        />

        <!-- Number -->
        <input
          v-else-if="field.type === 'number'"
          type="number"
          class="form-input"
          :value="getFieldValue(field)"
          :min="field.min"
          :max="field.max"
          @input="onUpdate(field, inputNumber($event))"
        />

        <!-- Color -->
        <div v-else-if="field.type === 'color'" class="form-color-row">
          <input
            type="color"
            class="form-input--color"
            :value="getFieldValue(field)"
            @input="onUpdate(field, inputValue($event))"
          />
          <input
            type="text"
            class="form-input form-input--small"
            :value="getFieldValue(field)"
            @input="onUpdate(field, inputValue($event))"
          />
        </div>

        <!-- Align -->
        <AlignPicker
          v-else-if="field.type === 'align'"
          :model-value="getFieldValue(field) as HorizontalAlign"
          @update:model-value="onUpdate(field, $event)"
        />
      </PropertyField>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/forms' as *;
@use '@/styles/variables' as *;

.properties-editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.size-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.size-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: $color-text-secondary;
  }
}
</style>
