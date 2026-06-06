import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEditorStore } from './editor'
import { fetchTemplates, saveTemplate, deleteTemplate } from '@/utils/api'
import { generateId } from '@/utils/id'
import type { Template } from '@/types'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      templates.value = await fetchTemplates()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function saveCurrentAsTemplate(name: string): Promise<Template | null> {
    const editor = useEditorStore()
    const now = new Date().toISOString()

    const template: Template = {
      id: generateId(),
      name,
      elements: [...editor.elements],
      canvas: { ...editor.canvas },
      createdAt: now,
      updatedAt: now
    }

    try {
      const saved = await saveTemplate(template)
      templates.value.push(saved)
      return saved
    } catch (e) {
      error.value = (e as Error).message
      return null
    }
  }

  function loadToEditor(id: string): void {
    const template = templates.value.find((t) => t.id === id)
    if (!template) return
    const editor = useEditorStore()
    editor.loadElements([...template.elements], { ...template.canvas })
  }

  async function remove(id: string): Promise<boolean> {
    try {
      await deleteTemplate(id)
      templates.value = templates.value.filter((t) => t.id !== id)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  function exportAsJson(id: string): void {
    const template = templates.value.find((t) => t.id === id)
    if (!template) return

    const json = JSON.stringify(template, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCurrentAsJson(): void {
    const editor = useEditorStore()
    const now = new Date().toISOString()
    const template: Template = {
      id: 'export',
      name: 'Untitled',
      elements: editor.elements,
      canvas: editor.canvas,
      createdAt: now,
      updatedAt: now
    }

    const json = JSON.stringify(template, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    templates,
    isLoading,
    error,
    fetchAll,
    saveCurrentAsTemplate,
    loadToEditor,
    remove,
    exportAsJson,
    exportCurrentAsJson
  }
})
