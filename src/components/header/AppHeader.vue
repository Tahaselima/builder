<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BaseIcon from '@/components/icon/BaseIcon.vue'
import ShortcutsModal from './ShortcutsModal.vue'
import SettingsModal from './SettingsModal.vue'

const editor = useEditorStore()
const showShortcuts = ref(false)
const showSettings = ref(false)
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
</style>
