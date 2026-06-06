export function downloadJson(data: object, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.replace(/\s+/g, '_')
  a.click()
  URL.revokeObjectURL(url)
}
