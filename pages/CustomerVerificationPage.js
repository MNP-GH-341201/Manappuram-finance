const { expect } = require('@playwright/test');

class CustomerVerificationPage {
  constructor(page) {
    this.page = page;

    // ─── Menu ─────────────────────────────
    this.customerMenu = page.locator(
      "//span[normalize-space()='Customer']"
    );
    this.onetimeVerificationMenu = page.locator(
      "//span[normalize-space()='Onetime Verification']"
    );

    // ─── Customer search ──────────────────
    this.customerIdInput = page.getByPlaceholder('Enter Customer Id');
    this.searchButton = page.getByRole('button', { name: 'Search' });

    this.idDropdown = page.getByPlaceholder('Please Select Your ID');

    // ─── Buttons ──────────────────────────
    this.proceedHereButton = page.getByRole('button', { name: 'Proceed here' });
    this.proceedToCaptureButton = page.getByRole('button', {
      name: 'Proceed to Capture',
    });

    // ─── Mobile verification popup ─────────
    this.mobileVerificationPopup = page.getByText(
      'Complete your verification on Mobile browser'
    );
  }

  async navigateToVerification() {
    await this.customerMenu.click();
    await this.onetimeVerificationMenu.click();
  }

  async searchCustomer(customerId, idType, showPopup = true) {
    await this.customerIdInput.fill(customerId);
    await this.searchButton.click();

    await this.idDropdown.click();
    await this.page.getByRole('option', { name: idType }).click();

    // ✅ Click Proceed here
    await this.proceedHereButton.click({ force: true });

    // ✅ Wait for popup and visually see it
    if (showPopup) {
      await expect(this.mobileVerificationPopup).toBeVisible({
        timeout: 10000,
      });

      console.log('✅ Mobile verification popup is visible');

      // ✅ Pause to SEE the window during automation
      // await this.page.pause(); // remove later if not required
    }

    // ✅ Continue flow
    await this.proceedToCaptureButton.click({ timeout: 160000 });
  }
}

module.exports = { CustomerVerificationPage };
``