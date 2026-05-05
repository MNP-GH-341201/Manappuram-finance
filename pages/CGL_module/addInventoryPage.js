const {test, expect} = require('@playwright/test');
const { LoginPage } = require('../CGL_module/loginPage');


class AddInventoryPage {
    constructor(page) {
        this.page = page;
        this.menubar = page.locator("//span[normalize-space()='CGL']");
        this.inventoryMenu = page.locator("(//span[@class='mat-button-wrapper'])[11]");
        this.addInventoryButton = page.locator("//mat-icon[@role='img'][normalize-space()='add_customer']");
    }
    async navigateToAddInventory() {
        await this.menubar.waitFor({ state: 'visible' });
        await this.menubar.click();
        await this.inventoryMenu.waitFor({ state: 'visible' });
        await this.inventoryMenu.click();
        await this.addInventoryButton.waitFor({ state: 'visible' });
        await this.addInventoryButton.click();
    }
}

module.exports = { AddInventoryPage };