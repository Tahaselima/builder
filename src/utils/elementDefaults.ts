import type { ElementType, Size } from '@/types'

export const ELEMENT_DEFAULT_SIZE: Record<ElementType, Size> = {
  heading: { width: 240, height: 40 },
  text: { width: 260, height: 60 },
  button: { width: 140, height: 44 },
  image: { width: 200, height: 150 },
  divider: { width: 260, height: 4 }
}

export const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  heading: 'Heading',
  text: 'Text',
  button: 'Button',
  image: 'Image',
  divider: 'Divider'
}
