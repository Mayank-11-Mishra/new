import { Page, Locator } from '@playwright/test';

/** Page Object for the product list that opens after login. */
export class InventoryPage {
  constructor(private readonly page: Page) {}

  title(): Locator {
    return this.page.getByTestId('title');
  }

  items(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }

  /** slug is the product id used by the site, e.g. "sauce-labs-backpack". */
  async addToCart(slug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }
}
