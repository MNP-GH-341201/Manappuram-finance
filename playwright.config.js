const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['html', { open: 'never' }]],

  projects: [
    {
      name: 'microsoft (Installed)',
      use: {
        browserName: 'chromium',     // ✅ Use chromium engine
        channel: 'msedge',           // ✅ Correct channel for Edge
        headless: false,
        slowMo: 800,

        // ✅ Enable permissions
        permissions: ['camera', 'microphone'],

        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',     // ✅ auto-click Allow
            '--use-fake-device-for-media-stream'  // ✅ fake camera/mic
          ],
        },

        // ✅ Custom test config
        CUSTOMER_APP_URL: 'https://uatonpay.manappuram.com/hyperverge/#/login',
        CGL_APP_URL: 'https://uatonpay.manappuram.com/cglautomation/#/login',

        credentials: {
          customerEmployeeId: '406653',
          customerPassword: 'soft1234',
          CGL_employeeId: '98118',
          CGL_employeePassword: 'soft1234',
        },
      },
    },
  ],
});

// import { defineConfig } from '@playwright/test';
// import path from 'path';

// export default defineConfig({
//   globalSetup: './global-setup.js',
//   testDir: './tests',

//   // ✅ ABSOLUTE path to global-setup.js
//   globalSetup: path.resolve(__dirname, 'global-setup.js'),

//   use: {
//     storageState: 'loginState.json',
//     headless: false,
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//   },

//   workers: 1,

//   projects: [
//     {
//       name: 'firefox',
//       use: {
//         browserName: 'firefox',
//         channel: 'firefox',
//       },
//     },
//   ],
// }); 