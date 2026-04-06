const { test, expect, firefox } = require('@playwright/test');

test('capture live photo using Firefox camera', async () => {
  const browser = await firefox.launch({
    headless: false, // REQUIRED for real camera
  });

  const context = await browser.newContext({
    firefoxUserPrefs: {
      'media.navigator.permission.disabled': true,
      'media.getusermedia.prompt.testing': true,
      'media.navigator.streams.fake': false, // REAL camera
    },
  });

  // ✅ Grant camera permission AFTER context creation
  await context.grantPermissions(['camera'], {
    origin: 'https://example-camera-app.com',
  });

  const page = await context.newPage();

  await page.goto('https://example-camera-app.com');

  // wait for camera stream to initialize
  await page.waitForTimeout(5000);

  const video = page.locator('video');
  await expect(video).toBeVisible();

  await browser.close();
});