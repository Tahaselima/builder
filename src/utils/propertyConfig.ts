import type { ElementType } from '@/types'

export type FieldType = 'text' | 'textarea' | 'number' | 'color' | 'align'

export interface PropertyFieldConfig {
  key: string
  label: string
  type: FieldType
  min?: number
  max?: number
  placeholder?: string
}

export const propertyConfigs: Record<ElementType, PropertyFieldConfig[]> = {
  heading: [
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 72 },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'align', label: 'Align', type: 'align' }
  ],
  text: [
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 72 },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'align', label: 'Align', type: 'align' }
  ],
  button: [
    { key: 'content', label: 'Text', type: 'text' },
    { key: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 72 },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'borderRadius', label: 'Border Radius', type: 'number', min: 0, max: 50 },
    { key: 'align', label: 'Align', type: 'align' }
  ],
  image: [
    { key: 'src', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Describe the image' }
  ],
  divider: [
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'thickness', label: 'Thickness', type: 'number', min: 1, max: 20 }
  ]
}
