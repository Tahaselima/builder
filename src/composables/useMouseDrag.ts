import { ref, onUnmounted } from 'vue'

/**
 * Shared drag lifecycle composable.
 * Manages document-level mouse + touch listener attach/detach.
 */
export function useMouseDrag() {
  const isActive = ref(false)

  let moveHandler: ((e: MouseEvent) => void) | null = null
  let upHandler: ((e: MouseEvent) => void) | null = null
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null
  let touchEndHandler: ((e: TouchEvent) => void) | null = null

  function attach(
    onMove: (e: MouseEvent) => void,
    onUp: (e: MouseEvent) => void
  ): void {
    moveHandler = onMove
    upHandler = onUp
    isActive.value = true
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)

    // Touch support: translate touch events to mouse-like callbacks
    touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (!touch) return
      onMove(touch as unknown as MouseEvent)
    }
    touchEndHandler = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      if (touch) {
        onUp(touch as unknown as MouseEvent)
      }
      detach()
    }
    document.addEventListener('touchmove', touchMoveHandler, { passive: false })
    document.addEventListener('touchend', touchEndHandler)
    document.addEventListener('touchcancel', touchEndHandler)
  }

  function detach(): void {
    if (moveHandler) {
      document.removeEventListener('mousemove', moveHandler)
    }
    if (upHandler) {
      document.removeEventListener('mouseup', upHandler)
    }
    if (touchMoveHandler) {
      document.removeEventListener('touchmove', touchMoveHandler)
    }
    if (touchEndHandler) {
      document.removeEventListener('touchend', touchEndHandler)
      document.removeEventListener('touchcancel', touchEndHandler)
    }
    moveHandler = null
    upHandler = null
    touchMoveHandler = null
    touchEndHandler = null
    isActive.value = false
  }

  onUnmounted(() => {
    detach()
  })

  return {
    isActive,
    attach,
    detach
  }
}
