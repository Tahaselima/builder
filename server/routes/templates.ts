import { Router, type Request, type Response } from 'express'
import { loadAll, saveAll } from '../storage/templates.js'
import type { Template } from '../../src/types/index.js'

export const templatesRouter = Router()

// --- Runtime validation ---

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

// GET /api/templates — List all templates
templatesRouter.get('/templates', (_req: Request, res: Response) => {
  try {
    const templates = loadAll()
    res.json(templates)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to load templates' })
  }
})

// POST /api/templates — Create or update template (upsert by id)
templatesRouter.post('/templates', (req: Request, res: Response) => {
  try {
    if (!isValidTemplate(req.body)) {
      res.status(400).json({ success: false, error: 'Invalid template payload' })
      return
    }

    const template = req.body
    const templates = loadAll()
    const existingIndex = templates.findIndex((t) => t.id === template.id)

    const now = new Date().toISOString()

    if (existingIndex >= 0) {
      templates[existingIndex] = { ...template, updatedAt: now }
    } else {
      templates.push({ ...template, createdAt: now, updatedAt: now })
    }

    saveAll(templates)
    res.json(template)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to save template' })
  }
})

// DELETE /api/templates/:id — Delete template by id
templatesRouter.delete('/templates/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const templates = loadAll()
    const filtered = templates.filter((t) => t.id !== id)

    if (filtered.length === templates.length) {
      res.status(404).json({ success: false, error: 'Template not found' })
      return
    }

    saveAll(filtered)
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to delete template' })
  }
})
