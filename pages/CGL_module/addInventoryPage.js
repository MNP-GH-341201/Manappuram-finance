const { expect } = require('@playwright/test');
const { inventoryCreationLocators } = require('../../locators/locators');
const { time } = require('node:console');
const { timeout } = require('../../playwright.config');

class AddInventoryPage {
  constructor(page) {
    this.page = page;

    
    this.page.on('dialog', async dialog => {
      console.log('Browser dialog:', dialog.message());
      await dialog.accept();
    });
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
    this.Purity = page.getByPlaceholder("Purity");
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

  async handleAllDialogs() {
    for (let i = 0; i < 5; i++) {
      const dialog = this.page.locator('.cdk-overlay-pane');
      const okButton = dialog.getByRole('button', { name: /ok/i });

      try {
        await dialog.waitFor({ state: 'visible', timeout: 3000 });

        const message = await dialog.textContent();
        console.log('Dialog message:', message);

        await okButton.click();

        await dialog.waitFor({ state: 'hidden', timeout: 5000 });

      } catch (e) {
        break; // no more dialogs
      }
    }
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

    // ✅ Handle dialogs again
    // await this.handleAllDialogs();

    // ✅ Select Item
    await expect(this.selectItemBtn).toBeVisible();
    await this.selectItemBtn.click();

    const itemOption = this.page.getByRole('option', { name: 'BABY BANGLES' });
    await expect(itemOption).toBeVisible();
    await itemOption.click();

    // await this.handleAllDialogs();

    // ✅ Specification
    await this.specification.click();
    await this.page.getByRole('option', { name: 'OLD ITEM' }).click();

    // ✅ Type
    // await this.handleAllDialogs();
    await this.type.click();
    await this.page.getByRole('option', { name: 'SOLDERING', exact: true }).click();

    // ✅ Purity
    // await this.handleAllDialogs();
    await this.Purity.click();
    await this.page.getByRole('option', { name: 'Purity-17-ct' }).click();

    // ✅ Checkbox
    const checkbox = this.page.locator('.mat-checkbox-inner-container');
    await expect(checkbox).toBeVisible();
    await checkbox.click();

    // ✅ Inputs
    await this.page.getByPlaceholder('Count').fill('2');
    await this.page.getByPlaceholder('Gross Weight').fill('5');
    await this.page.getByPlaceholder('Stone Weight').fill('2');

    // ✅ Damage type
    // await this.handleAllDialogs();
    await this.damageTypes.click();
    const damageOption = this.page.getByRole('option', { name: 'Fold' });
    await damageOption.waitFor();
    await damageOption.click();

    // ✅ Remarks
    // await this.handleAllDialogs();
    await this.remarks.fill('Testing automation');

    // ✅ Add Item
    await expect(this.addItemBtn).toBeEnabled();
    await this.addItemBtn.click({ force: true });

    await expect(this.page.getByRole('heading', { name: 'Added items details' })).toBeVisible();

    // ✅ Photo Step
    const photoBtn = this.page.getByRole('button', { name: /Take pledge Item photo/i });
    await expect(photoBtn).toBeVisible();
    await photoBtn.click();

    const video = this.page.locator('video');
    await expect(video).toBeVisible({ timeout: 20000 });

    const captureBtn = this.page.getByRole('button', { name: /capture/i });
    await expect(captureBtn).toBeEnabled({ timeout: 100000 });

    // await this.handleAllDialogs();
    await captureBtn.click({force:true});

    const proceedButton = this.page.getByRole('button', { name: 'Proceed' });
    await expect(proceedButton).toBeVisible();

    // await this.handleAllDialogs();
    await proceedButton.click({force:true});
    //await this.page.pause()

    // ✅ Final dialog safety
    // await this.handleAllDialogs();
  }

}
module.exports = { AddInventoryPage };
