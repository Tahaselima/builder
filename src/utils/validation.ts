import type { ElementType } from '@/types'

const VALID_ELEMENT_TYPES: ElementType[] = ['heading', 'text', 'button', 'image', 'divider']

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasStringField(obj: Record<string, unknown>, field: string): boolean {
  return typeof obj[field] === 'string'
}

function hasNumberField(obj: Record<string, unknown>, field: string): boolean {
  return typeof obj[field] === 'number'
}

function isValidPosition(pos: unknown): boolean {
  if (!isObject(pos)) return false
  return hasNumberField(pos, 'x') && hasNumberField(pos, 'y')
}

function isValidSize(size: unknown): boolean {
  if (!isObject(size)) return false
  return hasNumberField(size, 'width') && hasNumberField(size, 'height')
}

function isValidElement(el: unknown): boolean {
  if (!isObject(el)) return false
  if (!hasStringField(el, 'id')) return false
  if (!VALID_ELEMENT_TYPES.includes(el.type as ElementType)) return false
  if (!isValidPosition(el.position)) return false
  if (!isValidSize(el.size)) return false
  if (!hasNumberField(el, 'zIndex')) return false
  return true
}

function isValidCanvasConfig(config: unknown): boolean {
  if (!isObject(config)) return false
  return hasNumberField(config, 'width') &&
         hasNumberField(config, 'height') &&
         hasStringField(config, 'backgroundColor')
}

export function validateTemplate(data: unknown): { valid: boolean; error?: string } {
  if (!isObject(data)) {
    return { valid: false, error: 'Invalid JSON: expected an object' }
  }

  if (!hasStringField(data, 'name')) {
    return { valid: false, error: 'Missing required field: name' }
  }

  if (!Array.isArray(data.elements)) {
    return { valid: false, error: 'Missing or invalid field: elements (must be an array)' }
  }

  for (let i = 0; i < data.elements.length; i++) {
    if (!isValidElement(data.elements[i])) {
      return { valid: false, error: `Invalid element at index ${i}` }
    }
  }

  if (!isValidCanvasConfig(data.canvas)) {
    return { valid: false, error: 'Missing or invalid field: canvas' }
  }

  return { valid: true }
}
