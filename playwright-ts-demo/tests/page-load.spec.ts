import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, MAX_LOAD_MS, USER } from './config';

/** Time from navigation start to the end of the load event, in milliseconds. */
async function loadTimeMs(page: Page): Promise<number> {
  await page.waitForFunction(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return !!nav && nav.loadEventEnd > 0;
  });
  return page.evaluate(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return Math.round(nav.loadEventEnd - nav.startTime);
  });
}

test.describe('Page load time', () => {
  test(`login page loads within ${MAX_LOAD_MS} ms`, async ({ page }) => {
    await new LoginPage(page).open();

    const ms = await loadTimeMs(page);
    console.log(`login page loaded in ${ms} ms`);
    expect(ms).toBeLessThan(MAX_LOAD_MS);
  });

  /**
   * A small check that several users can log in at the same time.
   * This is a smoke check, not a load test: keep the number low on a public demo site.
   * For real load testing use a tool built for it (JMeter, k6, Locust).
   */
  test('five users can log in at the same time', async ({ browser }) => {
    const users = 5;

    const timings = await Promise.all(
      Array.from({ length: users }, async () => {
        const context = await browser.newContext({ baseURL: BASE_URL });
        const page = await context.newPage();
        const started = Date.now();

        const login = new LoginPage(page);
        await login.open();
        await login.login(USER.name, USER.password);
        await expect(page.getByTestId('title')).toHaveText('Products');

        const elapsed = Date.now() - started;
        await context.close();
        return elapsed;
      }),
    );

    console.log(`concurrent login times (ms): ${timings.join(', ')}`);
    for (const ms of timings) expect(ms).toBeLessThan(MAX_LOAD_MS * 2);
  });
});

test.describe('Opening several screens in a row', () => {
  // Product detail pages stand in for the many forms/screens a trading app opens.
  for (const id of [0, 1, 2, 3, 4, 5]) {
    test(`detail screen ${id} loads within ${MAX_LOAD_MS} ms`, async ({ inventoryPage, page }) => {
      await expect(inventoryPage.title()).toHaveText('Products');

      await page.goto(`/inventory-item.html?id=${id}`);

      await expect(page.getByTestId('inventory-item-name')).toBeVisible();
      const ms = await loadTimeMs(page);
      console.log(`detail screen ${id} loaded in ${ms} ms`);
      expect(ms).toBeLessThan(MAX_LOAD_MS);
    });
  }
});
