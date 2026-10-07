# Mayank Mishra

**Software Test Engineer** · Mumbai, India· mayankmishra0911@gmail.com · https://www.linkedin.com/in/mayankmishra09

I test trading software, both the web application and the desktop application. Currently working on order flow and live charts. The repetitive checks (logins, load times, regression, UI responses) I automate. This repository shows how I work and includes runnable examples of my automation skills.

---

## Where I work

**Software Test Engineer, Reliable Software Systems Pvt. Ltd**
*March 2025 – Present*

**The product:** A trading platform with a web application and a desktop application. Used by the traders to place real time trades and technically analyze the market movements and deploy the alogrithmic strategy to trade".

**My role:** "As the staff size is less I was the only tester and has to take the ownership of my work where along with testing I was responsible for client corrdination, stakeholder management, gathering requirement, troubleshooting produciton issues."

### What I test, and how

| Area | Approach | Tools |
|---|---|---|
| Login and session handling (web) | Automated | Playwright + TypeScript |
| Market watch feature (web) | Automated | Playwright + TypeScript |
| Application load time and opening multiple forms (web) | Automated | Playwright + TypeScript |
| State maintenance: the app restores its last saved state | Automated | Playwright + TypeScript |
| Load testing (web) | Automated | Playwright + TypeScript [add any other tool you used] |
| Web UI and button responses | Automated | Selenium + Java |
| Web regression testing | Automated | [Playwright / Selenium] |
| Desktop application UI testing | Automated | Appium |
| Order flow and order placement | Manual | |
| Algo strategy flow | Manual | |
| Chart visualisation | Manual | |
| Live candle formation | Manual | |

[Here need for manual testing arises as there are several modules that cannot be tested through automation. Example: "Order flow, algo strategies, charts and live candles depend on live market data and need judgement, so I test them manually."]

### Highlights

- Tested both the web and the desktop versions of the platform, from requirements through release.
- Automated regression scenarios for the web application, reducing regression time.
- Built Playwright (TypeScript) checks that measure application load time and the time taken to open multiple forms, so slowdowns show up between releases.
- Automated state-maintenance checks to confirm that the application comes back in its last saved state after a restart or reload.
- Automated UI checks for the desktop application using Appium.
- Manually tested the full order flow, algo strategy flow and order placement, chart visualisation, and live candle formation.
- Logged and tracked defects, including critical or high-severity issues found before release.

> Company code is not published here because it belongs to my employer. The projects below use public practice websites and show the same techniques.

---

## Projects

### 1. [Selenium + Java: web UI and button response tests](./selenium-java-demo)
Tests for [SauceDemo](https://www.saucedemo.com) using Selenium WebDriver, Java, TestNG and the Page Object Model.
Checks login behaviour (valid, invalid, empty fields, locked user, masked password), button state changes (Add to cart / Remove), cart badge updates, sorting, and cart contents.

### 2. [Playwright + TypeScript: login, load time and state persistence](./playwright-ts-demo)
Playwright tests against the same site, mirroring the kind of web automation I do at work:

| What it checks here | Matches my work on |
|---|---|
| Login with valid and invalid users | Login functionality |
| Product list loads and shows every item | Market watch feature |
| Page load time against a threshold, across several pages in sequence | Load time and opening multiple forms |
| Several users logging in at the same time (small scale) | Load checks |
| Cart is restored after reload and in a fresh browser using saved state | State maintenance (last saved state) |

Both projects run on every push through GitHub Actions (see `.github/workflows/tests.yml`).

---

## Skills

| Area | What I use |
|---|---|
| Manual testing | Test case design, exploratory testing, regression, smoke and sanity testing, bug reporting |
| Web automation | Playwright (TypeScript), Selenium (Java), TestNG, Page Object Model |
| Desktop automation | Appium |
| Domain | Trading platforms: market watch, order flow, algo strategies, charts, live candles |
| Tools | [Jira, TestRail, Git, GitHub Actions / Jenkins], [Chrome DevTools], [SQL basics] |
| Process | Agile / Scrum, test planning, defect lifecycle, release testing |

---

## Certifications and learning

- [ISTQB Foundation Level or other certificate, year] *(remove if you don't have one)*

---

## Contact

- Email: [your.email@example.com]
- LinkedIn: [URL]
- Location: [City, India]

Open to [Software Test Engineer / QA Automation Engineer] roles.
