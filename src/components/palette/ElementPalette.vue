<script setup lang="ts">
import { ref, computed } from 'vue'
import { PaletteItem, SaveDialog, NewDialog, TemplateList } from './'
import { useEditorStore, useTemplatesStore } from '@/stores'
import { ELEMENT_TYPE_LABELS } from '@/utils'
import type { ElementType } from '@/types'

const editor = useEditorStore()
const templates = useTemplatesStore()

const showSaveDialog = ref(false)
const showNewDialog = ref(false)

const isEditingSaved = computed(() => editor.loadedTemplateId !== null)

const elements: { type: ElementType; label: string; iconName: string }[] = [
  { type: 'heading', label: ELEMENT_TYPE_LABELS.heading, iconName: 'heading' },
  { type: 'text', label: ELEMENT_TYPE_LABELS.text, iconName: 'text' },
  { type: 'button', label: ELEMENT_TYPE_LABELS.button, iconName: 'button' },
  { type: 'image', label: ELEMENT_TYPE_LABELS.image, iconName: 'image' },
  { type: 'divider', label: ELEMENT_TYPE_LABELS.divider, iconName: 'divider' }
]

async function onSave(name: string): Promise<void> {
  await templates.saveCurrentAsTemplate(name)
}

async function onSaveExisting(): Promise<void> {
  await templates.updateExisting()
}

function onExport(): void {
  templates.exportCurrentAsJson()
}
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
          :icon-name="entry.iconName"
        />
      </div>
    </div>

    <div class="element-palette__section">
      <TemplateList />
    </div>

    <div class="element-palette__section element-palette__actions">
      <h2 class="element-palette__heading">Actions</h2>
      <div class="element-palette__action-buttons">
        <button class="action-btn action-btn--new" @click="showNewDialog = true">+ New</button>

        <template v-if="isEditingSaved">
          <button class="action-btn action-btn--save" @click="onSaveExisting">Save</button>
          <button class="action-btn action-btn--save" @click="showSaveDialog = true">Save As</button>
        </template>
        <button v-else class="action-btn action-btn--save" @click="showSaveDialog = true">Save</button>

        <button class="action-btn action-btn--export" @click="onExport">Export JSON</button>
      </div>
    </div>
  </aside>

  <NewDialog
    v-if="showNewDialog"
    @close="showNewDialog = false"
  />

  <SaveDialog
    v-if="showSaveDialog"
    @save="onSave"
    @close="showSaveDialog = false"
  />
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/buttons' as *;
@use '@/styles/panels' as *;

.element-palette {
  @include panel-right;
  width: $sidebar-width;
  padding: $padding-panel 12px;
  gap: 20px;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__heading {
    @include section-heading;
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
</style>
