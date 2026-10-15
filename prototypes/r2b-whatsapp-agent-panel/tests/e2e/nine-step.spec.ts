import { expect, test, type Page } from '@playwright/test'

// The 9-step script from docs/requirements/R2B-whatsapp-agent-panel/tasks.md, one browser session,
// each step on its own chat so a failure points at one acceptance criterion.

const HOT_LEAD = 'Mujhe franchise lena hai, budget 40 lakh, agreement bhejo'
const HOLDING = /Dhanyavaad! Hamari franchise team ka koi member/
const SHOTS = '../../outputs/R2B-whatsapp-agent-panel/screenshots'

async function openChat(page: Page, id: string) {
  const back = page.getByTestId('back')
  if (await back.isVisible()) await back.click()
  await page.getByTestId(`conv-${id}`).click()
}

/** Below xl the Simulate panel lives in a bottom sheet; open it, act, close it. */
async function withSim(page: Page, act: () => Promise<void>) {
  if (await page.getByTestId('sim-text').isVisible()) return act()
  const opener = (await page.getByTestId('open-sim').isVisible()) ? 'open-sim' : 'open-sim-md'
  await page.getByTestId(opener).click()
  await act()
  await page.getByTestId('close-sim').click()
}

const simulate = (page: Page, text: string) => withSim(page, async () => {
  await page.getByTestId('sim-text').fill(text)
  await page.getByTestId('sim-send').click()
})

/** On phone width the Why-flagged card sits in a collapsed details block. */
async function showDetails(page: Page) {
  const d = page.getByTestId('mobile-details')
  if ((await d.isVisible()) && !(await d.evaluate((el) => (el as HTMLDetailsElement).open))) await d.locator('summary').click()
}

const chip = (page: Page) => page.locator('main').getByTestId('state-chip')

test('9-step acceptance script', async ({ page }, info) => {
  const phone = info.project.name === 'phone-375'
  const shot = (name: string) => page.screenshot({ path: `${SHOTS}/e2e-${info.project.name}-${name}.png` })

  // 1. Loads with the dark theme and a computed Autonomy Rate.
  await page.goto('/')
  await expect(page.getByTestId('inbox').getByTestId('conv-c1')).toBeVisible()
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(10, 10, 15)')
  await expect(page.getByTestId('autonomy-value')).toHaveText(/\d+(\.\d+)?%/)

  // 2. Hot lead → FLAGGED with high intent + deal value, one holding message (AC1).
  await openChat(page, 'c1')
  await simulate(page, HOT_LEAD)
  await expect(chip(page)).toHaveAttribute('data-state', 'FLAGGED')
  await showDetails(page)
  await expect(page.getByTestId('flag-A1')).toBeVisible()
  await expect(page.getByTestId('flag-A2')).toBeVisible()
  await expect(page.getByTestId('thread').getByText(HOLDING)).toHaveCount(1)
  await shot('flagged')

  // 3. Claim → HUMAN_ACTIVE, AI-paused banner, composer on, and the AI stays quiet.
  await page.getByTestId('claim').click()
  await expect(chip(page)).toHaveAttribute('data-state', 'HUMAN_ACTIVE')
  await expect(page.getByTestId('ai-paused-banner')).toBeVisible()
  await expect(page.getByTestId('composer')).toBeEnabled()
  const aiBefore = await page.getByTestId('msg-ai').count()
  await simulate(page, 'Ok, waiting for your call')
  await page.waitForTimeout(2_600)
  await expect(page.getByTestId('msg-ai')).toHaveCount(aiBefore)
  await shot('human-active')

  // 4. Return to AI: blocked without a reason, allowed with one (AC4).
  await page.getByTestId('return-to-ai').click()
  await expect(page.getByTestId('confirm-return')).toBeDisabled()
  await page.getByTestId('return-reason').selectOption('Question answered')
  await page.getByTestId('confirm-return').click()
  await expect(chip(page)).toHaveAttribute('data-state', 'AI_ACTIVE')

  // 5. STOP → OPTED_OUT, every send path off (AC7); nothing overflows at 375 px.
  await simulate(page, 'STOP')
  await expect(chip(page)).toHaveAttribute('data-state', 'OPTED_OUT')
  await expect(page.getByTestId('composer-locked')).toContainText('opted out')
  await expect(page.getByTestId('composer')).toHaveCount(0)
  await expect(page.getByTestId('send-template')).toHaveCount(0)
  if (phone) expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  await shot('opted-out')

  // 6. 4,097 characters → Send off and counter red; 4,096 sends (AC5).
  await openChat(page, 'c2')
  await page.getByTestId('take-over').click()
  await expect(chip(page)).toHaveAttribute('data-state', 'HUMAN_ACTIVE')
  await page.getByTestId('composer').fill('a'.repeat(4097))
  await expect(page.getByTestId('send')).toBeDisabled()
  await expect(page.getByTestId('char-count')).toHaveAttribute('data-over', 'true')
  const humanBefore = await page.getByTestId('msg-human').count()
  await page.getByTestId('composer').fill('a'.repeat(4096))
  await expect(page.getByTestId('char-count')).toHaveAttribute('data-over', 'false')
  await page.getByTestId('send').click()
  await expect(page.getByTestId('msg-human')).toHaveCount(humanBefore + 1)

  // 7. Second consultant claims at the same moment → one winner, the other is told (AC2).
  await openChat(page, 'c5')
  await expect(chip(page)).toHaveAttribute('data-state', 'FLAGGED')
  await withSim(page, () => page.getByTestId('sim-rival').click())
  await page.getByTestId('claim').click()
  await expect(page.getByTestId('toast').filter({ hasText: 'Already claimed by Priya' })).toBeVisible()
  await expect(chip(page)).toHaveAttribute('data-state', 'HUMAN_ACTIVE')
  await expect(page.getByTestId('thread').getByTestId('system-note').filter({ hasText: /Claimed by/ })).toHaveCount(1)

  // 8. Take over inside the 2 s reply delay → the queued AI reply is cancelled (AC9).
  await openChat(page, 'c3')
  await expect(chip(page)).toHaveAttribute('data-state', 'AI_ACTIVE')
  const aiC3 = await page.getByTestId('msg-ai').count()
  await simulate(page, 'How much investment is needed?')
  await page.getByTestId('take-over').click()
  await expect(page.getByTestId('system-note').filter({ hasText: 'AI reply cancelled' })).toHaveCount(1)
  await page.waitForTimeout(2_600)
  await expect(page.getByTestId('msg-ai')).toHaveCount(aiC3)

  // 9. Double-click Take over → one assignment, one log entry (AC10).
  await openChat(page, 'c4')
  await expect(chip(page)).toHaveAttribute('data-state', 'AI_ACTIVE')
  await page.getByTestId('take-over').dblclick()
  await expect(chip(page)).toHaveAttribute('data-state', 'HUMAN_ACTIVE')
  await page.waitForTimeout(500)
  await expect(page.getByTestId('system-note').filter({ hasText: 'took over' })).toHaveCount(1)
})
