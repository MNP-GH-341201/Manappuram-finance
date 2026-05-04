const { cameraFrameLocators } = require('../../locators/locators');

class CameraFrame {
  constructor(page) {
    this.page = page;
    this.frame = page.frameLocator(cameraFrameLocators.frame);

    this.cameraLoader = this.frame.locator(
      cameraFrameLocators.cameraLoader
    );
    this.captureButton = this.frame.locator(
      cameraFrameLocators.captureButton
    );
    this.proceedCapture = this.frame.locator(
      cameraFrameLocators.proceedCapture
    );
    this.errorIcon = this.frame.locator(
      cameraFrameLocators.errorIcon
    );
  }

  async waitForCameraReady() {
    console.log('⏳ Waiting for camera...');

    await this.proceedCapture
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => this.proceedCapture.click())
      .catch(() => { });

    await this.cameraLoader
      .waitFor({ state: 'hidden', timeout: 15000 })
      .catch(() => console.log('⚠ No loader found'));

    await this.captureButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Camera Ready');
  }

  async captureWithRetry(max = 5) {
    for (let i = 1; i <= max; i++) {
      await this.captureButton.click();
      const error = await this.errorIcon.isVisible().catch(() => false);

      if (!error) {
        console.log('✅ Photo captured');
        return;
      }
      console.log(`🔁 Retry ${i}`);
    }
    throw new Error('LIVE_CAMERA_CAPTURE_FAILED');
  }
}

module.exports = { CameraFrame };