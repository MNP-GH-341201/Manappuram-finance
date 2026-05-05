import { chromium } from '@playwright/test';

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://uatapp.manappuram.net/purchase/Login.aspx');

  await page.getByPlaceholder('Username').fill('50292');
  await page.getByPlaceholder('Password').fill('soft1234');

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  
const loginBtn = page.getByRole('button', { name: /login|sign in/i });
await loginBtn.waitFor({ state: 'visible', timeout: 30000 });
await loginBtn.click();

  await page.waitForURL(/Index\/Index\.aspx/i, { timeout: 30000 });

  // ✅ creates loginState.json in project root
  await context.storageState({ path: 'loginState.json' });

  await browser.close();

  console.log('✅ global-setup completed, loginState.json created');
};
``