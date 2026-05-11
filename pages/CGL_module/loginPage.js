const { expect } = require('@playwright/test');
const { CGLloginLocators } = require('../../locators/locators');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page.locator(CGLloginLocators.employeeIdInput);
    this.passwordInput = page.locator(CGLloginLocators.passwordInput);
    this.loginButton = page.locator(CGLloginLocators.loginButton);
    this.CGLmodulebranchText = page.locator(CGLloginLocators.branchText);
  }

    async goto(CGL_APP_URL) {
    await this.page.goto(CGL_APP_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 160000,
    });
  }

  async login(CGL_employeeId, CGL_password) {
    await this.employeeIdInput.fill(CGL_employeeId);
    await this.passwordInput.fill(CGL_password);
    await this.loginButton.click();
    await expect(this.CGLmodulebranchText).toBeVisible({ timeout: 60000 });
  }
}

module.exports = { LoginPage };