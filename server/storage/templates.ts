import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Template } from '../../src/types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'templates.json')

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
  }
}

export function loadAll(): Template[] {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as Template[]
}

export function saveAll(templates: Template[]): void {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2), 'utf-8')
}
