package tests;

import base.BaseTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.CartPage;
import pages.InventoryPage;
import pages.LoginPage;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

/** UI and button-response checks on the product list and cart. */
public class InventoryUiTests extends BaseTest {

    private static final String BACKPACK = "sauce-labs-backpack";
    private static final String BIKE_LIGHT = "sauce-labs-bike-light";

    private InventoryPage inventory;

    // Runs after BaseTest.setUp(), so the browser is already open on the login page.
    @BeforeMethod(alwaysRun = true)
    public void loginFirst() {
        inventory = new LoginPage(driver).loginAs("standard_user", "secret_sauce");
    }

    @Test(description = "All six products are listed")
    public void allProductsAreDisplayed() {
        assertEquals(inventory.getProductCount(), 6);
    }

    @Test(description = "Add to cart changes the button to Remove and updates the badge")
    public void addToCartUpdatesButtonAndBadge() {
        assertEquals(inventory.getCartBadgeCount(), 0, "Cart should start empty");

        inventory.addToCart(BACKPACK);

        assertTrue(inventory.isRemoveButtonDisplayed(BACKPACK), "Remove button should appear");
        assertFalse(inventory.isAddButtonDisplayed(BACKPACK), "Add button should disappear");
        assertEquals(inventory.getCartBadgeCount(), 1);
    }

    @Test(description = "Badge counts every item added")
    public void badgeCountsMultipleItems() {
        inventory.addToCart(BACKPACK).addToCart(BIKE_LIGHT);

        assertEquals(inventory.getCartBadgeCount(), 2);
    }

    @Test(description = "Remove puts the button back and clears the badge")
    public void removeFromCartRestoresButtonAndClearsBadge() {
        inventory.addToCart(BACKPACK).removeFromCart(BACKPACK);

        assertTrue(inventory.isAddButtonDisplayed(BACKPACK), "Add button should come back");
        assertEquals(inventory.getCartBadgeCount(), 0);
    }

    @Test(description = "Sorting by price, low to high, orders the prices correctly")
    public void sortByPriceLowToHigh() {
        inventory.sortBy("lohi");

        List<Double> shown = inventory.getProductPrices();
        List<Double> expected = new ArrayList<>(shown);
        Collections.sort(expected);
        assertEquals(shown, expected);
    }

    @Test(description = "Sorting by name, Z to A, orders the names correctly")
    public void sortByNameZtoA() {
        inventory.sortBy("za");

        List<String> shown = inventory.getProductNames();
        List<String> expected = new ArrayList<>(shown);
        expected.sort(Collections.reverseOrder());
        assertEquals(shown, expected);
    }

    @Test(description = "Cart page lists exactly what was added")
    public void cartPageShowsAddedItem() {
        inventory.addToCart(BACKPACK);

        CartPage cart = inventory.openCart();

        assertEquals(cart.getTitle(), "Your Cart");
        assertEquals(cart.getItemNames(), List.of("Sauce Labs Backpack"));
        assertTrue(cart.isCheckoutButtonEnabled());
    }

    @Test(description = "Cart contents are still there after a page refresh")
    public void cartSurvivesRefresh() {
        inventory.addToCart(BACKPACK);

        driver.navigate().refresh();

        assertEquals(new InventoryPage(driver).getCartBadgeCount(), 1);
    }

    @Test(description = "Continue Shopping on the cart page returns to the product list")
    public void continueShoppingReturnsToProducts() {
        InventoryPage back = inventory.openCart().continueShopping();

        assertEquals(back.getTitle(), "Products");
    }
}
