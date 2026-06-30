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

export async function searchVendorDocument(page, vendorID) {
  const searchBox = page.locator('#txtSearch3');

  await searchBox.click();
  await searchBox.fill('');
  await searchBox.type(vendorID, { delay: 100 });

  // Wait for dropdown options to appear
  const dropdownOption = page.locator('#txtSearch3autocomplete-list');
  await dropdownOption.click();

  // await dropdownOption.waitFor({ state: 'visible', timeout: 10000 });

  // // Ensure exact matching (avoid TEST suffix issue)
  // const options = page.locator('li');

  // const count = await options.count();

  // for (let i = 0; i < count; i++) {
  //   const text = await options.nth(i).innerText();

  //   if (text.startsWith(vendorID)) {
  //     await options.nth(i).click();
  //     break;
  //   }
  // }

  // Click search button
  await page.locator('#btnSearch3').click({force:true});

  // ✅ Wait for API/response instead of timeout
  await page.waitForLoadState('networkidle');
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

export async function handlePopup(page) {
  try {
    const okButton = page.getByRole('button', { name: /^OK$/i });

    if (await okButton.isVisible({ timeout: 3000 })) {
      await okButton.click();
    }
  } catch {
    // No popup found
  }
}
