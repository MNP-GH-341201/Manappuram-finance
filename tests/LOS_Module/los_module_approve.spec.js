const { test,expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LOS_Module/login');
const { AddLosApplicationPage } = require('../../pages/LOS_Module/losModule');

test('Login with valid credentials', async ({ page }, testInfo) => {
  const { LOS_APP_URL, credentials } = testInfo.project.use;

  const loginPage = new LoginPage(page);
  const addLosApplicationPage = new AddLosApplicationPage(page);

  await loginPage.goto(LOS_APP_URL);

  await loginPage.login(
    credentials.LOS_employeeId,
    credentials.LOS_employeePassword
  );

  await expect(loginPage.LOSmodulebranchText)
    .toHaveText('Loan Originating System');
  await loginPage.handleDelayLeadAlert();

  await addLosApplicationPage.navigateToAddLoanApplication();
});