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
    <AppHeader />

    <!-- Mobile panel handles -->
    <div class="builder-layout__handles">
      <button
        class="builder-layout__handle builder-layout__handle--left"
        :class="{ 'builder-layout__handle--active': showLeftPanel }"
        @click="toggleLeft"
      >
        <span class="builder-layout__handle-icon">◂</span>
      </button>
      <button
        class="builder-layout__handle builder-layout__handle--right"
        :class="{ 'builder-layout__handle--active': showRightPanel }"
        @click="toggleRight"
      >
        <span class="builder-layout__handle-icon">▸</span>
      </button>
    </div>

    <div class="builder-layout__body">
      <div
        v-if="showLeftPanel || showRightPanel"
        class="builder-layout__backdrop"
        @click="closePanels"
      />

      <div class="builder-layout__palette" :class="{ 'builder-layout__panel--open': showLeftPanel }">
        <ElementPalette />
      </div>

      <CanvasArea @click="closePanels" />

      <div class="builder-layout__properties" :class="{ 'builder-layout__panel--open': showRightPanel }">
        <PropertiesPanel />
      </div>
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

  &__handles {
    display: none;
  }

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  &__palette,
  &__properties {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    overflow-y: auto;

    :deep(aside) {
      height: 100%;
    }
  }

  &__backdrop {
    display: none;
  }

  // Mobile
  @media (max-width: $breakpoint-mobile) {
    &__handles {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 40;
      height: 0;
    }

    &__handle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 0 0 8px 8px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-top: none;
      color: $color-text-secondary;
      cursor: pointer;
      font-size: 12px;
      transition: $transition-default;
      box-shadow: 0 2px 6px $color-shadow;

      &--active {
        background: $color-primary;
        color: $color-surface;
      }

      &:active {
        transform: scale(0.92);
      }

      &-icon {
        line-height: 1;
        font-size: 14px;
      }
    }

    &__backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 50;
      background: $color-overlay;
    }

    &__palette,
    &__properties {
      height: calc(100vh - #{$header-height});
    }

    &__palette {
      position: fixed;
      top: $header-height;
      left: 0;
      z-index: 60;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
    }

    &__properties {
      position: fixed;
      top: $header-height;
      right: 0;
      z-index: 60;
      transform: translateX(100%);
      transition: transform 0.25s ease;
    }

    &__panel--open {
      transform: translateX(0) !important;
    }
  }
}
</style>
