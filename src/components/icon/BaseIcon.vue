<script setup lang="ts">
import { computed } from 'vue'
import { iconPaths } from './icons'

const props = withDefaults(defineProps<{
  name: string
  size?: number
  strokeWidth?: number
}>(), {
  size: 18,
  strokeWidth: 2
})

const svgContent = computed(() => iconPaths[props.name] ?? '')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-html="svgContent"
  />
</template>

<style scoped>
svg {
  display: inline-flex;
  flex-shrink: 0;
}
</style>
