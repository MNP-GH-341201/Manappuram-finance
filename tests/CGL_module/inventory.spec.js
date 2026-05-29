import { test, expect } from '@playwright/test';

test('inventory creation flow', async ({ page }) => {
  // 1. Navigate and Login
  await page.goto('https://uatonpay.manappuram.com/cglvapt/index.html');
 
  // Wait for the login screen fields to explicitly load
  const empIdInput = page.getByLabel('Employee ID');
  await expect(empIdInput).toBeVisible({ timeout: 15000 });
  await empIdInput.fill('98118');
  await page.getByLabel('Password').fill('soft1234');
  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // 2. Navigate to Add Inventory
  const cglBtn = page.locator('.mat-button-wrapper:has-text("CGL")');
  await expect(cglBtn).toBeVisible({ timeout: 30000 });
  await cglBtn.click();

  const inventoryBtn = page.locator('#menu-item-11 .menu-title');
  await expect(inventoryBtn).toBeVisible({ timeout: 15000 });
  await inventoryBtn.click();

  // Explicitly wait for submenu animation to finish before clicking
  const addInventoryBtn = page.locator('#sub-menu-11 .menu-title:has-text("Add Inventory")');
  await expect(addInventoryBtn).toBeVisible({ timeout: 15000 });
  await addInventoryBtn.click();

  // 3. Handle Modal (Case-insensitive match)
  const modalButton = page.getByText(/I Understand/i);
  await expect(modalButton).toBeVisible({ timeout: 30000 });
  await modalButton.click();

// 4. Search and Select Customer
  await page.locator('#mat-radio-17').click();
 
  const customerInput = page.getByRole('textbox', { name: 'Customer ID' });
 
  // Click and explicitly wait for the field to stabilize
  await customerInput.click();
  await page.waitForTimeout(500);
 
  // Clear any partial text and type with human-like pacing
  //await customerInput.clear();
  await customerInput.pressSequentially('32130020080272', { delay: 150 });

  // Force the application to process the 14-digit entry
  await customerInput.press('Tab');

  // Wait for the search button to become active
  const searchButton = page.getByRole('button', { name: 'Search' });
  await expect(searchButton).toBeEnabled({ timeout: 15000 });
  await searchButton.click();


    // 5. Select Row and Proceed
  const customerRow = page.getByRole('gridcell', { name: 'HGFHGFHF' });
  // Ensure the search result actually populates on the screen
  await expect(customerRow).toBeVisible({ timeout: 20000 });
  await customerRow.click();
 
  // Use getByRole with a case-insensitive regular expression for maximum reliability
  const detailsBtn = page.getByRole('button', { name: "GO TO DETAILS" });
 
  // Wait for the row selection to activate the button
  await expect(detailsBtn).toBeVisible({ timeout: 2000 });
  // await expect(detailsBtn).toBeEnabled({ timeout: 15000 });
  await detailsBtn.click({force: true});
  await page.pause();
  await page.waitForTimeout(5000);
  //await page.pause();
  //await expect(page.getByRole('button', { name: 'OK' })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'OK' }).click({force: true});

  // 6. Fill Inventory Details
  const selectItem = page.getByPlaceholder('Select Items');
  await expect(selectItem).toBeVisible({ timeout: 15000 });
  await selectItem.selectOption({ label: 'BABY BANGLES' });
  await page.pause();

});