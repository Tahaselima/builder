import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  CanvasElement,
  CanvasConfig,
  ElementUpdate,
  ElementType,
  Position,
  Size
} from '@/types'
import { DEFAULT_CANVAS, createElementDefaults, DIVIDER_PADDING } from '@/utils/elementDefaults'
import { generateId } from '@/utils/id'
import { clamp } from '@/utils/canvas'

export const useEditorStore = defineStore('editor', () => {
  // --- State ---
  const elements = ref<CanvasElement[]>([])
  const selectedElementId = ref<string | null>(null)
  const canvas = ref<CanvasConfig>({ ...DEFAULT_CANVAS })
  const nextZIndex = ref(1)

  // Grid snap
  const gridEnabled = ref(false)
  const gridSize = ref(10)

  // Clipboard
  const clipboard = ref<CanvasElement | null>(null)

  // Undo/Redo history
  const history = ref<string[]>([JSON.stringify([])])
  const historyIndex = ref(0)
  const maxHistory = 50

  // --- Element Lookup Helpers ---
  function getElementIndex(id: string): number {
    return elements.value.findIndex((el) => el.id === id)
  }

  function getElementById(id: string): CanvasElement | undefined {
    return elements.value.find((el) => el.id === id)
  }

  // --- Getters ---
  const selectedElement = computed<CanvasElement | null>(() => {
    if (!selectedElementId.value) return null
    return getElementById(selectedElementId.value) ?? null
  })

  const sortedElements = computed<CanvasElement[]>(() => {
    return [...elements.value].sort((a, b) => a.zIndex - b.zIndex)
  })

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // --- History helpers ---
  function pushHistory(): void {
    const snapshot = JSON.stringify(elements.value)
    // Trim future states if we branched
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(snapshot)
    if (history.value.length > maxHistory) {
      history.value.shift()
    }
    historyIndex.value = history.value.length - 1
  }

  function restoreFromHistory(): void {
    try {
      elements.value = JSON.parse(history.value[historyIndex.value])
    } catch (e) {
      console.error('Failed to restore history snapshot', e)
      // Reset to last known good state
      history.value = history.value.slice(0, historyIndex.value)
    }
  }

  function undo(): void {
    if (!canUndo.value) return
    historyIndex.value--
    restoreFromHistory()
    selectedElementId.value = null
  }

  function redo(): void {
    if (!canRedo.value) return
    historyIndex.value++
    restoreFromHistory()
    selectedElementId.value = null
  }

  // --- Actions ---
  function addElement(type: ElementType, position?: Position): CanvasElement {
    const element = createElementDefaults(type, canvas.value)
    if (position) {
      element.position = { ...position }
    }
    element.zIndex = nextZIndex.value++
    elements.value.push(element)
    pushHistory()
    return element
  }

  function removeElement(id: string): void {
    elements.value = elements.value.filter((el) => el.id !== id)
    if (selectedElementId.value === id) {
      selectedElementId.value = null
    }
    pushHistory()
  }

  function updateElement(id: string, updates: ElementUpdate): void {
    const index = getElementIndex(id)
    if (index === -1) return

    const updated = { ...elements.value[index], ...updates } as CanvasElement

    // Divider: sync size.height when thickness changes
    if ('thickness' in updates && updated.type === 'divider') {
      updated.size = {
        width: updated.size.width,
        height: (updates as Record<string, unknown>).thickness as number + DIVIDER_PADDING
      }
    }

    elements.value[index] = updated
    pushHistory()
  }

  function moveElement(id: string, position: Position): void {
    const index = getElementIndex(id)
    if (index === -1) return
    elements.value[index] = { ...elements.value[index], position: { ...position } }
  }

  function resizeElement(id: string, size: Size): void {
    const index = getElementIndex(id)
    if (index === -1) return
    elements.value[index] = { ...elements.value[index], size: { ...size } }
  }

  function commitMoveResize(): void {
    pushHistory()
  }

  function selectElement(id: string | null): void {
    selectedElementId.value = id
  }

  function bringToFront(id: string): void {
    const index = getElementIndex(id)
    if (index === -1) return
    elements.value[index].zIndex = nextZIndex.value++
    pushHistory()
  }

  function sendToBack(id: string): void {
    const index = getElementIndex(id)
    if (index === -1) return
    elements.value[index].zIndex = 0
    pushHistory()
  }

  function copyElement(): void {
    if (!selectedElementId.value) return
    const el = getElementById(selectedElementId.value)
    if (!el) return
    clipboard.value = JSON.parse(JSON.stringify(el))
  }

  function pasteElement(): void {
    if (!clipboard.value) return
    const clone = JSON.parse(JSON.stringify(clipboard.value)) as CanvasElement
    clone.id = generateId()
    clone.zIndex = nextZIndex.value++
    clone.position = {
      x: clamp(clone.position.x + 20, 0, canvas.value.width - clone.size.width),
      y: clamp(clone.position.y + 20, 0, canvas.value.height - clone.size.height)
    }
    elements.value.push(clone)
    selectedElementId.value = clone.id
    pushHistory()
  }

  function duplicateElement(): void {
    if (!selectedElementId.value) return
    copyElement()
    pasteElement()
  }

  function toggleGrid(): void {
    gridEnabled.value = !gridEnabled.value
  }

  function setGridSize(size: number): void {
    gridSize.value = size
  }

  function clearCanvas(): void {
    elements.value = []
    selectedElementId.value = null
    nextZIndex.value = 1
    canvas.value = { ...DEFAULT_CANVAS }
    history.value = [JSON.stringify([])]
    historyIndex.value = 0
  }

  function loadElements(newElements: CanvasElement[], newCanvas: CanvasConfig): void {
    elements.value = [...newElements]
    canvas.value = { ...newCanvas }
    selectedElementId.value = null
    nextZIndex.value = Math.max(0, ...newElements.map((el) => el.zIndex)) + 1
    history.value = [JSON.stringify(newElements)]
    historyIndex.value = 0
  }

  return {
    // State
    elements,
    selectedElementId,
    canvas,
    nextZIndex,
    gridEnabled,
    gridSize,
    clipboard,
    // Getters
    selectedElement,
    sortedElements,
    canUndo,
    canRedo,
    // Helpers
    getElementById,
    // Actions
    addElement,
    removeElement,
    updateElement,
    moveElement,
    resizeElement,
    commitMoveResize,
    selectElement,
    bringToFront,
    sendToBack,
    copyElement,
    pasteElement,
    duplicateElement,
    toggleGrid,
    setGridSize,
    clearCanvas,
    loadElements,
    undo,
    redo
  }
})
