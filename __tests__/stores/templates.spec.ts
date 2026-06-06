import { useEditorStore } from '@/stores/editor'
import { useTemplatesStore } from '@/stores/templates'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from '@jest/globals'

describe('Templates Store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('importFromJson', () => {
    function makeJsonFile(data: unknown): File {
      return new File([JSON.stringify(data)], 'test.json', { type: 'application/json' })
    }

    it('rejects invalid JSON file content', async () => {
      const templates = useTemplatesStore()
      const file = new File(['not json'], 'test.json', { type: 'application/json' })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(false)
      expect(result.error).toContain('parse')
    })

    it('rejects template missing name', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        elements: [],
        canvas: { width: 400, height: 500, backgroundColor: '#fff' }
      })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(false)
      expect(result.error).toContain('name')
    })

    it('rejects template with invalid elements', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        name: 'Bad',
        elements: [{ type: 'heading' }], // missing required fields
        canvas: { width: 400, height: 500, backgroundColor: '#fff' }
      })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(false)
    })

    it('rejects template with invalid canvas config', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        name: 'Bad Canvas',
        elements: [],
        canvas: { width: 'not-a-number', height: 500 }
      })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(false)
      expect(result.error).toContain('canvas')
    })

    it('loads a valid heading template into editor', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        name: 'Heading Test',
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
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(true)

      const editor = useEditorStore()
      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].content).toBe('Hello')
      expect(editor.canvas.width).toBe(400)
    })

    it('loads a valid button template into editor', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        name: 'Button Test',
        elements: [
          {
            id: 'el-1',
            type: 'button',
            position: { x: 10, y: 20 },
            size: { width: 140, height: 44 },
            zIndex: 1,
            content: 'Click',
            href: '#',
            fontSize: 14,
            color: '#fff',
            backgroundColor: '#4f46e5',
            borderRadius: 8,
            align: 'center'
          }
        ],
        canvas: { width: 600, height: 800, backgroundColor: '#f0f0f0' }
      })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(true)

      const editor = useEditorStore()
      expect(editor.elements[0].type).toBe('button')
      expect(editor.canvas.backgroundColor).toBe('#f0f0f0')
    })

    it('loads a multi-element template correctly', async () => {
      const templates = useTemplatesStore()
      const file = makeJsonFile({
        name: 'Multi',
        elements: [
          {
            id: 'el-1', type: 'heading', position: { x: 0, y: 0 },
            size: { width: 200, height: 40 }, zIndex: 0,
            content: 'Title', fontSize: 24, color: '#000', align: 'left'
          },
          {
            id: 'el-2', type: 'divider', position: { x: 0, y: 50 },
            size: { width: 200, height: 12 }, zIndex: 1,
            color: '#ccc', thickness: 2
          }
        ],
        canvas: { width: 400, height: 500, backgroundColor: '#fff' }
      })
      const result = await templates.importFromJson(file)
      expect(result.success).toBe(true)

      const editor = useEditorStore()
      expect(editor.elements).toHaveLength(2)
    })

    it('clears previous elements when loading new template', async () => {
      const editor = useEditorStore()
      const templates = useTemplatesStore()

      // Add existing elements
      editor.addElement('heading')
      expect(editor.elements).toHaveLength(1)

      // Import new template
      const file = makeJsonFile({
        name: 'Replace',
        elements: [
          {
            id: 'el-new', type: 'text', position: { x: 0, y: 0 },
            size: { width: 200, height: 40 }, zIndex: 0,
            content: 'New', fontSize: 14, color: '#000', align: 'left'
          }
        ],
        canvas: { width: 400, height: 500, backgroundColor: '#fff' }
      })
      await templates.importFromJson(file)

      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].content).toBe('New')
    })
  })

  describe('loadToEditor', () => {
    it('loads a template from the store into editor', () => {
      const editor = useEditorStore()
      const templates = useTemplatesStore()

      const template = {
        id: 'tmpl-1',
        name: 'Test',
        elements: [
          {
            id: 'imported-1',
            type: 'text' as const,
            position: { x: 10, y: 10 },
            size: { width: 260, height: 60 },
            zIndex: 1,
            content: 'Imported text',
            fontSize: 14,
            color: '#374151',
            align: 'left' as const
          }
        ],
        canvas: { width: 300, height: 400, backgroundColor: '#eee', borderRadius: 4, boxShadow: 2, boxShadowOpacity: 0.05 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      templates.templates.push(template)
      templates.loadToEditor('tmpl-1')

      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].content).toBe('Imported text')
      expect(editor.canvas.width).toBe(300)
    })

    it('does nothing for non-existent template id', () => {
      const editor = useEditorStore()
      const templates = useTemplatesStore()
      const el = editor.addElement('heading')

      templates.loadToEditor('non-existent')

      expect(editor.elements).toHaveLength(1)
      expect(editor.elements[0].id).toBe(el.id)
    })
  })

  describe('initial state', () => {
    it('starts with empty templates', () => {
      const templates = useTemplatesStore()
      expect(templates.templates).toHaveLength(0)
      expect(templates.isLoading).toBe(false)
      expect(templates.error).toBeNull()
    })
  })
})
