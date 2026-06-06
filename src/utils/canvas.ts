import type { Position, Size, CanvasConfig } from '@/types'

/**
 * Clamp a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * Clamp a position so an element of the given size stays within canvas bounds.
 */
export function clampPosition(
  pos: Position,
  elementSize: Size,
  canvasConfig: CanvasConfig
): Position {
  return {
    x: clamp(pos.x, 0, canvasConfig.width - elementSize.width),
    y: clamp(pos.y, 0, canvasConfig.height - elementSize.height)
  }
}
