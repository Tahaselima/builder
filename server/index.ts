import express from 'express'
import cors from 'cors'
import { templatesRouter } from './routes/templates.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

app.use(cors())
app.use(express.json())

app.use('/api', templatesRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
