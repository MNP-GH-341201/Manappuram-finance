const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,

  expect: {
    timeout: 5000,
  },

  fullyParallel: false,
  workers: 1,

  reporter: [['html', { open: 'never' }]],

  projects: [
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        channel: 'firefox',
        headless: false,

        // ✅ CUSTOM APP CONFIG (IMPORTANT)
        appUrl: 'https://uatonpay.manappuram.com/hyperverge/#/login',

        credentials: {
          employeeId: '406653',
          password: 'soft1234',
        },
      },
    },
  ],
});