const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    browserName: 'firefox',
    channel: 'firefox',
    headless: false,
  },
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
      },
    },
  ],
});
``