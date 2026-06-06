<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useEditorStore } from '@/stores/editor'
import PropertyField from '@/components/base/PropertyField.vue'

const editor = useEditorStore()

const emit = defineEmits<{
  close: []
}>()

const settings = reactive({
  backgroundColor: editor.canvas.backgroundColor,
  borderRadius: editor.canvas.borderRadius ?? 0,
  boxShadow: editor.canvas.boxShadow ?? 8,
  boxShadowOpacity: editor.canvas.boxShadowOpacity ?? 0.08
})

function apply(): void {
  editor.canvas.backgroundColor = settings.backgroundColor
  editor.canvas.borderRadius = settings.borderRadius
  editor.canvas.boxShadow = settings.boxShadow
  editor.canvas.boxShadowOpacity = settings.boxShadowOpacity
}

function onInput(): void {
  apply()
}
</script>

<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-modal">
      <div class="settings-modal__header">
        <h3 class="settings-modal__title">Canvas Settings</h3>
        <button class="settings-modal__close" @click="$emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="settings-modal__body">
        <PropertyField label="Background Color">
          <div class="color-row">
            <input
              type="color"
              class="input--color"
              :value="settings.backgroundColor"
              @input="settings.backgroundColor = ($event.target as HTMLInputElement).value; onInput()"
            />
            <input
              type="text"
              class="input input--small"
              :value="settings.backgroundColor"
              @input="settings.backgroundColor = ($event.target as HTMLInputElement).value; onInput()"
            />
          </div>
        </PropertyField>

        <PropertyField label="Border Radius">
          <div class="range-row">
            <input
              type="range"
              class="range-slider"
              :value="settings.borderRadius"
              min="0"
              max="32"
              @input="settings.borderRadius = Number(($event.target as HTMLInputElement).value); onInput()"
            />
            <span class="range-value">{{ settings.borderRadius }}px</span>
          </div>
        </PropertyField>

        <PropertyField label="Shadow Spread">
          <div class="range-row">
            <input
              type="range"
              class="range-slider"
              :value="settings.boxShadow"
              min="0"
              max="48"
              @input="settings.boxShadow = Number(($event.target as HTMLInputElement).value); onInput()"
            />
            <span class="range-value">{{ settings.boxShadow }}px</span>
          </div>
        </PropertyField>

        <PropertyField label="Shadow Opacity">
          <div class="range-row">
            <input
              type="range"
              class="range-slider"
              :value="Math.round(settings.boxShadowOpacity * 100)"
              min="0"
              max="50"
              @input="settings.boxShadowOpacity = Number(($event.target as HTMLInputElement).value) / 100; onInput()"
            />
            <span class="range-value">{{ Math.round(settings.boxShadowOpacity * 100) }}%</span>
          </div>
        </PropertyField>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  padding: 68px 24px 0 0;
  z-index: 1000;
}

.settings-modal {
  background: $color-surface;
  border-radius: 12px;
  width: 300px;
  height: max-content;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
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
    transition: all 0.15s ease;

    &:hover {
      background: $color-bg;
      color: $color-text;
    }
  }

  &__body {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
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
  min-width: 40px;
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
