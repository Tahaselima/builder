import { ref, onUnmounted } from 'vue'

/**
 * Shared mouse drag lifecycle composable.
 * Manages document-level mousemove/mouseup listener attach/detach.
 */
export function useMouseDrag() {
  const isActive = ref(false)

  let moveHandler: ((e: MouseEvent) => void) | null = null
  let upHandler: ((e: MouseEvent) => void) | null = null

  function attach(
    onMove: (e: MouseEvent) => void,
    onUp: (e: MouseEvent) => void
  ): void {
    moveHandler = onMove
    upHandler = onUp
    isActive.value = true
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function detach(): void {
    if (moveHandler) {
      document.removeEventListener('mousemove', moveHandler)
    }
    if (upHandler) {
      document.removeEventListener('mouseup', upHandler)
    }
    moveHandler = null
    upHandler = null
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
