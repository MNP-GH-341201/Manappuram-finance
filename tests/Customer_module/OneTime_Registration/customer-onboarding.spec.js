const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/customer_module/LoginPage');
const { CustomerVerificationPage } = require('../../../pages/customer_module/OneTime_CustomerVerificationPage');
const { CameraFrame } = require('../../../pages/customer_module/CameraFrame');

test('Complete onboarding with live camera', async ({ page }, testInfo) => {
  // ✅ Read values from playwright.config.js
  const { CUSTOMER_APP_URL, credentials } = testInfo.project.use;

  const loginPage = new LoginPage(page);
  const customerPage = new CustomerVerificationPage(page);
  const cameraFrame = new CameraFrame(page);

  await loginPage.goto(CUSTOMER_APP_URL);
  await loginPage.login(
    credentials.customerEmployeeId,
    credentials.customerPassword
  );

  await customerPage.navigateToVerification();
  await customerPage.searchCustomer(
    '05890012231821',
    'COPY OF VOTERSID'
  );

  await cameraFrame.waitForCameraReady();
  await cameraFrame.captureWithRetry();
});