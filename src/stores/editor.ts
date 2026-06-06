import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/utils/id'
import type {
  CanvasElement,
  CanvasConfig,
  ElementType,
  Position,
  Size,
  HeadingElement,
  TextElement,
  ButtonElement,
  ImageElement,
  DividerElement
} from '@/types'

const DEFAULT_CANVAS: CanvasConfig = {
  width: 400,
  height: 500,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  boxShadow: 4,
  boxShadowOpacity: 0.08
}

function createElementDefaults(type: ElementType, canvas: CanvasConfig): CanvasElement {
  const id = generateId()
  const cx = Math.floor(canvas.width / 2 - 60)
  const cy = Math.floor(canvas.height / 2 - 25)

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        position: { x: cx, y: cy },
        size: { width: 240, height: 40 },
        zIndex: 0,
        content: 'Heading',
        fontSize: 24,
        color: '#1f2937',
        align: 'left'
      } satisfies HeadingElement
    case 'text':
      return {
        id,
        type: 'text',
        position: { x: cx, y: cy },
        size: { width: 260, height: 60 },
        zIndex: 0,
        content: 'Text block',
        fontSize: 14,
        color: '#374151',
        align: 'left'
      } satisfies TextElement
    case 'button':
      return {
        id,
        type: 'button',
        position: { x: cx, y: cy },
        size: { width: 140, height: 44 },
        zIndex: 0,
        content: 'Click Me',
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        align: 'center'
      } satisfies ButtonElement
    case 'image':
      return {
        id,
        type: 'image',
        position: { x: cx, y: cy },
        size: { width: 200, height: 150 },
        zIndex: 0,
        src: '',
        alt: 'Image'
      } satisfies ImageElement
    case 'divider':
      return {
        id,
        type: 'divider',
        position: { x: cx, y: cy },
        size: { width: 260, height: 4 },
        zIndex: 0,
        color: '#d1d5db',
        thickness: 2
      } satisfies DividerElement
  }
}

export const useEditorStore = defineStore('editor', () => {
  // --- State ---
  const elements = ref<CanvasElement[]>([])
  const selectedElementId = ref<string | null>(null)
  const canvas = ref<CanvasConfig>({ ...DEFAULT_CANVAS })
  const nextZIndex = ref(1)

  // Undo/Redo history
  const history = ref<string[]>([JSON.stringify([])])
  const historyIndex = ref(0)
  const maxHistory = 50

  // --- Getters ---
  const selectedElement = computed<CanvasElement | null>(() => {
    if (!selectedElementId.value) return null
    return elements.value.find((el) => el.id === selectedElementId.value) ?? null
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

  function undo(): void {
    if (!canUndo.value) return
    historyIndex.value--
    elements.value = JSON.parse(history.value[historyIndex.value])
    selectedElementId.value = null
  }

  function redo(): void {
    if (!canRedo.value) return
    historyIndex.value++
    elements.value = JSON.parse(history.value[historyIndex.value])
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

  function updateElement(id: string, updates: Partial<CanvasElement>): void {
    const index = elements.value.findIndex((el) => el.id === id)
    if (index === -1) return
    elements.value[index] = { ...elements.value[index], ...updates } as CanvasElement
    pushHistory()
  }

  function moveElement(id: string, position: Position): void {
    const index = elements.value.findIndex((el) => el.id === id)
    if (index === -1) return
    elements.value[index] = { ...elements.value[index], position: { ...position } }
  }

  function resizeElement(id: string, size: Size): void {
    const index = elements.value.findIndex((el) => el.id === id)
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
    const index = elements.value.findIndex((el) => el.id === id)
    if (index === -1) return
    elements.value[index].zIndex = nextZIndex.value++
    pushHistory()
  }

  function sendToBack(id: string): void {
    const index = elements.value.findIndex((el) => el.id === id)
    if (index === -1) return
    elements.value[index].zIndex = 0
    pushHistory()
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
    // Getters
    selectedElement,
    sortedElements,
    canUndo,
    canRedo,
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
    clearCanvas,
    loadElements,
    undo,
    redo
  }
})
