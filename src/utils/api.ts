import type { Template } from '@/types'

const BASE_URL = '/api'

export async function fetchTemplates(): Promise<Template[]> {
  const response = await fetch(`${BASE_URL}/templates`)
  if (!response.ok) throw new Error('Failed to fetch templates')
  return response.json()
}

export async function saveTemplate(template: Template): Promise<Template> {
  const response = await fetch(`${BASE_URL}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  })
  if (!response.ok) throw new Error('Failed to save template')
  return response.json()
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/templates/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok && response.status !== 204) throw new Error('Failed to delete template')
}
