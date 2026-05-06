const { expect } = require('@playwright/test');
const { loginLocators } = require('../../locators/locators');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page.locator(loginLocators.employeeIdInput);
    this.passwordInput = page.locator(loginLocators.passwordInput);
    this.loginButton = page.locator(loginLocators.loginButton);
    this.CustomerModulebranchText = page.locator(loginLocators.CustomerModulebranchText);
  }

  async goto(CUSTOMER_APP_URL) {
    await this.page.goto(CUSTOMER_APP_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 160000,
    });
  }

  async login(employeeId, password) {
    await this.employeeIdInput.fill(employeeId);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.CustomerModulebranchText).toBeVisible({ timeout: 60000 });
  }
}

module.exports = { LoginPage };