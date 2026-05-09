const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { CustomerVerificationPage } = require('../../../pages/OneTime_CustomerVerificationPage');


test('Complete add customer flow', async ({ page }, testInfo) => {
  // ✅ Read values from playwright.config.js
  const { CUSTOMER_APP_URL, credentials } = testInfo.project.use;

  const loginPage = new LoginPage(page);
  const customerPage = new CustomerVerificationPage(page);

   await loginPage.goto(CUSTOMER_APP_URL);
  await loginPage.login(
    credentials.customerEmployeeId,
    credentials.customerPassword
  );
    await customerPage.navigateToVerification();
});