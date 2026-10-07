# Selenium + Java: web UI and button response tests

UI and button-response checks for [SauceDemo](https://www.saucedemo.com), a public practice site for testers. Built with Selenium WebDriver, Java 17, TestNG and the Page Object Model.

## What is covered

**Login (`LoginTests`)**
- Valid login opens the product list
- Wrong password, empty username, empty password and a locked-out user each show the right error (one data-driven test)
- Login button is visible and enabled
- Password box is masked
- Logout returns to the login screen

**Product list and cart (`InventoryUiTests`)**
- All six products are listed
- Add to cart swaps the button to Remove and updates the cart badge
- Badge counts several items; Remove restores the Add button and clears the badge
- Sort by price (low to high) and by name (Z to A) give the right order
- Cart page shows exactly what was added
- Cart contents survive a page refresh
- Continue Shopping returns to the product list

## How it is organised

```
src/test/java
├── base/    BaseTest.java       starts and closes Chrome around every test
├── pages/   LoginPage, InventoryPage, CartPage   (locators and actions)
└── tests/   LoginTests, InventoryUiTests         (the checks only)
```

Tests never touch locators directly. If the site changes, only the page classes need updating. All waits are explicit (`WebDriverWait`), with no `Thread.sleep`.

## Run it

You need Java 17+, Maven and Chrome installed. Selenium downloads the matching driver by itself.

```bash
mvn test                      # opens Chrome and runs everything
mvn test -Dheadless=true      # no browser window (used in CI)
mvn test -Dtest=LoginTests    # one class only
```

Reports are written to `target/surefire-reports`.
