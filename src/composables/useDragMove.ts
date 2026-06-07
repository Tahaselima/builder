import { ref, onUnmounted } from 'vue'
import { useEditorStore } from '@/stores'
import { useMouseDrag } from '@/composables'
import { clampPosition, snapAndClampPosition } from '@/utils'

const LONG_PRESS_MS = 300
const MOVE_THRESHOLD_PX = 10

export function useDragMove(elementId: () => string) {
  const editor = useEditorStore()
  const drag = useMouseDrag()

  const startMouse = ref({ x: 0, y: 0 })
  const startPosition = ref({ x: 0, y: 0 })

  let longPressTimer: ReturnType<typeof setTimeout> | null = null

  function onMouseMove(event: MouseEvent): void {
    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    const dx = event.clientX - startMouse.value.x
    const dy = event.clientY - startMouse.value.y

    const rawPos = { x: startPosition.value.x + dx, y: startPosition.value.y + dy }

    const newPos = editor.gridEnabled
      ? snapAndClampPosition(rawPos, el.size, editor.canvas, editor.gridSize)
      : clampPosition(rawPos, el.size, editor.canvas)

    editor.moveElement(id, newPos)
  }

  function onMouseUp(): void {
    editor.commitMoveResize()
    drag.detach()
  }

  function onMouseDown(event: MouseEvent): void {
    event.stopPropagation()
    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    editor.selectElement(id)
    startMouse.value = { x: event.clientX, y: event.clientY }
    startPosition.value = { ...el.position }

    drag.attach(onMouseMove, onMouseUp)
  }

  function cancelLongPress(): void {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  function onTouchStart(event: TouchEvent): void {
    event.stopPropagation()

    const touch = event.touches[0]
    if (!touch) return

    const id = elementId()
    const el = editor.getElementById(id)
    if (!el) return

    cancelLongPress()

    const startPos = { x: touch.clientX, y: touch.clientY }
    const target = event.currentTarget as HTMLElement
    let moved = false

    function onMoveDuringWait(e: TouchEvent): void {
      const t = e.touches[0]
      if (!t) return
      const dx = t.clientX - startPos.x
      const dy = t.clientY - startPos.y
      if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD_PX) {
        moved = true
        cleanup()
      }
    }

    function onEndDuringWait(): void {
      cleanup()
      // Short tap — select the element
      if (!moved) {
        editor.selectElement(id)
      }
    }

    function cleanup(): void {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
      target.removeEventListener('touchmove', onMoveDuringWait)
      target.removeEventListener('touchend', onEndDuringWait)
      target.removeEventListener('touchcancel', onEndDuringWait)
    }

    target.addEventListener('touchmove', onMoveDuringWait, { passive: true })
    target.addEventListener('touchend', onEndDuringWait)
    target.addEventListener('touchcancel', onEndDuringWait)

    longPressTimer = setTimeout(() => {
      cleanup()
      // Long press confirmed — start drag
      editor.selectElement(id)
      startMouse.value = { x: startPos.x, y: startPos.y }
      startPosition.value = { ...el.position }
      drag.attach(onMouseMove, onMouseUp)
    }, LONG_PRESS_MS)
  }

  onUnmounted(() => {
    cancelLongPress()
  })

  return {
    isDragging: drag.isActive,
    onMouseDown,
    onTouchStart
  }
}
