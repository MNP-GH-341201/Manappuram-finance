// const { defineConfig } = require('@playwright/test');

// module.exports = defineConfig({
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
//       name: 'Chrome (Installed)',
//       use: {
//         browserName: 'chromium',

//         // ✅ IMPORTANT: Run tests in installed Google Chrome
//         channel: 'chrome',

//         headless: false,
//         permissions: ['camera', 'microphone'],
//         slowMo: 800,

//         launchOptions: {
//           args: [
//             '--use-fake-device-for-media-stream',
//             '--use-file-for-fake-video-capture=C:/videos/fake_camera.y4m',
//           ],
//         },


//         // ✅ App URLs
//         CUSTOMER_APP_URL: 'https://uatonpay.manappuram.com/hyperverge/#/login',
//         CGL_APP_URL: 'https://uatonpay.manappuram.com/cglvapt/index.html',

//         // ✅ Credentials
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