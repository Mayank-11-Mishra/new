package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/** Page Object for the product list that opens after login. */
public class InventoryPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By pageTitle = By.className("title");
    private final By productCards = By.className("inventory_item");
    private final By productNames = By.className("inventory_item_name");
    private final By productPrices = By.className("inventory_item_price");
    private final By sortDropdown = By.className("product_sort_container");
    private final By cartBadge = By.className("shopping_cart_badge");
    private final By cartLink = By.className("shopping_cart_link");
    private final By menuButton = By.id("react-burger-menu-btn");
    private final By logoutLink = By.id("logout_sidebar_link");

    public InventoryPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public String getTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle)).getText();
    }

    public int getProductCount() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(productCards));
        return driver.findElements(productCards).size();
    }

    public List<String> getProductNames() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(productNames));
        return driver.findElements(productNames).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    /** Prices as numbers, e.g. "$29.99" becomes 29.99. */
    public List<Double> getProductPrices() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(productPrices));
        return driver.findElements(productPrices).stream()
                .map(e -> Double.parseDouble(e.getText().replace("$", "")))
                .collect(Collectors.toList());
    }

    /** slug is the product id used by the site, e.g. "sauce-labs-backpack". */
    public InventoryPage addToCart(String slug) {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("add-to-cart-" + slug))).click();
        return this;
    }

    public InventoryPage removeFromCart(String slug) {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("remove-" + slug))).click();
        return this;
    }

    public boolean isAddButtonDisplayed(String slug) {
        return !driver.findElements(By.id("add-to-cart-" + slug)).isEmpty();
    }

    public boolean isRemoveButtonDisplayed(String slug) {
        return !driver.findElements(By.id("remove-" + slug)).isEmpty();
    }

    /** Number shown on the cart icon. The badge disappears when the cart is empty, so that counts as 0. */
    public int getCartBadgeCount() {
        List<WebElement> badge = driver.findElements(cartBadge);
        return badge.isEmpty() ? 0 : Integer.parseInt(badge.get(0).getText());
    }

    /** value is one of: az, za, lohi, hilo */
    public InventoryPage sortBy(String value) {
        WebElement dropdown = wait.until(ExpectedConditions.elementToBeClickable(sortDropdown));
        new Select(dropdown).selectByValue(value);
        return this;
    }

    public CartPage openCart() {
        wait.until(ExpectedConditions.elementToBeClickable(cartLink)).click();
        return new CartPage(driver);
    }

    public LoginPage logout() {
        wait.until(ExpectedConditions.elementToBeClickable(menuButton)).click();
        wait.until(ExpectedConditions.elementToBeClickable(logoutLink)).click();
        return new LoginPage(driver);
    }
}
