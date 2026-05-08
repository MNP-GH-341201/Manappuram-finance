import { test, expect } from '@playwright/test';
import { generateAccountNo } from '../utils/accountUtils';

const INDEX_URL = 'https://uatapp.manappuram.net/purchase/Index/Index.aspx';

let vendorId = '';
let uniquePhone = '';
let uniqueEmail = '';
let vendorName = '';
//let accountNo = '';


function makeUniqueData() {
  const ts = Date.now();
  uniquePhone = '9' + String(ts).slice(-9);            // 10-digit
  uniqueEmail = `vendor_${ts}@gmail.com`;
  vendorName = `Test_${Date.now()}`;
}

async function selectSuggestionStartingWith(page, textStartsWith) {
  // Suggestions typically like "MA25825--SARIKA..." or "679304"
  const suggestion = page.getByText(new RegExp(`^${textStartsWith}`, 'i')).first();
  await expect(suggestion).toBeVisible({ timeout: 15000 });
  await suggestion.click();
}

test.describe.serial('Vendor Management approval Flow (Login once, multiple tests)', () => {

  test('Test-1: vendor approval capture Vendor ID', async ({ page }) => {
    makeUniqueData();
    await page.goto(INDEX_URL);
     await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
    await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=2"]').click();

    // Open menu
   // await page.locator("(//div[@class='bar1'])[1]").click();


  });
});