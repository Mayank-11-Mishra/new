import { test, expect } from './fixtures';

/**
 * The product list stands in for a "watch list" screen: a table of items that
 * must load completely and stay correct when the user interacts with it.
 */
test.describe('List screen (market-watch style)', () => {
  test('every item loads with a name and a price', async ({ inventoryPage, page }) => {
    await expect(inventoryPage.items()).toHaveCount(6);

    const names = await page.getByTestId('inventory-item-name').allTextContents();
    const prices = await page.getByTestId('inventory-item-price').allTextContents();

    expect(names).toHaveLength(6);
    for (const name of names) expect(name.trim()).not.toBe('');
    for (const price of prices) expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('sorting by price low to high orders the rows correctly', async ({ inventoryPage, page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');

    const prices = (await page.getByTestId('inventory-item-price').allTextContents())
      .map((p) => Number(p.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
    await expect(inventoryPage.items()).toHaveCount(6);
  });
});
