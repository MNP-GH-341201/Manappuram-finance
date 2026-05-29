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
    this.customerIdInput = page.locator("//input[@id='mat-input-13']");
    this.searchBtn = page.getByRole('button', { name: 'Search' });

    this.goToDetailsBtn = page.locator('button:has-text("GO TO DETAILS")');
    this.closeDialogBtn = page.getByRole('button', { name: 'Close dialog' });
    this.selectItemBtn = page.getByPlaceholder('Select Items');
    this.specification = page.getByPlaceholder('Item Specification');
    this.type = page.getByPlaceholder('Type');
    this.Purity = page.getByPlaceholder('Purity');

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
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'Close dialog' }).click();
    await this.page.waitForTimeout(2000);
  await this.page.getByText('Select Items', { exact: true }).click();
  await this.page.getByText('BABY BANGLES').click();
  await this.page.getByText('Item Specification', { exact: true }).click();
  await this.page.getByText('OLD ITEM').click();
  await this.page.getByText('Type', { exact: true }).click();
  await this.page.getByText('SOLDERING', { exact: true }).click();
  await this.page.getByText('Purity', { exact: true }).click();
  await this.page.getByText('Purity-14-ct', { exact: true }).click();
  await this.page.pause();
  // await this.page.locator('.mat-checkbox-inner-container').click();
  // await this.page.getByRole('button', { name: 'Get weight' }).click();
  // await this.page.getByRole('textbox', { name: 'Count' }).click();
  // await this.page.getByRole('textbox', { name: 'Count' }).click();
  // await this.page.getByRole('textbox', { name: 'Gross Weight' }).click();
  // await this.page.getByRole('textbox', { name: 'Stone Weight' }).click();
  // await this.page.locator('.mat-select-placeholder').click();
  // await this.page.locator('.mat-select-placeholder').click();
  // await this.page.locator('.mat-select-placeholder').click();
  // await this.page.getByRole('button', { name: 'Add Item' }).click();
  // await this.page.getByRole('button', { name: 'Close dialog' }).click();
  // await this.page.getByRole('textbox', { name: 'Total pieces' }).click();
  // await this.page.getByRole('button', { name: 'Take pledge Item photo' }).click();
  // await this.page.getByRole('button', { name: 'Close dialog' }).click();
  // await this.page.getByRole('button', { name: 'CLOSE' }).click();
  // await this.page.getByRole('button', { name: 'View Sample Photo' }).click();
  // await this.page.locator('.cdk-overlay-backdrop').click();
  // await this.page.locator('.cdk-overlay-backdrop').click();
    
    // await this.selectItemBtn.waitFor({ state: 'visible' });
    // await this.page.waitForTimeout(2000);
    // await this.selectItemBtn.selectOption({ label: 'BABY BANGLES' });
    // await this.page.waitForTimeout(1000);
    // await this.specification.selectOption({ label: 'OLD ITEM' });
    // await this.page.waitForTimeout(1000);
    // await this.type.selectOption({ label: 'SOLDERING' });
    // await this.page.waitForTimeout(1000);
    // await this.Purity.selectOption({ label: 'Purity-17-ct' });

    // await this.closeDialogBtn.waitFor({ state: 'visible' });
    // await this.closeDialogBtn.click();

  }
}
module.exports = { AddInventoryPage };
