import pino from 'pino'
import pinoHttp from 'pino-http'
import express, { Express } from 'express'
import { collectDefaultMetrics, register } from 'prom-client'

const APP_NAME = process.env.OTEL_SERVICE_NAME

const logger = pino()
const httpLogger = pinoHttp({
  redact: ['res', 'req.headers']
})

collectDefaultMetrics({
  labels: { NODE_APP_INSTANCE: APP_NAME },
})

const PORT: number = parseInt(process.env.PORT || '8080')
const app: Express = express()


// This endpoint is for collecting Prometheus metrics; it should not be exposed to the Internet
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (err) {
    res.status(500).end(err)
  }
})

app.use(express.static('public'))

app.use(httpLogger)

app.get('/hello', (req, res) => {
  res.json({ msg: 'Hello Demo', when: new Date().toLocaleTimeString() })
})

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT} for ${APP_NAME}`)
})
