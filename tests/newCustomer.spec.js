const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({
    headless: false
  });

  const context = await browser.newContext({
    permissions: ['camera'],
    firefoxUserPrefs: {
      "media.navigator.permission.disabled": true,
      "media.getusermedia.prompt.testing": true,
      // Set this to false to use REAL camera
      "media.navigator.streams.fake": false
    }
  });

  const page = await context.newPage();
  await page.goto('https://example-camera-app.com');

  // wait for camera stream to start
  await page.waitForTimeout(5000);

});