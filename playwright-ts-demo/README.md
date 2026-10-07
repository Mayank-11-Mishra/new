# Playwright + TypeScript: login, load time and state persistence

Automated checks for [SauceDemo](https://www.saucedemo.com), a public practice site. They follow the same approach I use on the web application at work, with a public site standing in for it.

| Spec file | What it checks | Matches my work on |
|---|---|---|
| `login.spec.ts` | Valid login, wrong password, empty fields, locked user | Login functionality |
| `market-watch-style-list.spec.ts` | List loads fully, values are well-formed, sorting is correct | Market watch feature |
| `page-load.spec.ts` | Load time against a budget, several screens opened in a row, five users logging in together | Load time, opening multiple forms, load checks |
| `state-persistence.spec.ts` | Cart survives a reload and is restored in a new browser context from saved state | State maintenance (last saved state) |

## How it is organised

```
pages/    LoginPage.ts, InventoryPage.ts   page objects
tests/    *.spec.ts                        the checks
          fixtures.ts                      "already logged in" fixture
          config.ts                        base URL, load budget, test user
```

## Run it

You need Node 18+.

```bash
npm install
npx playwright install chromium
npx playwright test             # headless
npx playwright test --headed    # watch it run
npx playwright show-report      # open the HTML report
```

Settings you can change without touching code:

```bash
MAX_LOAD_MS=3000 npx playwright test       # stricter load budget
BASE_URL=https://other-site.com npx playwright test
```

## Notes

- Load time is read from the browser's own Navigation Timing API, so it is the time a real user waits.
- The "five users at once" test is a small smoke check only. Real load testing needs a tool such as JMeter, k6 or Locust, and shouldn't be pointed at a public demo site.
- Timings depend on your internet connection. Adjust `MAX_LOAD_MS` if your network is slow.
