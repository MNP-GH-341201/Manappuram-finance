const { expect } = require('@playwright/test');
<<<<<<< HEAD:pages/LoginPage.js
const { loginLocators } = require('../locators/locators');
=======
const { loginLocators } = require('../../locators/locators');

>>>>>>> vendor_management:pages/CGL_module/loginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page.locator(loginLocators.employeeIdInput);
    this.passwordInput = page.locator(loginLocators.passwordInput);
    this.loginButton = page.locator(loginLocators.loginButton);
    this.CGLmodulebranchText = page.locator(loginLocators.CGLmodulebranchText);
  }

  async goto(url) {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 160000,
    });
  }

  async login(employeeId, password) {
    await this.employeeIdInput.fill(employeeId);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.CGLmodulebranchText).toBeVisible({ timeout: 60000 });
  }
}

module.exports = { LoginPage };