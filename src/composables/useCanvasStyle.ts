import { computed } from 'vue'
import type { CanvasConfig } from '@/types'

export function useCanvasStyle(canvasConfig: () => CanvasConfig) {
  const canvasStyle = computed(() => {
    const c = canvasConfig()
    return {
      width: c.width + 'px',
      height: c.height + 'px',
      backgroundColor: c.backgroundColor,
      borderRadius: c.borderRadius + 'px',
      boxShadow: `0 ${c.boxShadow}px ${c.boxShadow * 6}px rgba(0, 0, 0, ${c.boxShadowOpacity})`
    }
  })

  return { canvasStyle }
}
