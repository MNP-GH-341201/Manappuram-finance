const { expect } = require('@playwright/test');
const { customerVerificationLocators } = require('../locators/locators');

class CustomerVerificationPage {
  constructor(page) {
    this.page = page;

    this.customerMenu = page.locator(
      customerVerificationLocators.customerMenu
    );

    this.onetimeVerificationMenu = page.locator(
      customerVerificationLocators.onetimeVerificationMenu
    );

    this.customerIdInput = page.locator(
      customerVerificationLocators.customerIdInput
    );

    this.searchButton = page.locator(
      customerVerificationLocators.searchButton
    );

    // this.idDropdown = page.locator(
    //   customerVerificationLocators.idDropdown
    // );
    // this.copyOfVoterIdOption = page.locator(
    //   customerVerificationLocators.copyOfVoterIdOption
    // );

    this.proceedHereButton = page.locator(
      customerVerificationLocators.proceedHereButton
    );

    this.proceedToCaptureButton = page.locator(
      customerVerificationLocators.proceedToCaptureButton
    );

    this.mobileVerificationPopup = page.locator(
      customerVerificationLocators.mobileVerificationPopup
    );
  }

  async navigateToVerification() {
    await this.customerMenu.waitFor({ state: 'visible' });
    await this.customerMenu.click();

    await this.onetimeVerificationMenu.waitFor({ force: true });
    await this.onetimeVerificationMenu.click();
  }

  async searchCustomer(customerId) {
    await this.customerIdInput.waitFor({ state: 'visible' });
    await this.customerIdInput.fill(customerId);
    await this.searchButton.click();
    const selectOptions = this.page.getByLabel('Please Select Your ID');
    await selectOptions.click();
    const voterIdOption = this.page.getByRole('option', {
      name: 'COPY OF VOTERSID',
    });
    await voterIdOption.click();

    // ✅ Wait for Proceed Here button
    await this.proceedHereButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.proceedHereButton.click();

    // ✅ Validate mobile verification popup
    await expect(this.mobileVerificationPopup).toBeVisible({
      timeout: 10000,
    });

    console.log('✅ Mobile verification popup visible');

    // ✅ Camera / long wait step
    await this.proceedToCaptureButton.waitFor({
      state: 'visible',
      timeout: 160000,
    });

    await this.proceedToCaptureButton.click();
  }
}

module.exports = { CustomerVerificationPage };
``