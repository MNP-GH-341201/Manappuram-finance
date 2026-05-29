import { test, expect } from '@playwright/test';

test('Login and add new vendor with unique phone and email', async ({ page }) => {

  // ✅ Generate UNIQUE data (INLINE, NO faker)
  const timestamp = Date.now();
  const uniquePhone = '9' + String(timestamp).slice(-9); // 10-digit
  const uniqueEmail = `vendor_${timestamp}@gmail.com`;

  console.log('✅ Phone:', uniquePhone);   
  console.log('✅ Email:', uniqueEmail);

  await page.goto('https://uatapp.manappuram.net/purchase/Login.aspx');

  await page.getByPlaceholder('Username').fill('50292');
  await page.getByPlaceholder('Password').fill('soft1234');

  page.once('dialog', async dialog => {
    console.log('Popup text:', dialog.message());
    await dialog.accept();
  });

  await page.getByRole('button', { type: 'submit' }).click();
  await expect(page).toHaveURL(
    'https://uatapp.manappuram.net/purchase/Index/Index.aspx'
  );

  await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
  await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=1"]').click();

  await page.locator("(//div[@class='bar1'])[1]").click();
  await page.locator("//a[contains(.,'Add New Vendor')]").hover();
  await page.locator("//a[contains(.,'Add New Vendor')]").click();

  await page.locator('#ddl_vendor').selectOption('2');
  await page.locator('#GlobalNo').check();
  await page.locator('#rbNotComposite').check();
  await page.locator('#NOesi').check();
  await page.selectOption('#VENDORCAT1', { label: 'ELECTRICAL VENDORS' });
  await page.locator('#UANN').check();
  await page.locator('#relation_no').check();
  await page.selectOption('#ddl_msme', { label: 'NORMAL VENDOR' });
  await page.getByPlaceholder("ENTER VENDOR NAME").fill('Sarika');
  await page.getByPlaceholder("ADD CONTACT NAME").fill('Sarika test');
  await page.getByPlaceholder("Enter Contact Email").fill(uniqueEmail);
  await page.getByPlaceholder("Add Contact No").fill(uniquePhone);
  await page.getByPlaceholder("Add Door No & Building Name")
           .fill('126 A MAIN ROAD');
  await page.selectOption('#ddl_Country', { label: 'INDIA' });
  await page.locator('#content').evaluate(el => {
    el.scrollTop = el.scrollHeight;
  });

  await page.click('//div[contains(.,"Pincode")]/input[@type="radio"]');
  await page.waitForTimeout(1000);

  await page.locator('#PinSearch').type('679304');
  await page.waitForTimeout(1000);
  await page.locator('text=679304').first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder("Add City").fill('KANNUR');
  await page.getByPlaceholder("Enter Street & Area")
           .fill('126 A MAIN ROAD');
  await page.getByPlaceholder("Add Email id").fill(uniqueEmail);
  await page.getByPlaceholder("Add Phone Number").fill(uniquePhone);
  await page.getByPlaceholder("Add PAN No").fill('ATFPA2435D');
  await page.getByPlaceholder("Add Annual Turnover").fill('1000');

  // ✅ Date pickers
  await page.getByPlaceholder("Client Registration Date").click();
  await page.locator(".ui-datepicker-year").selectOption('2016');
  await page.locator('.ui-datepicker-calendar a:text-is("15")').click();

   await page.getByPlaceholder("GST Registration Date").click();
  await page.locator(".ui-datepicker-year").selectOption('2017');
  await page.locator('.ui-datepicker-calendar a:text-is("20")').click();

  await page.selectOption('#ddl_EST', {
    label: 'Individual/ sole proprietorship'
  });

  await page.locator('#VendorDateOfBirth').click();
  await page.locator('.ui-datepicker-calendar a:text-is("23")').click();

  // ✅ Confirm (stable)
  const confirmBtn = page.getByRole('button', { name: /confirm/i });
  await confirmBtn.scrollIntoViewIfNeeded();
  await confirmBtn.click();
   //await page.pause();

  // ✅ Validate success message
const successLocator = page.getByText('Vendor Created Vendor ID is:');
await expect(successLocator).toBeVisible({ timeout: 10000 });

// ✅ Capture Vendor ID
const successText = await successLocator.textContent();
const vendorId = successText.split(':')[1].trim();
console.log('✅ Vendor ID:', vendorId);

// ✅ Close popup
await page.getByRole('button', { name: 'OK' }).click();

/* ---------------- SITE CREATION ---------------- */

await page.getByRole('tab', { name: 'Site' }).click();
await page.waitForTimeout(1000);

await page.locator('#divMenuSite .bar2').click();
await page.waitForTimeout(1000);
await page.getByRole('link', { name: 'Add Site Details' }).click();
await page.waitForTimeout(1000);
// ✅ Use captured Vendor ID
await page.getByRole('textbox', { name: 'Search..' }).type(vendorId);
await page.waitForTimeout(1000);
  await page.getByText(vendorId).first().click();
  await page.waitForTimeout(1000);
await page.locator('#btnSearch1').click({force: true});
  await page.waitForTimeout(5000);

await page.locator('#txtDoorAddress').fill('SITE ADDRESS');
await page.locator('#ddlState1').selectOption('17');
await page.locator('#ddlDistrict').selectOption('474');
await page.getByRole('combobox').nth(2).selectOption('10577');
await page.locator('#txtLocation').fill('SFSd');
await page.locator('#txtPhone').fill(uniquePhone);

// ✅ Confirm site creation
await page.getByRole('button', { name: 'Confirm' }).click();
await page.waitForTimeout(2000);

// ✅ Validate site creation success
await page.getByRole('button', { name: 'OK' }).click();
//await page.pause();

/* ---------------- Bank Details ---------------- */
 await page.getByRole('tab', { name: 'Bank Details' }).click();
 await page.waitForTimeout(1000);
  await page.locator('#MenuNeftDetails').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Add New Neft' }).click();
  await page.waitForTimeout(1000);
 await page.getByRole('textbox', { name: 'Search..' }).type(vendorId);
await page.waitForTimeout(2000);
  await page.getByText(vendorId).first().click({force: true});
  await page.waitForTimeout(1000);
await page.locator('#btnSearch2').click({force: true});
  await page.waitForTimeout(5000);
  await page.getByRole('radio', { name: 'Add New Neft' }).check();
  await page.locator('#ddl_state2').selectOption('36');
  await page.locator('#ddl_dist').selectOption('901');
  await page.locator('#ddl_bank').selectOption('67');
  await page.locator('#ddl_branch').selectOption('IDIB000P670');
  await page.locator('#txtIfsc').click();
  await page.locator('#ddl_acct').selectOption('11');
  await page.locator('#txtaccno').click();
  await page.locator('#txtaccno').fill('321324355');
  await page.locator('#txtaccno1').click();
  await page.locator('#txtaccno1').fill('321324355');
  await page.locator('#txtaccno1').click();
  await page.locator('#txtaccno1').click();
  await page.locator('#txtmoblno').click();
  await page.locator('#txtpbname').click();
  await page.locator('#txtRemark').click();
  await page.getByRole('button', { name: 'Choose File' }).click();
 // await page.getByRole('button', { name: 'Choose File' }).setInputFiles('rdlcPOform - POFormView.pdf');
  await page.getByRole('button', { name: 'Add NEFT' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
//await page.pause();
});