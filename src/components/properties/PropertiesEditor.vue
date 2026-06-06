<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasElement, Size } from '@/types'
import { propertyConfigs } from '@/utils/propertyConfig'
import type { PropertyFieldConfig } from '@/utils/propertyConfig'
import PropertyField from '@/components/base/PropertyField.vue'
import AlignPicker from '@/components/base/AlignPicker.vue'

const props = defineProps<{
  element: CanvasElement
}>()

const emit = defineEmits<{
  update: [payload: Partial<CanvasElement>]
}>()

const fields = computed(() => propertyConfigs[props.element.type] ?? [])

function getFieldValue(field: PropertyFieldConfig): string | number {
  return (props.element as unknown as Record<string, unknown>)[field.key] as string | number
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
              class="input"
              :value="element.size.width"
              min="20"
              @input="onSizeUpdate('width', Number(($event.target as HTMLInputElement).value))"
            />
          </div>
          <div class="size-field">
            <span class="size-field__label">H</span>
            <input
              type="number"
              class="input"
              :value="element.size.height"
              min="20"
              @input="onSizeUpdate('height', Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- Range Slider -->
        <div v-else-if="field.type === 'range'" class="range-row">
          <input
            type="range"
            class="range-slider"
            :value="getFieldValue(field)"
            :min="field.min"
            :max="field.max"
            @input="onUpdate(field, Number(($event.target as HTMLInputElement).value))"
          />
          <span class="range-value">{{ getFieldValue(field) }}</span>
        </div>

        <!-- Text -->
        <input
          v-else-if="field.type === 'text'"
          type="text"
          class="input"
          :value="getFieldValue(field)"
          :placeholder="field.placeholder"
          @input="onUpdate(field, ($event.target as HTMLInputElement).value)"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          class="input input--textarea"
          :value="getFieldValue(field)"
          rows="2"
          @input="onUpdate(field, ($event.target as HTMLTextAreaElement).value)"
        />

        <!-- Number -->
        <input
          v-else-if="field.type === 'number'"
          type="number"
          class="input"
          :value="getFieldValue(field)"
          :min="field.min"
          :max="field.max"
          @input="onUpdate(field, Number(($event.target as HTMLInputElement).value))"
        />

        <!-- Color -->
        <div v-else-if="field.type === 'color'" class="color-row">
          <input
            type="color"
            class="input--color"
            :value="getFieldValue(field)"
            @input="onUpdate(field, ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            class="input input--small"
            :value="getFieldValue(field)"
            @input="onUpdate(field, ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Align -->
        <AlignPicker
          v-else-if="field.type === 'align'"
          :model-value="getFieldValue(field) as 'left' | 'center' | 'right'"
          @update:model-value="onUpdate(field, $event)"
        />
      </PropertyField>
    </template>
  </div>
</template>

<style scoped lang="scss">
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
    color: #9ca3af;
  }
}

.color-row {
  display: flex;
  gap: 6px;
  width: 100%;
}

.range-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.range-value {
  font-size: 12px;
  font-weight: 600;
  color: $color-text;
  min-width: 28px;
  text-align: right;
  font-family: monospace;
}

.range-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: $color-border;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $color-primary;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
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

  &--textarea {
    resize: vertical;
    font-family: inherit;
  }

  &--small {
    flex: 1;
    font-family: monospace;
    font-size: 12px;
  }

  &--color {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    background: none;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }
  }
}
</style>
