const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { CustomerVerificationPage } = require('../../../pages/OneTime_CustomerVerificationPage');


test('Complete add customer flow', async ({ page }, testInfo) => {
  // ✅ Read values from playwright.config.js
  const { appUrl, credentials } = testInfo.project.use;

  const loginPage = new LoginPage(page);
  const customerPage = new CustomerVerificationPage(page);

   await loginPage.goto(appUrl);
  await loginPage.login(
    credentials.employeeId,
    credentials.password
  );
    await customerPage.navigateToVerification();
});