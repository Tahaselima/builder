<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasElement } from '@/types'
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
</script>

<template>
  <div class="properties-editor">
    <template v-for="field in fields" :key="field.key">
      <PropertyField :label="field.label">
        <!-- Text -->
        <input
          v-if="field.type === 'text'"
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
.properties-editor {
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
    padding: 2px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    background: none;
  }
}
</style>
