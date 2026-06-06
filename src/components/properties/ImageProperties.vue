<script setup lang="ts">
import type { ImageElement } from '@/types'
import PropertyField from '@/components/base/PropertyField.vue'

const props = defineProps<{
  element: ImageElement
}>()

const emit = defineEmits<{
  update: [payload: Partial<ImageElement>]
}>()

function onInput(field: keyof ImageElement, value: string): void {
  emit('update', { [field]: value })
}
</script>

<template>
  <div class="image-properties">
    <PropertyField label="Image URL">
      <input
        type="text"
        class="input"
        :value="element.src"
        placeholder="https://..."
        @input="onInput('src', ($event.target as HTMLInputElement).value)"
      />
    </PropertyField>

    <PropertyField label="Alt Text">
      <input
        type="text"
        class="input"
        :value="element.alt"
        placeholder="Describe the image"
        @input="onInput('alt', ($event.target as HTMLInputElement).value)"
      />
    </PropertyField>
  </div>
</template>

<style scoped lang="scss">
.image-properties {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
}
</style>
