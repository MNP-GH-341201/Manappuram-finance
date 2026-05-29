const { cameraFrameLocators } = require('../locators/locators');

class CameraFrame {
  constructor(page) {
    this.page = page;
  }
 
  async initFrame() {
    await this.page.waitForSelector('#hv-instructions-capture-screen', { timeout: 3000 });
    await this.page.waitForTimeout(2000);
    this.frame = this.page.frameLocator('#hv-instructions-capture-screen');
 
    this.errorIcon = this.frame.locator(
      'img.hv-retake-screen-exclamation'
    );

    this.captureButton = this.frame.locator(
      'button:has-text("Capture Photo")'
    );
  } 

  async capturePhoto() {
    await this.captureButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(2000);
    await this.captureButton.click({force: true});
  }

  async captureWithRetry(maxAttempts = 5) {
    console.log('📸 Checking for camera error...');

    let errorVisible = await this.errorIcon.isVisible().catch(() => false);
    console.log('❌ ERROR PHOTO ENABLED:', errorVisible);

    // ✅ If no error initially → proceed
    if (!errorVisible) {
      console.log('✅ No initial error found. Proceeding...');
      return;
    }

    // ✅ Retry loop
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔁 Attempt #${attempt}`);

      await this.capturePhoto();

      // wait for SDK processing
      await this.page.waitForTimeout(3000);

      errorVisible = await this.errorIcon.isVisible().catch(() => false);

      if (!errorVisible) {
        console.log('✅ Capture successful, error cleared');
        return;
      }
    }

    throw new Error('LIVE_CAMERA_CAPTURE_FAILED_AFTER_RETRIES');
  }
}
module.exports = { CameraFrame };
