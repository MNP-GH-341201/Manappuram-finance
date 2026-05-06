const { expect } = require('@playwright/test');
const { customerVerificationLocators } = require('../../locators/locators');

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
  await this.customerIdInput.fill(customerId);
  await this.searchButton.click();

  await this.page.getByLabel('Please Select Your ID').click();
  await this.page.getByRole('option', { name: 'COPY OF VOTERSID' }).click();

  await this.proceedHereButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.proceedHereButton.click();

  // ✅ Wait for iframe to load
  await this.page.waitForSelector('iframe', { timeout: 20000 });

  const hvFrame = this.page.frameLocator('iframe');

  // ✅ Robust popup locator
  const mobilePopup = hvFrame.getByText(
    'Complete your verification',
    { exact: false }
  );

  await expect(mobilePopup).toBeVisible({ timeout: 20000 });
  console.log('✅ Mobile verification popup visible');

  // ✅ Proceed
  await this.proceedToCaptureButton.waitFor({
    state: 'visible',
    timeout: 160000,
  });

  await this.proceedToCaptureButton.click();
}
}

module.exports = { CustomerVerificationPage };
``


//text=Complete your verification on Mobile browser