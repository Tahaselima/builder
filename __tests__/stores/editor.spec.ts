import { useEditorStore } from '@/stores/editor'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from '@jest/globals'

describe('Editor Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addElement', () => {
    it('creates a heading element with correct defaults', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      expect(el.type).toBe('heading')
      expect(el.content).toBe('Heading')
      expect(el.fontSize).toBe(24)
      expect(el.color).toBe('#1f2937')
      expect(el.size.width).toBe(240)
      expect(el.size.height).toBe(40)
      expect(el.zIndex).toBe(1) // nextZIndex starts at 1
    })

    it('creates a button element with correct defaults', () => {
      const editor = useEditorStore()
      const el = editor.addElement('button')

      expect(el.type).toBe('button')
      expect(el.content).toBe('Click Me')
      expect(el.backgroundColor).toBe('#4f46e5')
      expect(el.borderRadius).toBe(8)
    })

    it('places element at given position', () => {
      const editor = useEditorStore()
      const el = editor.addElement('text', { x: 50, y: 100 })

      expect(el.position).toEqual({ x: 50, y: 100 })
    })

    it('increments zIndex for each new element', () => {
      const editor = useEditorStore()
      const el1 = editor.addElement('heading')
      const el2 = editor.addElement('text')

      expect(el2.zIndex).toBeGreaterThan(el1.zIndex)
    })

    it('adds element to elements array', () => {
      const editor = useEditorStore()
      editor.addElement('heading')

      expect(editor.elements).toHaveLength(1)
    })
  })

  describe('updateElement', () => {
    it('updates content of a heading element', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.updateElement(el.id, { content: 'New Heading' })

      const updated = editor.elements.find((e) => e.id === el.id)
      expect(updated?.content).toBe('New Heading')
    })

    it('does nothing for non-existent id', () => {
      const editor = useEditorStore()
      editor.addElement('heading')

      expect(() => {
        editor.updateElement('non-existent', { content: 'test' })
      }).not.toThrow()

      expect(editor.elements).toHaveLength(1)
    })
  })

  describe('removeElement', () => {
    it('removes element from array', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.removeElement(el.id)

      expect(editor.elements).toHaveLength(0)
    })

    it('clears selectedElementId if removed element was selected', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')
      editor.selectElement(el.id)

      expect(editor.selectedElementId).toBe(el.id)

      editor.removeElement(el.id)

      expect(editor.selectedElementId).toBeNull()
    })
  })

  describe('selectElement', () => {
    it('sets selectedElementId', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.selectElement(el.id)

      expect(editor.selectedElementId).toBe(el.id)
    })

    it('returns correct selectedElement computed', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.selectElement(el.id)

      expect(editor.selectedElement?.id).toBe(el.id)
    })

    it('deselects when null is passed', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')
      editor.selectElement(el.id)

      editor.selectElement(null)

      expect(editor.selectedElementId).toBeNull()
      expect(editor.selectedElement).toBeNull()
    })
  })

  describe('undo / redo', () => {
    it('undoes an addElement action', () => {
      const editor = useEditorStore()
      editor.addElement('heading')

      expect(editor.elements).toHaveLength(1)
      expect(editor.canUndo).toBe(true)

      editor.undo()

      expect(editor.elements).toHaveLength(0)
    })

    it('redoes an undone action', () => {
      const editor = useEditorStore()
      editor.addElement('heading')
      editor.undo()

      expect(editor.elements).toHaveLength(0)
      expect(editor.canRedo).toBe(true)

      editor.redo()

      expect(editor.elements).toHaveLength(1)
    })

    it('deselects element on undo', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')
      editor.selectElement(el.id)

      editor.undo()

      expect(editor.selectedElementId).toBeNull()
    })

    it('canUndo is false at initial state', () => {
      const editor = useEditorStore()

      expect(editor.canUndo).toBe(false)
    })

    it('canRedo is false at initial state', () => {
      const editor = useEditorStore()

      expect(editor.canRedo).toBe(false)
    })

    it('trims future history when branching', () => {
      const editor = useEditorStore()
      editor.addElement('heading') // state 1
      editor.undo() // back to state 0
      editor.addElement('text') // new state 1 (branches)

      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].type).toBe('text')
      expect(editor.canRedo).toBe(false)
    })
  })

  describe('moveElement', () => {
    it('updates element position', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.moveElement(el.id, { x: 100, y: 200 })

      const moved = editor.elements.find((e) => e.id === el.id)
      expect(moved?.position).toEqual({ x: 100, y: 200 })
    })
  })

  describe('resizeElement', () => {
    it('updates element size', () => {
      const editor = useEditorStore()
      const el = editor.addElement('button')

      editor.resizeElement(el.id, { width: 200, height: 60 })

      const resized = editor.elements.find((e) => e.id === el.id)
      expect(resized?.size).toEqual({ width: 200, height: 60 })
    })
  })

  describe('clearCanvas', () => {
    it('resets all state', () => {
      const editor = useEditorStore()
      editor.addElement('heading')
      editor.addElement('text')
      editor.selectElement(editor.elements[0].id)

      editor.clearCanvas()

      expect(editor.elements).toHaveLength(0)
      expect(editor.selectedElementId).toBeNull()
      expect(editor.canUndo).toBe(false)
      expect(editor.canRedo).toBe(false)
    })
  })

  describe('loadElements', () => {
    it('loads elements and canvas config', () => {
      const editor = useEditorStore()
      const elements = [
        {
          id: 'test-1',
          type: 'heading' as const,
          position: { x: 0, y: 0 },
          size: { width: 200, height: 40 },
          zIndex: 0,
          content: 'Loaded',
          fontSize: 24,
          color: '#000',
          align: 'left' as const
        }
      ]
      const canvas = { width: 600, height: 800, backgroundColor: '#f0f0f0' }

      editor.loadElements(elements, canvas)

      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].content).toBe('Loaded')
      expect(editor.canvas.width).toBe(600)
      expect(editor.selectedElementId).toBeNull()
      expect(editor.canUndo).toBe(false)
    })
  })

  describe('bringToFront / sendToBack', () => {
    it('brings element to front by increasing zIndex', () => {
      const editor = useEditorStore()
      const el1 = editor.addElement('heading')
      const el2 = editor.addElement('text')

      const initialZ = editor.elements.find((e) => e.id === el1.id)!.zIndex
      editor.bringToFront(el1.id)
      const newZ = editor.elements.find((e) => e.id === el1.id)!.zIndex

      expect(newZ).toBeGreaterThan(initialZ)
      expect(newZ).toBeGreaterThan(
        editor.elements.find((e) => e.id === el2.id)!.zIndex
      )
    })

    it('sends element to back by setting zIndex to 0', () => {
      const editor = useEditorStore()
      const el = editor.addElement('heading')

      editor.sendToBack(el.id)

      const z = editor.elements.find((e) => e.id === el.id)!.zIndex
      expect(z).toBe(0)
    })
  })

  describe('sortedElements', () => {
    it('returns elements sorted by zIndex ascending', () => {
      const editor = useEditorStore()
      const el1 = editor.addElement('heading') // zIndex 0
      const el2 = editor.addElement('text') // zIndex 1

      editor.sendToBack(el2.id)

      const sorted = editor.sortedElements
      expect(sorted[0].id).toBe(el2.id)
      expect(sorted[1].id).toBe(el1.id)
    })
  })
})
