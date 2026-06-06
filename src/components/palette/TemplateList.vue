<script setup lang="ts">
import { onMounted } from 'vue'
import { useTemplatesStore } from '@/stores/templates'
import BaseIcon from '@/components/icon/BaseIcon.vue'

const templates = useTemplatesStore()

onMounted(() => {
  templates.fetchAll()
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="template-list">
    <h2 class="template-list__heading">Saved Templates</h2>

    <div v-if="templates.isLoading" class="template-list__empty">Loading...</div>

    <div v-else-if="templates.templates.length === 0" class="template-list__empty">
      No saved templates yet.
    </div>

    <div v-else class="template-list__items">
      <div
        v-for="tpl in templates.templates"
        :key="tpl.id"
        class="template-item"
        @click="templates.loadToEditor(tpl.id)"
      >
        <div class="template-item__info">
          <span class="template-item__name">{{ tpl.name }}</span>
          <span class="template-item__date">{{ formatDate(tpl.updatedAt) }}</span>
        </div>
        <div class="template-item__actions">
          <button
            class="template-item__btn"
            title="Export JSON"
            @click.stop="templates.exportAsJson(tpl.id)"
          >
            <BaseIcon name="image" :size="14" />
          </button>
          <button
            class="template-item__btn template-item__btn--delete"
            title="Delete"
            @click.stop="templates.remove(tpl.id)"
          >
            <BaseIcon name="trash" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/buttons' as *;
@use '@/styles/panels' as *;

.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__heading {
    @include section-heading;
  }

  &__empty {
    font-size: 12px;
    color: $color-text-secondary;
    padding: 4px 0;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.template-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    background: $color-bg;
    border-color: $color-border;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 13px;
    font-weight: 500;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date {
    font-size: 10px;
    color: $color-text-secondary;
  }

  &__actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &:hover &__actions {
    opacity: 1;
  }

  &__btn {
    @extend .btn-icon--sm;

    &--delete:hover {
      @include hover-danger;
    }
  }
}
</style>
