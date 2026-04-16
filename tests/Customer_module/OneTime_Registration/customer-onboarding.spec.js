const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { CustomerVerificationPage } = require('../../../pages/OneTime_CustomerVerificationPage');
const { CameraFrame } = require('../../../pages/CameraFrame');

test('Complete onboarding with live camera', async ({ page }, testInfo) => {
  // ✅ Read values from playwright.config.js
  const { appUrl, credentials } = testInfo.project.use;

  const loginPage = new LoginPage(page);
  const customerPage = new CustomerVerificationPage(page);
  const cameraFrame = new CameraFrame(page);

  await loginPage.goto(appUrl);
  await loginPage.login(
    credentials.employeeId,
    credentials.password
  );

  await customerPage.navigateToVerification();
  await customerPage.searchCustomer(
    '05890012231821',
    'COPY OF VOTERSID'
  );

  await cameraFrame.waitForCameraReady();
  await cameraFrame.captureWithRetry();
});