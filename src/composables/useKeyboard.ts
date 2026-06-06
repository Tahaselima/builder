import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { clampPosition, snapPosition } from '@/utils/canvas'

const NUDGE = 1
const NUDGE_FAST = 10

export function useKeyboard() {
  const editor = useEditorStore()

  function isEditableTarget(target: EventTarget | null): boolean {
    if (!target) return false
    const el = target as HTMLElement
    const tag = el.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (isEditableTarget(event.target)) return

    const selected = editor.selectedElementId

    // Delete / Backspace — remove selected element
    if ((event.key === 'Delete' || event.key === 'Backspace') && selected) {
      event.preventDefault()
      editor.removeElement(selected)
      return
    }

    // Escape — deselect
    if (event.key === 'Escape') {
      editor.selectElement(null)
      return
    }

    // G — toggle grid snap
    if (event.key === 'g' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      editor.toggleGrid()
      return
    }

    // Arrow keys — nudge selected element
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && selected) {
      event.preventDefault()
      const el = editor.getElementById(selected)
      if (!el) return

      const step = event.shiftKey ? NUDGE_FAST : NUDGE
      let { x, y } = el.position

      switch (event.key) {
        case 'ArrowUp':    y -= step; break
        case 'ArrowDown':  y += step; break
        case 'ArrowLeft':  x -= step; break
        case 'ArrowRight': x += step; break
      }

      if (editor.gridEnabled) {
        const snapped = snapPosition({ x, y }, editor.gridSize)
        x = snapped.x
        y = snapped.y
      }

      const newPos = clampPosition({ x, y }, el.size, editor.canvas)

      editor.moveElement(selected, newPos)
      editor.commitMoveResize()
      return
    }

    // Ctrl+C / Cmd+C — copy
    if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selected) {
      event.preventDefault()
      editor.copyElement()
      return
    }

    // Ctrl+V / Cmd+V — paste
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault()
      editor.pasteElement()
      return
    }

    // Ctrl+D / Cmd+D — duplicate
    if ((event.ctrlKey || event.metaKey) && event.key === 'd' && selected) {
      event.preventDefault()
      editor.duplicateElement()
      return
    }

    // Ctrl+Z / Cmd+Z — undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault()
      editor.undo()
      return
    }

    // Ctrl+Y / Cmd+Shift+Z — redo
    if (
      ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
    ) {
      event.preventDefault()
      editor.redo()
      return
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
  })
}
