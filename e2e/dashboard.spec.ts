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

test('production data returned by FAOSTAT API has the expected shape', async ({ page }) => {
  await page.goto('/')

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/production/peru') && res.ok()),
    page.getByRole('button', { name: 'peru' }).click(),
  ])

  const production = await response.json()

  expect(Array.isArray(production)).toBe(true)
  expect(production.length).toBeGreaterThan(0)

  for (const point of production) {
    expect(point).toHaveProperty('year')
    expect(point).toHaveProperty('value')
  }
})

test('the chart widget displays the years returned by the FAOSTAT API', async ({ page }) => {
  await page.goto('/')

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/production/peru') && res.ok()),
    page.getByRole('button', { name: 'peru' }).click(),
  ])

  const production: { year: number; value: number }[] = await response.json()
  const chart = page.locator('.recharts-wrapper')
  await expect(chart).toBeVisible()

  //Recharts skips overlapping ticks when there are many data points, but always keeps the first and last
  const years = production.map(p => p.year).sort((a, b) => a - b)
  const firstYear = years[0]
  const lastYear = years[years.length - 1]

  await expect(chart.getByText(String(firstYear))).toBeVisible()
  await expect(chart.getByText(String(lastYear))).toBeVisible()
  await expect(chart.locator('.recharts-area-area').first()).toBeVisible()
})