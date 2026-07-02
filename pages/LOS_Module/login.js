const { expect } = require('@playwright/test');
const { losLoginLocators } = require('../../locators/locators');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page.locator(losLoginLocators.usernameIdInput);
    this.passwordInput = page.locator(losLoginLocators.passwordInput);
    this.loginButton = page.locator(losLoginLocators.loginButton);
    this.LOSmodulebranchText = page.locator(losLoginLocators.branchText);
    this.delayLeadAlertTitle = page.locator('.ant-modal-confirm-title');
    this.delayLeadAlertOkButton = page.locator('.ant-modal-confirm-btns button', { hasText: 'OK' });
  }

  async goto(LOS_APP_URL) {
    await this.page.goto(LOS_APP_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 160000,
    });
  }

  async login(employeeId, password) {
    await this.employeeIdInput.fill(employeeId);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.LOSmodulebranchText).toBeVisible({
      timeout: 60000,
    });
  }
  
async handleDelayLeadAlert() {
  try {
    await expect(this.delayLeadAlertTitle).toBeVisible({
      timeout: 5000,
    });

    await this.delayLeadAlertOkButton.click();

    await expect(this.delayLeadAlertTitle).not.toBeVisible({
      timeout: 10000,
    });
  } catch {
    console.log('Delay Lead Alert popup not displayed');
  }
}

}

module.exports = { LoginPage };