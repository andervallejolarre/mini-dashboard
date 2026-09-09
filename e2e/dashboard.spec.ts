import { test, expect } from '@playwright/test'

test('selecting a country loads its coffee production', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /ecuador's coffee production/i })
  ).toBeVisible()

  await page.getByRole('button', { name: 'peru' }).click()

  await expect(
    page.getByRole('heading', { name: /peru's coffee production/i })
  ).toBeVisible()

  await expect(page.locator('.recharts-wrapper')).toBeVisible()
})