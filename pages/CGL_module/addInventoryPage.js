const { expect } = require('@playwright/test');
const { inventoryCreationLocators } = require('../../locators/locators');
const { time } = require('node:console');

class AddInventoryPage {
  constructor(page) {
    this.page = page;

    this.menuBar = page.locator(inventoryCreationLocators.menubar);
    this.inventoryMenu = page.locator(inventoryCreationLocators.inventoryMenu);
    this.addInventoryButton = page.locator(inventoryCreationLocators.addInventoryButton);

    this.iUnderstandBtn = page.getByText('I Understand', { exact: true });
    this.customerIdRadio = page.locator('mat-radio-button', { hasText: 'Customer ID' });
    this.customerIdInput = page.locator("//input[@id='mat-input-13']");
    this.searchBtn = page.getByRole('button', { name: 'Search' });

    this.goToDetailsBtn = page.locator('button:has-text("GO TO DETAILS")');
    this.closeDialogBtn = page.getByRole('button', { name: 'Close dialog' });
    this.selectItemBtn = page.getByPlaceholder('Select Items');
    this.specification = page.getByPlaceholder('Item Specification');
    this.type = page.getByPlaceholder('Type');
    this.Purity = page.getByPlaceholder('Purity');
    this.damageTypes = page.locator('#mat-select-4');
    this.remarks = page.getByPlaceholder('Remarks');
    this.addItemBtn = page.getByRole('button', { name: /add item/i });

  }

  async navigateToAddInventory() {
    await this.menuBar.click();
    await this.inventoryMenu.click();
    await this.addInventoryButton.click();

    await expect(this.iUnderstandBtn).toBeVisible({ timeout: 60000 });
    await this.iUnderstandBtn.click();
  }
async searchCustomerById(customerId, customerName) {
    await this.customerIdRadio.click();
    // await this.customerIdInput.fill('3213');
    await this.customerIdInput.click();
    await this.page.waitForTimeout(500); // Clear any existing text
    await this.customerIdInput.fill(customerId, { delay: 150 }); // Type with a delay to mimic human input
    await this.page.waitForTimeout(2000);

    // Locate search button
    const searchButton = this.searchBtn;

    // Wait until it becomes enabled
    await expect(searchButton).toBeEnabled({ timeout: 20000 });

    // Click Search
    await searchButton.click();
    await this.page.getByRole('gridcell', { name: customerName }).click();
    await this.goToDetailsBtn.waitFor({ state: 'visible' });
    await this.goToDetailsBtn.click();
    await this.page.waitForTimeout(2000);

    const dialog = this.page.locator('.cdk-overlay-pane', {
      hasText: '1 Live pledges found for this Customer ID'
    });
    await dialog.locator('button:has-text("OK")').click();
    const secondDialog = this.page.locator('.cdk-overlay-pane', {
      hasText: 'Backdate Pledge is Pending,Pls do Backdate Pledge through \'BACKDATE GL1\' Only'
    });
    await secondDialog.locator('button:has-text("OK")').click();
    await this.page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    });
    await this.selectItemBtn.waitFor({ state: 'visible', timeout: 2000 });

    await this.selectItemBtn.click();
    await this.page.getByRole('option', { name: 'BABY BANGLES' }).click({timeout: 1000});
    await this.specification.click();
    await this.page.getByRole('option', { name: 'OLD ITEM' }).click();
    await this.type.click();
    await this.page.getByRole('option', { name: 'SOLDERING', exact: true }).click();
    await this.Purity.isVisible({ timeout: 5000 });
    await this.Purity.click();
    await this.page.getByRole('option', { name: 'Purity-17-ct', exact: true }).click();
    await this.page.waitForTimeout(5000);
    const checkbox = this.page.locator('label[for="mat-checkbox-1-input"]');
    await expect(checkbox).toBeVisible({ timeout: 5000 });
    await checkbox.click({ force: true });

    await this.page.getByPlaceholder('Count').fill('2');
    await this.page.keyboard.press('Tab');
    await this.page.getByPlaceholder('Gross Weight').fill('5');
    await this.page.keyboard.press('Tab');
    await this.page.getByPlaceholder('Stone Weight').fill('2');
    await this.page.keyboard.press('Tab');
    await this.damageTypes.isVisible({ timeout: 3000 });
    await this.page.keyboard.press('Tab');

    await this.damageTypes.click();
    await this.page.getByRole('option', { name: 'Fold' }).click();
    await this.page.keyboard.press('Tab');
    await this.remarks.fill('Testing automation', {delay: 100});
    //await this.page.pause();
    await this.addItemBtn.waitFor({ state: 'visible', timeout: 5000 });

    await this.addItemBtn.click();
    //await this.page.pause();
   
  }

}
module.exports = { AddInventoryPage };
