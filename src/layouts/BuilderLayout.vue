<script setup lang="ts">
import { AppHeader, ElementPalette, CanvasArea, PropertiesPanel } from '@/components'
import { useKeyboard } from '@/composables'

useKeyboard()
</script>

<template>
  <div class="builder-layout">
    <AppHeader />
    <div class="builder-layout__body">
      <ElementPalette />
      <CanvasArea />
      <PropertiesPanel />
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
  }
}
</style>
