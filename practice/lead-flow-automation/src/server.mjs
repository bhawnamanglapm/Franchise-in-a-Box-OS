// The reference flow as a small web service. n8n's Webhook nodes play this role in the n8n version.
//   GET  /webhooks/meta | /webhooks/whatsapp   Meta's verification handshake
//   POST /webhooks/meta                         Lead Ads "leadgen" events
//   POST /webhooks/whatsapp                     WhatsApp messages and delivery statuses
//   POST /jobs/followups                        the scheduled reminder sweep (run by cron)
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { env } from './config.mjs'
import { verifySignature } from './rules.mjs'
import { clock, handleMetaWebhook, handleWhatsAppWebhook, runFollowUps } from './flow.mjs'

export function createFlowServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    let raw = ''
    for await (const chunk of req) raw += chunk
    const send = (status, data) => {
      res.writeHead(status, { 'Content-Type': typeof data === 'string' ? 'text/plain' : 'application/json' })
      res.end(typeof data === 'string' ? data : JSON.stringify(data))
    }

    if (req.method === 'GET' && url.pathname.startsWith('/webhooks/')) {
      const q = url.searchParams
      if (q.get('hub.mode') === 'subscribe' && q.get('hub.verify_token') === env.VERIFY_TOKEN) return send(200, q.get('hub.challenge'))
      return send(403, 'verify token mismatch')
    }

    try {
      if (req.method === 'POST' && url.pathname.startsWith('/webhooks/')) {
        if (!verifySignature(raw, req.headers['x-hub-signature-256'], env.APP_SECRET)) return send(401, { error: 'bad signature' })
        const body = JSON.parse(raw)
        // Practice mode answers after processing so you can see the result.
        // Production: reply 200 at once and process from a queue, because Meta retries slow webhooks.
        if (url.pathname === '/webhooks/meta') return send(200, await handleMetaWebhook(body))
        if (url.pathname === '/webhooks/whatsapp') return send(200, await handleWhatsAppWebhook(body))
      }
      if (req.method === 'POST' && url.pathname === '/jobs/followups') return send(200, await runFollowUps())
      if (req.method === 'POST' && url.pathname === '/_test/clock') {
        const b = raw ? JSON.parse(raw) : {}
        clock.now = b.now ? () => new Date(b.now) : () => new Date()
        return send(200, { now: clock.now().toISOString() })
      }
      send(404, { error: 'not found' })
    } catch (e) {
      console.error(e)
      send(500, { error: e.message })
    }
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.FLOW_PORT ?? 3010)
  createFlowServer().listen(port, () => console.log(`Lead flow on http://localhost:${port}  (APIs: ${env.HUBSPOT_API_URL.replace(/\/hubspot$/, '')})`))
}
