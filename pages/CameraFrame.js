const { expect } = require('@playwright/test');

class CameraFrame {
  constructor(page) {
    this.page = page;
    this.frame = page.frameLocator('iframe[src*="hyperverge"]');

    // Elements
    this.disabledCameraIcon = this.frame.locator('#hv-camera-icon-image');
    this.capturePhotoButton = this.frame.getByText('Capture Photo');
    this.errorIcon = page.locator('.hv-retake-screen-exclamation');
  }

  async waitForCameraReady() {
    await expect(this.disabledCameraIcon).toBeHidden({
      timeout: 60000,
    });

    await this.capturePhotoButton.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async captureWithRetry(maxAttempts = 5) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`📸 Capture attempt ${attempt}`);

      await this.capturePhotoButton.click({ force: true });
      await this.page.waitForTimeout(3000);

      const hasError = (await this.errorIcon.count()) > 0;
      if (!hasError) {
        console.log('✅ Photo captured successfully');
        return;
      }

      console.log('❌ Capture failed, retrying...');
    }

    throw new Error('❌ Photo capture failed after maximum retries');
  }
}

module.exports = { CameraFrame };
