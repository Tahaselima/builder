import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from '@jest/globals'
import CanvasElement from '@/components/canvas/CanvasElement.vue'
import { useEditorStore } from '@/stores/editor'
import type { HeadingElement, ButtonElement, DividerElement } from '@/types'

describe('CanvasElement', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function createWrapper(element: Parameters<typeof CanvasElement>[0]['element']) {
    return mount(CanvasElement, {
      props: { element }
    })
  }

  it('renders heading content and style', () => {
    const el: HeadingElement = {
      id: 'test-1',
      type: 'heading',
      position: { x: 10, y: 20 },
      size: { width: 200, height: 40 },
      zIndex: 1,
      content: 'Hello World',
      fontSize: 24,
      color: '#ff0000',
      align: 'center'
    }

    const wrapper = createWrapper(el)

    expect(wrapper.text()).toContain('Hello World')
    expect(wrapper.find('.canvas-element__heading').attributes('style')).toContain('font-size: 24px')
    expect(wrapper.find('.canvas-element__heading').attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find('.canvas-element__heading').attributes('style')).toContain('text-align: center')
  })

  it('renders button with correct styles', () => {
    const el: ButtonElement = {
      id: 'test-2',
      type: 'button',
      position: { x: 0, y: 0 },
      size: { width: 140, height: 44 },
      zIndex: 1,
      content: 'Click Me',
      fontSize: 14,
      color: '#ffffff',
      backgroundColor: '#4f46e5',
      borderRadius: 12,
      align: 'center'
    }

    const wrapper = createWrapper(el)

    expect(wrapper.text()).toContain('Click Me')
    const btnStyle = wrapper.find('.canvas-element__button').attributes('style')
    expect(btnStyle).toContain('background-color: rgb(79, 70, 229)')
    expect(btnStyle).toContain('border-radius: 12px')
  })

  it('positions element with absolute left/top', () => {
    const el: HeadingElement = {
      id: 'test-3',
      type: 'heading',
      position: { x: 50, y: 100 },
      size: { width: 200, height: 40 },
      zIndex: 1,
      content: 'Test',
      fontSize: 20,
      color: '#000',
      align: 'left'
    }

    const wrapper = createWrapper(el)
    const style = wrapper.find('.canvas-element').attributes('style')

    expect(style).toContain('left: 50px')
    expect(style).toContain('top: 100px')
    expect(style).toContain('width: 200px')
    expect(style).toContain('height: 40px')
  })

  it('does not show resize handles when not selected', () => {
    const editor = useEditorStore()
    const el: HeadingElement = {
      id: 'test-4',
      type: 'heading',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 40 },
      zIndex: 1,
      content: 'Test',
      fontSize: 20,
      color: '#000',
      align: 'left'
    }

    editor.selectElement(null)
    const wrapper = createWrapper(el)

    expect(wrapper.findAll('.resize-handle')).toHaveLength(0)
  })

  it('shows resize handles when selected', async () => {
    const editor = useEditorStore()
    const el: HeadingElement = {
      id: 'test-5',
      type: 'heading',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 40 },
      zIndex: 1,
      content: 'Test',
      fontSize: 20,
      color: '#000',
      align: 'left'
    }

    editor.selectElement('test-5')
    const wrapper = createWrapper(el)

    expect(wrapper.findAll('.resize-handle')).toHaveLength(4)
  })

  it('renders divider with correct background color', () => {
    const el: DividerElement = {
      id: 'test-6',
      type: 'divider',
      position: { x: 0, y: 0 },
      size: { width: 260, height: 12 },
      zIndex: 1,
      color: '#d1d5db',
      thickness: 4
    }

    const wrapper = createWrapper(el)
    const dividerStyle = wrapper.find('.canvas-element__divider').attributes('style')

    expect(dividerStyle).toContain('background-color: rgb(209, 213, 219)')
    expect(dividerStyle).toContain('height: 4px')
  })
})
