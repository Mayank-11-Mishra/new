package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/** Page Object for the login screen. */
public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By usernameField = By.id("user-name");
    private final By passwordField = By.id("password");
    private final By loginButton = By.id("login-button");
    private final By errorBanner = By.cssSelector("[data-test='error']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public LoginPage enterUsername(String username) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        field.clear();
        field.sendKeys(username);
        return this;
    }

    public LoginPage enterPassword(String password) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        field.clear();
        field.sendKeys(password);
        return this;
    }

    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    }

    /** Logs in and returns the page that opens after a successful login. */
    public InventoryPage loginAs(String username, String password) {
        enterUsername(username).enterPassword(password).clickLogin();
        return new InventoryPage(driver);
    }

    /** Submits credentials that are expected to fail and stays on the login page. */
    public LoginPage loginExpectingFailure(String username, String password) {
        enterUsername(username).enterPassword(password).clickLogin();
        return this;
    }

    public String getErrorMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorBanner)).getText();
    }

    public boolean isLoginButtonDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(loginButton)).isDisplayed();
    }

    public boolean isLoginButtonEnabled() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(loginButton)).isEnabled();
    }

    /** The password box should hide what is typed. */
    public boolean isPasswordMasked() {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        return "password".equals(field.getAttribute("type"));
    }
}
