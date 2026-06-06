<script setup lang="ts">
import PaletteItem from './PaletteItem.vue'
import type { ElementType } from '@/types'

interface PaletteEntry {
  type: ElementType
  label: string
  icon: string
}

const elements: PaletteEntry[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg>'
  },
  {
    type: 'text',
    label: 'Text',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>'
  },
  {
    type: 'button',
    label: 'Button',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>'
  },
  {
    type: 'image',
    label: 'Image',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18"/></svg>'
  }
]
</script>

<template>
  <aside class="element-palette">
    <div class="element-palette__section">
      <h2 class="element-palette__heading">Elements</h2>
      <div class="element-palette__list">
        <PaletteItem
          v-for="entry in elements"
          :key="entry.type"
          :type="entry.type"
          :label="entry.label"
          :icon="entry.icon"
        />
      </div>
    </div>

    <div class="element-palette__section element-palette__actions">
      <h2 class="element-palette__heading">Actions</h2>
      <div class="element-palette__action-buttons">
        <button class="action-btn action-btn--new">+ New</button>
        <button class="action-btn action-btn--save">Save</button>
        <button class="action-btn action-btn--export">Export JSON</button>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.element-palette {
  width: $sidebar-width;
  background: $color-surface;
  border-right: 1px solid $color-border;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex-shrink: 0;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__heading {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $color-text-secondary;
    padding: 0 4px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__action-buttons {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__actions {
    margin-top: auto;
  }
}

.action-btn {
  width: 100%;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: all 0.15s ease;
  border: 1px solid $color-border;
  background: $color-surface;

  &--new {
    &:hover { background: #ecfdf5; border-color: #10b981; color: #059669; }
  }

  &--save {
    &:hover { background: #eef2ff; border-color: $color-primary; color: $color-primary; }
  }

  &--export {
    &:hover { background: #fefce8; border-color: #ca8a04; color: #a16207; }
  }
}
</style>
