import { test, expect } from './fixtures';
import { BASE_URL } from './config';

/**
 * State maintenance: the app should come back the way the user left it.
 * Here the "state" is the cart contents.
 */
test.describe('State persistence', () => {
  test('cart is still filled after a page reload', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge()).toHaveText('1');

    await page.reload();

    await expect(inventoryPage.cartBadge()).toHaveText('1');
  });

  test('saved session restores the last state in a brand-new browser context', async ({
    inventoryPage,
    page,
    browser,
  }) => {
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge()).toHaveText('1');

    // Save cookies and local storage, as if the user closed the app...
    const savedState = await page.context().storageState();

    // ...then open it again from scratch using what was saved.
    const restored = await browser.newContext({ storageState: savedState, baseURL: BASE_URL });
    const restoredPage = await restored.newPage();
    await restoredPage.goto('/inventory.html');

    await expect(restoredPage.getByTestId('title')).toHaveText('Products');
    await expect(restoredPage.getByTestId('shopping-cart-badge')).toHaveText('1');
    await restored.close();
  });
});
