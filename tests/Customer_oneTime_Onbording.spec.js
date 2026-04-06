import { test, expect } from '@playwright/test';

test('Customer Login - Live Camera', async ({ browser, }) => {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });
  const page = await context.newPage();
  
  // Pre-grant permissions for the target origin
  await context.grantPermissions(['camera', 'microphone'], {
    origin: 'https://uatonpay.manappuram.com',
  });

  await page.goto(
    'https://uatonpay.manappuram.com/hyperverge/#/login',
    { timeout: 60000 }
  );

  await page.waitForSelector('input[placeholder="Employee ID"]', {
    timeout: 60000,
  });

  await page.getByPlaceholder('Employee ID').fill('406653');
  await page.getByPlaceholder('Password').fill('soft1234');
  await page.getByRole('button', { type: 'submit' }).click();

  await expect(
    page.getByText('SULTAN PET')
  ).toBeVisible({ timeout: 45000 });

  await page.locator("//span[normalize-space()='Customer']").click();
  await page.locator("//span[normalize-space()='Onetime Verification']").click({
    timeout: 60000,
  });

  await page.waitForSelector(
    "input[placeholder='Enter Customer Id']",
    { timeout: 60000 }
  );

  await page
    .getByPlaceholder('Enter Customer Id')
    .fill('05890012231821');

  await page.getByRole('button', { name: 'Search' }).click();

  await page.getByPlaceholder('Please Select Your ID').click();
  await page
    .getByRole('option', { name: 'COPY OF VOTERSID' })
    .click({ timeout: 60000 });

  await page.getByRole('button', { name: 'Proceed here' }).click({
    force: true,
  });

  await page
    .getByRole('button', { name: 'Proceed to Capture' })
    .click({ timeout: 160000 });

  const frame= page.frameLocator('iframe');
  await frame.getByRole('button', { name: 'Capture Photo' }).click({ timeout: 60000 });

  // await expect(captureButton).toBeVisible({ timeout: 120000 });
  // await captureButton.click({ timeout: 120000 });

  // await page.waitForTimeout(5000);
});