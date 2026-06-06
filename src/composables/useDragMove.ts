import { ref } from 'vue'
import { useEditorStore } from '@/stores'
import { useMouseDrag } from '@/composables'
import { clampPosition, snapAndClampPosition } from '@/utils'

export function useDragMove(elementId: () => string) {
  const editor = useEditorStore()
  const drag = useMouseDrag()

  const startMouse = ref({ x: 0, y: 0 })
  const startPosition = ref({ x: 0, y: 0 })

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

  return {
    isDragging: drag.isActive,
    onMouseDown
  }
}
