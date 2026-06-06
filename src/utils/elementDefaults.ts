import { generateId } from '@/utils/id'
import type {
  ElementType,
  Size,
  CanvasConfig,
  CanvasElement,
  HeadingElement,
  TextElement,
  ButtonElement,
  ImageElement,
  DividerElement
} from '@/types'

// --- Canvas Defaults ---

export const DEFAULT_CANVAS: CanvasConfig = {
  width: 400,
  height: 500,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  boxShadow: 4,
  boxShadowOpacity: 0.08
}

// --- Element Sizes (single source of truth) ---

export const ELEMENT_DEFAULT_SIZE: Record<ElementType, Size> = {
  heading: { width: 240, height: 40 },
  text: { width: 260, height: 60 },
  button: { width: 140, height: 44 },
  image: { width: 200, height: 150 },
  divider: { width: 260, height: 4 }
}

// --- Element Colors (single source of truth) ---

export const ELEMENT_DEFAULT_COLORS: Record<ElementType, Record<string, string>> = {
  heading: { color: '#1f2937' },
  text: { color: '#374151' },
  button: { color: '#ffffff', backgroundColor: '#4f46e5' },
  image: {},
  divider: { color: '#d1d5db' }
}

// --- Element Labels ---

export const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  heading: 'Heading',
  text: 'Text',
  button: 'Button',
  image: 'Image',
  divider: 'Divider'
}

// --- Divider ---

export const DIVIDER_PADDING = 8

// --- Element Factory ---

export function createElementDefaults(type: ElementType, canvas: CanvasConfig): CanvasElement {
  const id = generateId()
  const size = ELEMENT_DEFAULT_SIZE[type]
  const colors = ELEMENT_DEFAULT_COLORS[type]
  const cx = Math.floor(canvas.width / 2 - size.width / 2)
  const cy = Math.floor(canvas.height / 2 - size.height / 2)
  const position = { x: cx, y: cy }

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        position,
        size: { ...size },
        zIndex: 0,
        content: 'Heading',
        fontSize: 24,
        color: colors.color,
        align: 'left'
      } satisfies HeadingElement
    case 'text':
      return {
        id,
        type: 'text',
        position,
        size: { ...size },
        zIndex: 0,
        content: 'Text block',
        fontSize: 14,
        color: colors.color,
        align: 'left'
      } satisfies TextElement
    case 'button':
      return {
        id,
        type: 'button',
        position,
        size: { ...size },
        zIndex: 0,
        content: 'Click Me',
        fontSize: 14,
        color: colors.color,
        backgroundColor: colors.backgroundColor!,
        borderRadius: 8,
        align: 'center'
      } satisfies ButtonElement
    case 'image':
      return {
        id,
        type: 'image',
        position,
        size: { ...size },
        zIndex: 0,
        src: '',
        alt: 'Image'
      } satisfies ImageElement
    case 'divider':
      return {
        id,
        type: 'divider',
        position,
        size: { ...size },
        zIndex: 0,
        color: colors.color,
        thickness: 2
      } satisfies DividerElement
  }
}
