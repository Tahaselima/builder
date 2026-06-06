import type { Template } from '@/types'
import { validateTemplate } from '@/utils/validation'

const AI_STORAGE_KEY = 'builder_openai_key'
const MODEL = 'gpt-4o-mini'

export function getApiKey(): string {
  return localStorage.getItem(AI_STORAGE_KEY) ?? ''
}

export function setApiKey(key: string): void {
  localStorage.setItem(AI_STORAGE_KEY, key)
}

export function hasApiKey(): boolean {
  return !!getApiKey().trim()
}

interface AIGenerateOptions {
  prompt: string
  apiKey: string
}

export async function generateTemplate(options: AIGenerateOptions): Promise<Template> {
  const { prompt, apiKey } = options

  const systemPrompt = `You are a template builder AI. You generate JSON templates for a visual builder.

The template must follow this exact TypeScript interface:

interface Position { x: number; y: number }
interface Size { width: number; height: number }
interface CanvasConfig { width: number; height: number; backgroundColor: string; borderRadius?: number; boxShadow?: number; boxShadowOpacity?: number }
interface Template { id: string; name: string; elements: CanvasElement[]; canvas: CanvasConfig; createdAt: string; updatedAt: string }

Element types (CanvasElement is a discriminated union):
- HeadingElement: { type: 'heading', position, size, zIndex, content: string, fontSize: number, color: string, align: 'left'|'center'|'right' }
- TextElement: { type: 'text', position, size, zIndex, content: string, fontSize: number, color: string, align: 'left'|'center'|'right' }
- ButtonElement: { type: 'button', position, size, zIndex, content: string, href: string, fontSize: number, color: string, backgroundColor: string, borderRadius: number, align: 'left'|'center'|'right' }
- ImageElement: { type: 'image', position, size, zIndex, src: string, alt: string }
- DividerElement: { type: 'divider', position, size, zIndex, color: string, thickness: number }

Rules:
- Canvas size defaults to 400x500
- Position elements thoughtfully, don't overlap
- Use realistic, meaningful content
- Use appropriate colors and sizes
- The "id" field should be a unique string for each element
- createdAt and updatedAt should be ISO date strings
- Return ONLY valid JSON, no markdown, no explanation`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a template: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('AI returned an empty response')
  }

  // Strip markdown code fences if present
  const jsonStr = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.')
  }

  // Assign defaults for missing fields before validation
  const obj = parsed as Record<string, unknown>
  if (!obj.id) obj.id = crypto.randomUUID()
  if (!obj.name) obj.name = 'AI Generated'
  if (!obj.createdAt) obj.createdAt = new Date().toISOString()
  if (!obj.updatedAt) obj.updatedAt = new Date().toISOString()

  if (Array.isArray(obj.elements)) {
    const elements = obj.elements as Record<string, unknown>[]
    elements.forEach((el) => {
      if (!el.id) el.id = crypto.randomUUID()
      if (!el.zIndex && el.zIndex !== 0) el.zIndex = 0
    })
  }

  // Validate using shared validator
  const result = validateTemplate(parsed)
  if (!result.valid) {
    throw new Error(`AI template validation failed: ${result.error}`)
  }

  return result.data
}
