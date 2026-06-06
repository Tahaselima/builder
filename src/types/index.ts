// --- Primitives ---

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

// --- Element Types ---

export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'divider'
export type HorizontalAlign = 'left' | 'center' | 'right'

// --- Base Element ---

export interface BaseElement {
  id: string
  type: ElementType
  position: Position
  size: Size
  zIndex: number
}

// --- Concrete Elements ---

export interface HeadingElement extends BaseElement {
  type: 'heading'
  content: string
  fontSize: number
  color: string
  align: HorizontalAlign
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  color: string
  align: HorizontalAlign
}

export interface ButtonElement extends BaseElement {
  type: 'button'
  content: string
  href: string
  fontSize: number
  color: string
  backgroundColor: string
  borderRadius: number
  align: HorizontalAlign
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
  alt: string
}

export interface DividerElement extends BaseElement {
  type: 'divider'
  color: string
  thickness: number
}

// --- Union ---

export type CanvasElement =
  | HeadingElement
  | TextElement
  | ButtonElement
  | ImageElement
  | DividerElement

// --- Element Update (type-safe partial per element type) ---

export type ElementUpdate =
  | Partial<Omit<HeadingElement, 'type'>> & { type?: 'heading' }
  | Partial<Omit<TextElement, 'type'>> & { type?: 'text' }
  | Partial<Omit<ButtonElement, 'type'>> & { type?: 'button' }
  | Partial<Omit<ImageElement, 'type'>> & { type?: 'image' }
  | Partial<Omit<DividerElement, 'type'>> & { type?: 'divider' }
  | Partial<BaseElement>

// --- Canvas Config ---

export interface CanvasConfig {
  width: number
  height: number
  backgroundColor: string
  borderRadius?: number
  boxShadow?: number
  boxShadowOpacity?: number
}

// --- Template ---

export interface Template {
  id: string
  name: string
  elements: CanvasElement[]
  canvas: CanvasConfig
  createdAt: string
  updatedAt: string
}

// --- API ---

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
