const {expect} = require('@playwright/test');
const {customerVerificationLocators} = require('../../locators/locators');

class AddCustomerPage {
    constructor(page) {
        this.page = page;
        this.customerMenu = page.locator(
            customerVerificationLocators.customerMenu
        )};
        async navigateToVerification() {
    await this.customerMenu.waitFor({ state: 'visible' });
    await this.customerMenu.click();
  };

}

module.exports = { AddCustomerPage };