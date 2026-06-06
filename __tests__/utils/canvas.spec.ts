import { describe, it, expect } from '@jest/globals'
import {
  clamp,
  clampPosition,
  snapToGrid,
  snapPosition,
  snapSize,
  snapAndClampPosition,
  MIN_ELEMENT_SIZE
} from '@/utils/canvas'
import { validateTemplate } from '@/utils/validation'
import { createElementDefaults, DEFAULT_CANVAS, ELEMENT_DEFAULT_SIZE, ELEMENT_TYPE_LABELS } from '@/utils/elementDefaults'
import type { ElementType } from '@/types'

describe('canvas utilities', () => {
  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-1, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('clamps at boundaries', () => {
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })
  })

  describe('clampPosition', () => {
    const canvas = { width: 400, height: 500, backgroundColor: '#fff', borderRadius: 8, boxShadow: 4, boxShadowOpacity: 0.08 }

    it('keeps position inside canvas', () => {
      const result = clampPosition({ x: -10, y: -10 }, { width: 100, height: 50 }, canvas)
      expect(result).toEqual({ x: 0, y: 0 })
    })

    it('clamps so element does not exceed canvas bounds', () => {
      const result = clampPosition({ x: 350, y: 480 }, { width: 100, height: 50 }, canvas)
      expect(result).toEqual({ x: 300, y: 450 })
    })

    it('does not modify valid position', () => {
      const result = clampPosition({ x: 50, y: 50 }, { width: 100, height: 50 }, canvas)
      expect(result).toEqual({ x: 50, y: 50 })
    })
  })

  describe('snapToGrid', () => {
    it('snaps to nearest grid point', () => {
      expect(snapToGrid(12, 10)).toBe(10)
      expect(snapToGrid(17, 10)).toBe(20)
      expect(snapToGrid(15, 10)).toBe(20) // rounds up at midpoint
    })

    it('already aligned values stay the same', () => {
      expect(snapToGrid(20, 10)).toBe(20)
      expect(snapToGrid(0, 10)).toBe(0)
    })
  })

  describe('snapPosition', () => {
    it('snaps both x and y', () => {
      expect(snapPosition({ x: 12, y: 17 }, 10)).toEqual({ x: 10, y: 20 })
    })
  })

  describe('snapSize', () => {
    it('snaps and enforces minimum size', () => {
      expect(snapSize({ width: 12, height: 8 }, 10)).toEqual({ width: 20, height: MIN_ELEMENT_SIZE })
    })

    it('respects custom minimum', () => {
      expect(snapSize({ width: 5, height: 5 }, 10, 30)).toEqual({ width: 30, height: 30 })
    })
  })

  describe('snapAndClampPosition', () => {
    const canvas = { width: 400, height: 500, backgroundColor: '#fff', borderRadius: 8, boxShadow: 4, boxShadowOpacity: 0.08 }

    it('snaps then clamps within bounds', () => {
      const result = snapAndClampPosition({ x: 395, y: 495 }, { width: 100, height: 50 }, canvas, 10)
      // Snap: 395→400, 495→500 → Clamp: 400→300, 500→450
      expect(result).toEqual({ x: 300, y: 450 })
    })
  })
})

describe('validation', () => {
  it('accepts a valid template', () => {
    const result = validateTemplate({
      name: 'Test',
      elements: [
        {
          id: 'el-1',
          type: 'heading',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 40 },
          zIndex: 0,
          content: 'Hello',
          fontSize: 24,
          color: '#000',
          align: 'left'
        }
      ],
      canvas: { width: 400, height: 500, backgroundColor: '#fff' }
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.name).toBe('Test')
      expect(result.data.elements).toHaveLength(1)
    }
  })

  it('rejects missing name', () => {
    const result = validateTemplate({ elements: [], canvas: { width: 400, height: 500, backgroundColor: '#fff' } })
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('name')
  })

  it('rejects missing elements array', () => {
    const result = validateTemplate({ name: 'Test', canvas: { width: 400, height: 500, backgroundColor: '#fff' } })
    expect(result.valid).toBe(false)
  })

  it('rejects invalid element', () => {
    const result = validateTemplate({
      name: 'Test',
      elements: [{ id: 'el-1', type: 'heading' }], // missing position, size, etc.
      canvas: { width: 400, height: 500, backgroundColor: '#fff' }
    })
    expect(result.valid).toBe(false)
  })

  it('rejects invalid canvas config', () => {
    const result = validateTemplate({
      name: 'Test',
      elements: [],
      canvas: { width: 'not a number', height: 500 } // invalid
    })
    expect(result.valid).toBe(false)
  })

  it('rejects non-object input', () => {
    expect(validateTemplate(null).valid).toBe(false)
    expect(validateTemplate('string').valid).toBe(false)
    expect(validateTemplate(42).valid).toBe(false)
  })
})

describe('elementDefaults', () => {
  it('creates each element type with correct structure', () => {
    const types: ElementType[] = ['heading', 'text', 'button', 'image', 'divider']

    types.forEach((type) => {
      const el = createElementDefaults(type, DEFAULT_CANVAS)
      expect(el.type).toBe(type)
      expect(el.id).toBeTruthy()
      expect(el.position.x).toBeGreaterThanOrEqual(0)
      expect(el.position.y).toBeGreaterThanOrEqual(0)
      expect(el.size.width).toBe(ELEMENT_DEFAULT_SIZE[type].width)
      expect(el.size.height).toBe(ELEMENT_DEFAULT_SIZE[type].height)
    })
  })

  it('uses provided canvas for centering', () => {
    const canvas = { ...DEFAULT_CANVAS, width: 800, height: 600 }
    const el = createElementDefaults('button', canvas)
    const expectedX = Math.floor(800 / 2 - ELEMENT_DEFAULT_SIZE.button.width / 2)
    const expectedY = Math.floor(600 / 2 - ELEMENT_DEFAULT_SIZE.button.height / 2)
    expect(el.position).toEqual({ x: expectedX, y: expectedY })
  })

  it('provides labels for all element types', () => {
    const types: ElementType[] = ['heading', 'text', 'button', 'image', 'divider']
    types.forEach((type) => {
      expect(ELEMENT_TYPE_LABELS[type]).toBeTruthy()
      expect(typeof ELEMENT_TYPE_LABELS[type]).toBe('string')
    })
  })

  it('DEFAULT_CANVAS has all required fields', () => {
    expect(DEFAULT_CANVAS.width).toBe(400)
    expect(DEFAULT_CANVAS.height).toBe(500)
    expect(DEFAULT_CANVAS.backgroundColor).toBe('#ffffff')
    expect(typeof DEFAULT_CANVAS.borderRadius).toBe('number')
    expect(typeof DEFAULT_CANVAS.boxShadow).toBe('number')
    expect(typeof DEFAULT_CANVAS.boxShadowOpacity).toBe('number')
  })
})
