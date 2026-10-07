import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USER } from './config';

type Fixtures = {
  /** A page that is already logged in and showing the product list. */
  inventoryPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  inventoryPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USER.name, USER.password);
    await use(new InventoryPage(page));
  },
});

export { expect };
