<script setup lang="ts">
import { ref } from 'vue'
import { AppHeader, ElementPalette, CanvasArea, PropertiesPanel } from '@/components'
import { useKeyboard } from '@/composables'

useKeyboard()

const showLeftPanel = ref(false)
const showRightPanel = ref(false)

function toggleLeft(): void {
  showLeftPanel.value = !showLeftPanel.value
  if (showLeftPanel.value) showRightPanel.value = false
}

function toggleRight(): void {
  showRightPanel.value = !showRightPanel.value
  if (showRightPanel.value) showLeftPanel.value = false
}

function closePanels(): void {
  showLeftPanel.value = false
  showRightPanel.value = false
}
</script>

<template>
  <div class="builder-layout">
    <AppHeader @toggle-left="toggleLeft" @toggle-right="toggleRight" />
    <div class="builder-layout__body">
      <!-- Backdrop for mobile -->
      <div
        v-if="showLeftPanel || showRightPanel"
        class="builder-layout__backdrop"
        @click="closePanels"
      />

      <ElementPalette
        class="builder-layout__palette"
        :class="{ 'builder-layout__panel--open': showLeftPanel }"
      />
      <CanvasArea @click="closePanels" />
      <PropertiesPanel
        class="builder-layout__properties"
        :class="{ 'builder-layout__panel--open': showRightPanel }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.builder-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  &__backdrop {
    display: none;
  }

  // Mobile
  @media (max-width: $breakpoint-mobile) {
    &__backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 50;
      background: $color-overlay;
    }

    &__palette,
    &__properties {
      position: fixed;
      top: $header-height;
      bottom: 0;
      z-index: 60;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
    }

    &__properties {
      right: 0;
      left: auto;
      transform: translateX(100%);
    }

    &__panel--open {
      transform: translateX(0) !important;
    }
  }
}
</style>
