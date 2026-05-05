const { test, expect } = require('@playwright/test');
const {
  generateName,
  generateEmail,
  generateIndianMobile,
  generateAddress,
  generatePAN,
  generateGST,
  generateDOB,
  saveTestData
} = require('../utils/testData');

test('Login and create vendor with random valid data', async ({ page }) => {

  // ✅ Generate random valid data
  const vendorName = generateName();
  const contactName = generateName();
  const email = generateEmail(vendorName);
  const phone = generateIndianMobile();
  const address = generateAddress();
  const pan = generatePAN();
  const gst = generateGST(pan);
  const dob = generateDOB(18);

  // ✅ Save generated data
  saveTestData({
    vendorName,
    contactName,
    email,
    phone,
    address,
    pan,
    gst,
    dob
  });

  console.log({ vendorName, email, phone });

  // ✅ Handle any popup
  page.on('dialog', async dialog => {
    console.log('Alert:', dialog.message());
    await dialog.accept();
  });

  // ✅ Login
  await page.goto('https://uatapp.manappuram.net/purchase/Login.aspx');
  await page.getByPlaceholder('Username').fill('50292');
  await page.getByPlaceholder('Password').fill('soft1234');
  await page.getByRole('button', { type: 'submit' }).click();

  await expect(page).toHaveURL(/Index.aspx/);

  // ✅ Navigation
  await page.getByRole('link', { name: 'VENDOR MANAGEMENT' }).click();
  await page.locator('//a[@href="../Purchase/VendorManagmnt.aspx?frmid=1"]').click();
  await page.locator("(//div[@class='bar1'])[1]").click();
  await page.getByRole('link', { name: 'Add New Vendor' }).click();

  // ✅ Vendor Details
  await page.selectOption('#ddl_vendor', '2');
  await page.selectOption('#VENDORCAT1', { label: 'ELECTRICAL VENDORS' });
  await page.fill('#txtesiNumber', '8805');
  await page.selectOption('#ddl_msme', { label: 'NORMAL VENDOR' });

  await page.getByPlaceholder("ENTER VENDOR NAME").fill(vendorName);
  await page.getByPlaceholder("ADD CONTACT NAME").fill(contactName);
  await page.getByPlaceholder("Enter Contact Email").fill(email);
  await page.getByPlaceholder("Add Contact No").fill(phone);

  // ✅ Address
  await page.getByPlaceholder("Add Door No & Building Name").fill(address);
  await page.selectOption('#ddl_Country', { label: 'INDIA' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.click('//div[contains(.,"Pincode")]/input[@type="radio"]');
  await page.type('#PinSearch', '679304');
  await page.locator('text=679304').first().click();

  await page.getByPlaceholder("Add City").fill('KANNUR');
  await page.getByPlaceholder("Enter Street & Area").fill(address);
  await page.getByPlaceholder("Add Email id").fill(email);
  await page.getByPlaceholder("Add Phone Number").fill(generateIndianMobile());

  // ✅ PAN, Turnover
  await page.getByPlaceholder("Add PAN No").fill("ATFPA2435D");
  await page.getByPlaceholder("Add Annual Turnover").fill('1000000');

  // ✅ Registration date
  await page.getByPlaceholder("Client Registration Date").click();
  await page.locator('.ui-datepicker-calendar a:text-is("6")').click();

  // ✅ Establishment type
  await page.selectOption('#ddl_EST', { label: 'Individual/ sole proprietorship' });

  // ✅ DOB (18+)
  // DOB selection
// Select DOB
await page.locator('#VendorDateOfBirth').click();
await page.locator(
  '.ui-datepicker-calendar td:not(.ui-datepicker-other-month) a:text-is("18")'
).click();

// Commit DOB properly
await page.keyboard.press('Escape');
await page.keyboard.press('Tab');

// Unlock scrolling (Firefox fix)
await page.evaluate(() => {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
});

// Remove any datepicker remnants
await page.evaluate(() => {
  document.querySelectorAll('.ui-datepicker').forEach(el => el.remove());
});

// Submit without relying on page scroll
const confirmBtn = page.locator('[type="button"][onclick="PutVendor()"]');
await confirmBtn.scrollIntoViewIfNeeded();
await confirmBtn.click();
await page.waitForTimeout(5000);
});