import { ref, onUnmounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import type { Position } from '@/types'

export function useDragMove(elementId: () => string) {
  const editor = useEditorStore()

  const isDragging = ref(false)
  const startMouse = ref({ x: 0, y: 0 })
  const startPosition = ref({ x: 0, y: 0 })

  function onMouseDown(event: MouseEvent): void {
    event.stopPropagation()
    const id = elementId()
    const el = editor.elements.find((e) => e.id === id)
    if (!el) return

    editor.selectElement(id)
    isDragging.value = true
    startMouse.value = { x: event.clientX, y: event.clientY }
    startPosition.value = { ...el.position }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event: MouseEvent): void {
    if (!isDragging.value) return

    const id = elementId()
    const el = editor.elements.find((e) => e.id === id)
    if (!el) return

    const dx = event.clientX - startMouse.value.x
    const dy = event.clientY - startMouse.value.y

    const maxX = editor.canvas.width - el.size.width
    const maxY = editor.canvas.height - el.size.height

    const newPos: Position = {
      x: Math.max(0, Math.min(startPosition.value.x + dx, maxX)),
      y: Math.max(0, Math.min(startPosition.value.y + dy, maxY))
    }

    editor.moveElement(id, newPos)
  }

  function onMouseUp(): void {
    if (!isDragging.value) return
    isDragging.value = false
    editor.commitMoveResize()

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return {
    isDragging,
    onMouseDown
  }
}
