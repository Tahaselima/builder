<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ElementPalette from '@/components/ElementPalette.vue'
import CanvasArea from '@/components/CanvasArea.vue'
import PropertiesPanel from '@/components/PropertiesPanel.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <div class="app-layout__body">
      <ElementPalette />
      <CanvasArea />
      <PropertiesPanel />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-layout {
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
