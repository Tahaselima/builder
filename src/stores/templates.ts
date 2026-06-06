import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEditorStore } from './'
import { fetchTemplates, saveTemplate, deleteTemplate, generateId, downloadJson, validateTemplate } from '@/utils'
import type { Template } from '@/types'

const LOCAL_STORAGE_KEY = 'builder_templates'

function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

function loadFromLocalStorage(): Template[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToLocalStorage(data: Template[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      templates.value = await fetchTemplates()
    } catch {
      // API unavailable — fall back to localStorage cache
      templates.value = loadFromLocalStorage()
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
      error.value = getErrorMessage(e)
      // API unavailable — cache locally as fallback
      templates.value.push(template)
      saveToLocalStorage(templates.value)
      return template
    }
  }

  function loadToEditor(id: string): void {
    const template = templates.value.find((t) => t.id === id)
    if (!template) return
    const editor = useEditorStore()
    editor.loadElements([...template.elements], { ...template.canvas }, id)
  }

  async function updateExisting(name?: string): Promise<Template | null> {
    const editor = useEditorStore()
    const id = editor.loadedTemplateId
    if (!id) return null

    const index = templates.value.findIndex((t) => t.id === id)
    if (index === -1) return null

    const now = new Date().toISOString()
    const updated: Template = {
      ...templates.value[index],
      elements: [...editor.elements],
      canvas: { ...editor.canvas },
      updatedAt: now,
      ...(name ? { name } : {})
    }

    try {
      await saveTemplate(updated)
      templates.value[index] = updated
      return updated
    } catch (e) {
      error.value = getErrorMessage(e)
      templates.value[index] = updated
      saveToLocalStorage(templates.value)
      return updated
    }
  }

  async function remove(id: string): Promise<boolean> {
    try {
      await deleteTemplate(id)
      templates.value = templates.value.filter((t) => t.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage(e)
      // API unavailable — remove from local cache
      templates.value = templates.value.filter((t) => t.id !== id)
      saveToLocalStorage(templates.value)
      return true
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
          const result = e.target?.result
          if (typeof result !== 'string') {
            resolve({ success: false, error: 'Failed to read file' })
            return
          }
          const parsed = JSON.parse(result)
          const validation = validateTemplate(parsed)
          if (!validation.valid) {
            resolve({ success: false, error: validation.error })
            return
          }
          const template = validation.data
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
    updateExisting,
    loadToEditor,
    remove,
    exportAsJson,
    exportCurrentAsJson,
    importFromJson
  }
})
