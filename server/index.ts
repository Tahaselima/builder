import express from 'express'
import cors from 'cors'
import { templatesRouter } from './routes/templates.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

app.use(cors())
app.use(express.json())

app.use('/api', templatesRouter)

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
