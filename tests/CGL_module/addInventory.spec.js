const { test } = require('@playwright/test');
const { LoginPage } = require('../../pages/CGL_module/loginPage');
const { AddInventoryPage } = require('../../pages/CGL_module/addInventoryPage');

test('Login and Add Inventory flow', async ({ page }, testInfo) => {
  const { CGL_APP_URL, credentials } = testInfo.project.use;

  // ✅ Login
  const loginPage = new LoginPage(page);
  await loginPage.goto(CGL_APP_URL);
  await loginPage.login(
    credentials.CGL_employeeId,
    credentials.CGL_employeePassword
  );

  // ✅ Add Inventory
  const addInventoryPage = new AddInventoryPage(page);
  await addInventoryPage.navigateToAddInventory();
  
  //await this.waitForLoadingToComplete();
  await addInventoryPage.searchCustomerById(
     '04310021704577',   // ✅ dynamic ID
    'Hamsa'          // ✅ dynamic name
  );

 // await addInventoryPage.closeDialogs();
});