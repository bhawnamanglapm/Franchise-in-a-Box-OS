import { defineConfig } from '@playwright/test'

// Runs the 9-step script (docs/requirements/R2B-whatsapp-agent-panel/tasks.md) at desktop and phone width.
// Local: builds and serves the app on :4173. Live: BASE_URL=https://fiab-r2b-whatsapp-agent-panel.vercel.app npm run e2e
const live = process.env.BASE_URL

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  reporter: 'list',
  outputDir: 'tests/e2e/.results',
  use: {
    baseURL: live ?? 'http://localhost:4173',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone-375', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: live ? undefined : {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
