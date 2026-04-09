const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { CustomerVerificationPage } = require('../pages/CustomerVerificationPage');
const { CameraFrame } = require('../pages/CameraFrame');

const URL = 'https://uatonpay.manappuram.com/hyperverge/#/login';

test('Complete onboarding with live camera', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const customerPage = new CustomerVerificationPage(page);
  const cameraFrame = new CameraFrame(page);

  await loginPage.goto(URL);
  await loginPage.login('406653', 'soft1234');

  await customerPage.navigateToVerification();
  await customerPage.searchCustomer(
    '05890012231821',
    'COPY OF VOTERSID'
  );

  await cameraFrame.waitForCameraReady();
  await cameraFrame.captureWithRetry();
});