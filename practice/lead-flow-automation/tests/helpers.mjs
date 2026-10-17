// Starts the fake APIs and the flow on free ports, wired to each other.
export async function startStack() {
  const { createMockServer } = await import('../mocks/server.mjs')
  const { createFlowServer } = await import('../src/server.mjs')
  const flow = createFlowServer()
  await new Promise((r) => flow.listen(0, r))
  const flowUrl = `http://localhost:${flow.address().port}`
  const mock = createMockServer({ flowUrl })
  await new Promise((r) => mock.listen(0, r))
  const mockUrl = `http://localhost:${mock.address().port}`
  // config.mjs reads these on every call, so setting them now is enough.
  process.env.META_GRAPH_URL = `${mockUrl}/meta/v21.0`
  process.env.WHATSAPP_API_URL = `${mockUrl}/whatsapp/v21.0`
  process.env.HUBSPOT_API_URL = `${mockUrl}/hubspot`

  const post = (base) => (path, body = {}) =>
    fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json())
  const api = post(mockUrl)
  const flowApi = post(flowUrl)
  return {
    mockUrl,
    flowUrl,
    api,
    flowApi,
    inspect: () => fetch(`${mockUrl}/_inspect`).then((r) => r.json()),
    reset: () => api('/_reset'),
    setClock: async (now) => { await api('/_test/clock', { now }); await flowApi('/_test/clock', { now }) },
    close: () => Promise.all([new Promise((r) => mock.close(r)), new Promise((r) => flow.close(r))]),
  }
}

export const lead = (over = {}) => ({
  fields: {
    full_name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone_number: '+91 98765 43210',
    city: 'Pune',
    whatsapp_consent: 'Yes',
    ...over,
  },
})
export const RAHUL = '919876543210'
