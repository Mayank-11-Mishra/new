/** Site under test. Override with:  BASE_URL=https://example.com npx playwright test */
export const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

/** Page load budget in milliseconds. Override with:  MAX_LOAD_MS=3000 npx playwright test */
export const MAX_LOAD_MS = Number(process.env.MAX_LOAD_MS ?? 5000);

export const USER = { name: 'standard_user', password: 'secret_sauce' };
