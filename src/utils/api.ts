import type { Template } from '@/types'

const BASE_URL = '/api'

function buildApiError(response: Response, fallbackMessage: string): Promise<Error> {
  return response.json()
    .then((body: { error?: string }) => {
      const detail = body.error ?? ''
      return new Error(detail ? `${fallbackMessage}: ${detail}` : `${fallbackMessage} (${response.status})`)
    })
    .catch(() => new Error(`${fallbackMessage} (${response.status})`))
}

export async function fetchTemplates(): Promise<Template[]> {
  const response = await fetch(`${BASE_URL}/templates`)
  if (!response.ok) throw await buildApiError(response, 'Failed to fetch templates')
  return response.json()
}

export async function saveTemplate(template: Template): Promise<Template> {
  const response = await fetch(`${BASE_URL}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  })
  if (!response.ok) throw await buildApiError(response, 'Failed to save template')
  return response.json()
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/templates/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok && response.status !== 204) throw await buildApiError(response, 'Failed to delete template')
}
