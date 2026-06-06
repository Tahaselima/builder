import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

type Template = {
  id: string
  name: string
  elements: unknown[]
  canvas: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

const STORE_NAME = 'templates'
const STORE_KEY = 'all'

function getTemplateStore(context: HandlerContext) {
  return getStore({ name: STORE_NAME, consistency: 'strong' })
}

async function loadAll(context: HandlerContext): Promise<Template[]> {
  const store = getTemplateStore(context)
  const raw = await store.get(STORE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Template[]
  } catch {
    return []
  }
}

async function saveAll(templates: Template[], context: HandlerContext): Promise<void> {
  const store = getTemplateStore(context)
  await store.set(STORE_KEY, JSON.stringify(templates))
}

function isValidTemplate(body: unknown): body is Template {
  if (!body || typeof body !== 'object') return false
  const obj = body as Record<string, unknown>
  if (typeof obj.id !== 'string' || typeof obj.name !== 'string') return false
  if (!Array.isArray(obj.elements)) return false
  if (!obj.canvas || typeof obj.canvas !== 'object') return false
  const canvas = obj.canvas as Record<string, unknown>
  if (typeof canvas.width !== 'number' || typeof canvas.height !== 'number') return false
  if (typeof canvas.backgroundColor !== 'string') return false
  return true
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const method = event.httpMethod
  const path = event.path.replace('/api/templates', '').replace('/.netlify/functions/api-templates', '')

  try {
    // GET /api/templates — List all
    if (method === 'GET' && (path === '' || path === '/')) {
      const templates = await loadAll(context)
      return jsonResponse(200, templates)
    }

    // POST /api/templates — Create or update
    if (method === 'POST' && (path === '' || path === '/')) {
      let body: unknown
      try {
        body = JSON.parse(event.body ?? '{}')
      } catch {
        return jsonResponse(400, { success: false, error: 'Invalid JSON body' })
      }

      if (!isValidTemplate(body)) {
        return jsonResponse(400, { success: false, error: 'Invalid template payload' })
      }

      const templates = await loadAll(context)
      const existingIndex = templates.findIndex((t) => t.id === body.id)
      const now = new Date().toISOString()

      if (existingIndex >= 0) {
        templates[existingIndex] = { ...body, updatedAt: now }
      } else {
        templates.push({ ...body, createdAt: now, updatedAt: now })
      }

      await saveAll(templates, context)
      return jsonResponse(200, body)
    }

    // DELETE /api/templates/:id — Delete
    if (method === 'DELETE' && path.startsWith('/')) {
      const id = path.slice(1)
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing template id' })
      }

      const templates = await loadAll(context)
      const filtered = templates.filter((t) => t.id !== id)

      if (filtered.length === templates.length) {
        return jsonResponse(404, { success: false, error: 'Template not found' })
      }

      await saveAll(filtered, context)
      return { statusCode: 204, body: '' }
    }

    return jsonResponse(404, { success: false, error: 'Not found' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return jsonResponse(500, { success: false, error: message })
  }
}
