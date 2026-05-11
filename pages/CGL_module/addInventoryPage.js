const { expect } = require('@playwright/test');
const { inventoryCreationLocators } = require('../../locators/locators');

class AddInventoryPage {
  constructor(page) {
    this.page = page;

    this.menuBar = page.locator(inventoryCreationLocators.menubar);
    this.inventoryMenu = page.locator(inventoryCreationLocators.inventoryMenu);
    this.addInventoryButton = page.locator(inventoryCreationLocators.addInventoryButton);

    this.iUnderstandBtn = page.getByText('I Understand', { exact: true });
    this.customerIdRadio = page.locator('mat-radio-button', { hasText: 'Customer ID' });
    this.customerIdInput = page.getByRole('textbox', { name: 'Customer ID' });
    this.searchBtn = page.getByRole('button', { name: 'Search' });

    this.goToDetailsBtn = page.getByRole('button', { name: 'GO TO DETAILS' });
    this.closeDialogBtn = page.getByRole('button', { name: 'Close dialog' });
  }

  async navigateToAddInventory() {
    await this.menuBar.click();
    await this.inventoryMenu.click();
    await this.addInventoryButton.click();

    await expect(this.iUnderstandBtn).toBeVisible({ timeout: 60000 });
    await this.iUnderstandBtn.click();
  }

  async searchCustomerById(page) {
    await this.customerIdRadio.click();
    await page.getByplaceholder('Customer ID').type(32130020080272);
    await expect(this.searchBtn).toBeEnabled({ timeout: 60000 });
    await this.searchBtn.click();

    await this.page.getByRole('gridcell', { name: HGFHGFHF }).click();
    await this.goToDetailsBtn.click();
  }

  async closeDialogs() {
    await this.closeDialogBtn.first().click();
    await this.closeDialogBtn.first().click();
  }
}

module.exports = { AddInventoryPage };