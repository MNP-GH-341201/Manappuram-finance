const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/CGL_module/loginPage');
const { inventoryCreationLocators } = require('../../locators/locators');

test('Complete add inventory flow', async ({ page }, testInfo) => {
    const { CGL_APP_URL, credentials } = testInfo.project.use;

    const loginPage = new LoginPage(page);

    await loginPage.goto(CGL_APP_URL);

    await loginPage.login(
        credentials.CGL_employeeId,
        credentials.CGL_employeePassword
    );
    // Add inventory flow
    await page.locator(inventoryCreationLocators.menubar).click();
    await page.locator(inventoryCreationLocators.inventoryMenu).click();

    // Click Add Inventory
    await page.locator(inventoryCreationLocators.addInventoryButton).click();

    // ✅ WAIT for modal heading (confirms modal is open)
    const addInventoryHeading = page.locator(
        "//a[@id='menu-item-14']//span[@class='menu-title'][normalize-space()='Add Inventory']"
    );
    await expect(addInventoryHeading).toBeVisible({ timeout: 60000 });

    // ✅ WAIT for "I Understand" button inside modal
    const iUnderstandBtn = page.locator(
        "//span[normalize-space()='I Understand']"
    );

    await iUnderstandBtn.waitFor({
        state: 'visible'
    });

    // ✅ Ensure it’s clickable (important for overlay animations)
    await expect(iUnderstandBtn).toBeEnabled();

    await iUnderstandBtn.click();
    await page.waitForTimeout(2000);
    //    
    await page
        .locator('mat-radio-button', { hasText: 'Customer ID' })
        .click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Customer ID' }).fill('32130020080272');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('gridcell', { name: 'HGFHGFHF' }).click();
    await page.locator('button').filter({ hasText: 'GO TO DETAILS' }).click();
    await page.locator('#mat-dialog-4').getByRole('button', { name: 'Close dialog' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await page.pause();


}); 