import { test, expect } from '@playwright/test';

let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  await page.goto('https://uatapp.manappuram.net/purchase/Login.aspx');

  await page.getByPlaceholder('Username').fill('50292');
  await page.getByPlaceholder('Password').fill('soft1234');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/Index\/Index\.aspx/i);
});

test.afterAll(async () => {
  await page.close();
});

test('Test after login', async () => {
  await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
  await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=1"]').click();
  await page.locator('(//div[@class="bar1"])[1]').first().click();

  const editVendor = page.locator("//a[contains(.,'Edit Vendor')]");
  await editVendor.hover();
  await editVendor.click();
});

test('Another test after login', async () => {
  const searchBox = page.getByRole('textbox', { name: 'Search....' });
  await searchBox.type('TEST_1777454514442--');

  await page.getByText('TEST_1777454514442--MA25951').first().click();
  await page.getByRole('button', { name: 'Search' }).click({ force: true });

  await page.locator('#rbEdit').click();
  await page.locator('#dl_vendormofify').selectOption({ label: 'VendorType' });

  const confirmBtn = page.getByRole('button', { name: 'Confirm' });
  await confirmBtn.scrollIntoViewIfNeeded();
  await confirmBtn.click();
});
