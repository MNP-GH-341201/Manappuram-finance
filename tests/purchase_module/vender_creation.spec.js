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
  expectTextAndExtractAfterColon
} from '../utils/vendorUtils.js';

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

    await page.click('//div[contains(.,"Pincode")]/input[@type="radio"]');
    await page.locator('#PinSearch').type('679304');
    await selectSuggestionStartingWith(page, '679304');

    await page.getByPlaceholder("Add City").fill('KANNUR');
    await page.getByPlaceholder("Enter Street & Area").fill('126 A MAIN ROAD');

    await page.getByPlaceholder("Add Email id").fill(uniqueEmail);
    await page.getByPlaceholder("Add Phone Number").fill(uniquePhone);
    await page.getByPlaceholder("Add PAN No").fill('ATFPA2435D');
    await page.getByPlaceholder("Add Annual Turnover").fill('1000');

    await page.getByPlaceholder("Client Registration Date").click();
    await pickDateInJqueryCalendar(page, '4');

    await page.selectOption('#ddl_EST', { label: 'Individual/ sole proprietorship' });

    await page.locator('#VendorDateOfBirth').click();
    await pickDateInJqueryCalendar(page, '4');

    const confirmBtn = page.getByRole('button', { name: /confirm/i });
    await confirmBtn.scrollIntoViewIfNeeded();
    await confirmBtn.click();

    vendorId = await expectTextAndExtractAfterColon(page, 'Vendor Created Vendor ID is:');
    console.log('Captured Vendor ID:', vendorId);
    expect(vendorId).not.toBe('');

    await page.getByRole('button', { name: 'OK' }).click();
  });

  test('Test-2: Site Creation using captured Vendor ID', async ({ page }) => {
    expect(vendorId).not.toBe('');

    await gotoVendorManagement(page);
    await page.getByRole('tab', { name: 'Site' }).click();

    await page.locator('#divMenuSite .bar2').click();
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
    await page.getByRole('button', { name: 'OK' }).click();
  });

  test('Test-3: Bank Details / NEFT using captured Vendor ID', async ({ page }) => {
    expect(vendorId).not.toBe('');

    await gotoVendorManagement(page);
    await page.getByRole('tab', { name: 'Bank Details' }).click();

    await page.locator('#MenuNeftDetails .bar2').click();
    await page.getByRole('link', { name: 'Add New Neft' }).click();

    await searchVendorAndSelect(page, vendorId);
    await page.locator('input[onclick="SearchVendorNeft()"]').click({ force: true });

    await page.waitForFunction(() => {
      const d = document.querySelector('#ddlSites');
      return d && d.options && d.options.length > 1;
    });

    await page.selectOption('#ddlSites', { label: 'CHENNAI SITE', timeout: 2000 });

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
    expect(vendorId).not.toBe('');

    await gotoVendorManagement(page);
    await page.getByRole('tab', { name: 'Documents' }).click();

    await searchVendorAndSelect(page, vendorId);
    await page.locator('input[onclick="SearchVendorDocument()"]').click({ force: true });
    await page.getByRole('button', { name: 'OK' }).click();

    const filePath = 'tests/image/cheque.pdf';
    const ignoreDialogs = ['already', 'exists', 'duplicate'];

    await uploadVendorDocument(page, { docValue: 2, filePath, ignoreDialogTexts: ignoreDialogs });
    await uploadVendorDocument(page, { docValue: 3, filePath, ignoreDialogTexts: ignoreDialogs });
    await uploadVendorDocument(page, { docValue: 6, filePath, ignoreDialogTexts: ignoreDialogs });

    await uploadVendorDocument(page, {
      docValue: 8,
      kycTypeValue: 4,
      aadharValue: '35323453563452',
      filePath,
      ignoreDialogTexts: ignoreDialogs
    });

    await uploadVendorDocument(page, { docValue: 10, filePath, ignoreDialogTexts: ignoreDialogs });
    await page.getByRole('button', { name: 'Upload ' }).click();

    await page.getByRole('button', { name: 'Exit' }).click();
  });

});