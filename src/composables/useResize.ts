import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useMouseDrag } from '@/composables/useMouseDrag'
import { clamp } from '@/utils/canvas'
import type { Size, Position } from '@/types'

type HandleCorner = 'tl' | 'tr' | 'bl' | 'br'

const MIN_SIZE = 20

export function useResize(elementId: () => string) {
  const editor = useEditorStore()
  const drag = useMouseDrag()

  const activeCorner = ref<HandleCorner | null>(null)
  const startMouse = ref({ x: 0, y: 0 })
  const startSize = ref({ width: 0, height: 0 })
  const startPosition = ref({ x: 0, y: 0 })

  function onMouseMove(event: MouseEvent): void {
    if (!activeCorner.value) return

    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    const dx = event.clientX - startMouse.value.x
    const dy = event.clientY - startMouse.value.y
    const corner = activeCorner.value

    let newWidth = startSize.value.width
    let newHeight = startSize.value.height
    let newX = startPosition.value.x
    let newY = startPosition.value.y

    // Right handles affect width
    if (corner === 'tr' || corner === 'br') {
      newWidth = Math.max(MIN_SIZE, startSize.value.width + dx)
    }
    // Left handles affect width and x
    if (corner === 'tl' || corner === 'bl') {
      const maxDx = startSize.value.width - MIN_SIZE
      const clampedDx = Math.min(dx, maxDx)
      newWidth = startSize.value.width - clampedDx
      newX = startPosition.value.x + clampedDx
    }
    // Bottom handles affect height
    if (corner === 'bl' || corner === 'br') {
      newHeight = Math.max(MIN_SIZE, startSize.value.height + dy)
    }
    // Top handles affect height and y
    if (corner === 'tl' || corner === 'tr') {
      const maxDy = startSize.value.height - MIN_SIZE
      const clampedDy = Math.min(dy, maxDy)
      newHeight = startSize.value.height - clampedDy
      newY = startPosition.value.y + clampedDy
    }

    // Clamp within canvas bounds
    newX = clamp(newX, 0, editor.canvas.width - MIN_SIZE)
    newY = clamp(newY, 0, editor.canvas.height - MIN_SIZE)
    newWidth = clamp(newWidth, MIN_SIZE, editor.canvas.width - newX)
    newHeight = clamp(newHeight, MIN_SIZE, editor.canvas.height - newY)

    const newSize: Size = { width: newWidth, height: newHeight }
    const newPos: Position = { x: newX, y: newY }

    editor.moveElement(id, newPos)
    editor.resizeElement(id, newSize)
  }

  function onMouseUp(): void {
    activeCorner.value = null
    editor.commitMoveResize()
    drag.detach()
  }

  function onMouseDown(event: MouseEvent, corner: HandleCorner): void {
    event.stopPropagation()
    event.preventDefault()

    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    activeCorner.value = corner
    startMouse.value = { x: event.clientX, y: event.clientY }
    startSize.value = { ...el.size }
    startPosition.value = { ...el.position }

    drag.attach(onMouseMove, onMouseUp)
  }

  return {
    isResizing: drag.isActive,
    onMouseDown
  }
}
