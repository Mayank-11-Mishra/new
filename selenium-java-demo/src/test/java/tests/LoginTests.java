package tests;

import base.BaseTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import pages.InventoryPage;
import pages.LoginPage;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

/** UI and button-response checks for the login screen. */
public class LoginTests extends BaseTest {

    @Test(description = "A valid user reaches the product list")
    public void validLoginOpensProductList() {
        InventoryPage inventory = new LoginPage(driver).loginAs("standard_user", "secret_sauce");

        assertEquals(inventory.getTitle(), "Products");
        assertTrue(driver.getCurrentUrl().contains("inventory"), "Should land on the inventory page");
    }

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][]{
                // username, password, text expected in the error message
                {"standard_user", "wrong_password", "Username and password do not match"},
                {"", "secret_sauce", "Username is required"},
                {"standard_user", "", "Password is required"},
                {"locked_out_user", "secret_sauce", "locked out"}
        };
    }

    @Test(dataProvider = "invalidCredentials",
            description = "Bad credentials show the right error and keep the user on the login page")
    public void invalidLoginShowsError(String username, String password, String expectedText) {
        LoginPage login = new LoginPage(driver).loginExpectingFailure(username, password);

        assertTrue(login.getErrorMessage().contains(expectedText),
                "Unexpected error message: " + login.getErrorMessage());
        assertTrue(login.isLoginButtonDisplayed(), "Login button should still be on screen");
    }

    @Test(description = "Login button is visible and enabled on first load")
    public void loginButtonIsAvailable() {
        LoginPage login = new LoginPage(driver);

        assertTrue(login.isLoginButtonDisplayed());
        assertTrue(login.isLoginButtonEnabled());
    }

    @Test(description = "Password box hides what is typed")
    public void passwordIsMasked() {
        assertTrue(new LoginPage(driver).isPasswordMasked());
    }

    @Test(description = "Logging out returns the user to the login screen")
    public void logoutReturnsToLogin() {
        LoginPage login = new LoginPage(driver)
                .loginAs("standard_user", "secret_sauce")
                .logout();

        assertTrue(login.isLoginButtonDisplayed(), "Login screen should be shown after logout");
    }
}
