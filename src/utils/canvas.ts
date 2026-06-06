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

/**
 * Snap a single value to the nearest grid point.
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Snap both x and y of a position to grid.
 */
export function snapPosition(pos: Position, gridSize: number): Position {
  return {
    x: snapToGrid(pos.x, gridSize),
    y: snapToGrid(pos.y, gridSize)
  }
}

/**
 * Snap a size to grid, respecting minimum size.
 */
export function snapSize(size: Size, gridSize: number, minSize: number = 20): Size {
  return {
    width: Math.max(minSize, snapToGrid(size.width, gridSize)),
    height: Math.max(minSize, snapToGrid(size.height, gridSize))
  }
}
