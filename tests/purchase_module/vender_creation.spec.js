import { test, expect } from '@playwright/test';
import { generateAccountNo } from '../utils/accountUtils.js';
import { makeUniqueVendorData } from '../utils/dataUtils.js';
import {
  scrollContainerToBottom,
  selectSuggestionStartingWith,
  pickDateInJqueryCalendar
} from '../utils/uiUtils.js';
import {
  gotoVendorManagement,
  searchVendorAndSelect,
  uploadVendorDocument,
  expectTextAndExtractAfterColon,
  searchVendorDocument,
  handlePopup
} from '../utils/vendorUtils.js';
import { getOtpFromDb } from '../utils/dbUtils.js';
import fs from 'fs';
import path from 'path';

async function fetchOtpWithRetry(phone, retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    const otp = await getOtpFromDb(phone);

    if (otp) {
      console.log(`✅ OTP found on attempt ${i + 1}`);
      return otp;
    }

    console.log(`⏳ OTP not found. Retry ${i + 1}/${retries}`);
    await new Promise(res => setTimeout(res, delay));
  }

  return null;
}


let vendorId = '';
let uniquePhone = '';
let uniqueEmail = '';
let vendorName = '';

test.describe.serial('Vendor Management Flow (Login once, multiple tests)', () => {

  test('Test-1: Create Vendor and capture Vendor ID', async ({ page }) => {
    const data = makeUniqueVendorData('Test');
    uniquePhone = data.phone;
    uniqueEmail = data.email;
    vendorName = data.name;

    await page.goto('https://uatapp.manappuram.net/purchase/Index/Index.aspx');

    await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
    await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=1"]').click();

    await page.locator("(//div[@class='bar1'])[1]").click();
    await page.locator("//a[contains(.,'Add New Vendor')]").click();

    await page.locator('#ddl_vendor').selectOption('2');
    await page.locator('#GlobalNo').check();
    await page.locator('#rbNotComposite').check();
    await page.locator('#NOesi').check();

    await page.selectOption('#VENDORCAT1', { label: 'ELECTRICAL VENDORS' });
    await page.locator('#UANN').check();
    await page.locator('#relation_no').check();
    await page.selectOption('#ddl_msme', { label: 'NORMAL VENDOR' });

    await page.getByPlaceholder("ENTER VENDOR NAME").fill(vendorName);
    await page.getByPlaceholder("ADD CONTACT NAME").fill(`${vendorName} test`);
    await page.getByPlaceholder("Enter Contact Email").fill(uniqueEmail);
    await page.getByPlaceholder("Add Contact No").fill(uniquePhone);

    await page.getByPlaceholder("Add Door No & Building Name").fill('126 A MAIN ROAD');
    await page.selectOption('#ddl_Country', { label: 'INDIA' });

    await scrollContainerToBottom(page, '#content');

    await page.locator('#rdbState').click();
    await page.selectOption('#ddlState', '19');
    await page.selectOption('#ddl_District', '306');
    await page.selectOption('#ddlPost', "129010");

    await page.getByPlaceholder("Add City").fill('KANNUR');
    await page.getByPlaceholder("Enter Street & Area").fill('126 A MAIN ROAD');

    await page.getByPlaceholder("Add Email id").fill(uniqueEmail);
    await page.getByPlaceholder("Add Phone Number").fill(uniquePhone);
    await page.getByPlaceholder("Add PAN No").fill('ATFPA2435D');
    //await page.getByPlaceholder("Add Annual Turnover").fill('1000');
    await page.locator('#ddl_EST').selectOption({ label: 'Individual/ sole proprietorship' });


    await page.getByPlaceholder("Client Registration Date").click();
    await page.locator('.ui-datepicker-calendar a:text-is("4")').click();

    await page.locator('#VendorDateOfBirth').click();
    await page.locator('.ui-datepicker-year').selectOption('2026');
    await page.locator('.ui-datepicker-year').selectOption('2016');
    await page.locator('.ui-datepicker-year').selectOption('2006');
    await page.locator('.ui-datepicker-year').selectOption('1996');
    await page.locator('.ui-datepicker-month').selectOption('7');
    await page.getByRole('link', { name: '23' }).click();

    await page.locator('#BTNOTP').click();
    await page.waitForSelector('#OTP', { timeout: 160000 });

    const otp = await fetchOtpWithRetry(uniquePhone);

    await page.getByPlaceholder("ENTER OTP").fill(String(otp));
    //await page.getByPlaceholder("ENTER OTP").fill(String(otp));

    await page.getByRole('button', { name: 'VERIFY' }).click({ force: true });

    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const successLocator = page.getByText(/Vendor Created Vendor ID/i);
    await expect(successLocator).toBeVisible({ timeout: 20000 });

    const fullText = await page.locator('body').innerText();
    const match = fullText.match(/Vendor ID is[:\s]+([A-Z0-9]+)/i);

    if (!match) {
      throw new Error('❌ Vendor ID not found');
    }

    vendorId = match[1];
    console.log('✅ Captured Vendor ID:', vendorId);

    // ✅ Close popup
    await page.getByRole('button', { name: /ok/i }).click();

    const filePath = path.join(process.cwd(), 'vendorData.json');

    fs.writeFileSync(
      filePath,
      JSON.stringify({ vendorId }, null, 2),
      'utf-8'
    );

  });

  test('Test-2: Site Creation using captured Vendor ID', async ({ page }) => {
    expect(vendorId).not.toBe('');

    await gotoVendorManagement(page);
    await page.getByRole('tab', { name: 'Site' }).click();

    await page.locator('#divMenuSite .bar1').click();
    await page.getByRole('link', { name: 'Add Site Details' }).click();

    await searchVendorAndSelect(page, vendorId);

    await page.locator('input[onclick="SearchVendor1(0)"]').click({ force: true });
    await expect(page.locator('#txtVendrid3')).toHaveValue(vendorId, { timeout: 5000 });

    await page.locator('#txtDoorAddress').fill('SITE ADDRESS');
    await page.locator('#ddlState1').selectOption('17');
    await page.locator('#ddlDistrict').selectOption('474');
    await page.getByRole('combobox').nth(2).selectOption('10577');
    await page.locator('#txtLocation').fill('CHENNAI SITE');
    await page.locator('#txtPhone').fill(uniquePhone);

    await page.getByRole('button', { name: 'Confirm' }).click();

    const locationLabel = page.locator('text=/Location Added ID/i');

    await expect(locationLabel).toBeVisible();

    const text = await locationLabel.textContent();

    const locationId = text?.match(/\d+/)?.[0];

    console.log('✅ Location ID:', locationId);

    const filePath = path.join(process.cwd(), 'vendorData.json');

    const existingData = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : {};

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          ...existingData,
          locationId
        },
        null,
        2
      ),
      'utf-8'
    );

    await page.getByRole('button', { name: 'OK' }).click();
  });

  test('Test-3: Bank Details / NEFT using captured Vendor ID', async ({ page }) => {
    //expect(vendorId).not.toBe('');

    const vendorData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'vendorData.json'),
        'utf8'
      )
    );

    const vendorId = vendorData.vendorId;
    const locationId = vendorData.locationId;

    expect(vendorId).toBeTruthy();
    expect(locationId).toBeTruthy();

    console.log('✅ Vendor ID:', vendorId);
    console.log('✅ Location ID:', locationId);


    await gotoVendorManagement(page);
    await page.getByRole('tab', { name: 'Bank Details' }).click();

    await page.locator('#MenuNeftDetails .bar1').click();
    await page.getByRole('link', { name: 'Add New Neft' }).click();

    await searchVendorAndSelect(page, vendorId);
    await page.locator('input[onclick="SearchVendorNeft()"]').click({ force: true });

    await page.waitForFunction(() => {
      const d = document.querySelector('#ddlSites');
      return d && d.options && d.options.length > 1;
    });

    const options = await page.locator('#ddlSites option').evaluateAll(
      opts =>
        opts.map(o => ({
          text: o.textContent?.trim(),
          value: o.getAttribute('value')
        }))
    );

    console.log('Available Sites:', options);

    // Select site using captured Location ID
    await page.selectOption('#ddlSites', {
      value: locationId
    });


    await page.getByRole('radio', { name: 'Add New Neft' }).check();
    await page.selectOption('#ddl_state2', { label: 'KERALA' });
    await page.selectOption('#ddl_dist', { label: 'KOLLAM' });
    await page.selectOption('#ddl_bank', { label: 'INDIAN BANK' });
    await page.selectOption('#ddl_branch', { label: 'KOLLAM' });
    await page.selectOption('#ddl_acct', { label: 'SAVINGS BANK' });

    const accNo = generateAccountNo();

    await page.locator('#txtaccno').fill(accNo);
    await page.locator('#txtaccno').press('Tab');
    await page.locator('#txtaccno1').fill(accNo);
    await page.locator('#txtaccno1').press('Tab');

    await expect(page.locator('#txtaccno')).toHaveValue(accNo, { timeout: 2000 });
    await expect(page.locator('#txtaccno1')).toHaveValue(accNo, { timeout: 2000 });

    await page.locator('#txtmoblno').fill(uniquePhone);
    await page.locator('#txtpbname').fill('Test Bank');
    await page.locator('#txtRemark').fill('NEFT details for testing');

    await page.locator('#imgPassBook').setInputFiles('tests/image/cheque.pdf');
    await page.locator('#cpbtnSubmit1').click();
  });
  test('Test-4: Documents using captured Vendor ID', async ({ page }) => {
    const vendorData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'vendorData.json'),
        'utf8'
      )
    );

    const vendorId = vendorData.vendorId;
    const locationId = vendorData.locationId;

    expect(vendorId).toBeTruthy();
    expect(locationId).toBeTruthy();

    console.log('✅ Vendor ID:', vendorId);
    console.log('✅ Location ID:', locationId);

    page.on('dialog', async dialog => {
      console.log('Dialog Message:', dialog.message());
      await dialog.accept();
    });

    await gotoVendorManagement(page);

    await page.getByRole('tab', { name: 'Documents' }).click();

    await searchVendorDocument(page, vendorId);

    await handlePopup(page);

    const filePath = 'tests/image/cheque.pdf';
    const ignoreTexts = ['already', 'exists', 'duplicate'];

    // Document 2 - Bank Account Details
    await uploadVendorDocument(page, {
      docValue: 2,
      filePath,
      ignoreDialogTexts: ignoreTexts
    });
    await handlePopup(page);

    // Select Site
    await page.waitForFunction(() => {
      const d = document.querySelector('#ddlSiteDoc');
      return d && d.options && d.options.length > 1;
    });

    const options = await page.locator('#ddlSiteDoc option').evaluateAll(
      opts =>
        opts.map(o => ({
          text: o.textContent?.trim(),
          value: o.getAttribute('value')
        }))
    );

    console.log('Available Sites:', options);

    // Select site using captured Location ID
    await page.selectOption('#ddlSiteDoc', {
      value: locationId
    });

    await handlePopup(page);

    // Document 6
    await uploadVendorDocument(page, {
      docValue: 6,
      filePath,
      ignoreDialogTexts: ignoreTexts
    });
    await handlePopup(page);

    // Document 8 - KYC
    await uploadVendorDocument(page, {
      docValue: 8,
      kycTypeValue: 4,
      aadharValue: '35323453563452',
      filePath,
      ignoreDialogTexts: ignoreTexts
    });
    await handlePopup(page);

    // Document 10
    await uploadVendorDocument(page, {
      docValue: 10,
      filePath,
      ignoreDialogTexts: ignoreTexts
    });
    await handlePopup(page);

    // Final Upload
    await page.getByRole('button', { name: 'Upload' }).click();

    await handlePopup(page);

    await page.getByRole('button', { name: 'Exit' }).click();
  });

});