import { test, expect, chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Flow covered by this file (runs in order, in one worker):
 *   1. Site opens and the login page is shown
 *   2. Login works (valid, wrong password, empty fields)
 *   3. Several screens are opened: count the <form> elements on each one
 *      and measure how long each screen takes to open
 *   4. Fill the cart, close the browser, reopen it, and check the last saved
 *      state is still there
 *
 * Settings (all optional):
 *   BASE_URL    site under test           default https://www.saucedemo.com
 *   TEST_USER   login name                default standard_user
 *   TEST_PASS   password                  default secret_sauce
 *   MAX_OPEN_MS time budget per screen    default 5000
 *   HEADED=1    show the browser window in the state test
 *
 * Note: do not use USERNAME as a variable name. Windows already uses it.
 */

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const USER = process.env.TEST_USER ?? 'standard_user';
const PASS = process.env.TEST_PASS ?? 'secret_sauce';
const MAX_OPEN_MS = Number(process.env.MAX_OPEN_MS ?? 5000);
const HEADLESS = process.env.HEADED !== '1';
const STATE_FILE = path.join(__dirname, '..', '.auth', 'state.json');

const byId = (id: string) => `[data-test="${id}"]`;

async function login(page: Page, user: string, pass: string) {
  await page.locator(byId('username')).fill(user);
  await page.locator(byId('password')).fill(pass);
  await page.locator(byId('login-button')).click();
}

/** A screen to open: how to get there, and what proves it has loaded. */
type Screen = {
  name: string;
  open: (page: Page) => Promise<void>;
  ready: string; // selector that is visible once the screen is usable
  expectedForms?: number; // set this for your own site to assert the form count
};

// Edit this list for your own application (one entry per screen/form to open).
const SCREENS: Screen[] = [
  {
    name: 'Product list',
    open: async (p) => p.goto('/inventory.html'),
    ready: byId('inventory-item'),
  },
  {
    name: 'Product details',
    open: async (p) => p.locator(byId('inventory-item-name')).first().click(),
    ready: byId('back-to-products'),
  },
  {
    name: 'Cart',
    open: async (p) => p.locator(byId('shopping-cart-link')).click(),
    ready: byId('checkout'),
  },
  {
    name: 'Checkout - your information',
    open: async (p) => p.locator(byId('checkout')).click(),
    ready: byId('firstName'),
  },
];

test.describe.configure({ mode: 'serial' });

test.use({ baseURL: BASE_URL });

test.describe('Login, forms and saved state', () => {
  // 1. Does the site open?
  test('site opens and shows the login page', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok(), 'HTTP status should be 2xx').toBeTruthy();
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator(byId('username'))).toBeVisible();
    await expect(page.locator(byId('password'))).toBeVisible();
    await expect(page.locator(byId('login-button'))).toBeEnabled();
  });

  // 2. Login behaviour
  test('valid login opens the product list', async ({ page }) => {
    await page.goto('/');
    await login(page, USER, PASS);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator(byId('title'))).toHaveText('Products');
  });

  test('wrong password shows an error and stays on login', async ({ page }) => {
    await page.goto('/');
    await login(page, USER, 'wrong_password');
    await expect(page.locator(byId('error'))).toContainText('do not match');
    await expect(page.locator(byId('login-button'))).toBeVisible();
  });

  test('empty username shows a required-field error', async ({ page }) => {
    await page.goto('/');
    await login(page, '', PASS);
    await expect(page.locator(byId('error'))).toContainText('Username is required');
  });

  // 3. Count forms and time how long each screen takes to open
  test('count forms and measure the time to open each screen', async ({ page }, testInfo) => {
    await page.goto('/');
    await login(page, USER, PASS);
    await expect(page.locator(byId('title'))).toBeVisible();

    const rows: string[] = [];

    for (const screen of SCREENS) {
      const start = Date.now();
      await screen.open(page);
      await expect(page.locator(screen.ready)).toBeVisible({ timeout: MAX_OPEN_MS * 2 });
      const openMs = Date.now() - start;

      const forms = await page.locator('form').count();
      const inputs = await page.locator('input:visible, select:visible, textarea:visible').count();

      rows.push(`${screen.name.padEnd(30)} forms: ${forms}   fields: ${inputs}   opened in ${openMs} ms`);

      await test.step(`${screen.name}: ${forms} form(s), ${openMs} ms`, async () => {
        expect(openMs, `${screen.name} should open within ${MAX_OPEN_MS} ms`).toBeLessThan(MAX_OPEN_MS);
        if (screen.expectedForms !== undefined) {
          expect(forms, `${screen.name} form count`).toBe(screen.expectedForms);
        }
      });
    }

    const report = rows.join('\n');
    console.log('\n' + report + '\n');
    await testInfo.attach('forms-and-open-times.txt', { body: report, contentType: 'text/plain' });
  });

  // 4. Close the browser, reopen it, and check the last saved state is still there
  test('last saved state is restored after closing and reopening the browser', async () => {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });

    // --- First session: log in, change something, save the state, close the browser ---
    const browser1 = await chromium.launch({ headless: HEADLESS });
    const context1 = await browser1.newContext({ baseURL: BASE_URL });
    const page1 = await context1.newPage();
    await page1.goto('/');
    await login(page1, USER, PASS);
    await page1.locator(byId('add-to-cart-sauce-labs-backpack')).click();
    await expect(page1.locator(byId('shopping-cart-badge'))).toHaveText('1');
    await context1.storageState({ path: STATE_FILE }); // cookies + local storage
    await browser1.close(); // browser is now fully closed

    // --- Second session: brand-new browser, loaded with the saved state ---
    const browser2 = await chromium.launch({ headless: HEADLESS });
    const context2 = await browser2.newContext({ baseURL: BASE_URL, storageState: STATE_FILE });
    const page2 = await context2.newPage();
    await page2.goto('/inventory.html');

    await expect(page2, 'should not be sent back to the login page').toHaveURL(/inventory/);
    await expect(page2.locator(byId('title'))).toHaveText('Products');
    await expect(page2.locator(byId('shopping-cart-badge'))).toHaveText('1');
    await expect(page2.locator(byId('remove-sauce-labs-backpack'))).toBeVisible();

    await page2.locator(byId('shopping-cart-link')).click();
    await expect(page2.locator(byId('inventory-item-name'))).toHaveText('Sauce Labs Backpack');
    await browser2.close();

    // --- Control: a third browser WITHOUT the saved state must start empty ---
    const browser3 = await chromium.launch({ headless: HEADLESS });
    const page3 = await (await browser3.newContext({ baseURL: BASE_URL })).newPage();
    await page3.goto('/inventory.html');
    await expect(page3.locator(byId('login-button'))).toBeVisible();
    await browser3.close();
  });

  test.afterAll(() => {
    // The saved state file contains session data. Do not leave it lying around.
    if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
  });
});