import { expect } from '@playwright/test';
import { clickAndHandleDialog } from './uiUtils.js';

export const INDEX_URL = 'https://uatapp.manappuram.net/purchase/Index/Index.aspx';

export async function gotoVendorManagement(page) {
  await page.goto(INDEX_URL);
  await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
  await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=1"]').click();
}

export async function searchVendorAndSelect(page, vendorId) {
  const searchBox = page.getByRole('textbox', { name: 'Search..' });
  await searchBox.type(vendorId);
  await page.getByText(vendorId).first().click();
}

export async function uploadVendorDocument(page, {
  docValue,
  filePath,
  kycTypeValue,
  aadharValue,
  ignoreDialogTexts = []
}) {
  await page.locator('#ddl_doc').selectOption(String(docValue));

 if (kycTypeValue) {
    const kycType = page.locator('#kycType');

    await kycType.waitFor({ state: 'visible', timeout: 15000 });

    await page.waitForFunction(
      el => el.options.length > 0,
      await kycType.elementHandle()
    );

    await kycType.selectOption(String(kycTypeValue));
  }

if (aadharValue) {
    await page
      .getByRole('textbox', { name: /Enter Aadharcard Number/i })
      .fill(String(aadharValue));
  }

  await page.locator('#imgFileType').setInputFiles(filePath);

  await clickAndHandleDialog(
    page,
    page.getByRole('button', { name: 'Upload' }),
    { ignoreTexts: ignoreDialogTexts, timeout: 2500 }
  );

  await page.waitForLoadState('networkidle').catch(() => {});
}

export async function expectTextAndExtractAfterColon(page, containsText, timeout = 15000) {
  const loc = page.getByText(containsText);
  await expect(loc).toBeVisible({ timeout });
  const text = (await loc.textContent()) || '';
  const value = (text.split(':')[1] || '').trim();
  return value;
}
