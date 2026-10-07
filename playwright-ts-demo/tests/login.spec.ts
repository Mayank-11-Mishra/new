import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USER } from './config';

test.describe('Login', () => {
  test('valid user reaches the product list', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USER.name, USER.password);

    const inventory = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventory.title()).toHaveText('Products');
  });

  const badLogins = [
    { name: 'wrong password', user: 'standard_user', pass: 'wrong_password', message: /do not match/ },
    { name: 'empty username', user: '', pass: 'secret_sauce', message: /Username is required/ },
    { name: 'empty password', user: 'standard_user', pass: '', message: /Password is required/ },
    { name: 'locked-out user', user: 'locked_out_user', pass: 'secret_sauce', message: /locked out/ },
  ];

  for (const c of badLogins) {
    test(`${c.name} shows an error and stays on the login page`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.open();
      await login.login(c.user, c.pass);

      await expect(login.errorBanner()).toContainText(c.message);
      await expect(page).not.toHaveURL(/inventory/);
    });
  }
});
