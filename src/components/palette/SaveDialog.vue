<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '@/components'

const emit = defineEmits<{
  save: [name: string]
  close: []
}>()

const name = ref('')

function onSubmit(): void {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('save', trimmed)
  emit('close')
}
</script>

<template>
  <BaseModal title="Save Template" width="340px" position="center" @close="$emit('close')">
    <input
      v-model="name"
      type="text"
      class="form-input"
      placeholder="Template name..."
      autofocus
      @keyup.enter="onSubmit"
      @keyup.escape="$emit('close')"
    />
    <div class="save-dialog__actions">
      <button class="btn-secondary" @click="$emit('close')">Cancel</button>
      <button class="btn-primary" :disabled="!name.trim()" @click="onSubmit">Save</button>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/styles/forms' as *;
@use '@/styles/variables' as *;

.save-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
