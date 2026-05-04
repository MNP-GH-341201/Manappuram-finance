// const { defineConfig } = require('@playwright/test');

// module.exports = defineConfig({
//   //globalSetup: require.resolve('./global-setup.js'),

//   testDir: './tests',
//   timeout: 60 * 1000,

//   expect: {
//     timeout: 5000,
//   },

//   fullyParallel: false,
//   workers: 1,

//   reporter: [['html', { open: 'never' }]],

//   projects: [
//     {
//       name: 'Firefox',
//       use: {
//         //storageState: 'loginState.json', // ✅ Use stored login state
//         browserName: 'firefox', 
//         workers: 1,  // ✅ MUST be firefox
//         channel: 'firefox',         // ✅ This makes it Edge
//         headless: false,
//         slowMo: 800,

//         // ✅ APPLICATION URLS
//         CUSTOMER_APP_URL: 'https://uatonpay.manappuram.com/hyperverge/#/login',
//         CGL_APP_URL: 'https://uatonpay.manappuram.com/cglvapt/index.html',

//         // ✅ CREDENTIALS
//         credentials: {
//           customerEmployeeId: '406653',
//           customerPassword: 'soft1234',

//           CGL_employeeId: '98118',
//           CGL_employeePassword: 'soft1234',
//         },
//       },
//     },
//   ],
// });


import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',

  // ✅ ABSOLUTE path to global-setup.js
  globalSetup: path.resolve(__dirname, 'global-setup.js'),

  use: {
    storageState: 'loginState.json',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  workers: 1,

  projects: [
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        channel: 'firefox',
      },
    },
  ],
}); 