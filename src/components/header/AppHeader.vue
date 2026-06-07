<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores'
import { BaseIcon } from '@/components'
import { ShortcutsModal, SettingsModal, PreviewModal } from './'

const editor = useEditorStore()
const showShortcuts = ref(false)
const showSettings = ref(false)
const showPreview = ref(false)
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <h1 class="app-header__title">Template Builder</h1>
    </div>

    <div class="app-header__right">
      <div class="app-header__history">
        <button
          class="btn-icon btn-icon--lg"
          :disabled="!editor.canUndo"
          title="Undo (Ctrl+Z)"
          @click="editor.undo()"
        >
          <BaseIcon name="undo" />
        </button>
        <button
          class="btn-icon btn-icon--lg"
          :disabled="!editor.canRedo"
          title="Redo (Ctrl+Y)"
          @click="editor.redo()"
        >
          <BaseIcon name="redo" />
        </button>
      </div>

      <button
        class="btn-icon btn-icon--lg"
        :class="{ 'btn-icon--active': editor.gridEnabled }"
        :title="editor.gridEnabled ? 'Disable Grid (G)' : 'Enable Grid (G)'"
        @click="editor.toggleGrid()"
      >
        <BaseIcon name="grid" />
      </button>

      <button
        class="btn-icon btn-icon--lg"
        title="Preview"
        @click="showPreview = true"
      >
        <BaseIcon name="eye" />
      </button>

      <button
        class="btn-icon btn-icon--lg"
        title="Canvas Settings"
        @click="showSettings = true"
      >
        <BaseIcon name="settings" />
      </button>

      <button
        class="btn-icon btn-icon--lg"
        title="Keyboard Shortcuts"
        @click="showShortcuts = true"
      >
        <BaseIcon name="keyboard" />
      </button>
    </div>
  </header>

  <PreviewModal
    v-if="showPreview"
    @close="showPreview = false"
  />

  <SettingsModal
    v-if="showSettings"
    @close="showSettings = false"
  />

  <ShortcutsModal
    v-if="showShortcuts"
    @close="showShortcuts = false"
  />
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/buttons' as *;

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 20px;
  background: $color-surface;
  border-bottom: 1px solid $color-border;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $color-text;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__history {
    display: flex;
    gap: 4px;
  }
}

.btn-icon--active {
  background: $color-primary-light;
  color: $color-primary;
}

@media (max-width: $breakpoint-mobile) {
  .app-header {
    padding: 0 12px;

    &__title {
      font-size: 14px;
    }

    &__right {
      gap: 8px;
    }
  }
}
</style>
