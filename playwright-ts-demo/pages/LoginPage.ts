import { Page, Locator } from '@playwright/test';

/** Page Object for the login screen. */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  errorBanner(): Locator {
    return this.page.getByTestId('error');
  }
}
