const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    // Elements
    this.employeeIdInput = page.getByPlaceholder('Employee ID');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { type: 'submit' });
    this.branchText = page.getByText('SULTAN PET');
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
    await expect(this.branchText).toBeVisible({ timeout: 60000 });
  }
}

module.exports = { LoginPage };
``