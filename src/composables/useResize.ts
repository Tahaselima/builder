import { ref } from 'vue'
import { useEditorStore } from '@/stores'
import { useMouseDrag } from '@/composables'
import { clamp, snapPosition, snapSize, MIN_ELEMENT_SIZE } from '@/utils'
import type { Size, Position } from '@/types'

type HandleCorner = 'tl' | 'tr' | 'bl' | 'br'

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
      newWidth = Math.max(MIN_ELEMENT_SIZE, startSize.value.width + dx)
    }
    // Left handles affect width and x
    if (corner === 'tl' || corner === 'bl') {
      const maxDx = startSize.value.width - MIN_ELEMENT_SIZE
      const clampedDx = Math.min(dx, maxDx)
      newWidth = startSize.value.width - clampedDx
      newX = startPosition.value.x + clampedDx
    }
    // Bottom handles affect height
    if (corner === 'bl' || corner === 'br') {
      newHeight = Math.max(MIN_ELEMENT_SIZE, startSize.value.height + dy)
    }
    // Top handles affect height and y
    if (corner === 'tl' || corner === 'tr') {
      const maxDy = startSize.value.height - MIN_ELEMENT_SIZE
      const clampedDy = Math.min(dy, maxDy)
      newHeight = startSize.value.height - clampedDy
      newY = startPosition.value.y + clampedDy
    }

    // Clamp within canvas bounds
    newX = clamp(newX, 0, editor.canvas.width - MIN_ELEMENT_SIZE)
    newY = clamp(newY, 0, editor.canvas.height - MIN_ELEMENT_SIZE)
    newWidth = clamp(newWidth, MIN_ELEMENT_SIZE, editor.canvas.width - newX)
    newHeight = clamp(newHeight, MIN_ELEMENT_SIZE, editor.canvas.height - newY)

    // Snap to grid if enabled
    if (editor.gridEnabled) {
      const snapped = snapSize({ width: newWidth, height: newHeight }, editor.gridSize, MIN_ELEMENT_SIZE)
      newWidth = snapped.width
      newHeight = snapped.height
      const snappedPos = snapPosition({ x: newX, y: newY }, editor.gridSize)
      newX = clamp(snappedPos.x, 0, editor.canvas.width - newWidth)
      newY = clamp(snappedPos.y, 0, editor.canvas.height - newHeight)
    }

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

  function startResize(clientX: number, clientY: number, corner: HandleCorner): void {
    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    activeCorner.value = corner
    startMouse.value = { x: clientX, y: clientY }
    startSize.value = { ...el.size }
    startPosition.value = { ...el.position }

    drag.attach(onMouseMove, onMouseUp)
  }

  function onMouseDown(event: MouseEvent, corner: HandleCorner): void {
    event.stopPropagation()
    event.preventDefault()
    startResize(event.clientX, event.clientY, corner)
  }

  function onTouchStart(event: TouchEvent, corner: HandleCorner): void {
    event.stopPropagation()
    event.preventDefault()
    const touch = event.touches[0]
    if (!touch) return
    startResize(touch.clientX, touch.clientY, corner)
  }

  return {
    isResizing: drag.isActive,
    onMouseDown,
    onTouchStart
  }
}
