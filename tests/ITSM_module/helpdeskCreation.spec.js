import { test, expect } from '@playwright/test';
import fs from 'fs';

test('ITSM TOOL - Helpdesk Creation', async ({ page }) => {

  // ✅ Read ticket number
  const data = JSON.parse(fs.readFileSync('ticket.json', 'utf-8'));
  const ticketId = data.ticketNumber;

  console.log('✅ Using Ticket:', ticketId);

  await page.goto('https://uatapp.manappuram.net/ITSM_NEW/Login.aspx');

  // ✅ Login
  await page.locator('input[placeholder="Username"]').fill('368123');
  await page.locator('#password').fill('soft1234');

  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // ✅ Navigation
  await page.getByRole('link', { name: 'BIN OWNER ' }).click();
  await page.getByRole('link', { name: 'BIN OWNER' }).nth(1).click();

  // ✅ Open Search
  await page.locator('button[onclick="sh_details(1)"]').click();

  // ✅ Search ticket
  await page.getByLabel('Ticket Number').fill(ticketId);

  await page.locator('#btnConfirm1').click();

  // ✅ Select ticket row
  // ✅ Click ticket row
await page.locator(`tr:has-text("${ticketId}")`).click();

// ✅ Verify details card opened
await expect(page.locator('#card_tkt_dtls')).toBeVisible();

// ✅ Verify ticket shown in details card
await expect(page.locator('#ticket_show')).toHaveText(ticketId);

// ✅ Scroll to Classification section
await page.locator('#ddlClassif').scrollIntoViewIfNeeded();

// ✅ Select Classification Type
await page.locator('#ddlClassif').selectOption('1');


await page.locator('#txt_workLogSummary_Binowner').fill(
  `Helpdesk ticket created for ${ticketId}`
);

// ✅ Fill Description
await page.locator('#txt_workLogDescription_Binowner').fill(
  `Automation testing for ${ticketId}`
);

// ✅ Handle success popup
page.on('dialog', async dialog => {

  const message = dialog.message();

  console.log('✅ Success Popup:', message);

  expect(message).toContain('success');

  await dialog.accept();
});

// ✅ Submit
await page.locator('#SUBMIT').click();

console.log('✅ Helpdesk submitted successfully');


console.log('✅ Classification Type selected');

});