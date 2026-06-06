import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { fetchTemplates, saveTemplate, deleteTemplate } from '@/utils/api'
import { generateId } from '@/utils/id'
import { downloadJson } from '@/utils/download'
import { validateTemplate } from '@/utils/validation'
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
    downloadJson(template, `${template.name}.json`)
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
    downloadJson(template, 'template.json')
  }

  function importFromJson(file: File): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string)
          const validation = validateTemplate(parsed)
          if (!validation.valid) {
            resolve({ success: false, error: validation.error })
            return
          }
          const template = parsed as Template
          template.id = template.id || generateId()
          const editor = useEditorStore()
          editor.loadElements([...template.elements], { ...template.canvas })
          resolve({ success: true })
        } catch {
          resolve({ success: false, error: 'Invalid JSON file: could not parse' })
        }
      }
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' })
      }
      reader.readAsText(file)
    })
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
    exportCurrentAsJson,
    importFromJson
  }
})
