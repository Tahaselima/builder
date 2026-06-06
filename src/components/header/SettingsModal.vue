<script setup lang="ts">
import { reactive } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BaseModal from '@/components/base/BaseModal.vue'
import PropertyField from '@/components/base/PropertyField.vue'
import { inputValue, inputNumber } from '@/utils/events'

const editor = useEditorStore()

defineEmits<{
  close: []
}>()

const settings = reactive({
  backgroundColor: editor.canvas.backgroundColor,
  borderRadius: editor.canvas.borderRadius ?? 8,
  boxShadow: editor.canvas.boxShadow ?? 4,
  boxShadowOpacity: editor.canvas.boxShadowOpacity ?? 0.08
})

function onInput(): void {
  editor.canvas.backgroundColor = settings.backgroundColor
  editor.canvas.borderRadius = settings.borderRadius
  editor.canvas.boxShadow = settings.boxShadow
  editor.canvas.boxShadowOpacity = settings.boxShadowOpacity
}
</script>

<template>
  <BaseModal title="Canvas Settings" width="300px" @close="$emit('close')">
    <PropertyField label="Background Color">
      <div class="form-color-row">
        <input
          type="color"
          class="form-input--color"
          :value="settings.backgroundColor"
          @input="settings.backgroundColor = inputValue($event); onInput()"
        />
        <input
          type="text"
          class="form-input form-input--small"
          :value="settings.backgroundColor"
          @input="settings.backgroundColor = inputValue($event); onInput()"
        />
      </div>
    </PropertyField>

    <PropertyField label="Border Radius">
      <div class="form-range-row">
        <input
          type="range"
          class="form-range-slider"
          :value="settings.borderRadius"
          min="0"
          max="32"
          @input="settings.borderRadius = inputNumber($event); onInput()"
        />
        <span class="form-range-value">{{ settings.borderRadius }}px</span>
      </div>
    </PropertyField>

    <PropertyField label="Shadow Spread">
      <div class="form-range-row">
        <input
          type="range"
          class="form-range-slider"
          :value="settings.boxShadow"
          min="0"
          max="48"
          @input="settings.boxShadow = inputNumber($event); onInput()"
        />
        <span class="form-range-value">{{ settings.boxShadow }}px</span>
      </div>
    </PropertyField>

    <PropertyField label="Shadow Opacity">
      <div class="form-range-row">
        <input
          type="range"
          class="form-range-slider"
          :value="Math.round(settings.boxShadowOpacity * 100)"
          min="0"
          max="50"
          @input="settings.boxShadowOpacity = inputNumber($event) / 100; onInput()"
        />
        <span class="form-range-value">{{ Math.round(settings.boxShadowOpacity * 100) }}%</span>
      </div>
    </PropertyField>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/forms' as *;
</style>
