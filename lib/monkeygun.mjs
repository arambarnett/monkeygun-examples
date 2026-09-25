// Minimal Monkeygun client. Node 18+, no dependencies.
// Docs: https://monkey-gun.gitbook.io/monkeygun

const BASE = (process.env.MONKEYGUN_API_URL ?? 'https://api.monkeygun.com').replace(/\/$/, '')
const KEY = process.env.MONKEYGUN_API_KEY
if (!KEY) { console.error('Set MONKEYGUN_API_KEY (Monkeygun → Settings → Developer).'); process.exit(1) }

export async function api(path, body, method = body ? 'POST' : 'GET') {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) throw new Error(`${method} ${path} → ${res.status}: ${json.error ?? JSON.stringify(json).slice(0, 200)}`)
  return json
}

/** Tool catalog call: POST /v1/tools/{name}. */
export const tool = (name, args = {}) => api(`/v1/tools/${name}`, args)

/** Poll GET /v1/videos/{id} until rendered (or error). */
export async function waitForVideo(videoId, { every = 5000, timeout = 10 * 60_000 } = {}) {
  const t0 = Date.now()
  for (;;) {
    const v = await api(`/v1/videos/${videoId}`)
    if (v.status === 'rendered') return v
    if (v.status === 'error') throw new Error(`video ${videoId} failed: ${v.lastError}`)
    if (Date.now() - t0 > timeout) throw new Error(`video ${videoId} still ${v.status} after ${timeout / 1000}s`)
    process.stdout.write(`  ${videoId} ${v.status}…\r`)
    await new Promise(r => setTimeout(r, every))
  }
}

/** Poll GET /v1/jobs/{id} for an async from-data call, then wait for the render. */
export async function waitForJob(jobId, opts) {
  for (;;) {
    const j = await api(`/v1/jobs/${jobId}`)
    if (j.status === 'failed') throw new Error(`job ${jobId} failed: ${j.error}`)
    if (j.videoId) return waitForVideo(j.videoId, opts)
    process.stdout.write(`  ${jobId} ${j.status}…\r`)
    await new Promise(r => setTimeout(r, 5000))
  }
}

export function done(v) {
  console.log(`\n✔ ${v.videoId} · ${v.title} · ${v.duration}s`)
  console.log(`  play   ${v.renderUrl}`)
  console.log(`  share  ${v.watchUrl}`)
  console.log(`  poster ${v.thumbnail}`)
}
